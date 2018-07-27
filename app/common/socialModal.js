"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("utils/utils");
var page;
var context;
var closeCallback;
//Function called on Modal page initial load, can bind to context
function onShownModally(args) {
    //loader.show();
    console.log("notiModal.onShownModally, context: " + args.context);
    context = args.context;
    closeCallback = args.closeCallback;
}
exports.onShownModally = onShownModally;
//Function to called on close page icon.
//Not Implemented right now ---> Click outside the modal region and it will close the page
function closePage() {
    closeCallback();
}
exports.closePage = closePage;
//Function to launch Social applications or Links depending on the availability of the apps
function moveTo(eventData) {
    switch (eventData.object.id) {
        case "youtube":
            utils.openUrl("https://www.youtube.com/user/intlserv");
            break;
        case "fb":
            try {
                utils.openUrl("fb://facewebmodal/f?href=https://www.facebook.com/iu.ois");
            }
            catch (error) {
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
exports.moveTo = moveTo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29jaWFsTW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzb2NpYWxNb2RhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BLG1DQUFzQztBQUV0QyxJQUFJLElBQWdCLENBQUM7QUFDckIsSUFBSSxPQUFZLENBQUM7QUFDakIsSUFBSSxhQUF1QixDQUFDO0FBRTVCLGlFQUFpRTtBQUNqRSx3QkFBK0IsSUFBNEI7SUFDekQsZ0JBQWdCO0lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xFLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3ZCLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQ3JDLENBQUM7QUFMRCx3Q0FLQztBQUVELHdDQUF3QztBQUN4QywwRkFBMEY7QUFDMUY7SUFDSSxhQUFhLEVBQUUsQ0FBQztBQUNwQixDQUFDO0FBRkQsOEJBRUM7QUFFRCwyRkFBMkY7QUFDM0YsZ0JBQXVCLFNBQVM7SUFDOUIsTUFBTSxDQUFBLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFDO1FBQzFCLEtBQUssU0FBUztZQUNaLEtBQUssQ0FBQyxPQUFPLENBQUMsdUNBQXVDLENBQUMsQ0FBQztZQUN2RCxLQUFLLENBQUM7UUFDUixLQUFLLElBQUk7WUFDUCxJQUFHLENBQUM7Z0JBQ0YsS0FBSyxDQUFDLE9BQU8sQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1lBQzVFLENBQUM7WUFBQSxLQUFLLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDO2dCQUNaLEtBQUssQ0FBQyxPQUFPLENBQUMsaUNBQWlDLENBQUMsQ0FBQztZQUNuRCxDQUFDO1lBQ0QsS0FBSyxDQUFDO1FBQ1IsS0FBSyxPQUFPO1lBQ1YsS0FBSyxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ25ELEtBQUssQ0FBQztRQUNSLEtBQUssU0FBUztZQUNaLEtBQUssQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUM1QyxLQUFLLENBQUM7SUFDVixDQUFDO0FBQ0gsQ0FBQztBQW5CRCx3QkFtQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYWdlcyBmcm9tIFwidWkvcGFnZVwiO1xyXG5pbXBvcnQgKiBhcyB0ZXh0RmllbGQgZnJvbSBcInVpL3RleHQtZmllbGRcIjtcclxuaW1wb3J0ICogYXMgb2JzZXJ2YWJsZSBmcm9tIFwiZGF0YS9vYnNlcnZhYmxlXCI7XHJcbmltcG9ydCB7Vmlld30gZnJvbSBcInVpL2NvcmUvdmlld1wiO1xyXG5pbXBvcnQgYXBwID0gcmVxdWlyZShcImFwcGxpY2F0aW9uXCIpO1xyXG5pbXBvcnQgZnJhbWUgPSByZXF1aXJlKCd1aS9mcmFtZScpO1xyXG5pbXBvcnQgdXRpbHMgPSByZXF1aXJlKCd1dGlscy91dGlscycpO1xyXG5cclxudmFyIHBhZ2U6IHBhZ2VzLlBhZ2U7XHJcbnZhciBjb250ZXh0OiBhbnk7XHJcbnZhciBjbG9zZUNhbGxiYWNrOiBGdW5jdGlvbjtcclxuXHJcbi8vRnVuY3Rpb24gY2FsbGVkIG9uIE1vZGFsIHBhZ2UgaW5pdGlhbCBsb2FkLCBjYW4gYmluZCB0byBjb250ZXh0XHJcbmV4cG9ydCBmdW5jdGlvbiBvblNob3duTW9kYWxseShhcmdzOiBwYWdlcy5TaG93bk1vZGFsbHlEYXRhKSB7XHJcbiAgLy9sb2FkZXIuc2hvdygpO1xyXG4gIGNvbnNvbGUubG9nKFwibm90aU1vZGFsLm9uU2hvd25Nb2RhbGx5LCBjb250ZXh0OiBcIiArIGFyZ3MuY29udGV4dCk7XHJcbiAgY29udGV4dCA9IGFyZ3MuY29udGV4dDtcclxuICBjbG9zZUNhbGxiYWNrID0gYXJncy5jbG9zZUNhbGxiYWNrO1xyXG59XHJcblxyXG4vL0Z1bmN0aW9uIHRvIGNhbGxlZCBvbiBjbG9zZSBwYWdlIGljb24uXHJcbi8vTm90IEltcGxlbWVudGVkIHJpZ2h0IG5vdyAtLS0+IENsaWNrIG91dHNpZGUgdGhlIG1vZGFsIHJlZ2lvbiBhbmQgaXQgd2lsbCBjbG9zZSB0aGUgcGFnZVxyXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VQYWdlKCkge1xyXG4gICAgY2xvc2VDYWxsYmFjaygpO1xyXG59XHJcblxyXG4vL0Z1bmN0aW9uIHRvIGxhdW5jaCBTb2NpYWwgYXBwbGljYXRpb25zIG9yIExpbmtzIGRlcGVuZGluZyBvbiB0aGUgYXZhaWxhYmlsaXR5IG9mIHRoZSBhcHBzXHJcbmV4cG9ydCBmdW5jdGlvbiBtb3ZlVG8oZXZlbnREYXRhKSB7XHJcbiAgc3dpdGNoKGV2ZW50RGF0YS5vYmplY3QuaWQpe1xyXG4gICAgY2FzZSBcInlvdXR1YmVcIjpcclxuICAgICAgdXRpbHMub3BlblVybChcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3VzZXIvaW50bHNlcnZcIik7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBcImZiXCI6XHJcbiAgICAgIHRyeXtcclxuICAgICAgICB1dGlscy5vcGVuVXJsKFwiZmI6Ly9mYWNld2VibW9kYWwvZj9ocmVmPWh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9pdS5vaXNcIik7XHJcbiAgICAgIH1jYXRjaChlcnJvcil7XHJcbiAgICAgICAgdXRpbHMub3BlblVybChcImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9pdS5vaXNcIik7XHJcbiAgICAgIH1cclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFwiaW5zdGFcIjpcclxuICAgICAgdXRpbHMub3BlblVybChcImh0dHBzOi8vd3d3Lmluc3RhZ3JhbS5jb20vaXVfb2lzL1wiKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIFwidHdpdHRlclwiOlxyXG4gICAgICB1dGlscy5vcGVuVXJsKFwiaHR0cHM6Ly90d2l0dGVyLmNvbS9pdV9vaXNcIik7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufSJdfQ==