require("./lib/unpkg")(function(moment){
    return `${moment(0).format()}`;
}).then(function(result){
    console.log("EXIT result",result);
});