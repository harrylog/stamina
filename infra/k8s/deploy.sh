#!/bin/bash

# Stamina K8s Deployment Script
# Usage: ./deploy.sh [action]
# Actions:
#   deploy - Deploy all resources (default)
#   clean  - Remove all resources

set -e

NAMESPACE="stamina"
ACTION="${1:-deploy}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo_error "kubectl is not installed or not in PATH"
    exit 1
fi

# Check if k3s is running
if ! kubectl get nodes &> /dev/null; then
    echo_error "Cannot connect to Kubernetes cluster. Is k3s running?"
    exit 1
fi

case "$ACTION" in
    clean)
        echo_info "Cleaning up Stamina deployment..."
        kubectl delete namespace $NAMESPACE --ignore-not-found=true
        echo_info "Cleanup complete"
        exit 0
        ;;

    deploy)
        echo_info "Deploying Stamina microservices application..."

        # Deploy all resources
        kubectl apply -f 00-namespace.yaml
        kubectl apply -f 01-secrets.yaml
        kubectl apply -f 02-configmap.yaml
        kubectl apply -f 05-mongodb.yaml
        kubectl apply -f 10-rabbitmq.yaml
        kubectl apply -f 20-auth.yaml
        kubectl apply -f 30-users.yaml
        kubectl apply -f 40-learning.yaml
        kubectl apply -f 50-frontend.yaml
        kubectl apply -f 60-ingress.yaml

        echo_info "Waiting for pods to be ready..."
        kubectl wait --for=condition=ready pod --all -n $NAMESPACE --timeout=300s || true

        # Get cluster IP
        CLUSTER_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')

        # Get Traefik ingress port
        INGRESS_PORT=$(kubectl get service traefik -n kube-system -o jsonpath='{.spec.ports[?(@.name=="web")].nodePort}' 2>/dev/null || echo "80")

        # Check if stamina.local is in /etc/hosts
        if ! grep -q "stamina.local" /etc/hosts; then
            echo ""
            echo_warn "stamina.local not found in /etc/hosts"
            echo_info "Add the following line to /etc/hosts:"
            echo "    ${CLUSTER_IP} stamina.local"
            echo ""
            echo_info "Run this command:"
            echo "    echo '${CLUSTER_IP} stamina.local' | sudo tee -a /etc/hosts"
            echo ""
        fi

        echo ""
        echo_info "✓ Deployment complete!"
        echo ""
        echo_info "Access the application at: http://stamina.local:${INGRESS_PORT}"
        ;;

    *)
        echo_error "Unknown action: $ACTION"
        echo "Usage: $0 [deploy|clean]"
        exit 1
        ;;
esac

echo ""
echo_info "Useful commands:"
echo "  kubectl get pods -n $NAMESPACE           # View pods"
echo "  kubectl get svc -n $NAMESPACE            # View services"
echo "  kubectl logs -n $NAMESPACE <pod-name>    # View logs"
echo "  kubectl describe pod -n $NAMESPACE <pod> # Debug pod"
echo "  $0 clean                                  # Remove all resources"
