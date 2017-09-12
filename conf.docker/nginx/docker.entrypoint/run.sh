#!/bin/bash

$(/sbin/ip route|awk '/default/ { print "declare -x HOST_IP="$3 }')

sed 's/hostip/'$HOST_IP'/' tg_server.conf > /etc/nginx/conf.d/tg_server.conf

exec $@
