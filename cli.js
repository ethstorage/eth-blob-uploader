#!/usr/bin/env node
const {program} = require('commander');
program.version(require('./package.json').version);
const {uploadToAddress} = require("./index");
const color = require('colors-cli/safe')
const error = color.red;

program
    .command('upload [rpc] [privateKey] [file] [to]', { isDefault: true})
    .option('-r, --rpc <rpc>', 'provider url')
    .option('-p, --privateKey <privateKey>', 'private key')
    .option('-f, --file <file>', 'upload file path or name')
    .option('-t, --to <to>', 'to address')
    .option('-d, --data [data]', 'call data')
    .option('-c, --count [count]', 'blob count')
    .option('-n, --nonce [nonce]', 'transaction nonce')
    .option('-g, --gasPrice [gasPrice]', 'transaction gas price')
    .option('-b, --blobPrice [blobPrice]', 'blob gas price')
    .action((rpc, privateKey, file, to, opts) => {
        rpc = rpc ?? opts.rpc;
        privateKey = privateKey ?? opts.privateKey;
        file = file ?? opts.file;
        to = to ?? opts.to;
        if (!rpc) {
            console.log(error("Invalid RPC"));
            return;
        }
        if (!privateKey) {
            console.log(error("Invalid private key"));
            return;
        }
        if (!file) {
            console.log(error("Invalid file path"));
            return;
        }
        if (!to) {
            console.log(error("Invalid to address"));
            return;
        }
        uploadToAddress(rpc, privateKey, file, to, opts.data, opts.count, opts.nonce, opts.gasPrice, opts.blobPrice);
    });

program.parse(process.argv);


