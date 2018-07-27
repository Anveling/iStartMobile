/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import "./bundle-config";
import * as app from 'application';

import firebase = require("nativescript-plugin-firebase");
require("nativescript-localstorage");
import http = require('http');
import {BASE_PATH, POST_PATH} from "./common/constants";
require('./helper');
//var orientation = require('nativescript-orientation');


//To disable orientation                //TO-DO: Revisit depending on requirements
//orientation.disableRotation();


//Firebase initialization
//Adding functionality to handle push messages
// firebase.init({
//     onMessageReceivedCallback: function(message) {                      //TO-DO: Refine Logic
//         if('title' in message || 'body' in message){                    //Code works only when message contains a title and a body
//             console.log("Title: " + message.title);
//             console.log("Body: " + message.body);
//         }
//         //alert(JSON.stringify(message.body));
//     }
// }).then(
//     (instance) => {
//         console.log("firebase.init done");
//         console.log("deviceToken: " + localStorage.getItem('dToken'));
//         if (localStorage.getItem('dToken') != null){
//             http.request({
//                 url: BASE_PATH+POST_PATH,
//                 method: 'POST',
//                 headers: { "Content-type" : "application/json" },
//                 content: JSON.stringify({ deviceToken: localStorage.getItem('dToken'), method: "getBackgroundImageURL" })
//             })
//             .then(
//             (resp) =>{
//                 console.log('Request sent to CF Server');
//                 console.log(JSON.stringify(resp.content));
//                 var jContent = JSON.parse(JSON.stringify(resp.content));
//                 var imageUrl = JSON.stringify(jContent['imageURL']);                   //Search for imageURL value and trim the ""
//                 if (imageUrl){
//                     imageUrl = imageUrl.replace(/['"]+/g, '');
//                     console.log(imageUrl);
//                     if(localStorage.getItem('imageUrl') != imageUrl){
//                         localStorage.setItem('imageUrl', imageUrl);
//                     }
//                 }else{
//                     console.log(JSON.stringify(jContent['error']));
//                 }
//                 // imageUrl = imageUrl.replace(/['"]+/g, '');
//                 // console.log(imageUrl);
//                 // if(localStorage.getItem('imageUrl') != imageUrl){
//                 //     localStorage.setItem('imageUrl', imageUrl);
//                 // }
//             },
//             (error) => {
//                 console.log('HTTP Request Failed', error);
//             }
//             );
//         }
//     },
//     (error) => {
//         console.log("firebase.init error: " + error);
//     }
// );


app.start({ moduleName: 'pages/login/login' });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
