./genkey.sh
rm ./certs/server/combined.pem
cat certs/server/server.crt certs/ca/ca.crt > ./certs/server/combined.pem
oc create secret tls test-certs \
     --cert=./certs/server/combined.pem \
     --key=./certs/server/server.key \
     -n istio-system

     oc create secret generic test-ca \
     --from-file=./certs/ca/ca.crt \
     -n istio-system

     


oc -n istio-system patch --type=json deploy istio-egressgateway -p "$(cat gateway-patch.json)"


oc create secret tls test-certs \
     --cert=./certs/server/combined.pem \
     --key=./certs/server/server.key \
     -n dev-mesh

     oc create secret generic test-ca \
     --from-file=./certs/ca/ca.crt \
     -n dev-mesh

     


oc -n dev-mesh patch --type=json deploy istio-egressgateway -p "$(cat gateway-patch.json)"


export SOURCE_POD3=$(oc get pod -l app=sleep -o jsonpath={.items..metadata.name} -n dev-project )

oc exec "$SOURCE_POD3" -n dev-project -c sleep -- curl -sL -o /dev/null -D - http://t-test.apps.cluster-fiserv-71cc.fiserv-71cc.example.opentlc.com


export SOURCE_POD=$(oc get pod -l app=sleep -o jsonpath={.items..metadata.name} -n fs-mesh-dev )

oc exec "$SOURCE_POD" -n fs-mesh-dev -c sleep -- curl -sL -o /dev/null -D - http://t-test.apps.cluster-fiserv-71cc.fiserv-71cc.example.opentlc.com