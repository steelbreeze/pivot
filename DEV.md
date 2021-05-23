# Development guide
Once you have cloned the repository, update npm dependencies to install required tooling by entering:
```shell
npm update
```
## Build
To build, enter:
```shell
npm run build
```
The output will be under the folder ./lib/node with ./lib/node/index.js as the main entry point.

To run the example, enter:
```
node lib/node/example
```
## Package
To package for the web, enter:
```shell
npm run package
```
The output will be in the folder ./lib/web with ./lib/web/pivot.js as the file to include in the ```<script>``` tag.
