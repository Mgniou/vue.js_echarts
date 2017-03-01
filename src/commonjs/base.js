let root = window,
    Cookie = require('cookie');

let Base = {
    cookieId:'PARK_B_SID',
    url: {
        location: root.location,
        cache: null,
        param: function (key) {
            var href = this.location.href,
                hrefWithoutHas = href.indexOf('#') > 0 ? href.substr(0, href.indexOf('#')) : href,
                paramStr = hrefWithoutHas.split('?')[1],
                cache,
                keys;

            if (paramStr) {
                if ((cache = this.cache) === null) {
                    keys = paramStr.split('&');
                    cache = this.cache = {};
                    $.each(keys, function (i, v) {
                        var _flag = v.split('=');
                        cache[_flag[0]] = _flag[1];
                    });
                }

                if (key) {
                    return cache[key];
                } else {
                    return cache;
                }
            }
        },
        hash: function () {
            return this.location.href.replace(/^#/, '');
        },
        toUrl:function (url) {
            let redirectURL = Base.url.param('redirectURL');
            window.location.href = redirectURL ? decodeURIComponent(redirectURL) : url;
        }
    },
    browser: function () {
        var ua = navigator.userAgent,
            type,
            version,
            matches;

        if ((matches = us.match(/MicroMessenger\/(\d\.\d)/)) && matches.length) {
            type = 'weixin';
            version = matches[1];
        }

        return {
            isPC: function () {
                var sUserAgent = navigator.userAgent.toLowerCase();
                var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
                var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
                var bIsMidp = sUserAgent.match(/midp/i) == "midp";
                var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
                var bIsAndroid = sUserAgent.match(/android/i) == "android";
                var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
                var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

                if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
                    return true;
                }

                return false;
            }(),
            type: type,
            version: version
        }
    },
    mobileBrowser: function () {
        var sys = '', ver = '', v = [];
        var ua = window.navigator.userAgent;
        if (/iP(hone|od|ad)/.test(ua)) {
            sys = 'ios';
            v = ua.match(/OS (\d+)_(\d+)_?(\d+)?/);
            ver = parseInt(v[1], 10);
        } else if (/Android/.test(ua)) {
            sys = 'android';
            v = ua.match(/Android (\d+).(\d+).?(\d+)?/);
            ver = parseInt(v[1], 10);
        }
        return { sys: sys, ver: ver };
    },
    throttle: function (fn,dealy) {
        var timer = null;
        return function () {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context,args);
            },dealy);
        }
    },
    paramJson: function (data) {
        // 格式化后台需要的数据格式
        var returnData = {};
        if(!data) return false;
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                returnData[i] = (typeof data[i] == "object") ? JSON.stringify(data[i]) : data[i]
            }
        }
        return returnData;
    },
    toFixed:function(num,s){
        var times = Math.pow(10, s),
            des = num * times + 0.5;

        des = parseInt(des, 10) / times;
        return des + ''
    },
    cookie: function (key, value, options) {
        var args = Array.prototype.slice.call(arguments);
        if(args.length >= 2){
            args[2] = $.extend({}, {
                domain: root.location.hostname,
                //domain: 'wandetech.com',
                path: '/',
                expires: 90 // 默认90天过期
            }, options);
        }
        return Cookie.apply(null,args);
    },
    assignObj: function (vm, firstSource) {
        for (var i = 1; i < arguments.length; i++) {
            var nextSource = arguments[i];
            if (nextSource && typeof nextSource !== "object")
                continue;
            for (var x in vm) {
                if (vm.hasOwnProperty(x) && nextSource.hasOwnProperty(x)) {
                    vm[x] = nextSource[x]
                }
            }
        }
        return vm
    },
    formatDate: function (value, dateStr) {
        var d = new Date(value);
        var year = d.getFullYear(),
            mouth = d.getMonth() + 1,
            date = d.getDate();
        if (dateStr == undefined)
            return [year, mouth, date].join('-');
        else
            return [year, mouth, date].join(dateStr);
    },
    formatDateTime: function (value, dateStr) {
        var d = new Date(value);
        var year = d.getFullYear(),
            mouth = d.getMonth() + 1,
            date = d.getDate(),
            hour = d.getHours(),
            minute = d.getMinutes(),
            second = d.getSeconds();
        if (dateStr == undefined)
            return [year, mouth, date].join('-') + ' ' + [hour, minute, second].join(':');
        else
            return [year, mouth, date].join(dateStr) + ' ' + [hour, minute, second].join(':');
    },
    // type: and---所有都成立才为真，or---一个成立就为真
    checkPermission: function(user, permission, arr, type = "or") {
        if (user.isAdmin) {
            return true;
        } else {
            let rtn = false;
            if (type === 'or') {
                $.each(arr, (i, v) => {
                    if (permission[v] === true) {
                        rtn = true;
                        return false;
                    } else {
                        rtn = false;
                    }
                });
            } else if (type === 'and') {
                $.each(arr, (i, v) => {
                    if (permission[v] !== true) {
                        rtn = false;
                        return false;
                    } else {
                        rtn = true;
                    }
                });
            }
            return rtn;
        }
    }
};

export default Base;
