## Generating keys

To generate the server and client keys you need to know the hostname the server will be deployed on e.g. 
./genkey.sh . www.hostname.com pass

### create a combined server cert and ca cert.

`cat certs/server/server.crt certs/ca/ca.crt > ./certs/server/combined.pem`

## create secrets

```
oc create secret tls test-certs \
     --cert=./certs/server/combined.pem \
     --key=./certs/server/server.key \
     -n fs-mesh-qa
```
```
     oc create secret generic test-certs-cacert \
     --from-file=./certs/ca/ca.crt \
     -n fs-mesh-qa
```


## Setup

Create the projects

`oc apply -f ./projects.yaml`

Install the service mesh operator

`oc apply -f sm-operator-install.yaml`

Deploy the service mesh operator

`oc apply -f service-mesh.yml`

Deploy the workloads

`oc apply -f ./sleep-workload.yaml`

`oc apply -f ./sleep-workload-qa.yaml`

## Egress

Apply the egress network policy

`oc apply -f egressnetworkpolicy.yaml`

Deploy the istio objects

`oc apply -f 1-gateway.yml`

`oc apply -f 2-serviceEntry.yml`

`oc apply -f 3-virtualService.yml`

`oc apply -f 4-sidecar.yml`

Test connections

`export SOURCE_POD=$(oc get pod -l app=sleep -o jsonpath={.items..metadata.name} -n fs-mesh-dev )`

`oc exec "$SOURCE_POD" -n fs-mesh-dev -c sleep -- curl -sL -o /dev/null -D - http://dev-t-test.apps.cluster-fiserv-71cc.fiserv-71cc.example.opentlc.com`

`export SOURCE_POD2=$(oc get pod -l app=sleep-qa -o jsonpath={.items..metadata.name} -n fs-mesh-qa )`

`oc exec "$SOURCE_POD2" -n fs-mesh-qa -c sleep-qa -- curl -sL -o /dev/null -D - http://qa-t-test.apps.cluster-fiserv-71cc.fiserv-71cc.example.opentlc.com`

## Ingress


Determine hostname


Cluster url e.g. https://console-openshift-console.apps.cluster-6c24.6c24.example.opentlc.com/

route will be

http-mtls.apps.cluster-6c24.6c24.example.opentlc.com

Create certs

./genkey.sh ingress http-mtls.apps.cluster-6c24.6c24.example.opentlc.com pass

`cat ingress/certs/server/server.crt ingress/certs/ca/ca.crt > ./ingress/certs/server/combined.pem`

create secrets

```
oc create secret tls test-certs \
     --cert=./ingress/certs/server/combined.pem \
     --key=./ingress/certs/server/server.key \
     -n fs-mesh-qa
```
```
     oc create secret generic test-ca \
     --from-file=./ingress/certs/ca/ca.crt \
     -n fs-mesh-qa
```
     
Update ingress-gateway with correct hostname

Update client.js with correct hostname

Deploy sample http app
```
oc project fs-mesh-qa

oc apply -f ./deploy-app/is.yml
oc apply -f ./deploy-app/svc.yml
oc apply -f ./deploy-app/bc.yml
oc apply -f ./deploy-app/deployment.yml

oc start-build http-mtls-git
```


run `node client.js`

Expected output 

```
Hello, world!
```

## Test tls terminated on ingress

Update deployment to add env variable to switch to http app

oc set env deployment/http-mtls-git --overwrite enablehttp=true

Check the logs of the pod, you should see:

```

Starting http server, not requiring certs

```

Move the certs to the ingress gateway


```
oc create secret tls test-certs \
     --cert=./ingress/certs/server/combined.pem \
     --key=./ingress/certs/server/server.key \
     -n istio-system
```
```
     oc create secret generic test-certs-cacert \
     --from-file=./ingress/certs/ca/ca.crt \
     -n istio-system
```



Apply the ingress-gateway-edge.yml

`oc apply -f ingress-gateway-edge.yml`

Update the service to use port 8080

`oc apply -f ./deploy-app/svc-8080.yml`

Test with client

`node client.js`

Expected output 

```
Hello World!
```


oc create secret generic test-certs-cacert \
     --from-file=./ingress/certs/ca/ca.crt \
     -n istio-system