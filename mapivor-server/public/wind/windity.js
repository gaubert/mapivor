/*!
	Copyright(c) 2014 - 2015, Citationtech S.E. 
*/
! function() {
    function a() {
        var a, b = navigator.userAgent,
            c = b.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        return /trident/i.test(c[1]) ? (a = /\brv[ :]+(\d+)/g.exec(b) || [], "ie" + (a[1] || "")) : "Chrome" === c[1] && (a = b.match(/\bOPR\/(\d+)/), null !== a) ? "opera" + a[1] : (c = c[2] ? [c[1], c[2]] : [navigator.appName, navigator.appVersion, "-?"], null !== (a = b.match(/version\/(\d+)/i)) && c.splice(1, 1, a[1]), c[0] + c[1])
    }
    var b = "unknown";
    try {
        b = a()
    } catch (c) {}
    try {
        new Float32Array(100);
        window.onerror = function(a, c, d, e, f) {
            ga("send", "event", "error v" + W.version, a + " URL:" + c + " LINE:" + d + " COLUMN:" + e + " BROWSER:" + b + " " + navigator.userAgent), ga("send", "pageview", "errors/" + W.version + "/" + b + "/" + d + "/" + e + "/" + a)
        }
    } catch (c) {
        window.onload = function() {
            var a = document.getElementById("not-supported");
            a.style.display = "block", window.ga && ga("send", "pageview", "notSupported/" + b + "/" + navigator.userAgent)
        }
    }
}(),
function(a) {
    function b(a, b) {
        return function() {
            a.apply(b, arguments)
        }
    }

    function c(a) {
        if ("object" != typeof this) throw new TypeError("Promises must be constructed via new");
        if ("function" != typeof a) throw new TypeError("not a function");
        this._state = null, this._value = null, this._deferreds = [], i(a, b(e, this), b(f, this))
    }

    function d(a) {
        var b = this;
        return null === this._state ? void this._deferreds.push(a) : void j(function() {
            var c = b._state ? a.onFulfilled : a.onRejected;
            if (null === c) return void(b._state ? a.resolve : a.reject)(b._value);
            var d;
            try {
                d = c(b._value)
            } catch (e) {
                return void a.reject(e)
            }
            a.resolve(d)
        })
    }

    function e(a) {
        try {
            if (a === this) throw new TypeError("A promise cannot be resolved with itself.");
            if (a && ("object" == typeof a || "function" == typeof a)) {
                var c = a.then;
                if ("function" == typeof c) return void i(b(c, a), b(e, this), b(f, this))
            }
            this._state = !0, this._value = a, g.call(this)
        } catch (d) {
            f.call(this, d)
        }
    }

    function f(a) {
        this._state = !1, this._value = a, g.call(this)
    }

    function g() {
        for (var a = 0, b = this._deferreds.length; b > a; a++) d.call(this, this._deferreds[a]);
        this._deferreds = null
    }

    function h(a, b, c, d) {
        this.onFulfilled = "function" == typeof a ? a : null, this.onRejected = "function" == typeof b ? b : null, this.resolve = c, this.reject = d
    }

    function i(a, b, c) {
        var d = !1;
        try {
            a(function(a) {
                d || (d = !0, b(a))
            }, function(a) {
                d || (d = !0, c(a))
            })
        } catch (e) {
            if (d) return;
            d = !0, c(e)
        }
    }
    var j = c.immediateFn || "function" == typeof setImmediate && setImmediate || function(a) {
            setTimeout(a, 1)
        },
        k = Array.isArray || function(a) {
            return "[object Array]" === Object.prototype.toString.call(a)
        };
    c.prototype["catch"] = function(a) {
        return this.then(null, a)
    }, c.prototype.then = function(a, b) {
        var e = this;
        return new c(function(c, f) {
            d.call(e, new h(a, b, c, f))
        })
    }, c.all = function() {
        var a = Array.prototype.slice.call(1 === arguments.length && k(arguments[0]) ? arguments[0] : arguments);
        return new c(function(b, c) {
            function d(f, g) {
                try {
                    if (g && ("object" == typeof g || "function" == typeof g)) {
                        var h = g.then;
                        if ("function" == typeof h) return void h.call(g, function(a) {
                            d(f, a)
                        }, c)
                    }
                    a[f] = g, 0 === --e && b(a)
                } catch (i) {
                    c(i)
                }
            }
            if (0 === a.length) return b([]);
            for (var e = a.length, f = 0; f < a.length; f++) d(f, a[f])
        })
    }, c.resolve = function(a) {
        return a && "object" == typeof a && a.constructor === c ? a : new c(function(b) {
            b(a)
        })
    }, c.reject = function(a) {
        return new c(function(b, c) {
            c(a)
        })
    }, c.race = function(a) {
        return new c(function(b, c) {
            for (var d = 0, e = a.length; e > d; d++) a[d].then(b, c)
        })
    }, "undefined" != typeof module && module.exports ? module.exports = c : a.Promise || (a.Promise = c)
}(this),
/*! 
Adrian Cooney <cooney.adrian@gmail.com> License: MIT */
function(a) {
    function b(a, b, d, f) {
        var g, h;
        if ("function" == typeof b ? (h = b, g = []) : (g = b, h = d), e[a]) throw "DI conflict: Module " + a + " already defined.";
        return e[a] = {
            name: a,
            callback: h,
            loaded: null,
            wasLoaded: !1,
            dependencies: g
        }, f && c(e[a]), e[a]
    }

    function c(a) {
        var b = [];
        return a.dependencies.forEach(function(a) {
            var d = e[a];
            if (!d) throw "DI error: Module " + a + " not defined";
            d.wasLoaded ? b.push(d.loaded) : b.push(c(d))
        }), a.loaded = a.callback.apply(null, b), a.wasLoaded = !0, W[a.name] ? console.error("DI error: Object W." + a.name + " already exists") : W[a.name] = a.loaded, a.loaded
    }

    function d(a, b) {
        var d, f, g;
        "function" == typeof a ? (f = a, d = []) : (d = a, f = b), g = c({
            callback: f,
            dependencies: d
        });
        for (var h in e) e[h].wasLoaded || console.warn("DI warning: module " + h + " defined but not loaded")
    }
    var e = {};
    a.W || (a.W = {}), d.modules = e, a.W.require = d, a.W.define = b
}(window), /*! */
W.define("prototypes", [], function() {
        Array.prototype.getNextItem = function(a, b) {
            var c = this.indexOf(a);
            return b && c < this.length - 1 ? c++ : !b && c > 0 && c--, this[c]
        }, Array.prototype.cycleItems = function(a, b) {
            var c = this.indexOf(a) + (b ? 1 : -1);
            return c === this.length ? c = 0 : 0 > c && (c = this.length - 1), this[c]
        }, Date.prototype.add = function(a, b) {
            var c = new Date(this.getTime());
            return c.setTime(this.getTime() + ("days" === b ? 24 : 1) * a * 60 * 60 * 1e3), c
        }, Date.prototype.toUTCPath = function() {
            return this.toISOString().replace(/^(\d+)-(\d+)-(\d+)T(\d+):.*$/, "$1/$2/$3/$4")
        }, String.prototype.trunc = function(a) {
            return this.length > a ? this.substr(0, a - 1) + "&hellip;" : this
        }, Date.prototype.midnight = function() {
            return this.setHours(0), this.setMinutes(0), this.setSeconds(0), this.setMilliseconds(0), this
        }, Number.prototype.pad = function(a) {
            for (var b = String(this); b.length < (a || 2);) b = "0" + b;
            return b
        }, Number.prototype.format = function(a) {
            return this.toFixed(a || 0).replace(/(\d)(?=(\d{3})+\.?)/g, "$1 ")
        }, String.prototype.firstCapital = function() {
            return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
        }, Number.prototype.bound = function(a, b) {
            return Math.max(Math.min(this, b), a)
        }, Math.deg2rad = function(a) {
            return a / 180 * Math.PI
        }, String.prototype.template = function(a) {
            return this.replace(/\{(.+?)\}/g, function(b, c) {
                return a[c] || ""
            })
        }, String.prototype.template2 = function(a) {
            return this.replace(/\{\{(.+?)\}\}/g, function(b, c) {
                return a[c] || ""
            })
        }
    }), /*! */
    W.define("http", ["lruCache"], function(lruCache) {
        var httpCache = new lruCache(50),
            http = {};
        return http.get = function(url, options) {
            var wasCancelled = !1,
                data, headers = {},
                options = options || {},
                match, rqst, returnObject, cacheHit, cache, promise;
            return cache = "undefined" == typeof options.cache || "boolean" == typeof options.cache && options.cache ? httpCache : "object" == typeof options.cache ? options.cache : null, url = encodeURI(url), cache && (cacheHit = cache.get(url)) ? Promise.resolve(cacheHit) : (rqst = new XMLHttpRequest, rqst.open("get", url, !0), options.responseType && (rqst.responseType = options.responseType), promise = new Promise(function(resolve, reject) {
                rqst.onreadystatechange = function() {
                    if (4 === rqst.readyState)
                        if (options.parseHeaders && rqst.getAllResponseHeaders().split(/\n/).forEach(function(a) {
                                (match = a.match(/(.*:?)\: (.*)/)) && (headers[match[1].toLowerCase()] = match[2])
                            }), rqst.status >= 200 && rqst.status < 300 || 304 === rqst.status) {
                            if (data = rqst.responseText, data && /json/.test(rqst.getResponseHeader("Content-Type"))) try {
                                data = JSON.parse(data)
                            } catch (e) {
                                try {
                                    eval("data = " + data)
                                } catch (e) {}
                            }
                            returnObject = {
                                data: data,
                                headers: headers,
                                status: rqst.status
                            }, cache && cache.put(url, returnObject), resolve(returnObject)
                        } else wasCancelled ? reject("cancelled") : options.substituteData ? resolve({
                            data: options.substituteData,
                            headers: headers,
                            status: rqst.status
                        }) : reject(rqst.status)
                }
            }), promise.cancel = function() {
                wasCancelled = !0, rqst.abort()
            }, rqst.send(null), promise)
        }, http
    }), /*! */
    W.define("storage", ["rootScope", "http", "log"], function(a, b, c) {
        var d = !0;
        try {
            window.localStorage.test = 2
        } catch (e) {
            d = !1, c.event("localStorage not supported")
        }
        return {
            put: function(a, b) {
                try {
                    d && window.localStorage.setItem(a, JSON.stringify(b))
                } catch (e) {
                    c.event("Error writing to localStorage:" + e)
                }
            },
            get: function(a) {
                try {
                    if (d) return JSON.parse(window.localStorage.getItem(a))
                } catch (b) {}
            },
            getFile: function(c, d) {
                var e = this,
                    f = this.get(c);
                return f && f.version === a.version && (!d || f.data && f.data[d]) ? Promise.resolve(f.data) : new Promise(function(d, f) {
                    b.get("/v" + a.version + "/" + c).then(function(b) {
                        b.version = a.version, e.put(c, b), d(b.data)
                    }, function(a) {
                        f(a)
                    })
                })
            }
        }
    }), /*! */
    W.define("broadcast", ["Evented"], function(a) {
        return a.extend({})
    }),
    /*!
    Licensed under MIT. 
    Copyright (c) 2010 Rasmus Andersson <http://hunch.se/> */
    W.define("lruCache", [], function() {
        function a(a) {
            this.size = 0, this.limit = a, this._keymap = {}
        }
        return a.prototype.put = function(a, b) {
            var c = {
                key: a,
                value: b
            };
            return this._keymap[a] = c, this.tail ? (this.tail.newer = c, c.older = this.tail) : this.head = c, this.tail = c, this.size === this.limit ? this.shift() : void this.size++
        }, a.prototype.shift = function() {
            var a = this.head;
            return a && (this.head.newer ? (this.head = this.head.newer, this.head.older = void 0) : this.head = void 0, a.newer = a.older = void 0, delete this._keymap[a.key]), a
        }, a.prototype.get = function(a, b) {
            var c = this._keymap[a];
            if (void 0 !== c) return c === this.tail ? b ? c : c.value : (c.newer && (c === this.head && (this.head = c.newer), c.newer.older = c.older), c.older && (c.older.newer = c.newer), c.newer = void 0, c.older = this.tail, this.tail && (this.tail.newer = c), this.tail = c, b ? c : c.value)
        }, a
    }), /*! */
    W.define("object", [], function() {
        var a = {};
        return a.clone = function(b, c) {
            var d;
            if (null === b || "object" != typeof b) d = b;
            else if (b instanceof Date) d = new Date, d.setTime(b.getTime());
            else if (b instanceof Array) {
                d = [];
                for (var e = 0, f = b.length; f > e; e++) d[e] = a.clone(b[e])
            } else if (b instanceof Object) {
                d = {};
                for (var g in b) b.hasOwnProperty(g) && (!c || c.indexOf(g) > -1) && (d[g] = a.clone(b[g]))
            } else console.warn("Unable to copy obj! Its type isn't supported.");
            return d
        }, a.signature = function(a) {
            var b = "";
            if (a instanceof Array)
                for (var c = 0, d = a.length; d > c; c++) b += a[c] && a[c].toString();
            else if (a instanceof Object)
                for (var e in a) a.hasOwnProperty(e) && (b += a[e] && a[e].toString());
            return b
        }, a.extend = function(a) {
            var b, c, d, e, f = Object.create(a);
            for (c = 1, d = arguments.length; d > c; c++) {
                e = arguments[c];
                for (b in e) f[b] = e[b]
            }
            return "function" == typeof f._init && f._init(), f
        }, a.include = function(a, b) {
            for (var c in b) a[c] = b[c];
            return a
        }, a.compare = function(a, b, c) {
            return c.filter(function(c) {
                return a[c] !== b[c]
            })
        }, a
    }), /*! */
    W.define("Class", [], function() {
        var a = {};
        return a.extend = function() {
            var a, b, c, d, e = Object.create(this);
            for (b = 0, c = arguments.length; c > b; b++) {
                d = arguments[b];
                for (a in d) e[a] = d[a]
            }
            return "function" == typeof e._init && e._init(), e
        }, a
    }),
    /*!
    Copyright(c) 2011 Daniel Lamb <daniellmb.com> MIT Licensed */
    W.define("Evented", ["Class"], function(a) {
        return a.extend({
            _init: function() {
                this.id = 0, this.cache = {}
            },
            emit: function(a, b, c, d, e) {
                var f, g, h;
                if (f = this.cache[a])
                    for (g = f.length; g--;) h = f[g], h.callback.call(this, b, c, d, e), h.once && this.off(h.id)
            },
            on: function(a, b, c) {
                return this.cache[a] || (this.cache[a] = []), this.cache[a].push({
                    callback: b,
                    id: ++this.id,
                    once: c || !1
                }), this.id
            },
            once: function(a, b) {
                return this.on(a, b, !0)
            },
            off: function(a, b) {
                var c, d;
                if ("number" == typeof a) {
                    for (var e in this.cache)
                        if (c = this.cache[e]) {
                            for (d = c.length; d--;) c[d].id === a && c.splice(d, 1);
                            0 === c.length && delete this.cache[e]
                        }
                } else {
                    if ((c = this.cache[a]) && (c = this.cache[a]))
                        for (d = c.length; d--;) c[d].callback === b && c.splice(d, 1);
                    0 === c.length && delete this.cache[a]
                }
            }
        })
    }), /*! */
    W.define("log", ["broadcast", "rootScope", "object"], function(a, b, c) {
        function d(a) {
            a && !e[a] && (e[a] = 1, h.page(a))
        }
        var e = {},
            f = ["path", "overlay", "level", "model"],
            g = c.clone(b, f);
        a.on("redrawFinished", function(a, b) {
            a.fromAnimation || setTimeout(function() {
                var b = c.compare(a, g, f)[0],
                    e = a[b];
                e && ("path" === b && (e = e.replace(/\/\d\d$/, "")), d(b + "/" + e), g = c.clone(a, f))
            }, 50)
        }), a.on("mapChanged", function(a) {
            setTimeout(function() {
                d("map/" + a.source + "/" + a.zoom)
            }, 50)
        }), a.on("popupOpened", function(a) {
            d("picker/" + a)
        }), a.on("rqstOpen", function(a, b) {
            d("detail" === a ? b.icao ? "detail/ad" : "detail/spot" : a)
        }), a.on("log", d), a.on("animationStarted", function() {
            d("animation/" + g.overlay)
        });
        var h = {
            page: function(a) {
                setTimeout(function() {
                    window.ga && ga("send", "pageview", a)
                }, 100)
            },
            event: function(a) {
                window.ga && ga("send", "event", "info v" + b.version, a + " " + navigator.userAgent), console.log("Event triggered:" + a)
            }
        };
        return h
    }), /*! */
    W.define("helpers", [], function() {
        return {
            throttle: function(a, b) {
                function c() {
                    d = !1
                }
                var d = !1;
                return function() {
                    d || (a(), d = !0, setTimeout(c, b))
                }
            },
            debounce: function(a, b, c) {
                var d;
                return function() {
                    var e = this,
                        f = arguments,
                        g = function() {
                            d = null, c || a.apply(e, f)
                        },
                        h = c && !d;
                    clearTimeout(d), d = setTimeout(g, b), h && a.apply(e, f)
                }
            }
        }
    }), "undefined" == typeof W && (W = {}), /*! */
    W.languages = {
        en: {
            MON: "Monday",
            TUE: "Tuesday",
            WED: "Wednesday",
            THU: "Thursday",
            FRI: "Friday",
            SAT: "Saturday",
            SUN: "Sunday",
            TODAY: "Today",
            TOMORROW: "Tomorrow",
            YESTERDAY: "Yesterday",
            LATER: "Later",
            EARLIER: "Earlier",
            MON2: "Mon",
            TUE2: "Tue",
            WED2: "Wed",
            THU2: "Thu",
            FRI2: "Fri",
            SAT2: "Sat",
            SUN2: "Sun",
            TODAY2: "Today",
            TOMORROW2: "Tomor",
            MON01: "January",
            MON02: "February",
            MON03: "March",
            MON04: "April",
            MON05: "May",
            MON06: "June",
            MON07: "July",
            MON08: "August",
            MON09: "September",
            MON10: "October",
            MON11: "November",
            MON12: "December",
            WIFCST: "wind forecast",
            CHANGE: "Change language",
            FOLLOW: "FOLLOW US",
            FOLLOWUS: "follow us on Facebook",
            TWEET: "share on Twitter",
            EMBED: "Embed Windyty on your page",
            MENU: "Menu",
            MENU_COMMUNITY: "Community",
            MENU_SETTINGS: "Settings",
            MENU_HELP: "Help",
            MENU_TOOLS: "Tools",
            MENU_CLOSE: "Close<br>menu",
            MENU_MAP: "Change background map",
            MENU_FB1: "Follow us on Facebook",
            MENU_FB2: "Share on Facebook",
            MENU_TW: "Share on Twitter",
            MENU_ABOUT: "About Windyty",
            MENU_FORUM: "Discussion forum",
            MENU_MAP2: "...in very detailed zoom levels",
            MENU_LOCATION: "Find my location",
            MENU_RETINA: "Enable retina",
            MENU_FULLSCREEN: "Fullscreen mode",
            MENU_3D: "Enable 3D mode",
            MENU_DISTANCE: "Distance measurement & planning",
            MENU_HISTORICAL: "Show historical data",
            TOOLBOX_INFO: "info",
            TOOLBOX_ANIMATION: "animation",
            TOOLBOX_START: "Hide/show animated particles",
            MENU_F_MODEL: "Data",
            MENU_U_INTERVAL: "Update interval",
            MENU_D_UPDATED: "Updated",
            OVERLAY: "OVERLAY",
            WIND: "Wind",
            GUST: "Wind gusts",
            TEMP: "Temperature",
            PRESS: "Pressure",
            CLOUDS: "Clouds, rain",
            LCLOUDS: "Low clouds",
            RAIN: "Rain or snow",
            SNOW: "Snow",
            SHOW_GUST: "force of wind gusts",
            RH: "Humidity",
            WAVES: "Waves",
            SWELL: "Swell",
            WWAVES: "Wind waves",
            SWELLPER: "Sw. period",
            RACCU: "R. accumulation",
            RAINACCU: "RAIN ACCUMULATION",
            SNOWACCU: "SNOW ACCUMULATION",
            SNOWCOVER: "Actual Snow Cover",
            ACC_LAST_DAYS: "Last {{num}} days",
            ACC_LAST_HOURS: "Last {{num}} hours",
            ACC_NEXT_DAYS: "Next {{num}} days",
            ACC_NEXT_HOURS: "Next {{num}} hours",
            ALTITUDE: "ALTITUDE",
            SFC: "Surface",
            DATE_AND_TIME: "TIME",
            CLICK_ON_LEGEND: "Click to change metric",
            SEARCH: "Search location...",
            SEARCH2: "Search on Windyty",
            NEXT: "Next results...",
            RECENTS: "Recent searches",
            POPULARS: "Popular locations",
            DAYS_AGO: "{{daysago}} days ago:",
            SHOW_ACTUAL: "Show actual forecast",
            SELECT_DATE: "Select date",
            DETAILED: "Detailed forecast for this location",
            DETAILEDMETAR: "Weather trend and forecast...",
            WEBCAMS: "and nearest webcams",
            PERIOD: "Period",
            DRAG_ME: "Drag me if you want",
            D_CLOSE: "Close<br>detail",
            D_SHOW_ON: "show on",
            D_GMAPS: "Google Maps",
            D_COURTESY: 'More forecast products for this spot at <a href=" https://www.meteoblue.com/en/weather/latlon/call?lat={{lat}}&lon={{lon}}">Meteoblue.com</a>',
            D_FCST: "Forecast for this location",
            D_TEMP_IN: "Temperature in",
            D_WIND_IN: "wind in",
            D_PRESSURE_IN: "pressure in",
            D_FCST_IN: "forecast in",
            D_LT: "Local timezone",
            D_AIRGRAM1: "For experts:",
            D_AIRGRAM2: "Air meteogram for this location",
            D_WEBCAMS: "Webcams in vicinity",
            D_NO_WEBCAMS: "There are no webcams around this location (or we don't know about them)",
            D_ACTUAL: "actual image",
            D_DAYLIGHT: "image during daylight",
            D_SHOW_ANIM: "Show 24h animation",
            D_EXTERNAL: "external link to lookr.com",
            D_DISTANCE: "distance",
            D_MILES: "miles",
            D_MORE_THAN_HOUR: "more than hour ago",
            D_MIN_AGO: "{{duration}} minutes ago",
            D_SUNRISE: "Sunrise",
            D_SUNSET: "sunset",
            D_DUSK: "dusk",
            D_SUN_NEVER_SET: "Sun never set",
            D_POLAR_NIGHT: "Polar night",
            D_LT2: "local time",
            D_FAVORITES: "Add to Favorites",
            D_FAVORITES2: "Remove from Favorites",
            D_MBLUE: "Meteogram",
            D_AIRGRAM3: "Airgram",
            D_WAVE_FCST: "Wind and Waves",
            D_SETTINGS: "settings",
            D_SETTINGS_LEFT: "Left side",
            D_SETTINGS_RIGHT: "Right side",
            D_SETTINGS_TIME1: "Local time of your computer",
            D_SETTINGS_TIME2: "Local time of selected destination",
            D_SETTINGS_PROVIDER: "Provider",
            D_MISSING_CAM: "Add new webcam",
            E_MESSAGE: "Awesome weather forecast at",
            METAR_VAR: "Variable",
            METAR_MIN_AGO: "{DURATION}m ago",
            METAR_HOUR_AGO: "an hour ago",
            METAR_MORE_INFO: "more info",
            DEVELOPED: "Developed with",
            MESSAGE_NEMS4: "<span>Sweet!</span>Detailed 4x4km forecast model available for this area.",
            AMSL: "Height above main sea level"
        }
    }, "object" == typeof module && module.exports && (module.exports = W.languages), W.supportedLanguages = ["en", "zh-TW", "zh", "ja", "fr", "de", "pt", "ko", "it", "ru", "nl", "cs", "tr", "pl", "sv", "fi", "el", "hu", "da", "ar", "sk", "th", "nb", "es"], /*! */
    function() {
        var a = ["prototypes", "rootScope", "broadcast", "favs", "object", "maps", "trans", "broadcast", "windytyUI", "progressBar", "calendar", "http", "jsonLoader", "overlays", "products", "colors", "legend", "productInfo", "search", "loaders", "windytyCtrl", "picker", "pois", "recents", "UItweaks", "pluginsCtrl", "mapsCtrl", "pickerGlobe"];
        document.addEventListener("DOMContentLoaded", W.require.bind(null, a, function(a, b, c, d) {
            c.emit("dependenciesResolved");
            var e = navigator.userAgent;
            if (e.indexOf("Mozilla/5.0") > -1 && e.indexOf("Android ") > -1 && e.indexOf("AppleWebKit") > -1 && !(e.indexOf("Chrome") > -1)) {
                var f = document.getElementById("intent");
                f.style.display = "block", f.onclick = function() {
                    f.style.display = "none"
                }
            }
        }))
    }(), /*! */
    W.define("rootScope", [], function() {
        "undefined" == typeof API_MODE && (API_MODE = !1), "undefined" == typeof EMBED_MODE && (EMBED_MODE = !1);
        var a = {
            server: "",
            server2: "",
            tileServer: "https://tiles{s}.windyty.com/tiles/",
            version: W.version,
            levels: ["surface", "975h", "950h", "925h", "900h", "850h", "750h", "700h", "550h", "450h", "350h", "300h", "250h", "200h", "150h"],
            overlays: ["wind", "temp", "pressure", "clouds", "rh", "gust", "snow", "lclouds", "rain", "snowcover", "waves", "swell", "wwaves", "swellperiod"],
            acTimes: ["past3d", "past24h", "next24h", "next3d", "next"],
            browser: L.Browser,
            isTouch: L.Browser.touch,
            isMobile: L.Browser.mobile || window.screen && window.screen.width < 801,
            maxZoom: EMBED_MODE || API_MODE ? 11 : 17,
            isRetina: L.Browser.retina,
            maxPixels: window.screen && window.screen.width * window.screen.height || 364e4,
            overlay: "wind",
            level: "surface",
            acTime: "next24h",
            product: "gfs",
            model: "gfs",
            setLang: "en",
            hereMapsID: "app_id=8d70J5U3FIr56AaYUPtD&app_code=MqhlkYGq9_i_t4RIbeX3RQ"
        };
        return (API_MODE || EMBED_MODE) && (a.server = "https://www.windyty.com/", a.server2 = "https://www.windyty.com/"), a
    }), /*! */
    W.define("trans", ["http", "storage", "broadcast", "rootScope", "log"], function(a, b, c, d, e) {
        function f(a) {
            for (var b in a) h[b] = a[b]
        }

        function g(a) {
            var b = /(\w+)\|(\w+)\:(\w+)/;
            return /\|/.test(a) ? a.replace(b, function(b, c, d, e) {
                var f = h[c];
                return f && e ? f.replace(/\{\{[^\}]+\}\}/g, e) : a
            }) : h[a] || a
        }
        var h = {},
            i = "en",
            j = window.navigator,
            k = d.lang || (j.languages ? j.languages[0] : j.language || j.browserLanguage || j.systemLanguage || j.userLanguage || "en");
        return h.translateDocument = function(a) {
            ["title", "placeholder", "t"].forEach(function(b) {
                for (var c, d, e = a.querySelectorAll("[data-" + b + "]"), f = 0, h = e.length; h > f; f++) c = e[f], d = g(c.dataset[b]), "t" === b ? /</.test(d) ? c.innerHTML = d : c.textContent = d : c[b] = d
            })
        }, k && W.supportedLanguages.indexOf(k) > -1 ? i = k : k && (k = k.replace(/-\S+$/, ""), i = W.supportedLanguages.indexOf(k) > -1 ? k : "en", k !== i && e.page("langmissing/" + k)), f(W.languages.en), h.translateDocument(document.body), "en" !== i && b.getFile("lang/lang-" + i + ".json", "TODAY").then(function(a) {
            f(a), h.translateDocument(document.body), c.emit("langChanged", i), d.setLang = i
        }), h
    }), /*! */
    W.define("settings", ["storage", "broadcast"], function(a, b) {
        var c = {
            map: {
                def: "esritopo",
                allowed: ["hereterrain", "heresat", "esritopo"]
            },
            retina: {
                def: !1,
                allowed: [!0, !1]
            },
            "3d": {
                def: !0,
                allowed: [!0, !1]
            }
        };
        return {
            defaults: /AM|PM/.test((new Date).toLocaleTimeString()) ? "imperial" : "metric",
            set: function(d, e) {
                var f = c[d];
                f && f.allowed.indexOf(e) > -1 && (a.put("settings_" + d, e), b.emit("settingsChanged", d, e))
            },
            get: function(b) {
                var d = c[b],
                    e = a.get("settings_" + b);
                return d && d.allowed.indexOf(e) > -1 ? e : d ? d.def : null
            },
            getHoursFunction: function() {
                return "imperial" === this.defaults ? function(a) {
                    return (a + 11) % 12 + 1 + (a >= 12 ? " PM" : " AM")
                } : function(a) {
                    return a + ":00"
                }
            }
        }
    }), /*! */
    W.define("calendar", ["prototypes", "settings", "object", "log"], function(a, b, c, d) {
        function e(a) {
            this.step = a.step || 3, this.offset = a.offset || 0, this.calendarDays = a.calendarDays || 14, this.numOfDays = a.numOfDays || 14, this.maxIndex = this.numOfDays / this.calendarDays, this.midnight = (new Date).midnight(), this.startOfTimeline = a.startOfTimeline || this.midnight.add(-24), this.days = [], this.dayHours = {}, this.sequence = 0, this.numberOfHours = 24 * this.numOfDays, this.actualNumberOfHours = this.numberOfHours, this.endOftimeline = this.startOfTimeline.add(this.numOfDays, "days"), this.endOfcalendar = this.startOfTimeline.add(this.calendarDays, "days"), this.weekdaysUsed = this.calendarDays < 8 ? f : g, this.type = this.endOfcalendar < this.midnight ? "historical" : this.startOfTimeline < this.midnight ? "mixed" : "forecast";
            for (var b, c, d, e = this.midnight.add(-12).getTime(), h = this.startOfTimeline.add(12), i = this.midnight.add(12).getTime(), j = this.midnight.add(36).getTime(), k = 0; k < this.calendarDays; k++) b = h.add(k, "days"), c = b.getTime(), d = b.getDay(), c === i ? this.days[k] = {
                display: "TODAY",
                displayLong: "TODAY",
                day: "",
                index: this.day2index(k),
                clickable: !0
            } : c === j ? this.days[k] = {
                display: "TOMORROW",
                displayLong: "TOMORROW",
                day: "",
                index: this.day2index(k),
                clickable: !0
            } : c === e ? this.days[k] = {
                display: "YESTERDAY",
                displayLong: "YESTERDAY",
                day: "",
                index: this.day2index(k),
                clickable: !0
            } : this.days[k] = {
                display: "historical" === this.type ? null : this.weekdaysUsed[d],
                displayLong: f[d],
                day: b.getDate(),
                index: this.day2index(k),
                clickable: k < this.numOfDays,
                month: b.getMonth() + 1,
                year: b.getFullYear()
            };
            return a.minifest ? this.createDayHoursFromMinifest(a.minifest) : this.createDayHours(), this.initialPath = a.path || this.time2path(new Date), this
        }
        var f = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
            g = ["SUN2", "MON2", "TUE2", "WED2", "THU2", "FRI2", "SAT2"],
            h = b.getHoursFunction();
        return ("object" != typeof minifest || Object.keys(minifest).length < 10) && (minifest = function() {
                for (var a, b = {}, c = (new Date).add(-18, "hours"), d = c.getDate().pad() + "XX", e = 0; 15 > e; e++) {
                    a = c.add(e, "days").getDate().pad();
                    for (var f = 0; 24 > f; f += 3)(10 > e || 6 === f || 18 === f) && (b[a + f.pad()] = d, b[a + f.pad() + "t"] = d)
                }
                return b
            }(), d.event("Minifest missing!!!")), e.prototype.day2index = function(a) {
                return a / this.calendarDays + .52 / this.calendarDays
            }, e.prototype.createDayHours = function() {
                var a, b;
                for (a = this.offset; a < this.numberOfHours; a++) b = this.constructPath(a), this.dayHours[b] || (this.dayHours[b] = this.produceDayHourObject(a));
                return this.dayHours
            }, e.prototype.createDayHoursFromMinifest = function(a) {
                var b, c, d;
                for (d = 0; d <= this.numberOfHours; d++) b = this.startOfTimeline.add(d).toUTCPath(), c = b.replace(/^\d+\/\d+\/(\d+)\/(\d+)$/, "$1$2"), (a[c + "t"] || a[c]) && (this.dayHours[b] = this.produceDayHourObject(d), this.actualNumberOfHours = d);
                return this.maxIndex = this.actualNumberOfHours / (24 * this.calendarDays), this.dayHours
            }, e.prototype.produceDayHourObject = function(a) {
                var b = this.days[parseInt(a / 24)],
                    c = this.startOfTimeline.add(a);
                return {
                    text: b && b.display,
                    day: b && b.day,
                    month: b && b.month,
                    hour: h(c.getHours()),
                    index: a / (24 * this.calendarDays),
                    sequence: this.sequence++,
                    timestamp: c.getTime()
                }
            }, e.prototype.constructPath = function(a) {
                var b, c = this.startOfTimeline.add(a),
                    d = c.getUTCHours(),
                    e = d % this.step;
                return b = e < .3 * this.step ? d - e + this.offset : e >= .3 * this.step ? d + this.step - e + this.offset : d, c.setUTCHours(b), c.toUTCPath()
            }, e.prototype.index2path = function(a) {
                var b = this.dayHours;
                return Object.keys(b).reduce(function(c, d) {
                    return Math.abs(b[d].index - a) < Math.abs(b[c].index - a) ? d : c
                })
            }, e.prototype.time2index = function(a) {
                return (a - this.startOfTimeline) / (this.endOfcalendar - this.startOfTimeline)
            }, e.prototype.time2path = function(a) {
                return this.index2path(this.time2index(a))
            }, e.prototype.path2index = function(a) {
                var b = this.dayHours[a];
                if (b) return b.index;
                var c = this.path2date(a);
                return this.time2index(c.getTime())
            }, e.prototype.path2date = function(a) {
                var b = a.split("/");
                return new Date(Date.UTC(b[0], b[1] - 1, b[2], b[3], 0, 0))
            }, e.prototype.date2path = function(a) {
                var b = a.getFullYear(),
                    c = a.getMonth() + 1,
                    d = a.getDate(),
                    e = a.getHours();
                return [b, c.pad(2), d.pad(2), e.pad(2)].join("/")
            },
            function(a) {
                return new e(a)
            }
    }), /*! */
    W.define("overlays", ["Class", "storage", "broadcast", "settings", "colors"], function(a, b, c, d, e) {
        var f = {},
            g = [3, 3, 3, 3, 5, 5, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12],
            h = [4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 10, 10, 10, 10, 10, 10, 10, 10],
            i = "metric" === d.defaults ? 0 : 1;
        return f.trans = {
            wind: "WIND",
            gust: "GUST",
            temp: "TEMP",
            pressure: "PRESS",
            clouds: "CLOUDS",
            lclouds: "LCLOUDS",
            rain: "RACCU",
            snow: "SNOW",
            rh: "RH",
            waves: "WAVES",
            swell: "SWELL",
            wwaves: "WWAVES",
            swellper: "SWELLPER",
            snowcover: "SNOWCOVER"
        }, W.Overlay = a.extend({
            conv: {},
            defaults: [],
            _init: function() {
                var a = b.get("settings_" + this.ident);
                a && this.conv[a] ? this.metric = a : this.metric = this.defaults[i], this.gradient && this.prepareColors()
            },
            prepareColors: function() {
                var a, b, c = e.segmentedColorScale(this.gradient);
                for (this.preparedColors = [], this.colorsArray = [], this.startingValue = this.bounds[0], this.step = (this.bounds[1] - this.startingValue) / this.steps, a = 0; a < this.steps; a++) b = c(this.startingValue + this.step * a), this.preparedColors[a] = b, this.colorsArray[a] = b.concat(b).concat(b).concat(b)
            },
            convertValue: function(a) {
                var b = this.conv[this.metric];
                return b.conversion(a).toFixed(b.precision) + " " + (b.label || this.metric)
            },
            convertNumber: function(a) {
                var b = this.conv[this.metric];
                return b.conversion(a).toFixed(b.precision)
            },
            setMetric: function(a) {
                this.conv[a] && this.metric !== a && (this.metric = a, b.put("settings_" + this.ident, a), c.emit("metricChanged", this.ident, a))
            }
        }), f.temp = W.Overlay.extend({
            ident: "temp",
            pois: "cities",
            metric: null,
            defaults: ["°C", "°F"],
            conv: {
                "°C": {
                    conversion: function(a) {
                        return a - 273.15
                    },
                    precision: 1
                },
                "°F": {
                    conversion: function(a) {
                        return 9 * a / 5 - 459.67
                    },
                    precision: 1
                }
            },
            products: ["gfs", "mbeurope"],
            bounds: [193, 328],
            steps: 200,
            blur: h,
            gradient: [
                [193, [37, 4, 42, 120]],
                [206, [41, 10, 130, 120]],
                [219, [81, 40, 40, 120]],
                [233.15, [192, 37, 149, 120]],
                [255.372, [70, 215, 215, 120]],
                [273.15, [21, 84, 187, 120]],
                [275.15, [24, 132, 14, 120]],
                [291, [247, 251, 59, 120]],
                [298, [235, 167, 21, 120]],
                [311, [230, 71, 39, 120]],
                [328, [88, 27, 67, 120]]
            ],
            description: ["°C", "°F"],
            lines: [
                [237, -35, -31],
                [242, -30, -22],
                [247, -25, -13],
                [252, -20, -4],
                [257, -15, 5],
                [262, -10, 14],
                [267, -5, 23],
                [272, 0, 32],
                [277, 5, 41],
                [282, 10, 50],
                [287, 15, 59],
                [292, 20, 68],
                [297, 25, 77],
                [302, 30, 86],
                [307, 35, 95]
            ]
        }), f.wind = W.Overlay.extend({
            ident: "wind",
            pois: "metars",
            defaults: ["kt", "kt"],
            conv: {
                kt: {
                    conversion: function(a) {
                        return 1.943844 * a
                    },
                    precision: 0
                },
                bft: {
                    conversion: function(a) {
                        return .3 > a ? 0 : 1.5 > a ? 1 : 3.3 > a ? 2 : 5.5 > a ? 3 : 8 > a ? 4 : 10.8 > a ? 5 : 13.9 > a ? 6 : 17.2 > a ? 7 : 20.7 > a ? 8 : 24.5 > a ? 9 : 28.4 > a ? 10 : 32.6 > a ? 11 : 12
                    },
                    precision: 0
                },
                "m/s": {
                    conversion: function(a) {
                        return a
                    },
                    precision: 1
                },
                "km/h": {
                    conversion: function(a) {
                        return 3.6 * a
                    },
                    precision: 0
                },
                mph: {
                    conversion: function(a) {
                        return 2.236936 * a
                    },
                    precision: 0
                }
            },
            products: ["gfs", "mbeurope"],
            bounds: [0, 100],
            steps: 300,
            blur: h,
            gradient: [
                [0, [37, 74, 255, 80]],
                [1, [0, 100, 254, 80]],
                [3, [0, 200, 254, 80]],
                [5, [37, 193, 146, 80]],
                [7, [0, 230, 0, 80]],
                [9, [0, 250, 0, 80]],
                [11, [254, 225, 0, 80]],
                [13, [254, 174, 0, 80]],
                [15, [220, 74, 29, 80]],
                [17, [180, 0, 50, 80]],
                [19, [254, 0, 150, 80]],
                [21, [151, 50, 222, 80]],
                [24, [86, 54, 222, 80]],
                [27, [42, 132, 222, 80]],
                [29, [64, 199, 222, 80]],
                [100, [150, 0, 254, 80]]
            ],
            description: ["kt", "bft", "m/s", "mph", "km/h"],
            lines: [
                [0, 0, 0, 0, 0, 0],
                [2, 4, 2, 2, 4, 7],
                [4, 8, 3, 4, 9, 14],
                [6, 12, 4, 6, 13, 22],
                [8, 16, 5, 8, 18, 29],
                [10, 20, 5, 10, 22, 36],
                [12, 24, 6, 12, 27, 43],
                [14, 28, 7, 14, 31, 50],
                [16, 32, 7, 16, 36, 58],
                [18, 36, 8, 18, 40, 65],
                [20, 44, 9, 20, 45, 72],
                [24, 48, 9, 24, 55, 88],
                [27, 52, 10, 27, 60, 96],
                [29, 56, 11, 29, 64, 103]
            ]
        }), f.gust = f.wind, f.rh = W.Overlay.extend({
            ident: "rh",
            pois: "metars",
            defaults: ["%", "%"],
            conv: {
                "%": {
                    conversion: function(a) {
                        return a
                    },
                    precision: 0
                }
            },
            products: ["gfs", "mbeurope"],
            bounds: [0, 110],
            steps: 30,
            blur: h,
            gradient: [
                [0, [0, 0, 0, 80]],
                [25, [0, 0, 95, 80]],
                [60, [40, 44, 92, 60]],
                [75, [21, 13, 193, 80]],
                [90, [75, 63, 235, 100]],
                [100, [255, 53, 255, 100]],
                [110, [15, 53, 255, 100]]
            ],
            description: ["%"],
            lines: [
                [75, 75],
                [80, 80],
                [85, 85],
                [90, 90],
                [95, 95],
                [100, 100]
            ]
        }), f.pressure = W.Overlay.extend({
            ident: "pressure",
            pois: "pressure",
            defaults: ["hPa", "inHg"],
            conv: {
                hPa: {
                    conversion: function(a) {
                        return a / 100
                    },
                    precision: 0
                },
                mmHg: {
                    conversion: function(a) {
                        return a / 133.322387415
                    },
                    precision: 0
                },
                inHg: {
                    conversion: function(a) {
                        return a / 3386.389
                    },
                    precision: 2
                }
            },
            products: ["gfs"],
            bounds: [92e3, 108e3],
            steps: 200,
            blur: h,
            gradient: [
                [99e3, [37, 4, 42, 120]],
                [99500, [41, 10, 130, 120]],
                [1e5, [81, 40, 40, 120]],
                [100300, [192, 37, 149, 120]],
                [100600, [70, 215, 215, 120]],
                [100900, [21, 84, 187, 120]],
                [101500, [24, 132, 14, 120]],
                [101900, [247, 251, 59, 120]],
                [102200, [235, 167, 21, 120]],
                [102500, [230, 71, 39, 120]],
                [103e3, [88, 27, 67, 120]]
            ],
            description: ["hPa", "inHg"],
            lines: [
                [99500, 995, 29.38],
                [99800, 998, 29.47],
                [100100, 1001, 29.56],
                [100400, 1004, 29.64],
                [100700, 1007, 29.73],
                [101e3, 1010, 29.82],
                [101300, 1013, 29.91],
                [101600, 1016, 30],
                [101900, 1019, 30.09],
                [102200, 1022, 30.17],
                [102500, 1025, 30.27],
                [102800, 1028, 30.36]
            ]
        }), f.clouds = W.Overlay.extend({
            ident: "clouds",
            pois: "metars",
            defaults: ["mm/h", "in/h"],
            conv: {
                "in/h": {
                    conversion: function(a) {
                        return (a - 200) / 60 * .039
                    },
                    label: "in/h",
                    precision: 2
                },
                "mm/h": {
                    conversion: function(a) {
                        return (a - 200) / 60
                    },
                    label: "mm/h",
                    precision: 1
                }
            },
            products: ["gfs", "mbeurope"],
            bounds: [0, 2e3],
            steps: 1e3,
            blur: g,
            gradient: [
                [0, [0, 0, 0, 80]],
                [10, [0, 0, 0, 80]],
                [30, [127, 127, 127, 80]],
                [100, [255, 255, 255, 90]],
                [180, [255, 255, 255, 90]],
                [200, [230, 240, 255, 90]],
                [240, [0, 108, 192, 90]],
                [270, [0, 188, 0, 90]],
                [300, [156, 220, 0, 90]],
                [350, [224, 220, 0, 90]],
                [400, [252, 132, 0, 90]],
                [500, [252, 0, 0, 90]],
                [700, [160, 0, 0, 90]],
                [2e3, [160, 0, 0, 90]]
            ],
            description: ["mm/h", "in/h"],
            lines: [
                [230, .5, ".02"],
                [260, 1, ".04"],
                [290, 1.5, ".06"],
                [320, 2, ".08"],
                [380, 3, ".12"],
                [440, 4, ".16"],
                [500, 5, ".2"],
                [620, 7, ".3"],
                [800, 10, ".4"]
            ]
        }), f.snow = W.Overlay.extend({
            ident: "snow",
            pois: "empty",
            defaults: ["cm", "in"],
            conv: {
                "in": {
                    conversion: function(a) {
                        return .039 * a
                    },
                    precision: 0
                },
                cm: {
                    conversion: function(a) {
                        return a / 10
                    },
                    precision: 0
                }
            },
            products: ["accumulations"],
            bounds: [0, 8e3],
            steps: 8e3,
            blur: h,
            gradient: [
                [0, [0, 0, 0, 80]],
                [40, [0, 0, 0, 80]],
                [100, [118, 175, 222, 80]],
                [200, [108, 193, 154, 90]],
                [300, [180, 213, 85, 90]],
                [500, [242, 227, 41, 90]],
                [800, [250, 171, 50, 90]],
                [1500, [243, 116, 97, 90]],
                [3e3, [213, 133, 170, 90]],
                [8e3, [166, 142, 194, 90]]
            ],
            description: ["cm", "in"],
            lines: [
                [80, 8, 3.1],
                [100, 10, 3.9],
                [200, 20, 8],
                [300, 30, 11],
                [500, 50, 20],
                [1e3, "1m", "3ft"],
                [2e3, "2m", "6ft"],
                [3e3, "3m", "9ft"]
            ]
        }), f.rain = f.snow.extend({
            ident: "rain",
            pois: "empty",
            defaults: ["mm", "in"],
            conv: {
                "in": {
                    conversion: function(a) {
                        return .039 * a
                    },
                    precision: 1
                },
                mm: {
                    conversion: function(a) {
                        return a
                    },
                    precision: 0
                }
            },
            products: ["accumulations"],
            bounds: [0, 8e3],
            steps: 8e3,
            blur: h,
            gradient: [
                [0, [0, 0, 0, 80]],
                [1, [0, 0, 0, 80]],
                [5, [118, 175, 222, 80]],
                [10, [108, 193, 154, 90]],
                [30, [180, 213, 85, 90]],
                [40, [242, 227, 41, 90]],
                [120, [250, 171, 50, 90]],
                [500, [243, 116, 97, 90]],
                [1e3, [213, 133, 170, 90]],
                [8e3, [166, 142, 194, 90]]
            ],
            description: ["mm", "in"],
            lines: [
                [5, 5, ".2"],
                [10, 10, ".4"],
                [20, 20, ".8"],
                [30, 30, "1.2"],
                [40, 40, 1.5],
                [100, 100, 3.9],
                [1e3, "1m", "3ft"],
                [3e3, "3m", "9ft"]
            ]
        }), f.snowcover = f.snow.extend({
            products: ["snowcover"],
            bounds: [0, 3],
            steps: 30,
            blur: h,
            gradient: [
                [0, [0, 0, 0, 100]],
                [1, [0, 212, 255, 100]],
                [3, [0, 212, 255, 100]]
            ],
            description: null,
            lines: null
        }), f.lclouds = f.clouds.extend({
            pois: "metars",
            products: ["gfs"],
            bounds: [0, 200],
            steps: 50,
            blur: g,
            gradient: [
                [0, [0, 0, 0, 80]],
                [10, [0, 0, 0, 80]],
                [30, [255, 255, 255, 20]],
                [100, [255, 255, 255, 90]]
            ],
            lines: null,
            description: null
        }), f.waves = W.Overlay.extend({
            ident: "waves",
            pois: "waves",
            defaults: ["m", "ft"],
            conv: {
                m: {
                    conversion: function(a) {
                        return a
                    },
                    precision: 1
                },
                ft: {
                    conversion: function(a) {
                        return 3.28 * a
                    },
                    precision: 0
                }
            },
            products: ["waves"],
            bounds: [0, 30],
            steps: 400,
            blur: h,
            gradient: [
                [0, [200, 200, 200, 100]],
                [1, [0, 194, 243, 100]],
                [2, [0, 89, 166, 100]],
                [3, [13, 100, 255, 100]],
                [4, [247, 74, 255, 100]],
                [5, [188, 0, 184, 100]],
                [6, [255, 4, 83, 100]],
                [7, [255, 98, 69, 100]],
                [10, [255, 255, 255, 100]],
                [50, [188, 141, 190, 100]]
            ],
            description: ["m", "ft"],
            lines: [
                [.5, .5, 1.6],
                [1, 1, 3.3],
                [1.5, 1.5, 5],
                [2, 2, 6.6],
                [3, 3, 10],
                [4, 4, 13],
                [5, 5, 16],
                [6, 6, 20],
                [7, 7, 23],
                [8, 8, 26],
                [9, 9, 30]
            ]
        }), f.swell = f.waves, f.wwaves = f.waves, f.swellperiod = W.Overlay.extend({
            ident: "swellperiod",
            pois: "waves",
            defaults: ["sec.", "sec."],
            conv: {
                "sec.": {
                    conversion: function(a) {
                        return a
                    },
                    precision: 1
                }
            },
            products: ["waves"],
            bounds: [0, 30],
            steps: 400,
            blur: h,
            gradient: [
                [0, [37, 4, 42, 120]],
                [2, [41, 10, 130, 120]],
                [4, [81, 40, 40, 120]],
                [6, [192, 37, 149, 120]],
                [8, [70, 215, 215, 120]],
                [10, [21, 84, 187, 120]],
                [12, [24, 132, 14, 120]],
                [14, [247, 251, 59, 120]],
                [16, [235, 167, 21, 120]],
                [18, [230, 71, 39, 120]],
                [29, [88, 27, 67, 120]]
            ],
            description: ["sec."],
            lines: [
                [2, 2],
                [4, 4],
                [6, 6],
                [8, 8],
                [12, 12],
                [14, 14],
                [16, 16],
                [18, 18],
                [20, 20]
            ]
        }), f
    }),
    /*! 
    Copyright (c) 2014 Cameron Beccario - The MIT License (MIT) */
    W.define("colors", [], function() {
        function a(a) {
            function b(a, b) {
                var c = a[0],
                    d = a[1],
                    e = a[2],
                    f = a[3],
                    g = b[0] - c,
                    h = b[1] - d,
                    i = b[2] - e,
                    j = b[3] - f;
                return function(a) {
                    return [Math.floor(c + a * g), Math.floor(d + a * h), Math.floor(e + a * i), Math.floor(f + a * j)]
                }
            }

            function c(a, b, c) {
                return (Math.max(b, Math.min(a, c)) - b) / (c - b)
            }
            for (var d = [], e = [], f = [], g = 0; g < a.length - 1; g++) d.push(a[g + 1][0]), e.push(b(a[g][1], a[g + 1][1])), f.push([a[g][0], a[g + 1][0]]);
            return function(a) {
                var b;
                for (b = 0; b < d.length - 1 && !(a <= d[b]); b++);
                var g = f[b];
                return e[b](c(a, g[0], g[1]))
            }
        }
        return {
            segmentedColorScale: a
        }
    }), /*! */
    W.define("loader", ["http", "dataStore", "object", "jsonLoader", "imgLoader"], function(a, b, c, d, e) {
        function f(a) {
            var c, f, g = [],
                h = /\.jpg|\.png/.test(a.fullPath) ? e : d,
                i = b.get(),
                j = h.getRequiredTiles(a.map, a.tileZoom);
            for (c = 0; c < j.tiles.length; c++) g.push(h.loadTile(i, j, a, c));
            return f = new Promise(function(b, c) {
                Promise.all(g).then(function(c) {
                    b(h.composeObject(i, c, a, j))
                })["catch"](function(a) {
                    c(a)
                })
            }), f.cancel = function() {
                for (c = 0; c < g.length; c++) "function" == typeof g[c].cancel && g[c].cancel()
            }, f
        }

        function g(a, b, c) {
            return a.self.checkTiles(a, b, c)
        }
        return {
            load: f,
            checkTiles: g
        }
    }), /*! */
    W.define("jsonLoader", ["http", "lruCache", "object"], function(a, b, c) {
        var d = c.extend({}, {
            tilesCache: new b(30),
            emptyGrid: null,
            tilePrefix: "t",
            tileParams: [{
                size: 360,
                width: 1,
                tileSize: 360,
                resolution: 1
            }, {
                size: 30,
                width: 12,
                tileSize: 120,
                resolution: .25
            }, {
                size: 15,
                width: 24,
                tileSize: 120,
                resolution: .125
            }, {
                size: 7.5,
                width: 48,
                tileSize: 120,
                resolution: .0625
            }, {
                size: 3.75,
                width: 96,
                tileSize: 120,
                resolution: .03125
            }, {
                size: 1.875,
                width: 192,
                tileSize: 120,
                resolution: .015625
            }, {}, {}, {
                size: 60,
                width: 6,
                tileSize: 120,
                resolution: .5
            }],
            _init: function() {
                for (var a = [], b = 0; 14400 > b; b++) a[b] = null;
                this.emptyGrid = [{
                    data: a
                }, {
                    data: a
                }]
            },
            getRequiredTiles: function(a, b) {
                if (0 == b) return {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    height: 1,
                    tileZoom: 0,
                    tileSize: 360,
                    size: 360,
                    tiles: [{
                        x: 0,
                        y: 0
                    }],
                    paths: [""],
                    wrapped: !0,
                    resolution: 1,
                    self: this
                };
                var c, d, e, f, g = [],
                    h = [],
                    i = this.tilePrefix + b,
                    j = this.tileParams[b],
                    k = Math.floor(a.west / j.size),
                    l = Math.floor(a.east / j.size),
                    m = Math.floor((90 - a.north) / j.size),
                    n = Math.floor((90 - a.south) / j.size);
                for (k = 0 > k ? j.width + k : k, l = 0 > l ? j.width + l : l, k > l && (l += j.width), c = m, f = 0; n >= c; c++, f++)
                    for (d = k, e = 0; l >= d; d++, e++) g.push({
                        y: f,
                        x: e
                    }), h.push(i + "/" + c + "/" + (d > j.width - 1 ? d - j.width : d) + "/");
                return {
                    left: k,
                    right: l,
                    top: m,
                    bottom: n,
                    width: l - k + 1,
                    height: n - m + 1,
                    tileZoom: b,
                    tileSize: j.tileSize,
                    size: j.size,
                    tiles: g,
                    paths: h,
                    wrapped: !1,
                    resolution: j.resolution,
                    self: this
                }
            },
            checkTiles: function(a, b, c) {
                var d, e = a.paths,
                    f = this.getRequiredTiles(b, c).paths;
                for (d = 0; d < f.length; d++)
                    if (-1 === e.indexOf(f[d])) return !1;
                return !0
            },
            composeObject: function(a, b, d, e) {
                var f = {
                    tiles: e,
                    tileZoom: d.tileZoom,
                    overlay: d.gridName,
                    product: d.product,
                    level: d.level,
                    lastModified: b[0].lastModified,
                    data: a,
                    destWidth: e.tileSize * e.width + 1
                };
                if (0 === d.tileZoom) c.include(f, b[0]);
                else {
                    var g = (1 + e.right) * e.size - e.resolution;
                    c.include(f, {
                        lo1: e.left * e.size,
                        lo2: g > 360 ? g - 360 : g,
                        la2: 90 - e.top * e.size,
                        la1: 90 - (1 + e.bottom) * e.size - e.resolution,
                        dx: e.resolution,
                        dy: e.resolution
                    })
                }
                return f
            },
            loadTile: function(b, c, d, e) {
                var f, g, h, i, j = this,
                    k = c.tiles[e],
                    l = d.fullPath.replace(/<tiles>/, c.paths[e]),
                    m = {
                        cache: this.tilesCache,
                        parseHeaders: 0 === e
                    };
                return c.tileZoom && (m.substituteData = this.emptyTable), g = new Promise(function(g, n) {
                    f = a.get(l, m).then(function(a) {
                        if (h = j.injectData(a.data, b, d, k.x, k.y, c), 0 === e) try {
                            i = new Date(a.headers["last-modified"]), h.lastModified = i.getTime()
                        } catch (f) {}
                        g(h)
                    })
                }), g.cancel = function() {
                    "function" == typeof f.cancel && f.cancel()
                }, g
            },
            injectData: function(a, b, c, d, e, f) {
                var g, h, i, j, k, l, m, n, o = a[0].data || a[0],
                    p = a[1] && (a[1].data || a[1]),
                    q = a[2] && (a[2].data || a[2]),
                    r = 0,
                    s = 0,
                    t = c.gridName;
                for (0 === f.tileZoom ? (i = a[0].header, j = i.nx, k = i.ny, l = j + 1) : (j = k = f.tileSize, l = j * f.width + 1), g = 0; k > g; g++) {
                    for (r = 3 * ((k * e + g) * l + j * d), m = r, h = 0; j > h; h++) {
                        switch (t) {
                            case "gust":
                                b[r] = o[s] / 10;
                                break;
                            case "wind":
                                b[r] = o[s] / 10, b[r + 1] = p[s] / 10;
                                break;
                            case "waves":
                            case "swell":
                            case "wwaves":
                            case "swellperiod":
                            case "wwavesperiod":
                                n = .0174 * q[s], b[r] = -p[s] * Math.sin(n), b[r + 1] = -p[s] * Math.cos(n), b[r + 2] = o[s];
                                break;
                            default:
                                b[r] = o[s]
                        }
                        s++, r += 3
                    }
                    f.wrapped ? (b[r] = b[m], b[r + 1] = b[m + 1], b[r + 2] = b[m + 2]) : (b[r] = b[r - 3], b[r + 1] = b[r - 2], b[r + 2] = b[r - 1])
                }
                return i || {}
            }
        });
        return d
    }), /*! */
    W.define("imgLoader", ["object", "jsonLoader"], function(a, b) {
        var c = a.extend(b, {
            canvas: document.getElementById("jpg_decoder"),
            context: document.getElementById("jpg_decoder").getContext("2d"),
            tilePrefix: "j",
            tileParams: [{
                size: 360,
                width: 1,
                tileSize: 360,
                resolution: 1
            }, {
                size: 60,
                width: 6,
                tileSize: 240,
                resolution: .25
            }, {
                size: 30,
                width: 12,
                tileSize: 240,
                resolution: .125
            }, {
                size: 15,
                width: 24,
                tileSize: 240,
                resolution: .0625
            }, {
                size: 7.5,
                width: 48,
                tileSize: 240,
                resolution: .03125
            }, {
                size: 3.75,
                width: 96,
                tileSize: 240,
                resolution: .015625
            }, {}, {}, {
                size: 90,
                width: 4,
                tileSize: 180,
                resolution: .5
            }],
            _init: function() {},
            loadTile: function(a, b, c, d) {
                var e, f = this,
                    g = !1,
                    h = b.tiles[d],
                    i = c.fullPath.replace(/<tiles>/, b.paths[d]);
                return e = new Promise(function(d, e) {
                    var j, k, l, m;
                    j = new Image, j.crossOrigin = "Anonymous", j.onload = function() {
                        g || (f.canvas.width = j.width, f.canvas.height = j.height, f.context.drawImage(j, 0, 0, j.width, j.height), m = f.context.getImageData(0, 0, j.width, j.height), k = f.decodeHeader(m.data, j.width), l = f.injectData(m.data, a, c, h.x, h.y, b, k, j.width, j.height - 8), l.lastModified = parseInt(k[6]), d(l))
                    }, j.onerror = function() {
                        d({})
                    }, j.src = i, (j.complete || void 0 === j.complete) && (j.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", j.src = i)
                }), e.cancel = function() {
                    g = !0
                }, e
            },
            decodeHeader: function(a, b) {
                for (var c, d, e, f, g, h = new ArrayBuffer(28), i = new Uint8Array(h), j = new Float32Array(h), g = 4 * (4 * b) + 8, f = 0; 28 > f; f++) c = a[g], d = a[g + 1], e = a[g + 2], c = Math.round(c / 64), d = Math.round(d / 16), e = Math.round(e / 64), i[f] = (c << 6) + (d << 2) + e, g += 16;
                return j
            },
            injectData: function(a, b, c, d, e, f, g, h, i) {
                var j, e, k, l, m, n, o, p, q, r, s, t, u, v, w, x = 0,
                    y = 0,
                    z = 0;
                c.gridName;
                for (0 === f.tileZoom ? (n = h, o = i, k = n + 1) : (n = o = f.tileSize, k = n * f.width + 1), j = 0; 3 > j; j++)
                    if (l = g[2 * j], m = g[2 * j + 1], l || m) {
                        switch (j) {
                            case 0:
                                r = l, s = (m - l) / 255;
                                break;
                            case 1:
                                t = l, u = (m - l) / 255;
                                break;
                            case 2:
                                v = l, w = (m - l) / 255
                        }
                        x = j
                    }
                for (z = 8 * (4 * h), j = 0; o > j; j++) {
                    switch (y = 3 * ((o * e + j) * k + n * d), p = y, x) {
                        case 2:
                            for (q = 0; n > q; q++) 0 === a[z + 2] ? (b[y] = 0, b[y + 1] = 0, b[y + 2] = 0) : (b[y] = a[z] * s + r, b[y + 1] = a[z + 1] * u + t, b[y + 2] = a[z + 2] * w + v), z += 4, y += 3;
                            break;
                        case 1:
                            for (q = 0; n > q; q++) b[y] = a[z] * s + r, b[y + 1] = a[z + 1] * u + t, z += 4, y += 3;
                            break;
                        case 0:
                            for (q = 0; n > q; q++) b[y] = a[z] * s + r, z += 4, y += 3
                    }
                    f.wrapped ? (b[y] = b[p], b[y + 1] = b[p + 1], b[y + 2] = b[p + 2]) : (b[y] = b[y - 3], b[y + 1] = b[y - 2], b[y + 2] = b[y - 1])
                }
                return 0 === f.tileZoom ? {
                    nx: h,
                    ny: i,
                    dx: 1,
                    dy: 1,
                    la1: 90,
                    la2: 90 - i,
                    lo1: 0,
                    lo2: 359
                } : {}
            }
        });
        return c
    }), /*! */
    W.define("products", ["rootScope", "loader", "interpolation", "interFunctions", "http", "overlays", "broadcast", "object", "calendar", "particles", "log"], function(a, b, c, d, e, f, g, h, i, j, k) {
        var l, m = {},
            n = (new Date).toISOString().replace(/^\d+-(\d+)-(\d+)T.*$/, "$1$2");
        return m.getProductString = function(a, b) {
            var c = f[a].products;
            return c.indexOf(b) > -1 ? b : c[0]
        }, W.Product = W.Class.extend({
            interpolate: function(a) {
                return d.interpolateAll
            },
            refTime: function(a) {
                var b = a.path.replace(/^\d+\/\d+\/(\d+)\/(\d+)$/, "$1$2"),
                    c = this.minifest[b + "t"] || this.minifest[b];
                return c ? "?" + c : ""
            },
            load: function(c) {
                var d, e, f = [];
                c.tileZoom = this.getTileZoom(c), c.server = this.server || a.server;
                for (var g in this.pathGenerators) e = this.pathGenerators[g], d = "function" == typeof e ? e(c) : e, d && (c.fullPath = d.template(c) + this.refTime(c), c.gridName = "overlay" === g ? c.overlay : g, f.push(b.load(h.clone(c))));
                return f
            },
            display: function(a, b, d) {
                c.interpolate({
                    map: b.map,
                    grid: a[0],
                    overlay: a[1],
                    mapDirty: b.mapDirty,
                    colors: f[b.overlay],
                    disableOverlay: b.map.zoom >= this.disableOverlayZoom,
                    interpolate: this.interpolate(b),
                    particles: this.particles[b.map.source],
                    blurAmount: f[b.overlay].blur[b.map.zoom],
                    product: b.product
                }, d)
            },
            checkCoverage: function(a, b) {
                var c = null;
                return a ? (this.betterFcst && "out-of-bounds" !== m[this.betterFcst].checkCoverage(a, b) && (c = this.betterFcst), c !== l && (l = c, g.emit("betterFcst", c)), this.checkData(a[0], b)) : "no-data"
            },
            getTileZoom: function(a) {
                return a.historical ? 0 : this.zoom2zoom[a.map.zoom]
            },
            checkData: function(a, c) {
                return a.tileZoom === this.getTileZoom(c) && b.checkTiles(a.tiles, c.map, a.tileZoom) ? "ok" : "no-data"
            }
        }), m.gfs = W.Product.extend({
            minifest: minifest,
            zoom2zoom: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            animation: !0,
            calendar: i({
                minifest: this.minifest
            }),
            model: "GFS 12x12km",
            provider: "NOAA",
            interval: "6h",
            particles: j.wind,
            disableOverlayZoom: 12,
            pathGenerators: {
                wind: "{server}gfs/{path}/<tiles>wind-{level}.jpg",
                overlay: function(a) {
                    return "wind" === a.overlay ? null : "{server}gfs/{path}/<tiles>{overlay}-surface" + ("pressure" === a.overlay ? ".png" : ".jpg")
                }
            },
            betterFcst: "mbeurope",
            productReady: !0
        }), m.mbeurope = W.Product.extend({
            minifest: null,
            zoom2zoom: [1, 1, 1, 1, 1, 1, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            calendar: null,
            model: "NEMS 4x4km",
            provider: "Meteoblue.com",
            interval: "12h",
            animation: !0,
            particles: j.mbeurope,
            disableOverlayZoom: 12,
            betterFcst: null,
            productReady: !1,
            pathGenerators: {
                wind: "{server}mbeurope/{path}/<tiles>wind-{level}.jpg",
                overlay: function(a) {
                    return "wind" === a.overlay ? null : "{server}mbeurope/{path}/<tiles>{overlay}-surface.jpg"
                }
            },
            refTime: function(a) {
                var b = this.minifest[a.path.replace(/^\d+\/\d+\/(\d+)\/(\d+)$/, "$1$2")];
                return b ? "?" + b : ""
            },
            init: function(b) {
                var c = this;
                e.get(a.server + "mbeurope/minifest.json?timestamp=" + Date.now()).then(function(a) {
                    c.minifest = a.data, c.calendar = i({
                        numOfDays: 5,
                        minifest: c.minifest
                    })
                })["catch"](function() {
                    c.minifest = m.gfs.minifest, c.calendar = i({
                        numOfDays: 4
                    }), k.event("Error: failed to load NEMS4 minifest")
                }).then(function() {
                    c.productReady = !0, b()
                })
            },
            checkCoverage: function(a, b) {
                return b.map.west > -19 && b.map.east < 33 && b.map.north < 57 && b.map.south > 33 ? /surface|975h|950h|925h|900h|850h|750h/.test(b.level) ? this.checkData(a[0], b) : "not-supported-data" : "out-of-bounds"
            }
        }), m.accumulations = m.gfs.extend({
            interval: "12h",
            animation: !1,
            pathGenerators: {
                overlay: "{server}accumulations/<tiles>{overlay}-{acTime}.jpg"
            },
            betterFcst: null,
            productReady: !0,
            calendar: null,
            refTime: function() {
                return "?" + n
            },
            interpolate: function() {
                return d.interpolateOverlay
            }
        }), m.snowcover = m.accumulations.extend({
            zoom2zoom: [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            model: "NSIDC 1x1km",
            provider: "NSIDC (nsidc.org)",
            interval: "24h",
            disableOverlayZoom: 15,
            pathGenerators: {
                overlay: "{server}snowcover/latest/<tiles>snowcover.png"
            },
            checkCoverage: function(a, b) {
                return this.zoom2zoom[b.map.zoom] > 0 && b.map.south < -29 ? "out-of-bounds" : this.checkData(a[0], b)
            }
        }), m.waves = W.Product.extend({
            zoom2zoom: [0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
            minifest: minifest,
            model: "Wavewatch 3",
            provider: "NOAA",
            interval: "6h",
            disableOverlayZoom: 12,
            animation: !0,
            productReady: !0,
            calendar: i({
                numOfDays: 7
            }),
            pathGenerators: {
                overlay: function(a) {
                    return "{server}waves/{path}/<tiles>" + a.overlay.replace(/period/, "") + "-surface.png"
                }
            },
            betterFcst: null,
            particles: j.waves,
            interpolate: function(a) {
                return /period/.test(a.overlay) ? d.interpolateAll : d.interpolateWaves
            }
        }), m
    }), /*! */
    W.define("recents", ["storage", "broadcast", "object"], function(a, b, c) {
        function d() {
            return Object.keys(g).sort(function(a, b) {
                return g[b].counter - g[a].counter
            })
        }

        function e(a) {
            return a.lat = parseFloat(a.lat), a.lon = parseFloat(a.lon), a.icao || a.lat.toFixed(3) + "/" + a.lon.toFixed(3)
        }

        function f(a) {
            for (var b = d(), c = [], e = 0; e < Math.min(a, b.length); e++) c.push(g[b[e]]);
            return c
        }
        var g = a.get("recents2") || {},
            h = d();
        if (h.length > 100)
            for (var i = 100, j = h.length; j > i; i++) delete g[h[i]];
        return b.on("detailOpened", function(b) {
            var d = e(b);
            if (g[d]) g[d].counter++, setTimeout(function() {
                a.put("recents2", g)
            }, 300);
            else {
                var f = c.clone(b);
                f.counter = 1, g[d] = f
            }
        }), f
    }), /*! */
    W.define("dataStore", [], function() {
        function a() {
            return d++, d >= e.length && (d = 0), e[d]
        }
        for (var b = 10, c = 1036800, d = -1, e = [], f = 0; b > f; f++) e[f] = new Float32Array(c);
        return {
            get: a
        }
    }), /*! */
    W.define("task", ["interpolation", "broadcast", "products", "rootScope", "object", "Class"], function(a, b, c, d, e, f) {
        function g(a) {
            "cancelled" !== a && console.warn("task cancelled was called")
        }
        return W.Task = f.extend({
                params: null,
                product: null,
                mapDirty: !1,
                _init: function() {
                    this.status = "init", this.data = null, this.loadingTasks = [], this.antiCycleCounter = 0
                },
                setStatus: function(a) {
                    this.status = a
                },
                load: function(a) {
                    var b = this;
                    return this.loadingTasks = this.product.load(this.params), this.setStatus("loading"), Promise.all(this.loadingTasks).then(function(c) {
                        b.product.transform && b.product.transform(c), b.setStatus("loaded"), b.loadingTasks = [], b.data = c, b.display(a)
                    }, g), this
                },
                cancel: function() {
                    "loading" === this.status ? this.loadingTasks.map(function(a) {
                        "function" == typeof a.cancel && a.cancel()
                    }) : "interpolation" === this.status && a.cancel()
                },
                display: function(a) {
                    var f = "ok",
                        g = this;
                    switch (this.mapDirty && (this.params.map = e.clone(d.map), this.params.mapDirty = !0, f = this.product.checkCoverage(this.data, this.params)), f) {
                        case "ok":
                            this.setStatus("interpolation"), this.product.display(this.data, this.params, function() {
                                g.params.lastModified = g.data[0].lastModified, g.setStatus("finished"), g.antiCycleCounter = 0, b.emit("redrawFinished", g.params, g.mapDirty), g.mapDirty = !1, g.params.mapDirty = !1, "function" == typeof a && a()
                            });
                            break;
                        case "no-data":
                            this.antiCycleCounter++ > 10 ? console.error("displayAnimation was cycled") : this.load();
                            break;
                        case "out-of-bounds":
                        case "out-of-timeline":
                        case "not-supported-data":
                            this.params.model = this.params.product = "gfs", this.product = c.gfs, b.emit("modelChanged", "gfs"), this.load()
                    }
                }
            }),
            function(a) {
                return W.Task.extend(a)
            }
    }), /*! */
    W.define("blurWorker", ["log"], function(a) {
        function b() {
            function a(a) {
                i = new Uint16Array(a), d = new Uint16Array(a), e = new Uint16Array(a)
            }

            function b(a) {
                j = new Uint32Array(a), f = new Uint32Array(a)
            }

            function c(c, k, l, m, n, o, p, q) {
                q = q || 3, q |= 0;
                var r = o * p;
                r > i.length && a(r), r = Math.max(o, p), r > j.length && b(r);
                var s, t, u, v, w, x, y, z, A, B, C, w, D, x, y, z, E, D = 0,
                    F = 0,
                    G = 0,
                    H = o - 1,
                    I = p - 1,
                    J = q + 1,
                    K = g[q],
                    L = h[q],
                    M = (1e7 * K >>> L) / 1e7,
                    N = j,
                    O = f,
                    P = i,
                    Q = d,
                    R = e,
                    S = c.data;
                for (B = 0; o > B; B++) N[B] = ((x = B + J) < H ? x : H) << 2, O[B] = (x = B - q) > 0 ? x << 2 : 0;
                for (v = 0; p > v; v++) {
                    for (s = S[G] * J, t = S[G + 1] * J, u = S[G + 2] * J, w = 1; q >= w; w++) x = G + ((w > H ? H : w) << 2), s += S[x], t += S[x + 1], u += S[x + 2];
                    for (D = 0; o > D; D++) P[F] = s, Q[F] = t, R[F] = u, y = G + N[D], z = G + O[D], s += S[y] - S[z], t += S[y + 1] - S[z + 1], u += S[y + 2] - S[z + 2], F++;
                    G += o << 2
                }
                for (C = 0; p > C; C++) N[C] = ((x = C + J) < I ? x : I) * o, O[C] = (x = C - q) > 0 ? x * o : 0;
                for (D = 0; o > D; D++) {
                    for (A = D, s = P[A] * J, t = Q[A] * J, u = R[A] * J, w = 1; q >= w; w++) A += w > I ? 0 : o, s += P[A], t += Q[A], u += R[A];
                    for (F = D << 2, E = o << 2, v = 0; p > v; v++) S[F] = s * M, S[F + 1] = t * M, S[F + 2] = u * M, y = D + N[v], z = D + O[v], s += P[y] - P[z], t += Q[y] - Q[z], u += R[y] - R[z], F += E
                }
                return c
            }
            var d, e, f, g = [1, 57, 41, 21, 203, 34, 97, 73, 227, 91, 149, 62, 105, 45, 39, 137, 241, 107, 3, 173, 39, 71, 65, 238, 219, 101, 187, 87, 81, 151, 141, 133],
                h = [0, 9, 10, 10, 14, 12, 14, 14, 16, 15, 16, 15, 16, 15, 15, 17, 18, 17, 12, 18, 16, 17, 17, 19, 19, 18, 19, 18, 18, 19, 19, 19, 20, 19, 20, 20, 20, 20, 20, 20],
                i = [],
                j = [];
            self.onmessage = function(a) {
                postMessage(c(a.data.imageData, a.data.x0, a.data.y0, a.data.xMax, a.data.yMax, a.data.width, a.data.height, a.data.radius))
            }
        }
        var c, d, e = null,
            f = window.URL || window.webkitURL;
        if (!window.Worker) return a.event("Web Worker not supported"), null;
        try {
            d = "(" + b.toString() + ")()";
            try {
                c = new Blob([d], {
                    type: "application/javascript"
                })
            } catch (g) {
                window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder, c = new BlobBuilder, c.append(d), c = blob.getBlob(), a.event("Using old version of BlobBuilder, just for info")
            }
            try {
                e = new Worker(f.createObjectURL(c))
            } catch (g) {
                return a.event("Unable to createObjectURL " + g), null
            }
        } catch (g) {
            return a.event("Failed to stringyfy blurFunction " + g), null
        }
        return e
    }), /*! */
    W.define("particles", ["rootScope", "Class"], function(a, b) {
        var c = {
            surface: 1,
            "975h": 1,
            "950h": 1,
            "925h": .98,
            "900h": .9,
            "850h": .8,
            "750h": .75,
            "700h": .7,
            "550h": .65,
            "450h": .6,
            "350h": .55,
            "300h": .5,
            "250h": .45,
            "200h": .4,
            "150h": .35
        };
        W.Particles = {
            globe: b.extend({
                level2reduce: c,
                getVelocity: function(a) {
                    return 1 / (this.velocity.a * a.map.scale + this.velocity.b) * this.level2reduce[a.grid.level]
                },
                getAmount: function(a) {
                    return this.multiplier.a * Math.pow(a.map.scale, 2) + this.multiplier.b
                },
                getLineWidth: function(b) {
                    var c = a.isMobile ? .4 : 0;
                    return scale = b.map.scale, scale > 300 ? 1 + c : scale > 200 ? .8 + c : .6 + c
                },
                getStyles: function(a) {
                    var b = .8;
                    return ["rgba(255,255,255," + Math.max(0, b - .6) + ")", "rgba(255,255,255," + Math.max(0, b - .4) + ")", "rgba(255,255,255," + Math.max(0, b - .2) + ")", "rgba(255,255,255," + b + ")"]
                },
                getMaxAge: function(a) {
                    return 100
                },
                getBlendingAlpha: function(a) {
                    var b = a.map.scale;
                    return 500 > b ? .96 : 600 > b ? .94 : .92
                }
            }),
            maps: b.extend({
                stylesBlue: ["rgba(200,0,150,1)", "rgba(200,0,150,1)", "rgba(200,0,150,1)", "rgba(200,0,150,1)"],
                level2reduce: c,
                getVelocity: function(a) {
                    return this.level2reduce[a.grid.level] / (this.velocity.constant * Math.pow(this.velocity.pow, a.map.zoom - this.velocity.zoom))
                },
                getAmount: function(a) {
                    return multiplier = 1 / (this.multiplier.constant * Math.pow(this.multiplier.pow, a.map.zoom - this.multiplier.zoom)), Math.min(15e3, Math.round(a.map.width * a.map.height * multiplier))
                },
                getLineWidth: function(a) {
                    return this.lineWidth[a.map.zoom]
                },
                getStyles: function(a) {
                    return a.map.zoom >= 12 ? this.stylesBlue : this.styles
                },
                getMaxAge: function(a) {
                    return 100
                },
                getBlendingAlpha: function(a) {
                    return .9
                }
            })
        };
        var d = {
            wind: {},
            waves: {},
            mbeurope: {}
        };
        return d.wind.maps = W.Particles.maps.extend({
            animation: "wind",
            styles: ["rgba(200,200,200,1)", "rgba(215,215,215,1)", "rgba(235,235,235,1)", "rgba(255,255,255,1)"],
            lineWidth: [.6, .6, .6, 1, 1.2, 1.6, 1.8, 2, 2.2, 2.4, 2.4, 2.4, 2.4, 2.6, 2.8, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            multiplier: {
                constant: 50,
                pow: 1.6,
                zoom: 2
            },
            velocity: {
                constant: 70,
                pow: 1.6,
                zoom: 3
            }
        }), d.wind.globe = W.Particles.globe.extend({
            animation: "wind",
            multiplier: {
                a: .028,
                b: 700
            },
            velocity: {
                a: .166666,
                b: 20
            }
        }), d.waves.maps = W.Particles.maps.extend({
            animation: "waves",
            styles: ["rgba(100,100,100,0.1)", "rgba(150,150,150,0.15)", "rgba(200,200,200,0.2)", "rgba(255,255,255,0.3)"],
            lineWidth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            multiplier: {
                constant: 50,
                pow: 1.3,
                zoom: 2
            },
            velocity: {
                constant: 150,
                pow: 1.6,
                zoom: 2
            }
        }), d.waves.globe = W.Particles.globe.extend({
            animation: "waves",
            getStyles: function(a) {
                return ["rgba(100,100,100,0.1)", "rgba(150,150,150,0.15)", "rgba(200,200,200,0.2)", "rgba(255,255,255,0.3)"]
            },
            getBlendingAlpha: function(a) {
                return .9
            },
            multiplier: {
                a: .08,
                b: 1e3
            },
            velocity: {
                a: 1,
                b: 0
            }
        }), d.mbeurope.maps = d.wind.maps.extend({
            lineWidth: [1, 1, 1, 1, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.4, 2.4, 2.4, 2.6, 2.8, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            multiplier: {
                constant: 50,
                pow: 1.5,
                zoom: 2
            },
            velocity: {
                constant: 70,
                pow: 1.7,
                zoom: 3
            }
        }), d
    }),
    /*!	
    Copyright (c) 2014 Cameron Beccario - The MIT License (MIT) 
    Copyright (c) 2014 - 2015 Citationtech, S.E. all rights reserved */
    W.define("interpolation", ["rootScope", "interFunctions", "animation", "mapsCtrl", "blurWorker", "object", "broadcast", "globe", "maps"], function(a, b, c, d, e, f, g, h, i) {
        "use strict";

        function j() {
            return w && v
        }

        function k(a) {
            return a - a % 4
        }

        function l(a, c) {
            if (!w || !v) return null;
            var d, e = w.dx,
                f = w.dy,
                g = Math.max(w.la1, w.la2),
                h = w.lo1,
                i = [];
            return d = b.interpolatePoint(a, c, g, h, e, f, w.destWidth), v(i, w.data, x && x.data, d[0], d[1], d[2], d[3], d[4], d[5]), {
                wind: Math.sqrt(i[0] * i[0] + i[1] * i[1]),
                angle: 10 * Math.floor(18 + 18 * Math.atan2(i[0], i[1]) / Math.PI),
                overlayName: x && x.overlay || w.overlay,
                overlayValue: i[2]
            }
        }

        function m(a, g) {
            function j(c) {
                var d, e, f, g, i, j, k = K,
                    m = r,
                    n = t,
                    o = q,
                    p = ea,
                    u = K,
                    v = ja,
                    w = s,
                    x = b.distort,
                    y = T,
                    z = h.isVisible.bind(h),
                    A = c / Z,
                    B = A * Math.ceil(N / 4),
                    D = 3 * B,
                    F = 6 * B,
                    G = 4 * B,
                    J = a.interpolate;
                if (l)
                    for (D += C / Z * 3, d = C; E >= d; d += Z, D += 3, F += 6, G += 4)
                        if (z(d, c)) {
                            if (ga) {
                                if (j = y.invert([d, c]), e = j[0], f = j[1], isNaN(f) || !isFinite(f)) continue;
                                V(f, e, d, c, n, G), U(f, e, F)
                            }
                            J(p, H, I, m[F], m[F + 1], m[F + 2], m[F + 3], m[F + 4], m[F + 5]), x(p, k, n[G], n[G + 1], n[G + 2], n[G + 3]), i = p[2], o[D] = p[0], o[D + 1] = p[1], o[D + 2] = i, g = W[Math.floor((i - X) / Y)], g && v(Math.max(0, d - 2), Math.max(0, c - 2), g)
                        } else o[D] = 0, o[D + 1] = 0, o[D + 2] = -1;
                else
                    for (f = $ * (2 * Math.atan(Math.exp((da - c) / ba)) - _), k = ga ? w[A] = (1 - .01 * Math.abs(f)) * u : w[A], d = 0; N >= d; d += Z, D += 3, F += 6, G += 4) ga && (e = L + d / N * aa, V(f, e, d, c, n, G), U(f, e, F)), J(p, H, I, m[F], m[F + 1], m[F + 2], m[F + 3], m[F + 4], m[F + 5]), x(p, k, n[G], n[G + 1], n[G + 2], n[G + 3]), i = p[2], o[D] = p[0], o[D + 1] = p[1], o[D + 2] = i, g = W[Math.floor((i - X) / Y)], g && v(d, c, g)
            }
            window.clearTimeout(y), A = !1;
            var l = "globe" === a.map.source,
                m = d.getCanvas(),
                n = m.overlayCanvas,
                p = [n[0].getContext("2d"), n[1].getContext("2d")],
                B = m.actualCanvas,
                C = k(a.map.x),
                D = k(a.map.y),
                E = a.map.xMax,
                F = a.map.yMax,
                G = a.grid,
                H = G.data,
                I = a.overlay && a.overlay.data,
                J = a.map,
                K = a.particles.getVelocity(a),
                L = (J.westRad, J.west),
                M = J.height,
                N = J.width,
                O = Math.abs(G.dx),
                P = Math.abs(G.dy),
                Q = G.destWidth,
                R = Math.max(G.la1, G.la2),
                S = G.lo1,
                T = l ? h.projection : null,
                U = b.interpolationFunction(R, S, O, P, Q, r),
                V = b.distortionFunction(T, N, M, J.northRad, J.southRad, J.eastRad, J.westRad),
                W = a.colors.colorsArray,
                X = a.colors.startingValue,
                Y = a.colors.step,
                Z = 4,
                $ = 180 / Math.PI,
                _ = Math.PI / 2,
                aa = J.east - J.west,
                ba = N / aa * 360 / (2 * Math.PI),
                ca = ba / 2 * Math.log((1 + Math.sin(J.southRad)) / (1 - Math.sin(J.southRad))),
                da = M + ca,
                ea = new Float32Array(5),
                fa = f.signature([a.product, J.lat, J.lon, J.zoom, J.width, J.height, O, P, Q, R, S]),
                ga = !!a.mapDirty || fa !== u;
            (l || !a.mapDirty) && (B = B ? 0 : 1), a.disableOverlay ? (p[0].clearRect(0, 0, N, M), p[1].clearRect(0, 0, N, M)) : l && p[B].clearRect(0, 0, N, M);
            var ha = p[B].getImageData(0, 0, N, M),
                ia = ha.data,
                ja = a.disableOverlay ? function() {} : b.colorizeFunction(ia, N, M),
                ka = ga ? 300 : 50,
                la = 0 | D;
            ! function ma() {
                for (var b = Date.now(); F > la;)
                    if (j(la), la += Z, z++, z > 20 && (z = 0, Date.now() - b > ka)) return void(y = setTimeout(ma, 50));
                v = a.interpolate, w = a.grid, x = a.overlay, u = fa, m.actualCanvas = B, e && !a.disableOverlay && (e.postMessage({
                    imageData: ha,
                    width: N,
                    height: M,
                    radius: a.blur
                }), e.onmessage = function(a) {
                    A || p[B].putImageData(a.data, 0, 0)
                }), !l && a.mapDirty && i.resetCanvas(), a.disableOverlay || p[B].putImageData(ha, 0, 0), (l || !a.mapDirty) && (n[B].style.opacity = 1, n[B ? 0 : 1].style.opacity = 0), l && a.mapDirty && (m.particleCanvas.style.opacity = 1), (ga || a.particles && a.particles.name !== o) && (c.stop(), c.run(q, a, m.particleCanvas), o = a.particles.name), g()
            }()
        }

        function n() {
            window.clearTimeout(y), A = !0
        }
        var o, p = parseInt(a.maxPixels / 16) + 4500,
            q = new Float32Array(3 * p),
            r = new Float32Array(6 * p),
            s = new Float32Array(screen.height || 700),
            t = new Float32Array(4 * p),
            u = "",
            v = null,
            w = null,
            x = null,
            y = null,
            z = 0,
            A = !1;
        return {
            hasGrid: j,
            interpolateValues: l,
            interpolate: m,
            cancel: n
        }
    }),
    /*!	
    Copyright (c) 2014 Cameron Beccario - The MIT License (MIT) 
    Copyright (c) 2014 - 2015 Citationtech, S.E. all rights reserved */
    W.define("interFunctions", [], function() {
        function a(a, b) {
            var c = a - b * Math.floor(a / b);
            return c === b ? 0 : c
        }

        function b(a, b, c, d, e, f, g, h, i) {
            var j, k;
            return j = b[d] * f + b[d + 3] * g + b[e] * h + b[e + 3] * i, k = b[d + 1] * f + b[d + 4] * g + b[e + 1] * h + b[e + 4] * i, a[0] = j, a[1] = k, a[2] = c ? c[d] * f + c[d + 3] * g + c[e] * h + c[e + 3] * i : Math.sqrt(j * j + k * k), a
        }

        function c(a, b, c, d, e, f, g, h, i) {
            return a[2] = b[d] * f + b[d + 3] * g + b[e] * h + b[e + 3] * i, a
        }

        function d(a, b, c, d, e, f, g, h, i) {
            return a[0] = b[d] * f + b[d + 3] * g + b[e] * h + b[e + 3] * i, a[1] = b[d + 1] * f + b[d + 4] * g + b[e + 1] * h + b[e + 4] * i, a[2] = b[d + 2] * f + b[d + 5] * g + b[e + 2] * h + b[e + 5] * i, a
        }

        function e(b, c, d, e, f, g) {
            return function(h, i, j) {
                var k = a(i - c, 360) / d,
                    l = (b - h) / e,
                    m = Math.floor(k),
                    n = Math.floor(l),
                    o = k - m,
                    p = l - n,
                    q = 1 - o,
                    r = 1 - p;
                g[j] = 3 * (n * f + m), g[j + 1] = 3 * ((n + 1) * f + m), g[j + 2] = q * r, g[j + 3] = o * r, g[j + 4] = q * p, g[j + 5] = o * p
            }
        }

        function f(b, c, d, e, f, g, h) {
            var i = a(c - e, 360) / f,
                j = (d - b) / g,
                k = Math.floor(i),
                l = Math.floor(j),
                m = i - k,
                n = j - l,
                o = 1 - m,
                p = 1 - n,
                q = o * p,
                r = m * p,
                s = o * n,
                t = m * n;
            return [3 * (l * h + k), 3 * ((l + 1) * h + k), q, r, s, t]
        }

        function g(a, b, c, d, e, f, g) {
            function h(a) {
                return Math.log(Math.tan(a / 2 + i))
            }
            var i = Math.PI / 4,
                j = h(e),
                k = h(d),
                l = b / (f - g),
                m = c / (k - j),
                n = a ? function(b, c) {
                    return a([c, b])
                } : function(a, b) {
                    var c = (Math.deg2rad(b) - g) * l,
                        d = (k - h(Math.deg2rad(a))) * m;
                    return [c, d]
                };
            return function(a, b, c, d, e, f) {
                var g = 0 > b ? 36e-6 : -36e-6,
                    h = 0 > a ? 36e-6 : -36e-6,
                    i = n(a, b + g),
                    j = n(a + h, b),
                    k = Math.cos(a / 720 * Math.PI);
                e[f] = (i[0] - c) / g / k, e[f + 1] = (i[1] - d) / g / k, e[f + 2] = (j[0] - c) / h, e[f + 3] = (j[1] - d) / h
            }
        }

        function h(a, b, c, d, e, f) {
            var g = a[0] * b,
                h = a[1] * b;
            return a[0] = c * g + d * h, a[1] = e * g + f * h, a
        }

        function i(a, b, c) {
            var d = c - 4 | 0,
                e = b - 4 | 0;
            return a.set ? function(f, g, h) {
                var i = f - e;
                if (i > 0 && (h = h.slice(0, 4 * (4 - i))), g >= d)
                    for (; c > g; g++) a.set(h, 4 * (g * b + f));
                else a.set(h, 4 * (g * b + f)), a.set(h, 4 * ((g + 1) * b + f)), a.set(h, 4 * ((g + 2) * b + f)), a.set(h, 4 * ((g + 3) * b + f))
            } : function(c, d, e) {
                var f, g, h, i, j = e[0],
                    k = e[1],
                    l = e[2],
                    m = e[3];
                g = 4;
                do {
                    h = 4, i = c;
                    do f = 4 * (d * b + i), a[f] = j, a[f + 1] = k, a[f + 2] = l, a[f + 3] = m, i++; while (h--);
                    d++
                } while (g--)
            }
        }
        return {
            floorMod: a,
            interpolateOverlay: c,
            interpolateAll: b,
            interpolateWaves: d,
            interpolationFunction: e,
            interpolatePoint: f,
            distortionFunction: g,
            distort: h,
            colorizeFunction: i
        }
    }), /*! */
    W.define("animation", ["broadcast", "object", "globe"], function(a, b, c) {
        function d() {
            window.clearTimeout(p)
        }

        function e(a, b, c, d) {
            var e = m;
            e[c] = a, e[c + 1] = b, e[c + 2] = 0, e[c + 3] = 0, e[c + 4] = Math.floor(Math.random() * d), e[c + 5] = 0
        }

        function f(a, b, d, f) {
            var g = c.dummy([150 * Math.random() - 75, 150 * Math.random() - 75]),
                h = g[0],
                i = g[1];
            return h >= 0 && i >= 0 && a >= h && b >= i ? void e(h, i, d, f) : !0
        }

        function g(a, b, c, d) {
            for (; f(a, b, c, d););
        }

        function h(a, b, d, f) {
            var g = c.dummy([150 * Math.random() - 75, 150 * Math.random() - 75]);
            e(g[0], g[1], d, f)
        }

        function i(a, b, c, d) {
            e(Math.random() * a, Math.random() * b, c, d)
        }

        function j(a, c, d) {
            function e(a) {
                return 12 > a ? 0 : 25 > a ? 1 : 37 > a ? 2 : 62 > a ? 3 : 75 > a ? 2 : 85 > a ? 1 : 0
            }

            function j(a) {
                return Math.min(3, Math.floor(a / 40))
            }

            function q() {
                var a = t.map.scale,
                    b = t.map.width / 2,
                    c = t.map.height / 2;
                return function(d, e, f) {
                    var g = (Math.pow(b - e, 2) + Math.pow(c - f, 2)) / Math.pow(a, 2),
                        h = Math.min(3, Math.floor(d / 3));
                    return g > .75 ? h - 1 : g > .85 ? h - 2 : h
                }
            }

            function s() {
                var b, c, d, f, g, h, i, j, k, o, p, q, r = Math.ceil(B / 4),
                    s = l,
                    t = m,
                    u = n,
                    v = 6 * E,
                    w = a,
                    x = B,
                    z = C,
                    A = H;
                if (G)
                    for (d = 0; v > d; d += 6) t[d + 4] > F && D(B, C, d, F), b = t[d], c = t[d + 1], q = 3 * (Math.round(c / 4) * r + Math.round(b / 4)), y && -1 === w[q + 2] || b > x || c > z || 0 > b || 0 > c ? (t[d + 4] = F + 1, u[d + 5] = 10) : (g = w[q], h = w[q + 1], i = b + g, j = c + h, t[d] = i, t[d + 1] = j, t[d + 4]++, k = Math.sqrt(g * g + h * h) / 2.5, o = g / k, p = h / k, u[d] = b - p, u[d + 1] = c + o, u[d + 2] = b + p, u[d + 3] = c - o, u[d + 5] = e(t[d + 4]));
                else
                    for (d = 0; v > d; d += 6) t[d + 4] > F && D(B, C, d, F), b = t[d], c = t[d + 1], q = 3 * (Math.round(c / 4) * r + Math.round(b / 4)), y && -1 === w[q + 2] || b > x || c > z || 0 > b || 0 > c ? (t[d + 4] = F + 1, t[d + 5] = 10) : (t[d + 2] = b + w[q], t[d + 3] = c + w[q + 1], t[d + 4]++, t[d + 5] = I(w[q + 2], b, c));
                if (s.globalCompositeOperation = "destination-in", s.fillRect(0, 0, B, C), s.globalCompositeOperation = "source-over", G)
                    for (d = 0; 4 > d; d++) {
                        for (s.beginPath(), s.strokeStyle = A[d], f = 0; v > f; f += 6) u[f + 5] === d && (s.moveTo(u[f], u[f + 1]), s.lineTo(u[f + 2], u[f + 3]));
                        s.stroke()
                    } else
                        for (d = 0; 4 > d; d++) {
                            for (s.beginPath(), s.strokeStyle = A[d], f = 0; v > f; f += 6) t[f + 5] === d && (s.moveTo(t[f], t[f + 1]), s.lineTo(t[f + 2], t[f + 3]), t[f] = t[f + 2], t[f + 1] = t[f + 3]);
                            s.stroke()
                        }
            }
            var t;
            window.clearTimeout(p), d && (k = d, l = d.getContext("2d")), l.clearRect(0, 0, k.width, k.height), a ? (t = b.clone(c, ["map"]), t.particles = c.particles, o.rows = a, o.params = t) : (a = o.rows, t = o.params);
            var u = t.particles;
            if (!r) {
                var v, w, x, y = "globe" === t.map.source,
                    z = t.map.x,
                    A = t.map.y,
                    B = t.map.width,
                    C = t.map.height,
                    D = (t.map.xMax - z, t.map.yMax - A, y ? f : i),
                    E = u.getAmount.call(u, t),
                    F = u.getMaxAge(),
                    G = "waves" === u.animation,
                    H = u.getStyles.call(u, t);
                for (v = 0, w = 0; E > v; v++) D(B, C, w, F) || (w += 6);
                x = w / 6, y && (E = 0 | x, D = E > x ? g : h), l.lineWidth = u.getLineWidth.call(u, t), l.fillStyle = "rgba(0, 0, 0," + u.getBlendingAlpha.call(u, t) + ")";
                var I = y ? q() : j;
                ! function J() {
                    p = setTimeout(function() {
                        s(), J()
                    }, 40)
                }()
            }
        }
        var k, l, m = new Float32Array(9e4),
            n = new Float32Array(9e4),
            o = {},
            p = null,
            q = null,
            r = !1;
        return a.on("particlesAnimation", function(a) {
            "off" === a ? (k.style.opacity = 0, r = !0, q = setTimeout(d, 1500)) : (r = !1, clearTimeout(q), j(), k.style.opacity = 1)
        }), c.on("movestart", d), {
            run: j,
            stop: d
        }
    }), /*! */
    W.define("windytyUI", ["rootScope", "broadcast", "trans", "progressBar", "UIhelpers", "products", "Class", "Evented", "calendar"], function(a, b, c, d, e, f, g, h, i) {
        var j = document.getElementById("windyty-ui"),
            k = ["wind", "temp", "clouds", "waves", "snow", "pressure"];
        a.initialPath = a.initialPath || f.gfs.calendar.initialPath, j.onchange = function(a) {
            var b = a.target.name,
                c = a.target.value;
            l.set(b, c, a), a.preventDefault()
        }, j.onclick = function(a) {
            var c = a.target,
                d = c.dataset.name,
                e = c.dataset.value;
            if (d) {
                switch (d) {
                    case "initCalendar":
                        p.reinit();
                        break;
                    case "overlayGroup":
                        n.toggleGroup(c, e);
                        break;
                    case "barIndex":
                        p.setIndex(e), l.set("path", p.index2path(e));
                        break;
                    case "play":
                        b.emit("playPauseClicked");
                        break;
                    case "snowcover":
                        l.set("overlay", "snowcover", a);
                        break;
                    case "particles":
                        c.classList.toggle("off"), b.emit("particlesAnimation", c.className);
                        break;
                    case "model":
                    case "acTime":
                        "snowcover" === l.overlay && l.set("overlay", "snow", a), l.set(d, e, a)
                }
                a.preventDefault()
            }
        }, document.body.addEventListener("keydown", function(b) {
            var c = b.keyCode;
            if (!l.hasCalendar() || 37 !== c && 39 !== c) 38 === c || 40 === c ? l.set("overlay", k.getNextItem(l.overlay, 40 === c), "key") : 33 !== c && 34 !== c || "wind" !== l.overlay || l.set("level", a.levels.getNextItem(l.level, 33 === c), "key");
            else {
                var d = l.productObj.calendar.dayHours,
                    e = Object.keys(d),
                    f = Math.min(Math.max(e.indexOf(l.path) + (37 === c ? -1 : 1), 0), e.length - 1);
                l.set("path", e[f], "key")
            }
            b.preventDefault()
        });
        var l = h.extend({
                overlay: null,
                level: a.level,
                acTime: a.acTime,
                model: a.model,
                path: a.path || a.initialPath,
                product: null,
                productObj: null,
                historical: !1,
                hasCalendar: function() {
                    return !!this.productObj.calendar
                },
                hasHistory: function() {
                    return "gfs" === product
                },
                init: function() {
                    var c = this;
                    this.set("overlay", a.overlay), b.on("indexChanged", function(a) {
                        c.set("path", p.index2path(a))
                    }), b.on("modelChanged", function(a) {
                        c.set("model", a)
                    }), b.on("historicalPath", function(a) {
                        c.hasHistory || (c.set("overlay", "wind", "key", !0), c.set("model", "gfs", "key", !0)), c.set("path", a)
                    }), this.emit("init", this.productObj)
                },
                set: function(a, b, c, d) {
                    if (this[a] != b) {
                        if (this[a] = b, this.emit(a, b, c), "overlay" !== a && "model" !== a) return void this.emitOut(a, d);
                        var e = f.getProductString(l.overlay, this.model === m.betterFcst ? this.model : null);
                        e !== this.product ? (this.product = e, this.productObj = f[e], this._initProduct(e, function() {
                            this.emit("product", e, this.productObj), this.productObj.calendar && p.getIndex() > this.productObj.calendar.maxIndex && (p.setIndex(this.productObj.calendar.maxIndex), this.path = p.index2path(this.productObj.calendar.maxIndex), this.emit("path", this.path)), this.emitOut("overlay+product", d)
                        }.bind(this))) : this.emitOut("overlay", d)
                    }
                },
                emitOut: function(a, c) {
                    c || b.emit("paramsChanged", this, a)
                },
                _initProduct: function(a, b) {
                    var c = f[a];
                    c.productReady ? b() : c.init(b)
                },
                toDefaults: function() {
                    this.set("path", a.initialPath, "key", !0), this.set("level", "surface", "key", !0), this.set("acTime", "next24h", "key", !0), this.set("model", "gfs", "key", !0), this.set("overlay", "wind", "key")
                }
            }),
            m = e.divs.extend({
                form: j,
                divsId: "model",
                betterFcst: "",
                mbeuropeMessage: !0,
                onchange: function(a) {
                    this.setDivs(a)
                },
                onProductChange: function(a) {
                    document.getElementById("mb-info").className = a
                },
                toggleBetterFcst: function(a) {
                    if (this.mbeuropeMessage && "mbeurope" === a) {
                        var b = document.getElementById("message-nems");
                        this.mbeuropeMessage = !1, b.className = "show", setTimeout(function() {
                            b.className = ""
                        }, 1e4)
                    }
                    this.betterFcst = a, document.getElementById("settings").className = a || ""
                },
                _init: function() {
                    b.on("betterFcst", this.toggleBetterFcst.bind(this)), l.on("model", this.onchange.bind(this)), l.on("product", this.onProductChange.bind(this)), this.set(l.model)
                }
            }),
            n = (e.select.extend(e.divs, {
                form: j,
                selectId: "#acc-select",
                divsId: "acTime",
                onchange: function(a, b) {
                    this.setDivs(a), !b || "key" !== b && "acc-select" === b.target.id || this.setSelect(a)
                },
                onProductChange: function(a) {
                    "snowcover" === a ? this.setDivs(-1) : this.setDivs(l.acTime)
                },
                _init: function() {
                    l.on("acTime", this.onchange.bind(this)), l.on("product", this.onProductChange.bind(this)), this.set(l.acTime)
                },
                set: function(a) {
                    this.setSelect(a), this.setDivs(a)
                }
            }), e.select.extend({
                form: j,
                selectId: "#level-select",
                onchange: function(a, b) {
                    "key" === b && this.set(a)
                },
                _init: function() {
                    l.on("level", this.onchange.bind(this)), this.set(l.level)
                }
            }), e.select.extend({
                form: j,
                selectId: "#overlay-select",
                groups: {
                    1: ["gust"],
                    2: ["rh", "lclouds", "rain"],
                    3: ["wwaves", "swell", "swellperiod"]
                },
                onchange: function(a, b) {
                    "snowcover" !== a && b && ("key" === b ? (l.loaderOffset = 44, this.setRadios(a), this.setSelect(a)) : "overlay-select" === b.target.id ? (l.loaderOffset = 0, this.setRadios(a)) : (l.loaderOffset = b.target.offsetTop, this.setSelect(a)))
                },
                toggleGroup: function(a, b) {
                    var c = "up" === a.className;
                    c ? this.groups[b].indexOf(l.overlay) < 0 && this.closeGroup(b) : this.openGroup(b)
                },
                openGroup: function(a) {
                    document.getElementById("overlayGroupSpan" + a).className = "up", document.getElementById("overlayGroup" + a).classList.add("show")
                },
                closeGroup: function(a) {
                    document.getElementById("overlayGroupSpan" + a).className = "", document.getElementById("overlayGroup" + a).classList.remove("show")
                },
                setRadios: function(a) {
                    for (var b in this.groups) this.groups[b].indexOf(a) > -1 ? this.openGroup(b) : this.closeGroup(b);
                    j.querySelector('input[type="radio"][value="' + a + '"]').checked = !0
                },
                _init: function() {
                    l.on("overlay", this.onchange.bind(this)), this.set(a.overlay)
                },
                set: function(a) {
                    "snowcover" === a && (a = "snow"), this.setSelect(a), this.setRadios(a)
                }
            })),
            o = g.extend({
                onchange: function(a) {
                    document.getElementById("bottom").className = (/rain|snow/.test(a) ? "shy UIaccumulations " : "shy UIcalendar ") + a
                },
                _init: function() {
                    l.on("overlay", this.onchange.bind(this)), this.set(l.overlay)
                },
                set: function(a) {
                    this.onchange(a)
                }
            }),
            p = (o.extend({
                element: document.getElementById("snowcover-btn"),
                onchange: function(a) {
                    "snowcover" === a ? this.element.classList.add("selected") : this.element.classList.remove("selected")
                },
                _init: function() {
                    l.on("product", this.onchange.bind(this)), this.set(l.product)
                }
            }), e.select.extend(d, {
                form: j,
                selectId: "select.calendar-select",
                calendar: f.gfs.calendar,
                pbwElement: document.getElementById("progress-bar-wrapper"),
                index2path: function(a) {
                    return this.calendar.index2path(a)
                },
                onchange: function(a, b) {
                    "key" === b ? (this.setIndex(this.calendar.path2index(a)), this.setSelect(a)) : b && "calendar-select" === b.target.className ? this.setIndex(this.calendar.path2index(a)) : this.setSelect(a)
                },
                onProductChange: function(a, b) {
                    var c = b.calendar;
                    c && this.calendar !== c && (this.calendar = c, this.set(l.path))
                },
                oninit: function(a) {
                    this.calendar = a.calendar || this.calendar;
                    var c = this.calendar.path2index(l.path);
                    0 > c ? this.setHistorical(l.path) : (this.set(l.path), this.setIndex(c)), l.on("path", this.onchange.bind(this)), l.on("product", this.onProductChange.bind(this)), b.on("langChanged", function() {
                        this.set(l.path)
                    }.bind(this))
                },
                reinit: function() {
                    this.calendar = f.gfs.calendar, this.set(a.initialPath), l.historical = !1, l.set("path", a.initialPath, "key"), document.body.classList.remove("historical")
                },
                _init: function() {
                    l.once("init", this.oninit.bind(this)), b.on("historicalPath", this.setHistorical.bind(this)), b.on("earlierPath", this.setEarlier.bind(this))
                },
                setEarlier: function() {
                    var a = this.calendar.startOfTimeline.add(-4, "days").midnight();
                    a > new Date(2015, 0, 1) && b.emit("historicalPath", this.calendar.date2path(a))
                },
                setHistorical: function(a) {
                    this.calendar = i({
                        numOfDays: 10,
                        calendarDays: 10,
                        startOfTimeline: this.calendar.path2date(a).add(-5, "days").midnight()
                    }), document.body.classList.add("historical"), l.historical = !0, this.set(a), this.setIndex(this.calendar.path2index(a))
                },
                set: function(a) {
                    function b(a) {
                        return a.display ? c[a.display] + " " + a.day : a.day + "." + a.month + "." + a.year
                    }

                    function d(a) {
                        return a.text ? c[a.text] + " " + a.day + " - " + a.hour : a.day + "." + a.month + " - " + a.hour
                    }
                    var e, f, g = "",
                        h = "",
                        i = this.calendar.days,
                        k = i.length,
                        l = 100 / k,
                        m = this.calendar.dayHours;
                    for (f = 0; k > f; f++) e = i[f], g += (e.clickable ? '<div data-name="barIndex" data-value="' + e.index + '" class="clickable"' : "<div") + ' style="width:' + l + '%;">' + b(e) + "</div>";
                    document.getElementById("calendar").innerHTML = g;
                    for (f in m) e = m[f], h += '<option value="' + f + '"' + (f === a ? ' selected="true" ' : "") + ">" + d(e) + "</option>";
                    j.querySelector(".calendar-select").innerHTML = h, this.init(k, this.calendar)
                }
            }));
        return l.init(), l
    }), /*! */
    W.define("progressBar", ["broadcast", "settings", "helpers", "trans"], function(a, b, c, d) {
        function e() {
            return m
        }
        var f, g, h, i, j, k = 0,
            l = 30,
            m = .1,
            n = (progressBarWrapper = document.getElementById("progress-bar"), document.getElementById("progress")),
            o = b.getHoursFunction();
        setTimeout(function() {
            document.getElementById("progress-bar-wrapper").className = ""
        }, 1e4);
        var p = W.Class.extend({
            div: document.getElementById("timecode"),
            text: document.getElementById("timecode-box"),
            progressLine: document.getElementById("progress-line"),
            dragging: !1,
            left: null,
            calendar: null,
            calendarDays: 0,
            w: 50,
            update: function(a, b) {
                return this.left = b || Math.max(0, Math.min(j, a.clientX - f)), this.progressLine.style.width = this.div.style.left = this.left + "px", this.text.textContent = this.createText(), this.left
            },
            createText: function() {
                if (this.left < l) return d.EARLIER;
                var a = "",
                    b = this.left - l;
                if (this.calendar) {
                    var c = this.calendar[Math.floor(this.calendarDays * b / k)];
                    if (!c) return;
                    a = c.display ? d[c.displayLong] + (c.day && " " + c.day) + " - " : c.day + "." + c.month + ": "
                }
                return a += o(parseInt(b / k * h) % 24)
            },
            bcast: function() {
                m = (this.left - l) / k, 0 > m ? a.emit("earlierPath") : a.emit("indexChanged", m)
            },
            addAnimation: function() {
                this.div.style.transition = this.progressLine.style.transition = "all ease-in-out 250ms"
            },
            removeAnimation: function() {
                window.setTimeout(function() {
                    this.div.style.transition = this.progressLine.style.transition = null
                }.bind(this), 300)
            },
            dragBox: function(a) {
                this.update(a)
            },
            touchBox: function(a) {
                this.update(a.touches && 1 === a.touches.length ? a.touches[0] : a), a.preventDefault()
            },
            endDrag: function(a) {
                this.dragging = !1, this.bcast();
                var b = this.text.getClientRects()[0];
                b && (this.w = b.width), window.removeEventListener("mousemove", this.dragBoxFun), window.removeEventListener("mouseup", this.endDragFun)
            },
            endTouch: function(a) {
                this.dragging = !1, this.bcast(), window.removeEventListener("touchmove", this.touchBoxFun), window.removeEventListener("touchend", this.endTouchFun)
            },
            startDrag: function(a) {
                this.dragging = !0, window.addEventListener("mousemove", this.dragBoxFun), window.addEventListener("mouseup", this.endDragFun)
            },
            startTouch: function(a) {
                this.dragging = !0, window.addEventListener("touchmove", this.touchBoxFun), window.addEventListener("touchend", this.endTouchFun)
            },
            click: function(a) {
                this.dragging || (this.addAnimation(), this.update(a), this.bcast(), this.removeAnimation())
            },
            setIndex: function(a, b) {
                b || this.addAnimation(), m = a, this.update(null, a * k + l) + "px", b || this.removeAnimation()
            },
            init: function(a, b) {
                b && (this.type = b.type, this.calendar = b.days, this.calendarDays = this.calendar.length), g = a || 14, h = 24 * g, i = b && b.maxIndex || 1, this.resize()
            },
            resize: function() {
                this.recalculate(), j = i * k + l, n.style.width = j + "px", this.setIndex(m)
            },
            recalculate: function() {
                var a = progressBarWrapper.getClientRects()[0];
                a && (f = a.left, k = a.width)
            },
            _init: function() {
                this.dragBoxFun = this.dragBox.bind(this), this.endDragFun = this.endDrag.bind(this), this.touchBoxFun = this.touchBox.bind(this), this.endTouchFun = this.endTouch.bind(this), this.div.addEventListener("mousedown", this.startDrag.bind(this)), this.div.addEventListener("touchstart", this.startTouch.bind(this)), n.addEventListener("click", this.click.bind(this)), window.addEventListener("resize", c.debounce(this.resize.bind(this), 100))
            }
        });
        p.extend({
            div: document.getElementById("ghost-timecode"),
            text: document.getElementById("ghost-box"),
            calendar: null,
            left: 0,
            update: function(a) {
                this.left = Math.max(0, Math.min(j, a.clientX - f)), this.div.style.left = this.left + "px", this.div.style["margin-top"] = p.left - this.left < 30 && this.left - p.left < p.w ? "-25px" : "-10px", this.text.textContent = this.createText()
            },
            _init: function() {
                var a = this;
                n.addEventListener("mouseenter", function(b) {
                    p.dragging || (a.div.style.opacity = 1)
                }), n.addEventListener("mousemove", function(b) {
                    p.dragging ? a.div.style.opacity = 0 : a.update(b)
                }), n.addEventListener("mouseleave", function(b) {
                    a.div.style.opacity = 0
                })
            }
        });
        return {
            setIndex: p.setIndex.bind(p),
            getIndex: e,
            init: p.init.bind(p)
        }
    }), /*! */
    W.define("legend", ["overlays", "broadcast"], function(a, b) {
        function c(a) {
            if (!a.description) return void(h.innerHTML = "");
            var b, c, d, e, f = "",
                i = a.lines,
                j = a.description,
                k = a.preparedColors,
                l = a.startingValue,
                m = a.step,
                n = a.metric;
            for (g = j.indexOf(n), 0 > g && (g = 0), b = 0; b < i.length; b++) c = i[b], d = k[Math.floor((c[0] - l) / m)], e = "rgba(" + d[0] + "," + d[1] + "," + d[2] + "," + d[3] / 200 + ")", f += '<div style="background-color:' + e + ';">' + i[b][1 + g] + "</div>", 0 === b && (f = '<div style="background-color:' + e + ';">' + j[g] + "</div>" + f);
            h.innerHTML = f
        }

        function d(b) {
            h.classList.add("animate"), setTimeout(function() {
                f = b, e = a[b], c(e), h.classList.remove("animate")
            }, 400)
        }
        var e, f, g, h = document.getElementById("legend");
        h.onclick = function(a) {
            var b, c;
            (b = e.description) && (c = b.cycleItems(b[g], !0), e.setMetric(c))
        }, b.on("metricChanged", function(a) {
            a === e.ident && d(a)
        }), b.on("redrawFinished", function(a) {
            a.overlay !== f && d(a.overlay)
        })
    }), /*! */
    W.define("search", ["http", "trans", "storage", "rootScope", "broadcast", "recents", "Class"], function(a, b, c, d, e, f, g, h) {
        function i(a) {
            var b = a.target.value;
            b.length > 1 && m !== b ? (m = b, o.hide(), p = n, l && clearTimeout(l), l = setTimeout(function() {
                n.load(b)
            }, 300)) : b.length < 2 && n.hide()
        }

        function j(a) {
            var b = a.keyCode;
            27 === b ? (m ? (m = "", k.value = "") : k.blur(), n.hide()) : p.onkeypress(b), a.stopPropagation()
        }
        var k = document.getElementById("q"),
            l = null,
            m = "",
            n = g.extend({
                data: [],
                index: -1,
                paginationStep: 5,
                element: document.getElementById("results"),
                elementData: document.getElementById("results-data"),
                image: document.getElementById("results").querySelector("img"),
                loader: document.getElementById("results-loader"),
                _init: function() {
                    this.image.onmousedown = function(a) {
                        a.preventDefault(), a.stopPropagation()
                    }, this.image.onclick = function() {
                        this.doAction(this.image)
                    }.bind(this), this.image.onload = function() {
                        this.loader.className = ""
                    }.bind(this)
                },
                onkeypress: function(a) {
                    switch (a) {
                        case 40:
                            this.colorize(1);
                            break;
                        case 38:
                            this.colorize(-1);
                            break;
                        case 9:
                        case 13:
                            this.doAction(this.element.querySelector(".active"))
                    }
                },
                doAction: function(a) {
                    var b, c;
                    if (a && a.dataset)
                        if (b = a.dataset.name, c = a.dataset.value, "next" === b) this.show(this.data, parseInt(c));
                        else {
                            var d = this.data[c];
                            e.emit("rqstOpen", "detail", {
                                lat: d.lat,
                                lon: d.lon,
                                name: d.title,
                                fromSearch: !0,
                                icao: d.icao || null
                            }), e.emit("log", "search/" + (m || "recents")), k.blur()
                        }
                },
                colorize: function(a, b) {
                    var c, d, e = this.element.querySelectorAll("a");
                    for (this.index = a ? Math.min(Math.max(this.index + a, 0), e.length - 1) : b, c = e.length; c--;) d = e[c], c === this.index ? (d.classList.add("active"), this.mapize(d)) : d.classList.remove("active")
                },
                load: function(b) {
                    var c, f = this;
                    k.className = "loading", a.get(d.server2 + "node/search/" + b.replace(/\//g, " ")).then(function(a) {
                        c = a.data, k.className = "", b === m && (c && "2airports" == c[0] ? (f.hide(), e.emit("rqstOpen", "fltline", c[1])) : f.show(c, 0))
                    })["catch"](function(a) {
                        f.elementData.innerHTML = "", k.className = ""
                    })
                },
                show: function(a, c) {
                    var d, e, f, g, h;
                    if (this.elementData.innerHTML = "", c = c || 0, a.length > 0) {
                        for (g = c + this.paginationStep, this.data = a, this.index = -1, e = c, f = Math.min(a.length, g); f > e; e++) d = a[e], h = this.newItem("hit", e, e - c, '<div class="title">' + d.title + '</div><span class="poi_' + d.type + '"></span><br><div class="subtitle">' + (d.region && "<span>" + d.region + ",</span>") + d.country + "</div>"), this.elementData.appendChild(h);
                        a.length > g && (h = this.newItem("next", g, e - c, '<div class="title">' + b.NEXT + "</div>"), this.elementData.appendChild(h)), this.element.className = "show"
                    } else this.hide()
                },
                hide: function() {
                    this.element.className = ""
                },
                mapize: function(a) {
                    if (a && "hit" === a.dataset.name) {
                        var b = a.dataset.value,
                            c = this.data[b],
                            e = parseFloat(c.lat),
                            f = parseFloat(c.lon);
                        this.element.classList.add("wide"), this.loader.className = "show", this.image.src = "https://image.maps.cit.api.here.com/mia/1.6/mapview?c=" + e + "%2C" + f + "&z=10&w=350&t=2&h=240&f=1&" + d.hereMapsID, this.image.dataset.value = b
                    } else this.element.classList.remove("wide")
                },
                newItem: function(a, b, c, d) {
                    var e = document.createElement("a");
                    return e.dataset.name = a, e.dataset.value = b, e.innerHTML = d, e.onmouseenter = function() {
                        this.colorize(null, c)
                    }.bind(this), e.onmouseleave = function() {
                        e.className = ""
                    }, e.onmousedown = function(a) {
                        a.preventDefault(), a.stopPropagation()
                    }, e.onclick = function(a) {
                        this.doAction(e, a)
                    }.bind(this), e
                }
            }),
            o = n.extend({
                data: f(10),
                index: -1,
                paginationStep: 10,
                element: document.getElementById("recents"),
                _init: function() {
                    this.element.onclick = function() {
                        this.doAction(this.element.querySelector("a:hover"))
                    }.bind(this)
                },
                show: function() {
                    var a = "<span>" + b.POPULARS + "</span>";
                    if (this.index = -1, this.data.length > 0) {
                        this.element.className = "show";
                        for (var c = 0, d = this.data.length; d > c; c++) a = a + '<a data-name="recent" data-value="' + c + '">' + this.data[c].name + "</a>";
                        this.element.innerHTML = a
                    }
                },
                mapize: function() {}
            }),
            p = null;
        k.onfocus = function() {
            o.show(), p = o, k.addEventListener("keydown", j), k.addEventListener("keyup", i)
        }, k.onblur = function() {
            m = "", k.value = "", o.hide(), n.hide(), k.removeEventListener("keydown", j), k.removeEventListener("keyup", i)
        }
    }), /*! */
    W.define("location", ["broadcast", "rootScope", "http", "log"], function(a, b, c, d) {
        function e() {
            window.history.pushState({}, "", i + "?" + p)
        }
        var f, g, h, i = window.location.pathname,
            j = [],
            k = null;
        if (i && (j = i.replace(/(?:spot\/(?:location|ad)\/)/, "").replace(/\/name\/[^\/]+/, "").split("/")), 2 === j.length && j[1].length > 4) h = j[1];
        else
            for (var l = 0; l < j.length; l++) /^\w\w\w\w$/.test(j[l]) && (k = j[l].toUpperCase()), /^-?\d+\.\d+$/.test(j[l]) && /^-?\d+\.\d+$/.test(j[l + 1]) && (f = j[l], g = j[l + 1]);
        if (f && g || k || h) {
            var m = b.startupDetail = {
                lat: f,
                lon: g,
                icao: k
            };
            a.on("dependenciesResolved", function() {
                m.lat && m.lon ? a.emit("rqstOpen", "detail", m) : h ? a.emit("rqstOpen", h) : m.icao && c.get(b.server2 + "node/search/" + m.icao).then(function(b) {
                    try {
                        m.lat = parseFloat(b.data[0].lat), m.lon = parseFloat(b.data[0].lon), a.emit("rqstOpen", "detail", m)
                    } catch (c) {}
                })
            })
        } else i = "";
        var n, o, p = window.location.search.substring(1);
        if (/\S+,\S+,\S+/.test(p)) {
            n = p.split(",");
            for (var l = 0; l < n.length; l++) o = n[l], /^-?\d+\.\d+$/.test(o) && /^-?\d+\.\d+$/.test(n[l + 1]) && /^\d+$/.test(n[l + 2]) && (b.sharedCoords = {
                lat: parseFloat(o),
                lon: parseFloat(n[l + 1]),
                zoom: parseInt(n[l + 2])
            }, l += 2), b.levels.indexOf(o) > -1 && (b.level = o), b.overlays.indexOf(o) > -1 && (b.overlay = o), b.acTimes.indexOf(o) > -1 && (b.acTime = o), /^(\d\d\d\d)-(\d\d)-(\d\d)-(\d\d)$/.test(o) && (b.path = o.replace(/-/g, "/")), "marker" === o && a.once("redrawFinished", function() {
                a.emit("popupRequested", b.sharedCoords.lat, b.sharedCoords.lon)
            })
        }
        if (b.startupDetail ? b.startupDetail.icao ? d.page("startup/ad") : d.page("startup/spot") : b.sharedCoords ? d.page("startup/sharedCoords") : d.page("startup/plain"), window.history.pushState) {
            var q = document.title;
            a.on("detailClosed", function() {
                document.title = q, i = "", e()
            }), a.on("detailOpened", function(a) {
                a.icao ? (i = a.icao.toUpperCase(), document.title = "Windyty: " + i + ", METAR, TAF and weather forecast") : (i = a.lat.toFixed(3) + "/" + a.lon.toFixed(3), document.title = "Windyty: " + a.name + " weather forecast"), e()
            }), a.on("redrawFinished", function(a) {
                var c = [a.map.lat.toFixed(3), a.map.lon.toFixed(3), a.map.zoom];
                "accumulations" === a.product && "next24h" !== a.acTime ? c.unshift(a.acTime) : a.path !== b.initialPath && c.unshift(a.path.replace(/\//g, "-")), "wind" !== a.overlay && c.unshift(a.overlay), "surface" !== a.level && "wind" === a.overlay && c.unshift(a.level), p = c.join(","), e()
            })
        }
    }), /*! */
    W.define("productInfo", ["broadcast", "products", "trans"], function(a, b, c) {
        function d() {
            f.className = "show"
        }

        function e() {
            f.className = ""
        }
        var f = document.getElementById("productinfo"),
            g = document.getElementById("model-info");
        a.on("redrawFinished", function(a) {
            var d, e, g = b[a.product],
                h = new Date(a.lastModified),
                i = Math.floor((Date.now() - h.getTime()) / 6e4);
            e = 60 > i ? i + "m ago" : Math.floor(i / 60) + "h ago", d = "<span>" + c.MENU_F_MODEL + "</span>: " + g.model + " <br /><span>" + c.MENU_U_INTERVAL + "</span>: " + g.interval + " <br /><span>" + c.MENU_D_UPDATED + "</span>: " + e + "<br />", f.innerHTML = d
        }), g.onmouseenter = d, g.onmouseleave = e
    }), /*! */
    W.define("loaders", ["broadcast"], function(a) {
        function b(a) {
            this.element = document.getElementById("loader-" + a), this.isOn = !1
        }
        var c = {};
        b.prototype.on = function() {
            this.isOn || (this.isOn = !0, this.element.className = "loader show")
        }, b.prototype.off = function() {
            this.isOn && (this.element.className = "loader", this.isOn = !1)
        }, ["overlay", "all", "path", "path2", "acTime", "level"].forEach(function(a) {
            c[a] = new b(a)
        }), a.on("paramsChanged", function(a, b) {
            switch (c.all.on(), b) {
                case "overlay":
                case "overlay+product":
                    c.overlay.on(), c.overlay.element.style.top = a.loaderOffset + "px";
                    break;
                case "path":
                    c.path.on(), c.path2.on();
                    break;
                case "acTime":
                    c.acTime.on();
                    break;
                case "level":
                    c.level.on()
            }
        }), a.on("mapChanged", function() {
            c.all.on()
        }), a.on("redrawFinished", function() {
            setTimeout(function() {
                c.all.off(), c.overlay.off(), c.path.off(), c.path2.off(), c.acTime.off(), c.level.off()
            }, 50)
        })
    }), /*! */
    W.define("UItweaks", ["object", "broadcast"], function(a, b) {
        var c = document.body.classList,
            d = document.getElementById("navmenu");
        d.on = !1, d.onclick = function() {
            this.on = !this.on, this.on ? c.add("mobilemenu-up") : c.remove("mobilemenu-up")
        };
        var e = document.getElementById("lupa");
        e.on = !1, e.onclick = function() {
            this.on = !this.on, this.on ? c.add("search") : c.remove("search")
        };
        var f = document.getElementById("settings-icon");
        f.onclick = function() {
            b.emit("rqstOpen", "settings")
        };
        var g, h = document.getElementById("community-icon");
        h.onmouseover = function() {
            g = setTimeout(function() {
                b.emit("rqstOpen", "community")
            }, 500)
        }, h.onmouseout = function() {
            g && clearTimeout(g)
        };
        var i, j = document.getElementById("tools-icon");
        j.onmouseover = function() {
            i = setTimeout(function() {
                b.emit("rqstOpen", "tools")
            }, 500)
        }, j.onmouseout = function() {
            i && clearTimeout(i)
        };
        var k = document.getElementById("location-icon");
        k.onclick = function() {
            b.emit("locationRqstd")
        }
    }), /*! */
    W.define("UIhelpers", ["Class"], function(a) {
        var b = {};
        return b.setSelect = function(a, b, c) {
            var d = a.querySelector(b),
                e = a.querySelector(b + ' > option[value="' + c + '"]');
            d && e ? d.selectedIndex = e.index || 0 : console.warn("Failed to set value for", b, c)
        }, b.setDivs = function(a, b, c) {
            var d, e = a.querySelector('div[data-name="' + b + '"][data-value="' + c + '"]') || a.querySelector('div[data-name="' + b + '"]'),
                f = e.dataset.value,
                g = e.parentNode.children;
            for (d = 0; d < g.length; d++) - 1 === c ? g[d].classList.remove("selected") : f === g[d].dataset.value ? g[d].classList.add("selected") : g[d].classList.remove("selected")
        }, b.select = a.extend({
            setSelect: function(a) {
                b.setSelect(this.form, this.selectId, a)
            },
            set: function(a) {
                this.setSelect(a)
            }
        }), b.divs = a.extend({
            setDivs: function(a) {
                b.setDivs(this.form, this.divsId, a)
            },
            set: function(a) {
                this.setDivs(a)
            }
        }), b
    }), /*! */
    W.define("windytyCtrl", ["task", "windytyUI", "broadcast", "rootScope", "object", "mapsCtrl", "products", "progressBar", "log"], function(a, b, c, d, e, f, g, h, i) {
        function j(a) {
            m ? (m.mapDirty = !0, "interpolation" === m.status && (m.cancel(), m.display())) : n ? (n.cancel(), n.mapDirty = !0, n.display()) : k(b)
        }

        function k(b) {
            m && m.cancel(), n && n.cancel(), m = a({
                mapDirty: !1,
                params: e.clone(b, ["path", "acTime", "level", "overlay", "product", "model", "historical"]),
                product: g[b.product]
            }), m.params.map = e.clone(d.map), o.isRunning && (m.params.fromAnimation = !0), m.load(function() {
                n = m, m = null, o.isRunning && (o.semaphore = !1)
            })
        }

        function l() {
            navigator.geolocation.getCurrentPosition(function(a) {
                var b = a.coords.latitude,
                    d = a.coords.longitude;
                f.center({
                    lat: b,
                    lon: d,
                    zoom: 9
                }), c.emit("mapsPopupRequested", b, d)
            })
        }
        var m = null,
            n = null,
            o = {
                isRunning: !1,
                semaphore: !1,
                timer: null,
                button: document.getElementById("playpause"),
                buttonMobile: document.getElementById("playpause-mobile"),
                pbWrapper: document.getElementById("progress-bar-wrapper"),
                start: function() {
                    return n && n.product ? (this.isRunning = !0, this.button.className = "pause", this.buttonMobile.className = "pause", this.pbWrapper.className = "onanimation", this.run(), void c.emit("animationStarted")) : void i.event("tried to run animation on void finisheTask")
                },
                stop: function() {
                    this.semaphore = !1, this.isRunning = !1, this.button.className = "play", this.buttonMobile.className = "play", this.pbWrapper.className = "", clearTimeout(this.timer), c.emit("animationStopped")
                },
                toggle: function() {
                    this.isRunning ? this.stop() : this.start()
                },
                run: function() {
                    var a = n.product,
                        b = h.getIndex();
                    return !a.animation || b >= a.calendar.maxIndex ? void this.stop() : (this.semaphore || (b += 25e-5, h.setIndex(b, !0), c.emit("indexChanged", b)), void(this.timer = setTimeout(this.run.bind(this), 50)))
                }
            };
        c.on("paramsChanged", k), c.on("mapChanged", j), c.on("playPauseClicked", o.toggle.bind(o));
        var p = document.getElementById("title");
        p.onclick = function() {
            c.emit("closePopup"), c.emit("closeAll"), d.initCoords.zoom < 5 && (d.initCoords.zoom = 5), f.center(d.initCoords), b.toDefaults()
        }, navigator.geolocation && c.on("locationRqstd", l)
    }), /*! */
    W.define("pluginsCtrl", ["broadcast", "plugins", "object"], function(a, b, c) {
        a.on("rqstOpen", function(a, c) {
            var d, e, f = b[a].exclusive;
            for (d in b) e = b[d], d === a ? e.open(c) : e.isOpen && f && e.close()
        }), a.on("rqstClose", function(a, c) {
            var d;
            for (d in b) d === a && b[d].close()
        }), a.on("closeAll", function() {
            var a;
            for (a in b) b[a].isOpen && b[a].close()
        })
    }), /*! */
    W.define("plugin", ["rootScope", "log", "trans"], function(a, b, c) {
        W.Plugin = W.Class.extend({
            ident: "",
            dependencies: [],
            _init: function() {
                this.isLoaded = !1, this.loading = !1
            },
            load: function() {
                var c, d, e = this,
                    f = [];
                return this.loading = !0, new Promise(function(g, h) {
                    for (d = 0; d < e.dependencies.length; d++) c = W.plugins[e.dependencies[d]], c && !c.isLoaded && f.push(c.load());
                    Promise.all(f).then(function() {
                        var c = document.createElement("script");
                        c.type = "text/javascript", c.async = !0, c.onload = function() {
                            e.isLoaded = !0, e.loading = !1, g(e)
                        }, c.onerror = function() {
                            b.event("Failed to load plugin:" + e.ident), e.loading = !1, h(e)
                        }, document.head.appendChild(c), c.src = "v" + a.version + "/plugins/" + e.ident + ".js"
                    })["catch"](function(a) {
                        b.info("plugin error: " + e.ident), h()
                    })
                })
            }
        }), W.RiotPlugin = W.Plugin.extend({
            riotDiv: document.getElementById("plugins"),
            dependencies: ["riot"],
            exclusive: !0,
            _init: function() {
                this.isLoaded = !1, this.loading = !1, this.isOpen = !1, this.riotTag = null
            },
            onclose: function() {},
            onopen: function(a, b) {},
            close: function() {
                this.isOpen && (document.body.classList.remove("on" + this.ident), this.node.classList.remove("open"), setTimeout(function() {
                    this.node.style.display = "none"
                }.bind(this), 500), this.isOpen = !1, this.riotTag && this.riotTag.update({
                    command: "close"
                }), this.onclose())
            },
            open: function(a) {
                this.isLoaded ? this._open(a) : this.loading || this.load(a).then(function() {
                    this.node = document.createElement("div"), this.node.id = "plugin-" + this.ident, this.node.innerHTML = '<div class="closing-nipple">' + c.D_CLOSE + '</div><div class="closing-x">t</div><' + this.ident + "></" + this.ident + ">", this.riotDiv.appendChild(this.node), this.node.querySelector(".closing-nipple").onclick = this.close.bind(this), this.node.querySelector(".closing-x").onclick = this.close.bind(this), this._open(a)
                }.bind(this))
            },
            _open: function(a) {
                this.isOpen ? this.onopen(!0, a) : (document.body.classList.add("on" + this.ident), this.node.style.display = "block", setTimeout(function() {
                    this.node.classList.add("open")
                }.bind(this), 0), this.isOpen = !0, this.riotTag || (this.riotTag = riot.mount(this.ident)[0]), this.riotTag.update({
                    command: "open"
                }), this.onopen(!1, a))
            }
        })
    }), /*! */
    W.define("plugins", ["plugin", "object", "rootScope", "mapsCtrl", "broadcast"], function(a, b, c, d, e) {
        var f = W.RiotPlugin.extend({
                ident: "detail",
                onclose: function() {
                    e.off(this.drawHandle), e.emit("detailClosed")
                },
                onopen: function(a, b) {
                    c.sharedCoords = {
                        lat: b.lat,
                        lon: b.lon,
                        zoom: 9
                    }, c.sharedCoords.panto = c.isMobile ? 0 : -740, a || (this.drawHandle = e.on("popupMoved", this.drawDetail.bind(this))), (!a || b.fromSearch) && (d.center(c.sharedCoords), e.emit("mapsPopupRequested", c.sharedCoords.lat, c.sharedCoords.lon)), this.drawDetail(b)
                },
                drawDetail: function(a) {
                    a.lat = parseFloat(a.lat).toFixed(3), a.lon = parseFloat(a.lon).toFixed(3), a.forecast = "meteoblue", this.riotTag.update(a)
                }
            }),
            g = {
                detail: f,
                riot: W.Plugin.extend({
                    ident: "riot"
                }),
                geodesic: W.Plugin.extend({
                    ident: "geodesic"
                }),
                settings: W.RiotPlugin.extend({
                    ident: "settings",
                    exclusive: !1
                }),
                fltline: W.RiotPlugin.extend({
                    ident: "fltline",
                    exclusive: !1,
                    dependencies: ["riot", "geodesic"],
                    onopen: function(a, b) {
                        this.riotTag.update({
                            A: b[0],
                            B: b[1]
                        })
                    }
                }),
                distance: W.RiotPlugin.extend({
                    ident: "distance",
                    dependencies: ["riot", "geodesic"],
                    exclusive: !1
                }),
                history: W.RiotPlugin.extend({
                    ident: "history"
                }),
                community: W.RiotPlugin.extend({
                    ident: "community",
                    exclusive: !1
                }),
                tools: W.RiotPlugin.extend({
                    ident: "tools",
                    exclusive: !1
                }),
                promo: W.RiotPlugin.extend({
                    ident: "promo"
                })
            };
        return g
    }),
    /*!
    (c)  Stanislav Sumbera, April , 2014, Licenced under MIT */
    L.CanvasOverlay = L.Class.extend({
        canvas: function() {
            return [this._canvas1, this._canvas2, this._canvas3]
        },
        redraw: function() {
            return this._frame || (this._frame = L.Util.requestAnimFrame(this._redraw, this)), this
        },
        reset: function() {
            this._reset()
        },
        onAdd: function(a) {
            this._map = a, this._canvas1 = L.DomUtil.create("canvas", "leaflet-canvas1"), this._canvas2 = L.DomUtil.create("canvas", "leaflet-canvas2"), this._canvas3 = L.DomUtil.create("canvas", "leaflet-canvas3");
            var b = this._map.getSize();
            this._canvas1.width = this._canvas2.width = this._canvas3.width = b.x, this._canvas1.height = this._canvas2.height = this._canvas3.height = b.y;
            var c = this._map.options.zoomAnimation && L.Browser.any3d;
            L.DomUtil.addClass(this._canvas1, "leaflet-zoom-" + (c ? "animated" : "hide")), L.DomUtil.addClass(this._canvas2, "leaflet-zoom-" + (c ? "animated" : "hide")), L.DomUtil.addClass(this._canvas3, "leaflet-zoom-" + (c ? "animated" : "hide")), a._panes.overlayPane.appendChild(this._canvas1), a._panes.overlayPane.appendChild(this._canvas2), a._panes.overlayPane.appendChild(this._canvas3), a.on("moveend", this._redraw, this), a.on("resize", this._resize, this), a.options.zoomAnimation && L.Browser.any3d && a.on("zoomanim", this._animateZoom, this), this._reset(), this._redraw()
        },
        addTo: function(a) {
            return a.addLayer(this), this
        },
        _resize: function(a) {
            this._canvas1.width = this._canvas2.width = this._canvas3.width = a.newSize.x, this._canvas1.height = this._canvas2.height = this._canvas3.height = a.newSize.y
        },
        _reset: function() {
            var a = this._map.containerPointToLayerPoint([0, 0]);
            L.DomUtil.setPosition(this._canvas1, a), L.DomUtil.setPosition(this._canvas2, a), L.DomUtil.setPosition(this._canvas3, a)
        },
        _redraw: function() {
            var a = this._map.getSize(),
                b = this._map.getBounds();
            180 * a.x / (20037508.34 * (b.getEast() - b.getWest())), this._map.getZoom();
            this._frame = null
        },
        _animateZoom: function(a) {
            var b = this._map.getZoomScale(a.zoom),
                c = this._map._getCenterOffset(a.center)._multiplyBy(-b).subtract(this._map._getMapPanePos());
            this._canvas1.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(c) + " scale(" + b + ")", this._canvas2.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(c) + " scale(" + b + ")", this._canvas3.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(c) + " scale(" + b + ")"
        }
    }), L.canvasOverlay = function() {
        return new L.CanvasOverlay
    }, /*! */
    W.define("mapsCtrl", ["rootScope", "storage", "settings", "broadcast", "http", "globe", "maps", "object", "log", "location"], function(a, b, c, d, e, f, g, h, i) {
        function j(a) {
            p = c.get("3d"), n = p ? a.zoom >= 5 ? g : f : g, k(n, a)
        }

        function k(a, b) {
            var c = {
                lat: parseFloat(b.lat).bound(-80, 80),
                lon: parseFloat(b.lon),
                zoom: b.zoom,
                scale: b.scale,
                panto: b.panto,
                animation: !1
            };
            a.init(c).then(function(b) {
                n = a, a === g ? (o.style.opacity = 0, o.style["pointer-events"] = "none", setTimeout(function() {
                    o.style.display = "none"
                }, 1e3)) : (o.style.display = "block", o.style["pointer-events"] = "auto", o.style.opacity = 1), d.emit("projectionChanged", n.ident), m(b)
            })["catch"](function() {
                a === f && (i.event("Failed to install globe"), p = !1, k(g, b))
            })
        }

        function l(a) {
            "globe" === a.source && a.scale > 720 ? (a.zoom = 5, k(g, a)) : "maps" === a.source && a.zoom < 5 && p ? (a.scale = 700, k(f, a)) : m(a)
        }

        function m(b) {
            a.map.zoom !== b.zoom && (document.body.classList.remove("zoom" + a.map.zoom), document.body.classList.add("zoom" + b.zoom)), a.map = h.clone(b, ["source", "lat", "lon", "south", "north", "east", "west", "width", "height", "x", "y", "xMax", "yMax", "zoom", "scale"]), h.include(a.map, {
                southRad: Math.deg2rad(b.south),
                northRad: Math.deg2rad(b.north),
                eastRad: Math.deg2rad(b.east),
                westRad: Math.deg2rad(b.west)
            }), d.emit("mapChanged", a.map)
        }
        var n = null,
            o = document.getElementById("globe_container");
        a.useRetina = a.isRetina && c.get("retina");
        var p;
        if (a.map = {}, a.initCoords = b.get("initCoords"), !a.initCoords) {
            var q = (new Date).getTimezoneOffset() / 4;
            a.initCoords = {
                lat: 0,
                lon: 0 > q ? -q : -180 + q,
                zoom: 4
            }
        }
        var r = a.sharedCoords || a.initCoords;
        return a.embed || (r.scale = null), j(r), a.disableGeoIp || e.get("/node/geoip").then(function(c) {
            if (c) {
                var e = c.data;
                if (a.hash = e.hash, e.ll && (a.initCoords = {
                        lat: e.ll[0],
                        lon: e.ll[1],
                        zoom: 4
                    }, b.put("initCoords", a.initCoords), a.sharedCoords || n.center(a.initCoords).then(m), "CZ" === e.country)) {
                    var f = b.get("visitCounter5") || 1;
                    (2 === f || 4 === f) && d.emit("rqstOpen", "promo"), f++, b.put("visitCounter5", f)
                }
            }
        }), f.on("globeMoveend", l), g.on("mapsMoveend", l), d.on("settingsChanged", function(b) {
            "3d" === b && j(a.map)
        }), d.on("popupRequested", function(a, b) {
            d.emit((n === f ? "globe" : "maps") + "PopupRequested", a, b)
        }), {
            getCanvas: function() {
                return n.canvases
            },
            center: function(a) {
                n !== g ? k(g, a) : g.center(a)
            },
            ensureLeaflet: function() {
                if (p = !1, n === f) {
                    var a = f.info();
                    a.zoom = 5, k(g, a)
                }
            },
            stopEnsureLeaflet: function() {
                j(n.info())
            }
        }
    }), /*! */
    W.define("maps", ["rootScope", "settings", "object", "broadcast"], function(a, b, c, d) {
        var e = {
            hereterrain: "https://{s}.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?" + a.hereMapsID,
            heresat: "https://{s}.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png8?" + a.hereMapsID,
            esritopo: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        };
        L.Map.addInitHook(function() {
            function a(a) {
                function e() {
                    d.fire("singleclick", L.Util.extend(a, {
                        type: "singleclick"
                    }))
                }
                b(), c = setTimeout(e, 500)
            }

            function b() {
                c && (clearTimeout(c), c = null)
            }
            var c, d = this;
            d.on && (d.on("click", a), d.on("dblclick", function() {
                setTimeout(b, 0)
            }))
        });
        var f = L.map("map_container", {
            zoomControl: !1,
            keyboard: !1,
            worldCopyJump: !0
        });
        return L.control.zoom({
            position: "topright"
        }).addTo(f), c.include(f, {
            ident: "maps",
            isInit: !1,
            minZoom: 4,
            myMarkers: {
                webcam: L.icon({
                    iconUrl: "img/marker-webcam.png",
                    shadowUrl: "img/marker-shadow.png",
                    shadowSize: [41, 41],
                    shadowAnchor: [15, 41],
                    iconSize: [26, 36],
                    iconAnchor: [13, 36]
                }),
                hit: L.icon({
                    iconUrl: "img/marker-yellow-small.png",
                    shadowUrl: "img/marker-shadow.png",
                    shadowSize: [41, 41],
                    shadowAnchor: [15, 41],
                    iconSize: [26, 35],
                    iconAnchor: [13, 35]
                })
            },
            init: function(c) {
                return this.isInit ? this.center(c) : (this.center(c), this.initTiles(), this.initCanvas(), this.drawGraticule(), this.on("moveend", this.moveEnd.bind(this)), this.on("resize", this.resizeEnd.bind(this)), this.on("contextmenu", function() {
                    f.zoomOut()
                }), d.on("settingsChanged", function(c) {
                    "map" === c ? f.initTiles() : "retina" === c && (a.useRetina = a.isRetina && b.get("retina"), f.initTiles(), f.rescaleCanvas())
                }), this.isInit = !0, Promise.resolve(this.info()))
            },
            drawGraticule: function() {
                for (var a = {
                        stroke: !0,
                        color: "#a0a0a0",
                        opacity: .8,
                        weight: .8,
                        clickable: !1
                    }, b = -80; 81 > b; b += 10) L.polyline([
                    [b, -180],
                    [b, 180]
                ], a).addTo(f);
                for (var c = -180; 181 > c; c += 10) L.polyline([
                    [-90, c],
                    [90, c]
                ], a).addTo(f)
            },
            initCanvas: function() {
                var a = L.canvasOverlay().addTo(f),
                    b = a.canvas();
                this.canvases = {
                    particleCanvas: b[0],
                    overlayCanvas: [b[1], b[2]],
                    actualCanvas: 0
                }, this.resetCanvas = a.reset.bind(a), b[2].style.opacity = 0, this.rescaleCanvas()
            },
            initTiles: function() {
                var c = e[b.get("map")];
                L.TileLayer.multi({
                    11: {
                        url: a.tileServer + (a.useRetina ? "rtnv3" : "v5") + "/{z}/{x}/{y}.jpg",
                        subdomains: "1234"
                    },
                    17: {
                        url: c,
                        subdomains: "1234"
                    }
                }, {
                    detectRetina: a.useRetina,
                    minZoom: 3,
                    maxZoom: a.maxZoom
                }).addTo(f)
            },
            center: function(a) {
                var b = "undefined" == typeof a.zoom ? null : a.zoom.bound(f.minZoom, 20),
                    c = !!a.animation;
                if (a.panto) {
                    var d = f.getSize().x;
                    f.panTo([a.lat, a.lon], {
                        animate: !1
                    }), b && f.setZoom(b, {
                        animate: !1
                    }), f.panBy([(d - a.panto) / 2 - d / 2, 0], {
                        animate: !1
                    })
                } else f.setView([a.lat, a.lon], b, {
                    animate: c
                });
                return Promise.resolve(f.info())
            },
            moveEnd: function() {
                this.fire("mapsMoveend", this.info())
            },
            resizeEnd: function() {
                f.rescaleCanvas(), this.fire("mapsMoveend", this.info())
            },
            rescaleCanvas: function() {
                var b = f.canvases.particleCanvas,
                    c = a.useRetina ? window.devicePixelRatio || 1 : 1,
                    d = f.getSize(),
                    e = d.x,
                    g = d.y;
                b.width = e * c, b.height = g * c, b.style.width = e + "px", b.style.height = g + "px", b.getContext("2d").scale(c, c)
            },
            info: function() {
                var a = f.getCenter(),
                    b = f.getBounds(),
                    c = f.getSize();
                return {
                    source: "maps",
                    lat: a.lat,
                    lon: a.wrap().lng,
                    south: b._southWest.lat,
                    north: b._northEast.lat,
                    east: b._northEast.lng,
                    west: b._southWest.lng,
                    width: c.x,
                    height: c.y,
                    x: 0,
                    y: 0,
                    xMax: c.x,
                    yMax: c.y,
                    zoom: f.getZoom()
                }
            }
        }), f
    }), /*! */
    W.define("globe", ["rootScope", "http", "settings", "broadcast", "storage", "helpers", "globeCtrl"], function(a, b, c, d, e, f, g) {
        var h = W.Evented.extend({
            ident: "globe",
            isInit: !1,
            minZoom: 150,
            maxZoom: 800,
            drawStamp: 0,
            getZoom: function() {
                return Math.round(.008 * (this.projection.scale() - 200)).bound(0, 4)
            },
            setScale: function(a) {
                this.projection.scale(a), this.dummy.scale(a), this.zoom.scale(a), this.scale = a
            },
            initCanvas: function() {
                var b, c, d = [],
                    e = window.devicePixelRatio || 1;
                for (c = 0; 5 > c; c++) b = document.getElementById("globeCanvas" + c), e > 1 && (0 === c || 4 === c) && a.useRetina ? (b.width = this.w * e, b.height = this.h * e, b.style.width = this.w + "px", b.style.height = this.h + "px", b.getContext("2d").scale(e, e)) : (b.width = this.w, b.height = this.h), d[c] = b;
                this.canvas = d[4], this.context = this.canvas.getContext("2d"), this.mask = d[3], this.canvases = {
                    particleCanvas: d[0],
                    overlayCanvas: [d[1], d[2]],
                    actualCanvas: 0
                }, this.canvases.overlayCanvas[1].style.opacity = 0
            },
            initZoom: function() {
                var b = document.getElementById("map_container");
                this.w = b.offsetWidth, this.h = b.offsetHeight, this.xCenter = this.w / 2, this.yCenter = this.h / 2;
                var c = Math.min(this.w, this.h);
                this.startingZoom = ((a.isMobile ? .98 : .97) * c / 2).bound(this.minZoom, 700)
            },
            initMap: function(a) {
                this.graticule = d3.geo.graticule(), this.grid = this.graticule(), this.projection = d3.geo.orthographic().scale(this.startingZoom).rotate([-a.lon, -a.lat, 0]).translate([this.xCenter, this.yCenter]).clipAngle(90), this.path = d3.geo.path().projection(this.projection).context(this.context), this.dummy = d3.geo.orthographic().scale(this.startingZoom).translate([this.xCenter, this.yCenter]).clipAngle(90), this.precision = this.projection.precision(), this.scale = this.projection.scale()
            },
            center: function(a) {
                return this.projection.rotate([-a.lon, -a.lat, 0]), a.scale && this.setScale(a.scale), this.draw(), this.drawMask(), Promise.resolve(this.info())
            },
            isVisible: function(a, b) {
                return Math.pow(this.xCenter - a, 2) + Math.pow(this.yCenter - b, 2) < Math.pow(this.scale, 2)
            },
            info: function() {
                var a = this.path.bounds({
                        type: "Sphere"
                    }),
                    b = this.projection.rotate();
                return {
                    source: "globe",
                    lat: -b[1],
                    lon: -b[0],
                    south: -90,
                    north: 90,
                    east: 360,
                    west: 0,
                    x: Math.max(Math.floor(a[0][0], 0), 0),
                    y: Math.max(Math.floor(a[0][1], 0), 0),
                    xMax: Math.min(Math.ceil(a[1][0], this.w), this.w - 1),
                    yMax: Math.min(Math.ceil(a[1][1], this.h), this.h - 1),
                    width: this.w,
                    height: this.h,
                    zoom: this.getZoom(),
                    scale: this.projection.scale()
                }
            },
            init: function(b) {
                var h = this;
                return this.isInit ? this.center(b) : new Promise(function(i, j) {
                    h.initZoom(), h.initCanvas(), h.initMap(b), h.globeController = g.call(h), e.getFile("world.json", "objects").then(h.initData.bind(h)).then(h.center.bind(h, b)).then(function() {
                        setTimeout(h.loadDetailed.bind(h), 100), i(h.info())
                    })["catch"](j), window.addEventListener("resize", f.debounce(h.resize.bind(h), 200)), window.addEventListener("orientationchange", h.resize.bind(h)), d.on("settingsChanged", function(b) {
                        "retina" === b && (a.useRetina = a.isRetina && c.get("retina"), h.resize())
                    }), d.on("redrawFinished", function(a) {
                        "globe" === a.map.source && h.scale > 400 && h.draw.call(h, !1, !0)
                    }), h.isInit = !0
                })
            },
            loadDetailed: function() {
                var a = this;
                e.getFile("worldDetailed.json", "objects").then(function(b) {
                    a.landDetailed = topojson.feature(b, b.objects.land)
                })
            },
            resize: function() {
                this.initZoom(), this.initCanvas(), this.projection.translate([this.xCenter, this.yCenter]), this.dummy.translate([this.xCenter, this.yCenter]), this.draw(), this.drawMask(), this.emit("globeMoveend", this.info())
            },
            initData: function(a) {
                this.land = topojson.feature(a, a.objects.land), this.borders = topojson.mesh(a, a.objects.countries, function(a, b) {
                    return a.id !== b.id
                }), this.lakes = topojson.feature(a, a.objects.ne_110m_lakes)
            },
            drawMask: function() {
                var a = this.mask.getContext("2d"),
                    b = a.createRadialGradient(this.xCenter, this.yCenter, .69 * this.scale, this.xCenter, this.yCenter, this.scale - 2);
                a.clearRect(0, 0, this.w, this.h), b.addColorStop(0, "rgba(40,40,40,0)"), b.addColorStop(.7, "rgba(40,40,40,0.15)"), b.addColorStop(.8, "rgba(40,40,40,0.2)"), b.addColorStop(.98, "rgba(40,40,40,0.5)"), b.addColorStop(.99, "rgba(40,40,40,0.7)"), b.addColorStop(1, "rgba(40,40,40,1)"), a.fillStyle = b, a.fillRect(0, 0, this.w, this.h)
            },
            draw: function(a, b) {
                if (!(a && Date.now() - this.drawStamp < 30)) {
                    var c = b && this.landDetailed ? this.landDetailed : this.land;
                    a || this.projection.precision(this.precision), this.context.fillStyle = "rgba(40,40,40,1)", this.context.fillRect(0, 0, this.w, this.h), this.context.beginPath(), this.path({
                        type: "Sphere"
                    }), this.context.fillStyle = "#707070", this.context.fill(), this.context.beginPath(), this.path(c), this.context.fillStyle = "#858585", this.context.fill(), this.context.strokeStyle = "#e0e0e0", this.context.lineWidth = 1, this.context.stroke(), a || (this.context.beginPath(), this.path(this.borders), this.context.strokeStyle = "#484848", this.context.lineWidth = .7, this.context.stroke(), this.context.beginPath(), this.path(this.lakes), this.context.fillStyle = "#454545", this.context.fill()), this.context.beginPath(), this.path(this.grid), this.context.lineWidth = .5, this.context.strokeStyle = "#a0a0a0", this.context.stroke(), this.drawStamp = Date.now()
                }
            }
        });
        return h
    }), /*! */
    W.define("globeCtrl", ["rootScope", "broadcast", "helpers", "object"], function(a, b, c, d) {
        return function() {
            function a() {
                var a = k.projection.rotate();
                return d.signature([k.scale, a[0], a[1]])
            }

            function b() {
                k.scale < k.maxZoom && f(Math.min(k.scale + n, k.maxZoom))
            }

            function e() {
                k.scale > k.minZoom && f(Math.max(k.scale - n, k.minZoom))
            }

            function f(a) {
                g(), h(), k.setScale(a), i()
            }

            function g() {
                l || k.emit("movestart"), k.projection.precision(5 * k.precision), l = !0, j = k.canvases.overlayCanvas[k.canvases.actualCanvas], j.style.visibility = "hidden", j.style.opacity = 0, q.style.visibility = "hidden", q.style.opacity = 0, r.clearRect(0, 0, k.w, k.h)
            }

            function h() {
                m = !0, k.mask.style.visibility = "hidden", k.mask.style.opacity = 0
            }

            function i() {
                var b = a();
                if (b === o) {
                    var c = p[0],
                        d = p[1];
                    return void(k.isVisible(c, d) && k.emit("click", c, d))
                }
                o = b, l || g(), k.draw(), l = !1, q.style.visibility = "visible", j.style.visibility = "visible", m && (k.drawMask(), k.mask.style.visibility = "visible", k.mask.style.opacity = 1, m = !1), k.emit("globeMoveend", k.info())
            }
            var j, k = this,
                l = !1,
                m = !1,
                n = 60,
                o = a(),
                p = null,
                q = k.canvases.particleCanvas,
                r = q.getContext("2d");
            document.getElementById("globe_plus").onclick = b, document.getElementById("globe_minus").onclick = e;
            var s = d3.behavior.zoom().scaleExtent([this.minZoom, this.maxZoom]);
            s.scale(this.projection.scale()), s.on("zoomstart", function() {
                p = d3.mouse(this)
            }).on("zoomend", c.debounce(i, 500)).on("zoom", function() {
                var a = d3.event.scale;
                a !== k.scale && (l || g(), m || h(), k.setScale(a), k.draw(!0))
            }), d3.select(this.canvas).call(s);
            var t = d3.behavior.drag().on("drag", function() {
                var a = d3.event.dx,
                    b = d3.event.dy;
                if (0 !== a || 0 !== b) {
                    l || g();
                    var c = k.projection.rotate(),
                        d = k.projection.scale(),
                        e = d3.scale.linear().domain([-1 * d, d]).range([-90, 90]),
                        f = e(a),
                        h = e(b);
                    c[0] += f, c[1] -= h, c[1] > 90 && (c[1] = 90), c[1] < -90 && (c[1] = -90), c[0] >= 180 && (c[0] -= 360), k.projection.rotate(c), k.draw(!0)
                }
            });
            d3.select(this.canvas).call(t), this.zoom = s
        }
    }), /*! */
    W.define("pois", ["http", "rootScope", "maps", "overlays", "trans", "broadcast", "Class", "interpolation"], function(a, b, c, d, e, f, g, h) {
        var i = {},
            j = "empty";
        return i.metars = g.extend({
            minZoom: 7,
            maxZoom: 18,
            data: [],
            markers: [],
            age: null,
            unix: null,
            icons: function() {
                var a = {};
                return ["U", "M", "V", "I", "L"].forEach(function(b) {
                    a[b] = L.divIcon({
                        className: "metar-icon" + b,
                        iconSize: [13, 13]
                    })
                }), a
            }(),
            download: function(c, d) {
                var e = this,
                    f = Date.now();
                this.unix = Math.floor(Date.now() / 6e4), f - this.age > 3e5 || !this.data ? a.get(b.server2 + "metar/metars2.json?timestamp=" + f).then(function(a) {
                    var b = a.data;
                    e.age = f, e.data = [];
                    for (var g = 0; g < b.length; g += 9) e.data.push({
                        id: b[g],
                        la: b[g + 1],
                        lo: b[g + 2],
                        ty: b[g + 3],
                        ux: b[g + 4],
                        dir: b[g + 5],
                        speed: b[g + 6],
                        gust: b[g + 7],
                        temp: b[g + 8]
                    });
                    d(c, e.data)
                }) : d(c, this.data)
            },
            display: function(a) {
                var c = this.unix - a.ux,
                    g = 60 > c ? e.METAR_MIN_AGO.replace(/\{DURATION\}/, c) : e.METAR_HOUR_AGO,
                    h = ("number" == typeof a.dir && a.speed > 0 ? '<div class="metar-arrow" style="transform: rotate(' + a.dir + "deg); -webkit-transform:rotate(" + a.dir + 'deg);">"</div>' : "") + "<div " + (b.isTouch ? "onclick=\"W.pois.openAd('" + a.id + "'," + a.la + "," + a.lo + ');"' : "") + ' class="right"><b>' + a.id + '</b>&nbsp;<span class="adtype' + a.ty + '"></span><br/>' + ("V" == a.dir ? e.METAR_VAR + " " : "") + ("number" == typeof a.speed ? d.wind.convertValue(a.speed) : "") + ("number" == typeof a.gust ? ", g:" + d.wind.convertValue(a.gust) : "") + ("number" == typeof a.temp ? ("number" == typeof a.speed ? ", " : "") + d.temp.convertValue(a.temp + 273.15) : "") + '<br /><span class="howold">' + g + "</span>" + (b.isTouch ? "<div>" + e.METAR_MORE_INFO + "</div>" : "") + "</div>",
                    i = L.marker([a.la, a.lo], {
                        icon: this.icons[a.ty]
                    }).bindPopup(h, {
                        className: "metar",
                        offset: [20, -15],
                        closeButton: !1,
                        minWidth: 120,
                        autoPan: !1
                    });
                return b.isTouch || i.on("click", function(b) {
                    f.emit("rqstOpen", "detail", {
                        lat: a.la,
                        lon: a.lo,
                        icao: a.id
                    })
                }).on("mouseover", function(a) {
                    this.openPopup()
                }).on("mouseout", function(a) {
                    this.closePopup()
                }), i
            },
            displayAll: function(a, b) {
                b && (this.minZoom <= a.map.zoom && this.maxZoom >= a.map.zoom ? this.download(a, this.showPOIs.bind(this)) : this.deletePOIs())
            },
            showPOIs: function(a, b) {
                var d, e, f, g = a.map.north,
                    h = a.map.south,
                    i = a.map.west,
                    j = a.map.east;
                for (e = 0, f = 0 | b.length; f > e; e++) d = b[e], d.la < g && d.la > h && (d.lo < j && d.lo > i || i > j && (d.lo > i || d.lo < j)) ? d.marker || (d.marker = this.display(d), d.marker.addTo(c), this.markers.push(d)) : d.marker && (c.removeLayer(d.marker), d.marker = null)
            },
            deletePOIs: function() {
                var a, b, d;
                for (a = 0, d = 0 | this.markers.length; d > a; a++) b = this.markers[a], b.marker && (c.removeLayer(b.marker), b.marker = null);
                this.markers = []
            },
            openAd: function(a, b, c) {
                f.emit("rqstOpen", "detail", {
                    lat: b,
                    lon: c,
                    icao: a
                })
            }
        }), i.pressure = i.metars.extend({
            minZoom: 3,
            maxZoom: 11,
            markers: [],
            lowsHighs: {},
            hours: (new Date).getHours(),
            download: function(c, d) {
                function e(a, b, d) {
                    var e, g, h, i, j = [];
                    if (5 > a ? (e = 1e5, g = 102e3) : 6 > a ? (e = 100500, g = 101500) : 7 > a && (e = 101e3, g = 101300), e) {
                        for (h = 0; h < b.length; h++) i = b[h], (i.value < e || i.value > g) && j.push(i);
                        f.data = j, d(c, j)
                    } else f.data = b, d(c, b)
                }
                var f = this;
                this.lowsHighs[c.path] ? e(c.map.zoom, this.lowsHighs[c.path], d) : a.get(b.server + "gfs/" + c.path + "/pressure-highs-lows.json?" + this.hours).then(function(a) {
                    f.lowsHighs[c.path] = a.data, e(c.map.zoom, a.data, d)
                })
            },
            displayAll: function(a, b) {
                this.deletePOIs(), this.minZoom <= a.map.zoom && this.maxZoom >= a.map.zoom && this.download(a, this.showPOIs.bind(this))
            },
            display: function(a) {
                var b;
                return b = a.value > 102700 ? "#AE716C" : a.value > 102400 ? "rgba(221, 157, 140, 1)" : a.value > 102100 ? "#C6A448" : a.value > 101800 ? "#B9C558" : a.value > 101500 ? "#689A48" : a.value > 100900 ? "#618BBE" : a.value > 100600 ? "#5EB0B7" : a.value > 100300 ? "#A992B0" : a.value > 1e5 ? "#A687B2" : a.value > 997 ? "#A285B3" : "#897DA8", L.marker([a.la, a.lo], {
                    icon: L.divIcon({
                        className: "temp-icon",
                        iconSize: [25, 13],
                        html: '<span style="color:' + b + ';">' + d.pressure.convertNumber(a.value) + "</span>"
                    })
                })
            }
        }), i.cities = i.pressure.extend({
            minZoom: 5,
            maxZoom: 11,
            markers: [],
            data: {
                6: null,
                7: null,
                8: null,
                9: null,
                10: null
            },
            zoom2zoom: {
                5: 6,
                6: 7,
                7: 7,
                8: 8,
                9: 9,
                10: 9,
                11: 9
            },
            download: function(c, d) {
                var e = this,
                    f = this.zoom2zoom[c.map.zoom];
                this.data[f] ? d(c, this.data[f]) : a.get(b.server + "cities/" + f + ".json").then(function(a) {
                    var b = a.data;
                    e.data[f] = [];
                    for (var g = 0; g < b.length; g += 2) e.data[f].push({
                        la: b[g],
                        lo: b[g + 1]
                    });
                    d(c, e.data[f])
                })
            },
            display: function(a) {
                var b = h.interpolateValues(a.la, a.lo, null, null).overlayValue,
                    c = Math.round(d.temp.convertNumber(b));
                b = Math.floor(b);
                var e = "#a6e0f2";
                return b > 303 ? e = "#f4bb9b" : b > 298 ? e = "#e8c79f" : b > 293 ? e = "#ead28f" : b > 288 ? e = "#e8e89b" : b > 283 ? e = "#dfef92" : b > 278 ? e = "#cefa97" : b > 273 ? e = "#bee8b1" : b > 268 ? e = "#bad4f9" : b > 263 && (e = "#abd1ec"), L.marker([a.la, a.lo], {
                    icon: L.divIcon({
                        className: "temp-icon",
                        html: '<span style="color:' + e + ';">' + c + "°</span>"
                    })
                }).on("click", function(b) {
                    f.emit("rqstOpen", "detail", {
                        lat: a.la,
                        lon: a.lo,
                        icao: null
                    })
                })
            }
        }), i.waves = i.metars.extend({
            minZoom: 3,
            maxZoom: 9,
            markers: [],
            multiMessages: [{
                la: 42,
                lo: 5.8,
                w: 650,
                h: 150,
                size: 45
            }, {
                la: 37.6,
                lo: 4.37,
                w: 650,
                h: 150,
                size: 45
            }, {
                la: 40.3,
                lo: 12.96,
                w: 650,
                h: 150,
                size: 45
            }, {
                la: 33.68,
                lo: 17.93,
                w: 650,
                h: 150,
                size: 45
            }, {
                la: 34.05,
                lo: 30.65,
                w: 650,
                h: 150,
                size: 45
            }],
            messages: {
                3: [{
                    la: 34,
                    lo: 20,
                    w: 200,
                    h: 120,
                    size: 12
                }],
                4: [{
                    la: 34,
                    lo: 17.6,
                    w: 350,
                    h: 150,
                    size: 25
                }],
                5: [{
                    la: 37,
                    lo: 18,
                    w: 650,
                    h: 150,
                    size: 45
                }],
                6: [{
                    la: 37,
                    lo: 18,
                    w: 750,
                    h: 150,
                    size: 55
                }]
            },
            download: function(a, b) {
                this.deletePOIs(), b(a, a.map.zoom > 6 ? this.multiMessages : this.messages[a.map.zoom])
            },
            display: function(a) {
                return L.marker([a.la, a.lo], {
                    icon: L.divIcon({
                        className: "waves-icon",
                        iconSize: [a.w, a.h],
                        html: '<span style="font-size:' + a.size + 'px;">Mediterranean wave forecast<br /> available in location detail</span>'
                    })
                }).addTo(c)
            }
        }), i.empty = i.metars.extend({
            deletePOIs: function() {},
            displayAll: function() {}
        }), f.on("redrawFinished", function(a, b) {
            var c = d[a.overlay].pois;
            j !== c && (i[j].deletePOIs(), j = c, b = !0), i[j].displayAll(a, b)
        }), {
            openAd: i.metars.openAd
        }
    }), /*! */
    W.define("picker", ["broadcast", "maps", "interpolation", "trans", "overlays", "rootScope"], function(a, b, c, d, e, f) {
        function g() {
            var a = '<div class="popup"><div class="popup-draggable-square"><div class="popup-ball"></div></div><div class="popup-content"></div><a class="popup-link shy">' + d.DETAILED + '</a><a class="popup-close-button shy">×</a>';
            return G || (a = a + '<div class="popup-drag-me">' + d.DRAG_ME + "</div>"), L.divIcon({
                className: "popup-wrapper",
                html: a,
                iconSize: [0, 150],
                iconAnchor: [0, 150]
            })
        }

        function h() {
            H && (t.style.diplay = "block", C.classList.remove("moooving"), a.off(E), a.off(F), window.clearTimeout(D), G = !0, b.removeLayer(H), H = null)
        }

        function i(a, b) {
            H ? k(a, b) : j(a, b)
        }

        function j(c, d) {
            H = L.marker([c, d], {
                icon: g(),
                draggable: !0
            }).on("dragstart", n).on("drag", p).on("dragend", o).addTo(b), w = B.querySelector(".popup-drag-me") || null, u = B.querySelector(".popup-content"), s = B.querySelector(".popup-ball"), v = B.querySelector(".popup-close-button"), t = B.querySelector(".popup-link"), E = a.on("redrawFinished", q), F = a.on("mapChanged", function() {
                m(), l()
            }), m(), l(), q(), t.onclick = function(c) {
                var d = b.containerPointToLatLng([x, y]).wrap();
                a.emit("rqstOpen", "detail", {
                    type: "spot",
                    lat: d.lat,
                    lon: d.lng,
                    icao: null,
                    fromPopup: !0,
                    x: x,
                    y: y
                }), c.stopPropagation()
            }, v.onmouseup = h, a.emit("popupOpened", "maps")
        }

        function k(b, c) {
            H.setLatLng([b, c]), m(), q(), a.emit("popupMoved", {
                type: "spot",
                lat: b,
                lon: c,
                icao: null
            })
        }

        function l() {
            z = f.map.width - 5, A = f.map.height - 5
        }

        function m() {
            var a = s.getBoundingClientRect();
            x = a.left + 3, y = a.top + 3
        }

        function n(a) {
            w && (w.style.opacity = 0, w.style.visibility = "hidden"), C.classList.add("moooving")
        }

        function o(c) {
            var d = b.containerPointToLatLng([x, y]).wrap();
            C.classList.remove("moooving"), a.emit("popupMoved", {
                type: "spot",
                lat: d.lat,
                lon: d.lng,
                icao: null
            })
        }

        function p(a) {
            m(), q()
        }

        function q() {
            if (x > 5 && z > x && A > y && y > 5) {
                var a = b.containerPointToLatLng([x, y]);
                c.hasGrid() && (u.innerHTML = r(c.interpolateValues(a.lat, a.lng)))
            }
        }

        function r(a) {
            var b = "",
                c = a.overlayName,
                f = e[c];
            switch (c) {
                case "wind":
                    b = d.WIND + "<span>" + a.angle + "° / " + f.convertValue(a.wind) + "</span>";
                    break;
                case "waves":
                case "swell":
                case "wwaves":
                case "swellperiod":
                    b = d[e[c].trans] + "<span>" + a.angle + "° / " + f.convertValue(a.overlayValue) + "</span>" + d.PERIOD + "<span>" + Math.round(a.wind) + " s.</span>";
                    break;
                case "lclouds":
                case "clouds":
                    a.overlayValue > 200 && (b += d.RAIN + "<span>" + f.convertValue(a.overlayValue) + "</span>");
                    break;
                case "rain":
                case "snow":
                    b += d[e.trans[c]].firstCapital() + " <span>" + f.convertValue(a.overlayValue) + "</span>";
                    break;
                default:
                    d[e.trans[c]] && (b += d[e.trans[c]].firstCapital() + " <span>" + f.convertValue(a.overlayValue) + "</span>")
            }
            return b
        }
        var s, t, u, v, w, x, y, z, A, B = document.getElementById("map_container"),
            C = document.body,
            D = (document.documentElement, null),
            E = null,
            F = null,
            G = !1,
            H = null;
        return a.on("closePopup", h), b.on("singleclick", function(a) {
            var b = 60,
                c = a.containerPoint.x,
                d = a.containerPoint.y,
                e = a.latlng.lat,
                g = a.latlng.lng;
            b > d || d > f.map.height - b || b > c || c > f.map.width - b || i(e, g)
        }), a.on("mapsPopupRequested", i), {
            createHTML: r
        }
    }), /*! */
    W.define("pickerGlobe", ["broadcast", "interpolation", "globe", "picker"], function(a, b, c, d) {
        function e() {
            x && (m.style.display = "none", x = !1, a.off(u), c.off(v), n.style.visibility = "hidden")
        }

        function f(b, d) {
            g(b, d - w), x || (m.style.display = "block", x = !0, u = a.on("redrawFinished", h), v = c.on("movestart", e), a.emit("popupOpened", "globe"))
        }

        function g(a, b) {
            j = a, k = b + w, m.style.left = a + "px", m.style.top = b + "px", h()
        }

        function h() {
            var a = c.projection.invert([j, k]);
            b.hasGrid() && (o.innerHTML = d.createHTML(b.interpolateValues(a[1], a[0])))
        }

        function i(a, b) {
            function d(b) {
                a && (b.preventDefault(), b = b.touches && 1 === b.touches.length ? b.touches[0] : b);
                var d = b.clientX - f,
                    e = b.clientY - h;
                c.isVisible(d, e + w) && g(d.bound(10, i), e.bound(k, j))
            }

            function e(a) {
                window.removeEventListener("mousemove", d), window.removeEventListener("mouseup", e), p.removeEventListener("touchmove", d), p.removeEventListener("touchend", e), document.body.classList.remove("moooving")
            }
            a ? (b.preventDefault(), b = b.touches && 1 === b.touches.length ? b.touches[0] : b, p.addEventListener("touchmove", d)) : window.addEventListener("mousemove", d);
            var f = b.clientX - m.style.left.replace("px", ""),
                h = b.clientY - m.style.top.replace("px", ""),
                i = s.clientWidth - 10,
                j = Math.max(s.scrollHeight, s.offsetHeight, t.clientHeight, t.scrollHeight, t.offsetHeight) - w - 10,
                k = 10 - w;
            n.style.opacity = 0, n.style.visibility = "hidden", document.body.classList.add("moooving"), window.addEventListener("mouseup", e), p.addEventListener("touchend", e)
        }
        var j, k, l = document.getElementById("globe_container"),
            m = l.querySelector(".popup-wrapper"),
            n = l.querySelector(".popup-drag-me"),
            o = l.querySelector(".popup-content"),
            p = l.querySelector(".popup"),
            q = l.querySelector(".popup-close-button"),
            r = l.querySelector(".popup-link"),
            s = document.body,
            t = document.documentElement,
            u = null,
            v = null,
            w = 150,
            x = !1;
        a.on("globePopupRequested", function(a, b) {
            var d = c.projection([b, a]);
            x ? g(d[0], d[1]) : f(d[0], d[1])
        }), a.on("closePopup", e), q.onmouseup = e, c.on("click", f), r.onclick = function(b) {
            var d = c.projection.invert([j, k]);
            a.emit("rqstOpen", "detail", {
                type: "spot",
                lat: d[1],
                lon: d[0],
                icao: null,
                fromPopup: !0,
                x: j,
                y: k
            }), e()
        }, p.addEventListener("mousedown", i.bind(null, !1)), p.addEventListener("touchstart", i.bind(null, !0))
    }), /*! */
    W.define("favs", ["storage", "broadcast", "maps", "object"], function(a, b, c, d) {
        var e = {
            favs: a.get("favs") || {},
            markers: [],
            favKey: function(a, b, c) {
                return b = parseFloat(b), c = parseFloat(c), a || b.toFixed(3) + "/" + c.toFixed(3)
            },
            add: function(b, c, d, e) {
                this.favs[this.favKey(b, c, d)] = {
                    icao: b,
                    lat: parseFloat(c),
                    lon: parseFloat(d),
                    name: e
                }, a.put("favs", this.favs), this.display()
            },
            isFav: function(a, b, c) {
                return "object" == typeof this.favs[this.favKey(a, b, c)]
            },
            remove: function(b, c, d) {
                var e = this.favKey(b, c, d);
                this.favs[e] && delete this.favs[e], a.put("favs", this.favs), this.display()
            },
            getAll: function() {
                return this.favs
            },
            display: function() {
                var a, e, f, g, h;
                for (h = 0; h < this.markers.length; h++) c.removeLayer(this.markers[h]);
                for (a in this.favs) e = this.favs[a], f = L.divIcon({
                    className: "favs-icon",
                    html: '<span class="point">&#x2022;</span><span class="txt">' + e.name.trunc(13) + "</span>",
                    iconSize: [25, 25],
                    iconAnchor: [5, 13]
                }), g = L.marker([e.lat, e.lon], {
                    icon: f
                }).addTo(c), g.fav = d.clone(e), g.on("click", function(a) {
                    var c = a.target.fav;
                    b.emit("rqstOpen", "detail", {
                        lat: c.lat,
                        lon: c.lon,
                        icao: c.icao
                    })
                }), this.markers.push(g)
            }
        };
        return e.display(), e
    });
