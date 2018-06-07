# Homestead Release

[![Build Status][travis-image]][travis-url] [![dependency status][dep-image]][dep-url]

This repository contains the Homestead Release of the [ethereum.org](https://ethereum.org/) website.


![Screenshot](https://cloud.githubusercontent.com/assets/112898/15186824/f2c9ba56-1774-11e6-944b-8309c6b9114e.png "Screenshot")

## Prerequisite
* node
* npm

## Installation
Make sure you have node.js and npm installed.

Clone the repository and install the dependencies

```bash
git clone https://github.com/ethereum/ethereum-org
cd ethereum-org
npm install
npm install -g grunt-cli
```

## Build static resources

```bash
grunt
```

## Run

```bash
npm start
```

see the interface at http://localhost:3000

## Publish latest master to GitHub Pages

```
git checkout gh-pages
git merge master
grunt build
git commit -am "Updated build"
git push origin gh-pages
```

[travis-image]:https://travis-ci.org/ethereum/ethereum-org.svg
[travis-url]: https://travis-ci.org/ethereum/ethereum-org
[dep-image]: https://david-dm.org/ethereum/ethereum-org.svg
[dep-url]: https://david-dm.org/ethereum/ethereum-org
