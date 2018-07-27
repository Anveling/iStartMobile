import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import frame = require('ui/frame');
import connectivity = require("connectivity");
import dialogs = require("ui/dialogs");
require("nativescript-dom");
require("nativescript-localstorage");
require('nativescript-effects');
import utils = require('utils/utils');

// import * as platformModule from "tns-core-modules/platform";

import {isIOS, isAndroid} from 'platform';
import {Promise, BaseError} from 'ts-promise';

var application = require('application');
import {Location, getCurrentLocation, enableLocationRequest} from 'nativescript-geolocation';
declare var java: any;
declare var android: any;
declare var CLGeocoder: any;
declare var ABCreateStringWithAddressDictionary: any;


import firebase = require("nativescript-plugin-firebase");
import http = require('http');
import {BASE_PATH, POST_PATH} from "../../common/constants";

firebase.init({
    onMessageReceivedCallback: function(message) {                      //TO-DO: Refine Logic
        if('title' in message || 'body' in message){                    //Code works only when message contains a title and a body
            console.log("Title: " + message.title);
            console.log("Body: " + message.body);
        }
        //alert(JSON.stringify(message.body));
    }
}).then(
    (instance) => {
        console.log("firebase.init done");
        console.log("deviceToken: " + localStorage.getItem('dToken'));
        if (localStorage.getItem('dToken') != null){
            http.request({
                url: BASE_PATH+POST_PATH,
                method: 'POST',
                headers: { "Content-type" : "application/json" },
                content: JSON.stringify({ deviceToken: localStorage.getItem('dToken'), method: "getBackgroundImageURL" })
            })
            .then(
            (resp) =>{
                console.log('Request sent to CF Server');
                console.log(JSON.stringify(resp.content));
                var jContent = JSON.parse(JSON.stringify(resp.content));
                var imageUrl = JSON.stringify(jContent['imageURL']);                   //Search for imageURL value and trim the ""
                if (imageUrl){
                    imageUrl = imageUrl.replace(/['"]+/g, '');
                    console.log(imageUrl);
                    if(localStorage.getItem('imageUrl') != imageUrl){
                        localStorage.setItem('imageUrl', imageUrl);
                    }
                }else{
                    console.log(JSON.stringify(jContent['error']));
                }
                // imageUrl = imageUrl.replace(/['"]+/g, '');
                // console.log(imageUrl);
                // if(localStorage.getItem('imageUrl') != imageUrl){
                //     localStorage.setItem('imageUrl', imageUrl);
                // }
            },
            (error) => {
                console.log('HTTP Request Failed', error);
            }
            );
        }
    },
    (error) => {
        console.log("firebase.init error: " + error);
    }
);

//import navigation = require('common/navigaton');
var sView, buStack;
export function navigatingTo(args: EventData) {
    let page = <Page>args.object;
    sView = page.getElementById('sViewe');
    console.log(localStorage.getItem('imageUrl'));
    if(localStorage.getItem('imageUrl')){
        sView.style.backgroundImage = localStorage.getItem('imageUrl');;
    }
}

export function loaded(){
    buStack = sView.getElementById('buStack');
    buStack.fadeTo(1000, 0.8);
}

//Fuction which is called when login button is clicked.
export function goToWebAuthPage() {

    //Perform check on internet connection
    var connectionType = connectivity.getConnectionType();
    switch(connectionType) {
        case connectivity.connectionType.none:
            var options = {
                title: "\u26A0\uFE0F Alert",
                message: "No Internet Connection! Please connect to Internet and try again.",
                okButtonText: "OK"
            };
            dialogs.alert(options);
            break;
        case connectivity.connectionType.mobile:
            var navigationEntry = {
                moduleName: "pages/web-auth/web-auth",
                animated: true,
                transition: {
                    name: "flip",
                    duration: 380,
                    curve: "easeOut"
                },
            }
            frame.topmost().navigate(navigationEntry);        //Navigating to Web Authentication page.
            break;
        case connectivity.connectionType.wifi:
            var navigationEntry = {
                moduleName: "pages/web-auth/web-auth",
                animated: true,
                transition: {
                    name: "flip",
                    duration: 380,
                    curve: "easeOut"
                },
            }
            frame.topmost().navigate(navigationEntry);        //Navigating to Web Authentication page.
            break;
    }
}

//Dummy Function to check things
export function changeBg() {

    // if(sView.style.backgroundImage === "res://test"){
    //         sView.style.backgroundImage = "res://testbg";
    // }else{
    //         sView.style.backgroundImage = "res://test";
    // }
    // sView.style.backgroundImage = "http://apple.wallpapersfine.com/wallpapers/original/750x1334/w-4634.jpg";
    // console.log("Screen width: " + platformModule.screen.mainScreen.widthPixels);
    // console.log("Screen height: " + platformModule.screen.mainScreen.heightPixels);
    // console.log("Screen scale: " + platformModule.screen.mainScreen.scale);

    getCurrentLocation({timeout: 155000})
        .then(location => {
            console.log('Location received: ' + location);
            geocode({location:location})
                .then(function(result){
                    console.log("---------------------Promise---------------------------------");
                    console.dir(result);
                })
                .catch(function(e){console.log(e)});
        }).catch(error => {
            console.log("Location error received: " + error);
            alert("location error" + error);
        });
   //var location = new Location();
    //location.latitude = 40.7127837;
    //location.longitude=-74.00594130000002;
    // utils.openUrl("https://www.youtube.com/watch?v=efk_oeI58hc");
}

//Sample code for function to reverse geocode location data to find country
function geocode(args:{location: Location}): Promise<any>{
    let position: any;
    if(!args.location)
        return new Promise(function (reject) {return reject("error")});
    
    if (isAndroid) {
        return new Promise(function(resolve, reject){
            var locale = java.util.Locale.getDefault();
            var geocoder = new android.location.Geocoder(application.android.currentContext, locale);
            var addresses = geocoder.getFromLocation(args.location.latitude, args.location.longitude, 1);
            if (addresses != null && addresses.size() > 0) {
                var address = addresses.get(0);
                position = <any>{
                    latitude: address.getLatitude(),
                    longitude: address.getLongitude(),
                    country: address.getCountryName(),
                    countryCode: address.getCountryCode(),
                    addressLines: []
                }
                for (var i = 0; i <= address.getMaxAddressLineIndex(); i++) {
                    position.addressLines.push(address.getAddressLine(i));
                }
                return resolve(position);
            }

        });
    }
    if (isIOS) {
        return new Promise(function(resolve, reject){
            let geocoder = new CLGeocoder();
            geocoder.reverseGeocodeLocationCompletionHandler(
                args.location.ios,
                (placemarks, error) => {
                    if (error) {
                        console.log(error);
                        var newerror = new BaseError("error", "error");
                        return reject(newerror);
                    } else if (placemarks && placemarks.count > 0) {
                        let pm = placemarks[0];
                        let addressDictionary = pm.addressDictionary;
                        let address = ABCreateStringWithAddressDictionary(addressDictionary, false);
                        position = <any>{
                            latitude: args.location.latitude,
                            longitude: args.location.longitude,
                            country: addressDictionary.objectForKey('Country'),
                            countryCode: addressDictionary.objectForKey('CountryCode'),
                            addressLines: []
                        };

                        let lines = addressDictionary.objectForKey('FormattedAddressLines');
                        for (var i = 0; i < lines.count; i++) {
                            position.addressLines.push(lines[i]);
                        }
                        return resolve(position);
                    }
                });
        });
    }
}