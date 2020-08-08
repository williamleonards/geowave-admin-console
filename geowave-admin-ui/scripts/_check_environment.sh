#!/bin/bash -e

cd $(dirname $(dirname $0))  # Return to project root
################################################################################


MINIMUM_NODE_VERSION=7


if [ ! -d node_modules ]; then
	printf "It looks like your development environment is not set up.\n\nSet it up now?\n"
	read -p "(y/N) " -r

	if [[ ! "$REPLY" =~ ^[Yy] ]]; then
		printf '\n\e[31m%s\e[0m\n' "Exiting..."
		exit 1
	fi

	printf '=%.0s' {1..80}
	echo

	############################################################################

	echo -e "\nInstalling Node dependencies\n"

	if ! node -e "assert(process.version.slice(1).split('.')[0] >= $MINIMUM_NODE_VERSION)" 2>/dev/null; then
		printf '\e[31m%s\e[0m\n' "Node $MINIMUM_NODE_VERSION.0.0 or higher must be installed first"
		exit 1
	fi

    if ! hash yarn 2>/dev/null; then
        printf '\e[33m%s\e[0m\n\n' "Warning: yarn not installed; falling back to npm..."
        npm install
    else
        yarn install
    fi

	############################################################################

	echo
	printf '=%.0s' {1..80}
	echo

	############################################################################
fi

export PATH="$(pwd)/node_modules/.bin:$PATH"
