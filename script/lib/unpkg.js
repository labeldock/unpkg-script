var axios     = require("axios");
var Bluebird  = require("bluebird");
var fs  = require("fs");
var writeFile = Bluebird.promisify(fs.writeFile);
var readFile  = Bluebird.promisify(fs.readFile);
var path      = require('path');
var filePath  = function(relativePath){ return path.resolve(__dirname,relativePath); };

var functionParamNames = function getArgs(func) {
    var args = func.toString().match(/function[^\(]*?\(([^)]*)\)|([^\)\s]*)[^\=\{]*?\=\>/)[1];
    if(args.indexOf("(") === 0){
        return args.substr(1);
    }
    return args.split(',').map(function(arg) {
        return arg.replace(/\/\*.*\*\//, '').trim();}).filter(function(arg) {
            return arg;
        }
    );
}

var unpkg = function(runFn){
    return Promise.all(functionParamNames(runFn).map(function(pkgname){
        return readFile(filePath(`./unpkgmodules/${pkgname}.js`),"utf-8")
        .catch(e=>{
            var unpkgUrl = "https://unpkg.com/"+pkgname;
            console.log(`GET ${unpkgUrl}`);
            return axios.get(unpkgUrl)
            .then(resp=>{
                return writeFile(filePath(`./unpkgmodules/${pkgname}.js`),resp.data)
                .then(function(){
                    return resp.data;
                })
            })
        })
        .then(function(){
            return require(filePath(`unpkgmodules/${pkgname}`));;
        });
    })).then(function(args){
        return runFn.apply(runFn,args);
    });
};

module.exports = unpkg;

console.log("UNPKG MOUDEL START");