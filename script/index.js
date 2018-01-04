import { foo, bar } from './module' 

require("./lib/unpkg")(function(moment){
    
    
    console.log("index.js",foo,bar);
    console.log("now",moment().format());
    
    
}).then(function(result){
    console.log("index.js result",result);
}).catch(function(e){
    console.error(e);
});