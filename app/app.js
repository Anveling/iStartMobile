"use strict";
/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/
Object.defineProperty(exports, "__esModule", { value: true });
require("./bundle-config");
var app = require("application");
require("nativescript-localstorage");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztFQUlFOztBQUVGLDJCQUF5QjtBQUN6QixpQ0FBbUM7QUFHbkMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFHckMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BCLHdEQUF3RDtBQUd4RCxrRkFBa0Y7QUFDbEYsZ0NBQWdDO0FBR2hDLHlCQUF5QjtBQUN6Qiw4Q0FBOEM7QUFDOUMsa0JBQWtCO0FBQ2xCLGdHQUFnRztBQUNoRyxxSUFBcUk7QUFDckksc0RBQXNEO0FBQ3RELG9EQUFvRDtBQUNwRCxZQUFZO0FBQ1osaURBQWlEO0FBQ2pELFFBQVE7QUFDUixXQUFXO0FBQ1gsc0JBQXNCO0FBQ3RCLDZDQUE2QztBQUM3Qyx5RUFBeUU7QUFDekUsdURBQXVEO0FBQ3ZELDZCQUE2QjtBQUM3Qiw0Q0FBNEM7QUFDNUMsa0NBQWtDO0FBQ2xDLG9FQUFvRTtBQUNwRSw0SEFBNEg7QUFDNUgsaUJBQWlCO0FBQ2pCLHFCQUFxQjtBQUNyQix5QkFBeUI7QUFDekIsNERBQTREO0FBQzVELDZEQUE2RDtBQUM3RCwyRUFBMkU7QUFDM0UscUlBQXFJO0FBQ3JJLGlDQUFpQztBQUNqQyxpRUFBaUU7QUFDakUsNkNBQTZDO0FBQzdDLHdFQUF3RTtBQUN4RSxzRUFBc0U7QUFDdEUsd0JBQXdCO0FBQ3hCLHlCQUF5QjtBQUN6QixzRUFBc0U7QUFDdEUsb0JBQW9CO0FBQ3BCLGdFQUFnRTtBQUNoRSw0Q0FBNEM7QUFDNUMsdUVBQXVFO0FBQ3ZFLHFFQUFxRTtBQUNyRSx1QkFBdUI7QUFDdkIsaUJBQWlCO0FBQ2pCLDJCQUEyQjtBQUMzQiw2REFBNkQ7QUFDN0QsZ0JBQWdCO0FBQ2hCLGlCQUFpQjtBQUNqQixZQUFZO0FBQ1osU0FBUztBQUNULG1CQUFtQjtBQUNuQix3REFBd0Q7QUFDeEQsUUFBUTtBQUNSLEtBQUs7QUFHTCxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixFQUFFLENBQUMsQ0FBQztBQUUvQzs7O0VBR0UiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG5JbiBOYXRpdmVTY3JpcHQsIHRoZSBhcHAudHMgZmlsZSBpcyB0aGUgZW50cnkgcG9pbnQgdG8geW91ciBhcHBsaWNhdGlvbi5cclxuWW91IGNhbiB1c2UgdGhpcyBmaWxlIHRvIHBlcmZvcm0gYXBwLWxldmVsIGluaXRpYWxpemF0aW9uLCBidXQgdGhlIHByaW1hcnlcclxucHVycG9zZSBvZiB0aGUgZmlsZSBpcyB0byBwYXNzIGNvbnRyb2wgdG8gdGhlIGFwcOKAmXMgZmlyc3QgbW9kdWxlLlxyXG4qL1xyXG5cclxuaW1wb3J0IFwiLi9idW5kbGUtY29uZmlnXCI7XHJcbmltcG9ydCAqIGFzIGFwcCBmcm9tICdhcHBsaWNhdGlvbic7XHJcblxyXG5pbXBvcnQgZmlyZWJhc2UgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZVwiKTtcclxucmVxdWlyZShcIm5hdGl2ZXNjcmlwdC1sb2NhbHN0b3JhZ2VcIik7XHJcbmltcG9ydCBodHRwID0gcmVxdWlyZSgnaHR0cCcpO1xyXG5pbXBvcnQge0JBU0VfUEFUSCwgUE9TVF9QQVRIfSBmcm9tIFwiLi9jb21tb24vY29uc3RhbnRzXCI7XHJcbnJlcXVpcmUoJy4vaGVscGVyJyk7XHJcbi8vdmFyIG9yaWVudGF0aW9uID0gcmVxdWlyZSgnbmF0aXZlc2NyaXB0LW9yaWVudGF0aW9uJyk7XHJcblxyXG5cclxuLy9UbyBkaXNhYmxlIG9yaWVudGF0aW9uICAgICAgICAgICAgICAgIC8vVE8tRE86IFJldmlzaXQgZGVwZW5kaW5nIG9uIHJlcXVpcmVtZW50c1xyXG4vL29yaWVudGF0aW9uLmRpc2FibGVSb3RhdGlvbigpO1xyXG5cclxuXHJcbi8vRmlyZWJhc2UgaW5pdGlhbGl6YXRpb25cclxuLy9BZGRpbmcgZnVuY3Rpb25hbGl0eSB0byBoYW5kbGUgcHVzaCBtZXNzYWdlc1xyXG4vLyBmaXJlYmFzZS5pbml0KHtcclxuLy8gICAgIG9uTWVzc2FnZVJlY2VpdmVkQ2FsbGJhY2s6IGZ1bmN0aW9uKG1lc3NhZ2UpIHsgICAgICAgICAgICAgICAgICAgICAgLy9UTy1ETzogUmVmaW5lIExvZ2ljXHJcbi8vICAgICAgICAgaWYoJ3RpdGxlJyBpbiBtZXNzYWdlIHx8ICdib2R5JyBpbiBtZXNzYWdlKXsgICAgICAgICAgICAgICAgICAgIC8vQ29kZSB3b3JrcyBvbmx5IHdoZW4gbWVzc2FnZSBjb250YWlucyBhIHRpdGxlIGFuZCBhIGJvZHlcclxuLy8gICAgICAgICAgICAgY29uc29sZS5sb2coXCJUaXRsZTogXCIgKyBtZXNzYWdlLnRpdGxlKTtcclxuLy8gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCb2R5OiBcIiArIG1lc3NhZ2UuYm9keSk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIC8vYWxlcnQoSlNPTi5zdHJpbmdpZnkobWVzc2FnZS5ib2R5KSk7XHJcbi8vICAgICB9XHJcbi8vIH0pLnRoZW4oXHJcbi8vICAgICAoaW5zdGFuY2UpID0+IHtcclxuLy8gICAgICAgICBjb25zb2xlLmxvZyhcImZpcmViYXNlLmluaXQgZG9uZVwiKTtcclxuLy8gICAgICAgICBjb25zb2xlLmxvZyhcImRldmljZVRva2VuOiBcIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkVG9rZW4nKSk7XHJcbi8vICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkVG9rZW4nKSAhPSBudWxsKXtcclxuLy8gICAgICAgICAgICAgaHR0cC5yZXF1ZXN0KHtcclxuLy8gICAgICAgICAgICAgICAgIHVybDogQkFTRV9QQVRIK1BPU1RfUEFUSCxcclxuLy8gICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4vLyAgICAgICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtdHlwZVwiIDogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcclxuLy8gICAgICAgICAgICAgICAgIGNvbnRlbnQ6IEpTT04uc3RyaW5naWZ5KHsgZGV2aWNlVG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkVG9rZW4nKSwgbWV0aG9kOiBcImdldEJhY2tncm91bmRJbWFnZVVSTFwiIH0pXHJcbi8vICAgICAgICAgICAgIH0pXHJcbi8vICAgICAgICAgICAgIC50aGVuKFxyXG4vLyAgICAgICAgICAgICAocmVzcCkgPT57XHJcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVxdWVzdCBzZW50IHRvIENGIFNlcnZlcicpO1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzcC5jb250ZW50KSk7XHJcbi8vICAgICAgICAgICAgICAgICB2YXIgakNvbnRlbnQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3AuY29udGVudCkpO1xyXG4vLyAgICAgICAgICAgICAgICAgdmFyIGltYWdlVXJsID0gSlNPTi5zdHJpbmdpZnkoakNvbnRlbnRbJ2ltYWdlVVJMJ10pOyAgICAgICAgICAgICAgICAgICAvL1NlYXJjaCBmb3IgaW1hZ2VVUkwgdmFsdWUgYW5kIHRyaW0gdGhlIFwiXCJcclxuLy8gICAgICAgICAgICAgICAgIGlmIChpbWFnZVVybCl7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgaW1hZ2VVcmwgPSBpbWFnZVVybC5yZXBsYWNlKC9bJ1wiXSsvZywgJycpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGltYWdlVXJsKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICBpZihsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaW1hZ2VVcmwnKSAhPSBpbWFnZVVybCl7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdpbWFnZVVybCcsIGltYWdlVXJsKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuLy8gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShqQ29udGVudFsnZXJyb3InXSkpO1xyXG4vLyAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgLy8gaW1hZ2VVcmwgPSBpbWFnZVVybC5yZXBsYWNlKC9bJ1wiXSsvZywgJycpO1xyXG4vLyAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaW1hZ2VVcmwpO1xyXG4vLyAgICAgICAgICAgICAgICAgLy8gaWYobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2ltYWdlVXJsJykgIT0gaW1hZ2VVcmwpe1xyXG4vLyAgICAgICAgICAgICAgICAgLy8gICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdpbWFnZVVybCcsIGltYWdlVXJsKTtcclxuLy8gICAgICAgICAgICAgICAgIC8vIH1cclxuLy8gICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSFRUUCBSZXF1ZXN0IEZhaWxlZCcsIGVycm9yKTtcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICApO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH0sXHJcbi8vICAgICAoZXJyb3IpID0+IHtcclxuLy8gICAgICAgICBjb25zb2xlLmxvZyhcImZpcmViYXNlLmluaXQgZXJyb3I6IFwiICsgZXJyb3IpO1xyXG4vLyAgICAgfVxyXG4vLyApO1xyXG5cclxuXHJcbmFwcC5zdGFydCh7IG1vZHVsZU5hbWU6ICdwYWdlcy9sb2dpbi9sb2dpbicgfSk7XHJcblxyXG4vKlxyXG5EbyBub3QgcGxhY2UgYW55IGNvZGUgYWZ0ZXIgdGhlIGFwcGxpY2F0aW9uIGhhcyBiZWVuIHN0YXJ0ZWQgYXMgaXQgd2lsbCBub3RcclxuYmUgZXhlY3V0ZWQgb24gaU9TLlxyXG4qL1xyXG4iXX0=