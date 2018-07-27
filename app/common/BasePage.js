"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("ui/frame");
var observable_1 = require("data/observable");
var appSettings = require("application-settings");
var http = require("http");
var constants_1 = require("../common/constants");
var observable_array_1 = require("data/observable-array");
var utils = require("utils/utils");
var app = require("application");
var nativescript_fancyalert_1 = require("nativescript-fancyalert");
var dialogs = require("ui/dialogs");
var nativescript_snackbar_1 = require("nativescript-snackbar");
var frame = require("ui/frame");
var appViewModel = observable_1.fromObject({ selectedPage: 0, icon: "res://ic_menu_ab", noRequests: true, noNotifications: true });
var snackbar = new nativescript_snackbar_1.SnackBar();
var page;
var tabView1;
function preparePayload(methodName) {
    var objPay = new Object();
    objPay["sessionKey"] = appSettings.getString("sessionKey");
    objPay["idNumber"] = appSettings.getString("idNumber");
    objPay["deviceToken"] = appSettings.getString("deviceToken");
    objPay["method"] = methodName;
    var payLoad = JSON.stringify(objPay);
    return objPay;
}
function getDataFromServer(methodName, messageID) {
    return new Promise(function (resolve, reject) {
        var pay = preparePayload(methodName);
        if (methodName === "getMessageDetails") {
            pay["correspondenceId"] = messageID; //Need to be removed later
        } //TO-DO
        var payLoad = JSON.stringify(pay);
        http.request({
            url: constants_1.BASE_PATH + constants_1.POST_PATH,
            method: 'POST',
            headers: { "Content-type": "application/json" },
            content: payLoad
        }).then(function (response) {
            console.log("Status Code: " + response.statusCode);
            try {
                resolve(response.content.toJSON());
            }
            catch (_a) {
                reject(Error("Invalid JSON"));
            }
        }, function (error) {
            reject(Error("Unable to fetch data from server"));
        });
    });
}
function resetToLogin(errormsg) {
    var options = {
        title: "\u26A0\uFE0F Alert",
        message: errormsg,
        okButtonText: "Ok"
    };
    dialogs.alert(options).then(function () {
        var navigationEntry = {
            moduleName: "pages/login/login",
            clearHistory: true,
            animated: true,
            transition: {
                name: "flip",
                duration: 380,
                curve: "easeOut"
            }
        };
        frame.topmost().navigate(navigationEntry);
    });
}
var BasePage = /** @class */ (function () {
    function BasePage() {
    }
    BasePage.prototype.loaded = function (args) {
        page = args.object;
        page.bindingContext = appViewModel;
        tabView1 = page.getViewById("tabView1");
        tabView1.selectedIndex = 0;
    };
    BasePage.prototype.toggleDrawer = function () {
        var page = frame_1.topmost().currentPage;
        var drawer = page.getViewById("drawer");
        drawer.toggleDrawerState();
    };
    BasePage.prototype.navigate = function (args) {
        var pageName = args.view.text.toLowerCase();
        appViewModel.set("selectedPage", pageName);
        frame_1.topmost().navigate("pages/" + pageName + "/" + pageName);
    };
    BasePage.prototype.changeTab = function (args) {
        var page = frame_1.topmost().currentPage;
        // var tabViewInside: tab.TabView = <tab.TabView>page.getViewById("tabView1");
        var pageName = args.view.text.toLowerCase();
        switch (pageName) {
            case '4 unread':
                tabView1.selectedIndex = 0;
                break;
            case '10 pending':
                tabView1.selectedIndex = 1;
                break;
            case '1 new':
                tabView1.selectedIndex = 2;
                break;
            case '2 today':
                tabView1.selectedIndex = 3;
                break;
            case '1 forum':
                tabView1.selectedIndex = 4;
                break;
        }
        appViewModel.set("selectedPage", tabView1.selectedIndex);
        var drawer = page.getViewById("drawer");
        drawer.toggleDrawerState();
    };
    BasePage.prototype.showSocial = function () {
        //Function to open the Social Connect Pop-up
        var fullscrn = false;
        /*****Difference in implementation of iOS and Android****/
        //Check if the platform is iOS --> Using FancyAlert Plugin for iOS
        if (app.ios) {
            nativescript_fancyalert_1.TNSFancyAlert.shouldDismissOnTapOutside = true;
            nativescript_fancyalert_1.TNSFancyAlert.showAnimationType = nativescript_fancyalert_1.TNSFancyAlert.SHOW_ANIMATION_TYPES.SlideInFromLeft;
            nativescript_fancyalert_1.TNSFancyAlert.hideAnimationType = nativescript_fancyalert_1.TNSFancyAlert.HIDE_ANIMATION_TYPES.SlideOutToRight;
            nativescript_fancyalert_1.TNSFancyAlert.backgroundType = nativescript_fancyalert_1.TNSFancyAlert.BACKGROUND_TYPES.Blur;
            var buttons = [
                new nativescript_fancyalert_1.TNSFancyAlertButton({ label: 'YouTube', action: function () { utils.openUrl("https://www.youtube.com/user/intlserv"); } }),
                new nativescript_fancyalert_1.TNSFancyAlertButton({ label: 'Facebook', action: function () { utils.openUrl("https://www.facebook.com/iu.ois"); } }),
                new nativescript_fancyalert_1.TNSFancyAlertButton({ label: 'Instagram', action: function () { utils.openUrl("https://www.instagram.com/iu_ois/"); } }),
                new nativescript_fancyalert_1.TNSFancyAlertButton({ label: 'Twitter', action: function () { utils.openUrl("https://twitter.com/iu_ois"); } }),
            ];
            nativescript_fancyalert_1.TNSFancyAlert.showCustomButtons(buttons, 'ic_group_white_36pt.png', '#7D110C', 'Connect with Us', undefined, 'Ok');
        }
        else {
            //Implementation for Android
            //Using Modal Page
            page.showModal("common/socialModal", "social", function (data) {
                console.log("Pressed");
            }, fullscrn);
        }
    };
    //Function for preparing the PayLoad for server calls
    //TO-DO: Add logic to make the preparePayLoad function generic so that it may accept different methods as parameters
    // preparePayload() {
    //     var objPay = new Object();
    //     objPay["sessionKey"] = appSettings.getString("sessionKey");
    //     objPay["idNumber"] = appSettings.getString("idNumber");
    //     objPay["deviceToken"] = appSettings.getString("deviceToken");
    //     objPay["method"] = "getListItems";
    //     var payLoad = JSON.stringify(objPay);
    //     console.log("Payload --> " + payLoad);
    //     return payLoad;
    // }
    //Function for handling onTap event of Listview. This shows the details of the Notifications and Request
    //Shows a modal page with HTML content of the message
    //TO-DO: Need to add extra logic for handling all types of notifications and requests
    BasePage.prototype.onTap = function (args) {
        var fullscrn = true;
        var obsrArray;
        var title;
        var tabIndex = tabView1.selectedIndex;
        var correspondenceId;
        if (tabIndex === 0) {
            var listContext = appViewModel.get("notiList");
            correspondenceId = listContext[args.index]["correspondenceId"];
        }
        else if (tabIndex === 1) {
            //TODO: When we have request working
        }
        /**
         * Code for server call to get the message details.
         * Need to add more logic. Initial skeleton.
         */
        getDataFromServer("getMessageDetails", correspondenceId).then(function (data) {
            console.log("Message Details: " + JSON.stringify(data));
            console.log("Here");
            var htmlContent = data["data"];
            var actions = data["mobileActions"];
            console.log("HTML Content: " + JSON.stringify(htmlContent));
            console.log("Actions : " + JSON.stringify(actions));
            var navigationEntry = {
                moduleName: "common/messageDetails",
                animated: true,
                transition: {
                    name: "slide",
                    duration: 380,
                    curve: "easeIn"
                },
                context: data
            };
            frame.topmost().navigate(navigationEntry);
        }, function (error) {
            snackbar.simple('Unable to fetch details');
            console.log("Unable to fetch message details : " + error);
        });
    };
    //Function to handle pull to refresh event on the list views.
    //Sample Code at this point.
    //TO-DO: Add logic for server call once server side code is ready.
    BasePage.prototype.pullToRefreshInitiated = function (args) {
        // console.log("PULL TO REFRESH INITIATED");
        // var payLoad:Object = preparePayload("getListItems");
        // var pay = JSON.stringify(payLoad);
        getDataFromServer("getListItems", undefined).then(function (data) {
            //console.log("Notification Array  ------> : " + JSON.stringify(data));
            var arrayn = new observable_array_1.ObservableArray(data["notifications"]);
            var arrayreq = new observable_array_1.ObservableArray(data["requests"]);
            var tempall = data["notifications"];
            var allarray = tempall.concat(data["requests"]);
            var arrayall = new observable_array_1.ObservableArray(allarray);
            var view = args.object;
            view.parent.parent.parent.bindingContext = { notificationList: arrayall, notiList: arrayn, requestList: arrayreq };
            args.object.notifyPullToRefreshFinished();
        }, function (error) {
            args.object.notifyPullToRefreshFinished();
        });
        if (app.android) {
            args.object.notifyPullToRefreshFinished();
        }
    };
    //Function that makes server call to get ListItems (Notification and Requests) of Landing Page List Views
    BasePage.prototype.getDataFromServer = function (methodName) {
        return __awaiter(this, void 0, void 0, function () {
            var pay, payLoad, resp, arrayData, notifiArray, errormsg, requestArray, count, notiCount_1, requestCount_1, noNotifications, noRequests, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pay = preparePayload(methodName);
                        payLoad = JSON.stringify(pay);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, http.request({
                                url: constants_1.BASE_PATH + constants_1.POST_PATH,
                                method: 'POST',
                                headers: { "Content-type": "application/json" },
                                content: payLoad
                            })];
                    case 2:
                        resp = _a.sent();
                        return [4 /*yield*/, resp.content.toJSON()];
                    case 3:
                        arrayData = _a.sent();
                        console.log("This works: " + arrayData);
                        return [4 /*yield*/, arrayData["notifications"]];
                    case 4:
                        notifiArray = _a.sent();
                        errormsg = arrayData['error'];
                        if (errormsg) {
                            console.log("Error: " + JSON.stringify(errormsg));
                            resetToLogin(JSON.stringify(errormsg));
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, arrayData["requests"]];
                    case 5:
                        requestArray = _a.sent();
                        count = 0;
                        notiCount_1 = 0;
                        requestCount_1 = 0;
                        notifiArray.forEach(function (element) {
                            if (element["readFlag"] === "NO") {
                                notiCount_1 = notiCount_1 + 1;
                            }
                        });
                        requestArray.forEach(function (element) {
                            if (element["readFlag"] === "NO") {
                                requestCount_1 = requestCount_1 + 1;
                            }
                        });
                        count = notiCount_1 + requestCount_1;
                        noNotifications = notifiArray.length == 0 ? true : false;
                        noRequests = requestArray.length == 0 ? true : false;
                        appViewModel.set("notiList", notifiArray);
                        appViewModel.set("requestList", requestArray);
                        appViewModel.set("noNotifications", noNotifications);
                        appViewModel.set("noRequests", true);
                        switch (count) {
                            case 0:
                                appViewModel.set("icon", "res://ic_noticount_0_sd");
                                break;
                            case 1:
                                appViewModel.set("icon", "res://ic_noticount_1_sd");
                                break;
                            case 2:
                                appViewModel.set("icon", "res://ic_noticount_2_sd");
                                break;
                            case 3:
                                appViewModel.set("icon", "res://ic_noticount_3_sd");
                                break;
                            case 4:
                                appViewModel.set("icon", "res://ic_noticount_4_sd");
                                break;
                            case 5:
                                appViewModel.set("icon", "res://ic_noticount_5_sd");
                                break;
                            case 6:
                                appViewModel.set("icon", "res://ic_noticount_6_sd");
                                break;
                            case 7:
                                appViewModel.set("icon", "res://ic_noticount_7_sd");
                                break;
                            case 8:
                                appViewModel.set("icon", "res://ic_noticount_8_sd");
                                break;
                            case 9:
                                appViewModel.set("icon", "res://ic_noticount_9_sd");
                                break;
                            default:
                                appViewModel.set("icon", "res://ic_noticount_9_plus_sd");
                                break;
                        }
                        return [2 /*return*/, arrayData];
                    case 6:
                        err_1 = _a.sent();
                        console.log(err_1.message);
                        resetToLogin("Session expired, please login again - 1");
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return BasePage;
}());
exports.BasePage = BasePage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZVBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJCYXNlUGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtDQUFpQztBQUVqQyw4Q0FBa0U7QUFFbEUsa0RBQXFEO0FBQ3JELDJCQUE4QjtBQUM5QixpREFBeUQ7QUFLekQsMERBQXNEO0FBQ3RELG1DQUFxQztBQUNyQyxpQ0FBb0M7QUFDcEMsbUVBQTZFO0FBQzdFLG9DQUF1QztBQUN2QywrREFBaUQ7QUFFakQsZ0NBQW1DO0FBRW5DLElBQUksWUFBWSxHQUFHLHVCQUFVLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBQ3BILElBQUksUUFBUSxHQUFHLElBQUksZ0NBQVEsRUFBRSxDQUFDO0FBRTlCLElBQUksSUFBZ0IsQ0FBQztBQUNyQixJQUFJLFFBQXFCLENBQUM7QUFFMUIsd0JBQXdCLFVBQVU7SUFDMUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztJQUMxQixNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMzRCxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RCxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM3RCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsVUFBVSxDQUFDO0lBQzlCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUN0QixDQUFDO0FBRUQsMkJBQTJCLFVBQWlCLEVBQUUsU0FBa0I7SUFDeEQsTUFB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QUFHLENBQUMsTUFBTSxFQUFFLHlCQUF5QixDQUFFLENBQUM7Z0NBQ3JELEtBQUssQ0FBQzs0QkFDVixLQUFLLENBQUM7Z0NBQ0YsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUseUJBQXlCLENBQUUsQ0FBQztnQ0FDckQsS0FBSyxDQUFDOzRCQUNWLEtBQUssQ0FBQztnQ0FDRixZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSx5QkFBeUIsQ0FBRSxDQUFDO2dDQUNyRCxLQUFLLENBQUM7NEJBQ1YsS0FBSyxDQUFDO2dDQUNGLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLHlCQUF5QixDQUFFLENBQUM7Z0NBQ3JELEtBQUssQ0FBQzs0QkFDVixLQUFLLENBQUM7Z0NBQ0YsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUseUJBQXlCLENBQUUsQ0FBQztnQ0FDckQsS0FBSyxDQUFDOzRCQUNWLEtBQUssQ0FBQztnQ0FDRixZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSx5QkFBeUIsQ0FBRSxDQUFDO2dDQUNyRCxLQUFLLENBQUM7NEJBQ1YsS0FBSyxDQUFDO2dDQUNGLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLHlCQUF5QixDQUFFLENBQUM7Z0NBQ3JELEtBQUssQ0FBQzs0QkFDVjtnQ0FDSSxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSw4QkFBOEIsQ0FBRSxDQUFDO2dDQUMxRCxLQUFLLENBQUM7d0JBQ2QsQ0FBQzt3QkFDRCxzQkFBTyxTQUFTLEVBQUM7Ozt3QkFFakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3pCLFlBQVksQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDOzs7Ozs7S0FFL0Q7SUFDTCxlQUFDO0FBQUQsQ0FBQyxBQTlQRCxJQThQQztBQTlQcUIsNEJBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3RvcG1vc3R9IGZyb20gXCJ1aS9mcmFtZVwiO1xyXG5pbXBvcnQge1BhZ2V9IGZyb20gXCJ1aS9wYWdlXCI7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZSwgRXZlbnREYXRhLCBmcm9tT2JqZWN0fSBmcm9tIFwiZGF0YS9vYnNlcnZhYmxlXCI7XHJcbmltcG9ydCB7Vmlld30gZnJvbSBcInVpL2NvcmUvdmlld1wiO1xyXG5pbXBvcnQgYXBwU2V0dGluZ3MgPSByZXF1aXJlKCdhcHBsaWNhdGlvbi1zZXR0aW5ncycpO1xyXG5pbXBvcnQgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcclxuaW1wb3J0IHtCQVNFX1BBVEgsIFBPU1RfUEFUSH0gZnJvbSBcIi4uL2NvbW1vbi9jb25zdGFudHNcIjtcclxuaW1wb3J0IHRpbWVyID0gcmVxdWlyZSgndGltZXInKTtcclxuaW1wb3J0ICogYXMgcGFnZXMgZnJvbSBcInVpL3BhZ2VcIjtcclxuaW1wb3J0IGxpc3RWaWV3TW9kdWxlID0gcmVxdWlyZShcIm5hdGl2ZXNjcmlwdC10ZWxlcmlrLXVpL2xpc3R2aWV3XCIpO1xyXG5pbXBvcnQgdGFiID0gcmVxdWlyZShcInVpL3RhYi12aWV3XCIpO1xyXG5pbXBvcnQge09ic2VydmFibGVBcnJheX0gZnJvbSBcImRhdGEvb2JzZXJ2YWJsZS1hcnJheVwiO1xyXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICd1dGlscy91dGlscyc7XHJcbmltcG9ydCBhcHAgPSByZXF1aXJlKFwiYXBwbGljYXRpb25cIik7XHJcbmltcG9ydCB7IFROU0ZhbmN5QWxlcnQsIFROU0ZhbmN5QWxlcnRCdXR0b24gfSBmcm9tICduYXRpdmVzY3JpcHQtZmFuY3lhbGVydCc7XHJcbmltcG9ydCBkaWFsb2dzID0gcmVxdWlyZSgndWkvZGlhbG9ncycpO1xyXG5pbXBvcnQgeyBTbmFja0JhciB9IGZyb20gXCJuYXRpdmVzY3JpcHQtc25hY2tiYXJcIjtcclxuXHJcbmltcG9ydCBmcmFtZSA9IHJlcXVpcmUoJ3VpL2ZyYW1lJyk7XHJcblxyXG5sZXQgYXBwVmlld01vZGVsID0gZnJvbU9iamVjdCh7c2VsZWN0ZWRQYWdlOiAwLCBpY29uOiBcInJlczovL2ljX21lbnVfYWJcIiwgbm9SZXF1ZXN0czogdHJ1ZSwgbm9Ob3RpZmljYXRpb25zOiB0cnVlfSk7XHJcbmxldCBzbmFja2JhciA9IG5ldyBTbmFja0JhcigpO1xyXG5cclxudmFyIHBhZ2U6IHBhZ2VzLlBhZ2U7XHJcbnZhciB0YWJWaWV3MTogdGFiLlRhYlZpZXc7XHJcblxyXG5mdW5jdGlvbiBwcmVwYXJlUGF5bG9hZChtZXRob2ROYW1lKSB7XHJcbiAgICAgICAgdmFyIG9ialBheSA9IG5ldyBPYmplY3QoKTtcclxuICAgICAgICBvYmpQYXlbXCJzZXNzaW9uS2V5XCJdID0gYXBwU2V0dGluZ3MuZ2V0U3RyaW5nKFwic2Vzc2lvbktleVwiKTtcclxuICAgICAgICBvYmpQYXlbXCJpZE51bWJlclwiXSA9IGFwcFNldHRpbmdzLmdldFN0cmluZyhcImlkTnVtYmVyXCIpO1xyXG4gICAgICAgIG9ialBheVtcImRldmljZVRva2VuXCJdID0gYXBwU2V0dGluZ3MuZ2V0U3RyaW5nKFwiZGV2aWNlVG9rZW5cIik7XHJcbiAgICAgICAgb2JqUGF5W1wibWV0aG9kXCJdID0gbWV0aG9kTmFtZTtcclxuICAgICAgICB2YXIgcGF5TG9hZCA9IEpTT04uc3RyaW5naWZ5KG9ialBheSk7XHJcbiAgICAgICAgcmV0dXJuIG9ialBheTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGF0YUZyb21TZXJ2ZXIobWV0aG9kTmFtZTpzdHJpbmcsIG1lc3NhZ2VJRD86IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBwYXk6T2JqZWN0ID0gcHJlcGFyZVBheWxvYWQobWV0aG9kTmFtZSk7XHJcbiAgICAgICAgICAgIGlmKG1ldGhvZE5hbWUgPT09IFwiZ2V0TWVzc2FnZURldGFpbHNcIil7ICAgICAgICAgLy9UZW1wb3JhcnkgZm9yIGdldHRpbmcgbWVzc2FnZSBkZXRhaWxzXHJcbiAgICAgICAgICAgICAgICBwYXlbXCJjb3JyZXNwb25kZW5jZUlkXCJdID0gbWVzc2FnZUlEOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTmVlZCB0byBiZSByZW1vdmVkIGxhdGVyXHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVE8tRE9cclxuICAgICAgICAgICAgdmFyIHBheUxvYWQgPSBKU09OLnN0cmluZ2lmeShwYXkpO1xyXG4gICAgICAgICAgICBodHRwLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBCQVNFX1BBVEgrUE9TVF9QQVRILFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC10eXBlXCIgOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogcGF5TG9hZFxyXG4gICAgICAgICAgICB9KS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIlN0YXR1cyBDb2RlOiBcIiArIHJlc3BvbnNlLnN0YXR1c0NvZGUpO1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlLmNvbnRlbnQudG9KU09OKCkpO1xyXG4gICAgICAgICAgICAgICAgfWNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IoXCJJbnZhbGlkIEpTT05cIikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBlcnJvciA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IoXCJVbmFibGUgdG8gZmV0Y2ggZGF0YSBmcm9tIHNlcnZlclwiKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNldFRvTG9naW4oZXJyb3Jtc2cgOiBzdHJpbmcpe1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgdGl0bGU6IFwiXFx1MjZBMFxcdUZFMEYgQWxlcnRcIixcclxuICAgICAgICBtZXNzYWdlOiBlcnJvcm1zZyxcclxuICAgICAgICBva0J1dHRvblRleHQ6IFwiT2tcIlxyXG4gICAgfTtcclxuICAgIGRpYWxvZ3MuYWxlcnQob3B0aW9ucykudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdmFyIG5hdmlnYXRpb25FbnRyeSA9IHtcclxuICAgICAgICAgICAgbW9kdWxlTmFtZTogXCJwYWdlcy9sb2dpbi9sb2dpblwiLFxyXG4gICAgICAgICAgICBjbGVhckhpc3Rvcnk6IHRydWUsXHJcbiAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImZsaXBcIixcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAzODAsXHJcbiAgICAgICAgICAgICAgICBjdXJ2ZTogXCJlYXNlT3V0XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZnJhbWUudG9wbW9zdCgpLm5hdmlnYXRlKG5hdmlnYXRpb25FbnRyeSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VQYWdlIHtcclxuICAgIC8vaW1wbGVtZW50IHRoaXMgZnVuY3Rpb24gaW4gdGhlIGluaGVyaXRpbmcgcGFnZXMgdG8gc2V0IHRoZWlyIHNwZWNpZmljIGJpbmRpbmcgY29udGV4dFxyXG4gICAgYWJzdHJhY3QgbWFpbkNvbnRlbnRMb2FkZWQoYXJnczpFdmVudERhdGEpO1xyXG5cclxuICAgIGxvYWRlZChhcmdzKXtcclxuICAgICAgICBwYWdlID0gPHBhZ2VzLlBhZ2U+YXJncy5vYmplY3Q7XHJcbiAgICAgICAgcGFnZS5iaW5kaW5nQ29udGV4dCA9IGFwcFZpZXdNb2RlbDtcclxuICAgICAgICB0YWJWaWV3MSA9IDx0YWIuVGFiVmlldz5wYWdlLmdldFZpZXdCeUlkKFwidGFiVmlldzFcIik7XHJcbiAgICAgICAgdGFiVmlldzEuc2VsZWN0ZWRJbmRleCA9IDA7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRvZ2dsZURyYXdlcigpe1xyXG4gICAgICAgIGxldCBwYWdlID0gPFBhZ2U+dG9wbW9zdCgpLmN1cnJlbnRQYWdlO1xyXG4gICAgICAgIGxldCBkcmF3ZXIgPSA8YW55PnBhZ2UuZ2V0Vmlld0J5SWQoXCJkcmF3ZXJcIik7XHJcbiAgICAgICAgZHJhd2VyLnRvZ2dsZURyYXdlclN0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBuYXZpZ2F0ZShhcmdzKXtcclxuICAgICAgICBsZXQgcGFnZU5hbWUgPSBhcmdzLnZpZXcudGV4dC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGFwcFZpZXdNb2RlbC5zZXQoXCJzZWxlY3RlZFBhZ2VcIiwgcGFnZU5hbWUpO1xyXG4gICAgICAgIHRvcG1vc3QoKS5uYXZpZ2F0ZShcInBhZ2VzL1wiICsgcGFnZU5hbWUgKyBcIi9cIiArIHBhZ2VOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VUYWIoYXJncykge1xyXG4gICAgICAgIGxldCBwYWdlID0gPFBhZ2U+dG9wbW9zdCgpLmN1cnJlbnRQYWdlO1xyXG4gICAgICAgIC8vIHZhciB0YWJWaWV3SW5zaWRlOiB0YWIuVGFiVmlldyA9IDx0YWIuVGFiVmlldz5wYWdlLmdldFZpZXdCeUlkKFwidGFiVmlldzFcIik7XHJcbiAgICAgICAgbGV0IHBhZ2VOYW1lOnN0cmluZyA9IGFyZ3Mudmlldy50ZXh0LnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgc3dpdGNoIChwYWdlTmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlICc0IHVucmVhZCc6XHJcbiAgICAgICAgICAgICAgICB0YWJWaWV3MS5zZWxlY3RlZEluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICcxMCBwZW5kaW5nJzpcclxuICAgICAgICAgICAgICAgIHRhYlZpZXcxLnNlbGVjdGVkSW5kZXggPSAxO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJzEgbmV3JzpcclxuICAgICAgICAgICAgICAgIHRhYlZpZXcxLnNlbGVjdGVkSW5kZXggPSAyO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJzIgdG9kYXknOlxyXG4gICAgICAgICAgICAgICAgdGFiVmlldzEuc2VsZWN0ZWRJbmRleCA9IDM7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnMSBmb3J1bSc6XHJcbiAgICAgICAgICAgICAgICB0YWJWaWV3MS5zZWxlY3RlZEluZGV4ID0gNDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwic2VsZWN0ZWRQYWdlXCIsIHRhYlZpZXcxLnNlbGVjdGVkSW5kZXgpO1xyXG4gICAgICAgIGxldCBkcmF3ZXIgPSA8YW55PnBhZ2UuZ2V0Vmlld0J5SWQoXCJkcmF3ZXJcIik7XHJcbiAgICAgICAgZHJhd2VyLnRvZ2dsZURyYXdlclN0YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1NvY2lhbCgpe1xyXG4gICAgICAgIC8vRnVuY3Rpb24gdG8gb3BlbiB0aGUgU29jaWFsIENvbm5lY3QgUG9wLXVwXHJcbiAgICAgICAgdmFyIGZ1bGxzY3JuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qKioqKkRpZmZlcmVuY2UgaW4gaW1wbGVtZW50YXRpb24gb2YgaU9TIGFuZCBBbmRyb2lkKioqKi9cclxuXHJcbiAgICAgICAgLy9DaGVjayBpZiB0aGUgcGxhdGZvcm0gaXMgaU9TIC0tPiBVc2luZyBGYW5jeUFsZXJ0IFBsdWdpbiBmb3IgaU9TXHJcbiAgICAgICAgaWYoYXBwLmlvcykge1xyXG4gICAgICAgICAgICBUTlNGYW5jeUFsZXJ0LnNob3VsZERpc21pc3NPblRhcE91dHNpZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBUTlNGYW5jeUFsZXJ0LnNob3dBbmltYXRpb25UeXBlID0gVE5TRmFuY3lBbGVydC5TSE9XX0FOSU1BVElPTl9UWVBFUy5TbGlkZUluRnJvbUxlZnQ7XHJcbiAgICAgICAgICAgIFROU0ZhbmN5QWxlcnQuaGlkZUFuaW1hdGlvblR5cGUgPSBUTlNGYW5jeUFsZXJ0LkhJREVfQU5JTUFUSU9OX1RZUEVTLlNsaWRlT3V0VG9SaWdodDtcclxuICAgICAgICAgICAgVE5TRmFuY3lBbGVydC5iYWNrZ3JvdW5kVHlwZSA9IFROU0ZhbmN5QWxlcnQuQkFDS0dST1VORF9UWVBFUy5CbHVyO1xyXG4gICAgICAgICAgICBsZXQgYnV0dG9ucyA9IFtcclxuICAgICAgICAgICAgICAgIG5ldyBUTlNGYW5jeUFsZXJ0QnV0dG9uKHsgbGFiZWw6ICdZb3VUdWJlJywgYWN0aW9uOiAoKSA9PiB7IHV0aWxzLm9wZW5VcmwoXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS91c2VyL2ludGxzZXJ2XCIpOyB9IH0pLFxyXG4gICAgICAgICAgICAgICAgbmV3IFROU0ZhbmN5QWxlcnRCdXR0b24oeyBsYWJlbDogJ0ZhY2Vib29rJywgYWN0aW9uOiAoKSA9PiB7IHV0aWxzLm9wZW5VcmwoXCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vaXUub2lzXCIpOyB9IH0pLFxyXG4gICAgICAgICAgICAgICAgbmV3IFROU0ZhbmN5QWxlcnRCdXR0b24oeyBsYWJlbDogJ0luc3RhZ3JhbScsIGFjdGlvbjogKCkgPT4geyB1dGlscy5vcGVuVXJsKFwiaHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9pdV9vaXMvXCIpOyB9IH0pLFxyXG4gICAgICAgICAgICAgICAgbmV3IFROU0ZhbmN5QWxlcnRCdXR0b24oeyBsYWJlbDogJ1R3aXR0ZXInLCBhY3Rpb246ICgpID0+IHsgdXRpbHMub3BlblVybChcImh0dHBzOi8vdHdpdHRlci5jb20vaXVfb2lzXCIpOyB9IH0pLFxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBUTlNGYW5jeUFsZXJ0LnNob3dDdXN0b21CdXR0b25zKGJ1dHRvbnMsICdpY19ncm91cF93aGl0ZV8zNnB0LnBuZycsICcjN0QxMTBDJywgJ0Nvbm5lY3Qgd2l0aCBVcycsIHVuZGVmaW5lZCwgJ09rJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9JbXBsZW1lbnRhdGlvbiBmb3IgQW5kcm9pZFxyXG4gICAgICAgICAgICAvL1VzaW5nIE1vZGFsIFBhZ2VcclxuICAgICAgICAgICAgcGFnZS5zaG93TW9kYWwoXCJjb21tb24vc29jaWFsTW9kYWxcIiwgXCJzb2NpYWxcIiwgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlByZXNzZWRcIik7XHJcbiAgICAgICAgICAgIH0sIGZ1bGxzY3JuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9GdW5jdGlvbiBmb3IgcHJlcGFyaW5nIHRoZSBQYXlMb2FkIGZvciBzZXJ2ZXIgY2FsbHNcclxuICAgIC8vVE8tRE86IEFkZCBsb2dpYyB0byBtYWtlIHRoZSBwcmVwYXJlUGF5TG9hZCBmdW5jdGlvbiBnZW5lcmljIHNvIHRoYXQgaXQgbWF5IGFjY2VwdCBkaWZmZXJlbnQgbWV0aG9kcyBhcyBwYXJhbWV0ZXJzXHJcbiAgICAvLyBwcmVwYXJlUGF5bG9hZCgpIHtcclxuICAgIC8vICAgICB2YXIgb2JqUGF5ID0gbmV3IE9iamVjdCgpO1xyXG4gICAgLy8gICAgIG9ialBheVtcInNlc3Npb25LZXlcIl0gPSBhcHBTZXR0aW5ncy5nZXRTdHJpbmcoXCJzZXNzaW9uS2V5XCIpO1xyXG4gICAgLy8gICAgIG9ialBheVtcImlkTnVtYmVyXCJdID0gYXBwU2V0dGluZ3MuZ2V0U3RyaW5nKFwiaWROdW1iZXJcIik7XHJcbiAgICAvLyAgICAgb2JqUGF5W1wiZGV2aWNlVG9rZW5cIl0gPSBhcHBTZXR0aW5ncy5nZXRTdHJpbmcoXCJkZXZpY2VUb2tlblwiKTtcclxuICAgIC8vICAgICBvYmpQYXlbXCJtZXRob2RcIl0gPSBcImdldExpc3RJdGVtc1wiO1xyXG4gICAgLy8gICAgIHZhciBwYXlMb2FkID0gSlNPTi5zdHJpbmdpZnkob2JqUGF5KTtcclxuICAgIC8vICAgICBjb25zb2xlLmxvZyhcIlBheWxvYWQgLS0+IFwiICsgcGF5TG9hZCk7XHJcbiAgICAvLyAgICAgcmV0dXJuIHBheUxvYWQ7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy9GdW5jdGlvbiBmb3IgaGFuZGxpbmcgb25UYXAgZXZlbnQgb2YgTGlzdHZpZXcuIFRoaXMgc2hvd3MgdGhlIGRldGFpbHMgb2YgdGhlIE5vdGlmaWNhdGlvbnMgYW5kIFJlcXVlc3RcclxuICAgIC8vU2hvd3MgYSBtb2RhbCBwYWdlIHdpdGggSFRNTCBjb250ZW50IG9mIHRoZSBtZXNzYWdlXHJcbiAgICAvL1RPLURPOiBOZWVkIHRvIGFkZCBleHRyYSBsb2dpYyBmb3IgaGFuZGxpbmcgYWxsIHR5cGVzIG9mIG5vdGlmaWNhdGlvbnMgYW5kIHJlcXVlc3RzXHJcbiAgICBvblRhcChhcmdzOiBsaXN0Vmlld01vZHVsZS5MaXN0Vmlld0V2ZW50RGF0YSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBmdWxsc2NybiA9IHRydWU7XHJcbiAgICAgICAgdmFyIG9ic3JBcnJheTtcclxuICAgICAgICB2YXIgdGl0bGU7XHJcbiAgICAgICAgdmFyIHRhYkluZGV4ID0gdGFiVmlldzEuc2VsZWN0ZWRJbmRleDtcclxuICAgICAgICB2YXIgY29ycmVzcG9uZGVuY2VJZDtcclxuICAgICAgICBpZih0YWJJbmRleCA9PT0gMCl7XHJcbiAgICAgICAgICAgIHZhciBsaXN0Q29udGV4dCA9IGFwcFZpZXdNb2RlbC5nZXQoXCJub3RpTGlzdFwiKTtcclxuICAgICAgICAgICAgY29ycmVzcG9uZGVuY2VJZCA9IGxpc3RDb250ZXh0W2FyZ3MuaW5kZXhdW1wiY29ycmVzcG9uZGVuY2VJZFwiXTtcclxuICAgICAgICB9ZWxzZSBpZih0YWJJbmRleCA9PT0gMSl7XHJcbiAgICAgICAgICAgIC8vVE9ETzogV2hlbiB3ZSBoYXZlIHJlcXVlc3Qgd29ya2luZ1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb2RlIGZvciBzZXJ2ZXIgY2FsbCB0byBnZXQgdGhlIG1lc3NhZ2UgZGV0YWlscy5cclxuICAgICAgICAgKiBOZWVkIHRvIGFkZCBtb3JlIGxvZ2ljLiBJbml0aWFsIHNrZWxldG9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldERhdGFGcm9tU2VydmVyKFwiZ2V0TWVzc2FnZURldGFpbHNcIiwgY29ycmVzcG9uZGVuY2VJZCkudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJNZXNzYWdlIERldGFpbHM6IFwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhlcmVcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgaHRtbENvbnRlbnQgPSBkYXRhW1wiZGF0YVwiXTtcclxuICAgICAgICAgICAgdmFyIGFjdGlvbnMgPSBkYXRhW1wibW9iaWxlQWN0aW9uc1wiXTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJIVE1MIENvbnRlbnQ6IFwiICsgSlNPTi5zdHJpbmdpZnkoaHRtbENvbnRlbnQpKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBY3Rpb25zIDogXCIgKyBKU09OLnN0cmluZ2lmeShhY3Rpb25zKSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgbmF2aWdhdGlvbkVudHJ5ID0ge1xyXG4gICAgICAgICAgICAgICAgbW9kdWxlTmFtZTogXCJjb21tb24vbWVzc2FnZURldGFpbHNcIixcclxuICAgICAgICAgICAgICAgIGFuaW1hdGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMzgwLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnZlOiBcImVhc2VJblwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY29udGV4dDogZGF0YVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZyYW1lLnRvcG1vc3QoKS5uYXZpZ2F0ZShuYXZpZ2F0aW9uRW50cnkpO1xyXG4gICAgICAgIH0sIGVycm9yID0+IHtcclxuICAgICAgICAgICAgc25hY2tiYXIuc2ltcGxlKCdVbmFibGUgdG8gZmV0Y2ggZGV0YWlscycpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVuYWJsZSB0byBmZXRjaCBtZXNzYWdlIGRldGFpbHMgOiBcIiArIGVycm9yKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vRnVuY3Rpb24gdG8gaGFuZGxlIHB1bGwgdG8gcmVmcmVzaCBldmVudCBvbiB0aGUgbGlzdCB2aWV3cy5cclxuICAgIC8vU2FtcGxlIENvZGUgYXQgdGhpcyBwb2ludC5cclxuICAgIC8vVE8tRE86IEFkZCBsb2dpYyBmb3Igc2VydmVyIGNhbGwgb25jZSBzZXJ2ZXIgc2lkZSBjb2RlIGlzIHJlYWR5LlxyXG4gICAgcHVsbFRvUmVmcmVzaEluaXRpYXRlZChhcmdzOiBsaXN0Vmlld01vZHVsZS5MaXN0Vmlld0V2ZW50RGF0YSl7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJQVUxMIFRPIFJFRlJFU0ggSU5JVElBVEVEXCIpO1xyXG4gICAgICAgIC8vIHZhciBwYXlMb2FkOk9iamVjdCA9IHByZXBhcmVQYXlsb2FkKFwiZ2V0TGlzdEl0ZW1zXCIpO1xyXG4gICAgICAgIC8vIHZhciBwYXkgPSBKU09OLnN0cmluZ2lmeShwYXlMb2FkKTtcclxuICAgICAgICBnZXREYXRhRnJvbVNlcnZlcihcImdldExpc3RJdGVtc1wiLCB1bmRlZmluZWQpLnRoZW4oXHJcbiAgICAgICAgICAgIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIk5vdGlmaWNhdGlvbiBBcnJheSAgLS0tLS0tPiA6IFwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFycmF5biA9IG5ldyBPYnNlcnZhYmxlQXJyYXkoZGF0YVtcIm5vdGlmaWNhdGlvbnNcIl0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFycmF5cmVxID0gbmV3IE9ic2VydmFibGVBcnJheShkYXRhW1wicmVxdWVzdHNcIl0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXBhbGwgPSBkYXRhW1wibm90aWZpY2F0aW9uc1wiXTtcclxuICAgICAgICAgICAgICAgIHZhciBhbGxhcnJheSA9IHRlbXBhbGwuY29uY2F0KGRhdGFbXCJyZXF1ZXN0c1wiXSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyYXlhbGwgPSBuZXcgT2JzZXJ2YWJsZUFycmF5KGFsbGFycmF5KTtcclxuICAgICAgICAgICAgICAgIGxldCB2aWV3OlZpZXcgPSA8Vmlldz4gYXJncy5vYmplY3Q7XHJcbiAgICAgICAgICAgICAgICB2aWV3LnBhcmVudC5wYXJlbnQucGFyZW50LmJpbmRpbmdDb250ZXh0ID0ge25vdGlmaWNhdGlvbkxpc3Q6YXJyYXlhbGwsIG5vdGlMaXN0OmFycmF5biwgcmVxdWVzdExpc3Q6YXJyYXlyZXF9O1xyXG4gICAgICAgICAgICAgICAgYXJncy5vYmplY3Qubm90aWZ5UHVsbFRvUmVmcmVzaEZpbmlzaGVkKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgIGFyZ3Mub2JqZWN0Lm5vdGlmeVB1bGxUb1JlZnJlc2hGaW5pc2hlZCgpO1xyXG4gICAgICAgICAgICB9ICk7XHJcbiAgICAgICAgaWYgKGFwcC5hbmRyb2lkKXtcclxuICAgICAgICAgICAgYXJncy5vYmplY3Qubm90aWZ5UHVsbFRvUmVmcmVzaEZpbmlzaGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vRnVuY3Rpb24gdGhhdCBtYWtlcyBzZXJ2ZXIgY2FsbCB0byBnZXQgTGlzdEl0ZW1zIChOb3RpZmljYXRpb24gYW5kIFJlcXVlc3RzKSBvZiBMYW5kaW5nIFBhZ2UgTGlzdCBWaWV3c1xyXG4gICAgYXN5bmMgZ2V0RGF0YUZyb21TZXJ2ZXIobWV0aG9kTmFtZTpzdHJpbmcpIHtcclxuICAgICAgICB2YXIgcGF5Ok9iamVjdCA9IHByZXBhcmVQYXlsb2FkKG1ldGhvZE5hbWUpO1xyXG4gICAgICAgIC8vIGlmKG1ldGhvZE5hbWUubG9jYWxlQ29tcGFyZShcImdldE1lc3NhZ2VEZXRhaWxzXCIpICl7ICAgICAgICAgLy9UZW1wb3JhcnkgZm9yIGdldHRpbmcgbWVzc2FnZSBkZXRhaWxzXHJcbiAgICAgICAgLy8gICAgIHBheVtcIm1lc3NhZ2VJRFwiXSA9IFwiMVwiOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTmVlZCB0byBiZSByZW1vdmVkIGxhdGVyXHJcbiAgICAgICAgLy8gfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9UTy1ET1xyXG4gICAgICAgIHZhciBwYXlMb2FkID0gSlNPTi5zdHJpbmdpZnkocGF5KTtcclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIGxldCByZXNwID0gYXdhaXQgaHR0cC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogQkFTRV9QQVRIK1BPU1RfUEFUSCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtdHlwZVwiIDogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHBheUxvYWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIGxldCBhcnJheURhdGEgPSBhd2FpdCByZXNwLmNvbnRlbnQudG9KU09OKCk7XHJcbiAgICAgICAgICAgIGxldCBhcnJheURhdGEgPSBhd2FpdCByZXNwLmNvbnRlbnQudG9KU09OKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhpcyB3b3JrczogXCIgKyBhcnJheURhdGEpO1xyXG4gICAgICAgICAgICBsZXQgbm90aWZpQXJyYXkgPSBhd2FpdCBhcnJheURhdGFbXCJub3RpZmljYXRpb25zXCJdO1xyXG4gICAgICAgICAgICB2YXIgZXJyb3Jtc2cgPSBhcnJheURhdGFbJ2Vycm9yJ107XHJcbiAgICAgICAgICAgIGlmIChlcnJvcm1zZykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBKU09OLnN0cmluZ2lmeShlcnJvcm1zZykpO1xyXG4gICAgICAgICAgICAgICAgcmVzZXRUb0xvZ2luKEpTT04uc3RyaW5naWZ5KGVycm9ybXNnKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdEFycmF5ID0gYXdhaXQgYXJyYXlEYXRhW1wicmVxdWVzdHNcIl07XHJcbiAgICAgICAgICAgIGxldCBjb3VudDpudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBsZXQgbm90aUNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdENvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBub3RpZmlBcnJheS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRbXCJyZWFkRmxhZ1wiXSA9PT0gXCJOT1wiKXtcclxuICAgICAgICAgICAgICAgICAgICBub3RpQ291bnQgPSBub3RpQ291bnQgKyAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmVxdWVzdEFycmF5LmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudFtcInJlYWRGbGFnXCJdID09PSBcIk5PXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RDb3VudCA9IHJlcXVlc3RDb3VudCArIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb3VudCA9IG5vdGlDb3VudCArIHJlcXVlc3RDb3VudDtcclxuXHJcbiAgICAgICAgICAgIHZhciBub05vdGlmaWNhdGlvbnMgPSBub3RpZmlBcnJheS5sZW5ndGggPT0gMCA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIG5vUmVxdWVzdHMgPSByZXF1ZXN0QXJyYXkubGVuZ3RoID09IDAgPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwibm90aUxpc3RcIiwgbm90aWZpQXJyYXkpO1xyXG4gICAgICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwicmVxdWVzdExpc3RcIiwgcmVxdWVzdEFycmF5KTtcclxuICAgICAgICAgICAgYXBwVmlld01vZGVsLnNldChcIm5vTm90aWZpY2F0aW9uc1wiLCBub05vdGlmaWNhdGlvbnMpO1xyXG4gICAgICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwibm9SZXF1ZXN0c1wiLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAoY291bnQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwiaWNvblwiLCBcInJlczovL2ljX25vdGljb3VudF8wX3NkXCIgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwiaWNvblwiLCBcInJlczovL2ljX25vdGljb3VudF8xX3NkXCIgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwiaWNvblwiLCBcInJlczovL2ljX25vdGljb3VudF8yX3NkXCIgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwiaWNvblwiLCBcInJlczovL2ljX25vdGljb3VudF8zX3NkXCIgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwiaWNvblwiLCBcInJlczovL2ljX25vdGljb3VudF80X3NkXCIgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwiaWNvblwiLCBcInJlczovL2ljX25vdGljb3VudF81X3NkXCIgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgICAgICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwiaWNvblwiLCBcInJlczovL2ljX25vdGljb3VudF82X3NkXCIgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgICAgICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwiaWNvblwiLCBcInJlczovL2ljX25vdGljb3VudF83X3NkXCIgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwiaWNvblwiLCBcInJlczovL2ljX25vdGljb3VudF84X3NkXCIgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgOTpcclxuICAgICAgICAgICAgICAgICAgICBhcHBWaWV3TW9kZWwuc2V0KFwiaWNvblwiLCBcInJlczovL2ljX25vdGljb3VudF85X3NkXCIgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwVmlld01vZGVsLnNldChcImljb25cIiwgXCJyZXM6Ly9pY19ub3RpY291bnRfOV9wbHVzX3NkXCIgKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXlEYXRhO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHJlc2V0VG9Mb2dpbihcIlNlc3Npb24gZXhwaXJlZCwgcGxlYXNlIGxvZ2luIGFnYWluIC0gMVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=