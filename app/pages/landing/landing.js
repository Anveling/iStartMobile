"use strict";
var BasePage_1 = require("../../common/BasePage");
var nativescript_loading_indicator_1 = require("nativescript-loading-indicator");
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
var LandingPage = /** @class */ (function (_super) {
    __extends(LandingPage, _super);
    function LandingPage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LandingPage.prototype.mainContentLoaded = function (args) {
        // var payLoad = super.preparePayload();
        var arrayNotification;
        _super.prototype.getDataFromServer.call(this, "getListItems").then(function (data) {
            console.log("Notification Array : " + JSON.stringify(data));
            // var arrayn = new ObservableArray(data["notifications"]);
            // var arrayreq = new ObservableArray(data["requests"]);
            // var tempall = data["notifications"];
            // var allarray = tempall.concat(data["requests"]);                    //Merge notifications and requests to make all array
            // var arrayall = new ObservableArray(allarray);
            // let view = <View>args.object;
            // view.bindingContext = {notificationList:arrayn, notiList:arrayn, requestList:arrayreq};
        });
    };
    return LandingPage;
}(BasePage_1.BasePage));
module.exports = new LandingPage();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxhbmRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGtEQUErQztBQVMvQyxpRkFBZ0U7QUFFaEUsSUFBSSxNQUFNLEdBQUcsSUFBSSxpREFBZ0IsRUFBRSxDQUFDLENBQVEsc0NBQXNDO0FBRWxGLElBQUksT0FBTyxHQUFHO0lBQ1YsT0FBTyxFQUFFLFlBQVk7SUFDckIsUUFBUSxFQUFFLElBQUk7SUFDZCxPQUFPLEVBQUU7UUFDTCxZQUFZLEVBQUUsSUFBSTtRQUNsQixVQUFVLEVBQUUsS0FBSztRQUNqQixHQUFHLEVBQUUsR0FBRztRQUNSLG9CQUFvQixFQUFFLFNBQVM7UUFDL0IscUJBQXFCLEVBQUUsSUFBSTtRQUMzQixhQUFhLEVBQUUsQ0FBQztRQUNoQixpQkFBaUIsRUFBRSxDQUFDO0tBQ3ZCO0lBQ0QsR0FBRyxFQUFFO1FBQ0QsT0FBTyxFQUFFLDBCQUEwQjtRQUNuQyxNQUFNLEVBQUUsS0FBSztRQUNiLE1BQU0sRUFBRSxFQUFFO1FBQ1YsYUFBYSxFQUFFLElBQUk7UUFDbkIsS0FBSyxFQUFFLFNBQVM7S0FDbkI7Q0FDSixDQUFDO0FBRUY7SUFBMEIsK0JBQVE7SUFBbEM7O0lBaUJBLENBQUM7SUFoQkcsdUNBQWlCLEdBQWpCLFVBQWtCLElBQWM7UUFFNUIsd0NBQXdDO1FBQ3hDLElBQUksaUJBQWlCLENBQUM7UUFFdEIsaUJBQU0saUJBQWlCLFlBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtZQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM1RCwyREFBMkQ7WUFDM0Qsd0RBQXdEO1lBQ3hELHVDQUF1QztZQUN2QywySEFBMkg7WUFDM0gsZ0RBQWdEO1lBQ2hELGdDQUFnQztZQUNoQywwRkFBMEY7UUFDOUYsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQUFDLEFBakJELENBQTBCLG1CQUFRLEdBaUJqQztBQUVELGlCQUFTLElBQUksV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0Jhc2VQYWdlfSBmcm9tIFwiLi4vLi4vY29tbW9uL0Jhc2VQYWdlXCI7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZSwgRXZlbnREYXRhfSBmcm9tIFwiZGF0YS9vYnNlcnZhYmxlXCI7XHJcbmltcG9ydCB7Vmlld30gZnJvbSBcInVpL2NvcmUvdmlld1wiO1xyXG5pbXBvcnQge09ic2VydmFibGVBcnJheX0gZnJvbSBcImRhdGEvb2JzZXJ2YWJsZS1hcnJheVwiO1xyXG5cclxuaW1wb3J0IGh0dHAgPSByZXF1aXJlKCdodHRwJyk7XHJcbmltcG9ydCB7QkFTRV9QQVRILCBQT1NUX1BBVEh9IGZyb20gXCIuLi8uLi9jb21tb24vY29uc3RhbnRzXCI7XHJcbmltcG9ydCBhcHBTZXR0aW5ncyA9IHJlcXVpcmUoJ2FwcGxpY2F0aW9uLXNldHRpbmdzJyk7XHJcbmltcG9ydCB0aW1lciA9IHJlcXVpcmUoJ3RpbWVyJyk7XHJcbmltcG9ydCB7TG9hZGluZ0luZGljYXRvcn0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1sb2FkaW5nLWluZGljYXRvclwiO1xyXG5cclxudmFyIGxvYWRlciA9IG5ldyBMb2FkaW5nSW5kaWNhdG9yKCk7ICAgICAgICAvL25ldyBMb2FkaW5nSW5kaWNhdG9yIHRvIHNob3cgc3RhdHVzLlxyXG5cclxudmFyIG9wdGlvbnMgPSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1BhcmFtZXRlcnMgZm9yIHRoZSBMb2FkaW5nIEluZGljYXRvciwgdGhlc2UgY2FuIGJlIHR3ZWFrZWQgYXMgcmVxdWlyZWQuXHJcbiAgICBtZXNzYWdlOiAnTG9hZGluZy4uLicsXHJcbiAgICBwcm9ncmVzczogMC42NSxcclxuICAgIGFuZHJvaWQ6IHtcclxuICAgICAgICBpbnRlcm1lZGlhdGU6IHRydWUsXHJcbiAgICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXHJcbiAgICAgICAgbWF4OiAxMDAsXHJcbiAgICAgICAgcHJvZ3Jlc3NOdW1iZXJGb3JtYXQ6IFwiJTFkLyUyZFwiLFxyXG4gICAgICAgIHByb2dyZXNzUGVyY2VudEZvcm1hdDogMC41MyxcclxuICAgICAgICBwcm9ncmVzc1N0eWxlOiAxLFxyXG4gICAgICAgIHNlY29uZGFyeVByb2dyZXNzOiAxXHJcbiAgICB9LFxyXG4gICAgaW9zOiB7XHJcbiAgICAgICAgZGV0YWlsczogXCJBZGRpdGlvbmFsIGRldGFpbHMgbm90ZSFcIixcclxuICAgICAgICBzcXVhcmU6IGZhbHNlLFxyXG4gICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgZGltQmFja2dyb3VuZDogdHJ1ZSxcclxuICAgICAgICBjb2xvcjogXCIjNEI5RUQ2XCIsXHJcbiAgICB9XHJcbn07XHJcblxyXG5jbGFzcyBMYW5kaW5nUGFnZSBleHRlbmRzIEJhc2VQYWdle1xyXG4gICAgbWFpbkNvbnRlbnRMb2FkZWQoYXJnczpFdmVudERhdGEpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIHZhciBwYXlMb2FkID0gc3VwZXIucHJlcGFyZVBheWxvYWQoKTtcclxuICAgICAgICB2YXIgYXJyYXlOb3RpZmljYXRpb247XHJcblxyXG4gICAgICAgIHN1cGVyLmdldERhdGFGcm9tU2VydmVyKFwiZ2V0TGlzdEl0ZW1zXCIpLnRoZW4oZGF0YSA9PntcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3RpZmljYXRpb24gQXJyYXkgOiBcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICAgICAgLy8gdmFyIGFycmF5biA9IG5ldyBPYnNlcnZhYmxlQXJyYXkoZGF0YVtcIm5vdGlmaWNhdGlvbnNcIl0pO1xyXG4gICAgICAgICAgICAvLyB2YXIgYXJyYXlyZXEgPSBuZXcgT2JzZXJ2YWJsZUFycmF5KGRhdGFbXCJyZXF1ZXN0c1wiXSk7XHJcbiAgICAgICAgICAgIC8vIHZhciB0ZW1wYWxsID0gZGF0YVtcIm5vdGlmaWNhdGlvbnNcIl07XHJcbiAgICAgICAgICAgIC8vIHZhciBhbGxhcnJheSA9IHRlbXBhbGwuY29uY2F0KGRhdGFbXCJyZXF1ZXN0c1wiXSk7ICAgICAgICAgICAgICAgICAgICAvL01lcmdlIG5vdGlmaWNhdGlvbnMgYW5kIHJlcXVlc3RzIHRvIG1ha2UgYWxsIGFycmF5XHJcbiAgICAgICAgICAgIC8vIHZhciBhcnJheWFsbCA9IG5ldyBPYnNlcnZhYmxlQXJyYXkoYWxsYXJyYXkpO1xyXG4gICAgICAgICAgICAvLyBsZXQgdmlldyA9IDxWaWV3PmFyZ3Mub2JqZWN0O1xyXG4gICAgICAgICAgICAvLyB2aWV3LmJpbmRpbmdDb250ZXh0ID0ge25vdGlmaWNhdGlvbkxpc3Q6YXJyYXluLCBub3RpTGlzdDphcnJheW4sIHJlcXVlc3RMaXN0OmFycmF5cmVxfTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0ID0gbmV3IExhbmRpbmdQYWdlKCk7Il19