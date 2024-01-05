#!/usr/bin/env node
const args = require('minimist')(
  process.argv.slice(2),
  {
    string: ['_', 'rpc', 'privateKey', 'file', 'to', 'data', 'count']
  }
);

const { uploadToAddress } = require("./index");
const color = require('colors-cli/safe')
const error = color.red;

if (!args.rpc) {
    console.log(error("Invalid RPC"));
    return;
}
if (!args.privateKey) {
    console.log(error("Invalid private key"));
    return;
}
if (!args.file) {
    console.log(error("Invalid file path"));
    return;
}
if (!args.to) {
    console.log(error("Invalid to address"));
    return;
}
uploadToAddress(args.rpc, args.privateKey, args.file, args.to, args.data, args.count);
