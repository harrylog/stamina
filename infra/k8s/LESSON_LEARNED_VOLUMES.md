# Lesson Learned: Security Contexts and Writable Volumes

## The Problem We Hit

When we added security contexts with `runAsUser: 1000`, pods started crashing with:
```
Error EACCES: permission denied, rmdir '/usr/src/app/dist/apps/auth'
```

## Root Cause

1. Docker images run as **root by default** (UID 0)
2. All files in the image are **owned by root**
3. When we forced pods to run as **user 1000**, that user couldn't write to root-owned directories
4. NestJS dev mode (`--watch`) needs to write to `/usr/src/app/dist` and `/tmp`

## The Solution: emptyDir Volumes

We added `emptyDir` volumes for writable paths:

```yaml
spec:
  containers:
  - name: auth
    volumeMounts:
    - name: dist-cache
      mountPath: /usr/src/app/dist
    - name: tmp
      mountPath: /tmp
  volumes:
  - name: dist-cache
    emptyDir: {}
  - name: tmp
    emptyDir: {}
```

### What is emptyDir?

- **Temporary storage** created when pod starts
- **Empty directory** owned by the pod's user (1000 in our case)
- **Writable** by the non-root user
- **Deleted** when pod is removed (ephemeral)
- **Lives on node's disk** (fast, local storage)

### Why This Works

1. Kubernetes creates `/usr/src/app/dist` as an empty directory
2. Directory is owned by UID 1000 (our runAsUser)
3. NestJS can write compiled files there
4. Each pod gets its own isolated volume

## Alternative Solutions

### 1. Fix Docker Images (Best for Production)
Build images with proper non-root user:

```dockerfile
FROM node:20-alpine

# Create non-root user
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

WORKDIR /usr/src/app

# Copy files as root, then change ownership
COPY --chown=appuser:appuser . .

# Install deps as root (npm global)
RUN npm ci

# Switch to non-root user
USER appuser

CMD ["npm", "run", "start:auth:dev"]
```

### 2. readOnlyRootFilesystem (Advanced Security)
For maximum security, make entire filesystem read-only except specific mounts:

```yaml
securityContext:
  readOnlyRootFilesystem: true
volumeMounts:
- name: dist-cache
  mountPath: /usr/src/app/dist
- name: tmp
  mountPath: /tmp
- name: npm-cache
  mountPath: /home/node/.npm
```

### 3. initContainer to Fix Permissions (Workaround)
Use an init container to chown directories:

```yaml
initContainers:
- name: fix-permissions
  image: busybox
  command: ['sh', '-c', 'chown -R 1000:1000 /usr/src/app/dist']
  volumeMounts:
  - name: app-dir
    mountPath: /usr/src/app
```

## CKAD Exam Relevance

This scenario is **HIGHLY likely** in CKAD exam:

1. **Volume types**: You must know emptyDir, configMap, secret, persistentVolumeClaim
2. **Security contexts**: Common troubleshooting scenario
3. **Init containers**: Often used to fix permissions
4. **Debugging pods**: Know how to read logs, exec into pods, check permissions

### Exam Commands to Know

```bash
# Check pod security context
kubectl get pod <pod> -o jsonpath='{.spec.securityContext}'

# Check container security context
kubectl get pod <pod> -o jsonpath='{.spec.containers[0].securityContext}'

# Exec into pod and check permissions
kubectl exec <pod> -- id
kubectl exec <pod> -- ls -la /usr/src/app

# Check logs for permission errors
kubectl logs <pod>

# Describe pod to see events
kubectl describe pod <pod>
```

## emptyDir vs Other Volume Types

| Volume Type | Use Case | Persistence | Sharing |
|-------------|----------|-------------|---------|
| emptyDir | Temp scratch space, cache | Pod lifetime | Within pod |
| configMap | Config files (read-only) | Cluster-wide | Across pods |
| secret | Sensitive data (read-only) | Cluster-wide | Across pods |
| persistentVolumeClaim | Database data, uploads | Beyond pod | Depends on access mode |
| hostPath | Node-specific files | Node lifetime | All pods on node |

## Key Takeaways

1. **emptyDir is your friend** for non-root containers that need write access
2. **Always test security contexts** in dev before production
3. **Permission denied errors** usually mean UID mismatch
4. **Volumes solve permission problems** better than fixing images (for k8s learning)
5. **Production images should be built with non-root user** from the start

## What We Learned About K8s Security

- **Defense in depth**: Multiple layers (ServiceAccount, RBAC, SecurityContext, NetworkPolicy)
- **Principle of least privilege**: Only grant what's needed
- **Security contexts cascade**: Pod-level → Container-level
- **Volumes are not just for persistence**: Also for security and isolation
- **Real-world challenges**: Theory vs practice (images not designed for non-root)

This is exactly the kind of debugging you'll do in production and in CKAD exam!
