require("./lib/unpkg")(function(moment){
    return `${moment().format()}`;
}).then(function(result){
    console.log("EXIT result",result);
});