#!/bin/bash
curl -F 'client_id=639a0da1d3bd4962aed72ff34c19c394' \
    -F 'client_secret=$2' \
    -F 'grant_type=authorization_code' \
    -F 'redirect_uri=http://18.216.205.96:8080' \
    -F 'code=$1' \
    https://api.instagram.com/oauth/access_token
