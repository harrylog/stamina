# Stamina K8s Learning Roadmap

## Current Status: Phase 1 - Raw K8s Security & RBAC

### Phase 1: Raw K8s - Adding Missing Production Concepts

#### Week 1-2: Security & RBAC (Current Focus)
- [ ] ServiceAccounts for all services
- [ ] Roles & RoleBindings
- [ ] NetworkPolicies
- [ ] Security contexts (runAsNonRoot, readOnlyRootFilesystem)

#### Week 3-4: Advanced Workloads
- [ ] CronJob for DB backups
- [ ] HorizontalPodAutoscaler (HPA) for services
- [ ] PodDisruptionBudgets
- [ ] Jobs for DB migrations

#### Week 5: Observability & Multi-container Patterns
- [ ] Logging sidecar containers
- [ ] Init containers for migrations
- [ ] Health check improvements

### Phase 2: Helm (4-6 weeks)
- Convert k8s manifests to Helm charts
- Learn templating, values, conditionals
- Create umbrella chart
- Use dependencies

### Phase 3: ArgoCD (2-3 weeks)
- GitOps principles
- Auto-sync Helm charts
- Multi-environment management

### Phase 4: AWS EKS (3-4 weeks)
- Deploy to real cloud
- AWS-specific integrations
- EBS, EFS, ALB ingress controller

### Phase 5: Terraform (3-4 weeks)
- Infrastructure as Code
- Manage EKS cluster with Terraform
- Complete cloud automation

## CKAD Exam Coverage

Your current + planned work covers all CKAD domains:
- 13% Application Design and Build ✓
- 20% Application Deployment ✓
- 10% Application Observability and Maintenance ✓
- 25% Application Environment, Configuration and Security ✓
- 20% Services & Networking ✓
- 12% Storage ✓

## Resources Implemented

### Current K8s Resources
- Namespace
- ConfigMaps & Secrets
- Deployments (auth, users, learning, frontend)
- StatefulSet (mongodb)
- Services (ClusterIP)
- Ingress with Traefik middleware
- Liveness & Readiness probes
- Resource requests/limits
- PersistentVolumeClaims

### To Be Implemented
- ServiceAccounts
- RBAC (Roles, RoleBindings)
- NetworkPolicies
- Security contexts
- HPA
- PodDisruptionBudgets
- CronJobs
- Jobs
- Init containers
- Sidecar containers
