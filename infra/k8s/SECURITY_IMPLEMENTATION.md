# Security & RBAC Implementation Guide

## What We Just Implemented

### 1. ServiceAccounts (`03-serviceaccounts.yaml`)
Created dedicated ServiceAccounts for each microservice:
- `auth-sa` for auth service
- `users-sa` for users service
- `learning-sa` for learning service
- `frontend-sa` for frontend service

**Why**: Separate identities for each service enables better auditing and follows principle of least privilege.

**CKAD Concept**: Every pod runs with a ServiceAccount. Default is "default" SA, but production apps should use custom ones.

### 2. RBAC (`04-rbac.yaml`)
Created example Roles and RoleBindings showing how to grant k8s API permissions.

**Current State**: Our services don't need k8s API access, so no RoleBindings are active. The file shows examples for future use.

**CKAD Concept**:
- Role = permissions (what actions on which resources)
- RoleBinding = assigns role to subjects (users/groups/ServiceAccounts)

### 3. Security Contexts (Updated all deployment files)
Added **two levels** of security contexts:

#### Pod-level (applies to all containers in pod):
```yaml
securityContext:
  runAsNonRoot: true      # Container must run as non-root user
  runAsUser: 1000         # Specific UID
  runAsGroup: 1000        # Specific GID
  fsGroup: 1000           # Group for mounted volumes
```

#### Container-level:
```yaml
securityContext:
  allowPrivilegeEscalation: false  # Prevent gaining more privileges
  capabilities:
    drop:
      - ALL                          # Drop all Linux capabilities
  # readOnlyRootFilesystem: true   # Would make filesystem read-only
```

**Applied to**:
- Auth, Users, Learning, Frontend (UID 1000)
- MongoDB, RabbitMQ (UID 999 - their default)

**CKAD Concept**: Security contexts are crucial for CKS (Certified Kubernetes Security) and appear in CKAD.

### 4. NetworkPolicies (`65-network-policies.yaml`)
Implemented zero-trust networking:

1. **Default Deny All Ingress**: No pod can receive traffic unless explicitly allowed
2. **Allow Ingress to Services**: Permit traffic from Ingress controller to all API services
3. **Allow Access to MongoDB**: Only auth, users, learning can connect to MongoDB
4. **Allow Access to RabbitMQ**: Only auth, users, learning can connect to RabbitMQ

**CKAD Concept**: NetworkPolicies are pod-level firewalls. They're additive (union of all policies).

## How to Apply

```bash
# Apply in order (numbers in filenames ensure correct order)
kubectl apply -f infra/k8s/

# Or specifically for new files:
kubectl apply -f infra/k8s/03-serviceaccounts.yaml
kubectl apply -f infra/k8s/04-rbac.yaml
kubectl apply -f infra/k8s/65-network-policies.yaml

# Then restart deployments to pick up security contexts
kubectl rollout restart deployment -n stamina auth
kubectl rollout restart deployment -n stamina users
kubectl rollout restart deployment -n stamina learning
kubectl rollout restart deployment -n stamina frontend
kubectl rollout restart deployment -n stamina rabbitmq
kubectl rollout restart statefulset -n stamina mongodb
```

## How to Verify

### Check ServiceAccounts
```bash
kubectl get sa -n stamina
# Should show: auth-sa, users-sa, learning-sa, frontend-sa

# Verify pod is using correct SA
kubectl get pod -n stamina <pod-name> -o jsonpath='{.spec.serviceAccountName}'
```

### Check Security Contexts
```bash
# Check pod security context
kubectl get pod -n stamina <pod-name> -o jsonpath='{.spec.securityContext}'

# Check container security context
kubectl get pod -n stamina <pod-name> -o jsonpath='{.spec.containers[0].securityContext}'

# Verify it's running as correct user
kubectl exec -n stamina <pod-name> -- id
# Should show uid=1000 (or 999 for MongoDB/RabbitMQ)
```

### Check NetworkPolicies
```bash
# List all NetworkPolicies
kubectl get networkpolicies -n stamina

# Describe a specific policy
kubectl describe networkpolicy -n stamina allow-to-mongodb

# Test connectivity from a test pod
kubectl run test-pod -n stamina --rm -it --image=busybox -- sh
# Inside the pod:
wget -O- http://mongodb:27017  # Should FAIL (test pod not allowed)
exit

# Test from an auth pod (should work)
kubectl exec -n stamina deployment/auth -- curl mongodb:27017
```

### Check RBAC
```bash
# Check if a ServiceAccount has permission
kubectl auth can-i get configmaps --as=system:serviceaccount:stamina:auth-sa -n stamina

# Should return 'no' because we haven't bound any roles
```

## Common Issues & Troubleshooting

### Issue: Pods crash with "cannot run as root"
**Cause**: Your container image runs as root by default
**Fix**: Build image with non-root user, or adjust runAsUser to match image

### Issue: Permission denied errors in containers
**Cause**: File permissions don't match runAsUser/fsGroup
**Fix**: Adjust UIDs or fix file permissions in image

### Issue: Services can't communicate after NetworkPolicies
**Cause**: Missing NetworkPolicy to allow the traffic
**Fix**: Add appropriate ingress policy for the target pod

### Issue: DNS resolution fails
**Cause**: Egress policies blocking DNS (port 53 to kube-system)
**Fix**: Add egress policy allowing DNS:
```yaml
egress:
- to:
  - namespaceSelector:
      matchLabels:
        name: kube-system
  ports:
  - protocol: UDP
    port: 53
```

## CKAD Exam Tips

1. **ServiceAccounts**: Know how to create and assign to pods
   ```bash
   kubectl create sa my-sa
   kubectl set serviceaccount deployment my-deployment my-sa
   ```

2. **Security Contexts**: Remember the difference between pod-level and container-level
   - Pod-level: runAsUser, runAsGroup, fsGroup
   - Container-level: capabilities, allowPrivilegeEscalation, readOnlyRootFilesystem

3. **NetworkPolicies**: Practice these common patterns:
   - Default deny all
   - Allow from specific namespace
   - Allow on specific port
   - Allow egress to DNS

4. **Quick Commands**:
   ```bash
   # Create ServiceAccount
   kubectl create sa mysa

   # Test RBAC
   kubectl auth can-i create pods --as=system:serviceaccount:default:mysa

   # Apply NetworkPolicy from YAML
   kubectl apply -f netpol.yaml

   # Check which NetworkPolicies affect a pod
   kubectl get networkpolicy -n namespace -o wide
   ```

## What's Next?

With Security & RBAC complete, you're ready for:
1. **Week 3-4**: HorizontalPodAutoscaler, CronJobs, Jobs, PodDisruptionBudgets
2. **Week 5**: Init containers, Sidecar patterns, Advanced observability

You now have a production-grade security baseline!
