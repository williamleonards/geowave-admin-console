#!/bin/bash -e

STACK_NAME=admin-ui-devserver
ALLOWED_IP=$(curl -fs httpbin.org/ip | jq .origin -r)

cd "$(dirname $0)"


printf '\033[32m%s\033[0m\n' "Creating CloudFormation stack '$STACK_NAME'..."

aws cloudformation create-stack \
	--stack-name "$STACK_NAME" \
	--template-body "$(./infrastructure.py)" \
	--parameters "ParameterKey=allowedIp,ParameterValue=$ALLOWED_IP"

echo 'Waiting for stack completion...'

aws cloudformation wait stack-create-complete --stack-name "$STACK_NAME"

DNSNAME=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs[?OutputKey=='instance'].OutputValue" --output text)

printf '\033[32m%s\033[0m %s\n' "OK" "$DNSNAME"
