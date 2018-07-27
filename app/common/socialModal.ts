import * as pages from "ui/page";
import * as textField from "ui/text-field";
import * as observable from "data/observable";
import {View} from "ui/core/view";
import app = require("application");
import frame = require('ui/frame');
import utils = require('utils/utils');

var page: pages.Page;
var context: any;
var closeCallback: Function;

//Function called on Modal page initial load, can bind to context
export function onShownModally(args: pages.ShownModallyData) {
  //loader.show();
  console.log("notiModal.onShownModally, context: " + args.context);
  context = args.context;
  closeCallback = args.closeCallback;
}

//Function to called on close page icon.
//Not Implemented right now ---> Click outside the modal region and it will close the page
export function closePage() {
    closeCallback();
}

//Function to launch Social applications or Links depending on the availability of the apps
export function moveTo(eventData) {
  switch(eventData.object.id){
    case "youtube":
      utils.openUrl("https://www.youtube.com/user/intlserv");
      break;
    case "fb":
      try{
        utils.openUrl("fb://facewebmodal/f?href=https://www.facebook.com/iu.ois");
      }catch(error){
        utils.openUrl("https://www.facebook.com/iu.ois");
      }
      break;
    case "insta":
      utils.openUrl("https://www.instagram.com/iu_ois/");
      break;
    case "twitter":
      utils.openUrl("https://twitter.com/iu_ois");
      break;
  }
}