# Troubleshooting: Stuck Terminating Pods & Namespaces

## The Problem

Pods and namespaces can get stuck in `Terminating` state indefinitely. This is a common issue, especially with:
- Storage systems (Longhorn, Rook, etc.)
- Operators with finalizers
- Pods with persistent volumes
- Namespace deletion cascading issues

## What We Fixed

```bash
# Before: Pods stuck for 4+ days
longhorn-test   engine-image-ei-51cc7b9c-8z954     1/1   Terminating   0   4d1h
longhorn-test   longhorn-manager-d57lt             2/2   Terminating   0   4d1h
# ... 8 pods stuck

# After: All cleaned up
No stuck pods found!
```

## Root Cause

1. **Pods stuck**: Usually due to finalizers or volume unmount issues
2. **Namespace stuck**: Can't delete because pods won't terminate
3. **Cascading failure**: Namespace waits for pods, pods wait for resources

## Solution Steps

### Step 1: Force Delete Pods

```bash
# Force delete all pods in a namespace
kubectl get pods -n NAMESPACE --no-headers | \
  awk '{print $1}' | \
  xargs -I {} kubectl delete pod {} -n NAMESPACE --grace-period=0 --force
```

**What this does:**
- `--grace-period=0`: Skip graceful shutdown (30s default)
- `--force`: Delete immediately, don't wait for confirmation
- **Warning**: Container may keep running briefly on node

### Step 2: Check if Namespace is Stuck

```bash
kubectl get namespace NAMESPACE
# If shows "Terminating" for a long time, proceed to Step 3
```

### Step 3: Remove Namespace Finalizers

```bash
# Remove finalizers to force namespace deletion
kubectl get namespace NAMESPACE -o json | \
  jq '.spec.finalizers = []' | \
  kubectl replace --raw /api/v1/namespaces/NAMESPACE/finalize -f -
```

**What this does:**
- Removes finalizers that prevent deletion
- Forces Kubernetes to delete the namespace immediately
- This is the "nuclear option" - use when nothing else works

## Alternative Methods

### Method 1: Delete Pod with Patch (Single Pod)

```bash
# Remove finalizers from a specific pod
kubectl patch pod POD_NAME -n NAMESPACE \
  -p '{"metadata":{"finalizers":[]}}' --type=merge

# Then force delete
kubectl delete pod POD_NAME -n NAMESPACE --grace-period=0 --force
```

### Method 2: Edit Pod Directly

```bash
kubectl edit pod POD_NAME -n NAMESPACE
# Remove the "finalizers" section, save and exit
```

### Method 3: Check for Blocking Resources

```bash
# See what's blocking namespace deletion
kubectl api-resources --verbs=list --namespaced -o name | \
  xargs -n 1 kubectl get --show-kind --ignore-not-found -n NAMESPACE

# Delete any remaining resources
kubectl delete all --all -n NAMESPACE
```

## Understanding Finalizers

Finalizers are like "pre-delete hooks" that prevent deletion until conditions are met.

### Common Finalizers

```yaml
metadata:
  finalizers:
  - kubernetes.io/pvc-protection           # PVC is in use
  - kubernetes.io/pv-protection            # PV is bound
  - foregroundDeletion                     # Wait for child resources
  - orphan                                 # Orphan child resources
  - longhorn.io/volume                     # Longhorn-specific
```

### Why They Exist

- **Data protection**: Prevent deleting volumes with data
- **Cleanup**: Run cleanup logic before deletion
- **Dependencies**: Ensure proper deletion order
- **Operators**: Custom resource lifecycle management

### When to Remove Them

**Safe to remove:**
- Test environments
- Known orphaned resources
- Stuck for hours/days with no progress

**Be cautious:**
- Production environments
- Active workloads
- When unsure of impact

## CKAD/CKA Exam Relevance

This scenario appears in **CKA (Certified Kubernetes Administrator)** exam:
- Cluster troubleshooting
- Pod lifecycle management
- Namespace cleanup
- Resource finalizers

### Exam Commands to Know

```bash
# Check pod status
kubectl get pods -n NAMESPACE -o wide

# Check pod events
kubectl describe pod POD_NAME -n NAMESPACE

# Check finalizers
kubectl get pod POD_NAME -n NAMESPACE -o jsonpath='{.metadata.finalizers}'

# Force delete
kubectl delete pod POD_NAME -n NAMESPACE --grace-period=0 --force

# Check namespace status
kubectl get namespace NAMESPACE -o json | jq '.status'

# Remove namespace finalizers
kubectl get namespace NAMESPACE -o json | \
  jq '.spec.finalizers = []' | \
  kubectl replace --raw /api/v1/namespaces/NAMESPACE/finalize -f -
```

## Prevention

### 1. Proper Resource Cleanup

```bash
# Delete in order: Workloads → Services → PVCs → PVs → Namespace
kubectl delete deployment,statefulset,daemonset --all -n NAMESPACE
kubectl delete service --all -n NAMESPACE
kubectl delete pvc --all -n NAMESPACE
kubectl delete namespace NAMESPACE
```

### 2. Set Proper Termination Grace Periods

```yaml
spec:
  terminationGracePeriodSeconds: 30  # Default, adjust as needed
```

### 3. Use Pre-Stop Hooks

```yaml
spec:
  containers:
  - name: app
    lifecycle:
      preStop:
        exec:
          command: ["/bin/sh", "-c", "cleanup.sh"]
```

### 4. Monitor for Stuck Resources

```bash
# Find pods stuck terminating for >5 minutes
kubectl get pods -A -o json | \
  jq -r '.items[] | select(.metadata.deletionTimestamp != null) |
    "\(.metadata.namespace) \(.metadata.name) \(.metadata.deletionTimestamp)"'
```

## Real-World Examples

### Example 1: Storage System Cleanup (Our Case)

```bash
# Longhorn pods stuck after uninstall
kubectl delete pods --all -n longhorn-test --grace-period=0 --force
kubectl get namespace longhorn-test -o json | jq '.spec.finalizers = []' | \
  kubectl replace --raw /api/v1/namespaces/longhorn-test/finalize -f -
```

### Example 2: PVC in Use

```bash
# PVC stuck because pod is still using it
# 1. Find pods using the PVC
kubectl get pods -n NAMESPACE -o json | \
  jq -r '.items[] | select(.spec.volumes[]?.persistentVolumeClaim.claimName=="PVC_NAME") | .metadata.name'

# 2. Delete pods first
kubectl delete pod POD_NAME -n NAMESPACE --force --grace-period=0

# 3. Delete PVC
kubectl delete pvc PVC_NAME -n NAMESPACE
```

### Example 3: Namespace with CRDs

```bash
# Namespace stuck due to Custom Resources
# 1. Find CRDs in namespace
kubectl api-resources --verbs=list --namespaced -o name | \
  xargs -n 1 kubectl get --show-kind --ignore-not-found -n NAMESPACE

# 2. Delete CRs
kubectl delete customresourcedefinition.apiextensions.k8s.io/NAME

# 3. Force namespace deletion
kubectl get namespace NAMESPACE -o json | jq '.spec.finalizers = []' | \
  kubectl replace --raw /api/v1/namespaces/NAMESPACE/finalize -f -
```

## Best Practices

1. **Always try graceful deletion first**
   ```bash
   kubectl delete pod POD_NAME -n NAMESPACE
   # Wait 5 minutes before forcing
   ```

2. **Check logs before force-deleting**
   ```bash
   kubectl logs POD_NAME -n NAMESPACE --previous
   kubectl describe pod POD_NAME -n NAMESPACE
   ```

3. **Understand the impact**
   - Force deletion doesn't kill the actual process immediately
   - Container may keep running on the node
   - Use `docker ps` or `crictl ps` on node to verify

4. **Document why you forced deletion**
   - Helps with troubleshooting future issues
   - Important for audit trails

## When to Escalate

Force deletion didn't work? Check:
1. Node health: `kubectl get nodes`
2. kubelet logs on the node
3. Container runtime issues (docker/containerd)
4. Disk space on node
5. Network issues

## Summary

**Quick Fix:**
```bash
# Force delete pods
kubectl delete pod POD_NAME -n NAMESPACE --grace-period=0 --force

# Force delete namespace
kubectl get namespace NAMESPACE -o json | \
  jq '.spec.finalizers = []' | \
  kubectl replace --raw /api/v1/namespaces/NAMESPACE/finalize -f -
```

This is a common production issue. Now you know how to handle it safely!
