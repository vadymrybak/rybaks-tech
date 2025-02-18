#!/bin/bash
echo "First arg: $1"

export KUBECONFIG=~/.kube/config-vm
export DEPLOY_VERSION=$1
echo $DEPLOY_VERSION

kubectl config get-contexts


docker build --platform linux/amd64 -t rybaks.cr.cloud.ru/rybaks-tech:$1  . && \
docker push rybaks.cr.cloud.ru/rybaks-tech:$1 && \
envsubst < deploy.yaml | kubectl apply -f -

echo "Job done for version:"
echo $DEPLOY_VERSION
