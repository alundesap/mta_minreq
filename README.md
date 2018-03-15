# mta_minreq
Multi-Target Application demonstrating the Minimum Requirements for Startup.Focus technical validation.

```
xs create-service xsuaa default minreq-uaa -c ./xs-security.json
```

```
mta --build-target XSA --mtar target/mta_python_ex-xsa.mtar build
xs deploy target/mta_python_ex-xsa.mtar --use-namespaces

-or-

xs deploy . --use-namespaces --no-namespaces-for-services --no-start
```
