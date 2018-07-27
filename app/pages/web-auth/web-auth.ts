import * as app from 'application';
import frame = require('ui/frame');
import http = require('http');
import appSettings = require('application-settings');
import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import webViewModule =  require('ui/web-view');
import firebase = require('nativescript-plugin-firebase');
import dialogs = require('ui/dialogs');
import {BASE_PATH, POST_PATH, LOGIN_PATH} from "../../common/constants";
import {LoadingIndicator} from "nativescript-loading-indicator";
require("nativescript-localstorage");

var enurl = "";                         //Variable to store the encoded URL returned after CAS login.
appSettings.setBoolean("check",false);                      //Boolean to perform initial check to avoid calling of Firebase initialization after each URL return.

var loader = new LoadingIndicator();        //new LoadingIndicator to show status.

var options = {                             //Parameters for the Loading Indicator, these can be tweaked as required.
    message: 'Loading...',
    progress: 0.65,
    android: {
        intermediate: true,
        cancelable: false,
        max: 100,
        progressNumberFormat: "%1d/%2d",
        progressPercentFormat: 0.53,
        progressStyle: 1,
        secondaryProgress: 1
    },
    ios: {
        details: "Additional details note!",
        square: false,
        margin: 10,
        dimBackground: true,
        color: "#4B9ED6",
    }
};


export function loaded(args: EventData) {
    let page = <Page>args.object;
    var webView = <webViewModule.WebView>page.getViewById("myWebView");            //Identifying WebView by its ID
    const timerId = setTimeout(function() {
        console.log("No user interaction, request timedout!");
        resetToLogin("Request Timedout, please try again");
    }, 90000);
    loader.show();                                                     //Show LoadingIndicator till the page is loaded.

    //Disable build in Zoom buttons of WebView in Android
    if(webView.android) {
        webView.android.getSettings().setBuiltInZoomControls(false);
    }

    webView.on(webViewModule.WebView.loadFinishedEvent, function(args: webViewModule.LoadEventData){


        /*
        **************************************************************************************************
        * Invoking listener on Load Finsihed Event to check for encoded URL. This function will          *
        * listen to the load finished event and will check if the returned URL contains auth keyword.    *
        * Once auth keyword is identified, encoded URL is extracted from the URL. The encoded URL is     *
        * then decoded and we use HTTP module to GET a JSON response which contains the idNumber and    *
        * sessionKey for the request. idNumber and sessionKey is then store in global variables and the  *
        * navigation is done to a new page, while clearing history so that the user cannot return to the *
        * web authentication page by pressing the back page.                                             *
        ***********************************************************************************************  *
        */

        loader.hide();                              //Hide LoadingIndicator once the page is loaded.

        var tempurl = args.url;                     //Get the URL which is returned after CAS login
        try{
            var n = tempurl.search("LoginMobile.cfm");             //Search for auth keyword in the returned URL
            var m = tempurl.search("auth=");
        }catch (err) {
            console.log("Not able to find LoginMobile.cfm or auth=");
            resetToLogin("Unable to login, please try again");
        }
        //console.log("n: " + n + " m: " + m);                 //----> For debuggig --- REMOVE
        if (n != -1 && m != -1){                                           //Check if "auth" is found
            enurl = tempurl.substr(n+21, tempurl.length - 1);    //Extract the encoded URL
            appSettings.setBoolean("check", true);                                       //Set check Boolean to true to continue further processing
            //console.log("enurl: " + enurl);                  //----> For debuggig --- REMOVE
            loader.show();                                     //Show loading indicator while the futher processing is done.
        }

        if (appSettings.getBoolean("check")){
            var uri_decoded = decodeURIComponent(enurl);        //Decode the encode URL
            //console.log("Decoded URL --- " + uri_decoded);    ---> For intermediate debugging of values | REMOVE LATER

            //Use HTTP Module to  make HTTP request. Changed Logic from FETCH Module to HTTP Module

            http.getJSON(uri_decoded).then(function(result: JSON){
                //console.log(JSON.stringify(result));          ---> For intermediate debugging of values | REMOVE LATER
                var idNumber = result["AuthProcess"].idnumber;
                //console.log("idNumber -- " + idNumber);      // ---> For intermediate debugging of values | REMOVE LATER
                appSettings.setString("idNumber", idNumber);        // Storing values in appSettings, values will be flushed after the app closes.
                var sessionKey = result["AuthProcess"].sessionKey;
                //console.log("sessionKey -- " + sessionKey); // ---> For intermediate debugging of values | REMOVE LATER
                appSettings.setString("sessionKey", sessionKey)     // Storing values in appSettings, values will be flushed after the app closes.

                
                //Retrieving Device Token from Firebase Server
                //This call will be made only when the push token doesn't exist or is not valid
                //Saving push token in Application-settings to retrieve it even if the application losses focus or go to background
                //TO-DO: Refine logic once more work is done

                //Firebase Device Token Code
                //Retrieving device token from Firebase server, addOnPushTokenReceivedCallback latches to the device token and we will get a device token if it is not already available.
                //If the device token is already available, nothing will be returned. As the function is only called when device token is received.
                //Once the Device Token is received, we set it in Application-settings to persist the state in case the app goes into background or device orientation changes or higher priority application is called.

                firebase.addOnPushTokenReceivedCallback(
                    function (token) {
                        appSettings.setString("deviceToken", token);
                    }
                )
                var deviceToken = appSettings.getString("deviceToken");

                //Code for retrieving device token from localstorage to check for its validity. This code is required for the changing background of the login screen based on campus.
                //Code check the validity of device token, updates it if the token is different. This is later fetched by the inital app load script and the campus value is retrieved.
                let lsToken = localStorage.getItem('dToken');
                if(lsToken != deviceToken){
                    localStorage.setItem('dToken', deviceToken);
                }
                console.log("Token: " + localStorage.getItem('dToken'));            //TEMP Code for debugging --- DELETE LATER
                //Code ends for device token.

                if (localStorage.getItem('dToken')){
                    var objPay = new Object();
                    objPay["sessionKey"] = appSettings.getString("sessionKey");
                    objPay["idNumber"] = appSettings.getString("idNumber");
                    objPay["deviceToken"] = appSettings.getString("deviceToken");
                    objPay["method"] = "saveToken";

                    var payLoad = JSON.stringify(objPay);
                    console.log("Payload --> " + payLoad);          // ---> For intermediate debugging of values | REMOVE LATER
                    getDataFromServer(payLoad);
                    clearTimeout(timerId);
                }else {
                    resetToLogin("Device token not registered, please try again");
                    clearTimeout(timerId);
                }
                // var objPay = new Object();
                // objPay["sessionKey"] = appSettings.getString("sessionKey");
                // objPay["idNumber"] = appSettings.getString("idNumber");
                // objPay["deviceToken"] = appSettings.getString("deviceToken");
                // objPay["method"] = "saveToken";

                // var payLoad = JSON.stringify(objPay);
                // console.log("Payload --> " + payLoad);          // ---> For intermediate debugging of values | REMOVE LATER
                // getDataFromServer(payLoad);
                // http.request({
                //     url: BASE_PATH+POST_PATH,
                //     method: 'POST',
                //     headers: { "Content-type" : "application/json" },
                //     content: payLoad
                // })
                // .then(
                //     (resp) =>{
                //         console.log('Request sent to CF Server');
                //         console.log('Resp: ' + resp.content.toJSON());
                //         var errorJson = resp.content.toJSON();
                //         errormsg = errorJson['error'];
                //         if (errormsg) {
                //             console.log("Error: " + JSON.stringify(errormsg));
                //             resetToLogin(JSON.stringify(errormsg));
                //         }
                //     },
                //     (error) => {
                //         console.log('HTTP Request Failed, unable to send data to CF server', error);
                //         resetToLogin("Unable to login, please try again");
                //     }
                // );

                // var navigationEntry = {
                //     moduleName: "pages/landing/landing",
                //     clearHistory: true
                // }

                // //appSettings.setBoolean("check", false);
                // clearTimeout(timerId);
                // frame.topmost().navigate(navigationEntry);
                // loader.hide();                                  //Hide LoadingIndicator once the view loads the next page(view)

            }, function(error) {
                console.log("Login Failed, error in retrieving ID Number and Session Key");
                resetToLogin("Unable to login, please try again");
            });

        }

    });
    webView.src = BASE_PATH + LOGIN_PATH;
}

function resetToLogin(errormsg : string){
    var options = {
        title: "\u26A0\uFE0F Alert",
        message: errormsg,
        okButtonText: "Ok",
    };
    dialogs.alert(options).then(() => {
        frame.topmost().goBack();
        loader.hide();
    });
}

async function getDataFromServer(payLoad:string) {
        try{
            let resp = await http.request({
                url: BASE_PATH+POST_PATH,
                method: 'POST',
                headers: { "Content-type" : "application/json" },
                content: payLoad
            });
            let respData = await resp.content.toJSON();
            console.log("Message:   - > " + JSON.stringify(respData));
            var errormsg = respData['error'];
            if (errormsg) {
                console.log("Error: " + JSON.stringify(errormsg));
                resetToLogin(JSON.stringify(errormsg));
                loader.hide();
            }else {
                var navigationEntry = {
                    moduleName: "pages/landing/landing",
                    clearHistory: true
                }

                //appSettings.setBoolean("check", false);
                frame.topmost().navigate(navigationEntry);
                loader.hide();
            }
        } catch (err) {
            console.log('HTTP Request Failed, unable to send data to CF server', err);
            resetToLogin("Unable to login, please try again");
        }
}