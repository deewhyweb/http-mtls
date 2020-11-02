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