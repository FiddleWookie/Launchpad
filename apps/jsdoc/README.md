# Basic Template

## Table Of Contents

**[Introduction](#Introduction)**  
**[Development](#Development)**  
**[Testing](#Testing)**  
**[Deployment](#Deployment)**


## Introduction

This application is generated via expressui5. This template contains everything to start with a simple full-screen application.

## Development

When you have cloned this repository to your local file-system you can start developing. But don't forget to install the devDependencies first:

```
npm install
```

## Testing

When developing the application you can run it locally. There are 2 options:
You can either run the app on node.js by running following command in your terminal:  
```
npm start
```
This command will generate a build version and start a local server. In the meanwhile a watch-task is started for the workspace of the application, so when you adjust a file and perform a save the webpage is reloaded. This way your changes will directly be visible when developing the application.

You can run the application using following url: **[http://localhost:8080/resources/test.html](http://localhost:8080/resources/test.html)**

Or you can choose for an easier option with the visual Code plugin: Live server. This launches a lightweight webserver, and immediately triggers a browser window to open.
You can configure your settings to make it open a Chrome session, in incognito mode, with corse disabled, by adding these configurations in the settings.json.
```
    "liveServer.settings.host": "localhost",    
    "liveServer.settings.AdvanceCustomBrowserCmdLine": "chrome --incognito --remote-debugging-port=9222 --disable-web-security --user-data-dir=c:/temp/chromedev",
```
Live server also injects an auto refresh mechanism, whenever you change anything in your code.


## Deployment

Once you are ready to deploy to the Front-end server you can fill provide the information in the *./project/.sapdeploy.json*-file. This information contains:
* package: Package in which the UI5 application should be placed
* bspontainer: The name of the application (max 15 characters)
* bspcontainer_text: Description of the application
* transportno: The transport request

Don't forget to create a *.sapdeployuser.json*-file to store your credentials, don't get scared, this file **won't be commited/pushed** to git, so this file will only exist locally on your pc.

Once you have provided this data you can deploy to the Front-end server with following command:

```
npm run deploy
```

During deployment, a grunt script will perform basic ESLint checks on your code. All JSDoc comments are parsed into one big json file and moved to the dist(ribution) folder. Preload files are generated and moved to the dist folder. The original files are copied to the dist folder and renamed to -dbg files.
At the end, everything in the dist folder is zipped, and then uploaded to the provided BSP repo in the ABAP system.