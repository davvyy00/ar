var fs = require('fs');

var JavaScriptObfuscator = require('javascript-obfuscator');

var common = fs.readFileSync('js/common.js', 'utf8');
var services = fs.readFileSync('js/services.js', 'utf8');


var options = {
	compact: true,
	controlFlowFlattening: true,
	controlFlowFlatteningThreshold: 1,
	deadCodeInjection: true,
	deadCodeInjectionThreshold: 1,
	debugProtection: true,
	debugProtectionInterval: true,
	disableConsoleOutput: true,
	log: false,
	mangle: false,
	renameGlobals: false,
	rotateStringArray: true,
	selfDefending: true,
	stringArray: true,
	stringArrayEncoding: ['rc4'],
	stringArrayThreshold: 1,
	unicodeEscapeSequence: false
};

//get a reference to the minified version of file-1.js, file-2.js and file-3.js
var result = JavaScriptObfuscator.obfuscate(common, options);
var result2 = JavaScriptObfuscator.obfuscate(services, options);

//view the output
//console.log(result);
console.log(result.getObfuscatedCode());

fs.writeFile("output.min.js", result.getObfuscatedCode() + result2.getObfuscatedCode(), function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("File was successfully saved.");
    }
});