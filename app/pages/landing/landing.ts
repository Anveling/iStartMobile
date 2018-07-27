import {BasePage} from "../../common/BasePage";
import {Observable, EventData} from "data/observable";
import {View} from "ui/core/view";
import {ObservableArray} from "data/observable-array";

import http = require('http');
import {BASE_PATH, POST_PATH} from "../../common/constants";
import appSettings = require('application-settings');
import timer = require('timer');
import {LoadingIndicator} from "nativescript-loading-indicator";

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

class LandingPage extends BasePage{
    mainContentLoaded(args:EventData){
        
        // var payLoad = super.preparePayload();
        var arrayNotification;

        super.getDataFromServer("getListItems").then(data =>{
            console.log("Notification Array : " + JSON.stringify(data));
            // var arrayn = new ObservableArray(data["notifications"]);
            // var arrayreq = new ObservableArray(data["requests"]);
            // var tempall = data["notifications"];
            // var allarray = tempall.concat(data["requests"]);                    //Merge notifications and requests to make all array
            // var arrayall = new ObservableArray(allarray);
            // let view = <View>args.object;
            // view.bindingContext = {notificationList:arrayn, notiList:arrayn, requestList:arrayreq};
        });
    }
}

export = new LandingPage();