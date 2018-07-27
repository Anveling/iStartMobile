'use strict'

import * as pages from "ui/page";
import * as textField from "ui/text-field";
import * as observable from "data/observable";
import {View} from "ui/core/view";
import app = require("application");
import {LoadingIndicator} from "nativescript-loading-indicator";
import frame = require('ui/frame');
import * as utils from 'utils/utils';
import {WebView} from 'ui/web-view';
import {GridLayout, ItemSpec} from 'ui/layouts/grid-layout';
import {Button} from 'ui/button';
import {Label} from 'ui/label';
import {ActionBar, ActionItem} from "ui/action-bar";
import appSettings = require('application-settings');

var page: pages.Page;
var context: any;
var closeCallback: Function;
var loader = new LoadingIndicator(); 
var i = 1;

var pattern = new RegExp(
    "^" +
    // protocol identifier
    "(?:(?:https?|ftp)://)" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broacast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
      // host name
      "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
      // domain name
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
      // TLD identifier
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
      // TLD may end with dot
      "\\.?" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:[/?#]\\S*)?" +
  "$", "i"
  );

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

var isItemVisible: boolean = false;
var singleAction: boolean = false;
var pageData = new observable.Observable();
var actionList;

export function loaded(args) {
  page = <pages.Page>args.object;
  var actionBar: ActionBar = <ActionBar> page.getElementById("actionBar");
  var actionItem: ActionItem = actionBar.actionItems.getItemAt(0);
  actionItem.visibility = 'invisible';
  //loader.show();
  //console.log("temppage.onShownModally, context: " + page.navigationContext["content"]);
  context = page.navigationContext;
  var title = context["title"];
  var htmlString = context["data"];
  
  actionList = context["mobileActions"];
  pageData.set("title", title);
  pageData.set("isItemVisible", isItemVisible);
  pageData.set("singleAction", singleAction);
  
  pageData.set("htmlString", htmlString);
  page.bindingContext = pageData;

  //TODO: Need to fix this based on the new mobileActions format
  for( var i = 0; i < actionList.length; i++) {
    var actionText:String = actionList[i]["icon"] +" "+ actionList[i]["label"];
    var bindingText = "actionLabel" + i;
    pageData.set(bindingText,actionList[i]["label"]);
    var iconText = "actionIcon" + i;
    pageData.set(iconText,actionList[i]["icon"]);
    var linkBtext = "actionLink" + i;
    pageData.set(linkBtext, actionList[i]["link"]);
    // console.log("Action Label " + actions[i]["label"]);
    // console.log(actions[i]["label"] && isItemVisible);
    // console.log(Boolean(actions[i]["label"] && isItemVisible));
  }
  if (actionList.length == 1){
    pageData.set("singleAction", !pageData.get("singleAction"));
    var acLabelShow:Label = <Label>page.getViewById("acLabelShow");
    acLabelShow.text = pageData.get("actionLabel0");
  }
  var webView: WebView = <WebView> page.getViewById("msgWebView");
  if(app.android) {
    webView.android.getSettings().setBuiltInZoomControls(false);
    webView.android.getSettings().setMediaPlaybackRequiresUserGesture(false);
  }

  webView.on(WebView.loadFinishedEvent, function(args: any){
    console.log(actionItem.visibility);
    var url = webView.src;
    if (pattern.test(url)){
        actionItem.visibility = 'visible'; 
    }
  });

  /*setTimeout(function(){
    loader.hide();
  }, 1000);*/
}

export function goBack() {
    frame.topmost().goBack();
}

export function openBrowser() {
  var webView: WebView = <WebView> page.getViewById("msgWebView");
  var url =  webView.src;
  
  if (pattern.test(url)){
    utils.openUrl(url);
  }else{
    console.log("Boolean: " + pattern.test(url))
    console.log(url);
  }
}

export function showAction() {
  var actionDetails:GridLayout = <GridLayout> page.getViewById("actionsDetails");
  
  var acStack0:View = <View>page.getViewById("acStack0");
  var acStack1:View = <View>page.getViewById("acStack1");
  var acStack2:View = <View>page.getViewById("acStack2");
  var acStack3:View = <View>page.getViewById("acStack3");
  acStack0.animate({
    opacity: 1,
    duration: 800
  });
  acStack1.animate({
    opacity: 1,
    duration: 800
  });
  acStack2.animate({
    opacity: 1,
    duration: 800
  });
  acStack3.animate({
    opacity: 1,
    duration: 800
  });
  pageData.set("isItemVisible", !pageData.get("isItemVisible"));
}

export function moveTo(args) {
  console.log("This was clicked : " + args.object.acLink);
}

export function closeMenu() {
  var acStack0:View = <View>page.getViewById("acStack0");
  var acStack1:View = <View>page.getViewById("acStack1");
  var acStack2:View = <View>page.getViewById("acStack2");
  var acStack3:View = <View>page.getViewById("acStack3");
  acStack0.animate({
    opacity: 0,
    duration: 800
  });
  acStack1.animate({
    opacity: 0,
    duration: 800
  });
  acStack2.animate({
    opacity: 0,
    duration: 800
  });
  acStack3.animate({
    opacity: 0,
    duration: 800
  });
  pageData.set("isItemVisible", !pageData.get("isItemVisible"));
}

function preparePayload1(methodName) {
        var objPay = new Object();
        objPay["sessionKey"] = appSettings.getString("sessionKey");
        objPay["idNumber"] = appSettings.getString("idNumber");
        objPay["deviceToken"] = appSettings.getString("deviceToken");
        objPay["method"] = methodName;
        var payLoad = JSON.stringify(objPay);
        //console.log("Payload --> " + payLoad);
        return objPay;
}