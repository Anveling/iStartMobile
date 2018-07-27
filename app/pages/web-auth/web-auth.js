"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frame = require("ui/frame");
var http = require("http");
var appSettings = require("application-settings");
var webViewModule = require("ui/web-view");
var firebase = require("nativescript-plugin-firebase");
var dialogs = require("ui/dialogs");
var constants_1 = require("../../common/constants");
var nativescript_loading_indicator_1 = require("nativescript-loading-indicator");
require("nativescript-localstorage");
var enurl = ""; //Variable to store the encoded URL returned after CAS login.
appSettings.setBoolean("check", false); //Boolean to perform initial check to avoid calling of Firebase initialization after each URL return.
var loader = new nativescript_loading_indicator_1.LoadingIndicator(); //new LoadingIndicator to show status.
var options = {
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
function loaded(args) {
    var page = args.object;
    var webView = page.getViewById("myWebView"); //Identifying WebView by its ID
    var timerId = setTimeout(function () {
        console.log("No user interaction, request timedout!");
        resetToLogin("Request Timedout, please try again");
    }, 90000);
    loader.show(); //Show LoadingIndicator till the page is loaded.
    //Disable build in Zoom buttons of WebView in Android
    if (webView.android) {
        webView.android.getSettings().setBuiltInZoomControls(false);
    }
    webView.on(webViewModule.WebView.loadFinishedEvent, function (args) {
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
        loader.hide(); //Hide LoadingIndicator once the page is loaded.
        var tempurl = args.url; //Get the URL which is returned after CAS login
        try {
            var n = tempurl.search("LoginMobile.cfm"); //Search for auth keyword in the returned URL
            var m = tempurl.search("auth=");
        }
        catch (err) {
            console.log("Not able to find LoginMobile.cfm or auth=");
            resetToLogin("Unable to login, please try again");
        }
        //console.log("n: " + n + " m: " + m);                 //----> For debuggig --- REMOVE
        if (n != -1 && m != -1) {
            enurl = tempurl.substr(n + 21, tempurl.length - 1); //Extract the encoded URL
            appSettings.setBoolean("check", true); //Set check Boolean to true to continue further processing
            //console.log("enurl: " + enurl);                  //----> For debuggig --- REMOVE
            loader.show(); //Show loading indicator while the futher processing is done.
        }
        if (appSettings.getBoolean("check")) {
            var uri_decoded = decodeURIComponent(enurl); //Decode the encode URL
            //console.log("Decoded URL --- " + uri_decoded);    ---> For intermediate debugging of values | REMOVE LATER
            //Use HTTP Module to  make HTTP request. Changed Logic from FETCH Module to HTTP Module
            http.getJSON(uri_decoded).then(function (result) {
                //console.log(JSON.stringify(result));          ---> For intermediate debugging of values | REMOVE LATER
                var idNumber = result["AuthProcess"].idnumber;
                //console.log("idNumber -- " + idNumber);      // ---> For intermediate debugging of values | REMOVE LATER
                appSettings.setString("idNumber", idNumber); // Storing values in appSettings, values will be flushed after the app closes.
                var sessionKey = result["AuthProcess"].sessionKey;
                //console.log("sessionKey -- " + sessionKey); // ---> For intermediate debugging of values | REMOVE LATER
                appSettings.setString("sessionKey", sessionKey); // Storing values in appSettings, values will be flushed after the app closes.
                //Retrieving Device Token from Firebase Server
                //This call will be made only when the push token doesn't exist or is not valid
                //Saving push token in Application-settings to retrieve it even if the application losses focus or go to background
                //TO-DO: Refine logic once more work is done
                //Firebase Device Token Code
                //Retrieving device token from Firebase server, addOnPushTokenReceivedCallback latches to the device token and we will get a device token if it is not already available.
                //If the device token is already available, nothing will be returned. As the function is only called when device token is received.
                //Once the Device Token is received, we set it in Application-settings to persist the state in case the app goes into background or device orientation changes or higher priority application is called.
                firebase.addOnPushTokenReceivedCallback(function (token) {
                    appSettings.setString("deviceToken", token);
                });
                var deviceToken = appSettings.getString("deviceToken");
                //Code for retrieving device token from localstorage to check for its validity. This code is required for the changing background of the login screen based on campus.
                //Code check the validity of device token, updates it if the token is different. This is later fetched by the inital app load script and the campus value is retrieved.
                var lsToken = localStorage.getItem('dToken');
                if (lsToken != deviceToken) {
                    localStorage.setItem('dToken', deviceToken);
                }
                console.log("Token: " + localStorage.getItem('dToken')); //TEMP Code for debugging --- DELETE LATER
                //Code ends for device token.
                if (localStorage.getItem('dToken')) {
                    var objPay = new Object();
                    objPay["sessionKey"] = appSettings.getString("sessionKey");
                    objPay["idNumber"] = appSettings.getString("idNumber");
                    objPay["deviceToken"] = appSettings.getString("deviceToken");
                    objPay["method"] = "saveToken";
                    var payLoad = JSON.stringify(objPay);
                    console.log("Payload --> " + payLoad); // ---> For intermediate debugging of values | REMOVE LATER
                    getDataFromServer(payLoad);
                    clearTimeout(timerId);
                }
                else {
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
            }, function (error) {
                console.log("Login Failed, error in retrieving ID Number and Session Key");
                resetToLogin("Unable to login, please try again");
            });
        }
    });
    webView.src = constants_1.BASE_PATH + constants_1.LOGIN_PATH;
}
exports.loaded = loaded;
function resetToLogin(errormsg) {
    var options = {
        title: "\u26A0\uFE0F Alert",
        message: errormsg,
        okButtonText: "Ok",
    };
    dialogs.alert(options).then(function () {
        frame.topmost().goBack();
        loader.hide();
    });
}
function getDataFromServer(payLoad) {
    return __awaiter(this, void 0, void 0, function () {
        var resp, respData, errormsg, navigationEntry, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, http.request({
                            url: constants_1.BASE_PATH + constants_1.POST_PATH,
                            method: 'POST',
                            headers: { "Content-type": "application/json" },
                            content: payLoad
                        })];
                case 1:
                    resp = _a.sent();
                    return [4 /*yield*/, resp.content.toJSON()];
                case 2:
                    respData = _a.sent();
                    console.log("Message:   - > " + JSON.stringify(respData));
                    errormsg = respData['error'];
                    if (errormsg) {
                        console.log("Error: " + JSON.stringify(errormsg));
                        resetToLogin(JSON.stringify(errormsg));
                        loader.hide();
                    }
                    else {
                        navigationEntry = {
                            moduleName: "pages/landing/landing",
                            clearHistory: true
                        };
                        //appSettings.setBoolean("check", false);
                        frame.topmost().navigate(navigationEntry);
                        loader.hide();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log('HTTP Request Failed, unable to send data to CF server', err_1);
                    resetToLogin("Unable to login, please try again");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLWF1dGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3ZWItYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGdDQUFtQztBQUNuQywyQkFBOEI7QUFDOUIsa0RBQXFEO0FBR3JELDJDQUErQztBQUMvQyx1REFBMEQ7QUFDMUQsb0NBQXVDO0FBQ3ZDLG9EQUF3RTtBQUN4RSxpRkFBZ0U7QUFDaEUsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFFckMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQXlCLDZEQUE2RDtBQUNyRyxXQUFXLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFzQixxR0FBcUc7QUFFakssSUFBSSxNQUFNLEdBQUcsSUFBSSxpREFBZ0IsRUFBRSxDQUFDLENBQVEsc0NBQXNDO0FBRWxGLElBQUksT0FBTyxHQUFHO0lBQ1YsT0FBTyxFQUFFLFlBQVk7SUFDckIsUUFBUSxFQUFFLElBQUk7SUFDZCxPQUFPLEVBQUU7UUFDTCxZQUFZLEVBQUUsSUFBSTtRQUNsQixVQUFVLEVBQUUsS0FBSztRQUNqQixHQUFHLEVBQUUsR0FBRztRQUNSLG9CQUFvQixFQUFFLFNBQVM7UUFDL0IscUJBQXFCLEVBQUUsSUFBSTtRQUMzQixhQUFhLEVBQUUsQ0FBQztRQUNoQixpQkFBaUIsRUFBRSxDQUFDO0tBQ3ZCO0lBQ0QsR0FBRyxFQUFFO1FBQ0QsT0FBTyxFQUFFLDBCQUEwQjtRQUNuQyxNQUFNLEVBQUUsS0FBSztRQUNiLE1BQU0sRUFBRSxFQUFFO1FBQ1YsYUFBYSxFQUFFLElBQUk7UUFDbkIsS0FBSyxFQUFFLFNBQVM7S0FDbkI7Q0FDSixDQUFDO0FBR0YsZ0JBQXVCLElBQWU7SUFDbEMsSUFBSSxJQUFJLEdBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM3QixJQUFJLE9BQU8sR0FBMEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFZLCtCQUErQjtJQUM5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LGVBQWUsR0FBRzs0QkFDbEIsVUFBVSxFQUFFLHVCQUF1Qjs0QkFDbkMsWUFBWSxFQUFFLElBQUk7eUJBQ3JCLENBQUE7d0JBRUQseUNBQXlDO3dCQUN6QyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO3dCQUMxQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2xCLENBQUM7Ozs7b0JBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1REFBdUQsRUFBRSxLQUFHLENBQUMsQ0FBQztvQkFDMUUsWUFBWSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7Ozs7OztDQUU3RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwcCBmcm9tICdhcHBsaWNhdGlvbic7XHJcbmltcG9ydCBmcmFtZSA9IHJlcXVpcmUoJ3VpL2ZyYW1lJyk7XHJcbmltcG9ydCBodHRwID0gcmVxdWlyZSgnaHR0cCcpO1xyXG5pbXBvcnQgYXBwU2V0dGluZ3MgPSByZXF1aXJlKCdhcHBsaWNhdGlvbi1zZXR0aW5ncycpO1xyXG5pbXBvcnQgeyBFdmVudERhdGEgfSBmcm9tICdkYXRhL29ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAndWkvcGFnZSc7XHJcbmltcG9ydCB3ZWJWaWV3TW9kdWxlID0gIHJlcXVpcmUoJ3VpL3dlYi12aWV3Jyk7XHJcbmltcG9ydCBmaXJlYmFzZSA9IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC1wbHVnaW4tZmlyZWJhc2UnKTtcclxuaW1wb3J0IGRpYWxvZ3MgPSByZXF1aXJlKCd1aS9kaWFsb2dzJyk7XHJcbmltcG9ydCB7QkFTRV9QQVRILCBQT1NUX1BBVEgsIExPR0lOX1BBVEh9IGZyb20gXCIuLi8uLi9jb21tb24vY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7TG9hZGluZ0luZGljYXRvcn0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1sb2FkaW5nLWluZGljYXRvclwiO1xyXG5yZXF1aXJlKFwibmF0aXZlc2NyaXB0LWxvY2Fsc3RvcmFnZVwiKTtcclxuXHJcbnZhciBlbnVybCA9IFwiXCI7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vVmFyaWFibGUgdG8gc3RvcmUgdGhlIGVuY29kZWQgVVJMIHJldHVybmVkIGFmdGVyIENBUyBsb2dpbi5cclxuYXBwU2V0dGluZ3Muc2V0Qm9vbGVhbihcImNoZWNrXCIsZmFsc2UpOyAgICAgICAgICAgICAgICAgICAgICAvL0Jvb2xlYW4gdG8gcGVyZm9ybSBpbml0aWFsIGNoZWNrIHRvIGF2b2lkIGNhbGxpbmcgb2YgRmlyZWJhc2UgaW5pdGlhbGl6YXRpb24gYWZ0ZXIgZWFjaCBVUkwgcmV0dXJuLlxyXG5cclxudmFyIGxvYWRlciA9IG5ldyBMb2FkaW5nSW5kaWNhdG9yKCk7ICAgICAgICAvL25ldyBMb2FkaW5nSW5kaWNhdG9yIHRvIHNob3cgc3RhdHVzLlxyXG5cclxudmFyIG9wdGlvbnMgPSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1BhcmFtZXRlcnMgZm9yIHRoZSBMb2FkaW5nIEluZGljYXRvciwgdGhlc2UgY2FuIGJlIHR3ZWFrZWQgYXMgcmVxdWlyZWQuXHJcbiAgICBtZXNzYWdlOiAnTG9hZGluZy4uLicsXHJcbiAgICBwcm9ncmVzczogMC42NSxcclxuICAgIGFuZHJvaWQ6IHtcclxuICAgICAgICBpbnRlcm1lZGlhdGU6IHRydWUsXHJcbiAgICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXHJcbiAgICAgICAgbWF4OiAxMDAsXHJcbiAgICAgICAgcHJvZ3Jlc3NOdW1iZXJGb3JtYXQ6IFwiJTFkLyUyZFwiLFxyXG4gICAgICAgIHByb2dyZXNzUGVyY2VudEZvcm1hdDogMC41MyxcclxuICAgICAgICBwcm9ncmVzc1N0eWxlOiAxLFxyXG4gICAgICAgIHNlY29uZGFyeVByb2dyZXNzOiAxXHJcbiAgICB9LFxyXG4gICAgaW9zOiB7XHJcbiAgICAgICAgZGV0YWlsczogXCJBZGRpdGlvbmFsIGRldGFpbHMgbm90ZSFcIixcclxuICAgICAgICBzcXVhcmU6IGZhbHNlLFxyXG4gICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgZGltQmFja2dyb3VuZDogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjNEI5RUQ2XCIsXHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRlZChhcmdzOiBFdmVudERhdGEpIHtcclxuICAgIGxldCBwYWdlID0gPFBhZ2U+YXJncy5vYmplY3Q7XHJcbiAgICB2YXIgd2ViVmlldyA9IDx3ZWJWaWV3TW9kdWxlLldlYlZpZXc+cGFnZS5nZXRWaWV3QnlJZChcIm15V2ViVmlld1wiKTsgICAgICAgICAgICAvL0lkZW50aWZ5aW5nIFdlYlZpZXcgYnkgaXRzIElEXHJcbiAgICBjb25zdCB0aW1lcklkID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIk5vIHVzZXIgaW50ZXJhY3Rpb24sIHJlcXVlc3QgdGltZWRvdXQhXCIpO1xyXG4gICAgICAgIHJlc2V0VG9Mb2dpbihcIlJlcXVlc3QgVGltZWRvdXQsIHBsZWFzZSB0cnkgYWdhaW5cIik7XHJcbiAgICB9LCA5MDAwMCk7XHJcbiAgICBsb2FkZXIuc2hvdygpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TaG93IExvYWRpbmdJbmRpY2F0b3IgdGlsbCB0aGUgcGFnZSBpcyBsb2FkZWQuXHJcblxyXG4gICAgLy9EaXNhYmxlIGJ1aWxkIGluIFpvb20gYnV0dG9ucyBvZiBXZWJWaWV3IGluIEFuZHJvaWRcclxuICAgIGlmKHdlYlZpZXcuYW5kcm9pZCkge1xyXG4gICAgICAgIHdlYlZpZXcuYW5kcm9pZC5nZXRTZXR0aW5ncygpLnNldEJ1aWx0SW5ab29tQ29udHJvbHMoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHdlYlZpZXcub24od2ViVmlld01vZHVsZS5XZWJWaWV3LmxvYWRGaW5pc2hlZEV2ZW50LCBmdW5jdGlvbihhcmdzOiB3ZWJWaWV3TW9kdWxlLkxvYWRFdmVudERhdGEpe1xyXG5cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICogSW52b2tpbmcgbGlzdGVuZXIgb24gTG9hZCBGaW5zaWhlZCBFdmVudCB0byBjaGVjayBmb3IgZW5jb2RlZCBVUkwuIFRoaXMgZnVuY3Rpb24gd2lsbCAgICAgICAgICAqXHJcbiAgICAgICAgKiBsaXN0ZW4gdG8gdGhlIGxvYWQgZmluaXNoZWQgZXZlbnQgYW5kIHdpbGwgY2hlY2sgaWYgdGhlIHJldHVybmVkIFVSTCBjb250YWlucyBhdXRoIGtleXdvcmQuICAgICpcclxuICAgICAgICAqIE9uY2UgYXV0aCBrZXl3b3JkIGlzIGlkZW50aWZpZWQsIGVuY29kZWQgVVJMIGlzIGV4dHJhY3RlZCBmcm9tIHRoZSBVUkwuIFRoZSBlbmNvZGVkIFVSTCBpcyAgICAgKlxyXG4gICAgICAgICogdGhlbiBkZWNvZGVkIGFuZCB3ZSB1c2UgSFRUUCBtb2R1bGUgdG8gR0VUIGEgSlNPTiByZXNwb25zZSB3aGljaCBjb250YWlucyB0aGUgaWROdW1iZXIgYW5kICAgICpcclxuICAgICAgICAqIHNlc3Npb25LZXkgZm9yIHRoZSByZXF1ZXN0LiBpZE51bWJlciBhbmQgc2Vzc2lvbktleSBpcyB0aGVuIHN0b3JlIGluIGdsb2JhbCB2YXJpYWJsZXMgYW5kIHRoZSAgKlxyXG4gICAgICAgICogbmF2aWdhdGlvbiBpcyBkb25lIHRvIGEgbmV3IHBhZ2UsIHdoaWxlIGNsZWFyaW5nIGhpc3Rvcnkgc28gdGhhdCB0aGUgdXNlciBjYW5ub3QgcmV0dXJuIHRvIHRoZSAqXHJcbiAgICAgICAgKiB3ZWIgYXV0aGVudGljYXRpb24gcGFnZSBieSBwcmVzc2luZyB0aGUgYmFjayBwYWdlLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcclxuICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAgKlxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIGxvYWRlci5oaWRlKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9IaWRlIExvYWRpbmdJbmRpY2F0b3Igb25jZSB0aGUgcGFnZSBpcyBsb2FkZWQuXHJcblxyXG4gICAgICAgIHZhciB0ZW1wdXJsID0gYXJncy51cmw7ICAgICAgICAgICAgICAgICAgICAgLy9HZXQgdGhlIFVSTCB3aGljaCBpcyByZXR1cm5lZCBhZnRlciBDQVMgbG9naW5cclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIHZhciBuID0gdGVtcHVybC5zZWFyY2goXCJMb2dpbk1vYmlsZS5jZm1cIik7ICAgICAgICAgICAgIC8vU2VhcmNoIGZvciBhdXRoIGtleXdvcmQgaW4gdGhlIHJldHVybmVkIFVSTFxyXG4gICAgICAgICAgICB2YXIgbSA9IHRlbXB1cmwuc2VhcmNoKFwiYXV0aD1cIik7XHJcbiAgICAgICAgfWNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgYWJsZSB0byBmaW5kIExvZ2luTW9iaWxlLmNmbSBvciBhdXRoPVwiKTtcclxuICAgICAgICAgICAgcmVzZXRUb0xvZ2luKFwiVW5hYmxlIHRvIGxvZ2luLCBwbGVhc2UgdHJ5IGFnYWluXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwibjogXCIgKyBuICsgXCIgbTogXCIgKyBtKTsgICAgICAgICAgICAgICAgIC8vLS0tLT4gRm9yIGRlYnVnZ2lnIC0tLSBSRU1PVkVcclxuICAgICAgICBpZiAobiAhPSAtMSAmJiBtICE9IC0xKXsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DaGVjayBpZiBcImF1dGhcIiBpcyBmb3VuZFxyXG4gICAgICAgICAgICBlbnVybCA9IHRlbXB1cmwuc3Vic3RyKG4rMjEsIHRlbXB1cmwubGVuZ3RoIC0gMSk7ICAgIC8vRXh0cmFjdCB0aGUgZW5jb2RlZCBVUkxcclxuICAgICAgICAgICAgYXBwU2V0dGluZ3Muc2V0Qm9vbGVhbihcImNoZWNrXCIsIHRydWUpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vU2V0IGNoZWNrIEJvb2xlYW4gdG8gdHJ1ZSB0byBjb250aW51ZSBmdXJ0aGVyIHByb2Nlc3NpbmdcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImVudXJsOiBcIiArIGVudXJsKTsgICAgICAgICAgICAgICAgICAvLy0tLS0+IEZvciBkZWJ1Z2dpZyAtLS0gUkVNT1ZFXHJcbiAgICAgICAgICAgIGxvYWRlci5zaG93KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vU2hvdyBsb2FkaW5nIGluZGljYXRvciB3aGlsZSB0aGUgZnV0aGVyIHByb2Nlc3NpbmcgaXMgZG9uZS5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhcHBTZXR0aW5ncy5nZXRCb29sZWFuKFwiY2hlY2tcIikpe1xyXG4gICAgICAgICAgICB2YXIgdXJpX2RlY29kZWQgPSBkZWNvZGVVUklDb21wb25lbnQoZW51cmwpOyAgICAgICAgLy9EZWNvZGUgdGhlIGVuY29kZSBVUkxcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkRlY29kZWQgVVJMIC0tLSBcIiArIHVyaV9kZWNvZGVkKTsgICAgLS0tPiBGb3IgaW50ZXJtZWRpYXRlIGRlYnVnZ2luZyBvZiB2YWx1ZXMgfCBSRU1PVkUgTEFURVJcclxuXHJcbiAgICAgICAgICAgIC8vVXNlIEhUVFAgTW9kdWxlIHRvICBtYWtlIEhUVFAgcmVxdWVzdC4gQ2hhbmdlZCBMb2dpYyBmcm9tIEZFVENIIE1vZHVsZSB0byBIVFRQIE1vZHVsZVxyXG5cclxuICAgICAgICAgICAgaHR0cC5nZXRKU09OKHVyaV9kZWNvZGVkKS50aGVuKGZ1bmN0aW9uKHJlc3VsdDogSlNPTil7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpOyAgICAgICAgICAtLS0+IEZvciBpbnRlcm1lZGlhdGUgZGVidWdnaW5nIG9mIHZhbHVlcyB8IFJFTU9WRSBMQVRFUlxyXG4gICAgICAgICAgICAgICAgdmFyIGlkTnVtYmVyID0gcmVzdWx0W1wiQXV0aFByb2Nlc3NcIl0uaWRudW1iZXI7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiaWROdW1iZXIgLS0gXCIgKyBpZE51bWJlcik7ICAgICAgLy8gLS0tPiBGb3IgaW50ZXJtZWRpYXRlIGRlYnVnZ2luZyBvZiB2YWx1ZXMgfCBSRU1PVkUgTEFURVJcclxuICAgICAgICAgICAgICAgIGFwcFNldHRpbmdzLnNldFN0cmluZyhcImlkTnVtYmVyXCIsIGlkTnVtYmVyKTsgICAgICAgIC8vIFN0b3JpbmcgdmFsdWVzIGluIGFwcFNldHRpbmdzLCB2YWx1ZXMgd2lsbCBiZSBmbHVzaGVkIGFmdGVyIHRoZSBhcHAgY2xvc2VzLlxyXG4gICAgICAgICAgICAgICAgdmFyIHNlc3Npb25LZXkgPSByZXN1bHRbXCJBdXRoUHJvY2Vzc1wiXS5zZXNzaW9uS2V5O1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInNlc3Npb25LZXkgLS0gXCIgKyBzZXNzaW9uS2V5KTsgLy8gLS0tPiBGb3IgaW50ZXJtZWRpYXRlIGRlYnVnZ2luZyBvZiB2YWx1ZXMgfCBSRU1PVkUgTEFURVJcclxuICAgICAgICAgICAgICAgIGFwcFNldHRpbmdzLnNldFN0cmluZyhcInNlc3Npb25LZXlcIiwgc2Vzc2lvbktleSkgICAgIC8vIFN0b3JpbmcgdmFsdWVzIGluIGFwcFNldHRpbmdzLCB2YWx1ZXMgd2lsbCBiZSBmbHVzaGVkIGFmdGVyIHRoZSBhcHAgY2xvc2VzLlxyXG5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy9SZXRyaWV2aW5nIERldmljZSBUb2tlbiBmcm9tIEZpcmViYXNlIFNlcnZlclxyXG4gICAgICAgICAgICAgICAgLy9UaGlzIGNhbGwgd2lsbCBiZSBtYWRlIG9ubHkgd2hlbiB0aGUgcHVzaCB0b2tlbiBkb2Vzbid0IGV4aXN0IG9yIGlzIG5vdCB2YWxpZFxyXG4gICAgICAgICAgICAgICAgLy9TYXZpbmcgcHVzaCB0b2tlbiBpbiBBcHBsaWNhdGlvbi1zZXR0aW5ncyB0byByZXRyaWV2ZSBpdCBldmVuIGlmIHRoZSBhcHBsaWNhdGlvbiBsb3NzZXMgZm9jdXMgb3IgZ28gdG8gYmFja2dyb3VuZFxyXG4gICAgICAgICAgICAgICAgLy9UTy1ETzogUmVmaW5lIGxvZ2ljIG9uY2UgbW9yZSB3b3JrIGlzIGRvbmVcclxuXHJcbiAgICAgICAgICAgICAgICAvL0ZpcmViYXNlIERldmljZSBUb2tlbiBDb2RlXHJcbiAgICAgICAgICAgICAgICAvL1JldHJpZXZpbmcgZGV2aWNlIHRva2VuIGZyb20gRmlyZWJhc2Ugc2VydmVyLCBhZGRPblB1c2hUb2tlblJlY2VpdmVkQ2FsbGJhY2sgbGF0Y2hlcyB0byB0aGUgZGV2aWNlIHRva2VuIGFuZCB3ZSB3aWxsIGdldCBhIGRldmljZSB0b2tlbiBpZiBpdCBpcyBub3QgYWxyZWFkeSBhdmFpbGFibGUuXHJcbiAgICAgICAgICAgICAgICAvL0lmIHRoZSBkZXZpY2UgdG9rZW4gaXMgYWxyZWFkeSBhdmFpbGFibGUsIG5vdGhpbmcgd2lsbCBiZSByZXR1cm5lZC4gQXMgdGhlIGZ1bmN0aW9uIGlzIG9ubHkgY2FsbGVkIHdoZW4gZGV2aWNlIHRva2VuIGlzIHJlY2VpdmVkLlxyXG4gICAgICAgICAgICAgICAgLy9PbmNlIHRoZSBEZXZpY2UgVG9rZW4gaXMgcmVjZWl2ZWQsIHdlIHNldCBpdCBpbiBBcHBsaWNhdGlvbi1zZXR0aW5ncyB0byBwZXJzaXN0IHRoZSBzdGF0ZSBpbiBjYXNlIHRoZSBhcHAgZ29lcyBpbnRvIGJhY2tncm91bmQgb3IgZGV2aWNlIG9yaWVudGF0aW9uIGNoYW5nZXMgb3IgaGlnaGVyIHByaW9yaXR5IGFwcGxpY2F0aW9uIGlzIGNhbGxlZC5cclxuXHJcbiAgICAgICAgICAgICAgICBmaXJlYmFzZS5hZGRPblB1c2hUb2tlblJlY2VpdmVkQ2FsbGJhY2soXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcFNldHRpbmdzLnNldFN0cmluZyhcImRldmljZVRva2VuXCIsIHRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICB2YXIgZGV2aWNlVG9rZW4gPSBhcHBTZXR0aW5ncy5nZXRTdHJpbmcoXCJkZXZpY2VUb2tlblwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL0NvZGUgZm9yIHJldHJpZXZpbmcgZGV2aWNlIHRva2VuIGZyb20gbG9jYWxzdG9yYWdlIHRvIGNoZWNrIGZvciBpdHMgdmFsaWRpdHkuIFRoaXMgY29kZSBpcyByZXF1aXJlZCBmb3IgdGhlIGNoYW5naW5nIGJhY2tncm91bmQgb2YgdGhlIGxvZ2luIHNjcmVlbiBiYXNlZCBvbiBjYW1wdXMuXHJcbiAgICAgICAgICAgICAgICAvL0NvZGUgY2hlY2sgdGhlIHZhbGlkaXR5IG9mIGRldmljZSB0b2tlbiwgdXBkYXRlcyBpdCBpZiB0aGUgdG9rZW4gaXMgZGlmZmVyZW50LiBUaGlzIGlzIGxhdGVyIGZldGNoZWQgYnkgdGhlIGluaXRhbCBhcHAgbG9hZCBzY3JpcHQgYW5kIHRoZSBjYW1wdXMgdmFsdWUgaXMgcmV0cmlldmVkLlxyXG4gICAgICAgICAgICAgICAgbGV0IGxzVG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZFRva2VuJyk7XHJcbiAgICAgICAgICAgICAgICBpZihsc1Rva2VuICE9IGRldmljZVRva2VuKXtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZFRva2VuJywgZGV2aWNlVG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUb2tlbjogXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZFRva2VuJykpOyAgICAgICAgICAgIC8vVEVNUCBDb2RlIGZvciBkZWJ1Z2dpbmcgLS0tIERFTEVURSBMQVRFUlxyXG4gICAgICAgICAgICAgICAgLy9Db2RlIGVuZHMgZm9yIGRldmljZSB0b2tlbi5cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2RUb2tlbicpKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqUGF5ID0gbmV3IE9iamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialBheVtcInNlc3Npb25LZXlcIl0gPSBhcHBTZXR0aW5ncy5nZXRTdHJpbmcoXCJzZXNzaW9uS2V5XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialBheVtcImlkTnVtYmVyXCJdID0gYXBwU2V0dGluZ3MuZ2V0U3RyaW5nKFwiaWROdW1iZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqUGF5W1wiZGV2aWNlVG9rZW5cIl0gPSBhcHBTZXR0aW5ncy5nZXRTdHJpbmcoXCJkZXZpY2VUb2tlblwiKTtcclxuICAgICAgICAgICAgICAgICAgICBvYmpQYXlbXCJtZXRob2RcIl0gPSBcInNhdmVUb2tlblwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGF5TG9hZCA9IEpTT04uc3RyaW5naWZ5KG9ialBheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYXlsb2FkIC0tPiBcIiArIHBheUxvYWQpOyAgICAgICAgICAvLyAtLS0+IEZvciBpbnRlcm1lZGlhdGUgZGVidWdnaW5nIG9mIHZhbHVlcyB8IFJFTU9WRSBMQVRFUlxyXG4gICAgICAgICAgICAgICAgICAgIGdldERhdGFGcm9tU2VydmVyKHBheUxvYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNldFRvTG9naW4oXCJEZXZpY2UgdG9rZW4gbm90IHJlZ2lzdGVyZWQsIHBsZWFzZSB0cnkgYWdhaW5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gdmFyIG9ialBheSA9IG5ldyBPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgIC8vIG9ialBheVtcInNlc3Npb25LZXlcIl0gPSBhcHBTZXR0aW5ncy5nZXRTdHJpbmcoXCJzZXNzaW9uS2V5XCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gb2JqUGF5W1wiaWROdW1iZXJcIl0gPSBhcHBTZXR0aW5ncy5nZXRTdHJpbmcoXCJpZE51bWJlclwiKTtcclxuICAgICAgICAgICAgICAgIC8vIG9ialBheVtcImRldmljZVRva2VuXCJdID0gYXBwU2V0dGluZ3MuZ2V0U3RyaW5nKFwiZGV2aWNlVG9rZW5cIik7XHJcbiAgICAgICAgICAgICAgICAvLyBvYmpQYXlbXCJtZXRob2RcIl0gPSBcInNhdmVUb2tlblwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHZhciBwYXlMb2FkID0gSlNPTi5zdHJpbmdpZnkob2JqUGF5KTtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUGF5bG9hZCAtLT4gXCIgKyBwYXlMb2FkKTsgICAgICAgICAgLy8gLS0tPiBGb3IgaW50ZXJtZWRpYXRlIGRlYnVnZ2luZyBvZiB2YWx1ZXMgfCBSRU1PVkUgTEFURVJcclxuICAgICAgICAgICAgICAgIC8vIGdldERhdGFGcm9tU2VydmVyKHBheUxvYWQpO1xyXG4gICAgICAgICAgICAgICAgLy8gaHR0cC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIC8vICAgICB1cmw6IEJBU0VfUEFUSCtQT1NUX1BBVEgsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtdHlwZVwiIDogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcclxuICAgICAgICAgICAgICAgIC8vICAgICBjb250ZW50OiBwYXlMb2FkXHJcbiAgICAgICAgICAgICAgICAvLyB9KVxyXG4gICAgICAgICAgICAgICAgLy8gLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgKHJlc3ApID0+e1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZygnUmVxdWVzdCBzZW50IHRvIENGIFNlcnZlcicpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZygnUmVzcDogJyArIHJlc3AuY29udGVudC50b0pTT04oKSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHZhciBlcnJvckpzb24gPSByZXNwLmNvbnRlbnQudG9KU09OKCk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGVycm9ybXNnID0gZXJyb3JKc29uWydlcnJvciddO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBpZiAoZXJyb3Jtc2cpIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IFwiICsgSlNPTi5zdHJpbmdpZnkoZXJyb3Jtc2cpKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJlc2V0VG9Mb2dpbihKU09OLnN0cmluZ2lmeShlcnJvcm1zZykpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ0hUVFAgUmVxdWVzdCBGYWlsZWQsIHVuYWJsZSB0byBzZW5kIGRhdGEgdG8gQ0Ygc2VydmVyJywgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICByZXNldFRvTG9naW4oXCJVbmFibGUgdG8gbG9naW4sIHBsZWFzZSB0cnkgYWdhaW5cIik7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyB2YXIgbmF2aWdhdGlvbkVudHJ5ID0ge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIG1vZHVsZU5hbWU6IFwicGFnZXMvbGFuZGluZy9sYW5kaW5nXCIsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY2xlYXJIaXN0b3J5OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gLy9hcHBTZXR0aW5ncy5zZXRCb29sZWFuKFwiY2hlY2tcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgLy8gY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xyXG4gICAgICAgICAgICAgICAgLy8gZnJhbWUudG9wbW9zdCgpLm5hdmlnYXRlKG5hdmlnYXRpb25FbnRyeSk7XHJcbiAgICAgICAgICAgICAgICAvLyBsb2FkZXIuaGlkZSgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0hpZGUgTG9hZGluZ0luZGljYXRvciBvbmNlIHRoZSB2aWV3IGxvYWRzIHRoZSBuZXh0IHBhZ2UodmlldylcclxuXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvZ2luIEZhaWxlZCwgZXJyb3IgaW4gcmV0cmlldmluZyBJRCBOdW1iZXIgYW5kIFNlc3Npb24gS2V5XCIpO1xyXG4gICAgICAgICAgICAgICAgcmVzZXRUb0xvZ2luKFwiVW5hYmxlIHRvIGxvZ2luLCBwbGVhc2UgdHJ5IGFnYWluXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gICAgd2ViVmlldy5zcmMgPSBCQVNFX1BBVEggKyBMT0dJTl9QQVRIO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNldFRvTG9naW4oZXJyb3Jtc2cgOiBzdHJpbmcpe1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgdGl0bGU6IFwiXFx1MjZBMFxcdUZFMEYgQWxlcnRcIixcclxuICAgICAgICBtZXNzYWdlOiBlcnJvcm1zZyxcclxuICAgICAgICBva0J1dHRvblRleHQ6IFwiT2tcIixcclxuICAgIH07XHJcbiAgICBkaWFsb2dzLmFsZXJ0KG9wdGlvbnMpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGZyYW1lLnRvcG1vc3QoKS5nb0JhY2soKTtcclxuICAgICAgICBsb2FkZXIuaGlkZSgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldERhdGFGcm9tU2VydmVyKHBheUxvYWQ6c3RyaW5nKSB7XHJcbiAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICBsZXQgcmVzcCA9IGF3YWl0IGh0dHAucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IEJBU0VfUEFUSCtQT1NUX1BBVEgsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LXR5cGVcIiA6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiBwYXlMb2FkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBsZXQgcmVzcERhdGEgPSBhd2FpdCByZXNwLmNvbnRlbnQudG9KU09OKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTWVzc2FnZTogICAtID4gXCIgKyBKU09OLnN0cmluZ2lmeShyZXNwRGF0YSkpO1xyXG4gICAgICAgICAgICB2YXIgZXJyb3Jtc2cgPSByZXNwRGF0YVsnZXJyb3InXTtcclxuICAgICAgICAgICAgaWYgKGVycm9ybXNnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIEpTT04uc3RyaW5naWZ5KGVycm9ybXNnKSk7XHJcbiAgICAgICAgICAgICAgICByZXNldFRvTG9naW4oSlNPTi5zdHJpbmdpZnkoZXJyb3Jtc2cpKTtcclxuICAgICAgICAgICAgICAgIGxvYWRlci5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYXZpZ2F0aW9uRW50cnkgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlTmFtZTogXCJwYWdlcy9sYW5kaW5nL2xhbmRpbmdcIixcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckhpc3Rvcnk6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL2FwcFNldHRpbmdzLnNldEJvb2xlYW4oXCJjaGVja1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBmcmFtZS50b3Btb3N0KCkubmF2aWdhdGUobmF2aWdhdGlvbkVudHJ5KTtcclxuICAgICAgICAgICAgICAgIGxvYWRlci5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0hUVFAgUmVxdWVzdCBGYWlsZWQsIHVuYWJsZSB0byBzZW5kIGRhdGEgdG8gQ0Ygc2VydmVyJywgZXJyKTtcclxuICAgICAgICAgICAgcmVzZXRUb0xvZ2luKFwiVW5hYmxlIHRvIGxvZ2luLCBwbGVhc2UgdHJ5IGFnYWluXCIpO1xyXG4gICAgICAgIH1cclxufSJdfQ==