#!/bin/bash

echo "Generate SSL Private Key and Certificate."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout private.key -out primary.crt

echo "SSL Private Key and Certificate created and deployed."

echo "Create Instagram client config file for API authentication."
read -p "Client ID? " clientId
read -p "Client Secret? " clientSecret

instagramCredsPath=$(pwd)'/components/instagram/instagram.creds'

/bin/cat <<EOM >$instagramCredsPath
{
  "id":"$clientId",
  "secret":"$clientSecret"
}
EOM

echo "Instagram client config file created and deployed."

