#!/bin/bash
set -e

WORKING_DIR=$(pwd)

function install_dependencies {
    echo "Installing dependencies of $1"
    cd $1
    npm install
    cd $WORKING_DIR
}

function deploy_cron {
    echo "Deploying $1"
    cd $1
    npx --yes wrangler publish
    cd $WORKING_DIR
}

services=$@

for cron in $services; do
  install_dependencies $cron
done

for cron in $services; do
  deploy_cron $cron
done
