# Stamina Kubernetes Deployment

Production-ready Kubernetes manifests for deploying the Stamina microservices application on k3s.

## Architecture

The application consists of 5 microservices:

- **Frontend**: Angular application (port 4200)
- **Auth Service**: NestJS authentication microservice (port 3001)
- **Users Service**: NestJS users microservice (port 3002)
- **Learning Service**: NestJS learning microservice (port 3003)
- **RabbitMQ**: Message broker (ports 5672, 15672)

All services communicate internally via ClusterIP services. External access is managed through Traefik ingress with path-based routing.

## Prerequisites

1. **k3s installed and running**
   ```bash
   kubectl get nodes
   ```

2. **Docker Hub images available** (already pushed)
   - hrylog/stamina:frontend-latest
   - hrylog/stamina:auth-latest
   - hrylog/stamina:users-latest
   - hrylog/stamina:learning-latest

3. **MongoDB Atlas** connection configured in secrets (already in `01-secrets.yaml`)

## Quick Start

### 1. Deploy with automated script

```bash
cd /home/harry/Downloads/stamina/infra/k8s
./deploy.sh deploy
```

The script will:
- Deploy all Kubernetes resources
- Wait for pods to be ready
- Show you the access URL
- Prompt to add stamina.local to /etc/hosts if needed

### 2. Add DNS entry

```bash
# Get your cluster IP
CLUSTER_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')

# Add to /etc/hosts
echo "${CLUSTER_IP} stamina.local" | sudo tee -a /etc/hosts
```

### 3. Access the application

```bash
# Get the Traefik ingress port
INGRESS_PORT=$(kubectl get service traefik -n kube-system -o jsonpath='{.spec.ports[?(@.name=="web")].nodePort}')

# Open in browser
echo "http://stamina.local:${INGRESS_PORT}"
```

## Manual Deployment

If you prefer to deploy manually:

```bash
cd /home/harry/Downloads/stamina/infra/k8s

# Deploy all resources
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-secrets.yaml
kubectl apply -f 02-configmap.yaml
kubectl apply -f 10-rabbitmq.yaml
kubectl apply -f 20-auth.yaml
kubectl apply -f 30-users.yaml
kubectl apply -f 40-learning.yaml
kubectl apply -f 50-frontend.yaml
kubectl apply -f 60-ingress.yaml

# Wait for all pods to be ready
kubectl wait --for=condition=ready pod --all -n stamina --timeout=300s

# Check status
kubectl get pods -n stamina
```

## Manifest Files

| File | Description |
|------|-------------|
| `00-namespace.yaml` | Creates the 'stamina' namespace |
| `01-secrets.yaml` | MongoDB URI, JWT secret, RabbitMQ URI |
| `02-configmap.yaml` | Port and host configuration |
| `10-rabbitmq.yaml` | RabbitMQ deployment and service |
| `20-auth.yaml` | Auth service deployment and service |
| `30-users.yaml` | Users service deployment and service |
| `40-learning.yaml` | Learning service deployment and service |
| `50-frontend.yaml` | Frontend deployment and service |
| `60-ingress.yaml` | Traefik ingress with path-based routing |

## Network Architecture

```
Browser → http://stamina.local:NodePort
              ↓
        Traefik Ingress
              ↓
      ┌───────┴──────────┬──────────┬──────────┐
      ↓                  ↓          ↓          ↓
/api/auth         /api/users  /api/courses    /
   ↓                  ↓          ↓          ↓
auth:3001        users:3002  learning:3003  frontend:4200
   ↓                  ↓          ↓
   └──────────────────┴──────────┘
              ↓
        rabbitmq:5672
```

### How Ingress Works

The Traefik ingress controller provides:

1. **Single Entry Point**: All traffic goes through stamina.local
2. **Path-Based Routing**: Routes requests to correct service
   - `/api/auth/*` → auth:3001
   - `/api/users/*` → users:3002
   - `/api/courses/*` → learning:3003
   - `/` → frontend:4200
3. **Prefix Stripping**: Removes `/api` prefix before forwarding
4. **No CORS Issues**: Same origin for all requests

### Frontend Configuration

The frontend uses relative paths in `environment.ts`:

```typescript
export const environment: Environment = {
  production: false,
  mockData: false,
  apis: {
    auth: '/api/auth',
    users: '/api/users',
    courses: '/api/courses',
    sections: '/api/sections',
    units: '/api/units',
    questions: '/api/questions',
  },
};
```

This configuration works for both development and production deployments.

## Common Operations

### View Status

```bash
# All pods
kubectl get pods -n stamina

# All services
kubectl get svc -n stamina

# Ingress
kubectl get ingress -n stamina

# Full status
kubectl get all -n stamina
```

### View Logs

```bash
# View logs
kubectl logs -n stamina <pod-name>

# Follow logs
kubectl logs -n stamina <pod-name> -f

# Logs from all pods of a deployment
kubectl logs -n stamina -l app=auth --tail=100

# Previous container logs (if crashed)
kubectl logs -n stamina <pod-name> --previous
```

### Update Secrets or ConfigMaps

```bash
# Edit secrets
kubectl edit secret stamina-secrets -n stamina

# Edit configmap
kubectl edit configmap stamina-config -n stamina

# After editing, restart affected deployments
kubectl rollout restart deployment -n stamina
```

### Restart Services

```bash
# Restart specific deployment
kubectl rollout restart deployment/auth -n stamina

# Restart all deployments
kubectl rollout restart deployment -n stamina

# Check rollout status
kubectl rollout status deployment/auth -n stamina
```

### Scale Services

```bash
# Scale frontend to 3 replicas
kubectl scale deployment frontend --replicas=3 -n stamina

# Scale all backend services to 2 replicas
kubectl scale deployment auth users learning --replicas=2 -n stamina
```

### Update Images

After pushing new images to Docker Hub:

```bash
# Option 1: Restart deployment (pulls latest if imagePullPolicy: Always)
kubectl rollout restart deployment/frontend -n stamina

# Option 2: Set new image explicitly
kubectl set image deployment/frontend frontend=hrylog/stamina:frontend-v2 -n stamina

# Watch rollout progress
kubectl rollout status deployment/frontend -n stamina
```

## Troubleshooting

### Pods Not Starting

**Check pod status:**
```bash
kubectl get pods -n stamina
```

**Common statuses:**
- `ImagePullBackOff` - Cannot pull image from Docker Hub
- `CrashLoopBackOff` - Application error, check logs
- `Pending` - Resource constraints or scheduling issues
- `Error` - Failed to start, check events

**View detailed information:**
```bash
kubectl describe pod -n stamina <pod-name>
```

**Check events:**
```bash
kubectl get events -n stamina --sort-by='.lastTimestamp'
```

### Application Not Accessible

**1. Check ingress:**
```bash
kubectl get ingress -n stamina
kubectl describe ingress stamina-ingress -n stamina
```

**2. Verify Traefik is running:**
```bash
kubectl get pods -n kube-system | grep traefik
```

**3. Check /etc/hosts:**
```bash
grep stamina.local /etc/hosts
```

**4. Test from inside cluster:**
```bash
kubectl run -it --rm debug --image=busybox --restart=Never -n stamina -- wget -O- http://frontend:4200
```

### Database Connection Issues

**Check MongoDB URI:**
```bash
kubectl get secret stamina-secrets -n stamina -o jsonpath='{.data.MONGODB_URI}' | base64 -d
```

**Test from auth pod:**
```bash
kubectl exec -it -n stamina $(kubectl get pod -n stamina -l app=auth -o jsonpath='{.items[0].metadata.name}') -- env | grep MONGODB_URI
```

**Check auth logs for connection errors:**
```bash
kubectl logs -n stamina -l app=auth --tail=50
```

### RabbitMQ Connection Issues

**Check RabbitMQ status:**
```bash
kubectl get pods -n stamina | grep rabbitmq
kubectl logs -n stamina -l app=rabbitmq --tail=50
```

**Test RabbitMQ connectivity:**
```bash
# From auth pod
kubectl exec -it -n stamina $(kubectl get pod -n stamina -l app=auth -o jsonpath='{.items[0].metadata.name}') -- env | grep RABBITMQ_URI
```

**Access RabbitMQ management UI:**
```bash
kubectl port-forward -n stamina svc/rabbitmq 15672:15672
# Open http://localhost:15672 (guest/guest)
```

### Memory/CPU Issues

**View resource usage:**
```bash
kubectl top pods -n stamina
kubectl top nodes
```

**Check resource limits:**
```bash
kubectl describe pod -n stamina <pod-name> | grep -A5 "Limits:"
```

**Adjust limits** in deployment files if needed, then reapply:
```bash
kubectl apply -f <deployment-file>.yaml
```

## Cleanup

**Remove all resources:**
```bash
./deploy.sh clean
```

**Or manually:**
```bash
kubectl delete namespace stamina
```

**Remove from /etc/hosts:**
```bash
sudo sed -i '/stamina.local/d' /etc/hosts
```

## Production Considerations

For production deployments, consider:

### 1. Security
- [ ] Use external secret management (Sealed Secrets, External Secrets Operator, Vault)
- [ ] Enable TLS/SSL with cert-manager
- [ ] Implement NetworkPolicies to restrict pod-to-pod communication
- [ ] Use non-root containers
- [ ] Regular security scanning of images

### 2. High Availability
- [ ] Increase replicas (minimum 2-3 per service)
- [ ] Use PodDisruptionBudgets
- [ ] Deploy across multiple nodes/zones
- [ ] Use RabbitMQ in cluster mode with persistence

### 3. Monitoring & Observability
- [ ] Deploy Prometheus for metrics
- [ ] Deploy Grafana for visualization
- [ ] Implement distributed tracing (Jaeger/Tempo)
- [ ] Centralized logging (ELK/Loki)
- [ ] Configure alerts for critical metrics

### 4. Resource Management
- [ ] Fine-tune resource requests/limits based on actual usage
- [ ] Implement Horizontal Pod Autoscaling (HPA)
- [ ] Consider Vertical Pod Autoscaling (VPA)
- [ ] Set up resource quotas per namespace

### 5. Persistence
- [ ] Add PersistentVolumes for RabbitMQ data
- [ ] Consider local MongoDB deployment with StatefulSet
- [ ] Implement backup strategy for databases
- [ ] Use StorageClasses for dynamic provisioning

### 6. CI/CD
- [ ] Automate image builds on commit
- [ ] Implement GitOps with ArgoCD or Flux
- [ ] Use semantic versioning for images (not :latest)
- [ ] Automated testing before deployment
- [ ] Canary or blue-green deployments

### 7. Performance
- [ ] Enable HTTP/2 in ingress
- [ ] Configure connection pooling
- [ ] Implement caching strategies (Redis)
- [ ] Use CDN for static assets
- [ ] Optimize database queries and indexes

### 8. Backup & Disaster Recovery
- [ ] Regular backups of MongoDB
- [ ] Backup Kubernetes manifests in Git
- [ ] Document recovery procedures
- [ ] Regular disaster recovery drills

## Support

For issues or questions, refer to the main project documentation.
