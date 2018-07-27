"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("ui/core/view");
var color_1 = require("color");
var FloatingActionButtonBase = (function (_super) {
    __extends(FloatingActionButtonBase, _super);
    function FloatingActionButtonBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.swipeEventAttached = false;
        return _this;
    }
    FloatingActionButtonBase.prototype.getDurationDefault = function (animationType) {
        switch (animationType) {
            case "scale":
                return 100;
            default:
                return 300;
        }
    };
    FloatingActionButtonBase.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        if (this.swipeEventAttached === false) {
            var fab = this;
            if (this.hideOnSwipeOfView !== undefined) {
                var swipeItem = this.page.getViewById(this.hideOnSwipeOfView);
                var animationType = this.swipeAnimation
                    ? this.swipeAnimation
                    : "slideDown";
                if (swipeItem !== undefined) {
                    var duration = this.hideAnimationDuration
                        ? this.hideAnimationDuration
                        : this.getDurationDefault(animationType);
                    swipeItem.on("pan", function (args) {
                        if (args.deltaY < -10) {
                            switch (animationType) {
                                case "slideUp":
                                    fab.animate({
                                        translate: {
                                            x: 0,
                                            y: -200
                                        },
                                        opacity: 0,
                                        duration: duration
                                    });
                                    break;
                                case "slideDown":
                                    fab.animate({
                                        translate: {
                                            x: 0,
                                            y: 200
                                        },
                                        opacity: 0,
                                        duration: duration
                                    });
                                    break;
                                case "slideRight":
                                    fab.animate({
                                        translate: {
                                            x: 200,
                                            y: 0
                                        },
                                        opacity: 0,
                                        duration: duration
                                    });
                                    break;
                                case "slideLeft":
                                    fab.animate({
                                        translate: {
                                            x: -200,
                                            y: 0
                                        },
                                        opacity: 0,
                                        duration: duration
                                    });
                                    break;
                                case "scale":
                                    fab.animate({
                                        scale: {
                                            x: 0,
                                            y: 0
                                        },
                                        duration: duration
                                    });
                                    break;
                            }
                        }
                        else if (args.deltaY > 0) {
                            switch (animationType) {
                                case "slideUp":
                                    fab.animate({
                                        translate: {
                                            x: 0,
                                            y: 0
                                        },
                                        opacity: 1,
                                        duration: duration
                                    });
                                    break;
                                case "slideDown":
                                    fab.animate({
                                        translate: {
                                            x: 0,
                                            y: 0
                                        },
                                        opacity: 1,
                                        duration: duration
                                    });
                                    break;
                                case "slideRight":
                                    fab.animate({
                                        translate: {
                                            x: 0,
                                            y: 0
                                        },
                                        opacity: 1,
                                        duration: duration
                                    });
                                    break;
                                case "slideLeft":
                                    fab.animate({
                                        translate: {
                                            x: 0,
                                            y: 0
                                        },
                                        opacity: 1,
                                        duration: duration
                                    });
                                    break;
                                case "scale":
                                    fab.animate({
                                        scale: {
                                            x: 1,
                                            y: 1
                                        },
                                        duration: duration
                                    });
                                    break;
                            }
                        }
                    });
                    this.swipeEventAttached = true;
                }
            }
        }
    };
    return FloatingActionButtonBase;
}(view_1.View));
exports.FloatingActionButtonBase = FloatingActionButtonBase;
exports.backColorProperty = new view_1.Property({
    name: "backColor",
    equalityComparer: color_1.Color.equals,
    valueConverter: function (v) { return new color_1.Color(v); },
    valueChanged: function (fab, oldValue, newValue) {
        fab.style.backgroundColor = newValue;
    }
});
exports.backColorProperty.register(FloatingActionButtonBase);
exports.iconProperty = new view_1.Property({
    name: "icon",
    affectsLayout: true
});
exports.iconProperty.register(FloatingActionButtonBase);
exports.rippleColorProperty = new view_1.Property({
    name: "rippleColor",
    equalityComparer: color_1.Color.equals,
    valueConverter: function (v) { return new color_1.Color(v); }
});
exports.rippleColorProperty.register(FloatingActionButtonBase);
