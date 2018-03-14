#!/bin/bash

runit=false

echo "param: $1"

if [ "$1" = "dryrun" ] ; then
    runit=false
else
    runit=true
fi

if [ "$runit" = true ] ; then
    echo "Actually running these commands."
else
    echo "Performing a dry run."
fi

function exec_or_dump() {

        xcmd=$1
        echo $xcmd
        if [ "$runit" = true ] ; then
            eval $xcmd
        fi

}

cmd='cp mta.yaml mtad.yaml'
exec_or_dump "$cmd"

cmd='sed -i -e "s/type: hdb/type: com.sap.xs.hdi/g" mtad.yaml'
exec_or_dump "$cmd"

cmd='sed -i -e "s/type: java/type: java.tomcat/g" mtad.yaml'
exec_or_dump "$cmd"

cmd='sed -i -e "s/type: html5/type: javascript.nodejs/g" mtad.yaml'
exec_or_dump "$cmd"

cmd='sed -i -e "s/type: nodejs/type: javascript.nodejs/g" mtad.yaml'
exec_or_dump "$cmd"

#https://help.sap.com/viewer/DRAFT/4505d0bdaf4948449b7f7379d24d0f0d/2.0.03/en-US/4050fee4c469498ebc31b10f2ae15ff2.html
#custom
#native
#python

echo ""
echo "Done."
