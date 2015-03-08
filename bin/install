#!/bin/sh

if [[ "$OSTYPE" == "linux-gnu" ]]; then
	add-apt-repository ppa:ethereum/ethereum && apt-get update && apt-get install go-ethereum
elif [[ "$OSTYPE" == "darwin"* ]]; then
	brew tap ethereum/ethereum && brew install go-ethereum
else
	echo "OS not supported"
fi