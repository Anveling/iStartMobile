import {topmost} from "ui/frame";
import {Page} from "ui/page";
import {Observable, EventData, fromObject} from "data/observable";
import {View} from "ui/core/view";
import appSettings = require('application-settings');
import http = require('http');
import {BASE_PATH, POST_PATH} from "../common/constants";
import timer = require('timer');
import * as pages from "ui/page";
import listViewModule = require("nativescript-telerik-ui/listview");
import tab = require("ui/tab-view");
import {ObservableArray} from "data/observable-array";
import * as utils from 'utils/utils';
import app = require("application");
import { TNSFancyAlert, TNSFancyAlertButton } from 'nativescript-fancyalert';
import dialogs = require('ui/dialogs');
import { SnackBar } from "nativescript-snackbar";

import frame = require('ui/frame');

let appViewModel = fromObject({selectedPage: 0, icon: "res://ic_menu_ab", noRequests: true, noNotifications: true});
let snackbar = new SnackBar();

var page: pages.Page;
var tabView1: tab.TabView;

function preparePayload(methodName) {
        var objPay = new Object();
        objPay["sessionKey"] = appSettings.getString("sessionKey");
        objPay["idNumber"] = appSettings.getString("idNumber");
        objPay["deviceToken"] = appSettings.getString("deviceToken");
        objPay["method"] = methodName;
        var payLoad = JSON.stringify(objPay);
        return objPay;
}

function getDataFromServer(methodName:string, messageID?: string) {
        return new Promise((resolve, reject) => {
            var pay:Object = preparePayload(methodName);
            if(methodName === "getMessageDetails"){         //Temporary for getting message details
                pay["correspondenceId"] = messageID;                                 //Need to be removed later
            }                                                           //TO-DO
            var payLoad = JSON.stringify(pay);
            http.request({
                url: BASE_PATH+POST_PATH,
                method: 'POST',
                headers: { "Content-type" : "application/json" },
                content: payLoad
            }).then(response => {
                console.log( "Status Code: " + response.statusCode);
                try {
                    resolve(response.content.toJSON());
                }catch {
                    reject(Error("Invalid JSON"));
                }
            }, error => {
                reject(Error("Unable to fetch data from server"));
            });
        });
}

function resetToLogin(errormsg : string){
    var options = {
        title: "\u26A0\uFE0F Alert",
        message: errormsg,
        okButtonText: "Ok"
    };
    dialogs.alert(options).then(() => {
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

export abstract class BasePage {
    //implement this function in the inheriting pages to set their specific binding context
    abstract mainContentLoaded(args:EventData);

    loaded(args){
        page = <pages.Page>args.object;
        page.bindingContext = appViewModel;
        tabView1 = <tab.TabView>page.getViewById("tabView1");
        tabView1.selectedIndex = 0;
    }
    
    toggleDrawer(){
        let page = <Page>topmost().currentPage;
        let drawer = <any>page.getViewById("drawer");
        drawer.toggleDrawerState();
    }
    navigate(args){
        let pageName = args.view.text.toLowerCase();
        appViewModel.set("selectedPage", pageName);
        topmost().navigate("pages/" + pageName + "/" + pageName);
    }

    changeTab(args) {
        let page = <Page>topmost().currentPage;
        // var tabViewInside: tab.TabView = <tab.TabView>page.getViewById("tabView1");
        let pageName:string = args.view.text.toLowerCase();
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
        let drawer = <any>page.getViewById("drawer");
        drawer.toggleDrawerState();
    }

    showSocial(){
        //Function to open the Social Connect Pop-up
        var fullscrn = false;

        /*****Difference in implementation of iOS and Android****/

        //Check if the platform is iOS --> Using FancyAlert Plugin for iOS
        if(app.ios) {
            TNSFancyAlert.shouldDismissOnTapOutside = true;
            TNSFancyAlert.showAnimationType = TNSFancyAlert.SHOW_ANIMATION_TYPES.SlideInFromLeft;
            TNSFancyAlert.hideAnimationType = TNSFancyAlert.HIDE_ANIMATION_TYPES.SlideOutToRight;
            TNSFancyAlert.backgroundType = TNSFancyAlert.BACKGROUND_TYPES.Blur;
            let buttons = [
                new TNSFancyAlertButton({ label: 'YouTube', action: () => { utils.openUrl("https://www.youtube.com/user/intlserv"); } }),
                new TNSFancyAlertButton({ label: 'Facebook', action: () => { utils.openUrl("https://www.facebook.com/iu.ois"); } }),
                new TNSFancyAlertButton({ label: 'Instagram', action: () => { utils.openUrl("https://www.instagram.com/iu_ois/"); } }),
                new TNSFancyAlertButton({ label: 'Twitter', action: () => { utils.openUrl("https://twitter.com/iu_ois"); } }),
            ];
            TNSFancyAlert.showCustomButtons(buttons, 'ic_group_white_36pt.png', '#7D110C', 'Connect with Us', undefined, 'Ok');
        } else {
            //Implementation for Android
            //Using Modal Page
            page.showModal("common/socialModal", "social", function(data){
                console.log("Pressed");
            }, fullscrn);
        }
    }

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
    onTap(args: listViewModule.ListViewEventData) {
        
        var fullscrn = true;
        var obsrArray;
        var title;
        var tabIndex = tabView1.selectedIndex;
        var correspondenceId;
        if(tabIndex === 0){
            var listContext = appViewModel.get("notiList");
            correspondenceId = listContext[args.index]["correspondenceId"];
        }else if(tabIndex === 1){
            //TODO: When we have request working
        }
        
        /**
         * Code for server call to get the message details.
         * Need to add more logic. Initial skeleton.
         */
        getDataFromServer("getMessageDetails", correspondenceId).then(data => {
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
            }
            frame.topmost().navigate(navigationEntry);
        }, error => {
            snackbar.simple('Unable to fetch details');
            console.log("Unable to fetch message details : " + error);
        });

    }


    //Function to handle pull to refresh event on the list views.
    //Sample Code at this point.
    //TO-DO: Add logic for server call once server side code is ready.
    pullToRefreshInitiated(args: listViewModule.ListViewEventData){
        // console.log("PULL TO REFRESH INITIATED");
        // var payLoad:Object = preparePayload("getListItems");
        // var pay = JSON.stringify(payLoad);
        getDataFromServer("getListItems", undefined).then(
            data => {
                //console.log("Notification Array  ------> : " + JSON.stringify(data));
                var arrayn = new ObservableArray(data["notifications"]);
                var arrayreq = new ObservableArray(data["requests"]);
                var tempall = data["notifications"];
                var allarray = tempall.concat(data["requests"]);
                var arrayall = new ObservableArray(allarray);
                let view:View = <View> args.object;
                view.parent.parent.parent.bindingContext = {notificationList:arrayall, notiList:arrayn, requestList:arrayreq};
                args.object.notifyPullToRefreshFinished();
            },
            error => {
                args.object.notifyPullToRefreshFinished();
            } );
        if (app.android){
            args.object.notifyPullToRefreshFinished();
        }
    }

    //Function that makes server call to get ListItems (Notification and Requests) of Landing Page List Views
    async getDataFromServer(methodName:string) {
        var pay:Object = preparePayload(methodName);
        // if(methodName.localeCompare("getMessageDetails") ){         //Temporary for getting message details
        //     pay["messageID"] = "1";                                 //Need to be removed later
        // }                                                           //TO-DO
        var payLoad = JSON.stringify(pay);
        try{
            let resp = await http.request({
                url: BASE_PATH+POST_PATH,
                method: 'POST',
                headers: { "Content-type" : "application/json" },
                content: payLoad
            });
            // let arrayData = await resp.content.toJSON();
            let arrayData = await resp.content.toJSON();
            console.log("This works: " + arrayData);
            let notifiArray = await arrayData["notifications"];
            var errormsg = arrayData['error'];
            if (errormsg) {
                console.log("Error: " + JSON.stringify(errormsg));
                resetToLogin(JSON.stringify(errormsg));
                return null;
            }
            let requestArray = await arrayData["requests"];
            let count:number = 0;
            let notiCount: number = 0;
            let requestCount: number = 0;
            notifiArray.forEach(element => {
                if (element["readFlag"] === "NO"){
                    notiCount = notiCount + 1;
                }
            });
            requestArray.forEach(element => {
                if (element["readFlag"] === "NO"){
                    requestCount = requestCount + 1;
                }
            });
            count = notiCount + requestCount;

            var noNotifications = notifiArray.length == 0 ? true : false;
            var noRequests = requestArray.length == 0 ? true : false;

            appViewModel.set("notiList", notifiArray);
            appViewModel.set("requestList", requestArray);
            appViewModel.set("noNotifications", noNotifications);
            appViewModel.set("noRequests", true);

            switch (count) {
                case 0:
                    appViewModel.set("icon", "res://ic_noticount_0_sd" );
                    break;
                case 1:
                    appViewModel.set("icon", "res://ic_noticount_1_sd" );
                    break;
                case 2:
                    appViewModel.set("icon", "res://ic_noticount_2_sd" );
                    break;
                case 3:
                    appViewModel.set("icon", "res://ic_noticount_3_sd" );
                    break;
                case 4:
                    appViewModel.set("icon", "res://ic_noticount_4_sd" );
                    break;
                case 5:
                    appViewModel.set("icon", "res://ic_noticount_5_sd" );
                    break;
                case 6:
                    appViewModel.set("icon", "res://ic_noticount_6_sd" );
                    break;
                case 7:
                    appViewModel.set("icon", "res://ic_noticount_7_sd" );
                    break;
                case 8:
                    appViewModel.set("icon", "res://ic_noticount_8_sd" );
                    break;
                case 9:
                    appViewModel.set("icon", "res://ic_noticount_9_sd" );
                    break;
                default:
                    appViewModel.set("icon", "res://ic_noticount_9_plus_sd" );
                    break;
            }
            return arrayData;
        } catch (err) {
            console.log(err.message);
            resetToLogin("Session expired, please login again - 1");
        }
    }
}