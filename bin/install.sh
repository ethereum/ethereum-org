#!/bin/bash

# init constants
HOMEBREW_PREFIX=/usr/local
OSX_REQUIERED_VERSION="10.6.0"

# init vars
declare -a DEPENDENCIES

OSX_VERSION=""
os=""

isBrew=false
isOsVersion=false

# setup colors
red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`
blue=`tput setaf 4`
magenta=`tput setaf 5`
cyan=`tput setaf 6`
white=`tput setaf 7`
lime=`tput setaf 190`
pblue=`tput setaf 153`
b=`tput bold`
u=`tput sgr 0 1`
ul=`tput smul`
xl=`tput rmul`
stou=`tput smso`
xtou=`tput rmso`
dim=`tput dim`
reverse=`tput rev`
reset=`tput sgr0`


function heading()
{
	echo "${blue}==>${reset}${b} $1${reset}"
}

function info()
{
  echo "${blue}==>${reset} $1"
}

function success()
{
	echo "${green}==> $1${reset}"
}

function check()
{
  echo "${green}${bold}     ✓${reset} $1${reset}"
}

function uncheck()
{
  echo "${red}${bold}     ✘${reset} $1${reset}"
}

function smallSuccess()
{
  echo "${green}==>${reset} $1"
}

function successHeading()
{
  echo "${green}==> ${b}$1${reset}"
}

function error()
{
	echo "${red} ❗ ${b} $1${reset}"
}

function smallError()
{
  echo "${red}==>${reset} $1"
}

function green()
{
  echo "${green}$1${reset}"
}

function cyan()
{
  echo "${cyan}$1${reset}"
}

function red()
{
  echo "${red}$1${reset}"
}

function exe() {
  echo "\$ $@"; "$@"
}

function brew()
{
  exe $HOMEBREW_PREFIX/bin/brew $@
}

function detectOS()
{
  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    os="linux"
    run_linux_install
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    os="osx"
    run_osx_install
  else
    os="win"
    error "Error: OS not supported."
    abortInstall
  fi
}

function ask_about_brew()
{
  error "In order to install ethereum you need Homebrew."
  smallError "To find out more about Homebrew visit ${blue}http://brew.sh/${reset}"
  echo

  while :
  do
      read -p "${blue}==>${reset} Do you want to install Homebrew? (y/n) " imp
      case $imp in
          [yY] ) echo ""; break ;;
          * ) echo; smallError "To install Homebrew run the following command:"; echo; red '    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"'; echo; abortInstall ;;
      esac
  done
}

function run_osx_install()
{
  macos_version

  heading "Checking dependencies"

  find_brew

  if [[ $isBrew == "true" ]];
    then :
  else
    ask_about_brew
  fi

  heading "Adding ethereum repository"
  brew tap ethereum/ethereum

  heading "Updating brew"
  # brew update

  heading "Installing geth"
  # brew install ethereum/ethereum/ethereum --devel --successful

  finish
}

function macos_version()
{
  declare reqVersion -a
  declare localVersion -a

  OSX_VERSION=`/usr/bin/sw_vers -productVersion`
  IFS='.' read -a localVersion <<< "$OSX_VERSION"
  IFS='.' read -a reqVersion <<< "$OSX_REQUIERED_VERSION"

  if (( ${reqVersion[0]} <= ${localVersion[0]} )) && (( ${reqVersion[1]} <= ${localVersion[1]} ))
  then
    success "OS X Version ok"
  else
    error "OS X version not supported"
  fi
}

function find_brew()
{
  if [[ -f /usr/local/bin/brew ]];
  # if [[ ! -f /usr/local/bin/brew ]];
  then
    check "Homebrew"
    isBrew=true
  else
    uncheck "Homebrew"
    isBrew=false
  fi
}

function abortInstall()
{
  error "Aborting install"
  echo
  exit 0
}

function finish()
{
  echo
  successHeading "Installation successful!"
  heading "Next steps"
  info "Run ${cyan}\`geth help\`${reset} to get started.${reset}"
  echo
  exit 0
}

tput clear

echo
echo "    ${b}${green}WELCOME TO THE FRONTIER${reset}"
echo
echo
heading "Before installing Geth (ethereum CLI) read this:"
echo "Frontier is a curated ${red}testnet${reset}, it is not the 'main release' of Ethereum, but rather an ${red}initial beta prerelease${reset}"
echo "We fully expect ${red}instability and consensus flaws${reset} in the client, some of which may be exploitable"
echo "As curators, we fully reserve the right to ignore blocks at our discretion"
echo "As curators, from a final block that we solely determine, we will preserve all non-contract (i.e. code-less) account balances above the value of 1 ETH into the Homestead Genesis block"
echo ""

while :
do
    read -p "I understand, I want to install Geth (ethereum CLI) (y/n) " imp
    case $imp in
        [yY] ) echo ""; break ;;
        * ) abortInstall ;;
    esac
done

heading "Preparing installer"

detectOS;
