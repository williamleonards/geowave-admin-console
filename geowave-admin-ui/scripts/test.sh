#!/bin/bash -e

. $(dirname $0)/_check_environment.sh
################################################################################


echo "Running linter..."
./scripts/lint.sh


echo -e "Running type checks...\n"
tsc --noEmit --pretty -p test/tsconfig.json


echo -e "\nRunning unit tests...\n"
jest "$@"
