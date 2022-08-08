#!/bin/bash
set -e

WORKING_DIR=$(pwd)

function install_dependencies {
    echo "Installing dependencies of $1"
    cd $1
    npm install
    cd $WORKING_DIR
}

function run_tests {
    echo "Testing $1"
    cd $1
    npm run test
    cd $WORKING_DIR
}

services=$@

for service in $services; do
  install_dependencies $service
done

for service in $services; do
  run_tests $service
done
