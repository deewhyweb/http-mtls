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
     -n istio-system
```
```
     oc create secret generic test-ca \
     --from-file=./certs/ca/ca.crt \
     -n istio-system
```
Check gateway-patch.json to ensure correct secret names.  

Patch the istio-egressgateway with:

`oc -n istio-system patch --type=json deploy istio-egressgateway -p "$(cat gateway-patch.json)"`

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

Apply the egress network policy

`oc apply -f egressnetworkpolicy.yaml`

Deploy the istio objects

`oc apply -f 1-gateway.yml`

`oc apply -f 2-serviceEntry.yml`

`oc apply -f 2-virtualService.yml`

`oc apply -f 4-sidecar.yml`

Test connections

`export SOURCE_POD=$(oc get pod -l app=sleep -o jsonpath={.items..metadata.name} -n fs-mesh-dev )`

`oc exec "$SOURCE_POD" -n fs-mesh-dev -c sleep -- curl -sL -o /dev/null -D - http://dev-t-test.apps.cluster-fiserv-71cc.fiserv-71cc.example.opentlc.com`

`export SOURCE_POD2=$(oc get pod -l app=sleep-qa -o jsonpath={.items..metadata.name} -n fs-mesh-qa )`

`oc exec "$SOURCE_POD2" -n fs-mesh-qa -c sleep-qa -- curl -sL -o /dev/null -D - http://qa-t-test.apps.cluster-fiserv-71cc.fiserv-71cc.example.opentlc.com`