var fs = require('fs');

//get a reference to the uglify-js module
var UglifyJS = require('uglify-es');

var appClientFiles = {
    "services.js": fs.readFileSync('js/services.js', 'utf8'),
    "common.js": fs.readFileSync('js/common.js', 'utf8')
}

var options = {
    mangle: true
};

//get a reference to the minified version of file-1.js, file-2.js and file-3.js
var result = UglifyJS.minify(appClientFiles, options);

//view the output
//console.log(result);
console.log(result.code);

fs.writeFile("output.min.js", result.code, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("File was successfully saved.");
    }
});