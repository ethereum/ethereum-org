#!/bin/sh

# First we detect the os
if [[ "$OSTYPE" == "linux-gnu" ]]; then
  # If it's linux we add ethereum ppa repository, update it and install ethereum
  add-apt-repository ppa:ethereum/ethereum && apt-get update && apt-get install go-ethereum
elif [[ "$OSTYPE" == "darwin"* ]]; then
  # If it's OS X we add ethereum to brew and install it
  brew tap ethereum/ethereum && brew install go-ethereum
else
  # If the OS is not supported we display the error and exit
  echo "OS not supported"
fi