# rybaks-tech

start:
 export KUBECONFIG=~/.kube/config-vm
 kubectl config get-contexts

docker build --platform linux/amd64 -t rybaks.cr.cloud.ru/rybaks-tech:1.0.0  .
docker push rybaks.cr.cloud.ru/rybaks-tech:1.0.0 