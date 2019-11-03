const fs = require("fs");
var find = require('find');

console.info("process args:");
console.info(process.argv);
let pluginname = process.argv[2];
let pluginpath = "node_modules/"+pluginname;
let rawdata = fs.readFileSync('./appconfig/fioriSandboxConfig.json');
let config = JSON.parse(rawdata);

let component = find.fileSync("Component.js",pluginpath);
let componentPath = component && Array.isArray(component) && component[0];
console.log(componentPath);
let componentParentPathParts = componentPath && componentPath.split("\\");
console.log(componentParentPathParts);
let componentParentPath = componentParentPathParts && componentParentPathParts[componentParentPathParts.length-2];
console.log(componentParentPath);
pluginpath += "/"+componentParentPath;
console.log(pluginpath);
let componentFile = fs.readFileSync(componentPath, 'utf8');
let regex = /\".*\.Component\"/g;
let found = componentFile.match(regex);
let namespace = found && Array.isArray(found) && found[0].substring(1,found[0].indexOf(".Component"));

let pluginConfig = {
        "component":namespace,
        "url":pluginpath,
        "sap-ushell-plugin-type":"RendererExtensions",
        "enabled":true
    };

config.bootstrapPlugins[pluginname] = pluginConfig;
fs.writeFileSync('./appconfig/fioriSandboxConfig.json',JSON.stringify(config,null,4));