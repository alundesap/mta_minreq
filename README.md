# mta_minreq
Multi-Target Application demonstrating the Minimum Requirements for Startup.Focus technical validation.

```
xs create-service xsuaa default minreq-uaa -c ./xs-security.json
```

XS-A Deploys
```
xs create-service xsuaa default minreq-uaa -c ./xs-security.json
mkdir -p target
mta --build-target XSA --mtar target/mta_minreq-xsa.mtar build
xs deploy target/mta_minreq-xsa.mtar --use-namespaces

-or-

xs deploy . --use-namespaces --no-namespaces-for-services --no-start
```

CF Deploys
```
npm config set @sap:registry "https://npm.sap.com/"
npm config set registry "https://registry.npmjs.org/"
npm config set strict-ssl true

cf create-service xsuaa application minreq-uaa -c ./xs-security.json
mkdir -p target
mta --build-target CF --mtar target/mta_minreq-cf.mtar build
cf deploy target/mta_minreq-cf.mtar --use-namespaces --no-namespaces-for-services

```
