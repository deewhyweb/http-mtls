cat certs/server/server.crt certs/ca/ca.crt > ./certs/server/combined.pem
oc create secret tls test-certs \
     --cert=./certs/server/combined.pem \
     --key=./certs/server/server.key \
     -n outside-mesh

     oc create secret generic test-ca \
     --from-file=./certs/ca/ca.crt \
     -n outside-mesh

     