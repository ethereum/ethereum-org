# Homestead Release

[![Build Status][travis-image]][travis-url] [![dependency status][dep-image]][dep-url]

This repository contains the Homestead Release of the [ethereum.org](https://ethereum.org/) website.

![Screenshot](https://raw.githubusercontent.com/alexvandesande/ethereum-org/fe2c601a562f6034600bc7644daa82a2c9e449d4/public/images/screenshot.png "Screenshot")

## Prerequisite
* node
* npm

## Installation
Make sure you have node.js and npm installed.

Clone the repository and install the dependencies

```bash
git clone https://github.com/ethereum/frontier-release
cd frontier-release
npm install
npm install -g grunt-cli
```

##Build static resources

```bash
grunt
```

##Run

```bash
npm start
```

see the interface at http://localhost:3000

[travis-image]:https://travis-ci.org/ethereum/ethereum-org.svg
[travis-url]: https://travis-ci.org/ethereum/ethereum-org
[dep-image]: https://david-dm.org/ethereum/ethereum-org.svg
[dep-url]: https://david-dm.org/ethereum/ethereum-org
