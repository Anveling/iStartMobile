"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fab_common_1 = require("./fab-common");
var color_1 = require("color");
var ImageSource = require("image-source");
var view_1 = require("ui/core/view");
var Fab = (function (_super) {
    __extends(Fab, _super);
    function Fab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Fab.prototype.createNativeView = function () {
        var btn = new android.support.design.widget.FloatingActionButton(this._context);
        var that = new WeakRef(this);
        btn.setOnClickListener(new android.view.View.OnClickListener({
            get owner() {
                return that.get();
            },
            onClick: function (v) {
                if (this.owner) {
                    this.owner._emit("tap");
                }
            }
        }));
        return btn;
    };
    Fab.prototype[fab_common_1.backColorProperty.setNative] = function (value) {
        this.nativeView.setBackgroundTintList(android.content.res.ColorStateList.valueOf(value.android));
    };
    Fab.prototype[view_1.backgroundColorProperty.getDefault] = function () {
        return this.nativeView.getBackgroundTintList();
    };
    Fab.prototype[view_1.backgroundColorProperty.setNative] = function (value) {
        var newValue;
        if (value instanceof color_1.Color) {
            newValue = android.content.res.ColorStateList.valueOf(value.android);
        }
        else {
            newValue = value;
        }
        this.nativeView.setBackgroundTintList(newValue);
    };
    Fab.prototype[view_1.backgroundInternalProperty.setNative] = function (value) {
    };
    Fab.prototype[fab_common_1.rippleColorProperty.setNative] = function (value) {
        this.nativeView.setRippleColor(value.android);
    };
    Fab.prototype[fab_common_1.iconProperty.setNative] = function (value) {
        var iconDrawable = null;
        if (ImageSource.isFileOrResourcePath(value)) {
            iconDrawable = ImageSource.fromFileOrResource(value);
            if (iconDrawable) {
                this.nativeView.setImageBitmap(iconDrawable.android);
            }
            else {
                console.log("The icon: " + value + " was not found. Check your XML icon property.");
            }
        }
        else {
            var drawableId = android.content.res.Resources
                .getSystem()
                .getIdentifier(value, "drawable", "android");
            iconDrawable = android.content.res.Resources
                .getSystem()
                .getDrawable(drawableId);
            if (iconDrawable) {
                this.nativeView.setImageDrawable(iconDrawable);
            }
            else {
                console.log("The icon: " + value + " was not found. Check your XML icon property.");
            }
        }
    };
    Fab.tapEvent = "tap";
    return Fab;
}(fab_common_1.FloatingActionButtonBase));
exports.Fab = Fab;
