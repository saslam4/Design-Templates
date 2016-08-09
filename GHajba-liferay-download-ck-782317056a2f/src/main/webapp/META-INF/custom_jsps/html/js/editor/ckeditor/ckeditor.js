/*
 Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
 */
(function () {
    if (!window.CKEDITOR || !window.CKEDITOR.dom)window.CKEDITOR || (window.CKEDITOR = function () {
        var b = {timestamp: "D9HJ", version: "DEV", revision: "0", rnd: Math.floor(900 * Math.random()) + 100, _: {pending: []}, status: "unloaded", basePath: function () {
            var a = window.CKEDITOR_BASEPATH || "";
            if (!a)for (var b = document.getElementsByTagName("script"), g = 0; g < b.length; g++) {
                var e = b[g].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);
                if (e) {
                    a = e[1];
                    break
                }
            }
            -1 == a.indexOf(":/") && (a = 0 === a.indexOf("/") ? location.href.match(/^.*?:\/\/[^\/]*/)[0] +
                a : location.href.match(/^[^\?]*\/(?:)/)[0] + a);
            if (!a)throw'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
            return a
        }(), getUrl: function (a) {
            -1 == a.indexOf(":/") && 0 !== a.indexOf("/") && (a = this.basePath + a);
            this.timestamp && ("/" != a.charAt(a.length - 1) && !/[&?]t=/.test(a)) && (a += (0 <= a.indexOf("?") ? "&" : "?") + "t=" + this.timestamp);
            return a
        }, domReady: function () {
            function a() {
                try {
                    document.addEventListener ? (document.removeEventListener("DOMContentLoaded",
                        a, !1), b()) : document.attachEvent && "complete" === document.readyState && (document.detachEvent("onreadystatechange", a), b())
                } catch (e) {
                }
            }

            function b() {
                for (var a; a = g.shift();)a()
            }

            var g = [];
            return function (b) {
                g.push(b);
                "complete" === document.readyState && setTimeout(a, 1);
                if (1 == g.length)if (document.addEventListener)document.addEventListener("DOMContentLoaded", a, !1), window.addEventListener("load", a, !1); else if (document.attachEvent) {
                    document.attachEvent("onreadystatechange", a);
                    window.attachEvent("onload", a);
                    b = !1;
                    try {
                        b = !window.frameElement
                    } catch (f) {
                    }
                    if (document.documentElement.doScroll && b) {
                        var d = function () {
                            try {
                                document.documentElement.doScroll("left")
                            } catch (b) {
                                setTimeout(d, 1);
                                return
                            }
                            a()
                        };
                        d()
                    }
                }
            }
        }()}, c = window.CKEDITOR_GETURL;
        if (c) {
            var a = b.getUrl;
            b.getUrl = function (h) {
                return c.call(b, h) || a.call(b, h)
            }
        }
        return b
    }()), CKEDITOR.event || (CKEDITOR.event = function () {
    }, CKEDITOR.event.implementOn = function (b) {
        var c = CKEDITOR.event.prototype, a;
        for (a in c)b[a] == void 0 && (b[a] = c[a])
    }, CKEDITOR.event.prototype = function () {
        function b(h) {
            var b =
                c(this);
            return b[h] || (b[h] = new a(h))
        }

        var c = function (a) {
            a = a.getPrivate && a.getPrivate() || a._ || (a._ = {});
            return a.events || (a.events = {})
        }, a = function (a) {
            this.name = a;
            this.listeners = []
        };
        a.prototype = {getListenerIndex: function (a) {
            for (var b = 0, g = this.listeners; b < g.length; b++)if (g[b].fn == a)return b;
            return-1
        }};
        return{define: function (a, f) {
            var g = b.call(this, a);
            CKEDITOR.tools.extend(g, f, true)
        }, on: function (a, f, g, e, i) {
            function d(b, d, i, k) {
                b = {name: a, sender: this, editor: b, data: d, listenerData: e, stop: i, cancel: k, removeListener: c};
                return f.call(g, b) === false ? false : b.data
            }

            function c() {
                l.removeListener(a, f)
            }

            var k = b.call(this, a);
            if (k.getListenerIndex(f) < 0) {
                k = k.listeners;
                g || (g = this);
                isNaN(i) && (i = 10);
                var l = this;
                d.fn = f;
                d.priority = i;
                for (var m = k.length - 1; m >= 0; m--)if (k[m].priority <= i) {
                    k.splice(m + 1, 0, d);
                    return{removeListener: c}
                }
                k.unshift(d)
            }
            return{removeListener: c}
        }, once: function () {
            var a = arguments[1];
            arguments[1] = function (b) {
                b.removeListener();
                return a.apply(this, arguments)
            };
            return this.on.apply(this, arguments)
        }, capture: function () {
            CKEDITOR.event.useCapture =
                1;
            var a = this.on.apply(this, arguments);
            CKEDITOR.event.useCapture = 0;
            return a
        }, fire: function () {
            var a = 0, b = function () {
                a = 1
            }, g = 0, e = function () {
                g = 1
            };
            return function (i, d, j) {
                var k = c(this)[i], i = a, l = g;
                a = g = 0;
                if (k) {
                    var m = k.listeners;
                    if (m.length)for (var m = m.slice(0), n, o = 0; o < m.length; o++) {
                        if (k.errorProof)try {
                            n = m[o].call(this, j, d, b, e)
                        } catch (s) {
                        } else n = m[o].call(this, j, d, b, e);
                        n === false ? g = 1 : typeof n != "undefined" && (d = n);
                        if (a || g)break
                    }
                }
                d = g ? false : typeof d == "undefined" ? true : d;
                a = i;
                g = l;
                return d
            }
        }(), fireOnce: function (a, b, g) {
            b =
                this.fire(a, b, g);
            delete c(this)[a];
            return b
        }, removeListener: function (a, b) {
            var g = c(this)[a];
            if (g) {
                var e = g.getListenerIndex(b);
                e >= 0 && g.listeners.splice(e, 1)
            }
        }, removeAllListeners: function () {
            var a = c(this), b;
            for (b in a)delete a[b]
        }, hasListeners: function (a) {
            return(a = c(this)[a]) && a.listeners.length > 0
        }}
    }()), CKEDITOR.editor || (CKEDITOR.editor = function () {
        CKEDITOR._.pending.push([this, arguments]);
        CKEDITOR.event.call(this)
    }, CKEDITOR.editor.prototype.fire = function (b, c) {
        b in{instanceReady: 1, loaded: 1} && (this[b] =
            true);
        return CKEDITOR.event.prototype.fire.call(this, b, c, this)
    }, CKEDITOR.editor.prototype.fireOnce = function (b, c) {
        b in{instanceReady: 1, loaded: 1} && (this[b] = true);
        return CKEDITOR.event.prototype.fireOnce.call(this, b, c, this)
    }, CKEDITOR.event.implementOn(CKEDITOR.editor.prototype)), CKEDITOR.env || (CKEDITOR.env = function () {
        var b = navigator.userAgent.toLowerCase(), c = window.opera, a = {ie: eval("/*@cc_on!@*/false"), opera: !!c && c.version, webkit: b.indexOf(" applewebkit/") > -1, air: b.indexOf(" adobeair/") > -1, mac: b.indexOf("macintosh") > -1, quirks: document.compatMode == "BackCompat", mobile: b.indexOf("mobile") > -1, iOS: /(ipad|iphone|ipod)/.test(b), isCustomDomain: function () {
            if (!this.ie)return false;
            var a = document.domain, h = window.location.hostname;
            return a != h && a != "[" + h + "]"
        }, secure: location.protocol == "https:"};
        a.gecko = navigator.product == "Gecko" && !a.webkit && !a.opera;
        if (a.webkit)b.indexOf("chrome") > -1 ? a.chrome = true : a.safari = true;
        var h = 0;
        if (a.ie) {
            h = a.quirks || !document.documentMode ? parseFloat(b.match(/msie (\d+)/)[1]) : document.documentMode;
            a.ie9Compat =
                h == 9;
            a.ie8Compat = h == 8;
            a.ie7Compat = h == 7;
            a.ie6Compat = h < 7 || a.quirks
        }
        if (a.gecko) {
            var f = b.match(/rv:([\d\.]+)/);
            if (f) {
                f = f[1].split(".");
                h = f[0] * 1E4 + (f[1] || 0) * 100 + (f[2] || 0) * 1
            }
        }
        a.opera && (h = parseFloat(c.version()));
        a.air && (h = parseFloat(b.match(/ adobeair\/(\d+)/)[1]));
        a.webkit && (h = parseFloat(b.match(/ applewebkit\/(\d+)/)[1]));
        a.version = h;
        a.isCompatible = a.iOS && h >= 534 || !a.mobile && (a.ie && h > 6 || a.gecko && h >= 10801 || a.opera && h >= 9.5 || a.air && h >= 1 || a.webkit && h >= 522 || false);
        a.cssClass = "cke_browser_" + (a.ie ? "ie" : a.gecko ?
            "gecko" : a.opera ? "opera" : a.webkit ? "webkit" : "unknown");
        if (a.quirks)a.cssClass = a.cssClass + " cke_browser_quirks";
        if (a.ie) {
            a.cssClass = a.cssClass + (" cke_browser_ie" + (a.quirks || a.version < 7 ? "6" : a.version));
            if (a.quirks)a.cssClass = a.cssClass + " cke_browser_iequirks"
        }
        if (a.gecko)if (h < 10900)a.cssClass = a.cssClass + " cke_browser_gecko18"; else if (h <= 11E3)a.cssClass = a.cssClass + " cke_browser_gecko19";
        if (a.air)a.cssClass = a.cssClass + " cke_browser_air";
        return a
    }()), "unloaded" == CKEDITOR.status && function () {
        CKEDITOR.event.implementOn(CKEDITOR);
        CKEDITOR.loadFullCore = function () {
            if (CKEDITOR.status != "basic_ready")CKEDITOR.loadFullCore._load = 1; else {
                delete CKEDITOR.loadFullCore;
                var b = document.createElement("script");
                b.type = "text/javascript";
                b.src = CKEDITOR.basePath + "ckeditor.js";
                document.getElementsByTagName("head")[0].appendChild(b)
            }
        };
        CKEDITOR.loadFullCoreTimeout = 0;
        CKEDITOR.add = function (b) {
            (this._.pending || (this._.pending = [])).push(b)
        };
        (function () {
            CKEDITOR.domReady(function () {
                var b = CKEDITOR.loadFullCore, c = CKEDITOR.loadFullCoreTimeout;
                if (b) {
                    CKEDITOR.status =
                        "basic_ready";
                    b && b._load ? b() : c && setTimeout(function () {
                        CKEDITOR.loadFullCore && CKEDITOR.loadFullCore()
                    }, c * 1E3)
                }
            })
        })();
        CKEDITOR.status = "basic_loaded"
    }(), CKEDITOR.dom = {}, function () {
        var b = [], c = CKEDITOR.env.gecko ? "-moz-" : CKEDITOR.env.webkit ? "-webkit-" : CKEDITOR.env.opera ? "-o-" : CKEDITOR.env.ie ? "-ms-" : "";
        CKEDITOR.on("reset", function () {
            b = []
        });
        CKEDITOR.tools = {arrayCompare: function (a, h) {
            if (!a && !h)return true;
            if (!a || !h || a.length != h.length)return false;
            for (var b = 0; b < a.length; b++)if (a[b] != h[b])return false;
            return true
        },
            clone: function (a) {
                var h;
                if (a && a instanceof Array) {
                    h = [];
                    for (var b = 0; b < a.length; b++)h[b] = this.clone(a[b]);
                    return h
                }
                if (a === null || typeof a != "object" || a instanceof String || a instanceof Number || a instanceof Boolean || a instanceof Date || a instanceof RegExp)return a;
                h = new a.constructor;
                for (b in a)h[b] = this.clone(a[b]);
                return h
            }, capitalize: function (a) {
                return a.charAt(0).toUpperCase() + a.substring(1).toLowerCase()
            }, extend: function (a) {
                var b = arguments.length, f, g;
                if (typeof(f = arguments[b - 1]) == "boolean")b--; else if (typeof(f =
                    arguments[b - 2]) == "boolean") {
                    g = arguments[b - 1];
                    b = b - 2
                }
                for (var e = 1; e < b; e++) {
                    var i = arguments[e], d;
                    for (d in i)if (f === true || a[d] == void 0)if (!g || d in g)a[d] = i[d]
                }
                return a
            }, prototypedCopy: function (a) {
                var b = function () {
                };
                b.prototype = a;
                return new b
            }, isArray: function (a) {
                return!!a && a instanceof Array
            }, isEmpty: function (a) {
                for (var b in a)if (a.hasOwnProperty(b))return false;
                return true
            }, cssVendorPrefix: function (a, b, f) {
                if (f)return c + a + ":" + b + ";" + a + ":" + b;
                f = {};
                f[a] = b;
                f[c + a] = b;
                return f
            }, cssStyleToDomStyle: function () {
                var a =
                    document.createElement("div").style, b = typeof a.cssFloat != "undefined" ? "cssFloat" : typeof a.styleFloat != "undefined" ? "styleFloat" : "float";
                return function (a) {
                    return a == "float" ? b : a.replace(/-./g, function (a) {
                        return a.substr(1).toUpperCase()
                    })
                }
            }(), buildStyleHtml: function (a) {
                for (var a = [].concat(a), b, f = [], g = 0; g < a.length; g++)if (b = a[g])/@import|[{}]/.test(b) ? f.push("<style>" + b + "</style>") : f.push('<link type="text/css" rel=stylesheet href="' + b + '">');
                return f.join("")
            }, htmlEncode: function (a) {
                return("" + a).replace(/&/g,
                    "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;")
            }, htmlEncodeAttr: function (a) {
                return a.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            }, getNextNumber: function () {
                var a = 0;
                return function () {
                    return++a
                }
            }(), getNextId: function () {
                return"cke_" + this.getNextNumber()
            }, override: function (a, b) {
                var f = b(a);
                f.prototype = a.prototype;
                return f
            }, setTimeout: function (a, b, f, g, e) {
                e || (e = window);
                f || (f = e);
                return e.setTimeout(function () {
                    g ? a.apply(f, [].concat(g)) : a.apply(f)
                }, b || 0)
            }, trim: function () {
                var a = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
                return function (b) {
                    return b.replace(a, "")
                }
            }(), ltrim: function () {
                var a = /^[ \t\n\r]+/g;
                return function (b) {
                    return b.replace(a, "")
                }
            }(), rtrim: function () {
                var a = /[ \t\n\r]+$/g;
                return function (b) {
                    return b.replace(a, "")
                }
            }(), indexOf: function (a, b) {
                if (typeof b == "function")for (var f = 0, g = a.length; f < g; f++) {
                    if (b(a[f]))return f
                } else {
                    if (a.indexOf)return a.indexOf(b);
                    f = 0;
                    for (g = a.length; f < g; f++)if (a[f] === b)return f
                }
                return-1
            }, search: function (a, b) {
                var f = CKEDITOR.tools.indexOf(a, b);
                return f >= 0 ? a[f] : null
            }, bind: function (a, b) {
                return function () {
                    return a.apply(b, arguments)
                }
            }, createClass: function (a) {
                var b = a.$, f = a.base, g = a.privates || a._, e = a.proto, a = a.statics;
                !b && (b = function () {
                    f && this.base.apply(this, arguments)
                });
                if (g)var i = b, b = function () {
                    var a = this._ || (this._ = {}), b;
                    for (b in g) {
                        var h = g[b];
                        a[b] = typeof h == "function" ? CKEDITOR.tools.bind(h, this) : h
                    }
                    i.apply(this, arguments)
                };
                if (f) {
                    b.prototype = this.prototypedCopy(f.prototype);
                    b.prototype.constructor = b;
                    b.base = f;
                    b.baseProto = f.prototype;
                    b.prototype.base = function () {
                        this.base = f.prototype.base;
                        f.apply(this, arguments);
                        this.base = arguments.callee
                    }
                }
                e && this.extend(b.prototype, e, true);
                a && this.extend(b, a, true);
                return b
            }, addFunction: function (a, h) {
                return b.push(function () {
                    return a.apply(h || this, arguments)
                }) - 1
            }, removeFunction: function (a) {
                b[a] = null
            }, callFunction: function (a) {
                var h = b[a];
                return h && h.apply(window, Array.prototype.slice.call(arguments, 1))
            }, cssLength: function () {
                var a = /^-?\d+\.?\d*px$/, b;
                return function (f) {
                    b = CKEDITOR.tools.trim(f + "") + "px";
                    return a.test(b) ? b : f || ""
                }
            }(), convertToPx: function () {
                var a;
                return function (b) {
                    if (!a) {
                        a = CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>', CKEDITOR.document);
                        CKEDITOR.document.getBody().append(a)
                    }
                    if (!/%$/.test(b)) {
                        a.setStyle("width", b);
                        return a.$.clientWidth
                    }
                    return b
                }
            }(), repeat: function (a, b) {
                return Array(b + 1).join(a)
            }, tryThese: function () {
                for (var a, b = 0, f = arguments.length; b < f; b++) {
                    var g = arguments[b];
                    try {
                        a = g();
                        break
                    } catch (e) {
                    }
                }
                return a
            }, genKey: function () {
                return Array.prototype.slice.call(arguments).join("-")
            },
            defer: function (a) {
                return function () {
                    var b = arguments, f = this;
                    window.setTimeout(function () {
                        a.apply(f, b)
                    }, 0)
                }
            }, normalizeCssText: function (a, b) {
                var f = [], g, e = CKEDITOR.tools.parseCssText(a, true, b);
                for (g in e)f.push(g + ":" + e[g]);
                f.sort();
                return f.length ? f.join(";") + ";" : ""
            }, convertRgbToHex: function (a) {
                return a.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function (a, b, g, e) {
                    a = [b, g, e];
                    for (b = 0; b < 3; b++)a[b] = ("0" + parseInt(a[b], 10).toString(16)).slice(-2);
                    return"#" + a.join("")
                })
            }, parseCssText: function (a, b, f) {
                var g = {};
                if (f) {
                    f = new CKEDITOR.dom.element("span");
                    f.setAttribute("style", a);
                    a = CKEDITOR.tools.convertRgbToHex(f.getAttribute("style") || "")
                }
                if (!a || a == ";")return g;
                a.replace(/&quot;/g, '"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function (a, i, d) {
                    if (b) {
                        i = i.toLowerCase();
                        i == "font-family" && (d = d.toLowerCase().replace(/["']/g, "").replace(/\s*,\s*/g, ","));
                        d = CKEDITOR.tools.trim(d)
                    }
                    g[i] = d
                });
                return g
            }}
    }(), CKEDITOR.dtd = function () {
        var b = CKEDITOR.tools.extend, c = function (a, b) {
            for (var h = CKEDITOR.tools.clone(a),
                     d = 1; d < arguments.length; d++) {
                var b = arguments[d], e;
                for (e in b)delete h[e]
            }
            return h
        }, a = {}, h = {}, f = {address: 1, article: 1, aside: 1, blockquote: 1, details: 1, div: 1, dl: 1, fieldset: 1, figure: 1, footer: 1, form: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, header: 1, hgroup: 1, hr: 1, menu: 1, nav: 1, ol: 1, p: 1, pre: 1, section: 1, table: 1, ul: 1}, g = {command: 1, link: 1, meta: 1, noscript: 1, script: 1, style: 1}, e = {}, i = {"#": 1}, d = {center: 1, dir: 1, noframes: 1};
        b(a, {a: 1, abbr: 1, area: 1, audio: 1, b: 1, bdi: 1, bdo: 1, br: 1, button: 1, canvas: 1, cite: 1, code: 1, command: 1, datalist: 1,
            del: 1, dfn: 1, em: 1, embed: 1, i: 1, iframe: 1, img: 1, input: 1, ins: 1, kbd: 1, keygen: 1, label: 1, map: 1, mark: 1, meter: 1, noscript: 1, object: 1, output: 1, progress: 1, q: 1, ruby: 1, s: 1, samp: 1, script: 1, select: 1, small: 1, span: 1, strong: 1, sub: 1, sup: 1, textarea: 1, time: 1, u: 1, "var": 1, video: 1, wbr: 1}, i, {acronym: 1, applet: 1, basefont: 1, big: 1, font: 1, isindex: 1, strike: 1, style: 1, tt: 1});
        b(h, f, a, d);
        c = {a: c(a, {a: 1, button: 1}), abbr: a, address: h, area: e, article: b({style: 1}, h), aside: b({style: 1}, h), audio: b({source: 1, track: 1}, h), b: a, base: e, bdi: a, bdo: a, blockquote: h,
            body: h, br: e, button: c(a, {a: 1, button: 1}), canvas: a, caption: h, cite: a, code: a, col: e, colgroup: {col: 1}, command: e, datalist: b({option: 1}, a), dd: h, del: a, details: b({summary: 1}, h), dfn: a, div: b({style: 1}, h), dl: {dt: 1, dd: 1}, dt: h, em: a, embed: e, fieldset: b({legend: 1}, h), figcaption: h, figure: b({figcaption: 1}, h), footer: h, form: h, h1: a, h2: a, h3: a, h4: a, h5: a, h6: a, head: b({title: 1, base: 1}, g), header: h, hgroup: {h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1}, hr: e, html: b({head: 1, body: 1}, h, g), i: a, iframe: i, img: e, input: e, ins: a, kbd: a, keygen: e, label: a, legend: a,
            li: h, link: e, map: h, mark: a, menu: b({li: 1}, h), meta: e, meter: c(a, {meter: 1}), nav: h, noscript: b({link: 1, meta: 1, style: 1}, a), object: b({param: 1}, a), ol: {li: 1}, optgroup: {option: 1}, option: i, output: a, p: a, param: e, pre: a, progress: c(a, {progress: 1}), q: a, rp: a, rt: a, ruby: b({rp: 1, rt: 1}, a), s: a, samp: a, script: i, section: b({style: 1}, h), select: {optgroup: 1, option: 1}, small: a, source: e, span: a, strong: a, style: i, sub: a, summary: a, sup: a, table: {caption: 1, colgroup: 1, thead: 1, tfoot: 1, tbody: 1, tr: 1}, tbody: {tr: 1}, td: h, textarea: i, tfoot: {tr: 1}, th: h,
            thead: {tr: 1}, time: c(a, {time: 1}), title: i, tr: {th: 1, td: 1}, track: e, u: a, ul: {li: 1}, "var": a, video: b({source: 1, track: 1}, h), wbr: e, acronym: a, applet: b({param: 1}, h), basefont: e, big: a, center: h, dialog: e, dir: {li: 1}, font: a, isindex: e, noframes: h, strike: a, tt: a};
        b(c, {$block: b({audio: 1, dd: 1, dt: 1, li: 1, video: 1}, f, d), $blockLimit: {article: 1, aside: 1, audio: 1, body: 1, caption: 1, details: 1, dir: 1, div: 1, dl: 1, fieldset: 1, figure: 1, footer: 1, form: 1, header: 1, hgroup: 1, menu: 1, nav: 1, ol: 1, section: 1, table: 1, td: 1, th: 1, tr: 1, ul: 1, video: 1}, $cdata: {script: 1,
            style: 1}, $editable: {address: 1, article: 1, aside: 1, blockquote: 1, body: 1, details: 1, div: 1, fieldset: 1, footer: 1, form: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, header: 1, hgroup: 1, nav: 1, p: 1, pre: 1, section: 1}, $empty: {area: 1, base: 1, basefont: 1, br: 1, col: 1, command: 1, dialog: 1, embed: 1, hr: 1, img: 1, input: 1, isindex: 1, keygen: 1, link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1}, $inline: a, $list: {dl: 1, ol: 1, ul: 1}, $listItem: {dd: 1, dt: 1, li: 1}, $nonBodyContent: b({body: 1, head: 1, html: 1}, c.head), $nonEditable: {applet: 1, audio: 1, button: 1, embed: 1, iframe: 1,
            map: 1, object: 1, option: 1, param: 1, script: 1, textarea: 1, video: 1}, $object: {applet: 1, audio: 1, button: 1, hr: 1, iframe: 1, img: 1, input: 1, object: 1, select: 1, table: 1, textarea: 1, video: 1}, $removeEmpty: {abbr: 1, acronym: 1, b: 1, bdi: 1, bdo: 1, big: 1, cite: 1, code: 1, del: 1, dfn: 1, em: 1, font: 1, i: 1, ins: 1, label: 1, kbd: 1, mark: 1, meter: 1, output: 1, q: 1, ruby: 1, s: 1, samp: 1, small: 1, span: 1, strike: 1, strong: 1, sub: 1, sup: 1, time: 1, tt: 1, u: 1, "var": 1}, $tabIndex: {a: 1, area: 1, button: 1, input: 1, object: 1, select: 1, textarea: 1}, $tableContent: {caption: 1, col: 1,
            colgroup: 1, tbody: 1, td: 1, tfoot: 1, th: 1, thead: 1, tr: 1}, $transparent: {a: 1, audio: 1, canvas: 1, del: 1, ins: 1, map: 1, noscript: 1, object: 1, video: 1}, $intermediate: {caption: 1, colgroup: 1, dd: 1, dt: 1, figcaption: 1, legend: 1, li: 1, optgroup: 1, option: 1, rp: 1, rt: 1, summary: 1, tbody: 1, td: 1, tfoot: 1, th: 1, thead: 1, tr: 1}});
        return c
    }(), CKEDITOR.dom.event = function (b) {
        this.$ = b
    }, CKEDITOR.dom.event.prototype = {getKey: function () {
        return this.$.keyCode || this.$.which
    }, getKeystroke: function () {
        var b = this.getKey();
        if (this.$.ctrlKey || this.$.metaKey)b =
            b + CKEDITOR.CTRL;
        this.$.shiftKey && (b = b + CKEDITOR.SHIFT);
        this.$.altKey && (b = b + CKEDITOR.ALT);
        return b
    }, preventDefault: function (b) {
        var c = this.$;
        c.preventDefault ? c.preventDefault() : c.returnValue = false;
        b && this.stopPropagation()
    }, stopPropagation: function () {
        var b = this.$;
        b.stopPropagation ? b.stopPropagation() : b.cancelBubble = true
    }, getTarget: function () {
        var b = this.$.target || this.$.srcElement;
        return b ? new CKEDITOR.dom.node(b) : null
    }, getPhase: function () {
        return this.$.eventPhase || 2
    }, getPageOffset: function () {
        var b = this.getTarget().getDocument().$;
        return{x: this.$.pageX || this.$.clientX + (b.documentElement.scrollLeft || b.body.scrollLeft), y: this.$.pageY || this.$.clientY + (b.documentElement.scrollTop || b.body.scrollTop)}
    }}, CKEDITOR.CTRL = 1114112, CKEDITOR.SHIFT = 2228224, CKEDITOR.ALT = 4456448, CKEDITOR.EVENT_PHASE_CAPTURING = 1, CKEDITOR.EVENT_PHASE_AT_TARGET = 2, CKEDITOR.EVENT_PHASE_BUBBLING = 3, CKEDITOR.dom.domObject = function (b) {
        if (b)this.$ = b
    }, CKEDITOR.dom.domObject.prototype = function () {
        var b = function (b, a) {
            return function (h) {
                typeof CKEDITOR != "undefined" && b.fire(a,
                    new CKEDITOR.dom.event(h))
            }
        };
        return{getPrivate: function () {
            var b;
            if (!(b = this.getCustomData("_")))this.setCustomData("_", b = {});
            return b
        }, on: function (c) {
            var a = this.getCustomData("_cke_nativeListeners");
            if (!a) {
                a = {};
                this.setCustomData("_cke_nativeListeners", a)
            }
            if (!a[c]) {
                a = a[c] = b(this, c);
                this.$.addEventListener ? this.$.addEventListener(c, a, !!CKEDITOR.event.useCapture) : this.$.attachEvent && this.$.attachEvent("on" + c, a)
            }
            return CKEDITOR.event.prototype.on.apply(this, arguments)
        }, removeListener: function (b) {
            CKEDITOR.event.prototype.removeListener.apply(this,
                arguments);
            if (!this.hasListeners(b)) {
                var a = this.getCustomData("_cke_nativeListeners"), h = a && a[b];
                if (h) {
                    this.$.removeEventListener ? this.$.removeEventListener(b, h, false) : this.$.detachEvent && this.$.detachEvent("on" + b, h);
                    delete a[b]
                }
            }
        }, removeAllListeners: function () {
            var b = this.getCustomData("_cke_nativeListeners"), a;
            for (a in b) {
                var h = b[a];
                this.$.detachEvent ? this.$.detachEvent("on" + a, h) : this.$.removeEventListener && this.$.removeEventListener(a, h, false);
                delete b[a]
            }
        }}
    }(), function (b) {
        var c = {};
        CKEDITOR.on("reset",
            function () {
                c = {}
            });
        b.equals = function (a) {
            try {
                return a && a.$ === this.$
            } catch (b) {
                return false
            }
        };
        b.setCustomData = function (a, b) {
            var f = this.getUniqueId();
            (c[f] || (c[f] = {}))[a] = b;
            return this
        };
        b.getCustomData = function (a) {
            var b = this.$["data-cke-expando"];
            return(b = b && c[b]) && a in b ? b[a] : null
        };
        b.removeCustomData = function (a) {
            var b = this.$["data-cke-expando"], b = b && c[b], f, g;
            if (b) {
                f = b[a];
                g = a in b;
                delete b[a]
            }
            return g ? f : null
        };
        b.clearCustomData = function () {
            this.removeAllListeners();
            var a = this.$["data-cke-expando"];
            a && delete c[a]
        };
        b.getUniqueId = function () {
            return this.$["data-cke-expando"] || (this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber())
        };
        CKEDITOR.event.implementOn(b)
    }(CKEDITOR.dom.domObject.prototype), CKEDITOR.dom.node = function (b) {
        return b ? new CKEDITOR.dom[b.nodeType == CKEDITOR.NODE_DOCUMENT ? "document" : b.nodeType == CKEDITOR.NODE_ELEMENT ? "element" : b.nodeType == CKEDITOR.NODE_TEXT ? "text" : b.nodeType == CKEDITOR.NODE_COMMENT ? "comment" : b.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? "documentFragment" : "domObject"](b) : this
    }, CKEDITOR.dom.node.prototype =
        new CKEDITOR.dom.domObject, CKEDITOR.NODE_ELEMENT = 1, CKEDITOR.NODE_DOCUMENT = 9, CKEDITOR.NODE_TEXT = 3, CKEDITOR.NODE_COMMENT = 8, CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11, CKEDITOR.POSITION_IDENTICAL = 0, CKEDITOR.POSITION_DISCONNECTED = 1, CKEDITOR.POSITION_FOLLOWING = 2, CKEDITOR.POSITION_PRECEDING = 4, CKEDITOR.POSITION_IS_CONTAINED = 8, CKEDITOR.POSITION_CONTAINS = 16, CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype, {appendTo: function (b, c) {
        b.append(this, c);
        return b
    }, clone: function (b, c) {
        var a = this.$.cloneNode(b), h = function (a) {
            a["data-cke-expando"] &&
            (a["data-cke-expando"] = false);
            if (a.nodeType == CKEDITOR.NODE_ELEMENT) {
                c || a.removeAttribute("id", false);
                if (b)for (var a = a.childNodes, g = 0; g < a.length; g++)h(a[g])
            }
        };
        h(a);
        return new CKEDITOR.dom.node(a)
    }, hasPrevious: function () {
        return!!this.$.previousSibling
    }, hasNext: function () {
        return!!this.$.nextSibling
    }, insertAfter: function (b) {
        b.$.parentNode.insertBefore(this.$, b.$.nextSibling);
        return b
    }, insertBefore: function (b) {
        b.$.parentNode.insertBefore(this.$, b.$);
        return b
    }, insertBeforeMe: function (b) {
        this.$.parentNode.insertBefore(b.$,
            this.$);
        return b
    }, getAddress: function (b) {
        for (var c = [], a = this.getDocument().$.documentElement, h = this.$; h && h != a;) {
            var f = h.parentNode;
            f && c.unshift(this.getIndex.call({$: h}, b));
            h = f
        }
        return c
    }, getDocument: function () {
        return new CKEDITOR.dom.document(this.$.ownerDocument || this.$.parentNode.ownerDocument)
    }, getIndex: function (b) {
        var c = this.$, a = -1, h;
        if (!this.$.parentNode)return a;
        do if (!b || !(c != this.$ && c.nodeType == CKEDITOR.NODE_TEXT && (h || !c.nodeValue))) {
            a++;
            h = c.nodeType == CKEDITOR.NODE_TEXT
        } while (c = c.previousSibling);
        return a
    }, getNextSourceNode: function (b, c, a) {
        if (a && !a.call)var h = a, a = function (a) {
            return!a.equals(h)
        };
        var b = !b && this.getFirst && this.getFirst(), f;
        if (!b) {
            if (this.type == CKEDITOR.NODE_ELEMENT && a && a(this, true) === false)return null;
            b = this.getNext()
        }
        for (; !b && (f = (f || this).getParent());) {
            if (a && a(f, true) === false)return null;
            b = f.getNext()
        }
        return!b || a && a(b) === false ? null : c && c != b.type ? b.getNextSourceNode(false, c, a) : b
    }, getPreviousSourceNode: function (b, c, a) {
        if (a && !a.call)var h = a, a = function (a) {
            return!a.equals(h)
        };
        var b =
            !b && this.getLast && this.getLast(), f;
        if (!b) {
            if (this.type == CKEDITOR.NODE_ELEMENT && a && a(this, true) === false)return null;
            b = this.getPrevious()
        }
        for (; !b && (f = (f || this).getParent());) {
            if (a && a(f, true) === false)return null;
            b = f.getPrevious()
        }
        return!b || a && a(b) === false ? null : c && b.type != c ? b.getPreviousSourceNode(false, c, a) : b
    }, getPrevious: function (b) {
        var c = this.$, a;
        do a = (c = c.previousSibling) && c.nodeType != 10 && new CKEDITOR.dom.node(c); while (a && b && !b(a));
        return a
    }, getNext: function (b) {
        var c = this.$, a;
        do a = (c = c.nextSibling) &&
            new CKEDITOR.dom.node(c); while (a && b && !b(a));
        return a
    }, getParent: function (b) {
        var c = this.$.parentNode;
        return c && (c.nodeType == CKEDITOR.NODE_ELEMENT || b && c.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) ? new CKEDITOR.dom.node(c) : null
    }, getParents: function (b) {
        var c = this, a = [];
        do a[b ? "push" : "unshift"](c); while (c = c.getParent());
        return a
    }, getCommonAncestor: function (b) {
        if (b.equals(this))return this;
        if (b.contains && b.contains(this))return b;
        var c = this.contains ? this : this.getParent();
        do if (c.contains(b))return c; while (c =
            c.getParent());
        return null
    }, getPosition: function (b) {
        var c = this.$, a = b.$;
        if (c.compareDocumentPosition)return c.compareDocumentPosition(a);
        if (c == a)return CKEDITOR.POSITION_IDENTICAL;
        if (this.type == CKEDITOR.NODE_ELEMENT && b.type == CKEDITOR.NODE_ELEMENT) {
            if (c.contains) {
                if (c.contains(a))return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
                if (a.contains(c))return CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
            }
            if ("sourceIndex"in c)return c.sourceIndex < 0 || a.sourceIndex < 0 ? CKEDITOR.POSITION_DISCONNECTED :
                    c.sourceIndex < a.sourceIndex ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING
        }
        for (var c = this.getAddress(), b = b.getAddress(), a = Math.min(c.length, b.length), h = 0; h <= a - 1; h++)if (c[h] != b[h]) {
            if (h < a)return c[h] < b[h] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
            break
        }
        return c.length < b.length ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
    }, getAscendant: function (b, c) {
        var a = this.$, h;
        if (!c)a = a.parentNode;
        for (; a;) {
            if (a.nodeName &&
                (h = a.nodeName.toLowerCase(), typeof b == "string" ? h == b : h in b))return new CKEDITOR.dom.node(a);
            a = a.parentNode
        }
        return null
    }, hasAscendant: function (b, c) {
        var a = this.$;
        if (!c)a = a.parentNode;
        for (; a;) {
            if (a.nodeName && a.nodeName.toLowerCase() == b)return true;
            a = a.parentNode
        }
        return false
    }, move: function (b, c) {
        b.append(this.remove(), c)
    }, remove: function (b) {
        var c = this.$, a = c.parentNode;
        if (a) {
            if (b)for (; b = c.firstChild;)a.insertBefore(c.removeChild(b), c);
            a.removeChild(c)
        }
        return this
    }, replace: function (b) {
        this.insertBefore(b);
        b.remove()
    }, trim: function () {
        this.ltrim();
        this.rtrim()
    }, ltrim: function () {
        for (var b; this.getFirst && (b = this.getFirst());) {
            if (b.type == CKEDITOR.NODE_TEXT) {
                var c = CKEDITOR.tools.ltrim(b.getText()), a = b.getLength();
                if (c) {
                    if (c.length < a) {
                        b.split(a - c.length);
                        this.$.removeChild(this.$.firstChild)
                    }
                } else {
                    b.remove();
                    continue
                }
            }
            break
        }
    }, rtrim: function () {
        for (var b; this.getLast && (b = this.getLast());) {
            if (b.type == CKEDITOR.NODE_TEXT) {
                var c = CKEDITOR.tools.rtrim(b.getText()), a = b.getLength();
                if (c) {
                    if (c.length < a) {
                        b.split(c.length);
                        this.$.lastChild.parentNode.removeChild(this.$.lastChild)
                    }
                } else {
                    b.remove();
                    continue
                }
            }
            break
        }
        if (!CKEDITOR.env.ie && !CKEDITOR.env.opera)(b = this.$.lastChild) && (b.type == 1 && b.nodeName.toLowerCase() == "br") && b.parentNode.removeChild(b)
    }, isReadOnly: function () {
        var b = this;
        this.type != CKEDITOR.NODE_ELEMENT && (b = this.getParent());
        if (b && typeof b.$.isContentEditable != "undefined")return!(b.$.isContentEditable || b.data("cke-editable"));
        for (; b;) {
            if (b.data("cke-editable"))break;
            if (b.getAttribute("contentEditable") == "false")return true;
            if (b.getAttribute("contentEditable") == "true")break;
            b = b.getParent()
        }
        return!b
    }}), CKEDITOR.dom.window = function (b) {
        CKEDITOR.dom.domObject.call(this, b)
    }, CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject, CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {focus: function () {
        this.$.focus()
    }, getViewPaneSize: function () {
        var b = this.$.document, c = b.compatMode == "CSS1Compat";
        return{width: (c ? b.documentElement.clientWidth : b.body.clientWidth) || 0, height: (c ? b.documentElement.clientHeight : b.body.clientHeight) ||
            0}
    }, getScrollPosition: function () {
        var b = this.$;
        if ("pageXOffset"in b)return{x: b.pageXOffset || 0, y: b.pageYOffset || 0};
        b = b.document;
        return{x: b.documentElement.scrollLeft || b.body.scrollLeft || 0, y: b.documentElement.scrollTop || b.body.scrollTop || 0}
    }, getFrame: function () {
        var b = this.$.frameElement;
        return b ? new CKEDITOR.dom.element.get(b) : null
    }}), CKEDITOR.dom.document = function (b) {
        CKEDITOR.dom.domObject.call(this, b)
    }, CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject, CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype,
        {type: CKEDITOR.NODE_DOCUMENT, appendStyleSheet: function (b) {
            if (this.$.createStyleSheet)this.$.createStyleSheet(b); else {
                var c = new CKEDITOR.dom.element("link");
                c.setAttributes({rel: "stylesheet", type: "text/css", href: b});
                this.getHead().append(c)
            }
        }, appendStyleText: function (b) {
            if (this.$.createStyleSheet) {
                var c = this.$.createStyleSheet("");
                c.cssText = b
            } else {
                var a = new CKEDITOR.dom.element("style", this);
                a.append(new CKEDITOR.dom.text(b, this));
                this.getHead().append(a)
            }
            return c || a.$.sheet
        }, createElement: function (b, c) {
            var a = new CKEDITOR.dom.element(b, this);
            if (c) {
                c.attributes && a.setAttributes(c.attributes);
                c.styles && a.setStyles(c.styles)
            }
            return a
        }, createText: function (b) {
            return new CKEDITOR.dom.text(b, this)
        }, focus: function () {
            this.getWindow().focus()
        }, getActive: function () {
            return new CKEDITOR.dom.element(this.$.activeElement)
        }, getById: function (b) {
            return(b = this.$.getElementById(b)) ? new CKEDITOR.dom.element(b) : null
        }, getByAddress: function (b, c) {
            for (var a = this.$.documentElement, h = 0; a && h < b.length; h++) {
                var f = b[h];
                if (c)for (var g =
                    -1, e = 0; e < a.childNodes.length; e++) {
                    var i = a.childNodes[e];
                    if (!(c === true && i.nodeType == 3 && i.previousSibling && i.previousSibling.nodeType == 3)) {
                        g++;
                        if (g == f) {
                            a = i;
                            break
                        }
                    }
                } else a = a.childNodes[f]
            }
            return a ? new CKEDITOR.dom.node(a) : null
        }, getElementsByTag: function (b, c) {
            if ((!CKEDITOR.env.ie || document.documentMode > 8) && c)b = c + ":" + b;
            return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(b))
        }, getHead: function () {
            var b = this.$.getElementsByTagName("head")[0];
            return b = b ? new CKEDITOR.dom.element(b) : this.getDocumentElement().append(new CKEDITOR.dom.element("head"),
                true)
        }, getBody: function () {
            return new CKEDITOR.dom.element(this.$.body)
        }, getDocumentElement: function () {
            return new CKEDITOR.dom.element(this.$.documentElement)
        }, getWindow: function () {
            var b = new CKEDITOR.dom.window(this.$.parentWindow || this.$.defaultView);
            return(this.getWindow = function () {
                return b
            })()
        }, write: function (b) {
            this.$.open("text/html", "replace");
            CKEDITOR.env.isCustomDomain() && (this.$.domain = document.domain);
            this.$.write(b);
            this.$.close()
        }}), CKEDITOR.dom.nodeList = function (b) {
        this.$ = b
    }, CKEDITOR.dom.nodeList.prototype =
    {count: function () {
        return this.$.length
    }, getItem: function (b) {
        if (b < 0 || b >= this.$.length)return null;
        return(b = this.$[b]) ? new CKEDITOR.dom.node(b) : null
    }}, CKEDITOR.dom.element = function (b, c) {
        typeof b == "string" && (b = (c ? c.$ : document).createElement(b));
        CKEDITOR.dom.domObject.call(this, b)
    }, CKEDITOR.dom.element.get = function (b) {
        return(b = typeof b == "string" ? document.getElementById(b) || document.getElementsByName(b)[0] : b) && (b.$ ? b : new CKEDITOR.dom.element(b))
    }, CKEDITOR.dom.element.prototype = new CKEDITOR.dom.node, CKEDITOR.dom.element.createFromHtml =
        function (b, c) {
            var a = new CKEDITOR.dom.element("div", c);
            a.setHtml(b);
            return a.getFirst().remove()
        }, CKEDITOR.dom.element.setMarker = function (b, c, a, h) {
        var f = c.getCustomData("list_marker_id") || c.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id"), g = c.getCustomData("list_marker_names") || c.setCustomData("list_marker_names", {}).getCustomData("list_marker_names");
        b[f] = c;
        g[a] = 1;
        return c.setCustomData(a, h)
    }, CKEDITOR.dom.element.clearAllMarkers = function (b) {
        for (var c in b)CKEDITOR.dom.element.clearMarkers(b,
            b[c], 1)
    }, CKEDITOR.dom.element.clearMarkers = function (b, c, a) {
        var h = c.getCustomData("list_marker_names"), f = c.getCustomData("list_marker_id"), g;
        for (g in h)c.removeCustomData(g);
        c.removeCustomData("list_marker_names");
        if (a) {
            c.removeCustomData("list_marker_id");
            delete b[f]
        }
    }, function () {
        function b(a) {
            for (var b = 0, f = 0, g = c[a].length; f < g; f++)b = b + (parseInt(this.getComputedStyle(c[a][f]) || 0, 10) || 0);
            return b
        }

        CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {type: CKEDITOR.NODE_ELEMENT, addClass: function (a) {
            var b =
                this.$.className;
            b && (RegExp("(?:^|\\s)" + a + "(?:\\s|$)", "").test(b) || (b = b + (" " + a)));
            this.$.className = b || a
        }, removeClass: function (a) {
            var b = this.getAttribute("class");
            if (b) {
                a = RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "i");
                if (a.test(b))(b = b.replace(a, "").replace(/^\s+/, "")) ? this.setAttribute("class", b) : this.removeAttribute("class")
            }
            return this
        }, hasClass: function (a) {
            return RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "").test(this.getAttribute("class"))
        }, append: function (a, b) {
            typeof a == "string" && (a = this.getDocument().createElement(a));
            b ? this.$.insertBefore(a.$, this.$.firstChild) : this.$.appendChild(a.$);
            return a
        }, appendHtml: function (a) {
            if (this.$.childNodes.length) {
                var b = new CKEDITOR.dom.element("div", this.getDocument());
                b.setHtml(a);
                b.moveChildren(this)
            } else this.setHtml(a)
        }, appendText: function (a) {
            this.$.text != void 0 ? this.$.text = this.$.text + a : this.append(new CKEDITOR.dom.text(a))
        }, appendBogus: function () {
            for (var a = this.getLast(); a && a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.rtrim(a.getText());)a = a.getPrevious();
            if (!a || !a.is || !a.is("br")) {
                a =
                    CKEDITOR.env.opera ? this.getDocument().createText("") : this.getDocument().createElement("br");
                CKEDITOR.env.gecko && a.setAttribute("type", "_moz");
                this.append(a)
            }
        }, breakParent: function (a) {
            var b = new CKEDITOR.dom.range(this.getDocument());
            b.setStartAfter(this);
            b.setEndAfter(a);
            a = b.extractContents();
            b.insertNode(this.remove());
            a.insertAfterNode(this)
        }, contains: CKEDITOR.env.ie || CKEDITOR.env.webkit ? function (a) {
            var b = this.$;
            return a.type != CKEDITOR.NODE_ELEMENT ? b.contains(a.getParent().$) : b != a.$ && b.contains(a.$)
        } :
            function (a) {
                return!!(this.$.compareDocumentPosition(a.$) & 16)
            }, focus: function () {
            function a() {
                try {
                    this.$.focus()
                } catch (a) {
                }
            }

            return function (b) {
                b ? CKEDITOR.tools.setTimeout(a, 100, this) : a.call(this)
            }
        }(), getHtml: function () {
            var a = this.$.innerHTML;
            return CKEDITOR.env.ie ? a.replace(/<\?[^>]*>/g, "") : a
        }, getOuterHtml: function () {
            if (this.$.outerHTML)return this.$.outerHTML.replace(/<\?[^>]*>/, "");
            var a = this.$.ownerDocument.createElement("div");
            a.appendChild(this.$.cloneNode(true));
            return a.innerHTML
        }, getClientRect: function () {
            var a =
                CKEDITOR.tools.extend({}, this.$.getBoundingClientRect());
            !a.width && (a.width = a.right - a.left);
            !a.height && (a.height = a.bottom - a.top);
            return a
        }, setHtml: function () {
            var a = function (a) {
                return this.$.innerHTML = a
            };
            return CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? function (a) {
                try {
                    return this.$.innerHTML = a
                } catch (b) {
                    this.$.innerHTML = "";
                    var g = new CKEDITOR.dom.element("body", this.getDocument());
                    g.$.innerHTML = a;
                    for (g = g.getChildren(); g.count();)this.append(g.getItem(0));
                    return a
                }
            } : a
        }(), setText: function (a) {
            CKEDITOR.dom.element.prototype.setText =
                    this.$.innerText != void 0 ? function (a) {
                return this.$.innerText = a
            } : function (a) {
                return this.$.textContent = a
            };
            return this.setText(a)
        }, getAttribute: function () {
            var a = function (a) {
                return this.$.getAttribute(a, 2)
            };
            return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function (a) {
                switch (a) {
                    case "class":
                        a = "className";
                        break;
                    case "http-equiv":
                        a = "httpEquiv";
                        break;
                    case "name":
                        return this.$.name;
                    case "tabindex":
                        a = this.$.getAttribute(a, 2);
                        a !== 0 && this.$.tabIndex === 0 && (a = null);
                        return a;
                    case "checked":
                        a =
                            this.$.attributes.getNamedItem(a);
                        return(a.specified ? a.nodeValue : this.$.checked) ? "checked" : null;
                    case "hspace":
                    case "value":
                        return this.$[a];
                    case "style":
                        return this.$.style.cssText;
                    case "contenteditable":
                    case "contentEditable":
                        return this.$.attributes.getNamedItem("contentEditable").specified ? this.$.getAttribute("contentEditable") : null
                }
                return this.$.getAttribute(a, 2)
            } : a
        }(), getChildren: function () {
            return new CKEDITOR.dom.nodeList(this.$.childNodes)
        }, getComputedStyle: CKEDITOR.env.ie ? function (a) {
            return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(a)]
        } :
            function (a) {
                var b = this.getWindow().$.getComputedStyle(this.$, null);
                return b ? b.getPropertyValue(a) : ""
            }, getDtd: function () {
            var a = CKEDITOR.dtd[this.getName()];
            this.getDtd = function () {
                return a
            };
            return a
        }, getElementsByTag: CKEDITOR.dom.document.prototype.getElementsByTag, getTabIndex: CKEDITOR.env.ie ? function () {
            var a = this.$.tabIndex;
            a === 0 && (!CKEDITOR.dtd.$tabIndex[this.getName()] && parseInt(this.getAttribute("tabindex"), 10) !== 0) && (a = -1);
            return a
        } : CKEDITOR.env.webkit ? function () {
            var a = this.$.tabIndex;
            if (a == void 0) {
                a =
                    parseInt(this.getAttribute("tabindex"), 10);
                isNaN(a) && (a = -1)
            }
            return a
        } : function () {
            return this.$.tabIndex
        }, getText: function () {
            return this.$.textContent || this.$.innerText || ""
        }, getWindow: function () {
            return this.getDocument().getWindow()
        }, getId: function () {
            return this.$.id || null
        }, getNameAtt: function () {
            return this.$.name || null
        }, getName: function () {
            var a = this.$.nodeName.toLowerCase();
            if (CKEDITOR.env.ie && !(document.documentMode > 8)) {
                var b = this.$.scopeName;
                b != "HTML" && (a = b.toLowerCase() + ":" + a)
            }
            return(this.getName =
                function () {
                    return a
                })()
        }, getValue: function () {
            return this.$.value
        }, getFirst: function (a) {
            var b = this.$.firstChild;
            (b = b && new CKEDITOR.dom.node(b)) && (a && !a(b)) && (b = b.getNext(a));
            return b
        }, getLast: function (a) {
            var b = this.$.lastChild;
            (b = b && new CKEDITOR.dom.node(b)) && (a && !a(b)) && (b = b.getPrevious(a));
            return b
        }, getStyle: function (a) {
            return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)]
        }, is: function () {
            var a = this.getName();
            if (typeof arguments[0] == "object")return!!arguments[0][a];
            for (var b = 0; b < arguments.length; b++)if (arguments[b] ==
                a)return true;
            return false
        }, isEditable: function (a) {
            var b = this.getName();
            if (this.isReadOnly() || this.getComputedStyle("display") == "none" || this.getComputedStyle("visibility") == "hidden" || CKEDITOR.dtd.$nonEditable[b] || CKEDITOR.dtd.$empty[b] || this.is("a") && (this.data("cke-saved-name") || this.hasAttribute("name")) && !this.getChildCount())return false;
            if (a !== false) {
                a = CKEDITOR.dtd[b] || CKEDITOR.dtd.span;
                return!(!a || !a["#"])
            }
            return true
        }, isIdentical: function (a) {
            var b = this.clone(0, 1), a = a.clone(0, 1);
            b.removeAttributes(["_moz_dirty",
                "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
            a.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
            if (b.$.isEqualNode) {
                b.$.style.cssText = CKEDITOR.tools.normalizeCssText(b.$.style.cssText);
                a.$.style.cssText = CKEDITOR.tools.normalizeCssText(a.$.style.cssText);
                return b.$.isEqualNode(a.$)
            }
            b = b.getOuterHtml();
            a = a.getOuterHtml();
            if (CKEDITOR.env.ie && CKEDITOR.env.version < 9 && this.is("a")) {
                var f = this.getParent();
                if (f.type == CKEDITOR.NODE_ELEMENT) {
                    f =
                        f.clone();
                    f.setHtml(b);
                    b = f.getHtml();
                    f.setHtml(a);
                    a = f.getHtml()
                }
            }
            return b == a
        }, isVisible: function () {
            var a = (this.$.offsetHeight || this.$.offsetWidth) && this.getComputedStyle("visibility") != "hidden", b, f;
            if (a && (CKEDITOR.env.webkit || CKEDITOR.env.opera)) {
                b = this.getWindow();
                if (!b.equals(CKEDITOR.document.getWindow()) && (f = b.$.frameElement))a = (new CKEDITOR.dom.element(f)).isVisible()
            }
            return!!a
        }, isEmptyInlineRemoveable: function () {
            if (!CKEDITOR.dtd.$removeEmpty[this.getName()])return false;
            for (var a = this.getChildren(),
                     b = 0, f = a.count(); b < f; b++) {
                var g = a.getItem(b);
                if (!(g.type == CKEDITOR.NODE_ELEMENT && g.data("cke-bookmark")) && (g.type == CKEDITOR.NODE_ELEMENT && !g.isEmptyInlineRemoveable() || g.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(g.getText())))return false
            }
            return true
        }, hasAttributes: CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function () {
            for (var a = this.$.attributes, b = 0; b < a.length; b++) {
                var f = a[b];
                switch (f.nodeName) {
                    case "class":
                        if (this.getAttribute("class"))return true;
                    case "data-cke-expando":
                        continue;
                    default:
                        if (f.specified)return true
                }
            }
            return false
        } : function () {
            var a = this.$.attributes, b = a.length, f = {"data-cke-expando": 1, _moz_dirty: 1};
            return b > 0 && (b > 2 || !f[a[0].nodeName] || b == 2 && !f[a[1].nodeName])
        }, hasAttribute: function () {
            function a(a) {
                a = this.$.attributes.getNamedItem(a);
                return!(!a || !a.specified)
            }

            return CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? function (b) {
                return b == "name" ? !!this.$.name : a.call(this, b)
            } : a
        }(), hide: function () {
            this.setStyle("display", "none")
        }, moveChildren: function (a, b) {
            var f = this.$, a = a.$;
            if (f != a) {
                var g;
                if (b)for (; g = f.lastChild;)a.insertBefore(f.removeChild(g), a.firstChild); else for (; g = f.firstChild;)a.appendChild(f.removeChild(g))
            }
        }, mergeSiblings: function () {
            function a(a, b, g) {
                if (b && b.type == CKEDITOR.NODE_ELEMENT) {
                    for (var e = []; b.data("cke-bookmark") || b.isEmptyInlineRemoveable();) {
                        e.push(b);
                        b = g ? b.getNext() : b.getPrevious();
                        if (!b || b.type != CKEDITOR.NODE_ELEMENT)return
                    }
                    if (a.isIdentical(b)) {
                        for (var i = g ? a.getLast() : a.getFirst(); e.length;)e.shift().move(a, !g);
                        b.moveChildren(a, !g);
                        b.remove();
                        i &&
                            i.type == CKEDITOR.NODE_ELEMENT && i.mergeSiblings()
                    }
                }
            }

            return function (b) {
                if (b === false || CKEDITOR.dtd.$removeEmpty[this.getName()] || this.is("a")) {
                    a(this, this.getNext(), true);
                    a(this, this.getPrevious())
                }
            }
        }(), show: function () {
            this.setStyles({display: "", visibility: ""})
        }, setAttribute: function () {
            var a = function (a, b) {
                this.$.setAttribute(a, b);
                return this
            };
            return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function (b, f) {
                b == "class" ? this.$.className = f : b == "style" ? this.$.style.cssText = f : b == "tabindex" ?
                    this.$.tabIndex = f : b == "checked" ? this.$.checked = f : b == "contenteditable" ? a.call(this, "contentEditable", f) : a.apply(this, arguments);
                return this
            } : CKEDITOR.env.ie8Compat && CKEDITOR.env.secure ? function (b, f) {
                if (b == "src" && f.match(/^http:\/\//))try {
                    a.apply(this, arguments)
                } catch (g) {
                } else a.apply(this, arguments);
                return this
            } : a
        }(), setAttributes: function (a) {
            for (var b in a)this.setAttribute(b, a[b]);
            return this
        }, setValue: function (a) {
            this.$.value = a;
            return this
        }, removeAttribute: function () {
            var a = function (a) {
                this.$.removeAttribute(a)
            };
            return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function (a) {
                a == "class" ? a = "className" : a == "tabindex" ? a = "tabIndex" : a == "contenteditable" && (a = "contentEditable");
                this.$.removeAttribute(a)
            } : a
        }(), removeAttributes: function (a) {
            if (CKEDITOR.tools.isArray(a))for (var b = 0; b < a.length; b++)this.removeAttribute(a[b]); else for (b in a)a.hasOwnProperty(b) && this.removeAttribute(b)
        }, removeStyle: function (a) {
            var b = this.$.style;
            if (!b.removeProperty && (a == "border" || a == "margin" || a == "padding")) {
                var f = ["top",
                    "left", "right", "bottom"], g;
                a == "border" && (g = ["color", "style", "width"]);
                for (var b = [], e = 0; e < f.length; e++)if (g)for (var i = 0; i < g.length; i++)b.push([a, f[e], g[i]].join("-")); else b.push([a, f[e]].join("-"));
                for (a = 0; a < b.length; a++)this.removeStyle(b[a])
            } else {
                b.removeProperty ? b.removeProperty(a) : b.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(a));
                this.$.style.cssText || this.removeAttribute("style")
            }
        }, setStyle: function (a, b) {
            this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)] = b;
            return this
        }, setStyles: function (a) {
            for (var b in a)this.setStyle(b,
                a[b]);
            return this
        }, setOpacity: function (a) {
            if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
                a = Math.round(a * 100);
                this.setStyle("filter", a >= 100 ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity=" + a + ")")
            } else this.setStyle("opacity", a)
        }, unselectable: function () {
            this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "none"));
            if (CKEDITOR.env.ie || CKEDITOR.env.opera) {
                this.setAttribute("unselectable", "on");
                for (var a, b = this.getElementsByTag("*"), f = 0, g = b.count(); f < g; f++) {
                    a = b.getItem(f);
                    a.setAttribute("unselectable",
                        "on")
                }
            }
        }, getPositionedAncestor: function () {
            for (var a = this; a.getName() != "html";) {
                if (a.getComputedStyle("position") != "static")return a;
                a = a.getParent()
            }
            return null
        }, getDocumentPosition: function (a) {
            var b = 0, f = 0, g = this.getDocument(), e = g.getBody(), i = g.$.compatMode == "BackCompat";
            if (document.documentElement.getBoundingClientRect) {
                var d = this.$.getBoundingClientRect(), c = g.$.documentElement, k = c.clientTop || e.$.clientTop || 0, l = c.clientLeft || e.$.clientLeft || 0, m = true;
                if (CKEDITOR.env.ie) {
                    m = g.getDocumentElement().contains(this);
                    g = g.getBody().contains(this);
                    m = i && g || !i && m
                }
                if (m) {
                    b = d.left + (!i && c.scrollLeft || e.$.scrollLeft);
                    b = b - l;
                    f = d.top + (!i && c.scrollTop || e.$.scrollTop);
                    f = f - k
                }
            } else {
                e = this;
                for (g = null; e && !(e.getName() == "body" || e.getName() == "html");) {
                    b = b + (e.$.offsetLeft - e.$.scrollLeft);
                    f = f + (e.$.offsetTop - e.$.scrollTop);
                    if (!e.equals(this)) {
                        b = b + (e.$.clientLeft || 0);
                        f = f + (e.$.clientTop || 0)
                    }
                    for (; g && !g.equals(e);) {
                        b = b - g.$.scrollLeft;
                        f = f - g.$.scrollTop;
                        g = g.getParent()
                    }
                    g = e;
                    e = (d = e.$.offsetParent) ? new CKEDITOR.dom.element(d) : null
                }
            }
            if (a) {
                e =
                    this.getWindow();
                g = a.getWindow();
                if (!e.equals(g) && e.$.frameElement) {
                    a = (new CKEDITOR.dom.element(e.$.frameElement)).getDocumentPosition(a);
                    b = b + a.x;
                    f = f + a.y
                }
            }
            if (!document.documentElement.getBoundingClientRect && CKEDITOR.env.gecko && !i) {
                b = b + (this.$.clientLeft ? 1 : 0);
                f = f + (this.$.clientTop ? 1 : 0)
            }
            return{x: b, y: f}
        }, scrollIntoView: function (a) {
            var b = this.getParent();
            if (b) {
                do {
                    (b.$.clientWidth && b.$.clientWidth < b.$.scrollWidth || b.$.clientHeight && b.$.clientHeight < b.$.scrollHeight) && !b.is("body") && this.scrollIntoParent(b,
                        a, 1);
                    if (b.is("html")) {
                        var f = b.getWindow();
                        try {
                            var g = f.$.frameElement;
                            g && (b = new CKEDITOR.dom.element(g))
                        } catch (e) {
                        }
                    }
                } while (b = b.getParent())
            }
        }, scrollIntoParent: function (a, b, f) {
            var g, e, i, d;

            function c(b, d) {
                if (/body|html/.test(a.getName()))a.getWindow().$.scrollBy(b, d); else {
                    a.$.scrollLeft = a.$.scrollLeft + b;
                    a.$.scrollTop = a.$.scrollTop + d
                }
            }

            function k(a, b) {
                var d = {x: 0, y: 0};
                if (!a.is(m ? "body" : "html")) {
                    var e = a.$.getBoundingClientRect();
                    d.x = e.left;
                    d.y = e.top
                }
                e = a.getWindow();
                if (!e.equals(b)) {
                    e = k(CKEDITOR.dom.element.get(e.$.frameElement),
                        b);
                    d.x = d.x + e.x;
                    d.y = d.y + e.y
                }
                return d
            }

            function l(a, b) {
                return parseInt(a.getComputedStyle("margin-" + b) || 0, 10) || 0
            }

            !a && (a = this.getWindow());
            i = a.getDocument();
            var m = i.$.compatMode == "BackCompat";
            a instanceof CKEDITOR.dom.window && (a = m ? i.getBody() : i.getDocumentElement());
            i = a.getWindow();
            e = k(this, i);
            var n = k(a, i), o = this.$.offsetHeight;
            g = this.$.offsetWidth;
            var s = a.$.clientHeight, r = a.$.clientWidth;
            i = e.x - l(this, "left") - n.x || 0;
            d = e.y - l(this, "top") - n.y || 0;
            g = e.x + g + l(this, "right") - (n.x + r) || 0;
            e = e.y + o + l(this, "bottom") -
                (n.y + s) || 0;
            if (d < 0 || e > 0)c(0, b === true ? d : b === false ? e : d < 0 ? d : e);
            if (f && (i < 0 || g > 0))c(i < 0 ? i : g, 0)
        }, setState: function (a, b, f) {
            b = b || "cke";
            switch (a) {
                case CKEDITOR.TRISTATE_ON:
                    this.addClass(b + "_on");
                    this.removeClass(b + "_off");
                    this.removeClass(b + "_disabled");
                    f && this.setAttribute("aria-pressed", true);
                    f && this.removeAttribute("aria-disabled");
                    break;
                case CKEDITOR.TRISTATE_DISABLED:
                    this.addClass(b + "_disabled");
                    this.removeClass(b + "_off");
                    this.removeClass(b + "_on");
                    f && this.setAttribute("aria-disabled", true);
                    f && this.removeAttribute("aria-pressed");
                    break;
                default:
                    this.addClass(b + "_off");
                    this.removeClass(b + "_on");
                    this.removeClass(b + "_disabled");
                    f && this.removeAttribute("aria-pressed");
                    f && this.removeAttribute("aria-disabled")
            }
        }, getFrameDocument: function () {
            var a = this.$;
            try {
                a.contentWindow.document
            } catch (b) {
                a.src = a.src
            }
            return a && new CKEDITOR.dom.document(a.contentWindow.document)
        }, copyAttributes: function (a, b) {
            for (var f = this.$.attributes, b = b || {}, g = 0; g < f.length; g++) {
                var e = f[g], i = e.nodeName.toLowerCase(), d;
                if (!(i in b))if (i == "checked" && (d = this.getAttribute(i)))a.setAttribute(i,
                    d); else if (e.specified || CKEDITOR.env.ie && e.nodeValue && i == "value") {
                    d = this.getAttribute(i);
                    if (d === null)d = e.nodeValue;
                    a.setAttribute(i, d)
                }
            }
            if (this.$.style.cssText !== "")a.$.style.cssText = this.$.style.cssText
        }, renameNode: function (a) {
            if (this.getName() != a) {
                var b = this.getDocument(), a = new CKEDITOR.dom.element(a, b);
                this.copyAttributes(a);
                this.moveChildren(a);
                this.getParent() && this.$.parentNode.replaceChild(a.$, this.$);
                a.$["data-cke-expando"] = this.$["data-cke-expando"];
                this.$ = a.$
            }
        }, getChild: function () {
            function a(a, b) {
                var g = a.childNodes;
                if (b >= 0 && b < g.length)return g[b]
            }

            return function (b) {
                var f = this.$;
                if (b.slice)for (; b.length > 0 && f;)f = a(f, b.shift()); else f = a(f, b);
                return f ? new CKEDITOR.dom.node(f) : null
            }
        }(), getChildCount: function () {
            return this.$.childNodes.length
        }, disableContextMenu: function () {
            this.on("contextmenu", function (a) {
                a.data.getTarget().hasClass("cke_enable_context_menu") || a.data.preventDefault()
            })
        }, getDirection: function (a) {
            return a ? this.getComputedStyle("direction") || this.getDirection() || this.getParent() &&
                this.getParent().getDirection(1) || this.getDocument().$.dir || "ltr" : this.getStyle("direction") || this.getAttribute("dir")
        }, data: function (a, b) {
            a = "data-" + a;
            if (b === void 0)return this.getAttribute(a);
            b === false ? this.removeAttribute(a) : this.setAttribute(a, b);
            return null
        }, getEditor: function () {
            var a = CKEDITOR.instances, b, f;
            for (b in a) {
                f = a[b];
                if (f.element.equals(this) && f.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO)return f
            }
            return null
        }});
        var c = {width: ["border-left-width", "border-right-width", "padding-left", "padding-right"],
            height: ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"]};
        CKEDITOR.dom.element.prototype.setSize = function (a, c, f) {
            if (typeof c == "number") {
                if (f && (!CKEDITOR.env.ie || !CKEDITOR.env.quirks))c = c - b.call(this, a);
                this.setStyle(a, c + "px")
            }
        };
        CKEDITOR.dom.element.prototype.getSize = function (a, c) {
            var f = Math.max(this.$["offset" + CKEDITOR.tools.capitalize(a)], this.$["client" + CKEDITOR.tools.capitalize(a)]) || 0;
            c && (f = f - b.call(this, a));
            return f
        }
    }(), CKEDITOR.dom.documentFragment = function (b) {
        b = b || CKEDITOR.document;
        this.$ = b.type == CKEDITOR.NODE_DOCUMENT ? b.$.createDocumentFragment() : b
    }, CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.element.prototype, {type: CKEDITOR.NODE_DOCUMENT_FRAGMENT, insertAfterNode: function (b) {
        b = b.$;
        b.parentNode.insertBefore(this.$, b.nextSibling)
    }}, !0, {append: 1, appendBogus: 1, getFirst: 1, getLast: 1, getParent: 1, getNext: 1, getPrevious: 1, appendTo: 1, moveChildren: 1, insertBefore: 1, insertAfterNode: 1, replace: 1, trim: 1, type: 1, ltrim: 1, rtrim: 1, getDocument: 1, getChildCount: 1, getChild: 1,
        getChildren: 1}), function () {
        function b(a, b) {
            var d = this.range;
            if (this._.end)return null;
            if (!this._.start) {
                this._.start = 1;
                if (d.collapsed) {
                    this.end();
                    return null
                }
                d.optimize()
            }
            var g, k = d.startContainer;
            g = d.endContainer;
            var f = d.startOffset, m = d.endOffset, c, h = this.guard, s = this.type, r = a ? "getPreviousSourceNode" : "getNextSourceNode";
            if (!a && !this._.guardLTR) {
                var p = g.type == CKEDITOR.NODE_ELEMENT ? g : g.getParent(), t = g.type == CKEDITOR.NODE_ELEMENT ? g.getChild(m) : g.getNext();
                this._.guardLTR = function (a, b) {
                    return(!b || !p.equals(a)) &&
                        (!t || !a.equals(t)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(d.root))
                }
            }
            if (a && !this._.guardRTL) {
                var x = k.type == CKEDITOR.NODE_ELEMENT ? k : k.getParent(), A = k.type == CKEDITOR.NODE_ELEMENT ? f ? k.getChild(f - 1) : null : k.getPrevious();
                this._.guardRTL = function (a, b) {
                    return(!b || !x.equals(a)) && (!A || !a.equals(A)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(d.root))
                }
            }
            var v = a ? this._.guardRTL : this._.guardLTR;
            c = h ? function (a, b) {
                return v(a, b) === false ? false : h(a, b)
            } : v;
            if (this.current)g = this.current[r](false, s, c); else {
                if (a)g.type ==
                CKEDITOR.NODE_ELEMENT && (g = m > 0 ? g.getChild(m - 1) : c(g, true) === false ? null : g.getPreviousSourceNode(true, s, c)); else {
                    g = k;
                    if (g.type == CKEDITOR.NODE_ELEMENT && !(g = g.getChild(f)))g = c(k, true) === false ? null : k.getNextSourceNode(true, s, c)
                }
                g && c(g) === false && (g = null)
            }
            for (; g && !this._.end;) {
                this.current = g;
                if (!this.evaluator || this.evaluator(g) !== false) {
                    if (!b)return g
                } else if (b && this.evaluator)return false;
                g = g[r](false, s, c)
            }
            this.end();
            return this.current = null
        }

        function c(a) {
            for (var i, d = null; i = b.call(this, a);)d = i;
            return d
        }

        CKEDITOR.dom.walker = CKEDITOR.tools.createClass({$: function (a) {
            this.range = a;
            this._ = {}
        }, proto: {end: function () {
            this._.end = 1
        }, next: function () {
            return b.call(this)
        }, previous: function () {
            return b.call(this, 1)
        }, checkForward: function () {
            return b.call(this, 0, 1) !== false
        }, checkBackward: function () {
            return b.call(this, 1, 1) !== false
        }, lastForward: function () {
            return c.call(this)
        }, lastBackward: function () {
            return c.call(this, 1)
        }, reset: function () {
            delete this.current;
            this._ = {}
        }}});
        var a = {block: 1, "list-item": 1, table: 1, "table-row-group": 1,
            "table-header-group": 1, "table-footer-group": 1, "table-row": 1, "table-column-group": 1, "table-column": 1, "table-cell": 1, "table-caption": 1};
        CKEDITOR.dom.element.prototype.isBlockBoundary = function (b) {
            b = b ? CKEDITOR.tools.extend({}, CKEDITOR.dtd.$block, b || {}) : CKEDITOR.dtd.$block;
            return this.getComputedStyle("float") == "none" && a[this.getComputedStyle("display")] || b[this.getName()]
        };
        CKEDITOR.dom.walker.blockBoundary = function (a) {
            return function (b) {
                return!(b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary(a))
            }
        };
        CKEDITOR.dom.walker.listItemBoundary =
            function () {
                return this.blockBoundary({br: 1})
            };
        CKEDITOR.dom.walker.bookmark = function (a, b) {
            function d(a) {
                return a && a.getName && a.getName() == "span" && a.data("cke-bookmark")
            }

            return function (g) {
                var k, f;
                k = g && g.type != CKEDITOR.NODE_ELEMENT && (f = g.getParent()) && d(f);
                k = a ? k : k || d(g);
                return!!(b ^ k)
            }
        };
        CKEDITOR.dom.walker.whitespaces = function (a) {
            return function (b) {
                var d;
                b && b.type == CKEDITOR.NODE_TEXT && (d = !CKEDITOR.tools.trim(b.getText()) || CKEDITOR.env.webkit && b.getText() == "​");
                return!!(a ^ d)
            }
        };
        CKEDITOR.dom.walker.invisible =
            function (a) {
                var b = CKEDITOR.dom.walker.whitespaces();
                return function (d) {
                    if (b(d))d = 1; else {
                        d.type == CKEDITOR.NODE_TEXT && (d = d.getParent());
                        d = !d.$.offsetHeight
                    }
                    return!!(a ^ d)
                }
            };
        CKEDITOR.dom.walker.nodeType = function (a, b) {
            return function (d) {
                return!!(b ^ d.type == a)
            }
        };
        CKEDITOR.dom.walker.bogus = function (a) {
            function b(a) {
                return!f(a) && !g(a)
            }

            return function (d) {
                var g = !CKEDITOR.env.ie ? d.is && d.is("br") : d.getText && h.test(d.getText());
                if (g) {
                    g = d.getParent();
                    d = d.getNext(b);
                    g = g.isBlockBoundary() && (!d || d.type == CKEDITOR.NODE_ELEMENT &&
                        d.isBlockBoundary())
                }
                return!!(a ^ g)
            }
        };
        var h = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/, f = CKEDITOR.dom.walker.whitespaces(), g = CKEDITOR.dom.walker.bookmark();
        CKEDITOR.dom.element.prototype.getBogus = function () {
            var a = this;
            do a = a.getPreviousSourceNode(); while (g(a) || f(a) || a.type == CKEDITOR.NODE_ELEMENT && a.getName()in CKEDITOR.dtd.$inline && !(a.getName()in CKEDITOR.dtd.$empty));
            return a && (!CKEDITOR.env.ie ? a.is && a.is("br") : a.getText && h.test(a.getText())) ? a : false
        }
    }(), CKEDITOR.dom.range = function (b) {
        this.endOffset = this.endContainer =
            this.startOffset = this.startContainer = null;
        this.collapsed = true;
        var c = b instanceof CKEDITOR.dom.document;
        this.document = c ? b : b.getDocument();
        this.root = c ? b.getBody() : b
    }, function () {
        function b() {
            var a = false, b = CKEDITOR.dom.walker.whitespaces(), d = CKEDITOR.dom.walker.bookmark(true), e = CKEDITOR.dom.walker.bogus();
            return function (i) {
                if (d(i) || b(i))return true;
                if (e(i) && !a)return a = true;
                return i.type == CKEDITOR.NODE_TEXT && (i.hasAscendant("pre") || CKEDITOR.tools.trim(i.getText()).length) || i.type == CKEDITOR.NODE_ELEMENT && !i.is(g) ? false : true
            }
        }

        function c(a) {
            var b = CKEDITOR.dom.walker.whitespaces(), d = CKEDITOR.dom.walker.bookmark(1);
            return function (g) {
                return d(g) || b(g) ? true : !a && e(g) || g.type == CKEDITOR.NODE_ELEMENT && g.is(CKEDITOR.dtd.$removeEmpty)
            }
        }

        function a(a) {
            return!i(a) && !d(a)
        }

        var h = function (a) {
                a.collapsed = a.startContainer && a.endContainer && a.startContainer.equals(a.endContainer) && a.startOffset == a.endOffset
            }, f = function (a, b, d, e) {
                a.optimizeBookmark();
                var g = a.startContainer, i = a.endContainer, f = a.startOffset, c = a.endOffset,
                    h, j;
                if (i.type == CKEDITOR.NODE_TEXT)i = i.split(c); else if (i.getChildCount() > 0)if (c >= i.getChildCount()) {
                    i = i.append(a.document.createText(""));
                    j = true
                } else i = i.getChild(c);
                if (g.type == CKEDITOR.NODE_TEXT) {
                    g.split(f);
                    g.equals(i) && (i = g.getNext())
                } else if (f)if (f >= g.getChildCount()) {
                    g = g.append(a.document.createText(""));
                    h = true
                } else g = g.getChild(f).getPrevious(); else {
                    g = g.append(a.document.createText(""), 1);
                    h = true
                }
                var f = g.getParents(), c = i.getParents(), A, v, w;
                for (A = 0; A < f.length; A++) {
                    v = f[A];
                    w = c[A];
                    if (!v.equals(w))break
                }
                for (var q =
                    d, u, B, z, y = A; y < f.length; y++) {
                    u = f[y];
                    q && !u.equals(g) && (B = q.append(u.clone()));
                    for (u = u.getNext(); u;) {
                        if (u.equals(c[y]) || u.equals(i))break;
                        z = u.getNext();
                        if (b == 2)q.append(u.clone(true)); else {
                            u.remove();
                            b == 1 && q.append(u)
                        }
                        u = z
                    }
                    q && (q = B)
                }
                q = d;
                for (d = A; d < c.length; d++) {
                    u = c[d];
                    b > 0 && !u.equals(i) && (B = q.append(u.clone()));
                    if (!f[d] || u.$.parentNode != f[d].$.parentNode)for (u = u.getPrevious(); u;) {
                        if (u.equals(f[d]) || u.equals(g))break;
                        z = u.getPrevious();
                        if (b == 2)q.$.insertBefore(u.$.cloneNode(true), q.$.firstChild); else {
                            u.remove();
                            b == 1 && q.$.insertBefore(u.$, q.$.firstChild)
                        }
                        u = z
                    }
                    q && (q = B)
                }
                if (b == 2) {
                    v = a.startContainer;
                    if (v.type == CKEDITOR.NODE_TEXT) {
                        v.$.data = v.$.data + v.$.nextSibling.data;
                        v.$.parentNode.removeChild(v.$.nextSibling)
                    }
                    a = a.endContainer;
                    if (a.type == CKEDITOR.NODE_TEXT && a.$.nextSibling) {
                        a.$.data = a.$.data + a.$.nextSibling.data;
                        a.$.parentNode.removeChild(a.$.nextSibling)
                    }
                } else {
                    if (v && w && (g.$.parentNode != v.$.parentNode || i.$.parentNode != w.$.parentNode)) {
                        b = w.getIndex();
                        h && w.$.parentNode == g.$.parentNode && b--;
                        if (e && v.type == CKEDITOR.NODE_ELEMENT) {
                            e =
                                CKEDITOR.dom.element.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>', a.document);
                            e.insertAfter(v);
                            v.mergeSiblings(false);
                            a.moveToBookmark({startNode: e})
                        } else a.setStart(w.getParent(), b)
                    }
                    a.collapse(true)
                }
                h && g.remove();
                j && i.$.parentNode && i.remove()
            }, g = {abbr: 1, acronym: 1, b: 1, bdo: 1, big: 1, cite: 1, code: 1, del: 1, dfn: 1, em: 1, font: 1, i: 1, ins: 1, label: 1, kbd: 1, q: 1, samp: 1, small: 1, span: 1, strike: 1, strong: 1, sub: 1, sup: 1, tt: 1, u: 1, "var": 1}, e = CKEDITOR.dom.walker.bogus(), i = new CKEDITOR.dom.walker.whitespaces,
            d = new CKEDITOR.dom.walker.bookmark, j = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/;
        CKEDITOR.dom.range.prototype = {clone: function () {
            var a = new CKEDITOR.dom.range(this.root);
            a.startContainer = this.startContainer;
            a.startOffset = this.startOffset;
            a.endContainer = this.endContainer;
            a.endOffset = this.endOffset;
            a.collapsed = this.collapsed;
            return a
        }, collapse: function (a) {
            if (a) {
                this.endContainer = this.startContainer;
                this.endOffset = this.startOffset
            } else {
                this.startContainer = this.endContainer;
                this.startOffset = this.endOffset
            }
            this.collapsed =
                true
        }, cloneContents: function () {
            var a = new CKEDITOR.dom.documentFragment(this.document);
            this.collapsed || f(this, 2, a);
            return a
        }, deleteContents: function (a) {
            this.collapsed || f(this, 0, null, a)
        }, extractContents: function (a) {
            var b = new CKEDITOR.dom.documentFragment(this.document);
            this.collapsed || f(this, 1, b, a);
            return b
        }, createBookmark: function (a) {
            var b, d, e, g, i = this.collapsed;
            b = this.document.createElement("span");
            b.data("cke-bookmark", 1);
            b.setStyle("display", "none");
            b.setHtml("&nbsp;");
            if (a) {
                e = "cke_bm_" + CKEDITOR.tools.getNextNumber();
                b.setAttribute("id", e + (i ? "C" : "S"))
            }
            if (!i) {
                d = b.clone();
                d.setHtml("&nbsp;");
                a && d.setAttribute("id", e + "E");
                g = this.clone();
                g.collapse();
                g.insertNode(d)
            }
            g = this.clone();
            g.collapse(true);
            g.insertNode(b);
            if (d) {
                this.setStartAfter(b);
                this.setEndBefore(d)
            } else this.moveToPosition(b, CKEDITOR.POSITION_AFTER_END);
            return{startNode: a ? e + (i ? "C" : "S") : b, endNode: a ? e + "E" : d, serializable: a, collapsed: i}
        }, createBookmark2: function (a) {
            var b = this.startContainer, d = this.endContainer, e = this.startOffset, g = this.endOffset, i = this.collapsed,
                f, c;
            if (!b || !d)return{start: 0, end: 0};
            if (a) {
                if (b.type == CKEDITOR.NODE_ELEMENT) {
                    if ((f = b.getChild(e)) && f.type == CKEDITOR.NODE_TEXT && e > 0 && f.getPrevious().type == CKEDITOR.NODE_TEXT) {
                        b = f;
                        e = 0
                    }
                    f && f.type == CKEDITOR.NODE_ELEMENT && (e = f.getIndex(1))
                }
                for (; b.type == CKEDITOR.NODE_TEXT && (c = b.getPrevious()) && c.type == CKEDITOR.NODE_TEXT;) {
                    b = c;
                    e = e + c.getLength()
                }
                if (!i) {
                    if (d.type == CKEDITOR.NODE_ELEMENT) {
                        if ((f = d.getChild(g)) && f.type == CKEDITOR.NODE_TEXT && g > 0 && f.getPrevious().type == CKEDITOR.NODE_TEXT) {
                            d = f;
                            g = 0
                        }
                        f && f.type == CKEDITOR.NODE_ELEMENT &&
                        (g = f.getIndex(1))
                    }
                    for (; d.type == CKEDITOR.NODE_TEXT && (c = d.getPrevious()) && c.type == CKEDITOR.NODE_TEXT;) {
                        d = c;
                        g = g + c.getLength()
                    }
                }
            }
            return{start: b.getAddress(a), end: i ? null : d.getAddress(a), startOffset: e, endOffset: g, normalized: a, collapsed: i, is2: true}
        }, moveToBookmark: function (a) {
            if (a.is2) {
                var b = this.document.getByAddress(a.start, a.normalized), d = a.startOffset, e = a.end && this.document.getByAddress(a.end, a.normalized), a = a.endOffset;
                this.setStart(b, d);
                e ? this.setEnd(e, a) : this.collapse(true)
            } else {
                b = (d = a.serializable) ?
                    this.document.getById(a.startNode) : a.startNode;
                a = d ? this.document.getById(a.endNode) : a.endNode;
                this.setStartBefore(b);
                b.remove();
                if (a) {
                    this.setEndBefore(a);
                    a.remove()
                } else this.collapse(true)
            }
        }, getBoundaryNodes: function () {
            var a = this.startContainer, b = this.endContainer, d = this.startOffset, e = this.endOffset, g;
            if (a.type == CKEDITOR.NODE_ELEMENT) {
                g = a.getChildCount();
                if (g > d)a = a.getChild(d); else if (g < 1)a = a.getPreviousSourceNode(); else {
                    for (a = a.$; a.lastChild;)a = a.lastChild;
                    a = new CKEDITOR.dom.node(a);
                    a = a.getNextSourceNode() ||
                        a
                }
            }
            if (b.type == CKEDITOR.NODE_ELEMENT) {
                g = b.getChildCount();
                if (g > e)b = b.getChild(e).getPreviousSourceNode(true); else if (g < 1)b = b.getPreviousSourceNode(); else {
                    for (b = b.$; b.lastChild;)b = b.lastChild;
                    b = new CKEDITOR.dom.node(b)
                }
            }
            a.getPosition(b) & CKEDITOR.POSITION_FOLLOWING && (a = b);
            return{startNode: a, endNode: b}
        }, getCommonAncestor: function (a, b) {
            var d = this.startContainer, e = this.endContainer, d = d.equals(e) ? a && d.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset - 1 ? d.getChild(this.startOffset) : d : d.getCommonAncestor(e);
            return b && !d.is ? d.getParent() : d
        }, optimize: function () {
            var a = this.startContainer, b = this.startOffset;
            a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setStartAfter(a) : this.setStartBefore(a));
            a = this.endContainer;
            b = this.endOffset;
            a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setEndAfter(a) : this.setEndBefore(a))
        }, optimizeBookmark: function () {
            var a = this.startContainer, b = this.endContainer;
            a.is && (a.is("span") && a.data("cke-bookmark")) && this.setStartAt(a, CKEDITOR.POSITION_BEFORE_START);
            b &&
            (b.is && b.is("span") && b.data("cke-bookmark")) && this.setEndAt(b, CKEDITOR.POSITION_AFTER_END)
        }, trim: function (a, b) {
            var d = this.startContainer, e = this.startOffset, g = this.collapsed;
            if ((!a || g) && d && d.type == CKEDITOR.NODE_TEXT) {
                if (e)if (e >= d.getLength()) {
                    e = d.getIndex() + 1;
                    d = d.getParent()
                } else {
                    var i = d.split(e), e = d.getIndex() + 1, d = d.getParent();
                    if (this.startContainer.equals(this.endContainer))this.setEnd(i, this.endOffset - this.startOffset); else if (d.equals(this.endContainer))this.endOffset = this.endOffset + 1
                } else {
                    e =
                        d.getIndex();
                    d = d.getParent()
                }
                this.setStart(d, e);
                if (g) {
                    this.collapse(true);
                    return
                }
            }
            d = this.endContainer;
            e = this.endOffset;
            if (!b && !g && d && d.type == CKEDITOR.NODE_TEXT) {
                if (e) {
                    e >= d.getLength() || d.split(e);
                    e = d.getIndex() + 1
                } else e = d.getIndex();
                d = d.getParent();
                this.setEnd(d, e)
            }
        }, enlarge: function (a, b) {
            switch (a) {
                case CKEDITOR.ENLARGE_INLINE:
                    var d = 1;
                case CKEDITOR.ENLARGE_ELEMENT:
                    if (this.collapsed)break;
                    var e = this.getCommonAncestor(), g = this.root, i, f, c, h, j, A = false, v, w;
                    v = this.startContainer;
                    w = this.startOffset;
                    if (v.type ==
                        CKEDITOR.NODE_TEXT) {
                        if (w) {
                            v = !CKEDITOR.tools.trim(v.substring(0, w)).length && v;
                            A = !!v
                        }
                        if (v && !(h = v.getPrevious()))c = v.getParent()
                    } else {
                        w && (h = v.getChild(w - 1) || v.getLast());
                        h || (c = v)
                    }
                    for (; c || h;) {
                        if (c && !h) {
                            !j && c.equals(e) && (j = true);
                            if (d ? c.isBlockBoundary() : !g.contains(c))break;
                            if (!A || c.getComputedStyle("display") != "inline") {
                                A = false;
                                j ? i = c : this.setStartBefore(c)
                            }
                            h = c.getPrevious()
                        }
                        for (; h;) {
                            v = false;
                            if (h.type == CKEDITOR.NODE_COMMENT)h = h.getPrevious(); else {
                                if (h.type == CKEDITOR.NODE_TEXT) {
                                    w = h.getText();
                                    /[^\s\ufeff]/.test(w) &&
                                    (h = null);
                                    v = /[\s\ufeff]$/.test(w)
                                } else if ((h.$.offsetWidth > 0 || b && h.is("br")) && !h.data("cke-bookmark"))if (A && CKEDITOR.dtd.$removeEmpty[h.getName()]) {
                                    w = h.getText();
                                    if (/[^\s\ufeff]/.test(w))h = null; else for (var q = h.$.getElementsByTagName("*"), u = 0, B; B = q[u++];)if (!CKEDITOR.dtd.$removeEmpty[B.nodeName.toLowerCase()]) {
                                        h = null;
                                        break
                                    }
                                    h && (v = !!w.length)
                                } else h = null;
                                v && (A ? j ? i = c : c && this.setStartBefore(c) : A = true);
                                if (h) {
                                    v = h.getPrevious();
                                    if (!c && !v) {
                                        c = h;
                                        h = null;
                                        break
                                    }
                                    h = v
                                } else c = null
                            }
                        }
                        c && (c = c.getParent())
                    }
                    v = this.endContainer;
                    w = this.endOffset;
                    c = h = null;
                    j = A = false;
                    if (v.type == CKEDITOR.NODE_TEXT) {
                        v = !CKEDITOR.tools.trim(v.substring(w)).length && v;
                        A = !(v && v.getLength());
                        if (v && !(h = v.getNext()))c = v.getParent()
                    } else(h = v.getChild(w)) || (c = v);
                    for (; c || h;) {
                        if (c && !h) {
                            !j && c.equals(e) && (j = true);
                            if (d ? c.isBlockBoundary() : !g.contains(c))break;
                            if (!A || c.getComputedStyle("display") != "inline") {
                                A = false;
                                j ? f = c : c && this.setEndAfter(c)
                            }
                            h = c.getNext()
                        }
                        for (; h;) {
                            v = false;
                            if (h.type == CKEDITOR.NODE_TEXT) {
                                w = h.getText();
                                /[^\s\ufeff]/.test(w) && (h = null);
                                v = /^[\s\ufeff]/.test(w)
                            } else if (h.type ==
                                CKEDITOR.NODE_ELEMENT) {
                                if ((h.$.offsetWidth > 0 || b && h.is("br")) && !h.data("cke-bookmark"))if (A && CKEDITOR.dtd.$removeEmpty[h.getName()]) {
                                    w = h.getText();
                                    if (/[^\s\ufeff]/.test(w))h = null; else {
                                        q = h.$.getElementsByTagName("*");
                                        for (u = 0; B = q[u++];)if (!CKEDITOR.dtd.$removeEmpty[B.nodeName.toLowerCase()]) {
                                            h = null;
                                            break
                                        }
                                    }
                                    h && (v = !!w.length)
                                } else h = null
                            } else v = 1;
                            v && A && (j ? f = c : this.setEndAfter(c));
                            if (h) {
                                v = h.getNext();
                                if (!c && !v) {
                                    c = h;
                                    h = null;
                                    break
                                }
                                h = v
                            } else c = null
                        }
                        c && (c = c.getParent())
                    }
                    if (i && f) {
                        e = i.contains(f) ? f : i;
                        this.setStartBefore(e);
                        this.setEndAfter(e)
                    }
                    break;
                case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
                case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
                    c = new CKEDITOR.dom.range(this.root);
                    g = this.root;
                    c.setStartAt(g, CKEDITOR.POSITION_AFTER_START);
                    c.setEnd(this.startContainer, this.startOffset);
                    c = new CKEDITOR.dom.walker(c);
                    var z, y, C = CKEDITOR.dom.walker.blockBoundary(a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? {br: 1} : null), D = function (a) {
                        var b = C(a);
                        b || (z = a);
                        return b
                    }, d = function (a) {
                        var b = D(a);
                        !b && (a.is && a.is("br")) && (y = a);
                        return b
                    };
                    c.guard = D;
                    c = c.lastBackward();
                    z = z || g;
                    this.setStartAt(z, !z.is("br") && (!c && this.checkStartOfBlock() || c && z.contains(c)) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END);
                    if (a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) {
                        c = this.clone();
                        c = new CKEDITOR.dom.walker(c);
                        var F = CKEDITOR.dom.walker.whitespaces(), E = CKEDITOR.dom.walker.bookmark();
                        c.evaluator = function (a) {
                            return!F(a) && !E(a)
                        };
                        if ((c = c.previous()) && c.type == CKEDITOR.NODE_ELEMENT && c.is("br"))break
                    }
                    c = this.clone();
                    c.collapse();
                    c.setEndAt(g, CKEDITOR.POSITION_BEFORE_END);
                    c = new CKEDITOR.dom.walker(c);
                    c.guard = a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? d : D;
                    z = null;
                    c = c.lastForward();
                    z = z || g;
                    this.setEndAt(z, !c && this.checkEndOfBlock() || c && z.contains(c) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START);
                    y && this.setEndAfter(y)
            }
        }, shrink: function (a, b, d) {
            if (!this.collapsed) {
                var a = a || CKEDITOR.SHRINK_TEXT, e = this.clone(), g = this.startContainer, c = this.endContainer, i = this.startOffset, f = this.endOffset, h = 1, j = 1;
                if (g && g.type == CKEDITOR.NODE_TEXT)if (i)if (i >= g.getLength())e.setStartAfter(g); else {
                    e.setStartBefore(g);
                    h = 0
                } else e.setStartBefore(g);
                if (c && c.type == CKEDITOR.NODE_TEXT)if (f)if (f >= c.getLength())e.setEndAfter(c); else {
                    e.setEndAfter(c);
                    j = 0
                } else e.setEndBefore(c);
                var e = new CKEDITOR.dom.walker(e), A = CKEDITOR.dom.walker.bookmark();
                e.evaluator = function (b) {
                    return b.type == (a == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT)
                };
                var v;
                e.guard = function (b, e) {
                    if (A(b))return true;
                    if (a == CKEDITOR.SHRINK_ELEMENT && b.type == CKEDITOR.NODE_TEXT || e && b.equals(v) || d === false && b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary())return false;
                    !e && b.type == CKEDITOR.NODE_ELEMENT && (v = b);
                    return true
                };
                if (h)(g = e[a == CKEDITOR.SHRINK_ELEMENT ? "lastForward" : "next"]()) && this.setStartAt(g, b ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START);
                if (j) {
                    e.reset();
                    (e = e[a == CKEDITOR.SHRINK_ELEMENT ? "lastBackward" : "previous"]()) && this.setEndAt(e, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END)
                }
                return!(!h && !j)
            }
        }, insertNode: function (a) {
            this.optimizeBookmark();
            this.trim(false, true);
            var b = this.startContainer, d = b.getChild(this.startOffset);
            d ? a.insertBefore(d) :
                b.append(a);
            a.getParent() && a.getParent().equals(this.endContainer) && this.endOffset++;
            this.setStartBefore(a)
        }, moveToPosition: function (a, b) {
            this.setStartAt(a, b);
            this.collapse(true)
        }, moveToRange: function (a) {
            this.setStart(a.startContainer, a.startOffset);
            this.setEnd(a.endContainer, a.endOffset)
        }, selectNodeContents: function (a) {
            this.setStart(a, 0);
            this.setEnd(a, a.type == CKEDITOR.NODE_TEXT ? a.getLength() : a.getChildCount())
        }, setStart: function (a, b) {
            if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
                b =
                    a.getIndex();
                a = a.getParent()
            }
            this.startContainer = a;
            this.startOffset = b;
            if (!this.endContainer) {
                this.endContainer = a;
                this.endOffset = b
            }
            h(this)
        }, setEnd: function (a, b) {
            if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
                b = a.getIndex() + 1;
                a = a.getParent()
            }
            this.endContainer = a;
            this.endOffset = b;
            if (!this.startContainer) {
                this.startContainer = a;
                this.startOffset = b
            }
            h(this)
        }, setStartAfter: function (a) {
            this.setStart(a.getParent(), a.getIndex() + 1)
        }, setStartBefore: function (a) {
            this.setStart(a.getParent(), a.getIndex())
        },
            setEndAfter: function (a) {
                this.setEnd(a.getParent(), a.getIndex() + 1)
            }, setEndBefore: function (a) {
                this.setEnd(a.getParent(), a.getIndex())
            }, setStartAt: function (a, b) {
                switch (b) {
                    case CKEDITOR.POSITION_AFTER_START:
                        this.setStart(a, 0);
                        break;
                    case CKEDITOR.POSITION_BEFORE_END:
                        a.type == CKEDITOR.NODE_TEXT ? this.setStart(a, a.getLength()) : this.setStart(a, a.getChildCount());
                        break;
                    case CKEDITOR.POSITION_BEFORE_START:
                        this.setStartBefore(a);
                        break;
                    case CKEDITOR.POSITION_AFTER_END:
                        this.setStartAfter(a)
                }
                h(this)
            }, setEndAt: function (a, b) {
                switch (b) {
                    case CKEDITOR.POSITION_AFTER_START:
                        this.setEnd(a, 0);
                        break;
                    case CKEDITOR.POSITION_BEFORE_END:
                        a.type == CKEDITOR.NODE_TEXT ? this.setEnd(a, a.getLength()) : this.setEnd(a, a.getChildCount());
                        break;
                    case CKEDITOR.POSITION_BEFORE_START:
                        this.setEndBefore(a);
                        break;
                    case CKEDITOR.POSITION_AFTER_END:
                        this.setEndAfter(a)
                }
                h(this)
            }, fixBlock: function (a, b) {
                var d = this.createBookmark(), e = this.document.createElement(b);
                this.collapse(a);
                this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                this.extractContents().appendTo(e);
                e.trim();
                CKEDITOR.env.ie || e.appendBogus();
                this.insertNode(e);
                this.moveToBookmark(d);
                return e
            }, splitBlock: function (a) {
                var b = new CKEDITOR.dom.elementPath(this.startContainer, this.root), d = new CKEDITOR.dom.elementPath(this.endContainer, this.root), e = b.block, g = d.block, c = null;
                if (!b.blockLimit.equals(d.blockLimit))return null;
                if (a != "br") {
                    if (!e) {
                        e = this.fixBlock(true, a);
                        g = (new CKEDITOR.dom.elementPath(this.endContainer, this.root)).block
                    }
                    g || (g = this.fixBlock(false, a))
                }
                a = e && this.checkStartOfBlock();
                b = g && this.checkEndOfBlock();
                this.deleteContents();
                if (e && e.equals(g))if (b) {
                    c = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                    this.moveToPosition(g, CKEDITOR.POSITION_AFTER_END);
                    g = null
                } else if (a) {
                    c = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                    this.moveToPosition(e, CKEDITOR.POSITION_BEFORE_START);
                    e = null
                } else {
                    g = this.splitElement(e);
                    !CKEDITOR.env.ie && !e.is("ul", "ol") && e.appendBogus()
                }
                return{previousBlock: e, nextBlock: g, wasStartOfBlock: a, wasEndOfBlock: b, elementPath: c}
            }, splitElement: function (a) {
                if (!this.collapsed)return null;
                this.setEndAt(a, CKEDITOR.POSITION_BEFORE_END);
                var b = this.extractContents(), d = a.clone(false);
                b.appendTo(d);
                d.insertAfter(a);
                this.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
                return d
            }, removeEmptyBlocksAtEnd: function () {
                function a(e) {
                    return function (a) {
                        return b(a) || (d(a) || a.type == CKEDITOR.NODE_ELEMENT && a.isEmptyInlineRemoveable()) || e.is("table") && a.is("caption") ? false : true
                    }
                }

                var b = CKEDITOR.dom.walker.whitespaces(), d = CKEDITOR.dom.walker.bookmark(false);
                return function (b) {
                    for (var d = this.createBookmark(),
                             e = this[b ? "endPath" : "startPath"](), g = e.block || e.blockLimit, c; g && !g.equals(e.root) && !g.getFirst(a(g));) {
                        c = g.getParent();
                        this[b ? "setEndAt" : "setStartAt"](g, CKEDITOR.POSITION_AFTER_END);
                        g.remove(1);
                        g = c
                    }
                    this.moveToBookmark(d)
                }
            }(), startPath: function () {
                return new CKEDITOR.dom.elementPath(this.startContainer, this.root)
            }, endPath: function () {
                return new CKEDITOR.dom.elementPath(this.endContainer, this.root)
            }, checkBoundaryOfElement: function (a, b) {
                var d = b == CKEDITOR.START, e = this.clone();
                e.collapse(d);
                e[d ? "setStartAt" :
                    "setEndAt"](a, d ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
                e = new CKEDITOR.dom.walker(e);
                e.evaluator = c(d);
                return e[d ? "checkBackward" : "checkForward"]()
            }, checkStartOfBlock: function () {
                var a = this.startContainer, d = this.startOffset;
                if (CKEDITOR.env.ie && d && a.type == CKEDITOR.NODE_TEXT) {
                    a = CKEDITOR.tools.ltrim(a.substring(0, d));
                    j.test(a) && this.trim(0, 1)
                }
                this.trim();
                a = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                d = this.clone();
                d.collapse(true);
                d.setStartAt(a.block || a.blockLimit,
                    CKEDITOR.POSITION_AFTER_START);
                a = new CKEDITOR.dom.walker(d);
                a.evaluator = b();
                return a.checkBackward()
            }, checkEndOfBlock: function () {
                var a = this.endContainer, d = this.endOffset;
                if (CKEDITOR.env.ie && a.type == CKEDITOR.NODE_TEXT) {
                    a = CKEDITOR.tools.rtrim(a.substring(d));
                    j.test(a) && this.trim(1, 0)
                }
                this.trim();
                a = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
                d = this.clone();
                d.collapse(false);
                d.setEndAt(a.block || a.blockLimit, CKEDITOR.POSITION_BEFORE_END);
                a = new CKEDITOR.dom.walker(d);
                a.evaluator = b();
                return a.checkForward()
            },
            getPreviousNode: function (a, b, d) {
                var e = this.clone();
                e.collapse(1);
                e.setStartAt(d || this.root, CKEDITOR.POSITION_AFTER_START);
                d = new CKEDITOR.dom.walker(e);
                d.evaluator = a;
                d.guard = b;
                return d.previous()
            }, getNextNode: function (a, b, d) {
                var e = this.clone();
                e.collapse();
                e.setEndAt(d || this.root, CKEDITOR.POSITION_BEFORE_END);
                d = new CKEDITOR.dom.walker(e);
                d.evaluator = a;
                d.guard = b;
                return d.next()
            }, checkReadOnly: function () {
                function a(b, d) {
                    for (; b;) {
                        if (b.type == CKEDITOR.NODE_ELEMENT) {
                            if (b.getAttribute("contentEditable") ==
                                "false" && !b.data("cke-editable"))return 0;
                            if (b.is("html") || b.getAttribute("contentEditable") == "true" && (b.contains(d) || b.equals(d)))break
                        }
                        b = b.getParent()
                    }
                    return 1
                }

                return function () {
                    var b = this.startContainer, d = this.endContainer;
                    return!(a(b, d) && a(d, b))
                }
            }(), moveToElementEditablePosition: function (b, d) {
                if (b.type == CKEDITOR.NODE_ELEMENT && !b.isEditable(false)) {
                    this.moveToPosition(b, d ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
                    return true
                }
                for (var e = 0; b;) {
                    if (b.type == CKEDITOR.NODE_TEXT) {
                        d && this.checkEndOfBlock() &&
                        j.test(b.getText()) ? this.moveToPosition(b, CKEDITOR.POSITION_BEFORE_START) : this.moveToPosition(b, d ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
                        e = 1;
                        break
                    }
                    if (b.type == CKEDITOR.NODE_ELEMENT)if (b.isEditable()) {
                        this.moveToPosition(b, d ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START);
                        e = 1
                    } else d && (b.is("br") && this.checkEndOfBlock()) && this.moveToPosition(b, CKEDITOR.POSITION_BEFORE_START);
                    var g = b, c = e, i = void 0;
                    g.type == CKEDITOR.NODE_ELEMENT && g.isEditable(false) && (i = g[d ? "getLast" : "getFirst"](a));
                    !c && !i && (i = g[d ? "getPrevious" : "getNext"](a));
                    b = i
                }
                return!!e
            }, moveToElementEditStart: function (a) {
                return this.moveToElementEditablePosition(a)
            }, moveToElementEditEnd: function (a) {
                return this.moveToElementEditablePosition(a, true)
            }, getEnclosedNode: function () {
                var a = this.clone();
                a.optimize();
                if (a.startContainer.type != CKEDITOR.NODE_ELEMENT || a.endContainer.type != CKEDITOR.NODE_ELEMENT)return null;
                var a = new CKEDITOR.dom.walker(a), b = CKEDITOR.dom.walker.bookmark(false, true), d = CKEDITOR.dom.walker.whitespaces(true);
                a.evaluator = function (a) {
                    return d(a) && b(a)
                };
                var e = a.next();
                a.reset();
                return e && e.equals(a.previous()) ? e : null
            }, getTouchedStartNode: function () {
                var a = this.startContainer;
                return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.startOffset) || a
            }, getTouchedEndNode: function () {
                var a = this.endContainer;
                return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.endOffset - 1) || a
            }, scrollIntoView: function () {
                var a = new CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", this.document),
                    b, d, e, g = this.clone();
                g.optimize();
                if (e = g.startContainer.type == CKEDITOR.NODE_TEXT) {
                    d = g.startContainer.getText();
                    b = g.startContainer.split(g.startOffset);
                    a.insertAfter(g.startContainer)
                } else g.insertNode(a);
                a.scrollIntoView();
                if (e) {
                    g.startContainer.setText(d);
                    b.remove()
                }
                a.remove()
            }}
    }(), CKEDITOR.POSITION_AFTER_START = 1, CKEDITOR.POSITION_BEFORE_END = 2, CKEDITOR.POSITION_BEFORE_START = 3, CKEDITOR.POSITION_AFTER_END = 4, CKEDITOR.ENLARGE_ELEMENT = 1, CKEDITOR.ENLARGE_BLOCK_CONTENTS = 2, CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS =
        3, CKEDITOR.ENLARGE_INLINE = 4, CKEDITOR.START = 1, CKEDITOR.END = 2, CKEDITOR.SHRINK_ELEMENT = 1, CKEDITOR.SHRINK_TEXT = 2, function () {
        function b(a) {
            if (!(arguments.length < 1)) {
                this.range = a;
                this.forceBrBreak = 0;
                this.enlargeBr = 1;
                this.enforceRealBlocks = 0;
                this._ || (this._ = {})
            }
        }

        function c(a, b, d) {
            for (a = a.getNextSourceNode(b, null, d); !h(a);)a = a.getNextSourceNode(b, null, d);
            return a
        }

        var a = /^[\r\n\t ]+$/, h = CKEDITOR.dom.walker.bookmark(false, true), f = CKEDITOR.dom.walker.whitespaces(true), g = function (a) {
            return h(a) && f(a)
        };
        b.prototype =
        {getNextParagraph: function (b) {
            b = b || "p";
            if (!CKEDITOR.dtd[this.range.root.getName()][b])return null;
            var i, d, f, k, l, m;
            if (!this._.started) {
                d = this.range.clone();
                d.shrink(CKEDITOR.NODE_ELEMENT, true);
                k = d.endContainer.hasAscendant("pre", true) || d.startContainer.hasAscendant("pre", true);
                d.enlarge(this.forceBrBreak && !k || !this.enlargeBr ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                if (!d.collapsed) {
                    k = new CKEDITOR.dom.walker(d.clone());
                    var n = CKEDITOR.dom.walker.bookmark(true, true);
                    k.evaluator =
                        n;
                    this._.nextNode = k.next();
                    k = new CKEDITOR.dom.walker(d.clone());
                    k.evaluator = n;
                    k = k.previous();
                    this._.lastNode = k.getNextSourceNode(true);
                    if (this._.lastNode && this._.lastNode.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(this._.lastNode.getText()) && this._.lastNode.getParent().isBlockBoundary()) {
                        n = this.range.clone();
                        n.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END);
                        if (n.checkEndOfBlock()) {
                            n = new CKEDITOR.dom.elementPath(n.endContainer, n.root);
                            this._.lastNode = (n.block || n.blockLimit).getNextSourceNode(true)
                        }
                    }
                    if (!this._.lastNode) {
                        this._.lastNode =
                            this._.docEndMarker = d.document.createText("");
                        this._.lastNode.insertAfter(k)
                    }
                    d = null
                }
                this._.started = 1
            }
            n = this._.nextNode;
            k = this._.lastNode;
            for (this._.nextNode = null; n;) {
                var o = 0, s = n.hasAscendant("pre"), r = n.type != CKEDITOR.NODE_ELEMENT, p = 0;
                if (r)n.type == CKEDITOR.NODE_TEXT && a.test(n.getText()) && (r = 0); else {
                    var t = n.getName();
                    if (n.isBlockBoundary(this.forceBrBreak && !s && {br: 1})) {
                        if (t == "br")r = 1; else if (!d && !n.getChildCount() && t != "hr") {
                            i = n;
                            f = n.equals(k);
                            break
                        }
                        if (d) {
                            d.setEndAt(n, CKEDITOR.POSITION_BEFORE_START);
                            if (t != "br")this._.nextNode = n
                        }
                        o = 1
                    } else {
                        if (n.getFirst()) {
                            if (!d) {
                                d = this.range.clone();
                                d.setStartAt(n, CKEDITOR.POSITION_BEFORE_START)
                            }
                            n = n.getFirst();
                            continue
                        }
                        r = 1
                    }
                }
                if (r && !d) {
                    d = this.range.clone();
                    d.setStartAt(n, CKEDITOR.POSITION_BEFORE_START)
                }
                f = (!o || r) && n.equals(k);
                if (d && !o)for (; !n.getNext(g) && !f;) {
                    t = n.getParent();
                    if (t.isBlockBoundary(this.forceBrBreak && !s && {br: 1})) {
                        o = 1;
                        r = 0;
                        f || t.equals(k);
                        d.setEndAt(t, CKEDITOR.POSITION_BEFORE_END);
                        break
                    }
                    n = t;
                    r = 1;
                    f = n.equals(k);
                    p = 1
                }
                r && d.setEndAt(n, CKEDITOR.POSITION_AFTER_END);
                n = c(n, p, k);
                if ((f = !n) || o && d)break
            }
            if (!i) {
                if (!d) {
                    this._.docEndMarker && this._.docEndMarker.remove();
                    return this._.nextNode = null
                }
                i = new CKEDITOR.dom.elementPath(d.startContainer, d.root);
                n = i.blockLimit;
                o = {div: 1, th: 1, td: 1};
                i = i.block;
                if (!i && n && !this.enforceRealBlocks && o[n.getName()] && d.checkStartOfBlock() && d.checkEndOfBlock() && !n.equals(d.root))i = n; else if (!i || this.enforceRealBlocks && i.getName() == "li") {
                    i = this.range.document.createElement(b);
                    d.extractContents().appendTo(i);
                    i.trim();
                    d.insertNode(i);
                    l = m = true
                } else if (i.getName() !=
                    "li") {
                    if (!d.checkStartOfBlock() || !d.checkEndOfBlock()) {
                        i = i.clone(false);
                        d.extractContents().appendTo(i);
                        i.trim();
                        m = d.splitBlock();
                        l = !m.wasStartOfBlock;
                        m = !m.wasEndOfBlock;
                        d.insertNode(i)
                    }
                } else if (!f)this._.nextNode = i.equals(k) ? null : c(d.getBoundaryNodes().endNode, 1, k)
            }
            if (l)(d = i.getPrevious()) && d.type == CKEDITOR.NODE_ELEMENT && (d.getName() == "br" ? d.remove() : d.getLast() && d.getLast().$.nodeName.toLowerCase() == "br" && d.getLast().remove());
            if (m)(d = i.getLast()) && d.type == CKEDITOR.NODE_ELEMENT && d.getName() == "br" &&
            (CKEDITOR.env.ie || d.getPrevious(h) || d.getNext(h)) && d.remove();
            if (!this._.nextNode)this._.nextNode = f || i.equals(k) || !k ? null : c(i, 1, k);
            return i
        }};
        CKEDITOR.dom.range.prototype.createIterator = function () {
            return new b(this)
        }
    }(), CKEDITOR.command = function (b, c) {
        this.uiItems = [];
        this.exec = function (a) {
            if (this.state == CKEDITOR.TRISTATE_DISABLED)return false;
            this.editorFocus && b.focus();
            return this.fire("exec") === false ? true : c.exec.call(this, b, a) !== false
        };
        this.refresh = function (a, b) {
            if (!this.readOnly && a.readOnly)return true;
            if (this.context && !b.isContextFor(this.context)) {
                this.disable();
                return true
            }
            this.enable();
            return this.fire("refresh", {editor: a, path: b}) === false ? true : c.refresh && c.refresh.apply(this, arguments) !== false
        };
        CKEDITOR.tools.extend(this, c, {modes: {wysiwyg: 1}, editorFocus: 1, contextSensitive: !!c.context, state: CKEDITOR.TRISTATE_OFF});
        CKEDITOR.event.call(this)
    }, CKEDITOR.command.prototype = {enable: function () {
        this.state == CKEDITOR.TRISTATE_DISABLED && this.setState(!this.preserveState || typeof this.previousState == "undefined" ?
            CKEDITOR.TRISTATE_OFF : this.previousState)
    }, disable: function () {
        this.setState(CKEDITOR.TRISTATE_DISABLED)
    }, setState: function (b) {
        if (this.state == b)return false;
        this.previousState = this.state;
        this.state = b;
        this.fire("state");
        return true
    }, toggleState: function () {
        this.state == CKEDITOR.TRISTATE_OFF ? this.setState(CKEDITOR.TRISTATE_ON) : this.state == CKEDITOR.TRISTATE_ON && this.setState(CKEDITOR.TRISTATE_OFF)
    }}, CKEDITOR.event.implementOn(CKEDITOR.command.prototype), CKEDITOR.ENTER_P = 1, CKEDITOR.ENTER_BR = 2, CKEDITOR.ENTER_DIV =
        3, CKEDITOR.config = {customConfig: "config.js", autoUpdateElement: !0, language: "", defaultLanguage: "en", contentsLangDirection: "", enterMode: CKEDITOR.ENTER_P, forceEnterMode: !1, shiftEnterMode: CKEDITOR.ENTER_BR, docType: "<!DOCTYPE html>", bodyId: "", bodyClass: "", fullPage: !1, height: 200, extraPlugins: "", removePlugins: "", protectedSource: [], tabIndex: 0, width: "", baseFloatZIndex: 1E4, blockedKeystrokes: [CKEDITOR.CTRL + 66, CKEDITOR.CTRL + 73, CKEDITOR.CTRL + 85]}, function () {
        CKEDITOR.focusManager = function (b) {
            if (b.focusManager)return b.focusManager;
            this.hasFocus = false;
            this.currentActive = null;
            this._ = {editor: b};
            return this
        };
        CKEDITOR.focusManager._ = {blurDelay: 200};
        CKEDITOR.focusManager.prototype = {focus: function () {
            this._.timer && clearTimeout(this._.timer);
            if (!this.hasFocus && !this._.locked) {
                var b = CKEDITOR.currentInstance;
                b && b.focusManager.blur(1);
                this.hasFocus = true;
                (b = this._.editor.container) && b.addClass("cke_focus");
                this._.editor.fire("focus")
            }
        }, lock: function () {
            this._.locked = 1
        }, unlock: function () {
            delete this._.locked
        }, blur: function (b) {
            function c() {
                if (this.hasFocus) {
                    this.hasFocus =
                        false;
                    var a = this._.editor.container;
                    a && a.removeClass("cke_focus");
                    this._.editor.fire("blur")
                }
            }

            if (!this._.locked) {
                this._.timer && clearTimeout(this._.timer);
                var a = CKEDITOR.focusManager._.blurDelay;
                b || !a ? c.call(this) : this._.timer = CKEDITOR.tools.setTimeout(function () {
                    delete this._.timer;
                    c.call(this)
                }, a, this)
            }
        }, add: function (b, c) {
            var a = b.getCustomData("focusmanager");
            if (!a || a != this) {
                a && a.remove(b);
                var a = "focus", h = "blur";
                if (c)if (CKEDITOR.env.ie) {
                    a = "focusin";
                    h = "focusout"
                } else CKEDITOR.event.useCapture = 1;
                var f =
                {blur: function () {
                    b.equals(this.currentActive) && this.blur()
                }, focus: function () {
                    this.currentActive = b;
                    this.focus()
                }};
                b.on(a, f.focus, this);
                b.on(h, f.blur, this);
                if (c)CKEDITOR.event.useCapture = 0;
                b.setCustomData("focusmanager", this);
                b.setCustomData("focusmanager_handlers", f)
            }
        }, remove: function (b) {
            b.removeCustomData("focusmanager");
            var c = b.removeCustomData("focusmanager_handlers");
            b.removeListener("blur", c.blur);
            b.removeListener("focus", c.focus)
        }}
    }(), CKEDITOR.keystrokeHandler = function (b) {
        if (b.keystrokeHandler)return b.keystrokeHandler;
        this.keystrokes = {};
        this.blockedKeystrokes = {};
        this._ = {editor: b};
        return this
    }, function () {
        var b, c = function (a) {
            var a = a.data, c = a.getKeystroke(), g = this.keystrokes[c], e = this._.editor;
            b = e.fire("key", {keyCode: c}) === false;
            if (!b) {
                g && (b = e.execCommand(g, {from: "keystrokeHandler"}) !== false);
                b || (b = !!this.blockedKeystrokes[c])
            }
            b && a.preventDefault(true);
            return!b
        }, a = function (a) {
            if (b) {
                b = false;
                a.data.preventDefault(true)
            }
        };
        CKEDITOR.keystrokeHandler.prototype = {attach: function (b) {
            b.on("keydown", c, this);
            if (CKEDITOR.env.opera ||
                CKEDITOR.env.gecko && CKEDITOR.env.mac)b.on("keypress", a, this)
        }}
    }(), function () {
        CKEDITOR.lang = {languages: {af: 1, ar: 1, bg: 1, bn: 1, bs: 1, ca: 1, cs: 1, cy: 1, da: 1, de: 1, el: 1, "en-au": 1, "en-ca": 1, "en-gb": 1, en: 1, eo: 1, es: 1, et: 1, eu: 1, fa: 1, fi: 1, fo: 1, "fr-ca": 1, fr: 1, gl: 1, gu: 1, he: 1, hi: 1, hr: 1, hu: 1, is: 1, it: 1, ja: 1, ka: 1, km: 1, ko: 1, ku: 1, lt: 1, lv: 1, mn: 1, ms: 1, nb: 1, nl: 1, no: 1, pl: 1, "pt-br": 1, pt: 1, ro: 1, ru: 1, sk: 1, sl: 1, "sr-latn": 1, sr: 1, sv: 1, th: 1, tr: 1, uk: 1, vi: 1, "zh-cn": 1, zh: 1}, load: function (b, c, a) {
            if (!b || !CKEDITOR.lang.languages[b])b = this.detect(c,
                b);
            this[b] ? a(b, this[b]) : CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/" + b + ".js"), function () {
                a(b, this[b])
            }, this)
        }, detect: function (b, c) {
            var a = this.languages, c = c || navigator.userLanguage || navigator.language || b, h = c.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/), f = h[1], h = h[2];
            a[f + "-" + h] ? f = f + "-" + h : a[f] || (f = null);
            CKEDITOR.lang.detect = f ? function () {
                return f
            } : function (a) {
                return a
            };
            return f || b
        }}
    }(), CKEDITOR.scriptLoader = function () {
        var b = {}, c = {};
        return{load: function (a, h, f, g) {
            var e = typeof a == "string";
            e && (a = [a]);
            f || (f = CKEDITOR);
            var i = a.length, d = [], j = [], k = function (a) {
                h && (e ? h.call(f, a) : h.call(f, d, j))
            };
            if (i === 0)k(true); else {
                var l = function (a, b) {
                    (b ? d : j).push(a);
                    if (--i <= 0) {
                        g && CKEDITOR.document.getDocumentElement().removeStyle("cursor");
                        k(b)
                    }
                }, m = function (a, d) {
                    b[a] = 1;
                    var e = c[a];
                    delete c[a];
                    for (var g = 0; g < e.length; g++)e[g](a, d)
                }, n = function (a) {
                    if (b[a])l(a, true); else {
                        var d = c[a] || (c[a] = []);
                        d.push(l);
                        if (!(d.length > 1)) {
                            var e = new CKEDITOR.dom.element("script");
                            e.setAttributes({type: "text/javascript", src: a});
                            if (h)if (CKEDITOR.env.ie)e.$.onreadystatechange =
                                function () {
                                    if (e.$.readyState == "loaded" || e.$.readyState == "complete") {
                                        e.$.onreadystatechange = null;
                                        m(a, true)
                                    }
                                }; else {
                                e.$.onload = function () {
                                    setTimeout(function () {
                                        m(a, true)
                                    }, 0)
                                };
                                e.$.onerror = function () {
                                    m(a, false)
                                }
                            }
                            e.appendTo(CKEDITOR.document.getHead())
                        }
                    }
                };
                g && CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
                for (var o = 0; o < i; o++)n(a[o])
            }
        }}
    }(), CKEDITOR.resourceManager = function (b, c) {
        this.basePath = b;
        this.fileName = c;
        this.registered = {};
        this.loaded = {};
        this.externals = {};
        this._ = {waitingList: {}}
    }, CKEDITOR.resourceManager.prototype =
    {add: function (b, c) {
        if (this.registered[b])throw'[CKEDITOR.resourceManager.add] The resource name "' + b + '" is already registered.';
        var a = this.registered[b] = c || {};
        a.name = b;
        a.path = this.getPath(b);
        CKEDITOR.fire(b + CKEDITOR.tools.capitalize(this.fileName) + "Ready", a);
        return this.get(b)
    }, get: function (b) {
        return this.registered[b] || null
    }, getPath: function (b) {
        var c = this.externals[b];
        return CKEDITOR.getUrl(c && c.dir || this.basePath + b + "/")
    }, getFilePath: function (b) {
        var c = this.externals[b];
        return CKEDITOR.getUrl(this.getPath(b) +
            (c && typeof c.file == "string" ? c.file : this.fileName + ".js"))
    }, addExternal: function (b, c, a) {
        for (var b = b.split(","), h = 0; h < b.length; h++)this.externals[b[h]] = {dir: c, file: a}
    }, load: function (b, c, a) {
        CKEDITOR.tools.isArray(b) || (b = b ? [b] : []);
        for (var h = this.loaded, f = this.registered, g = [], e = {}, i = {}, d = 0; d < b.length; d++) {
            var j = b[d];
            if (j)if (!h[j] && !f[j]) {
                var k = this.getFilePath(j);
                g.push(k);
                k in e || (e[k] = []);
                e[k].push(j)
            } else i[j] = this.get(j)
        }
        CKEDITOR.scriptLoader.load(g, function (b, d) {
            if (d.length)throw'[CKEDITOR.resourceManager.load] Resource name "' +
                e[d[0]].join(",") + '" was not found at "' + d[0] + '".';
            for (var g = 0; g < b.length; g++)for (var f = e[b[g]], j = 0; j < f.length; j++) {
                var k = f[j];
                i[k] = this.get(k);
                h[k] = 1
            }
            c.call(a, i)
        }, this)
    }}, CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin"), CKEDITOR.plugins.load = CKEDITOR.tools.override(CKEDITOR.plugins.load, function (b) {
        var c = {};
        return function (a, h, f) {
            var g = {}, e = function (a) {
                b.call(this, a, function (a) {
                    CKEDITOR.tools.extend(g, a);
                    var b = [], i;
                    for (i in a) {
                        var l = a[i], m = l && l.requires;
                        if (!c[i]) {
                            if (l.icons)for (var n =
                                l.icons.split(","), o = 0; o < n.length; o++)CKEDITOR.skin.addIcon(n[o], l.path + "icons/" + n[o] + ".png");
                            c[i] = 1
                        }
                        if (m) {
                            m.split && (m = m.split(","));
                            for (l = 0; l < m.length; l++)g[m[l]] || b.push(m[l])
                        }
                    }
                    if (b.length)e.call(this, b); else {
                        for (i in g) {
                            l = g[i];
                            if (l.onLoad && !l.onLoad._called) {
                                l.onLoad() === false && delete g[i];
                                l.onLoad._called = 1
                            }
                        }
                        h && h.call(f || window, g)
                    }
                }, this)
            };
            e.call(this, a)
        }
    }), CKEDITOR.plugins.setLang = function (b, c, a) {
        var h = this.get(b), b = h.langEntries || (h.langEntries = {}), h = h.lang || (h.lang = []);
        h.split && (h = h.split(","));
        CKEDITOR.tools.indexOf(h, c) == -1 && h.push(c);
        b[c] = a
    }, CKEDITOR.ui = function (b) {
        if (b.ui)return b.ui;
        this.items = {};
        this.instances = {};
        this.editor = b;
        this._ = {handlers: {}};
        return this
    }, CKEDITOR.ui.prototype = {add: function (b, c, a) {
        a.name = b.toLowerCase();
        var h = this.items[b] = {type: c, command: a.command || null, args: Array.prototype.slice.call(arguments, 2)};
        CKEDITOR.tools.extend(h, a)
    }, get: function (b) {
        return this.instances[b]
    }, create: function (b) {
        var c = this.items[b], a = c && this._.handlers[c.type], h = c && c.command && this.editor.getCommand(c.command),
            a = a && a.create.apply(this, c.args);
        this.instances[b] = a;
        h && h.uiItems.push(a);
        if (a && !a.type)a.type = c.type;
        return a
    }, addHandler: function (b, c) {
        this._.handlers[b] = c
    }, space: function (b) {
        return CKEDITOR.document.getById(this.spaceId(b))
    }, spaceId: function (b) {
        return this.editor.id + "_" + b
    }}, CKEDITOR.event.implementOn(CKEDITOR.ui), function () {
        function b(b, d, e) {
            CKEDITOR.event.call(this);
            b = b && CKEDITOR.tools.clone(b);
            if (d !== void 0) {
                if (d instanceof CKEDITOR.dom.element) {
                    if (!e)throw Error("One of the element mode must be specified.");
                } else throw Error("Expect element of type CKEDITOR.dom.element.");
                if (CKEDITOR.env.ie && CKEDITOR.env.quirks && e == CKEDITOR.ELEMENT_MODE_INLINE)throw Error("Inline element mode is not supported on IE quirks.");
                if (e == CKEDITOR.ELEMENT_MODE_INLINE && !d.is(CKEDITOR.dtd.$editable) || e == CKEDITOR.ELEMENT_MODE_REPLACE && d.is(CKEDITOR.dtd.$nonBodyContent))throw Error('The specified element mode is not supported on element: "' + d.getName() + '".');
                this.element = d;
                this.elementMode = e;
                this.name = this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO &&
                    (d.getId() || d.getNameAtt())
            } else this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
            this._ = {};
            this.commands = {};
            this.templates = {};
            this.name = this.name || c();
            this.id = CKEDITOR.tools.getNextId();
            this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config);
            this.ui = new CKEDITOR.ui(this);
            this.focusManager = new CKEDITOR.focusManager(this);
            this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this);
            this.on("mode", a);
            this.on("readOnly", a);
            this.on("selectionChange", h);
            this.on("instanceReady", function () {
                this.config.startupFocus &&
                this.focus()
            });
            CKEDITOR.fire("instanceCreated", null, this);
            CKEDITOR.add(this);
            CKEDITOR.tools.setTimeout(function () {
                g(this, b)
            }, 0, this)
        }

        function c() {
            do var a = "editor" + ++k; while (CKEDITOR.instances[a]);
            return a
        }

        function a() {
            var a, b = this.commands, d = this.mode;
            if (d)for (var e in b) {
                a = b[e];
                a[a.startDisabled ? "disable" : this.readOnly && !a.readOnly ? "disable" : a.modes[d] ? "enable" : "disable"]()
            }
        }

        function h(a) {
            var b = this.commands, d = a.editor, e = a.data.path, g;
            for (g in b) {
                a = b[g];
                a.contextSensitive && a.refresh(d, e)
            }
        }

        function f(a) {
            var b =
                a.config.customConfig;
            if (!b)return false;
            var b = CKEDITOR.getUrl(b), d = l[b] || (l[b] = {});
            if (d.fn) {
                d.fn.call(a, a.config);
                (CKEDITOR.getUrl(a.config.customConfig) == b || !f(a)) && a.fireOnce("customConfigLoaded")
            } else CKEDITOR.scriptLoader.load(b, function () {
                d.fn = CKEDITOR.editorConfig ? CKEDITOR.editorConfig : function () {
                };
                f(a)
            });
            return true
        }

        function g(a, b) {
            a.on("customConfigLoaded", function () {
                if (b) {
                    if (b.on)for (var d in b.on)a.on(d, b.on[d]);
                    CKEDITOR.tools.extend(a.config, b, true);
                    delete a.config.on
                }
                a.readOnly = !(!a.config.readOnly && !(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.isReadOnly() : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && a.element.getAttribute("disabled")));
                a.blockless = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && !CKEDITOR.dtd[a.element.getName()].p;
                a.tabIndex = a.config.tabIndex || a.element && a.element.getAttribute("tabindex") || 0;
                if (a.config.skin)CKEDITOR.skinName = a.config.skin;
                a.fireOnce("configLoaded");
                a.dataProcessor = new CKEDITOR.htmlDataProcessor(a);
                e(a)
            });
            if (b && b.customConfig != void 0)a.config.customConfig =
                b.customConfig;
            f(a) || a.fireOnce("customConfigLoaded")
        }

        function e(a) {
            CKEDITOR.skin.loadPart("editor", function () {
                i(a)
            })
        }

        function i(a) {
            CKEDITOR.lang.load(a.config.language, a.config.defaultLanguage, function (b, e) {
                a.langCode = b;
                a.lang = CKEDITOR.tools.prototypedCopy(e);
                if (CKEDITOR.env.gecko && CKEDITOR.env.version < 10900 && a.lang.dir == "rtl")a.lang.dir = "ltr";
                if (!a.config.contentsLangDirection)a.config.contentsLangDirection = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.getDirection(1) : a.lang.dir;
                a.fire("langLoaded");
                d(a)
            })
        }

        function d(a) {
            var b = a.config, d = b.plugins, e = b.extraPlugins, g = b.removePlugins;
            if (e)var c = RegExp("(?:^|,)(?:" + e.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"), d = d.replace(c, ""), d = d + ("," + e);
            if (g)var i = RegExp("(?:^|,)(?:" + g.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"), d = d.replace(i, "");
            CKEDITOR.env.air && (d = d + ",adobeair");
            CKEDITOR.plugins.load(d.split(","), function (d) {
                var e = [], g = [], c = [];
                a.plugins = d;
                for (var f in d) {
                    var h = d[f], j = h.lang, l = null, o = h.requires, k;
                    CKEDITOR.tools.isArray(o) && (o = o.join(","));
                    if (o && (k =
                        o.match(i)))for (; o = k.pop();)CKEDITOR.tools.setTimeout(function (a, b) {
                        throw Error('Plugin "' + a.replace(",", "") + '" cannot be removed from the plugins list, because it\'s required by "' + b + '" plugin.');
                    }, 0, null, [o, f]);
                    if (j && !a.lang[f]) {
                        j.split && (j = j.split(","));
                        if (CKEDITOR.tools.indexOf(j, a.langCode) >= 0)l = a.langCode; else {
                            l = a.langCode.replace(/-.*/, "");
                            l = l != a.langCode && CKEDITOR.tools.indexOf(j, l) >= 0 ? l : CKEDITOR.tools.indexOf(j, "en") >= 0 ? "en" : j[0]
                        }
                        if (!h.langEntries || !h.langEntries[l])c.push(CKEDITOR.getUrl(h.path +
                            "lang/" + l + ".js")); else {
                            a.lang[f] = h.langEntries[l];
                            l = null
                        }
                    }
                    g.push(l);
                    e.push(h)
                }
                CKEDITOR.scriptLoader.load(c, function () {
                    for (var d = ["beforeInit", "init", "afterInit"], c = 0; c < d.length; c++)for (var i = 0; i < e.length; i++) {
                        var f = e[i];
                        c === 0 && (g[i] && f.lang && f.langEntries) && (a.lang[f.name] = f.langEntries[g[i]]);
                        if (f[d[c]])f[d[c]](a)
                    }
                    a.fireOnce("pluginsLoaded");
                    b.keystrokes && a.setKeystroke(a.config.keystrokes);
                    for (i = 0; i < a.config.blockedKeystrokes.length; i++)a.keystrokeHandler.blockedKeystrokes[a.config.blockedKeystrokes[i]] =
                        1;
                    a.fireOnce("loaded");
                    CKEDITOR.fire("instanceLoaded", null, a)
                })
            })
        }

        function j() {
            var a = this.element;
            if (a && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
                var b = this.getData();
                this.config.htmlEncodeOutput && (b = CKEDITOR.tools.htmlEncode(b));
                a.is("textarea") ? a.setValue(b) : a.setHtml(b);
                return true
            }
            return false
        }

        b.prototype = CKEDITOR.editor.prototype;
        CKEDITOR.editor = b;
        var k = 0, l = {};
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {addCommand: function (a, b) {
            return this.commands[a] = new CKEDITOR.command(this, b)
        },
            destroy: function (a) {
                this.fire("beforeDestroy");
                !a && j.call(this);
                this.editable(null);
                this.fire("destroy");
                this.removeAllListeners();
                CKEDITOR.remove(this);
                CKEDITOR.fire("instanceDestroyed", null, this)
            }, elementPath: function (a) {
                return(a = a || this.getSelection().getStartElement()) ? new CKEDITOR.dom.elementPath(a, this.editable()) : null
            }, createRange: function () {
                var a = this.editable();
                return a ? new CKEDITOR.dom.range(a) : null
            }, execCommand: function (a, b) {
                var d = this.getCommand(a), e = {name: a, commandData: b, command: d};
                if (d &&
                    d.state != CKEDITOR.TRISTATE_DISABLED && this.fire("beforeCommandExec", e) !== true) {
                    e.returnValue = d.exec(e.commandData);
                    if (!d.async && this.fire("afterCommandExec", e) !== true)return e.returnValue
                }
                return false
            }, getCommand: function (a) {
                return this.commands[a]
            }, getData: function (a) {
                !a && this.fire("beforeGetData");
                var b = this._.data;
                if (typeof b != "string")b = (b = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? b.is("textarea") ? b.getValue() : b.getHtml() : "";
                b = {dataValue: b};
                !a && this.fire("getData", b);
                return b.dataValue
            },
            getSnapshot: function () {
                var a = this.fire("getSnapshot");
                if (typeof a != "string") {
                    var b = this.element;
                    b && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && (a = b.is("textarea") ? b.getValue() : b.getHtml())
                }
                return a
            }, loadSnapshot: function (a) {
                this.fire("loadSnapshot", a)
            }, setData: function (a, b, d) {
                if (b)this.on("dataReady", function (a) {
                    a.removeListener();
                    b.call(a.editor)
                });
                a = {dataValue: a};
                !d && this.fire("setData", a);
                this._.data = a.dataValue;
                !d && this.fire("afterSetData", a)
            }, setReadOnly: function (a) {
                a = a == void 0 || a;
                if (this.readOnly !=
                    a) {
                    this.readOnly = a;
                    this.editable().setReadOnly(a);
                    this.fire("readOnly")
                }
            }, insertHtml: function (a, b) {
                this.fire("insertHtml", {dataValue: a, mode: b})
            }, insertText: function (a) {
                this.fire("insertText", a)
            }, insertElement: function (a) {
                this.fire("insertElement", a)
            }, focus: function () {
                this.fire("beforeFocus")
            }, checkDirty: function () {
                return this._.previousValue !== this.getSnapshot()
            }, resetDirty: function () {
                this._.previousValue = this.getSnapshot()
            }, updateElement: function () {
                return j.call(this)
            }, setKeystroke: function () {
                for (var a =
                    this.keystrokeHandler.keystrokes, b = CKEDITOR.tools.isArray(arguments[0]) ? arguments[0] : [[].slice.call(arguments, 0)], d, e, g = b.length; g--;) {
                    d = b[g];
                    e = 0;
                    if (CKEDITOR.tools.isArray(d)) {
                        e = d[1];
                        d = d[0]
                    }
                    e ? a[d] = e : delete a[d]
                }
            }})
    }(), CKEDITOR.ELEMENT_MODE_NONE = 0, CKEDITOR.ELEMENT_MODE_REPLACE = 1, CKEDITOR.ELEMENT_MODE_APPENDTO = 2, CKEDITOR.ELEMENT_MODE_INLINE = 3, CKEDITOR.htmlParser = function () {
        this._ = {htmlPartsRegex: RegExp("<(?:(?:\\/([^>]+)>)|(?:!--([\\S|\\s]*?)--\>)|(?:([^\\s>]+)\\s*((?:(?:\"[^\"]*\")|(?:'[^']*')|[^\"'>])*)\\/?>))",
            "g")}
    }, function () {
        var b = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g, c = {checked: 1, compact: 1, declare: 1, defer: 1, disabled: 1, ismap: 1, multiple: 1, nohref: 1, noresize: 1, noshade: 1, nowrap: 1, readonly: 1, selected: 1};
        CKEDITOR.htmlParser.prototype = {onTagOpen: function () {
        }, onTagClose: function () {
        }, onText: function () {
        }, onCDATA: function () {
        }, onComment: function () {
        }, parse: function (a) {
            for (var h, f, g = 0, e; h = this._.htmlPartsRegex.exec(a);) {
                f = h.index;
                if (f > g) {
                    g = a.substring(g, f);
                    if (e)e.push(g);
                    else this.onText(g)
                }
                g = this._.htmlPartsRegex.lastIndex;
                if (f = h[1]) {
                    f = f.toLowerCase();
                    if (e && CKEDITOR.dtd.$cdata[f]) {
                        this.onCDATA(e.join(""));
                        e = null
                    }
                    if (!e) {
                        this.onTagClose(f);
                        continue
                    }
                }
                if (e)e.push(h[0]); else if (f = h[3]) {
                    f = f.toLowerCase();
                    if (!/="/.test(f)) {
                        var i = {}, d;
                        h = h[4];
                        var j = !!(h && h.charAt(h.length - 1) == "/");
                        if (h)for (; d = b.exec(h);) {
                            var k = d[1].toLowerCase();
                            d = d[2] || d[3] || d[4] || "";
                            i[k] = !d && c[k] ? k : d
                        }
                        this.onTagOpen(f, i, j);
                        !e && CKEDITOR.dtd.$cdata[f] && (e = [])
                    }
                } else if (f = h[2])this.onComment(f)
            }
            if (a.length >
                g)this.onText(a.substring(g, a.length))
        }}
    }(), CKEDITOR.htmlParser.basicWriter = CKEDITOR.tools.createClass({$: function () {
        this._ = {output: []}
    }, proto: {openTag: function (b) {
        this._.output.push("<", b)
    }, openTagClose: function (b, c) {
        c ? this._.output.push(" />") : this._.output.push(">")
    }, attribute: function (b, c) {
        typeof c == "string" && (c = CKEDITOR.tools.htmlEncodeAttr(c));
        this._.output.push(" ", b, '="', c, '"')
    }, closeTag: function (b) {
        this._.output.push("</", b, ">")
    }, text: function (b) {
        this._.output.push(b)
    }, comment: function (b) {
        this._.output.push("<\!--",
            b, "--\>")
    }, write: function (b) {
        this._.output.push(b)
    }, reset: function () {
        this._.output = [];
        this._.indent = false
    }, getHtml: function (b) {
        var c = this._.output.join("");
        b && this.reset();
        return c
    }}}), CKEDITOR.htmlParser.comment = function (b) {
        this.value = b;
        this._ = {isBlockLike: false}
    }, CKEDITOR.htmlParser.comment.prototype = {type: CKEDITOR.NODE_COMMENT, writeHtml: function (b, c) {
        var a = this.value;
        if (c) {
            if (!(a = c.onComment(a, this)))return;
            if (typeof a != "string") {
                a.parent = this.parent;
                a.writeHtml(b, c);
                return
            }
        }
        b.comment(a)
    }}, function () {
        CKEDITOR.htmlParser.text =
            function (b) {
                this.value = b;
                this._ = {isBlockLike: false}
            };
        CKEDITOR.htmlParser.text.prototype = {type: CKEDITOR.NODE_TEXT, writeHtml: function (b, c) {
            var a = this.value;
            (!c || (a = c.onText(a, this))) && b.text(a)
        }}
    }(), function () {
        CKEDITOR.htmlParser.cdata = function (b) {
            this.value = b
        };
        CKEDITOR.htmlParser.cdata.prototype = {type: CKEDITOR.NODE_TEXT, writeHtml: function (b) {
            b.write(this.value)
        }}
    }(), CKEDITOR.htmlParser.fragment = function () {
        this.children = [];
        this.parent = null;
        this._ = {isBlockLike: true, hasInlineStarted: false}
    }, function () {
        function b(a) {
            return a.name ==
                "a" && a.attributes.href || CKEDITOR.dtd.$removeEmpty[a.name]
        }

        var c = CKEDITOR.tools.extend({table: 1, ul: 1, ol: 1, dl: 1}, CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl), a = {ol: 1, ul: 1}, h = CKEDITOR.tools.extend({}, {html: 1}, CKEDITOR.dtd.html, CKEDITOR.dtd.body, CKEDITOR.dtd.head, {style: 1, script: 1});
        CKEDITOR.htmlParser.fragment.fromHtml = function (f, g, e) {
            function i(a) {
                var b;
                if (s.length > 0)for (var e = 0; e < s.length; e++) {
                    var g = s[e], c = g.name, i = CKEDITOR.dtd[c], f = p.name && CKEDITOR.dtd[p.name];
                    if ((!f || f[c]) &&
                        (!a || !i || i[a] || !CKEDITOR.dtd[a])) {
                        if (!b) {
                            d();
                            b = 1
                        }
                        g = g.clone();
                        g.parent = p;
                        p = g;
                        s.splice(e, 1);
                        e--
                    } else if (c == p.name) {
                        k(p, p.parent, 1);
                        e--
                    }
                }
            }

            function d() {
                for (; r.length;)k(r.shift(), p)
            }

            function j(a) {
                if (a._.isBlockLike && a.name != "pre" && a.name != "textarea") {
                    var b = a.children.length, d = a.children[b - 1], e;
                    if (d && d.type == CKEDITOR.NODE_TEXT)(e = CKEDITOR.tools.rtrim(d.value)) ? d.value = e : a.children.length = b - 1
                }
            }

            function k(a, d, g) {
                var d = d || p || o, c = p;
                if (a.previous === void 0) {
                    if (l(d, a)) {
                        p = d;
                        n.onTagOpen(e, {});
                        a.returnPoint = d = p
                    }
                    j(a);
                    (!b(a) || a.children.length) && d.add(a);
                    a.name == "pre" && (x = false);
                    a.name == "textarea" && (t = false)
                }
                if (a.returnPoint) {
                    p = a.returnPoint;
                    delete a.returnPoint
                } else p = g ? d : c
            }

            function l(a, b) {
                if ((a == o || a.name == "body") && e && (!a.name || CKEDITOR.dtd[a.name][e])) {
                    var d, g;
                    return(d = b.attributes && (g = b.attributes["data-cke-real-element-type"]) ? g : b.name) && d in CKEDITOR.dtd.$inline && !(d in CKEDITOR.dtd.head) && !b.isOrphan || b.type == CKEDITOR.NODE_TEXT
                }
            }

            function m(a, b) {
                return a in CKEDITOR.dtd.$listItem || a in CKEDITOR.dtd.$tableContent ?
                    a == b || a == "dt" && b == "dd" || a == "dd" && b == "dt" : false
            }

            var n = new CKEDITOR.htmlParser, o = g instanceof CKEDITOR.htmlParser.element ? g : typeof g == "string" ? new CKEDITOR.htmlParser.element(g) : new CKEDITOR.htmlParser.fragment, s = [], r = [], p = o, t = o.name == "textarea", x = o.name == "pre";
            n.onTagOpen = function (e, g, f, j) {
                g = new CKEDITOR.htmlParser.element(e, g);
                if (g.isUnknown && f)g.isEmpty = true;
                g.isOptionalClose = j;
                if (b(g))s.push(g); else {
                    if (e == "pre")x = true; else {
                        if (e == "br" && x) {
                            p.add(new CKEDITOR.htmlParser.text("\n"));
                            return
                        }
                        e == "textarea" &&
                        (t = true)
                    }
                    if (e == "br")r.push(g); else {
                        for (; ;) {
                            j = (f = p.name) ? CKEDITOR.dtd[f] || (p._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : h;
                            if (!g.isUnknown && !p.isUnknown && !j[e])if (p.isOptionalClose)n.onTagClose(f); else if (e in a && f in a) {
                                f = p.children;
                                (f = f[f.length - 1]) && f.name == "li" || k(f = new CKEDITOR.htmlParser.element("li"), p);
                                !g.returnPoint && (g.returnPoint = p);
                                p = f
                            } else if (e in CKEDITOR.dtd.$listItem && !m(e, f))n.onTagOpen(e == "li" ? "ul" : "dl", {}, 0, 1); else if (f in c && !m(e, f)) {
                                !g.returnPoint && (g.returnPoint = p);
                                p = p.parent
                            } else {
                                f in
                                CKEDITOR.dtd.$inline && s.unshift(p);
                                if (p.parent)k(p, p.parent, 1); else {
                                    g.isOrphan = 1;
                                    break
                                }
                            } else break
                        }
                        i(e);
                        d();
                        g.parent = p;
                        g.isEmpty ? k(g) : p = g
                    }
                }
            };
            n.onTagClose = function (a) {
                for (var b = s.length - 1; b >= 0; b--)if (a == s[b].name) {
                    s.splice(b, 1);
                    return
                }
                for (var g = [], c = [], i = p; i != o && i.name != a;) {
                    i._.isBlockLike || c.unshift(i);
                    g.push(i);
                    i = i.returnPoint || i.parent
                }
                if (i != o) {
                    for (b = 0; b < g.length; b++) {
                        var f = g[b];
                        k(f, f.parent)
                    }
                    p = i;
                    i._.isBlockLike && d();
                    k(i, i.parent);
                    if (i == p)p = p.parent;
                    s = s.concat(c)
                }
                a == "body" && (e = false)
            };
            n.onText =
                function (b) {
                    if ((!p._.hasInlineStarted || r.length) && !x && !t) {
                        b = CKEDITOR.tools.ltrim(b);
                        if (b.length === 0)return
                    }
                    var g = p.name, f = g ? CKEDITOR.dtd[g] || (p._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : h;
                    if (!t && !f["#"] && g in c) {
                        n.onTagOpen(g in a ? "li" : g == "dl" ? "dd" : g == "table" ? "tr" : g == "tr" ? "td" : "");
                        n.onText(b)
                    } else {
                        d();
                        i();
                        !x && !t && (b = b.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " "));
                        b = new CKEDITOR.htmlParser.text(b);
                        if (l(p, b))this.onTagOpen(e, {}, 0, 1);
                        p.add(b)
                    }
                };
            n.onCDATA = function (a) {
                p.add(new CKEDITOR.htmlParser.cdata(a))
            };
            n.onComment = function (a) {
                d();
                i();
                p.add(new CKEDITOR.htmlParser.comment(a))
            };
            n.parse(f);
            for (d(!CKEDITOR.env.ie && 1); p != o;)k(p, p.parent, 1);
            j(o);
            return o
        };
        CKEDITOR.htmlParser.fragment.prototype = {type: CKEDITOR.NODE_DOCUMENT_FRAGMENT, add: function (a, b) {
            isNaN(b) && (b = this.children.length);
            var e = b > 0 ? this.children[b - 1] : null;
            if (e) {
                if (a._.isBlockLike && e.type == CKEDITOR.NODE_TEXT) {
                    e.value = CKEDITOR.tools.rtrim(e.value);
                    if (e.value.length === 0) {
                        this.children.pop();
                        this.add(a);
                        return
                    }
                }
                e.next = a
            }
            a.previous = e;
            a.parent = this;
            this.children.splice(b, 0, a);
            if (!this._.hasInlineStarted)this._.hasInlineStarted = a.type == CKEDITOR.NODE_TEXT || a.type == CKEDITOR.NODE_ELEMENT && !a._.isBlockLike
        }, writeHtml: function (a, b) {
            var e;
            this.filterChildren = function () {
                var a = new CKEDITOR.htmlParser.basicWriter;
                this.writeChildrenHtml.call(this, a, b);
                a = a.getHtml();
                this.children = (new CKEDITOR.htmlParser.fragment.fromHtml(a)).children;
                e = 1
            };
            b && b.onRoot(this);
            this.writeChildrenHtml(a, e ? null : b)
        }, writeChildrenHtml: function (a, b, e) {
            if (e && !this.parent && b)b.onRoot(this);
            for (e = 0; e < this.children.length; e++)this.children[e].writeHtml(a, b)
        }}
    }(),function () {
        function b(a, b) {
            for (var c = 0; a && c < b.length; c++)var d = b[c], a = a.replace(d[0], d[1]);
            return a
        }

        function c(a, b, c) {
            typeof b == "function" && (b = [b]);
            var d, f;
            f = a.length;
            var h = b && b.length;
            if (h) {
                for (d = 0; d < f && a[d].pri < c; d++);
                for (f = h - 1; f >= 0; f--)if (h = b[f]) {
                    h.pri = c;
                    a.splice(d, 0, h)
                }
            }
        }

        function a(a, b, c) {
            if (b)for (var d in b) {
                var f = a[d];
                a[d] = h(f, b[d], c);
                f || a.$length++
            }
        }

        function h(a, b, i) {
            if (b) {
                b.pri = i;
                if (a) {
                    if (a.splice)c(a, b, i); else {
                        a = a.pri >
                            i ? [b, a] : [a, b];
                        a.filter = f
                    }
                    return a
                }
                return b.filter = b
            }
        }

        function f(a) {
            for (var b = a.type || a instanceof CKEDITOR.htmlParser.fragment, c = 0; c < this.length; c++) {
                if (b)var d = a.type, f = a.name;
                var h = this[c].apply(window, arguments);
                if (h === false)return h;
                if (b) {
                    if (h && (h.name != f || h.type != d))return h
                } else if (typeof h != "string")return h;
                h != void 0 && (a = h)
            }
            return a
        }

        CKEDITOR.htmlParser.filter = CKEDITOR.tools.createClass({$: function (a) {
            this._ = {elementNames: [], attributeNames: [], elements: {$length: 0}, attributes: {$length: 0}};
            a &&
            this.addRules(a, 10)
        }, proto: {addRules: function (b, e) {
            typeof e != "number" && (e = 10);
            c(this._.elementNames, b.elementNames, e);
            c(this._.attributeNames, b.attributeNames, e);
            a(this._.elements, b.elements, e);
            a(this._.attributes, b.attributes, e);
            this._.text = h(this._.text, b.text, e) || this._.text;
            this._.comment = h(this._.comment, b.comment, e) || this._.comment;
            this._.root = h(this._.root, b.root, e) || this._.root
        }, onElementName: function (a) {
            return b(a, this._.elementNames)
        }, onAttributeName: function (a) {
            return b(a, this._.attributeNames)
        },
            onText: function (a) {
                var b = this._.text;
                return b ? b.filter(a) : a
            }, onComment: function (a, b) {
                var c = this._.comment;
                return c ? c.filter(a, b) : a
            }, onRoot: function (a) {
                var b = this._.root;
                return b ? b.filter(a) : a
            }, onElement: function (a) {
                for (var b = [this._.elements["^"], this._.elements[a.name], this._.elements.$], c, d = 0; d < 3; d++)if (c = b[d]) {
                    c = c.filter(a, this);
                    if (c === false)return null;
                    if (c && c != a)return this.onNode(c);
                    if (a.parent && !a.name)break
                }
                return a
            }, onNode: function (a) {
                var b = a.type;
                return b == CKEDITOR.NODE_ELEMENT ? this.onElement(a) :
                        b == CKEDITOR.NODE_TEXT ? new CKEDITOR.htmlParser.text(this.onText(a.value)) : b == CKEDITOR.NODE_COMMENT ? new CKEDITOR.htmlParser.comment(this.onComment(a.value)) : null
            }, onAttribute: function (a, b, c) {
                if (b = this._.attributes[b]) {
                    a = b.filter(c, a, this);
                    if (a === false)return false;
                    if (typeof a != "undefined")return a
                }
                return c
            }}})
    }(),function () {
        function b(b, c) {
            function j(a) {
                return a || CKEDITOR.env.ie ? new CKEDITOR.htmlParser.text(" ") : new CKEDITOR.htmlParser.element("br", {"data-cke-bogus": 1})
            }

            function l(b, e) {
                return function (c) {
                    if (c.type !=
                        CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                        var f = [], i = a(c), l, m;
                        if (i)for (o(i, 1) && f.push(i); i;) {
                            if (g(i) && (l = h(i)) && o(l))if ((m = h(l)) && !g(m))f.push(l); else {
                                var k = l, r = j(n), s = k.parent.children, p = CKEDITOR.tools.indexOf(s, k);
                                s.splice(p + 1, 0, r);
                                s = k.next;
                                k.next = r;
                                r.previous = k;
                                r.parent = k.parent;
                                r.next = s;
                                d(l)
                            }
                            i = i.previous
                        }
                        for (i = 0; i < f.length; i++)d(f[i]);
                        if (f = CKEDITOR.env.opera && !b || (typeof e == "function" ? e(c) !== false : e))if (!n && CKEDITOR.env.ie && c.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)f = false; else if (!n && CKEDITOR.env.ie && (document.documentMode >
                            7 || c.name in CKEDITOR.dtd.tr || c.name in CKEDITOR.dtd.$listItem))f = false; else {
                            f = a(c);
                            f = !f || c.name == "form" && f.name == "input"
                        }
                        f && c.add(j(b))
                    }
                }
            }

            function o(a, b) {
                if ((!n || !CKEDITOR.env.ie) && a.type == CKEDITOR.NODE_ELEMENT && a.name == "br" && !a.attributes["data-cke-eol"])return true;
                var d;
                if (a.type == CKEDITOR.NODE_TEXT && (d = a.value.match(x))) {
                    if (d.index) {
                        e(a, new CKEDITOR.htmlParser.text(a.value.substring(0, d.index)));
                        a.value = d[0]
                    }
                    if (CKEDITOR.env.ie && n && (!b || a.parent.name in k))return true;
                    if (!n)if ((d = a.previous) &&
                        d.name == "br" || !d || g(d))return true
                }
                return false
            }

            var m = {elements: {}}, n = c == "html", k = CKEDITOR.tools.extend({}, q), r;
            for (r in k)"#"in v[r] || delete k[r];
            for (r in k)m.elements[r] = l(n, b.config.fillEmptyBlocks !== false);
            m.root = l(n);
            m.elements.br = function (a) {
                return function (b) {
                    if (b.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                        var d = b.attributes;
                        if ("data-cke-bogus"in d || "data-cke-eol"in d)delete d["data-cke-bogus"]; else {
                            for (d = b.next; d && f(d);)d = d.next;
                            var c = h(b);
                            !d && g(b.parent) ? i(b.parent, j(a)) : g(d) && (c && !g(c)) &&
                                e(d, j(a))
                        }
                    }
                }
            }(n);
            return m
        }

        function c(a) {
            return a.enterMode != CKEDITOR.ENTER_BR && a.autoParagraph !== false ? a.enterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : false
        }

        function a(a) {
            for (a = a.children[a.children.length - 1]; a && f(a);)a = a.previous;
            return a
        }

        function h(a) {
            for (a = a.previous; a && f(a);)a = a.previous;
            return a
        }

        function f(a) {
            return a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(a.value) || a.type == CKEDITOR.NODE_ELEMENT && a.attributes["data-cke-bookmark"]
        }

        function g(a) {
            return a && (a.type == CKEDITOR.NODE_ELEMENT && a.name in
                q || a.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)
        }

        function e(a, b) {
            var d = a.parent.children, e = CKEDITOR.tools.indexOf(d, a);
            d.splice(e, 0, b);
            d = a.previous;
            a.previous = b;
            b.next = a;
            b.parent = a.parent;
            if (d) {
                b.previous = d;
                d.next = b
            }
        }

        function i(a, b) {
            var d = a.children[a.children.length - 1];
            a.children.push(b);
            b.parent = a;
            if (d) {
                d.next = b;
                b.previous = d
            }
        }

        function d(a) {
            var b = a.parent.children, d = CKEDITOR.tools.indexOf(b, a), e = a.previous, a = a.next;
            e && (e.next = a);
            a && (a.previous = e);
            b.splice(d, 1)
        }

        function j(a) {
            var b = a.parent;
            return b ? CKEDITOR.tools.indexOf(b.children,
                a) : -1
        }

        function k(a) {
            a = a.attributes;
            a.contenteditable != "false" && (a["data-cke-editable"] = a.contenteditable ? "true" : 1);
            a.contenteditable = "false"
        }

        function l(a) {
            a = a.attributes;
            switch (a["data-cke-editable"]) {
                case "true":
                    a.contenteditable = "true";
                    break;
                case "1":
                    delete a.contenteditable
            }
        }

        function m(a) {
            return a.replace(y, function (a, b, d) {
                return"<" + b + d.replace(C, function (a, b) {
                    return!/^on/.test(b) && d.indexOf("data-cke-saved-" + b) == -1 ? " data-cke-saved-" + a + " data-cke-" + CKEDITOR.rnd + "-" + a : a
                }) + ">"
            })
        }

        function n(a) {
            return a.replace(D,
                function (a) {
                    return"<cke:encoded>" + encodeURIComponent(a) + "</cke:encoded>"
                })
        }

        function o(a) {
            return a.replace(F, function (a, b) {
                return decodeURIComponent(b)
            })
        }

        function s(a) {
            return a.replace(/<\!--(?!{cke_protected})[\s\S]+?--\>/g, function (a) {
                return"<\!--" + A + "{C}" + encodeURIComponent(a).replace(/--/g, "%2D%2D") + "--\>"
            })
        }

        function r(a) {
            return a.replace(/<\!--\{cke_protected\}\{C\}([\s\S]+?)--\>/g, function (a, b) {
                return decodeURIComponent(b)
            })
        }

        function p(a, b) {
            var d = b._.dataStore;
            return a.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g,
                function (a, b) {
                    return decodeURIComponent(b)
                }).replace(/\{cke_protected_(\d+)\}/g, function (a, b) {
                    return d && d[b] || ""
                })
        }

        function t(a, b) {
            for (var d = [], e = b.config.protectedSource, c = b._.dataStore || (b._.dataStore = {id: 1}), g = /<\!--\{cke_temp(comment)?\}(\d*?)--\>/g, e = [/<script[\s\S]*?<\/script>/gi, /<noscript[\s\S]*?<\/noscript>/gi].concat(e), a = a.replace(/<\!--[\s\S]*?--\>/g, function (a) {
                return"<\!--{cke_tempcomment}" + (d.push(a) - 1) + "--\>"
            }), f = 0; f < e.length; f++)a = a.replace(e[f], function (a) {
                a = a.replace(g, function (a, b, e) {
                    return d[e]
                });
                return/cke_temp(comment)?/.test(a) ? a : "<\!--{cke_temp}" + (d.push(a) - 1) + "--\>"
            });
            a = a.replace(g, function (a, b, e) {
                return"<\!--" + A + (b ? "{C}" : "") + encodeURIComponent(d[e]).replace(/--/g, "%2D%2D") + "--\>"
            });
            return a.replace(/(['"]).*?\1/g, function (a) {
                return a.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g, function (a, b) {
                    c[c.id] = decodeURIComponent(b);
                    return"{cke_protected_" + c.id++ + "}"
                })
            })
        }

        CKEDITOR.htmlDataProcessor = function (a) {
            var d, e;
            this.editor = a;
            this.dataFilter = d = new CKEDITOR.htmlParser.filter;
            this.htmlFilter = e = new CKEDITOR.htmlParser.filter;
            this.writer = new CKEDITOR.htmlParser.basicWriter;
            d.addRules(u);
            d.addRules(b(a, "data"));
            e.addRules(B);
            e.addRules(b(a, "html"))
        };
        CKEDITOR.htmlDataProcessor.prototype = {toHtml: function (a, b, d) {
            var a = t(a, this.editor), a = m(a), a = n(a), a = a.replace(E, "$1cke:$2"), a = a.replace(I, "<cke:$1$2></cke:$1>"), a = CKEDITOR.env.opera ? a : a.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2"), e = this.editor.editable(), g;
            !b && b !== null && (b = e.getName());
            e = b || e.getName();
            if (CKEDITOR.env.ie && CKEDITOR.env.version <
                9 && e == "pre") {
                e = "div";
                a = "<pre>" + a + "</pre>";
                g = 1
            }
            e = this.editor.document.createElement(e);
            e.setHtml("a" + a);
            a = e.getHtml().substr(1);
            a = a.replace(RegExp(" data-cke-" + CKEDITOR.rnd + "-", "ig"), " ");
            g && (a = a.replace(/^<pre>|<\/pre>$/gi, ""));
            a = a.replace(K, "$1$2");
            a = o(a);
            a = r(a);
            a = CKEDITOR.htmlParser.fragment.fromHtml(a, b, d === false ? false : c(this.editor.config));
            b = new CKEDITOR.htmlParser.basicWriter;
            a.writeChildrenHtml(b, this.dataFilter, 1);
            a = b.getHtml(true);
            return a = s(a)
        }, toDataFormat: function (a) {
            var b = this.editor.editable(),
                d = this.writer, a = CKEDITOR.htmlParser.fragment.fromHtml(a, b.getName(), c(this.editor.config));
            d.reset();
            a.writeChildrenHtml(d, this.htmlFilter, 1);
            d = d.getHtml(true);
            d = r(d);
            return d = p(d, this.editor)
        }};
        var x = /(?:&nbsp;|\xa0)$/, A = "{cke_protected}", v = CKEDITOR.dtd, w = ["caption", "colgroup", "col", "thead", "tfoot", "tbody"], q = CKEDITOR.tools.extend({}, v.$blockLimit, v.$block), u = {elements: {}, attributeNames: [
            [/^on/, "data-cke-pa-on"]
        ]}, B = {elementNames: [
            [/^cke:/, ""],
            [/^\?xml:namespace$/, ""]
        ], attributeNames: [
            [/^data-cke-(saved|pa)-/,
                ""],
            [/^data-cke-.*/, ""],
            ["hidefocus", ""]
        ], elements: {$: function (a) {
            var b = a.attributes;
            if (b) {
                if (b["data-cke-temp"])return false;
                for (var d = ["name", "href", "src"], e, c = 0; c < d.length; c++) {
                    e = "data-cke-saved-" + d[c];
                    e in b && delete b[d[c]]
                }
            }
            return a
        }, table: function (a) {
            a.children.slice(0).sort(function (a, b) {
                var d, e;
                if (a.type == CKEDITOR.NODE_ELEMENT && b.type == a.type) {
                    d = CKEDITOR.tools.indexOf(w, a.name);
                    e = CKEDITOR.tools.indexOf(w, b.name)
                }
                if (!(d > -1 && e > -1 && d != e)) {
                    d = j(a);
                    e = j(b)
                }
                return d > e ? 1 : -1
            })
        }, embed: function (a) {
            var b =
                a.parent;
            if (b && b.name == "object") {
                var d = b.attributes.width, b = b.attributes.height;
                d && (a.attributes.width = d);
                b && (a.attributes.height = b)
            }
        }, param: function (a) {
            a.children = [];
            a.isEmpty = true;
            return a
        }, a: function (a) {
            if (!a.children.length && !a.attributes.name && !a.attributes["data-cke-saved-name"])return false
        }, span: function (a) {
            a.attributes["class"] == "Apple-style-span" && delete a.name
        }, html: function (a) {
            delete a.attributes.contenteditable;
            delete a.attributes["class"]
        }, body: function (a) {
            delete a.attributes.spellcheck;
            delete a.attributes.contenteditable
        }, style: function (a) {
            var b = a.children[0];
            b && b.value && (b.value = CKEDITOR.tools.trim(b.value));
            if (!a.attributes.type)a.attributes.type = "text/css"
        }, title: function (a) {
            var b = a.children[0];
            !b && i(a, b = new CKEDITOR.htmlParser.text);
            b.value = a.attributes["data-cke-title"] || ""
        }}, attributes: {"class": function (a) {
            return CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g, "")) || false
        }}};
        if (CKEDITOR.env.ie)B.attributes.style = function (a) {
            return a.replace(/(^|;)([^\:]+)/g, function (a) {
                return a.toLowerCase()
            })
        };
        for (var z in{input: 1, textarea: 1}) {
            u.elements[z] = k;
            B.elements[z] = l
        }
        var y = /<(a|area|img|input|source)\b([^>]*)>/gi, C = /\b(on\w+|href|src|name)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi, D = /(?:<style(?=[ >])[^>]*>[\s\S]*<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi, F = /<cke:encoded>([^<]*)<\/cke:encoded>/gi, E = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi, K = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi, I = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi
    }(),CKEDITOR.htmlParser.element =
        function (b, c) {
            this.name = b;
            this.attributes = c || {};
            this.children = [];
            var a = b || "", h = a.match(/^cke:(.*)/);
            h && (a = h[1]);
            a = !(!CKEDITOR.dtd.$nonBodyContent[a] && !CKEDITOR.dtd.$block[a] && !CKEDITOR.dtd.$listItem[a] && !CKEDITOR.dtd.$tableContent[a] && !(CKEDITOR.dtd.$nonEditable[a] || a == "br"));
            this.isEmpty = !!CKEDITOR.dtd.$empty[b];
            this.isUnknown = !CKEDITOR.dtd[b];
            this._ = {isBlockLike: a, hasInlineStarted: this.isEmpty || !a}
        },CKEDITOR.htmlParser.cssStyle = function (b) {
        var c = {};
        ((b instanceof CKEDITOR.htmlParser.element ? b.attributes.style :
            b) || "").replace(/&quot;/g, '"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function (a, b, f) {
                b == "font-family" && (f = f.replace(/["']/g, ""));
                c[b.toLowerCase()] = f
            });
        return{rules: c, populate: function (a) {
            var b = this.toString();
            if (b)a instanceof CKEDITOR.dom.element ? a.setAttribute("style", b) : a instanceof CKEDITOR.htmlParser.element ? a.attributes.style = b : a.style = b
        }, toString: function () {
            var a = [], b;
            for (b in c)c[b] && a.push(b, ":", c[b], ";");
            return a.join("")
        }}
    },function () {
        var b = function (b, a) {
            b = b[0];
            a = a[0];
            return b <
                a ? -1 : b > a ? 1 : 0
        };
        CKEDITOR.htmlParser.element.prototype = {type: CKEDITOR.NODE_ELEMENT, add: CKEDITOR.htmlParser.fragment.prototype.add, clone: function () {
            return new CKEDITOR.htmlParser.element(this.name, this.attributes)
        }, writeHtml: function (c, a) {
            var h = this.attributes, f = this, g = f.name, e, i, d, j;
            f.filterChildren = function () {
                if (!j) {
                    var b = new CKEDITOR.htmlParser.basicWriter;
                    CKEDITOR.htmlParser.fragment.prototype.writeChildrenHtml.call(f, b, a);
                    f.children = (new CKEDITOR.htmlParser.fragment.fromHtml(b.getHtml(), f.clone(),
                        0)).children;
                    j = 1
                }
            };
            if (a) {
                if (!this.parent)a.onRoot(this);
                for (; ;) {
                    if (!(g = a.onElementName(g)))return;
                    f.name = g;
                    if (!(f = a.onElement(f)))return;
                    f.parent = this.parent;
                    if (f.name == g)break;
                    if (f.type != CKEDITOR.NODE_ELEMENT) {
                        f.writeHtml(c, a);
                        return
                    }
                    g = f.name;
                    if (!g) {
                        for (var g = 0, k = this.children.length; g < k; g++)this.children[g].parent = f.parent;
                        this.writeChildrenHtml.call(f, c, j ? null : a);
                        return
                    }
                }
                h = f.attributes
            }
            c.openTag(g, h);
            for (var k = [], l = 0; l < 2; l++)for (e in h) {
                i = e;
                d = h[e];
                if (l == 1)k.push([e, d]); else if (a) {
                    for (; ;)if (i = a.onAttributeName(e))if (i !=
                        e) {
                        delete h[e];
                        e = i
                    } else break; else {
                        delete h[e];
                        break
                    }
                    i && ((d = a.onAttribute(f, i, d)) === false ? delete h[i] : h[i] = d)
                }
            }
            c.sortAttributes && k.sort(b);
            h = k.length;
            for (l = 0; l < h; l++) {
                e = k[l];
                c.attribute(e[0], e[1])
            }
            c.openTagClose(g, f.isEmpty);
            if (!f.isEmpty) {
                this.writeChildrenHtml.call(f, c, j ? null : a);
                c.closeTag(g)
            }
        }, writeChildrenHtml: function (b, a) {
            CKEDITOR.htmlParser.fragment.prototype.writeChildrenHtml.apply(this, arguments)
        }}
    }(),function () {
        var b = {};
        CKEDITOR.template = function (c) {
            if (b[c])this.output = b[c]; else {
                var a = c.replace(/'/g,
                    "\\'").replace(/{([^}]+)}/g, function (a, b) {
                        return"',data['" + b + "']==undefined?'{" + b + "}':data['" + b + "'],'"
                    });
                this.output = b[c] = Function("data", "buffer", "return buffer?buffer.push('" + a + "'):['" + a + "'].join('');")
            }
        }
    }(),delete CKEDITOR.loadFullCore,CKEDITOR.instances = {},CKEDITOR.document = new CKEDITOR.dom.document(document),CKEDITOR.add = function (b) {
        CKEDITOR.instances[b.name] = b;
        b.on("focus", function () {
            if (CKEDITOR.currentInstance != b) {
                CKEDITOR.currentInstance = b;
                CKEDITOR.fire("currentInstance")
            }
        });
        b.on("blur", function () {
            if (CKEDITOR.currentInstance ==
                b) {
                CKEDITOR.currentInstance = null;
                CKEDITOR.fire("currentInstance")
            }
        });
        CKEDITOR.fire("instance", null, b)
    },CKEDITOR.remove = function (b) {
        delete CKEDITOR.instances[b.name]
    },function () {
        var b = {};
        CKEDITOR.addTemplate = function (c, a) {
            var h = b[c];
            if (h)return h;
            h = {name: c, source: a};
            CKEDITOR.fire("template", h);
            return b[c] = new CKEDITOR.template(h.source)
        };
        CKEDITOR.getTemplate = function (c) {
            return b[c]
        }
    }(),function () {
        var b = [];
        CKEDITOR.addCss = function (c) {
            b.push(c)
        };
        CKEDITOR.getCss = function () {
            return b.join("\n")
        }
    }(),CKEDITOR.on("instanceDestroyed",
        function () {
            CKEDITOR.tools.isEmpty(this.instances) && CKEDITOR.fire("reset")
        }),CKEDITOR.TRISTATE_ON = 1,CKEDITOR.TRISTATE_OFF = 2,CKEDITOR.TRISTATE_DISABLED = 0,function () {
        CKEDITOR.inline = function (b, c) {
            if (!CKEDITOR.env.isCompatible)return null;
            b = CKEDITOR.dom.element.get(b);
            if (b.getEditor())throw'The editor instance "' + b.getEditor().name + '" is already attached to the provided element.';
            var a = new CKEDITOR.editor(c, b, CKEDITOR.ELEMENT_MODE_INLINE);
            a.setData(b.getHtml(), null, true);
            a.resetDirty();
            a.on("loaded",
                function () {
                    a.fire("uiReady");
                    a.editable(b);
                    a.container = b;
                    a.setData(a.getData(1));
                    a.resetDirty();
                    a.fire("contentDom");
                    a.mode = "wysiwyg";
                    a.fire("mode");
                    a.fireOnce("instanceReady");
                    CKEDITOR.fire("instanceReady", null, a)
                }, null, null, 1E4);
            a.on("destroy", function () {
                a.element.clearCustomData();
                delete a.element
            });
            return a
        };
        CKEDITOR.inlineAll = function () {
            var b, c, a;
            for (a in CKEDITOR.dtd.$editable)for (var h = CKEDITOR.document.getElementsByTag(a), f = 0, g = h.count(); f < g; f++) {
                b = h.getItem(f);
                if (b.getAttribute("contenteditable") ==
                    "true") {
                    c = {element: b, config: {}};
                    CKEDITOR.fire("inline", c) !== false && CKEDITOR.inline(b, c.config)
                }
            }
        };
        CKEDITOR.domReady(function () {
            !CKEDITOR.disableAutoInline && CKEDITOR.inlineAll()
        })
    }(),CKEDITOR.replaceClass = "ckeditor",function () {
        function b(b, e, f, d) {
            if (!CKEDITOR.env.isCompatible)return null;
            b = CKEDITOR.dom.element.get(b);
            if (b.getEditor())throw'The editor instance "' + b.getEditor().name + '" is already attached to the provided element.';
            var j = new CKEDITOR.editor(e, b, d);
            d == CKEDITOR.ELEMENT_MODE_REPLACE && b.setStyle("visibility",
                "hidden");
            f && j.setData(f, null, true);
            j.resetDirty();
            j.on("loaded", function () {
                a(j);
                d == CKEDITOR.ELEMENT_MODE_REPLACE && j.config.autoUpdateElement && h(j);
                j.setMode(j.config.startupMode, function () {
                    j.resetDirty();
                    j.fireOnce("instanceReady");
                    CKEDITOR.fire("instanceReady", null, j)
                })
            });
            j.on("destroy", c);
            return j
        }

        function c() {
            var a = this.container, b = this.element;
            if (a) {
                a.clearCustomData();
                a.remove()
            }
            if (b) {
                b.clearCustomData();
                this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && b.show();
                delete this.element
            }
        }

        function a(a) {
            var b =
                a.name, c = a.element, d = a.elementMode, h = a.fire("uiSpace", {space: "top", html: ""}).html, k = a.fireOnce("uiSpace", {space: "bottom", html: ""}).html;
            f || (f = CKEDITOR.addTemplate("maincontainer", '<{outerEl} id="cke_{name}" class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass + '"  dir="{langDir}" lang="{langCode}" role="application" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><{outerEl} class="cke_inner cke_reset" role="presentation">{topHtml}<{outerEl} id="{contentId}" class="cke_contents cke_reset" role="presentation"></{outerEl}>{bottomHtml}</{outerEl}></{outerEl}>'));
            b = CKEDITOR.dom.element.createFromHtml(f.output({id: a.id, name: b, langDir: a.lang.dir, langCode: a.langCode, voiceLabel: a.lang.editor, topHtml: h ? '<span id="' + a.ui.spaceId("top") + '" class="cke_top cke_reset_all" role="presentation" style="height:auto">' + h + "</span>" : "", contentId: a.ui.spaceId("contents"), bottomHtml: k ? '<span id="' + a.ui.spaceId("bottom") + '" class="cke_bottom cke_reset_all" role="presentation">' + k + "</span>" : "", outerEl: CKEDITOR.env.ie ? "span" : "div"}));
            if (d == CKEDITOR.ELEMENT_MODE_REPLACE) {
                c.hide();
                b.insertAfter(c)
            } else c.append(b);
            a.container = b;
            h && a.ui.space("top").unselectable();
            k && a.ui.space("bottom").unselectable();
            c = a.config.width;
            d = a.config.height;
            c && b.setStyle("width", CKEDITOR.tools.cssLength(c));
            d && a.ui.space("contents").setStyle("height", CKEDITOR.tools.cssLength(d));
            b.disableContextMenu();
            CKEDITOR.env.webkit && b.on("focus", function () {
                a.focus()
            });
            a.fireOnce("uiReady")
        }

        function h(a) {
            var b = a.element;
            if (a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && b.is("textarea")) {
                var c = b.$.form && new CKEDITOR.dom.element(b.$.form);
                if (c) {
                    var d = function () {
                        a.updateElement()
                    };
                    c.on("submit", d);
                    if (!c.$.submit.nodeName && !c.$.submit.length)c.$.submit = CKEDITOR.tools.override(c.$.submit, function (b) {
                        return function () {
                            a.updateElement();
                            b.apply ? b.apply(this, arguments) : b()
                        }
                    });
                    a.on("destroy", function () {
                        c.removeListener("submit", d)
                    })
                }
            }
        }

        CKEDITOR.replace = function (a, e) {
            return b(a, e, null, CKEDITOR.ELEMENT_MODE_REPLACE)
        };
        CKEDITOR.appendTo = function (a, e, c) {
            return b(a, e, c, CKEDITOR.ELEMENT_MODE_APPENDTO)
        };
        CKEDITOR.replaceAll = function () {
            for (var a = document.getElementsByTagName("textarea"),
                     b = 0; b < a.length; b++) {
                var c = null, d = a[b];
                if (d.name || d.id) {
                    if (typeof arguments[0] == "string") {
                        if (!RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)").test(d.className))continue
                    } else if (typeof arguments[0] == "function") {
                        c = {};
                        if (arguments[0](d, c) === false)continue
                    }
                    this.replace(d, c)
                }
            }
        };
        CKEDITOR.editor.prototype.addMode = function (a, b) {
            (this._.modes || (this._.modes = {}))[a] = b
        };
        CKEDITOR.editor.prototype.setMode = function (a, b) {
            var c = this, d = this._.modes;
            if (!(a == c.mode || !d || !d[a])) {
                c.fire("beforeSetMode", a);
                if (c.mode) {
                    var f =
                        c.checkDirty();
                    c._.previousMode = c.mode;
                    c.fire("beforeModeUnload");
                    c.editable(0);
                    c.ui.space("contents").setHtml("");
                    c.mode = ""
                }
                this._.modes[a](function () {
                    c.mode = a;
                    f !== void 0 && !f && c.resetDirty();
                    setTimeout(function () {
                        c.fire("mode");
                        b && b.call(c)
                    }, 0)
                })
            }
        };
        CKEDITOR.editor.prototype.resize = function (a, b, c, d) {
            var f = this.container, h = this.ui.space("contents"), l = CKEDITOR.env.webkit && this.document && this.document.getWindow().$.frameElement, d = d ? f.getChild(1) : f;
            d.setSize("width", a, true);
            l && (l.style.width = "1%");
            h.setStyle("height",
                    Math.max(b - (c ? 0 : (d.$.offsetHeight || 0) - (h.$.clientHeight || 0)), 0) + "px");
            l && (l.style.width = "100%");
            this.fire("resize")
        };
        CKEDITOR.editor.prototype.getResizable = function (a) {
            return a ? this.ui.space("contents") : this.container
        };
        var f;
        CKEDITOR.domReady(function () {
            CKEDITOR.replaceClass && CKEDITOR.replaceAll(CKEDITOR.replaceClass)
        })
    }(),CKEDITOR.config.startupMode = "wysiwyg",function () {
        function b(b) {
            var d = b.editor, e = d.editable(), c = b.data.path, f = c.blockLimit, g = b.data.selection.getRanges()[0], i = d.config.enterMode;
            if (CKEDITOR.env.gecko) {
                var h = c.block || c.blockLimit || c.root, j = h && h.getLast(a);
                h && (h.isBlockBoundary() && (!j || !(j.type == CKEDITOR.NODE_ELEMENT && j.isBlockBoundary())) && !h.is("pre") && !h.getBogus()) && h.appendBogus()
            }
            if (d.config.autoParagraph !== false && i != CKEDITOR.ENTER_BR && g.collapsed && e.equals(f) && !c.block) {
                e = g.clone();
                e.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                c = new CKEDITOR.dom.walker(e);
                c.guard = function (b) {
                    return!a(b) || b.type == CKEDITOR.NODE_COMMENT || b.isReadOnly()
                };
                if (!c.checkForward() || e.checkStartOfBlock() &&
                    e.checkEndOfBlock()) {
                    d = g.fixBlock(true, d.config.enterMode == CKEDITOR.ENTER_DIV ? "div" : "p");
                    if (CKEDITOR.env.ie)(d = d.getFirst(a)) && (d.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(d.getText()).match(/^(?:&nbsp;|\xa0)$/)) && d.remove();
                    g.select();
                    b.cancel()
                }
            }
        }

        function c(a) {
            var b = a.data.getTarget();
            if (b.is("input")) {
                b = b.getAttribute("type");
                (b == "submit" || b == "reset") && a.data.preventDefault()
            }
        }

        function a(a) {
            return d(a) && j(a)
        }

        function h(a, b) {
            return function (d) {
                var e = CKEDITOR.dom.element.get(d.data.$.toElement ||
                    d.data.$.fromElement || d.data.$.relatedTarget);
                (!e || !b.equals(e) && !b.contains(e)) && a.call(this, d)
            }
        }

        function f(b) {
            var d, e = b.getRanges()[0], b = b.root, c = e.startPath(), f = {table: 1, ul: 1, ol: 1, dl: 1}, g = CKEDITOR.dom.walker.bogus();
            if (c.contains(f)) {
                var i = e.clone();
                i.collapse(1);
                i.setStartAt(b, CKEDITOR.POSITION_AFTER_START);
                i = new CKEDITOR.dom.walker(i);
                c = function (b, e) {
                    return function (b, c) {
                        c && (b.type == CKEDITOR.NODE_ELEMENT && b.is(f)) && (d = b);
                        if (a(b) && !c && (!e || !g(b)))return false
                    }
                };
                i.guard = c(i);
                i.checkBackward();
                if (d) {
                    i = e.clone();
                    i.collapse();
                    i.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
                    i = new CKEDITOR.dom.walker(i);
                    i.guard = c(i, 1);
                    d = 0;
                    i.checkForward();
                    return d
                }
            }
            return null
        }

        function g(a) {
            a.editor.focus();
            a.editor.fire("saveSnapshot")
        }

        function e(a, b) {
            var d = a.editor;
            !b && d.getSelection().scrollIntoView();
            setTimeout(function () {
                d.fire("saveSnapshot")
            }, 0)
        }

        CKEDITOR.editable = CKEDITOR.tools.createClass({base: CKEDITOR.dom.element, $: function (a, b) {
            this.base(b.$ || b);
            this.editor = a;
            this.hasFocus = false;
            this.setup()
        }, proto: {focus: function () {
            this.$[CKEDITOR.env.ie &&
                this.getDocument().equals(CKEDITOR.document) ? "setActive" : "focus"]();
            CKEDITOR.env.safari && !this.isInline() && (CKEDITOR.document.getActive().equals(this.getWindow().getFrame()) || this.getWindow().focus())
        }, on: function (a, b) {
            var d = Array.prototype.slice.call(arguments, 0);
            if (CKEDITOR.env.ie && /^focus|blur$/.exec(a)) {
                a = a == "focus" ? "focusin" : "focusout";
                b = h(b, this);
                d[0] = a;
                d[1] = b
            }
            return CKEDITOR.dom.element.prototype.on.apply(this, d)
        }, attachListener: function (a, b, d, e, c, f) {
            !this._.listeners && (this._.listeners = []);
            var g = Array.prototype.slice.call(arguments, 1);
            this._.listeners.push(a.on.apply(a, g))
        }, clearListeners: function () {
            var a = this._.listeners;
            try {
                for (; a.length;)a.pop().removeListener()
            } catch (b) {
            }
        }, restoreAttrs: function () {
            var a = this._.attrChanges, b, d;
            for (d in a)if (a.hasOwnProperty(d)) {
                b = a[d];
                b !== null ? this.setAttribute(d, b) : this.removeAttribute(d)
            }
        }, attachClass: function (a) {
            var b = this.getCustomData("classes");
            if (!this.hasClass(a)) {
                !b && (b = []);
                b.push(a);
                this.setCustomData("classes", b);
                this.addClass(a)
            }
        }, changeAttr: function (a, b) {
            var d = this.getAttribute(a);
            if (b !== d) {
                !this._.attrChanges && (this._.attrChanges = {});
                a in this._.attrChanges || (this._.attrChanges[a] = d);
                this.setAttribute(a, b)
            }
        }, insertHtml: function (a, b) {
            g(this);
            k(this, b == "text" ? "text" : "html", a)
        }, insertText: function (a) {
            g(this);
            var b = this.editor, d = b.getSelection().getStartElement().hasAscendant("pre", true) ? CKEDITOR.ENTER_BR : b.config.enterMode, b = d == CKEDITOR.ENTER_BR, e = CKEDITOR.tools, a = e.htmlEncode(a.replace(/\r\n/g, "\n")), a = a.replace(/\t/g, "&nbsp;&nbsp; &nbsp;"), d = d ==
                CKEDITOR.ENTER_P ? "p" : "div";
            if (!b) {
                var c = /\n{2}/g;
                if (c.test(a))var f = "<" + d + ">", i = "</" + d + ">", a = f + a.replace(c, function () {
                    return i + f
                }) + i
            }
            a = a.replace(/\n/g, "<br>");
            b || (a = a.replace(RegExp("<br>(?=</" + d + ">)"), function (a) {
                return e.repeat(a, 2)
            }));
            a = a.replace(/^ | $/g, "&nbsp;");
            a = a.replace(/(>|\s) /g, function (a, b) {
                return b + "&nbsp;"
            }).replace(/ (?=<)/g, "&nbsp;");
            k(this, "text", a)
        }, insertElement: function (b) {
            g(this);
            for (var d = this.editor, c = d.config.enterMode, f = d.getSelection(), i = f.getRanges(), h = b.getName(), j = CKEDITOR.dtd.$block[h],
                     k, x, A, v = i.length - 1; v >= 0; v--) {
                k = i[v];
                if (!k.checkReadOnly()) {
                    k.deleteContents(1);
                    x = !v && b || b.clone(1);
                    var w, q;
                    if (j)for (; (w = k.getCommonAncestor(0, 1)) && (q = CKEDITOR.dtd[w.getName()]) && (!q || !q[h]);)if (w.getName()in CKEDITOR.dtd.span)k.splitElement(w); else if (k.checkStartOfBlock() && k.checkEndOfBlock()) {
                        k.setStartBefore(w);
                        k.collapse(true);
                        w.remove()
                    } else k.splitBlock(c == CKEDITOR.ENTER_DIV ? "div" : "p", d.editable());
                    k.insertNode(x);
                    A || (A = x)
                }
            }
            if (A) {
                k.moveToPosition(A, CKEDITOR.POSITION_AFTER_END);
                if (j)if ((b = A.getNext(a)) &&
                    b.type == CKEDITOR.NODE_ELEMENT && b.is(CKEDITOR.dtd.$block))b.getDtd()["#"] ? k.moveToElementEditStart(b) : k.moveToElementEditEnd(A); else if (!b && c != CKEDITOR.ENTER_BR) {
                    b = k.fixBlock(true, c == CKEDITOR.ENTER_DIV ? "div" : "p");
                    k.moveToElementEditStart(b)
                }
            }
            f.selectRanges([k]);
            e(this, CKEDITOR.env.opera)
        }, setData: function (a, b) {
            !b && this.editor.dataProcessor && (a = this.editor.dataProcessor.toHtml(a));
            this.setHtml(a);
            this.editor.fire("dataReady")
        }, getData: function (a) {
            var b = this.getHtml();
            !a && this.editor.dataProcessor &&
            (b = this.editor.dataProcessor.toDataFormat(b));
            return b
        }, setReadOnly: function (a) {
            this.setAttribute("contenteditable", !a)
        }, detach: function () {
            this.removeClass("cke_editable");
            var a = this.editor;
            this._.detach();
            delete a.document;
            delete a.window
        }, isInline: function () {
            return this.getDocument().equals(CKEDITOR.document)
        }, setup: function () {
            var a = this.editor;
            this.attachListener(a, "beforeGetData", function () {
                var b = this.getData();
                this.is("textarea") || a.config.ignoreEmptyParagraph !== false && (b = b.replace(i, function (a, b) {
                    return b
                }));
                a.setData(b, null, 1)
            }, this);
            this.attachListener(a, "getSnapshot", function (a) {
                a.data = this.getData(1)
            }, this);
            this.attachListener(a, "afterSetData", function () {
                this.setData(a.getData(1))
            }, this);
            this.attachListener(a, "loadSnapshot", function (a) {
                this.setData(a.data, 1)
            }, this);
            this.attachListener(a, "beforeFocus", function () {
                var b = a.getSelection();
                (b = b && b.getNative()) && b.type == "Control" || this.focus()
            }, this);
            this.attachListener(a, "insertHtml", function (a) {
                    this.insertHtml(a.data.dataValue, a.data.mode)
                },
                this);
            this.attachListener(a, "insertElement", function (a) {
                this.insertElement(a.data)
            }, this);
            this.attachListener(a, "insertText", function (a) {
                this.insertText(a.data)
            }, this);
            this.setReadOnly(a.readOnly);
            this.attachClass("cke_editable");
            this.attachClass(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "cke_editable_inline" : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE || a.elementMode == CKEDITOR.ELEMENT_MODE_APPENDTO ? "cke_editable_themed" : "");
            this.attachClass("cke_contents_" + a.config.contentsLangDirection);
            a.keystrokeHandler.blockedKeystrokes[8] =
                a.readOnly;
            a.keystrokeHandler.attach(this);
            this.on("blur", function (a) {
                CKEDITOR.env.opera && CKEDITOR.document.getActive().equals(this.isInline() ? this : this.getWindow().getFrame()) ? a.cancel() : this.hasFocus = false
            }, null, null, -1);
            this.on("focus", function () {
                this.hasFocus = true
            }, null, null, -1);
            a.focusManager.add(this);
            if (this.equals(CKEDITOR.document.getActive())) {
                this.hasFocus = true;
                a.once("contentDom", function () {
                    a.focusManager.focus()
                })
            }
            this.isInline() && this.changeAttr("tabindex", a.tabIndex);
            if (!this.is("textarea")) {
                a.document =
                    this.getDocument();
                a.window = this.getWindow();
                var b = a.document;
                this.changeAttr("spellcheck", !a.config.disableNativeSpellChecker);
                var e = a.config.contentsLangDirection;
                this.getDirection(1) != e && this.changeAttr("dir", e);
                var g = CKEDITOR.getCss();
                if (g) {
                    e = b.getHead();
                    if (!e.getCustomData("stylesheet")) {
                        g = b.appendStyleText(g);
                        g = new CKEDITOR.dom.element(g.ownerNode || g.owningElement);
                        e.setCustomData("stylesheet", g);
                        g.data("cke-temp", 1)
                    }
                }
                e = b.getCustomData("stylesheet_ref") || 0;
                b.setCustomData("stylesheet_ref", e +
                    1);
                this.setCustomData("cke_includeReadonly", !a.config.disableReadonlyStyling);
                this.attachListener(this, "click", function (a) {
                    var a = a.data, b = a.getTarget();
                    b.is("a") && (a.$.button != 2 && b.isReadOnly()) && a.preventDefault()
                });
                this.attachListener(a, "key", function (b) {
                    if (a.readOnly)return true;
                    var e = b.data.keyCode, c;
                    if (e in{8: 1, 46: 1}) {
                        var g = a.getSelection(), b = g.getRanges()[0], i = b.startPath(), h, j, k, e = e == 8;
                        if (g = f(g)) {
                            a.fire("saveSnapshot");
                            b.moveToPosition(g, CKEDITOR.POSITION_BEFORE_START);
                            g.remove();
                            b.select();
                            a.fire("saveSnapshot");
                            c = 1
                        } else if (b.collapsed)if ((h = i.block) && b[e ? "checkStartOfBlock" : "checkEndOfBlock"]() && (k = h[e ? "getPrevious" : "getNext"](d)) && k.is("table")) {
                            a.fire("saveSnapshot");
                            b[e ? "checkEndOfBlock" : "checkStartOfBlock"]() && h.remove();
                            b["moveToElementEdit" + (e ? "End" : "Start")](k);
                            b.select();
                            a.fire("saveSnapshot");
                            c = 1
                        } else if (i.blockLimit && i.blockLimit.is("td") && (j = i.blockLimit.getAscendant("table")) && b.checkBoundaryOfElement(j, e ? CKEDITOR.START : CKEDITOR.END) && (k = j[e ? "getPrevious" : "getNext"](d))) {
                            a.fire("saveSnapshot");
                            b["moveToElementEdit" + (e ? "End" : "Start")](k);
                            b.checkStartOfBlock() && b.checkEndOfBlock() ? k.remove() : b.select();
                            a.fire("saveSnapshot");
                            c = 1
                        } else if ((j = i.contains(["td", "th", "caption"])) && b.checkBoundaryOfElement(j, e ? CKEDITOR.START : CKEDITOR.END))if ((k = j[e ? "getPreviousSourceNode" : "getNextSourceNode"](1, CKEDITOR.NODE_ELEMENT)) && !k.isReadOnly() && b.root.contains(k)) {
                            b[e ? "moveToElementEditEnd" : "moveToElementEditStart"](k);
                            b.select();
                            c = 1
                        }
                    }
                    return!c
                });
                CKEDITOR.env.ie && this.attachListener(this, "click", c);
                !CKEDITOR.env.ie && !CKEDITOR.env.opera && this.attachListener(this, "mousedown", function (b) {
                    var d = b.data.getTarget();
                    if (d.is("img", "hr", "input", "textarea", "select")) {
                        a.getSelection().selectElement(d);
                        d.is("input", "textarea", "select") && b.data.preventDefault()
                    }
                });
                CKEDITOR.env.gecko && this.attachListener(this, "mouseup", function (b) {
                    if (b.data.$.button == 2) {
                        b = b.data.getTarget();
                        if (!b.getOuterHtml().replace(i, "")) {
                            var d = a.createRange();
                            d.moveToElementEditStart(b);
                            d.select(true)
                        }
                    }
                });
                if (CKEDITOR.env.webkit) {
                    this.attachListener(this,
                        "click", function (a) {
                            a.data.getTarget().is("input", "select") && a.data.preventDefault()
                        });
                    this.attachListener(this, "mouseup", function (a) {
                        a.data.getTarget().is("input", "textarea") && a.data.preventDefault()
                    })
                }
            }
        }}, _: {detach: function () {
            this.editor.setData(this.editor.getData(), 0, 1);
            this.clearListeners();
            this.restoreAttrs();
            var a;
            if (a = this.removeCustomData("classes"))for (; a.length;)this.removeClass(a.pop());
            a = this.getDocument();
            var b = a.getHead();
            if (b.getCustomData("stylesheet")) {
                var d = a.getCustomData("stylesheet_ref");
                if (--d)a.setCustomData("stylesheet_ref", d); else {
                    a.removeCustomData("stylesheet_ref");
                    b.removeCustomData("stylesheet").remove()
                }
            }
            delete this.editor
        }}});
        CKEDITOR.editor.prototype.editable = function (a) {
            var b = this._.editable;
            if (b && a)return 0;
            if (arguments.length)b = this._.editable = a ? a instanceof CKEDITOR.editable ? a : new CKEDITOR.editable(this, a) : (b && b.detach(), null);
            return b
        };
        var i = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi,
            d = CKEDITOR.dom.walker.whitespaces(true), j = CKEDITOR.dom.walker.bookmark(false, true);
        CKEDITOR.on("instanceLoaded", function (a) {
            var d = a.editor;
            d.on("insertElement", function (a) {
                a = a.data;
                if (a.type == CKEDITOR.NODE_ELEMENT && (a.is("input") || a.is("textarea"))) {
                    a.getAttribute("contentEditable") != "false" && a.data("cke-editable", a.hasAttribute("contenteditable") ? "true" : "1");
                    a.setAttribute("contentEditable", false)
                }
            });
            d.on("selectionChange", function (a) {
                if (!d.readOnly) {
                    var e = d.getSelection();
                    if (e && !e.isLocked) {
                        e = d.checkDirty();
                        d.fire("lockSnapshot");
                        b(a);
                        d.fire("unlockSnapshot");
                        !e && d.resetDirty()
                    }
                }
            })
        });
        CKEDITOR.on("instanceCreated", function (a) {
            var b = a.editor;
            b.on("mode", function () {
                var a = b.editable();
                if (a && a.isInline()) {
                    var d = this.lang.editor + ", " + this.name;
                    a.changeAttr("role", "textbox");
                    a.changeAttr("aria-label", d);
                    a.changeAttr("title", d);
                    if (d = this.ui.space(this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "top" : "contents")) {
                        var e = CKEDITOR.tools.getNextId(), c = CKEDITOR.dom.element.createFromHtml('<span id="' + e + '" class="cke_voice_label">' +
                            this.lang.common.editorHelp + "</span>");
                        d.append(c);
                        a.changeAttr("aria-describedby", e)
                    }
                }
            })
        });
        CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
        var k = function () {
            function b(a) {
                return a.type == CKEDITOR.NODE_ELEMENT
            }

            function d(a, e) {
                var c, f, g, i, j = [], k = e.range.startContainer;
                c = e.range.startPath();
                for (var k = h[k.getName()], o = 0, n = a.getChildren(), r = n.count(), s = -1, t = -1, x = 0, A = c.contains(h.$list); o < r; ++o) {
                    c = n.getItem(o);
                    if (b(c)) {
                        g = c.getName();
                        if (A && g in CKEDITOR.dtd.$list)j = j.concat(d(c, e)); else {
                            i = !!k[g];
                            if (g == "br" && c.data("cke-eol") && (!o || o == r - 1)) {
                                x = (f = o ? j[o - 1].node : n.getItem(o + 1)) && (!b(f) || !f.is("br"));
                                f = f && b(f) && h.$block[f.getName()]
                            }
                            s == -1 && !i && (s = o);
                            i || (t = o);
                            j.push({isElement: 1, isLineBreak: x, isBlock: c.isBlockBoundary(), hasBlockSibling: f, node: c, name: g, allowed: i});
                            f = x = 0
                        }
                    } else j.push({isElement: 0, node: c, allowed: 1})
                }
                if (s > -1)j[s].firstNotAllowed = 1;
                if (t > -1)j[t].lastNotAllowed = 1;
                return j
            }

            function c(a, d) {
                var e = [], f = a.getChildren(), g = f.count(),
                    i, j = 0, k = h[d], o = !a.is(h.$inline) || a.is("br");
                for (o && e.push(" "); j < g; j++) {
                    i = f.getItem(j);
                    b(i) && !i.is(k) ? e = e.concat(c(i, d)) : e.push(i)
                }
                o && e.push(" ");
                return e
            }

            function f(a) {
                return a && b(a) && (a.is(h.$removeEmpty) || a.is("a") && !a.isBlockBoundary())
            }

            function g(a, d, e, c) {
                var f = a.clone(), i, h;
                f.setEndAt(d, CKEDITOR.POSITION_BEFORE_END);
                if ((i = (new CKEDITOR.dom.walker(f)).next()) && b(i) && j[i.getName()] && (h = i.getPrevious()) && b(h) && !h.getParent().equals(a.startContainer) && e.contains(h) && c.contains(i) && i.isIdentical(h)) {
                    i.moveChildren(h);
                    i.remove();
                    g(a, d, e, c)
                }
            }

            function i(a, d) {
                function e(a, d) {
                    if (d.isBlock && d.isElement && !d.node.is("br") && b(a) && a.is("br")) {
                        a.remove();
                        return 1
                    }
                }

                var c = d.endContainer.getChild(d.endOffset), f = d.endContainer.getChild(d.endOffset - 1);
                c && e(c, a[a.length - 1]);
                if (f && e(f, a[0])) {
                    d.setEnd(d.endContainer, d.endOffset - 1);
                    d.collapse()
                }
            }

            var h = CKEDITOR.dtd, j = {p: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, ul: 1, ol: 1, li: 1, pre: 1, dl: 1, blockquote: 1}, k = {p: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1}, A = CKEDITOR.tools.extend({}, h.$inline);
            delete A.br;
            return function (j, t, q) {
                var u = j.editor;
                j.getDocument();
                var B = u.getSelection().getRanges()[0];
                if (!B.checkReadOnly()) {
                    var z = (new CKEDITOR.dom.elementPath(B.startContainer, B.root)).blockLimit || B.root, t = {type: t, editable: j, editor: u, range: B, blockLimit: z, mergeCandidates: [], zombies: []}, u = t.range, z = t.mergeCandidates, y, C, D, F, E;
                    if (t.type == "text" && u.shrink(CKEDITOR.SHRINK_ELEMENT, true, false)) {
                        C = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", u.document);
                        u.insertNode(C);
                        u.setStartAfter(C)
                    }
                    D = new CKEDITOR.dom.elementPath(u.startContainer);
                    t.endPath = F = new CKEDITOR.dom.elementPath(u.endContainer);
                    if (!u.collapsed) {
                        y = F.block || F.blockLimit;
                        var K = u.getCommonAncestor();
                        y && (!y.equals(K) && !y.contains(K) && u.checkEndOfBlock()) && t.zombies.push(y);
                        u.deleteContents()
                    }
                    for (; (E = b(u.startContainer) && u.startContainer.getChild(u.startOffset - 1)) && b(E) && E.isBlockBoundary() && D.contains(E);)u.moveToPosition(E, CKEDITOR.POSITION_BEFORE_END);
                    g(u, t.blockLimit, D, F);
                    if (C) {
                        u.setEndBefore(C);
                        u.collapse();
                        C.remove()
                    }
                    C = u.startPath();
                    if (y = C.contains(f, false, 1)) {
                        u.splitElement(y);
                        t.inlineStylesRoot = y;
                        t.inlineStylesPeak = C.lastElement
                    }
                    C = u.createBookmark();
                    (y = C.startNode.getPrevious(a)) && b(y) && f(y) && z.push(y);
                    (y = C.startNode.getNext(a)) && b(y) && f(y) && z.push(y);
                    for (y = C.startNode; (y = y.getParent()) && f(y);)z.push(y);
                    u.moveToBookmark(C);
                    if (q) {
                        E = q;
                        q = t.range;
                        if (t.type == "text" && t.inlineStylesRoot) {
                            C = E;
                            E = t.inlineStylesPeak;
                            u = E.getDocument().createText("{cke-peak}");
                            for (z = t.inlineStylesRoot.getParent(); !E.equals(z);) {
                                u = u.appendTo(E.clone());
                                E = E.getParent()
                            }
                            E = u.getOuterHtml().replace("{cke-peak}",
                                C)
                        }
                        C = t.blockLimit.getName();
                        if (/^\s+|\s+$/.test(E) && "span"in CKEDITOR.dtd[C]) {
                            var I = '<span data-cke-marker="1">&nbsp;</span>';
                            E = I + E + I
                        }
                        E = t.editor.dataProcessor.toHtml(E, null, false);
                        C = q.document.createElement("body");
                        C.setHtml(E);
                        if (I) {
                            C.getFirst().remove();
                            C.getLast().remove()
                        }
                        if ((I = q.startPath().block) && !(I.getChildCount() == 1 && I.getBogus()))a:{
                            var G;
                            if (C.getChildCount() == 1 && b(G = C.getFirst()) && G.is(k)) {
                                I = G.getElementsByTag("*");
                                q = 0;
                                for (u = I.count(); q < u; q++) {
                                    E = I.getItem(q);
                                    if (!E.is(A))break a
                                }
                                G.moveChildren(G.getParent(1));
                                G.remove()
                            }
                        }
                        t.dataWrapper = C;
                        G = t.range;
                        var I = G.document, H, q = t.blockLimit;
                        C = 0;
                        var L;
                        E = [];
                        var J, P, z = u = 0, M, Q;
                        D = G.startContainer;
                        y = t.endPath.elements[0];
                        var R;
                        F = y.getPosition(D);
                        K = !!y.getCommonAncestor(D) && F != CKEDITOR.POSITION_IDENTICAL && !(F & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED);
                        D = d(t.dataWrapper, t);
                        for (i(D, G); C < D.length; C++) {
                            F = D[C];
                            if (H = F.isLineBreak) {
                                H = G;
                                M = q;
                                var O = void 0, U = void 0;
                                if (F.hasBlockSibling)H = 1; else {
                                    O = H.startContainer.getAscendant(h.$block, 1);
                                    if (!O || !O.is({div: 1, p: 1}))H =
                                        0; else {
                                        U = O.getPosition(M);
                                        if (U == CKEDITOR.POSITION_IDENTICAL || U == CKEDITOR.POSITION_CONTAINS)H = 0; else {
                                            M = H.splitElement(O);
                                            H.moveToPosition(M, CKEDITOR.POSITION_AFTER_START);
                                            H = 1
                                        }
                                    }
                                }
                            }
                            if (H)z = C > 0; else {
                                H = G.startPath();
                                if (!F.isBlock && (P = t.editor.config.enterMode != CKEDITOR.ENTER_BR && t.editor.config.autoParagraph !== false ? t.editor.config.enterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : false) && !H.block && H.blockLimit && H.blockLimit.equals(G.root)) {
                                    P = I.createElement(P);
                                    !CKEDITOR.env.ie && P.appendBogus();
                                    G.insertNode(P);
                                    !CKEDITOR.env.ie &&
                                    (L = P.getBogus()) && L.remove();
                                    G.moveToPosition(P, CKEDITOR.POSITION_BEFORE_END)
                                }
                                if ((H = G.startPath().block) && !H.equals(J)) {
                                    if (L = H.getBogus()) {
                                        L.remove();
                                        E.push(H)
                                    }
                                    J = H
                                }
                                F.firstNotAllowed && (u = 1);
                                if (u && F.isElement) {
                                    H = G.startContainer;
                                    for (M = null; H && !h[H.getName()][F.name];) {
                                        if (H.equals(q)) {
                                            H = null;
                                            break
                                        }
                                        M = H;
                                        H = H.getParent()
                                    }
                                    if (H) {
                                        if (M) {
                                            Q = G.splitElement(M);
                                            t.zombies.push(Q);
                                            t.zombies.push(M)
                                        }
                                    } else {
                                        M = q.getName();
                                        R = !C;
                                        H = C == D.length - 1;
                                        M = c(F.node, M);
                                        for (var O = [], U = M.length, T = 0, V = void 0, W = 0, S = -1; T < U; T++) {
                                            V = M[T];
                                            if (V == " ") {
                                                if (!W && (!R || T)) {
                                                    O.push(new CKEDITOR.dom.text(" "));
                                                    S = O.length
                                                }
                                                W = 1
                                            } else {
                                                O.push(V);
                                                W = 0
                                            }
                                        }
                                        H && S == O.length && O.pop();
                                        R = O
                                    }
                                }
                                if (R) {
                                    for (; H = R.pop();)G.insertNode(H);
                                    R = 0
                                } else G.insertNode(F.node);
                                if (F.lastNotAllowed && C < D.length - 1) {
                                    (Q = K ? y : Q) && G.setEndAt(Q, CKEDITOR.POSITION_AFTER_START);
                                    u = 0
                                }
                                G.collapse()
                            }
                        }
                        t.dontMoveCaret = z;
                        t.bogusNeededBlocks = E
                    }
                    L = t.range;
                    var N;
                    Q = t.bogusNeededBlocks;
                    for (R = L.createBookmark(); J = t.zombies.pop();)if (J.getParent()) {
                        P = L.clone();
                        P.moveToElementEditStart(J);
                        P.removeEmptyBlocksAtEnd()
                    }
                    if (Q)for (; J =
                                     Q.pop();)J.append(CKEDITOR.env.ie ? L.document.createText(" ") : L.document.createElement("br"));
                    for (; J = t.mergeCandidates.pop();)J.mergeSiblings();
                    L.moveToBookmark(R);
                    if (!t.dontMoveCaret) {
                        for (J = b(L.startContainer) && L.startContainer.getChild(L.startOffset - 1); J && b(J) && !J.is(h.$empty);) {
                            if (J.isBlockBoundary())L.moveToPosition(J, CKEDITOR.POSITION_BEFORE_END); else {
                                if (f(J) && J.getHtml().match(/(\s|&nbsp;)$/g)) {
                                    N = null;
                                    break
                                }
                                N = L.clone();
                                N.moveToPosition(J, CKEDITOR.POSITION_BEFORE_END)
                            }
                            J = J.getLast(a)
                        }
                        N && L.moveToRange(N)
                    }
                    B.select();
                    e(j)
                }
            }
        }()
    }(),function () {
        function b() {
            var a = this.getSelection(1);
            if (a.getType() != CKEDITOR.SELECTION_NONE) {
                this.fire("selectionCheck", a);
                var b = this.elementPath();
                if (!b.compare(this._.selectionPreviousPath)) {
                    this._.selectionPreviousPath = b;
                    this.fire("selectionChange", {selection: a, path: b})
                }
            }
        }

        function c() {
            i = true;
            if (!e) {
                a.call(this);
                e = CKEDITOR.tools.setTimeout(a, 200, this)
            }
        }

        function a() {
            e = null;
            if (i) {
                CKEDITOR.tools.setTimeout(b, 0, this);
                i = false
            }
        }

        function h(a) {
            function b(d, e) {
                return!d || d.type == CKEDITOR.NODE_TEXT ?
                    false : a.clone()["moveToElementEdit" + (e ? "End" : "Start")](d)
            }

            if (!(a.root instanceof CKEDITOR.editable))return false;
            var e = a.startContainer, c = a.getPreviousNode(d, null, e), f = a.getNextNode(d, null, e);
            return b(c) || b(f, 1) || !c && !f && !(e.type == CKEDITOR.NODE_ELEMENT && e.isBlockBoundary() && e.getBogus()) ? true : false
        }

        function f(a) {
            return a.getCustomData("cke-fillingChar")
        }

        function g(a, b) {
            var d = a && a.removeCustomData("cke-fillingChar");
            if (d) {
                if (b !== false) {
                    var e, c = a.getDocument().getSelection().getNative(), f = c && c.type !=
                        "None" && c.getRangeAt(0);
                    if (d.getLength() > 1 && f && f.intersectsNode(d.$)) {
                        e = [c.anchorOffset, c.focusOffset];
                        f = c.focusNode == d.$ && c.focusOffset > 0;
                        c.anchorNode == d.$ && c.anchorOffset > 0 && e[0]--;
                        f && e[1]--;
                        var g;
                        f = c;
                        if (!f.isCollapsed) {
                            g = f.getRangeAt(0);
                            g.setStart(f.anchorNode, f.anchorOffset);
                            g.setEnd(f.focusNode, f.focusOffset);
                            g = g.collapsed
                        }
                        g && e.unshift(e.pop())
                    }
                }
                d.setText(d.getText().replace(/\u200B/g, ""));
                if (e) {
                    d = c.getRangeAt(0);
                    d.setStart(d.startContainer, e[0]);
                    d.setEnd(d.startContainer, e[1]);
                    c.removeAllRanges();
                    c.addRange(d)
                }
            }
        }

        var e, i, d = CKEDITOR.dom.walker.invisible(1);
        CKEDITOR.on("instanceCreated", function (a) {
            function d() {
                var a = e.getSelection();
                a && a.removeAllRanges()
            }

            var e = a.editor;
            e.define("selectionChange", {errorProof: 1});
            e.on("contentDom", function () {
                var a = e.document, d = CKEDITOR.document, f = e.editable(), i = a.getBody(), h = a.getDocumentElement(), k = f.isInline(), l;
                CKEDITOR.env.gecko && f.attachListener(f, "focus", function (a) {
                    a.removeListener();
                    if (l !== 0) {
                        a = e.getSelection().getNative();
                        if (a.isCollapsed && a.anchorNode ==
                            f.$) {
                            a = e.createRange();
                            a.moveToElementEditStart(f);
                            a.select()
                        }
                    }
                }, null, null, -2);
                f.attachListener(f, "focus", function () {
                    e.unlockSelection(l);
                    l = 0
                }, null, null, -1);
                f.attachListener(f, "mousedown", function () {
                    l = 0
                });
                if (CKEDITOR.env.ie || CKEDITOR.env.opera || k) {
                    var m, w = function () {
                        m = e.getSelection(1);
                        m.lock()
                    };
                    j ? f.attachListener(f, "beforedeactivate", w, null, null, -1) : f.attachListener(e, "selectionCheck", w, null, null, -1);
                    f.attachListener(f, "blur", function () {
                        e.lockSelection(m);
                        l = 1
                    }, null, null, -1)
                }
                if (CKEDITOR.env.ie && !k) {
                    var q;
                    f.attachListener(f, "mousedown", function (a) {
                        a.data.$.button == 2 && e.document.$.selection.type == "None" && (q = e.window.getScrollPosition())
                    });
                    f.attachListener(f, "mouseup", function (a) {
                        if (a.data.$.button == 2 && q) {
                            e.document.$.documentElement.scrollLeft = q.x;
                            e.document.$.documentElement.scrollTop = q.y
                        }
                        q = null
                    });
                    if (a.$.compatMode != "BackCompat") {
                        if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat)h.on("mousedown", function (a) {
                            function b(a) {
                                a = a.data.$;
                                if (c) {
                                    var d = i.$.createTextRange();
                                    try {
                                        d.moveToPoint(a.x, a.y)
                                    } catch (e) {
                                    }
                                    c.setEndPoint(g.compareEndPoints("StartToStart",
                                        d) < 0 ? "EndToEnd" : "StartToStart", d);
                                    c.select()
                                }
                            }

                            function e() {
                                h.removeListener("mousemove", b);
                                d.removeListener("mouseup", e);
                                h.removeListener("mouseup", e);
                                c.select()
                            }

                            a = a.data;
                            if (a.getTarget().is("html") && a.$.y < h.$.clientHeight && a.$.x < h.$.clientWidth) {
                                var c = i.$.createTextRange();
                                try {
                                    c.moveToPoint(a.$.x, a.$.y)
                                } catch (f) {
                                }
                                var g = c.duplicate();
                                h.on("mousemove", b);
                                d.on("mouseup", e);
                                h.on("mouseup", e)
                            }
                        });
                        if (CKEDITOR.env.version > 7) {
                            h.on("mousedown", function (a) {
                                if (a.data.getTarget().is("html")) {
                                    d.on("mouseup", u);
                                    h.on("mouseup", u)
                                }
                            });
                            var u = function () {
                                d.removeListener("mouseup", u);
                                h.removeListener("mouseup", u);
                                var b = CKEDITOR.document.$.selection, e = b.createRange();
                                b.type != "None" && e.parentElement().ownerDocument == a.$ && e.select()
                            }
                        }
                    }
                }
                f.attachListener(f, "selectionchange", b, e);
                f.attachListener(f, "keyup", c, e);
                f.attachListener(f, "focus", function () {
                    e.forceNextSelectionCheck();
                    e.selectionChange(1)
                });
                if (k ? CKEDITOR.env.webkit || CKEDITOR.env.gecko : CKEDITOR.env.opera) {
                    var B;
                    f.attachListener(f, "mousedown", function () {
                        B = 1
                    });
                    f.attachListener(a.getDocumentElement(), "mouseup", function () {
                        B && c.call(e);
                        B = 0
                    })
                } else f.attachListener(CKEDITOR.env.ie ? f : a.getDocumentElement(), "mouseup", c, e);
                if (CKEDITOR.env.webkit)a.on("keydown", function (a) {
                    switch (a.data.getKey()) {
                        case 13:
                        case 33:
                        case 34:
                        case 35:
                        case 36:
                        case 37:
                        case 39:
                        case 8:
                        case 45:
                        case 46:
                            g(e.editable())
                    }
                }, null, null, -1)
            });
            e.on("contentDomUnload", e.forceNextSelectionCheck, e);
            e.on("dataReady", function () {
                e.selectionChange(1)
            });
            CKEDITOR.env.ie9Compat && e.on("beforeDestroy", d, null,
                null, 9);
            CKEDITOR.env.webkit && e.on("setData", d);
            e.on("contentDomUnload", function () {
                e.unlockSelection()
            })
        });
        CKEDITOR.on("instanceReady", function (a) {
            var b = a.editor, d = b.editable();
            if (CKEDITOR.env.webkit) {
                b.on("selectionChange", function () {
                    var a = f(d);
                    a && (a.getCustomData("ready") ? g(d) : a.setCustomData("ready", 1))
                }, null, null, -1);
                b.on("beforeSetMode", function () {
                    g(d)
                }, null, null, -1);
                var e, c, a = function () {
                    var a = b.document, g = f(d);
                    if (g) {
                        a = a.$.defaultView.getSelection();
                        a.type == "Caret" && a.anchorNode == g.$ && (c = 1);
                        e =
                            g.getText();
                        g.setText(e.replace(/\u200B/g, ""))
                    }
                }, i = function () {
                    var a = b.document, g = f(d);
                    if (g) {
                        g.setText(e);
                        if (c) {
                            a.$.defaultView.getSelection().setPosition(g.$, g.getLength());
                            c = 0
                        }
                    }
                };
                b.on("beforeUndoImage", a);
                b.on("afterUndoImage", i);
                b.on("beforeGetData", a, null, null, 0);
                b.on("getData", i)
            }
        });
        CKEDITOR.editor.prototype.selectionChange = function (a) {
            (a ? b : c).call(this)
        };
        CKEDITOR.editor.prototype.getSelection = function (a) {
            if (this._.savedSelection && !a)return this._.savedSelection;
            return(a = this.editable()) ? new CKEDITOR.dom.selection(a) :
                null
        };
        CKEDITOR.editor.prototype.lockSelection = function (a) {
            a = a || this.getSelection(1);
            if (a.getType() != CKEDITOR.SELECTION_NONE) {
                !a.isLocked && a.lock();
                this._.savedSelection = a;
                return true
            }
            return false
        };
        CKEDITOR.editor.prototype.unlockSelection = function (a) {
            var b = this._.savedSelection;
            if (b) {
                b.unlock(a);
                delete this._.savedSelection;
                return true
            }
            return false
        };
        CKEDITOR.editor.prototype.forceNextSelectionCheck = function () {
            delete this._.selectionPreviousPath
        };
        CKEDITOR.dom.document.prototype.getSelection = function () {
            return new CKEDITOR.dom.selection(this)
        };
        CKEDITOR.dom.range.prototype.select = function () {
            var a = this.root instanceof CKEDITOR.editable ? this.root.editor.getSelection() : new CKEDITOR.dom.selection(this.root);
            a.selectRanges([this]);
            return a
        };
        CKEDITOR.SELECTION_NONE = 1;
        CKEDITOR.SELECTION_TEXT = 2;
        CKEDITOR.SELECTION_ELEMENT = 3;
        var j = typeof window.getSelection != "function";
        CKEDITOR.dom.selection = function (a) {
            var b = a instanceof CKEDITOR.dom.element;
            this.document = a instanceof CKEDITOR.dom.document ? a : a.getDocument();
            this.root = b ? a : this.document.getBody();
            this.isLocked = 0;
            this._ = {cache: {}};
            if (CKEDITOR.env.webkit) {
                a = this.document.getWindow().$.getSelection();
                if (a.type == "None" && this.document.getActive().equals(this.root) || a.type == "Caret" && a.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT) {
                    var d = new CKEDITOR.dom.range(this.root);
                    d.moveToPosition(this.root, CKEDITOR.POSITION_AFTER_START);
                    b = this.document.$.createRange();
                    b.setStart(d.startContainer.$, d.startOffset);
                    b.collapse(1);
                    var e = this.root.on("focus", function (a) {
                        a.cancel()
                    }, null, null, -100);
                    a.addRange(b);
                    e.removeListener()
                }
            }
            var a = this.getNative(), c;
            if (a)if (a.getRangeAt)c = (d = a.rangeCount && a.getRangeAt(0)) && new CKEDITOR.dom.node(d.commonAncestorContainer); else {
                try {
                    d = a.createRange()
                } catch (f) {
                }
                c = d && CKEDITOR.dom.element.get(d.item && d.item(0) || d.parentElement())
            }
            if (!c || !this.root.equals(c) && !this.root.contains(c)) {
                this._.cache.type = CKEDITOR.SELECTION_NONE;
                this._.cache.startElement = null;
                this._.cache.selectedElement = null;
                this._.cache.selectedText = "";
                this._.cache.ranges = new CKEDITOR.dom.rangeList
            }
            return this
        };
        var k = {img: 1, hr: 1, li: 1, table: 1, tr: 1, td: 1, th: 1, embed: 1, object: 1, ol: 1, ul: 1, a: 1, input: 1, form: 1, select: 1, textarea: 1, button: 1, fieldset: 1, thead: 1, tfoot: 1};
        CKEDITOR.dom.selection.prototype = {getNative: function () {
            return this._.cache.nativeSel !== void 0 ? this._.cache.nativeSel : this._.cache.nativeSel = j ? this.document.$.selection : this.document.getWindow().$.getSelection()
        }, getType: j ? function () {
            var a = this._.cache;
            if (a.type)return a.type;
            var b = CKEDITOR.SELECTION_NONE;
            try {
                var d = this.getNative(), e = d.type;
                if (e == "Text")b =
                    CKEDITOR.SELECTION_TEXT;
                if (e == "Control")b = CKEDITOR.SELECTION_ELEMENT;
                if (d.createRange().parentElement())b = CKEDITOR.SELECTION_TEXT
            } catch (c) {
            }
            return a.type = b
        } : function () {
            var a = this._.cache;
            if (a.type)return a.type;
            var b = CKEDITOR.SELECTION_TEXT, d = this.getNative();
            if (!d || !d.rangeCount)b = CKEDITOR.SELECTION_NONE; else if (d.rangeCount == 1) {
                var d = d.getRangeAt(0), e = d.startContainer;
                if (e == d.endContainer && e.nodeType == 1 && d.endOffset - d.startOffset == 1 && k[e.childNodes[d.startOffset].nodeName.toLowerCase()])b = CKEDITOR.SELECTION_ELEMENT
            }
            return a.type =
                b
        }, getRanges: function () {
            var a = j ? function () {
                function a(b) {
                    return(new CKEDITOR.dom.node(b)).getIndex()
                }

                var b = function (b, d) {
                    b = b.duplicate();
                    b.collapse(d);
                    var e = b.parentElement(), c = e.ownerDocument;
                    if (!e.hasChildNodes())return{container: e, offset: 0};
                    for (var f = e.children, g, i, h = b.duplicate(), j = 0, k = f.length - 1, l = -1, n, z; j <= k;) {
                        l = Math.floor((j + k) / 2);
                        g = f[l];
                        h.moveToElementText(g);
                        n = h.compareEndPoints("StartToStart", b);
                        if (n > 0)k = l - 1; else if (n < 0)j = l + 1; else {
                            if (CKEDITOR.env.ie9Compat && g.tagName == "BR") {
                                f = c.defaultView.getSelection();
                                return{container: f[d ? "anchorNode" : "focusNode"], offset: f[d ? "anchorOffset" : "focusOffset"]}
                            }
                            return{container: e, offset: a(g)}
                        }
                    }
                    if (l == -1 || l == f.length - 1 && n < 0) {
                        h.moveToElementText(e);
                        h.setEndPoint("StartToStart", b);
                        c = h.text.replace(/(\r\n|\r)/g, "\n").length;
                        f = e.childNodes;
                        if (!c) {
                            g = f[f.length - 1];
                            return g.nodeType != CKEDITOR.NODE_TEXT ? {container: e, offset: f.length} : {container: g, offset: g.nodeValue.length}
                        }
                        for (e = f.length; c > 0 && e > 0;) {
                            i = f[--e];
                            if (i.nodeType == CKEDITOR.NODE_TEXT) {
                                z = i;
                                c = c - i.nodeValue.length
                            }
                        }
                        return{container: z,
                            offset: -c}
                    }
                    h.collapse(n > 0 ? true : false);
                    h.setEndPoint(n > 0 ? "StartToStart" : "EndToStart", b);
                    c = h.text.replace(/(\r\n|\r)/g, "\n").length;
                    if (!c)return{container: e, offset: a(g) + (n > 0 ? 0 : 1)};
                    for (; c > 0;)try {
                        i = g[n > 0 ? "previousSibling" : "nextSibling"];
                        if (i.nodeType == CKEDITOR.NODE_TEXT) {
                            c = c - i.nodeValue.length;
                            z = i
                        }
                        g = i
                    } catch (y) {
                        return{container: e, offset: a(g)}
                    }
                    return{container: z, offset: n > 0 ? -c : z.nodeValue.length + c}
                };
                return function () {
                    var a = this.getNative(), d = a && a.createRange(), e = this.getType();
                    if (!a)return[];
                    if (e == CKEDITOR.SELECTION_TEXT) {
                        a =
                            new CKEDITOR.dom.range(this.root);
                        e = b(d, true);
                        a.setStart(new CKEDITOR.dom.node(e.container), e.offset);
                        e = b(d);
                        a.setEnd(new CKEDITOR.dom.node(e.container), e.offset);
                        a.endContainer.getPosition(a.startContainer) & CKEDITOR.POSITION_PRECEDING && a.endOffset <= a.startContainer.getIndex() && a.collapse();
                        return[a]
                    }
                    if (e == CKEDITOR.SELECTION_ELEMENT) {
                        for (var e = [], c = 0; c < d.length; c++) {
                            for (var f = d.item(c), g = f.parentNode, i = 0, a = new CKEDITOR.dom.range(this.root); i < g.childNodes.length && g.childNodes[i] != f; i++);
                            a.setStart(new CKEDITOR.dom.node(g),
                                i);
                            a.setEnd(new CKEDITOR.dom.node(g), i + 1);
                            e.push(a)
                        }
                        return e
                    }
                    return[]
                }
            }() : function () {
                var a = [], b, d = this.getNative();
                if (!d)return a;
                for (var e = 0; e < d.rangeCount; e++) {
                    var c = d.getRangeAt(e);
                    b = new CKEDITOR.dom.range(this.root);
                    b.setStart(new CKEDITOR.dom.node(c.startContainer), c.startOffset);
                    b.setEnd(new CKEDITOR.dom.node(c.endContainer), c.endOffset);
                    a.push(b)
                }
                return a
            };
            return function (b) {
                var d = this._.cache;
                if (d.ranges && !b)return d.ranges;
                if (!d.ranges)d.ranges = new CKEDITOR.dom.rangeList(a.call(this));
                if (b)for (var e =
                    d.ranges, c = 0; c < e.length; c++) {
                    var f = e[c];
                    f.getCommonAncestor().isReadOnly() && e.splice(c, 1);
                    if (!f.collapsed) {
                        if (f.startContainer.isReadOnly())for (var b = f.startContainer, g; b;) {
                            if ((g = b.type == CKEDITOR.NODE_ELEMENT) && b.is("body") || !b.isReadOnly())break;
                            g && b.getAttribute("contentEditable") == "false" && f.setStartAfter(b);
                            b = b.getParent()
                        }
                        b = f.startContainer;
                        g = f.endContainer;
                        var i = f.startOffset, h = f.endOffset, j = f.clone();
                        b && b.type == CKEDITOR.NODE_TEXT && (i >= b.getLength() ? j.setStartAfter(b) : j.setStartBefore(b));
                        g &&
                            g.type == CKEDITOR.NODE_TEXT && (h ? j.setEndAfter(g) : j.setEndBefore(g));
                        b = new CKEDITOR.dom.walker(j);
                        b.evaluator = function (a) {
                            if (a.type == CKEDITOR.NODE_ELEMENT && a.isReadOnly()) {
                                var b = f.clone();
                                f.setEndBefore(a);
                                f.collapsed && e.splice(c--, 1);
                                if (!(a.getPosition(j.endContainer) & CKEDITOR.POSITION_CONTAINS)) {
                                    b.setStartAfter(a);
                                    b.collapsed || e.splice(c + 1, 0, b)
                                }
                                return true
                            }
                            return false
                        };
                        b.next()
                    }
                }
                return d.ranges
            }
        }(), getStartElement: function () {
            var a = this._.cache;
            if (a.startElement !== void 0)return a.startElement;
            var b;
            switch (this.getType()) {
                case CKEDITOR.SELECTION_ELEMENT:
                    return this.getSelectedElement();
                case CKEDITOR.SELECTION_TEXT:
                    var d = this.getRanges()[0];
                    if (d) {
                        if (d.collapsed) {
                            b = d.startContainer;
                            b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent())
                        } else {
                            for (d.optimize(); ;) {
                                b = d.startContainer;
                                if (d.startOffset == (b.getChildCount ? b.getChildCount() : b.getLength()) && !b.isBlockBoundary())d.setStartAfter(b); else break
                            }
                            b = d.startContainer;
                            if (b.type != CKEDITOR.NODE_ELEMENT)return b.getParent();
                            b = b.getChild(d.startOffset);
                            if (!b ||
                                b.type != CKEDITOR.NODE_ELEMENT)b = d.startContainer; else for (d = b.getFirst(); d && d.type == CKEDITOR.NODE_ELEMENT;) {
                                b = d;
                                d = d.getFirst()
                            }
                        }
                        b = b.$
                    }
            }
            return a.startElement = b ? new CKEDITOR.dom.element(b) : null
        }, getSelectedElement: function () {
            var a = this._.cache;
            if (a.selectedElement !== void 0)return a.selectedElement;
            var b = this, d = CKEDITOR.tools.tryThese(function () {
                return b.getNative().createRange().item(0)
            }, function () {
                for (var a = b.getRanges()[0], d, e, c = 2; c && (!(d = a.getEnclosedNode()) || !(d.type == CKEDITOR.NODE_ELEMENT && k[d.getName()] &&
                    (e = d))); c--)a.shrink(CKEDITOR.SHRINK_ELEMENT);
                return e.$
            });
            return a.selectedElement = d ? new CKEDITOR.dom.element(d) : null
        }, getSelectedText: function () {
            var a = this._.cache;
            if (a.selectedText !== void 0)return a.selectedText;
            var b = this.getNative(), b = j ? b.type == "Control" ? "" : b.createRange().text : b.toString();
            return a.selectedText = b
        }, lock: function () {
            this.getRanges();
            this.getStartElement();
            this.getSelectedElement();
            this.getSelectedText();
            this._.cache.nativeSel = null;
            this.isLocked = 1
        }, unlock: function (a) {
            if (this.isLocked) {
                if (a)var b =
                    this.getSelectedElement(), d = !b && this.getRanges();
                this.isLocked = 0;
                this.reset();
                if (a)(a = b || d[0].getCommonAncestor()) && a.getAscendant("body", 1) && (b ? this.selectElement(b) : this.selectRanges(d))
            }
        }, reset: function () {
            this._.cache = {}
        }, selectElement: function (a) {
            var b = new CKEDITOR.dom.range(this.root);
            b.setStartBefore(a);
            b.setEndAfter(a);
            this.selectRanges([b])
        }, selectRanges: function (a) {
            if (a.length)if (this.isLocked) {
                var b = CKEDITOR.document.getActive();
                this.unlock();
                this.selectRanges(a);
                this.lock();
                !b.equals(this.root) &&
                b.focus()
            } else {
                if (j) {
                    var d = CKEDITOR.dom.walker.whitespaces(true), e = /\ufeff|\u00a0/, c = {table: 1, tbody: 1, tr: 1};
                    if (a.length > 1) {
                        b = a[a.length - 1];
                        a[0].setEnd(b.endContainer, b.endOffset)
                    }
                    var b = a[0], a = b.collapsed, f, i, t, x = b.getEnclosedNode();
                    if (x && x.type == CKEDITOR.NODE_ELEMENT && x.getName()in k && (!x.is("a") || !x.getText()))try {
                        t = x.$.createControlRange();
                        t.addElement(x.$);
                        t.select();
                        return
                    } catch (A) {
                    }
                    (b.startContainer.type == CKEDITOR.NODE_ELEMENT && b.startContainer.getName()in c || b.endContainer.type == CKEDITOR.NODE_ELEMENT &&
                        b.endContainer.getName()in c) && b.shrink(CKEDITOR.NODE_ELEMENT, true);
                    t = b.createBookmark();
                    var c = t.startNode, v;
                    if (!a)v = t.endNode;
                    t = b.document.$.body.createTextRange();
                    t.moveToElementText(c.$);
                    t.moveStart("character", 1);
                    if (v) {
                        e = b.document.$.body.createTextRange();
                        e.moveToElementText(v.$);
                        t.setEndPoint("EndToEnd", e);
                        t.moveEnd("character", -1)
                    } else {
                        f = c.getNext(d);
                        i = c.hasAscendant("pre");
                        f = !(f && f.getText && f.getText().match(e)) && (i || !c.hasPrevious() || c.getPrevious().is && c.getPrevious().is("br"));
                        i = b.document.createElement("span");
                        i.setHtml("&#65279;");
                        i.insertBefore(c);
                        f && b.document.createText("﻿").insertBefore(c)
                    }
                    b.setStartBefore(c);
                    c.remove();
                    if (a) {
                        if (f) {
                            t.moveStart("character", -1);
                            t.select();
                            b.document.$.selection.clear()
                        } else t.select();
                        b.moveToPosition(i, CKEDITOR.POSITION_BEFORE_START);
                        i.remove()
                    } else {
                        b.setEndBefore(v);
                        v.remove();
                        t.select()
                    }
                } else {
                    v = this.getNative();
                    if (!v)return;
                    if (CKEDITOR.env.opera) {
                        b = this.document.$.createRange();
                        b.selectNodeContents(this.root.$);
                        v.addRange(b)
                    }
                    this.removeAllRanges();
                    for (e = 0; e < a.length; e++) {
                        if (e <
                            a.length - 1) {
                            b = a[e];
                            t = a[e + 1];
                            i = b.clone();
                            i.setStart(b.endContainer, b.endOffset);
                            i.setEnd(t.startContainer, t.startOffset);
                            if (!i.collapsed) {
                                i.shrink(CKEDITOR.NODE_ELEMENT, true);
                                f = i.getCommonAncestor();
                                i = i.getEnclosedNode();
                                if (f.isReadOnly() || i && i.isReadOnly()) {
                                    t.setStart(b.startContainer, b.startOffset);
                                    a.splice(e--, 1);
                                    continue
                                }
                            }
                        }
                        b = a[e];
                        t = this.document.$.createRange();
                        f = b.startContainer;
                        if (CKEDITOR.env.opera && b.collapsed && f.type == CKEDITOR.NODE_ELEMENT) {
                            i = f.getChild(b.startOffset - 1);
                            d = f.getChild(b.startOffset);
                            if (!i && !d && f.is(CKEDITOR.dtd.$removeEmpty) || i && i.type == CKEDITOR.NODE_ELEMENT || d && d.type == CKEDITOR.NODE_ELEMENT) {
                                b.insertNode(this.document.createText(""));
                                b.collapse(1)
                            }
                        }
                        if (b.collapsed && CKEDITOR.env.webkit && h(b)) {
                            f = this.root;
                            g(f, false);
                            i = f.getDocument().createText("​");
                            f.setCustomData("cke-fillingChar", i);
                            b.insertNode(i);
                            if ((f = i.getNext()) && !i.getPrevious() && f.type == CKEDITOR.NODE_ELEMENT && f.getName() == "br") {
                                g(this.root);
                                b.moveToPosition(f, CKEDITOR.POSITION_BEFORE_START)
                            } else b.moveToPosition(i, CKEDITOR.POSITION_AFTER_END)
                        }
                        t.setStart(b.startContainer.$,
                            b.startOffset);
                        try {
                            t.setEnd(b.endContainer.$, b.endOffset)
                        } catch (w) {
                            if (w.toString().indexOf("NS_ERROR_ILLEGAL_VALUE") >= 0) {
                                b.collapse(1);
                                t.setEnd(b.endContainer.$, b.endOffset)
                            } else throw w;
                        }
                        v.addRange(t)
                    }
                }
                this.reset();
                this.root.fire("selectionchange")
            }
        }, createBookmarks: function (a) {
            return this.getRanges().createBookmarks(a)
        }, createBookmarks2: function (a) {
            return this.getRanges().createBookmarks2(a)
        }, selectBookmarks: function (a) {
            for (var b = [], d = 0; d < a.length; d++) {
                var e = new CKEDITOR.dom.range(this.root);
                e.moveToBookmark(a[d]);
                b.push(e)
            }
            this.selectRanges(b);
            return this
        }, getCommonAncestor: function () {
            var a = this.getRanges();
            return a[0].startContainer.getCommonAncestor(a[a.length - 1].endContainer)
        }, scrollIntoView: function () {
            this.type != CKEDITOR.SELECTION_NONE && this.getRanges()[0].scrollIntoView()
        }, removeAllRanges: function () {
            var a = this.getNative();
            try {
                a && a[j ? "empty" : "removeAllRanges"]()
            } catch (b) {
            }
            this.reset()
        }}
    }(),CKEDITOR.editor.prototype.attachStyleStateChange = function (b, c) {
        var a = this._.styleStateChangeCallbacks;
        if (!a) {
            a = this._.styleStateChangeCallbacks =
                [];
            this.on("selectionChange", function (b) {
                for (var c = 0; c < a.length; c++) {
                    var g = a[c], e = g.style.checkActive(b.data.path) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
                    g.fn.call(this, e)
                }
            })
        }
        a.push({style: b, fn: c})
    },CKEDITOR.STYLE_BLOCK = 1,CKEDITOR.STYLE_INLINE = 2,CKEDITOR.STYLE_OBJECT = 3,function () {
        function b(a, b) {
            for (var d, e; a = a.getParent();) {
                if (a.equals(b))break;
                if (a.getAttribute("data-nostyle"))d = a; else if (!e) {
                    var c = a.getAttribute("contentEditable");
                    c == "false" ? d = a : c == "true" && (e = 1)
                }
            }
            return d
        }

        function c(a) {
            var d =
                a.document;
            if (a.collapsed) {
                d = s(this, d);
                a.insertNode(d);
                a.moveToPosition(d, CKEDITOR.POSITION_BEFORE_END)
            } else {
                var e = this.element, c = this._.definition, f, i = c.ignoreReadonly, g = i || c.includeReadonly;
                g == void 0 && (g = a.root.getCustomData("cke_includeReadonly"));
                var h = CKEDITOR.dtd[e] || (f = true, CKEDITOR.dtd.span);
                a.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
                a.trim();
                var j = a.createBookmark(), k = j.startNode, o = j.endNode, l = k, n;
                if (!i) {
                    var r = a.getCommonAncestor(), i = b(k, r), r = b(o, r);
                    i && (l = i.getNextSourceNode(true));
                    r && (o = r)
                }
                for (l.getPosition(o) ==
                         CKEDITOR.POSITION_FOLLOWING && (l = 0); l;) {
                    i = false;
                    if (l.equals(o)) {
                        l = null;
                        i = true
                    } else {
                        var p = l.type, t = p == CKEDITOR.NODE_ELEMENT ? l.getName() : null, r = t && l.getAttribute("contentEditable") == "false", x = t && l.getAttribute("data-nostyle");
                        if (t && l.data("cke-bookmark")) {
                            l = l.getNextSourceNode(true);
                            continue
                        }
                        if (!t || h[t] && !x && (!r || g) && (l.getPosition(o) | CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED) == CKEDITOR.POSITION_PRECEDING + CKEDITOR.POSITION_IDENTICAL + CKEDITOR.POSITION_IS_CONTAINED &&
                            (!c.childRule || c.childRule(l))) {
                            var v = l.getParent();
                            if (v && ((v.getDtd() || CKEDITOR.dtd.span)[e] || f) && (!c.parentRule || c.parentRule(v))) {
                                if (!n && (!t || !CKEDITOR.dtd.$removeEmpty[t] || (l.getPosition(o) | CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED) == CKEDITOR.POSITION_PRECEDING + CKEDITOR.POSITION_IDENTICAL + CKEDITOR.POSITION_IS_CONTAINED)) {
                                    n = a.clone();
                                    n.setStartBefore(l)
                                }
                                if (p == CKEDITOR.NODE_TEXT || r || p == CKEDITOR.NODE_ELEMENT && !l.getChildCount()) {
                                    for (var p = l, w; (i = !p.getNext(B)) &&
                                        (w = p.getParent(), h[w.getName()]) && (w.getPosition(k) | CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED) == CKEDITOR.POSITION_FOLLOWING + CKEDITOR.POSITION_IDENTICAL + CKEDITOR.POSITION_IS_CONTAINED && (!c.childRule || c.childRule(w));)p = w;
                                    n.setEndAfter(p)
                                }
                            } else i = true
                        } else i = true;
                        l = l.getNextSourceNode(x || r && !g)
                    }
                    if (i && n && !n.collapsed) {
                        for (var i = s(this, d), r = i.hasAttributes(), x = n.getCommonAncestor(), p = {}, t = {}, v = {}, A = {}, q, N, X; i && x;) {
                            if (x.getName() == e) {
                                for (q in c.attributes)if (!A[q] &&
                                    (X = x.getAttribute(N)))i.getAttribute(q) == X ? t[q] = 1 : A[q] = 1;
                                for (N in c.styles)if (!v[N] && (X = x.getStyle(N)))i.getStyle(N) == X ? p[N] = 1 : v[N] = 1
                            }
                            x = x.getParent()
                        }
                        for (q in t)i.removeAttribute(q);
                        for (N in p)i.removeStyle(N);
                        r && !i.hasAttributes() && (i = null);
                        if (i) {
                            n.extractContents().appendTo(i);
                            m.call(this, i);
                            n.insertNode(i);
                            i.mergeSiblings();
                            CKEDITOR.env.ie || i.$.normalize()
                        } else {
                            i = new CKEDITOR.dom.element("span");
                            n.extractContents().appendTo(i);
                            n.insertNode(i);
                            m.call(this, i);
                            i.remove(true)
                        }
                        n = null
                    }
                }
                a.moveToBookmark(j);
                a.shrink(CKEDITOR.SHRINK_TEXT)
            }
        }

        function a(a) {
            a.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
            var b = a.createBookmark(), d = b.startNode;
            if (a.collapsed) {
                for (var e = new CKEDITOR.dom.elementPath(d.getParent(), a.root), c, f = 0, i; f < e.elements.length && (i = e.elements[f]); f++) {
                    if (i == e.block || i == e.blockLimit)break;
                    if (this.checkElementRemovable(i)) {
                        var g;
                        if (a.collapsed && (a.checkBoundaryOfElement(i, CKEDITOR.END) || (g = a.checkBoundaryOfElement(i, CKEDITOR.START)))) {
                            c = i;
                            c.match = g ? "start" : "end"
                        } else {
                            i.mergeSiblings();
                            i.getName() == this.element ?
                                l.call(this, i) : n(i, t(this)[i.getName()])
                        }
                    }
                }
                if (c) {
                    i = d;
                    for (f = 0; ; f++) {
                        g = e.elements[f];
                        if (g.equals(c))break; else if (g.match)continue; else g = g.clone();
                        g.append(i);
                        i = g
                    }
                    i[c.match == "start" ? "insertBefore" : "insertAfter"](c)
                }
            } else {
                var h = b.endNode, j = this, e = function () {
                    for (var a = new CKEDITOR.dom.elementPath(d.getParent()), b = new CKEDITOR.dom.elementPath(h.getParent()), e = null, c = null, f = 0; f < a.elements.length; f++) {
                        var i = a.elements[f];
                        if (i == a.block || i == a.blockLimit)break;
                        j.checkElementRemovable(i) && (e = i)
                    }
                    for (f = 0; f < b.elements.length; f++) {
                        i =
                            b.elements[f];
                        if (i == b.block || i == b.blockLimit)break;
                        j.checkElementRemovable(i) && (c = i)
                    }
                    c && h.breakParent(c);
                    e && d.breakParent(e)
                };
                e();
                for (c = d; !c.equals(h);) {
                    f = c.getNextSourceNode();
                    if (c.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable(c)) {
                        c.getName() == this.element ? l.call(this, c) : n(c, t(this)[c.getName()]);
                        if (f.type == CKEDITOR.NODE_ELEMENT && f.contains(d)) {
                            e();
                            f = d.getNext()
                        }
                    }
                    c = f
                }
            }
            a.moveToBookmark(b)
        }

        function h(a) {
            var b = a.getEnclosedNode() || a.getCommonAncestor(false, true);
            (a = (new CKEDITOR.dom.elementPath(b,
                a.root)).contains(this.element, 1)) && !a.isReadOnly() && r(a, this)
        }

        function f(a) {
            var b = a.getCommonAncestor(true, true);
            if (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) {
                var b = this._.definition, d = b.attributes;
                if (d)for (var e in d)a.removeAttribute(e, d[e]);
                if (b.styles)for (var c in b.styles)b.styles.hasOwnProperty(c) && a.removeStyle(c)
            }
        }

        function g(a) {
            var b = a.createBookmark(true), d = a.createIterator();
            d.enforceRealBlocks = true;
            if (this._.enterMode)d.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
            for (var e, c = a.document; e = d.getNextParagraph();)if (!e.isReadOnly()) {
                var f = s(this, c, e);
                i(e, f)
            }
            a.moveToBookmark(b)
        }

        function e(a) {
            var b = a.createBookmark(1), d = a.createIterator();
            d.enforceRealBlocks = true;
            d.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
            for (var e; e = d.getNextParagraph();)if (this.checkElementRemovable(e))if (e.is("pre")) {
                var c = this._.enterMode == CKEDITOR.ENTER_BR ? null : a.document.createElement(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div");
                c && e.copyAttributes(c);
                i(e, c)
            } else l.call(this, e);
            a.moveToBookmark(b)
        }

        function i(a, b) {
            var e = !b;
            if (e) {
                b = a.getDocument().createElement("div");
                a.copyAttributes(b)
            }
            var c = b && b.is("pre"), f = a.is("pre"), i = !c && f;
            if (c && !f) {
                f = b;
                (i = a.getBogus()) && i.remove();
                i = a.getHtml();
                i = j(i, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, "");
                i = i.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1");
                i = i.replace(/([ \t\n\r]+|&nbsp;)/g, " ");
                i = i.replace(/<br\b[^>]*>/gi, "\n");
                if (CKEDITOR.env.ie) {
                    var g = a.getDocument().createElement("div");
                    g.append(f);
                    f.$.outerHTML = "<pre>" + i + "</pre>";
                    f.copyAttributes(g.getFirst());
                    f = g.getFirst().remove()
                } else f.setHtml(i);
                b = f
            } else i ? b = k(e ? [a.getHtml()] : d(a), b) : a.moveChildren(b);
            b.replace(a);
            if (c) {
                var e = b, h;
                if ((h = e.getPrevious(z)) && h.is && h.is("pre")) {
                    c = j(h.getHtml(), /\n$/, "") + "\n\n" + j(e.getHtml(), /^\n/, "");
                    CKEDITOR.env.ie ? e.$.outerHTML = "<pre>" + c + "</pre>" : e.setHtml(c);
                    h.remove()
                }
            } else e && o(b)
        }

        function d(a) {
            a.getName();
            var b = [];
            j(a.getOuterHtml(), /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi, function (a, b, d) {
                return b + "</pre>" + d + "<pre>"
            }).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi,
                function (a, d) {
                    b.push(d)
                });
            return b
        }

        function j(a, b, d) {
            var e = "", c = "", a = a.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi, function (a, b, d) {
                b && (e = b);
                d && (c = d);
                return""
            });
            return e + a.replace(b, d) + c
        }

        function k(a, b) {
            var d;
            a.length > 1 && (d = new CKEDITOR.dom.documentFragment(b.getDocument()));
            for (var e = 0; e < a.length; e++) {
                var c = a[e], c = c.replace(/(\r\n|\r)/g, "\n"), c = j(c, /^[ \t]*\n/, ""), c = j(c, /\n$/, ""), c = j(c, /^[ \t]+|[ \t]+$/g, function (a, b) {
                    return a.length == 1 ? "&nbsp;" : b ?
                        " " + CKEDITOR.tools.repeat("&nbsp;", a.length - 1) : CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
                }), c = c.replace(/\n/g, "<br>"), c = c.replace(/[ \t]{2,}/g, function (a) {
                    return CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
                });
                if (d) {
                    var f = b.clone();
                    f.setHtml(c);
                    d.append(f)
                } else b.setHtml(c)
            }
            return d || b
        }

        function l(a) {
            var b = this._.definition, d = b.attributes, b = b.styles, e = t(this)[a.getName()], c = CKEDITOR.tools.isEmpty(d) && CKEDITOR.tools.isEmpty(b), f;
            for (f in d)if (!((f == "class" || this._.definition.fullMatch) && a.getAttribute(f) !=
                x(f, d[f]))) {
                c = a.hasAttribute(f);
                a.removeAttribute(f)
            }
            for (var i in b)if (!(this._.definition.fullMatch && a.getStyle(i) != x(i, b[i], true))) {
                c = c || !!a.getStyle(i);
                a.removeStyle(i)
            }
            n(a, e, v[a.getName()]);
            c && (this._.definition.alwaysRemoveElement ? o(a, 1) : !CKEDITOR.dtd.$block[a.getName()] || this._.enterMode == CKEDITOR.ENTER_BR && !a.hasAttributes() ? o(a) : a.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div"))
        }

        function m(a) {
            for (var b = t(this), d = a.getElementsByTag(this.element), e = d.count(); --e >= 0;)l.call(this, d.getItem(e));
            for (var c in b)if (c != this.element) {
                d = a.getElementsByTag(c);
                for (e = d.count() - 1; e >= 0; e--) {
                    var f = d.getItem(e);
                    n(f, b[c])
                }
            }
        }

        function n(a, b, d) {
            if (b = b && b.attributes)for (var e = 0; e < b.length; e++) {
                var c = b[e][0], f;
                if (f = a.getAttribute(c)) {
                    var i = b[e][1];
                    (i === null || i.test && i.test(f) || typeof i == "string" && f == i) && a.removeAttribute(c)
                }
            }
            d || o(a)
        }

        function o(a, b) {
            if (!a.hasAttributes() || b)if (CKEDITOR.dtd.$block[a.getName()]) {
                var d = a.getPrevious(z), e = a.getNext(z);
                d && (d.type == CKEDITOR.NODE_TEXT || !d.isBlockBoundary({br: 1})) &&
                a.append("br", 1);
                e && (e.type == CKEDITOR.NODE_TEXT || !e.isBlockBoundary({br: 1})) && a.append("br");
                a.remove(true)
            } else {
                d = a.getFirst();
                e = a.getLast();
                a.remove(true);
                if (d) {
                    d.type == CKEDITOR.NODE_ELEMENT && d.mergeSiblings();
                    e && (!d.equals(e) && e.type == CKEDITOR.NODE_ELEMENT) && e.mergeSiblings()
                }
            }
        }

        function s(a, b, d) {
            var e;
            e = a.element;
            e == "*" && (e = "span");
            e = new CKEDITOR.dom.element(e, b);
            d && d.copyAttributes(e);
            e = r(e, a);
            b.getCustomData("doc_processing_style") && e.hasAttribute("id") ? e.removeAttribute("id") : b.setCustomData("doc_processing_style",
                1);
            return e
        }

        function r(a, b) {
            var d = b._.definition, e = d.attributes, d = CKEDITOR.style.getStyleText(d);
            if (e)for (var c in e)a.setAttribute(c, e[c]);
            d && a.setAttribute("style", d);
            return a
        }

        function p(a, b) {
            for (var d in a)a[d] = a[d].replace(u, function (a, d) {
                return b[d]
            })
        }

        function t(a) {
            if (a._.overrides)return a._.overrides;
            var b = a._.overrides = {}, d = a._.definition.overrides;
            if (d) {
                CKEDITOR.tools.isArray(d) || (d = [d]);
                for (var e = 0; e < d.length; e++) {
                    var c = d[e], f, i;
                    if (typeof c == "string")f = c.toLowerCase(); else {
                        f = c.element ? c.element.toLowerCase() :
                            a.element;
                        i = c.attributes
                    }
                    c = b[f] || (b[f] = {});
                    if (i) {
                        var c = c.attributes = c.attributes || [], g;
                        for (g in i)c.push([g.toLowerCase(), i[g]])
                    }
                }
            }
            return b
        }

        function x(a, b, d) {
            var e = new CKEDITOR.dom.element("span");
            e[d ? "setStyle" : "setAttribute"](a, b);
            return e[d ? "getStyle" : "getAttribute"](a)
        }

        function A(a, b) {
            for (var d = a.document, e = a.getRanges(), c = b ? this.removeFromRange : this.applyToRange, f, i = e.createIterator(); f = i.getNextRange();)c.call(this, f);
            a.selectRanges(e);
            d.removeCustomData("doc_processing_style")
        }

        var v = {address: 1,
            div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, p: 1, pre: 1, section: 1, header: 1, footer: 1, nav: 1, article: 1, aside: 1, figure: 1, dialog: 1, hgroup: 1, time: 1, meter: 1, menu: 1, command: 1, keygen: 1, output: 1, progress: 1, details: 1, datagrid: 1, datalist: 1}, w = {a: 1, embed: 1, hr: 1, img: 1, li: 1, object: 1, ol: 1, table: 1, td: 1, tr: 1, th: 1, ul: 1, dl: 1, dt: 1, dd: 1, form: 1, audio: 1, video: 1}, q = /\s*(?:;\s*|$)/, u = /#\((.+?)\)/g, B = CKEDITOR.dom.walker.bookmark(0, 1), z = CKEDITOR.dom.walker.whitespaces(1);
        CKEDITOR.style = function (a, b) {
            var d = a.attributes;
            if (d && d.style) {
                a.styles =
                    CKEDITOR.tools.extend({}, a.styles, CKEDITOR.tools.parseCssText(d.style));
                delete d.style
            }
            if (b) {
                a = CKEDITOR.tools.clone(a);
                p(a.attributes, b);
                p(a.styles, b)
            }
            d = this.element = a.element ? typeof a.element == "string" ? a.element.toLowerCase() : a.element : "*";
            this.type = a.type || (v[d] ? CKEDITOR.STYLE_BLOCK : w[d] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE);
            if (typeof this.element == "object")this.type = CKEDITOR.STYLE_OBJECT;
            this._ = {definition: a}
        };
        CKEDITOR.editor.prototype.applyStyle = function (a) {
            A.call(a, this.getSelection())
        };
        CKEDITOR.editor.prototype.removeStyle = function (a) {
            A.call(a, this.getSelection(), 1)
        };
        CKEDITOR.style.prototype = {apply: function (a) {
            A.call(this, a.getSelection())
        }, remove: function (a) {
            A.call(this, a.getSelection(), 1)
        }, applyToRange: function (a) {
            return(this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? c : this.type == CKEDITOR.STYLE_BLOCK ? g : this.type == CKEDITOR.STYLE_OBJECT ? h : null).call(this, a)
        }, removeFromRange: function (b) {
            return(this.removeFromRange = this.type == CKEDITOR.STYLE_INLINE ? a : this.type == CKEDITOR.STYLE_BLOCK ?
                e : this.type == CKEDITOR.STYLE_OBJECT ? f : null).call(this, b)
        }, applyToObject: function (a) {
            r(a, this)
        }, checkActive: function (a) {
            switch (this.type) {
                case CKEDITOR.STYLE_BLOCK:
                    return this.checkElementRemovable(a.block || a.blockLimit, true);
                case CKEDITOR.STYLE_OBJECT:
                case CKEDITOR.STYLE_INLINE:
                    for (var b = a.elements, d = 0, e; d < b.length; d++) {
                        e = b[d];
                        if (!(this.type == CKEDITOR.STYLE_INLINE && (e == a.block || e == a.blockLimit))) {
                            if (this.type == CKEDITOR.STYLE_OBJECT) {
                                var c = e.getName();
                                if (!(typeof this.element == "string" ? c == this.element :
                                    c in this.element))continue
                            }
                            if (this.checkElementRemovable(e, true))return true
                        }
                    }
            }
            return false
        }, checkApplicable: function (a) {
            switch (this.type) {
                case CKEDITOR.STYLE_OBJECT:
                    return a.contains(this.element)
            }
            return true
        }, checkElementMatch: function (a, b) {
            var d = this._.definition;
            if (!a || !d.ignoreReadonly && a.isReadOnly())return false;
            var e = a.getName();
            if (typeof this.element == "string" ? e == this.element : e in this.element) {
                if (!b && !a.hasAttributes())return true;
                if (e = d._AC)d = e; else {
                    var e = {}, c = 0, f = d.attributes;
                    if (f)for (var i in f) {
                        c++;
                        e[i] = f[i]
                    }
                    if (i = CKEDITOR.style.getStyleText(d)) {
                        e.style || c++;
                        e.style = i
                    }
                    e._length = c;
                    d = d._AC = e
                }
                if (d._length) {
                    for (var g in d)if (g != "_length") {
                        c = a.getAttribute(g) || "";
                        if (g == "style")a:{
                            e = d[g];
                            typeof e == "string" && (e = CKEDITOR.tools.parseCssText(e));
                            typeof c == "string" && (c = CKEDITOR.tools.parseCssText(c, true));
                            i = void 0;
                            for (i in e)if (!(i in c && (c[i] == e[i] || e[i] == "inherit" || c[i] == "inherit"))) {
                                e = false;
                                break a
                            }
                            e = true
                        } else e = d[g] == c;
                        if (e) {
                            if (!b)return true
                        } else if (b)return false
                    }
                    if (b)return true
                } else return true
            }
            return false
        },
            checkElementRemovable: function (a, b) {
                if (this.checkElementMatch(a, b))return true;
                var d = t(this)[a.getName()];
                if (d) {
                    var e;
                    if (!(d = d.attributes))return true;
                    for (var c = 0; c < d.length; c++) {
                        e = d[c][0];
                        if (e = a.getAttribute(e)) {
                            var f = d[c][1];
                            if (f === null || typeof f == "string" && e == f || f.test(e))return true
                        }
                    }
                }
                return false
            }, buildPreview: function (a) {
                var b = this._.definition, d = [], e = b.element;
                e == "bdo" && (e = "span");
                var d = ["<", e], c = b.attributes;
                if (c)for (var f in c)d.push(" ", f, '="', c[f], '"');
                (c = CKEDITOR.style.getStyleText(b)) &&
                d.push(' style="', c, '"');
                d.push(">", a || b.name, "</", e, ">");
                return d.join("")
            }};
        CKEDITOR.style.getStyleText = function (a) {
            var b = a._ST;
            if (b)return b;
            var b = a.styles, d = a.attributes && a.attributes.style || "", e = "";
            d.length && (d = d.replace(q, ";"));
            for (var c in b) {
                var f = b[c], i = (c + ":" + f).replace(q, ";");
                f == "inherit" ? e = e + i : d = d + i
            }
            d.length && (d = CKEDITOR.tools.normalizeCssText(d, true));
            return a._ST = d + e
        }
    }(),
    CKEDITOR.styleCommand = function (b) {
        this.style = b
    },
    CKEDITOR.styleCommand.prototype.exec = function (b) {
        b.focus();
        this.state ==
        CKEDITOR.TRISTATE_OFF ? b.applyStyle(this.style) : this.state == CKEDITOR.TRISTATE_ON && b.removeStyle(this.style)
    },
    CKEDITOR.stylesSet = new CKEDITOR.resourceManager("", "stylesSet"),
    CKEDITOR.addStylesSet = CKEDITOR.tools.bind(CKEDITOR.stylesSet.add, CKEDITOR.stylesSet),
    CKEDITOR.loadStylesSet = function (b, c, a) {
        CKEDITOR.stylesSet.addExternal(b, c, "");
        CKEDITOR.stylesSet.load(b, a)
    },
    CKEDITOR.editor.prototype.getStylesSet = function (b) {
        if (this._.stylesDefinitions)b(this._.stylesDefinitions); else {
            var c = this, a = c.config.stylesCombo_stylesSet ||
                c.config.stylesSet || "default";
            if (a instanceof Array) {
                c._.stylesDefinitions = a;
                b(a)
            } else {
                var a = a.split(":"), h = a[0];
                CKEDITOR.stylesSet.addExternal(h, a[1] ? a.slice(1).join(":") : CKEDITOR.getUrl("styles.js"), "");
                CKEDITOR.stylesSet.load(h, function (a) {
                    c._.stylesDefinitions = a[h];
                    b(c._.stylesDefinitions)
                })
            }
        }
    },
    CKEDITOR.dom.comment = function (b, c) {
        typeof b == "string" && (b = (c ? c.$ : document).createComment(b));
        CKEDITOR.dom.domObject.call(this, b)
    },
    CKEDITOR.dom.comment.prototype = new CKEDITOR.dom.node,CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype,
        {type: CKEDITOR.NODE_COMMENT, getOuterHtml: function () {
            return"<\!--" + this.$.nodeValue + "--\>"
        }}),function () {
        var b = {}, c;
        for (c in CKEDITOR.dtd.$blockLimit)c in CKEDITOR.dtd.$list || (b[c] = 1);
        var a = {};
        for (c in CKEDITOR.dtd.$block)c in CKEDITOR.dtd.$blockLimit || c in CKEDITOR.dtd.$empty || (a[c] = 1);
        CKEDITOR.dom.elementPath = function (c, f) {
            var g = null, e = null, i = [], f = f || c.getDocument().getBody(), d = c;
            do if (d.type == CKEDITOR.NODE_ELEMENT) {
                i.push(d);
                if (!this.lastElement) {
                    this.lastElement = d;
                    if (d.is(CKEDITOR.dtd.$object))continue
                }
                var j =
                    d.getName();
                if (!e) {
                    !g && a[j] && (g = d);
                    if (b[j]) {
                        var k;
                        if (k = !g) {
                            if (j = j == "div") {
                                a:{
                                    j = d.getChildren();
                                    k = 0;
                                    for (var l = j.count(); k < l; k++) {
                                        var m = j.getItem(k);
                                        if (m.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[m.getName()]) {
                                            j = true;
                                            break a
                                        }
                                    }
                                    j = false
                                }
                                j = !j && !d.equals(f)
                            }
                            k = j
                        }
                        k ? g = d : e = d
                    }
                }
                if (d.equals(f))break
            } while (d = d.getParent());
            this.block = g;
            this.blockLimit = e;
            this.root = f;
            this.elements = i
        }
    }(),CKEDITOR.dom.elementPath.prototype = {compare: function (b) {
        var c = this.elements, b = b && b.elements;
        if (!b || c.length != b.length)return false;
        for (var a = 0; a < c.length; a++)if (!c[a].equals(b[a]))return false;
        return true
    }, contains: function (b, c, a) {
        var h;
        typeof b == "string" && (h = function (a) {
            return a.getName() == b
        });
        b instanceof CKEDITOR.dom.element ? h = function (a) {
            return a.equals(b)
        } : CKEDITOR.tools.isArray(b) ? h = function (a) {
            return CKEDITOR.tools.indexOf(b, a.getName()) > -1
        } : typeof b == "function" ? h = b : typeof b == "object" && (h = function (a) {
            return a.getName()in b
        });
        var f = this.elements, g = f.length;
        c && g--;
        if (a) {
            f = Array.prototype.slice.call(f, 0);
            f.reverse()
        }
        for (c =
                 0; c < g; c++)if (h(f[c]))return f[c];
        return null
    }, isContextFor: function (b) {
        var c;
        if (b in CKEDITOR.dtd.$block) {
            c = this.contains(CKEDITOR.dtd.$intermediate) || this.root.equals(this.block) && this.block || this.blockLimit;
            return!!c.getDtd()[b]
        }
        return true
    }, direction: function () {
        return(this.block || this.blockLimit || this.root).getDirection(1)
    }},CKEDITOR.dom.text = function (b, c) {
        typeof b == "string" && (b = (c ? c.$ : document).createTextNode(b));
        this.$ = b
    },CKEDITOR.dom.text.prototype = new CKEDITOR.dom.node,CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype,
        {type: CKEDITOR.NODE_TEXT, getLength: function () {
            return this.$.nodeValue.length
        }, getText: function () {
            return this.$.nodeValue
        }, setText: function (b) {
            this.$.nodeValue = b
        }, split: function (b) {
            var c = this.$.parentNode, a = c.childNodes.length, h = this.getLength(), f = this.getDocument(), g = new CKEDITOR.dom.text(this.$.splitText(b), f);
            if (c.childNodes.length == a)if (b >= h) {
                g = f.createText("");
                g.insertAfter(this)
            } else {
                b = f.createText("");
                b.insertAfter(g);
                b.remove()
            }
            return g
        }, substring: function (b, c) {
            return typeof c != "number" ? this.$.nodeValue.substr(b) :
                this.$.nodeValue.substring(b, c)
        }}),function () {
        function b(a, b, c) {
            var g = a.serializable, e = b[c ? "endContainer" : "startContainer"], i = c ? "endOffset" : "startOffset", d = g ? b.document.getById(a.startNode) : a.startNode, a = g ? b.document.getById(a.endNode) : a.endNode;
            if (e.equals(d.getPrevious())) {
                b.startOffset = b.startOffset - e.getLength() - a.getPrevious().getLength();
                e = a.getNext()
            } else if (e.equals(a.getPrevious())) {
                b.startOffset = b.startOffset - e.getLength();
                e = a.getNext()
            }
            e.equals(d.getParent()) && b[i]++;
            e.equals(a.getParent()) &&
            b[i]++;
            b[c ? "endContainer" : "startContainer"] = e;
            return b
        }

        CKEDITOR.dom.rangeList = function (a) {
            if (a instanceof CKEDITOR.dom.rangeList)return a;
            a ? a instanceof CKEDITOR.dom.range && (a = [a]) : a = [];
            return CKEDITOR.tools.extend(a, c)
        };
        var c = {createIterator: function () {
            var a = this, b = CKEDITOR.dom.walker.bookmark(), c = [], g;
            return{getNextRange: function (e) {
                g = g == void 0 ? 0 : g + 1;
                var i = a[g];
                if (i && a.length > 1) {
                    if (!g)for (var d = a.length - 1; d >= 0; d--)c.unshift(a[d].createBookmark(true));
                    if (e)for (var j = 0; a[g + j + 1];) {
                        for (var k = i.document,
                                 e = 0, d = k.getById(c[j].endNode), k = k.getById(c[j + 1].startNode); ;) {
                            d = d.getNextSourceNode(false);
                            if (k.equals(d))e = 1; else if (b(d) || d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary())continue;
                            break
                        }
                        if (!e)break;
                        j++
                    }
                    for (i.moveToBookmark(c.shift()); j--;) {
                        d = a[++g];
                        d.moveToBookmark(c.shift());
                        i.setEnd(d.endContainer, d.endOffset)
                    }
                }
                return i
            }}
        }, createBookmarks: function (a) {
            for (var c = [], f, g = 0; g < this.length; g++) {
                c.push(f = this[g].createBookmark(a, true));
                for (var e = g + 1; e < this.length; e++) {
                    this[e] = b(f, this[e]);
                    this[e] =
                        b(f, this[e], true)
                }
            }
            return c
        }, createBookmarks2: function (a) {
            for (var b = [], c = 0; c < this.length; c++)b.push(this[c].createBookmark2(a));
            return b
        }, moveToBookmarks: function (a) {
            for (var b = 0; b < this.length; b++)this[b].moveToBookmark(a[b])
        }}
    }(),function () {
        function b() {
            return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1] || "skins/" + CKEDITOR.skinName.split(",")[0] + "/")
        }

        function c(a) {
            var d = CKEDITOR.skin["ua_" + a], e = CKEDITOR.env;
            if (d)for (var d = d.split(",").sort(function (a, b) {
                return a > b ? -1 : 1
            }), c = 0, f; c < d.length; c++) {
                f =
                    d[c];
                if (e.ie && (f.replace(/^ie/, "") == e.version || e.quirks && f == "iequirks"))f = "ie";
                if (e[f]) {
                    a = a + ("_" + d[c]);
                    break
                }
            }
            return CKEDITOR.getUrl(b() + a + ".css")
        }

        function a(a, b) {
            if (!g[a]) {
                CKEDITOR.document.appendStyleSheet(c(a));
                g[a] = 1
            }
            b && b()
        }

        function h(a) {
            var b = a.getById(e);
            if (!b) {
                b = a.getHead().append("style");
                b.setAttribute("id", e);
                b.setAttribute("type", "text/css")
            }
            return b
        }

        function f(a, b, d) {
            var e, c, f;
            if (CKEDITOR.env.webkit) {
                b = b.split("}").slice(0, -1);
                for (c = 0; c < b.length; c++)b[c] = b[c].split("{")
            }
            for (var i = 0; i <
                a.length; i++)if (CKEDITOR.env.webkit)for (c = 0; c < b.length; c++) {
                f = b[c][1];
                for (e = 0; e < d.length; e++)f = f.replace(d[e][0], d[e][1]);
                a[i].$.sheet.addRule(b[c][0], f)
            } else {
                f = b;
                for (e = 0; e < d.length; e++)f = f.replace(d[e][0], d[e][1]);
                CKEDITOR.env.ie ? a[i].$.styleSheet.cssText = a[i].$.styleSheet.cssText + f : a[i].$.innerHTML = a[i].$.innerHTML + f
            }
        }

        var g = {};
        CKEDITOR.skin = {path: b, loadPart: function (d, e) {
            CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0] ? CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(b() + "skin.js"), function () {
                a(d,
                    e)
            }) : a(d, e)
        }, getPath: function (a) {
            return CKEDITOR.getUrl(c(a))
        }, icons: {}, addIcon: function (a, b, d) {
            a = a.toLowerCase();
            this.icons[a] || (this.icons[a] = {path: b, offset: d || 0})
        }, getIconStyle: function (a, b, d, e) {
            var c;
            if (a) {
                a = a.toLowerCase();
                b && (c = this.icons[a + "-rtl"]);
                c || (c = this.icons[a])
            }
            a = d || c && c.path || "";
            e = e || c && c.offset;
            return a && "background-image:url(" + CKEDITOR.getUrl(a) + ");background-position:0 " + e + "px;"
        }};
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {getUiColor: function () {
            return this.uiColor
        }, setUiColor: function (a) {
            var b =
                h(CKEDITOR.document);
            return(this.setUiColor = function (a) {
                var e = CKEDITOR.skin.chameleon, c = [
                    [d, a]
                ];
                this.uiColor = a;
                f([b], e(this, "editor"), c);
                f(i, e(this, "panel"), c)
            }).call(this, a)
        }});
        var e = "cke_ui_color", i = [], d = /\$color/g;
        CKEDITOR.on("instanceLoaded", function (a) {
            if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
                var b = a.editor, a = function (a) {
                    a = (a.data[0] || a.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument();
                    if (!a.getById("cke_ui_color")) {
                        a = h(a);
                        i.push(a);
                        var e = b.getUiColor();
                        e && f([a], CKEDITOR.skin.chameleon(b,
                            "panel"), [
                            [d, e]
                        ])
                    }
                };
                b.on("panelShow", a);
                b.on("menuShow", a);
                b.config.uiColor && b.setUiColor(b.config.uiColor)
            }
        })
    }(),function () {
        if (CKEDITOR.env.webkit)CKEDITOR.env.hc = false; else {
            var b = CKEDITOR.dom.element.createFromHtml('<div style="width:0px;height:0px;position:absolute;left:-10000px;border: 1px solid;border-color: red blue;"></div>', CKEDITOR.document);
            b.appendTo(CKEDITOR.document.getHead());
            try {
                CKEDITOR.env.hc = b.getComputedStyle("border-top-color") == b.getComputedStyle("border-right-color")
            } catch (c) {
                CKEDITOR.env.hc =
                    false
            }
            b.remove()
        }
        if (CKEDITOR.env.hc)CKEDITOR.env.cssClass = CKEDITOR.env.cssClass + " cke_hc";
        CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
        CKEDITOR.status = "loaded";
        CKEDITOR.fireOnce("loaded");
        if (b = CKEDITOR._.pending) {
            delete CKEDITOR._.pending;
            for (var a = 0; a < b.length; a++) {
                CKEDITOR.editor.prototype.constructor.apply(b[a][0], b[a][1]);
                CKEDITOR.add(b[a][0])
            }
        }
    }(),CKEDITOR.skin.name = "moono",CKEDITOR.skin.ua_editor = "ie,iequirks,ie7,ie8,gecko",CKEDITOR.skin.ua_dialog = "ie,iequirks,ie7,ie8,opera",
    CKEDITOR.skin.chameleon = function () {
        var b = function () {
            return function (a, b) {
                for (var c = a.match(/[^#]./g), e = 0; e < 3; e++) {
                    var i = c, d = e, j;
                    j = parseInt(c[e], 16);
                    j = ("0" + (b < 0 ? 0 | j * (1 + b) : 0 | j + (255 - j) * b).toString(16)).slice(-2);
                    i[d] = j
                }
                return"#" + c.join("")
            }
        }(), c = function () {
            var a = new CKEDITOR.template("background:#{to};background-image:-webkit-gradient(linear,lefttop,leftbottom,from({from}),to({to}));background-image:-moz-linear-gradient(top,{from},{to});background-image:-webkit-linear-gradient(top,{from},{to});background-image:-o-linear-gradient(top,{from},{to});background-image:-ms-linear-gradient(top,{from},{to});background-image:linear-gradient(top,{from},{to});filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='{from}',endColorstr='{to}');");
            return function (b, c) {
                return a.output({from: b, to: c})
            }
        }(), a = {editor: new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ {defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_bottom [{defaultGradient}border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [{defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [{defaultGradient}outline-color:{defaultBorder};border-top-color:{defaultBorder};] {id} .cke_dialog_tab [{lightGradient}border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [{mediumGradient}] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} .cke_toolgroup [{lightGradient}border-color:{defaultBorder};] {id} a.cke_button_off:hover, {id} a.cke_button_off:focus, {id} a.cke_button_off:active [{mediumGradient}] {id} .cke_button_on [{ckeButtonOn}] {id} .cke_toolbar_separator [background-color: {ckeToolbarSeparator};] {id} .cke_combo_button [border-color:{defaultBorder};{lightGradient}] {id} a.cke_combo_button:hover, {id} a.cke_combo_button:focus, {id} .cke_combo_on a.cke_combo_button [border-color:{defaultBorder};{mediumGradient}] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover, {id} a.cke_path_item:focus, {id} a.cke_path_item:active [background-color:{elementsPathBg};] {id}.cke_panel [border-color:{defaultBorder};] "),
            panel: new CKEDITOR.template(".cke_panel_grouptitle [{lightGradient}border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:focus.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:focus.cke_colorauto, a:focus.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")};
        return function (h, f) {
            var g = h.uiColor, g = {id: "." + h.id, defaultBorder: b(g, -0.1), defaultGradient: c(b(g, 0.9), g), lightGradient: c(b(g, 1), b(g, 0.7)), mediumGradient: c(b(g, 0.8), b(g, 0.5)), ckeButtonOn: c(b(g, 0.6), b(g, 0.7)), ckeResizer: b(g, -0.4), ckeToolbarSeparator: b(g, 0.5), ckeColorauto: b(g, 0.8), dialogBody: b(g, 0.7), dialogTabSelected: c("#FFFFFF", "#FFFFFF"), dialogTabSelectedBorder: "#FFF", elementsPathColor: b(g, -0.6), elementsPathBg: g, menubuttonIcon: b(g, 0.5), menubuttonIconHover: b(g, 0.3)};
            return a[f].output(g).replace(/\[/g,
                "{").replace(/\]/g, "}")
        }
    }(),CKEDITOR.plugins.add("dialogui", {onLoad: function () {
        var b = function (a) {
            this._ || (this._ = {});
            this._["default"] = this._.initValue = a["default"] || "";
            this._.required = a.required || false;
            for (var b = [this._], e = 1; e < arguments.length; e++)b.push(arguments[e]);
            b.push(true);
            CKEDITOR.tools.extend.apply(CKEDITOR.tools, b);
            return this._
        }, c = {build: function (a, b, e) {
            return new CKEDITOR.ui.dialog.textInput(a, b, e)
        }}, a = {build: function (a, b, e) {
            return new CKEDITOR.ui.dialog[b.type](a, b, e)
        }}, h = {isChanged: function () {
            return this.getValue() !=
                this.getInitValue()
        }, reset: function (a) {
            this.setValue(this.getInitValue(), a)
        }, setInitValue: function () {
            this._.initValue = this.getValue()
        }, resetInitValue: function () {
            this._.initValue = this._["default"]
        }, getInitValue: function () {
            return this._.initValue
        }}, f = CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {onChange: function (a, b) {
            if (!this._.domOnChangeRegistered) {
                a.on("load", function () {
                    this.getInputElement().on("change", function () {
                        a.parts.dialog.isVisible() && this.fire("change",
                            {value: this.getValue()})
                    }, this)
                }, this);
                this._.domOnChangeRegistered = true
            }
            this.on("change", b)
        }}, true), g = /^on([A-Z]\w+)/, e = function (a) {
            for (var b in a)(g.test(b) || b == "title" || b == "type") && delete a[b];
            return a
        };
        CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {labeledElement: function (a, d, e, c) {
            if (!(arguments.length < 4)) {
                var f = b.call(this, d);
                f.labelId = CKEDITOR.tools.getNextId() + "_label";
                this._.children = [];
                CKEDITOR.ui.dialog.uiElement.call(this, a, d, e, "div", null, {role: "presentation"}, function () {
                    var b = [], e = d.required ?
                        " cke_required" : "";
                    if (d.labelLayout != "horizontal")b.push('<label class="cke_dialog_ui_labeled_label' + e + '" ', ' id="' + f.labelId + '"', f.inputId ? ' for="' + f.inputId + '"' : "", (d.labelStyle ? ' style="' + d.labelStyle + '"' : "") + ">", d.label, "</label>", '<div class="cke_dialog_ui_labeled_content"' + (d.controlStyle ? ' style="' + d.controlStyle + '"' : "") + ' role="presentation">', c.call(this, a, d), "</div>"); else {
                        e = {type: "hbox", widths: d.widths, padding: 0, children: [
                            {type: "html", html: '<label class="cke_dialog_ui_labeled_label' + e +
                                '" id="' + f.labelId + '" for="' + f.inputId + '"' + (d.labelStyle ? ' style="' + d.labelStyle + '"' : "") + ">" + CKEDITOR.tools.htmlEncode(d.label) + "</span>"},
                            {type: "html", html: '<span class="cke_dialog_ui_labeled_content"' + (d.controlStyle ? ' style="' + d.controlStyle + '"' : "") + ">" + c.call(this, a, d) + "</span>"}
                        ]};
                        CKEDITOR.dialog._.uiElementBuilders.hbox.build(a, e, b)
                    }
                    return b.join("")
                })
            }
        }, textInput: function (a, d, e) {
            if (!(arguments.length < 3)) {
                b.call(this, d);
                var c = this._.inputId = CKEDITOR.tools.getNextId() + "_textInput", f = {"class": "cke_dialog_ui_input_" +
                    d.type, id: c, type: d.type};
                if (d.validate)this.validate = d.validate;
                if (d.maxLength)f.maxlength = d.maxLength;
                if (d.size)f.size = d.size;
                if (d.inputStyle)f.style = d.inputStyle;
                var g = this, h = false;
                a.on("load", function () {
                    g.getInputElement().on("keydown", function (a) {
                        a.data.getKeystroke() == 13 && (h = true)
                    });
                    g.getInputElement().on("keyup", function (b) {
                        if (b.data.getKeystroke() == 13 && h) {
                            a.getButton("ok") && setTimeout(function () {
                                a.getButton("ok").click()
                            }, 0);
                            h = false
                        }
                    }, null, null, 1E3)
                });
                CKEDITOR.ui.dialog.labeledElement.call(this,
                    a, d, e, function () {
                        var a = ['<div class="cke_dialog_ui_input_', d.type, '" role="presentation"'];
                        d.width && a.push('style="width:' + d.width + '" ');
                        a.push("><input ");
                        f["aria-labelledby"] = this._.labelId;
                        this._.required && (f["aria-required"] = this._.required);
                        for (var b in f)a.push(b + '="' + f[b] + '" ');
                        a.push(" /></div>");
                        return a.join("")
                    })
            }
        }, textarea: function (a, d, e) {
            if (!(arguments.length < 3)) {
                b.call(this, d);
                var c = this, f = this._.inputId = CKEDITOR.tools.getNextId() + "_textarea", g = {};
                if (d.validate)this.validate = d.validate;
                g.rows = d.rows || 5;
                g.cols = d.cols || 20;
                if (typeof d.inputStyle != "undefined")g.style = d.inputStyle;
                CKEDITOR.ui.dialog.labeledElement.call(this, a, d, e, function () {
                    g["aria-labelledby"] = this._.labelId;
                    this._.required && (g["aria-required"] = this._.required);
                    var a = ['<div class="cke_dialog_ui_input_textarea" role="presentation"><textarea class="cke_dialog_ui_input_textarea" id="', f, '" '], b;
                    for (b in g)a.push(b + '="' + CKEDITOR.tools.htmlEncode(g[b]) + '" ');
                    a.push(">", CKEDITOR.tools.htmlEncode(c._["default"]), "</textarea></div>");
                    return a.join("")
                })
            }
        }, checkbox: function (a, d, c) {
            if (!(arguments.length < 3)) {
                var f = b.call(this, d, {"default": !!d["default"]});
                if (d.validate)this.validate = d.validate;
                CKEDITOR.ui.dialog.uiElement.call(this, a, d, c, "span", null, null, function () {
                    var b = CKEDITOR.tools.extend({}, d, {id: d.id ? d.id + "_checkbox" : CKEDITOR.tools.getNextId() + "_checkbox"}, true), c = [], g = CKEDITOR.tools.getNextId() + "_label", h = {"class": "cke_dialog_ui_checkbox_input", type: "checkbox", "aria-labelledby": g};
                    e(b);
                    if (d["default"])h.checked = "checked";
                    if (typeof b.inputStyle != "undefined")b.style = b.inputStyle;
                    f.checkbox = new CKEDITOR.ui.dialog.uiElement(a, b, c, "input", null, h);
                    c.push(' <label id="', g, '" for="', h.id, '"' + (d.labelStyle ? ' style="' + d.labelStyle + '"' : "") + ">", CKEDITOR.tools.htmlEncode(d.label), "</label>");
                    return c.join("")
                })
            }
        }, radio: function (a, d, c) {
            if (!(arguments.length < 3)) {
                b.call(this, d);
                if (!this._["default"])this._["default"] = this._.initValue = d.items[0][1];
                if (d.validate)this.validate = d.valdiate;
                var f = [], g = this;
                CKEDITOR.ui.dialog.labeledElement.call(this,
                    a, d, c, function () {
                        for (var b = [], c = [], h = d.id ? d.id + "_radio" : CKEDITOR.tools.getNextId() + "_radio", j = 0; j < d.items.length; j++) {
                            var r = d.items[j], p = r[2] !== void 0 ? r[2] : r[0], t = r[1] !== void 0 ? r[1] : r[0], x = CKEDITOR.tools.getNextId() + "_radio_input", A = x + "_label", x = CKEDITOR.tools.extend({}, d, {id: x, title: null, type: null}, true), p = CKEDITOR.tools.extend({}, x, {title: p}, true), v = {type: "radio", "class": "cke_dialog_ui_radio_input", name: h, value: t, "aria-labelledby": A}, w = [];
                            if (g._["default"] == t)v.checked = "checked";
                            e(x);
                            e(p);
                            if (typeof x.inputStyle !=
                                "undefined")x.style = x.inputStyle;
                            f.push(new CKEDITOR.ui.dialog.uiElement(a, x, w, "input", null, v));
                            w.push(" ");
                            new CKEDITOR.ui.dialog.uiElement(a, p, w, "label", null, {id: A, "for": v.id}, r[0]);
                            b.push(w.join(""))
                        }
                        new CKEDITOR.ui.dialog.hbox(a, f, b, c);
                        return c.join("")
                    });
                this._.children = f
            }
        }, button: function (a, d, e) {
            if (arguments.length) {
                typeof d == "function" && (d = d(a.getParentEditor()));
                b.call(this, d, {disabled: d.disabled || false});
                CKEDITOR.event.implementOn(this);
                var c = this;
                a.on("load", function () {
                    var a = this.getElement();
                    (function () {
                        a.on("click", c.click, c);
                        a.on("keydown", function (a) {
                            if (a.data.getKeystroke()in{32: 1}) {
                                c.click();
                                a.data.preventDefault()
                            }
                        })
                    })();
                    a.unselectable()
                }, this);
                var f = CKEDITOR.tools.extend({}, d);
                delete f.style;
                var g = CKEDITOR.tools.getNextId() + "_label";
                CKEDITOR.ui.dialog.uiElement.call(this, a, f, e, "a", null, {style: d.style, href: "javascript:void(0)", title: d.label, hidefocus: "true", "class": d["class"], role: "button", "aria-labelledby": g}, '<span id="' + g + '" class="cke_dialog_ui_button">' + CKEDITOR.tools.htmlEncode(d.label) +
                    "</span>")
            }
        }, select: function (a, d, c) {
            if (!(arguments.length < 3)) {
                var f = b.call(this, d);
                if (d.validate)this.validate = d.validate;
                f.inputId = CKEDITOR.tools.getNextId() + "_select";
                CKEDITOR.ui.dialog.labeledElement.call(this, a, d, c, function () {
                    var b = CKEDITOR.tools.extend({}, d, {id: d.id ? d.id + "_select" : CKEDITOR.tools.getNextId() + "_select"}, true), c = [], g = [], h = {id: f.inputId, "class": "cke_dialog_ui_input_select", "aria-labelledby": this._.labelId};
                    c.push('<div class="cke_dialog_ui_input_', d.type, '" role="presentation"');
                    d.width && c.push('style="width:' + d.width + '" ');
                    c.push(">");
                    if (d.size != void 0)h.size = d.size;
                    if (d.multiple != void 0)h.multiple = d.multiple;
                    e(b);
                    for (var j = 0, r; j < d.items.length && (r = d.items[j]); j++)g.push('<option value="', CKEDITOR.tools.htmlEncode(r[1] !== void 0 ? r[1] : r[0]).replace(/"/g, "&quot;"), '" /> ', CKEDITOR.tools.htmlEncode(r[0]));
                    if (typeof b.inputStyle != "undefined")b.style = b.inputStyle;
                    f.select = new CKEDITOR.ui.dialog.uiElement(a, b, c, "select", null, h, g.join(""));
                    c.push("</div>");
                    return c.join("")
                })
            }
        },
            file: function (a, d, e) {
                if (!(arguments.length < 3)) {
                    d["default"] === void 0 && (d["default"] = "");
                    var c = CKEDITOR.tools.extend(b.call(this, d), {definition: d, buttons: []});
                    if (d.validate)this.validate = d.validate;
                    a.on("load", function () {
                        CKEDITOR.document.getById(c.frameId).getParent().addClass("cke_dialog_ui_input_file")
                    });
                    CKEDITOR.ui.dialog.labeledElement.call(this, a, d, e, function () {
                        c.frameId = CKEDITOR.tools.getNextId() + "_fileInput";
                        var a = CKEDITOR.env.isCustomDomain(), b = ['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" role="presentation" id="',
                            c.frameId, '" title="', d.label, '" src="javascript:void('];
                        b.push(a ? "(function(){document.open();document.domain='" + document.domain + "';document.close();})()" : "0");
                        b.push(')"></iframe>');
                        return b.join("")
                    })
                }
            }, fileButton: function (a, d, e) {
                if (!(arguments.length < 3)) {
                    b.call(this, d);
                    var c = this;
                    if (d.validate)this.validate = d.validate;
                    var f = CKEDITOR.tools.extend({}, d), g = f.onClick;
                    f.className = (f.className ? f.className + " " : "") + "cke_dialog_ui_button";
                    f.onClick = function (b) {
                        var e = d["for"];
                        if (!g || g.call(this, b) !== false) {
                            a.getContentElement(e[0],
                                e[1]).submit();
                            this.disable()
                        }
                    };
                    a.on("load", function () {
                        a.getContentElement(d["for"][0], d["for"][1])._.buttons.push(c)
                    });
                    CKEDITOR.ui.dialog.button.call(this, a, f, e)
                }
            }, html: function () {
                var a = /^\s*<[\w:]+\s+([^>]*)?>/, b = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/, e = /\/$/;
                return function (c, f, g) {
                    if (!(arguments.length < 3)) {
                        var h = [], o = f.html;
                        o.charAt(0) != "<" && (o = "<span>" + o + "</span>");
                        var s = f.focus;
                        if (s) {
                            var r = this.focus;
                            this.focus = function () {
                                (typeof s == "function" ? s : r).call(this);
                                this.fire("focus")
                            };
                            if (f.isFocusable)this.isFocusable =
                                this.isFocusable;
                            this.keyboardFocusable = true
                        }
                        CKEDITOR.ui.dialog.uiElement.call(this, c, f, h, "span", null, null, "");
                        h = h.join("").match(a);
                        o = o.match(b) || ["", "", ""];
                        if (e.test(o[1])) {
                            o[1] = o[1].slice(0, -1);
                            o[2] = "/" + o[2]
                        }
                        g.push([o[1], " ", h[1] || "", o[2]].join(""))
                    }
                }
            }(), fieldset: function (a, b, e, c, f) {
                var g = f.label;
                this._ = {children: b};
                CKEDITOR.ui.dialog.uiElement.call(this, a, f, c, "fieldset", null, null, function () {
                    var a = [];
                    g && a.push("<legend" + (f.labelStyle ? ' style="' + f.labelStyle + '"' : "") + ">" + g + "</legend>");
                    for (var b =
                        0; b < e.length; b++)a.push(e[b]);
                    return a.join("")
                })
            }}, true);
        CKEDITOR.ui.dialog.html.prototype = new CKEDITOR.ui.dialog.uiElement;
        CKEDITOR.ui.dialog.labeledElement.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {setLabel: function (a) {
            var b = CKEDITOR.document.getById(this._.labelId);
            b.getChildCount() < 1 ? (new CKEDITOR.dom.text(a, CKEDITOR.document)).appendTo(b) : b.getChild(0).$.nodeValue = a;
            return this
        }, getLabel: function () {
            var a = CKEDITOR.document.getById(this._.labelId);
            return!a || a.getChildCount() <
                1 ? "" : a.getChild(0).getText()
        }, eventProcessors: f}, true);
        CKEDITOR.ui.dialog.button.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {click: function () {
            return!this._.disabled ? this.fire("click", {dialog: this._.dialog}) : false
        }, enable: function () {
            this._.disabled = false;
            var a = this.getElement();
            a && a.removeClass("cke_disabled")
        }, disable: function () {
            this._.disabled = true;
            this.getElement().addClass("cke_disabled")
        }, isVisible: function () {
            return this.getElement().getFirst().isVisible()
        }, isEnabled: function () {
            return!this._.disabled
        },
            eventProcessors: CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {onClick: function (a, b) {
                this.on("click", function () {
                    b.apply(this, arguments)
                })
            }}, true), accessKeyUp: function () {
                this.click()
            }, accessKeyDown: function () {
                this.focus()
            }, keyboardFocusable: true}, true);
        CKEDITOR.ui.dialog.textInput.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {getInputElement: function () {
            return CKEDITOR.document.getById(this._.inputId)
        }, focus: function () {
            var a = this.selectParentTab();
            setTimeout(function () {
                var b = a.getInputElement();
                b && b.$.focus()
            }, 0)
        }, select: function () {
            var a = this.selectParentTab();
            setTimeout(function () {
                var b = a.getInputElement();
                if (b) {
                    b.$.focus();
                    b.$.select()
                }
            }, 0)
        }, accessKeyUp: function () {
            this.select()
        }, setValue: function (a) {
            !a && (a = "");
            return CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(this, arguments)
        }, keyboardFocusable: true}, h, true);
        CKEDITOR.ui.dialog.textarea.prototype = new CKEDITOR.ui.dialog.textInput;
        CKEDITOR.ui.dialog.select.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement,
            {getInputElement: function () {
                return this._.select.getElement()
            }, add: function (a, b, e) {
                var c = new CKEDITOR.dom.element("option", this.getDialog().getParentEditor().document), f = this.getInputElement().$;
                c.$.text = a;
                c.$.value = b === void 0 || b === null ? a : b;
                e === void 0 || e === null ? CKEDITOR.env.ie ? f.add(c.$) : f.add(c.$, null) : f.add(c.$, e);
                return this
            }, remove: function (a) {
                this.getInputElement().$.remove(a);
                return this
            }, clear: function () {
                for (var a = this.getInputElement().$; a.length > 0;)a.remove(0);
                return this
            }, keyboardFocusable: true},
            h, true);
        CKEDITOR.ui.dialog.checkbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {getInputElement: function () {
            return this._.checkbox.getElement()
        }, setValue: function (a, b) {
            this.getInputElement().$.checked = a;
            !b && this.fire("change", {value: a})
        }, getValue: function () {
            return this.getInputElement().$.checked
        }, accessKeyUp: function () {
            this.setValue(!this.getValue())
        }, eventProcessors: {onChange: function (a, b) {
            if (!CKEDITOR.env.ie || CKEDITOR.env.version > 8)return f.onChange.apply(this, arguments);
            a.on("load",
                function () {
                    var a = this._.checkbox.getElement();
                    a.on("propertychange", function (b) {
                        b = b.data.$;
                        b.propertyName == "checked" && this.fire("change", {value: a.$.checked})
                    }, this)
                }, this);
            this.on("change", b);
            return null
        }}, keyboardFocusable: true}, h, true);
        CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {setValue: function (a, b) {
            for (var e = this._.children, c, f = 0; f < e.length && (c = e[f]); f++)c.getElement().$.checked = c.getValue() == a;
            !b && this.fire("change", {value: a})
        }, getValue: function () {
            for (var a =
                this._.children, b = 0; b < a.length; b++)if (a[b].getElement().$.checked)return a[b].getValue();
            return null
        }, accessKeyUp: function () {
            var a = this._.children, b;
            for (b = 0; b < a.length; b++)if (a[b].getElement().$.checked) {
                a[b].getElement().focus();
                return
            }
            a[0].getElement().focus()
        }, eventProcessors: {onChange: function (a, b) {
            if (CKEDITOR.env.ie) {
                a.on("load", function () {
                    for (var a = this._.children, b = this, d = 0; d < a.length; d++)a[d].getElement().on("propertychange", function (a) {
                        a = a.data.$;
                        a.propertyName == "checked" && this.$.checked &&
                        b.fire("change", {value: this.getAttribute("value")})
                    })
                }, this);
                this.on("change", b)
            } else return f.onChange.apply(this, arguments);
            return null
        }}, keyboardFocusable: true}, h, true);
        CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, h, {getInputElement: function () {
            var a = CKEDITOR.document.getById(this._.frameId).getFrameDocument();
            return a.$.forms.length > 0 ? new CKEDITOR.dom.element(a.$.forms[0].elements[0]) : this.getElement()
        }, submit: function () {
            this.getInputElement().getParent().$.submit();
            return this
        }, getAction: function () {
            return this.getInputElement().getParent().$.action
        }, registerEvents: function (a) {
            var b = /^on([A-Z]\w+)/, e, c = function (a, b, d, e) {
                a.on("formLoaded", function () {
                    a.getInputElement().on(d, e, a)
                })
            }, f;
            for (f in a)if (e = f.match(b))this.eventProcessors[f] ? this.eventProcessors[f].call(this, this._.dialog, a[f]) : c(this, this._.dialog, e[1].toLowerCase(), a[f]);
            return this
        }, reset: function () {
            function a() {
                e.$.open();
                if (CKEDITOR.env.isCustomDomain())e.$.domain = document.domain;
                var i = "";
                c.size &&
                (i = c.size - (CKEDITOR.env.ie ? 7 : 0));
                var p = b.frameId + "_input";
                e.$.write(['<html dir="' + o + '" lang="' + s + '"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">', '<form enctype="multipart/form-data" method="POST" dir="' + o + '" lang="' + s + '" action="', CKEDITOR.tools.htmlEncode(c.action), '"><label id="', b.labelId, '" for="', p, '" style="display:none">', CKEDITOR.tools.htmlEncode(c.label), '</label><input id="', p, '" aria-labelledby="', b.labelId, '" type="file" name="', CKEDITOR.tools.htmlEncode(c.id ||
                    "cke_upload"), '" size="', CKEDITOR.tools.htmlEncode(i > 0 ? i : ""), '" /></form></body></html>', "<script>window.parent.CKEDITOR.tools.callFunction(" + g + ");", "window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction(" + h + ")}<\/script>"].join(""));
                e.$.close();
                for (i = 0; i < f.length; i++)f[i].enable()
            }

            var b = this._, e = CKEDITOR.document.getById(b.frameId).getFrameDocument(), c = b.definition, f = b.buttons, g = this.formLoadedNumber, h = this.formUnloadNumber, o = b.dialog._.editor.lang.dir, s = b.dialog._.editor.langCode;
            if (!g) {
                g = this.formLoadedNumber = CKEDITOR.tools.addFunction(function () {
                    this.fire("formLoaded")
                }, this);
                h = this.formUnloadNumber = CKEDITOR.tools.addFunction(function () {
                    this.getInputElement().clearCustomData()
                }, this);
                this.getDialog()._.editor.on("destroy", function () {
                    CKEDITOR.tools.removeFunction(g);
                    CKEDITOR.tools.removeFunction(h)
                })
            }
            CKEDITOR.env.gecko ? setTimeout(a, 500) : a()
        }, getValue: function () {
            return this.getInputElement().$.value || ""
        }, setInitValue: function () {
            this._.initValue = ""
        }, eventProcessors: {onChange: function (a, b) {
            if (!this._.domOnChangeRegistered) {
                this.on("formLoaded", function () {
                    this.getInputElement().on("change", function () {
                        this.fire("change", {value: this.getValue()})
                    }, this)
                }, this);
                this._.domOnChangeRegistered = true
            }
            this.on("change", b)
        }}, keyboardFocusable: true}, true);
        CKEDITOR.ui.dialog.fileButton.prototype = new CKEDITOR.ui.dialog.button;
        CKEDITOR.ui.dialog.fieldset.prototype = CKEDITOR.tools.clone(CKEDITOR.ui.dialog.hbox.prototype);
        CKEDITOR.dialog.addUIElement("text", c);
        CKEDITOR.dialog.addUIElement("password",
            c);
        CKEDITOR.dialog.addUIElement("textarea", a);
        CKEDITOR.dialog.addUIElement("checkbox", a);
        CKEDITOR.dialog.addUIElement("radio", a);
        CKEDITOR.dialog.addUIElement("button", a);
        CKEDITOR.dialog.addUIElement("select", a);
        CKEDITOR.dialog.addUIElement("file", a);
        CKEDITOR.dialog.addUIElement("fileButton", a);
        CKEDITOR.dialog.addUIElement("html", a);
        CKEDITOR.dialog.addUIElement("fieldset", {build: function (a, b, e) {
            for (var c = b.children, f, g = [], h = [], o = 0; o < c.length && (f = c[o]); o++) {
                var s = [];
                g.push(s);
                h.push(CKEDITOR.dialog._.uiElementBuilders[f.type].build(a,
                    f, s))
            }
            return new CKEDITOR.ui.dialog[b.type](a, h, g, e, b)
        }})
    }}),CKEDITOR.DIALOG_RESIZE_NONE = 0,CKEDITOR.DIALOG_RESIZE_WIDTH = 1,CKEDITOR.DIALOG_RESIZE_HEIGHT = 2,CKEDITOR.DIALOG_RESIZE_BOTH = 3,function () {
        function b() {
            for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + a, d = b - 1; d > b - a; d--)if (this._.tabs[this._.tabIdList[d % a]][0].$.offsetHeight)return this._.tabIdList[d % a];
            return null
        }

        function c() {
            for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList,
                this._.currentTabId), d = b + 1; d < b + a; d++)if (this._.tabs[this._.tabIdList[d % a]][0].$.offsetHeight)return this._.tabIdList[d % a];
            return null
        }

        function a(a, b) {
            for (var d = a.$.getElementsByTagName("input"), e = 0, c = d.length; e < c; e++) {
                var f = new CKEDITOR.dom.element(d[e]);
                if (f.getAttribute("type").toLowerCase() == "text")if (b) {
                    f.setAttribute("value", f.getCustomData("fake_value") || "");
                    f.removeCustomData("fake_value")
                } else {
                    f.setCustomData("fake_value", f.getAttribute("value"));
                    f.setAttribute("value", "")
                }
            }
        }

        function h(a, b) {
            var d = this.getInputElement();
            d && (a ? d.removeAttribute("aria-invalid") : d.setAttribute("aria-invalid", true));
            a || (this.select ? this.select() : this.focus());
            b && alert(b);
            this.fire("validated", {valid: a, msg: b})
        }

        function f() {
            var a = this.getInputElement();
            a && a.removeAttribute("aria-invalid")
        }

        function g(a) {
            var a = CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog", s).output({id: CKEDITOR.tools.getNextNumber(), editorId: a.id, langDir: a.lang.dir, langCode: a.langCode, editorDialogClass: "cke_editor_" + a.name.replace(/\./g,
                "\\.") + "_dialog", closeTitle: a.lang.common.close})), b = a.getChild([0, 0, 0, 0, 0]), d = b.getChild(0), e = b.getChild(1);
            if (CKEDITOR.env.ie && !CKEDITOR.env.ie6Compat) {
                var c = CKEDITOR.env.isCustomDomain(), c = "javascript:void(function(){" + encodeURIComponent("document.open();" + (c ? 'document.domain="' + document.domain + '";' : "") + "document.close();") + "}())";
                CKEDITOR.dom.element.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="' + c + '" tabIndex="-1"></iframe>').appendTo(b.getParent())
            }
            d.unselectable();
            e.unselectable();
            return{element: a, parts: {dialog: a.getChild(0), title: d, close: e, tabs: b.getChild(2), contents: b.getChild([3, 0, 0, 0]), footer: b.getChild([3, 0, 1, 0])}}
        }

        function e(a, b, d) {
            this.element = b;
            this.focusIndex = d;
            this.tabIndex = 0;
            this.isFocusable = function () {
                return!b.getAttribute("disabled") && b.isVisible()
            };
            this.focus = function () {
                a._.currentFocusIndex = this.focusIndex;
                this.element.focus()
            };
            b.on("keydown", function (a) {
                a.data.getKeystroke()in{32: 1, 13: 1} && this.fire("click")
            });
            b.on("focus", function () {
                this.fire("mouseover")
            });
            b.on("blur", function () {
                this.fire("mouseout")
            })
        }

        function i(a) {
            function b() {
                a.layout()
            }

            var d = CKEDITOR.document.getWindow();
            d.on("resize", b);
            a.on("hide", function () {
                d.removeListener("resize", b)
            })
        }

        function d(a, b) {
            this._ = {dialog: a};
            CKEDITOR.tools.extend(this, b)
        }

        function j(a) {
            function b(d) {
                var h = a.getSize(), j = CKEDITOR.document.getWindow().getViewPaneSize(), k = d.data.$.screenX, o = d.data.$.screenY, r = k - e.x, l = o - e.y;
                e = {x: k, y: o};
                c.x = c.x + r;
                c.y = c.y + l;
                a.move(c.x + i[3] < g ? -i[3] : c.x - i[1] > j.width - h.width - g ? j.width - h.width +
                    (f.lang.dir == "rtl" ? 0 : i[1]) : c.x, c.y + i[0] < g ? -i[0] : c.y - i[2] > j.height - h.height - g ? j.height - h.height + i[2] : c.y, 1);
                d.data.preventDefault()
            }

            function d() {
                CKEDITOR.document.removeListener("mousemove", b);
                CKEDITOR.document.removeListener("mouseup", d);
                if (CKEDITOR.env.ie6Compat) {
                    var a = q.getChild(0).getFrameDocument();
                    a.removeListener("mousemove", b);
                    a.removeListener("mouseup", d)
                }
            }

            var e = null, c = null;
            a.getElement().getFirst();
            var f = a.getParentEditor(), g = f.config.dialog_magnetDistance, i = CKEDITOR.skin.margins || [0, 0, 0,
                0];
            typeof g == "undefined" && (g = 20);
            a.parts.title.on("mousedown", function (f) {
                e = {x: f.data.$.screenX, y: f.data.$.screenY};
                CKEDITOR.document.on("mousemove", b);
                CKEDITOR.document.on("mouseup", d);
                c = a.getPosition();
                if (CKEDITOR.env.ie6Compat) {
                    var g = q.getChild(0).getFrameDocument();
                    g.on("mousemove", b);
                    g.on("mouseup", d)
                }
                f.data.preventDefault()
            }, a)
        }

        function k(a) {
            var b, d;

            function e(c) {
                var r = i.lang.dir == "rtl", l = o.width, p = o.height, s = l + (c.data.$.screenX - b) * (r ? -1 : 1) * (a._.moved ? 1 : 2), n = p + (c.data.$.screenY - d) * (a._.moved ?
                    1 : 2), t = a._.element.getFirst(), t = r && t.getComputedStyle("right"), m = a.getPosition();
                m.y + n > k.height && (n = k.height - m.y);
                if ((r ? t : m.x) + s > k.width)s = k.width - (r ? t : m.x);
                if (g == CKEDITOR.DIALOG_RESIZE_WIDTH || g == CKEDITOR.DIALOG_RESIZE_BOTH)l = Math.max(f.minWidth || 0, s - h);
                if (g == CKEDITOR.DIALOG_RESIZE_HEIGHT || g == CKEDITOR.DIALOG_RESIZE_BOTH)p = Math.max(f.minHeight || 0, n - j);
                a.resize(l, p);
                a._.moved || a.layout();
                c.data.preventDefault()
            }

            function c() {
                CKEDITOR.document.removeListener("mouseup", c);
                CKEDITOR.document.removeListener("mousemove",
                    e);
                if (r) {
                    r.remove();
                    r = null
                }
                if (CKEDITOR.env.ie6Compat) {
                    var a = q.getChild(0).getFrameDocument();
                    a.removeListener("mouseup", c);
                    a.removeListener("mousemove", e)
                }
            }

            var f = a.definition, g = f.resizable;
            if (g != CKEDITOR.DIALOG_RESIZE_NONE) {
                var i = a.getParentEditor(), h, j, k, o, r, l = CKEDITOR.tools.addFunction(function (f) {
                    o = a.getSize();
                    var g = a.parts.contents;
                    if (g.$.getElementsByTagName("iframe").length) {
                        r = CKEDITOR.dom.element.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>');
                        g.append(r)
                    }
                    j = o.height - a.parts.contents.getSize("height", !(CKEDITOR.env.gecko || CKEDITOR.env.opera || CKEDITOR.env.ie && CKEDITOR.env.quirks));
                    h = o.width - a.parts.contents.getSize("width", 1);
                    b = f.screenX;
                    d = f.screenY;
                    k = CKEDITOR.document.getWindow().getViewPaneSize();
                    CKEDITOR.document.on("mousemove", e);
                    CKEDITOR.document.on("mouseup", c);
                    if (CKEDITOR.env.ie6Compat) {
                        g = q.getChild(0).getFrameDocument();
                        g.on("mousemove", e);
                        g.on("mouseup", c)
                    }
                    f.preventDefault && f.preventDefault()
                });
                a.on("load", function () {
                    var b = "";
                    g ==
                    CKEDITOR.DIALOG_RESIZE_WIDTH ? b = " cke_resizer_horizontal" : g == CKEDITOR.DIALOG_RESIZE_HEIGHT && (b = " cke_resizer_vertical");
                    b = CKEDITOR.dom.element.createFromHtml('<div class="cke_resizer' + b + " cke_resizer_" + i.lang.dir + '" title="' + CKEDITOR.tools.htmlEncode(i.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + l + ', event )">' + (i.lang.dir == "ltr" ? "◢" : "◣") + "</div>");
                    a.parts.footer.append(b, 1)
                });
                i.on("destroy", function () {
                    CKEDITOR.tools.removeFunction(l)
                })
            }
        }

        function l(a) {
            a.data.preventDefault(1)
        }

        function m(a) {
            var b = CKEDITOR.document.getWindow(), d = a.config, e = d.dialog_backgroundCoverColor || "white", c = d.dialog_backgroundCoverOpacity, f = d.baseFloatZIndex, d = CKEDITOR.tools.genKey(e, c, f), g = w[d];
            if (g)g.show(); else {
                f = ['<div tabIndex="-1" style="position: ', CKEDITOR.env.ie6Compat ? "absolute" : "fixed", "; z-index: ", f, "; top: 0px; left: 0px; ", !CKEDITOR.env.ie6Compat ? "background-color: " + e : "", '" class="cke_dialog_background_cover">'];
                if (CKEDITOR.env.ie6Compat) {
                    var i = CKEDITOR.env.isCustomDomain(), e = "<html><body style=\\'background-color:" +
                        e + ";\\'></body></html>";
                    f.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:');
                    f.push("void((function(){document.open();" + (i ? "document.domain='" + document.domain + "';" : "") + "document.write( '" + e + "' );document.close();})())");
                    f.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>')
                }
                f.push("</div>");
                g = CKEDITOR.dom.element.createFromHtml(f.join(""));
                g.setOpacity(c != void 0 ?
                    c : 0.5);
                g.on("keydown", l);
                g.on("keypress", l);
                g.on("keyup", l);
                g.appendTo(CKEDITOR.document.getBody());
                w[d] = g
            }
            a.focusManager.add(g);
            q = g;
            var a = function () {
                var a = b.getViewPaneSize();
                g.setStyles({width: a.width + "px", height: a.height + "px"})
            }, h = function () {
                var a = b.getScrollPosition(), d = CKEDITOR.dialog._.currentTop;
                g.setStyles({left: a.x + "px", top: a.y + "px"});
                if (d) {
                    do {
                        a = d.getPosition();
                        d.move(a.x, a.y)
                    } while (d = d._.parentDialog)
                }
            };
            v = a;
            b.on("resize", a);
            a();
            (!CKEDITOR.env.mac || !CKEDITOR.env.webkit) && g.focus();
            if (CKEDITOR.env.ie6Compat) {
                var j =
                    function () {
                        h();
                        arguments.callee.prevScrollHandler.apply(this, arguments)
                    };
                b.$.setTimeout(function () {
                    j.prevScrollHandler = window.onscroll || function () {
                    };
                    window.onscroll = j
                }, 0);
                h()
            }
        }

        function n(a) {
            if (q) {
                a.focusManager.remove(q);
                a = CKEDITOR.document.getWindow();
                q.hide();
                a.removeListener("resize", v);
                CKEDITOR.env.ie6Compat && a.$.setTimeout(function () {
                    window.onscroll = window.onscroll && window.onscroll.prevScrollHandler || null
                }, 0);
                v = null
            }
        }

        var o = CKEDITOR.tools.cssLength, s = '<div class="cke cke_reset_all {editorId} {editorDialogClass}" dir="{langDir}" lang="{langCode}" role="application"><table class="cke_dialog ' +
            CKEDITOR.env.cssClass + ' cke_{langDir}" aria-labelledby="cke_dialog_title_{id}" style="position:absolute" role="dialog"><tr><td role="presentation"><div class="cke_dialog_body" role="presentation"><div id="cke_dialog_title_{id}" class="cke_dialog_title" role="presentation"></div><a id="cke_dialog_close_button_{id}" class="cke_dialog_close_button" href="javascript:void(0)" title="{closeTitle}" role="button"><span class="cke_label">X</span></a><div id="cke_dialog_tabs_{id}" class="cke_dialog_tabs" role="tablist"></div><table class="cke_dialog_contents" role="presentation"><tr><td id="cke_dialog_contents_{id}" class="cke_dialog_contents_body" role="presentation"></td></tr><tr><td id="cke_dialog_footer_{id}" class="cke_dialog_footer" role="presentation"></td></tr></table></div></td></tr></table></div>';
        CKEDITOR.dialog = function (a, d) {
            function e() {
                var a = q._.focusList;
                a.sort(function (a, b) {
                    return a.tabIndex != b.tabIndex ? b.tabIndex - a.tabIndex : a.focusIndex - b.focusIndex
                });
                for (var b = a.length, d = 0; d < b; d++)a[d].focusIndex = d
            }

            function i(a) {
                var b = q._.focusList, a = a || 0;
                if (!(b.length < 1)) {
                    var d = q._.currentFocusIndex;
                    try {
                        b[d].getInputElement().$.blur()
                    } catch (e) {
                    }
                    for (var c = d = (d + a + b.length) % b.length; a && !b[c].isFocusable();) {
                        c = (c + a + b.length) % b.length;
                        if (c == d)break
                    }
                    b[c].focus();
                    b[c].type == "text" && b[c].select()
                }
            }

            function o(d) {
                if (q ==
                    CKEDITOR.dialog._.currentTop) {
                    var e = d.data.getKeystroke(), f = a.lang.dir == "rtl";
                    x = v = 0;
                    if (e == 9 || e == CKEDITOR.SHIFT + 9) {
                        e = e == CKEDITOR.SHIFT + 9;
                        if (q._.tabBarMode) {
                            e = e ? b.call(q) : c.call(q);
                            q.selectPage(e);
                            q._.tabs[e][0].focus()
                        } else i(e ? -1 : 1);
                        x = 1
                    } else if (e == CKEDITOR.ALT + 121 && !q._.tabBarMode && q.getPageCount() > 1) {
                        q._.tabBarMode = true;
                        q._.tabs[q._.currentTabId][0].focus();
                        x = 1
                    } else if ((e == 37 || e == 39) && q._.tabBarMode) {
                        e = e == (f ? 39 : 37) ? b.call(q) : c.call(q);
                        q.selectPage(e);
                        q._.tabs[e][0].focus();
                        x = 1
                    } else if ((e == 13 || e ==
                        32) && q._.tabBarMode) {
                        this.selectPage(this._.currentTabId);
                        this._.tabBarMode = false;
                        this._.currentFocusIndex = -1;
                        i(1);
                        x = 1
                    } else if (e == 13) {
                        e = d.data.getTarget();
                        if (!e.is("a", "button", "select", "textarea") && (!e.is("input") || e.$.type != "button")) {
                            (e = this.getButton("ok")) && CKEDITOR.tools.setTimeout(e.click, 0, e);
                            x = 1
                        }
                        v = 1
                    } else if (e == 27) {
                        (e = this.getButton("cancel")) ? CKEDITOR.tools.setTimeout(e.click, 0, e) : this.fire("cancel", {hide: true}).hide !== false && this.hide();
                        v = 1
                    } else return;
                    l(d)
                }
            }

            function l(a) {
                x ? a.data.preventDefault(1) :
                    v && a.data.stopPropagation()
            }

            var p = CKEDITOR.dialog._.dialogDefinitions[d], s = CKEDITOR.tools.clone(r), n = a.config.dialog_buttonsOrder || "OS", t = a.lang.dir, m = {}, x, v;
            (n == "OS" && CKEDITOR.env.mac || n == "rtl" && t == "ltr" || n == "ltr" && t == "rtl") && s.buttons.reverse();
            p = CKEDITOR.tools.extend(p(a), s);
            p = CKEDITOR.tools.clone(p);
            p = new A(this, p);
            s = g(a);
            this._ = {editor: a, element: s.element, name: d, contentSize: {width: 0, height: 0}, size: {width: 0, height: 0}, contents: {}, buttons: {}, accessKeyMap: {}, tabs: {}, tabIdList: [], currentTabId: null,
                currentTabIndex: null, pageCount: 0, lastTab: null, tabBarMode: false, focusList: [], currentFocusIndex: 0, hasFocus: false};
            this.parts = s.parts;
            CKEDITOR.tools.setTimeout(function () {
                a.fire("ariaWidget", this.parts.contents)
            }, 0, this);
            s = {position: CKEDITOR.env.ie6Compat ? "absolute" : "fixed", top: 0, visibility: "hidden"};
            s[t == "rtl" ? "right" : "left"] = 0;
            this.parts.dialog.setStyles(s);
            CKEDITOR.event.call(this);
            this.definition = p = CKEDITOR.fire("dialogDefinition", {name: d, definition: p}, a).definition;
            if (!("removeDialogTabs"in a._) &&
                a.config.removeDialogTabs) {
                s = a.config.removeDialogTabs.split(";");
                for (t = 0; t < s.length; t++) {
                    n = s[t].split(":");
                    if (n.length == 2) {
                        var w = n[0];
                        m[w] || (m[w] = []);
                        m[w].push(n[1])
                    }
                }
                a._.removeDialogTabs = m
            }
            if (a._.removeDialogTabs && (m = a._.removeDialogTabs[d]))for (t = 0; t < m.length; t++)p.removeContents(m[t]);
            if (p.onLoad)this.on("load", p.onLoad);
            if (p.onShow)this.on("show", p.onShow);
            if (p.onHide)this.on("hide", p.onHide);
            if (p.onOk)this.on("ok", function (b) {
                a.fire("saveSnapshot");
                setTimeout(function () {
                        a.fire("saveSnapshot")
                    },
                    0);
                if (p.onOk.call(this, b) === false)b.data.hide = false
            });
            if (p.onCancel)this.on("cancel", function (a) {
                if (p.onCancel.call(this, a) === false)a.data.hide = false
            });
            var q = this, B = function (a) {
                var b = q._.contents, d = false, e;
                for (e in b)for (var c in b[e])if (d = a.call(this, b[e][c]))return
            };
            this.on("ok", function (a) {
                B(function (b) {
                    if (b.validate) {
                        var d = b.validate(this), e = typeof d == "string" || d === false;
                        if (e) {
                            a.data.hide = false;
                            a.stop()
                        }
                        h.call(b, !e, typeof d == "string" ? d : void 0);
                        return e
                    }
                })
            }, this, null, 0);
            this.on("cancel", function (b) {
                B(function (d) {
                    if (d.isChanged()) {
                        if (!confirm(a.lang.common.confirmCancel))b.data.hide =
                            false;
                        return true
                    }
                })
            }, this, null, 0);
            this.parts.close.on("click", function (a) {
                this.fire("cancel", {hide: true}).hide !== false && this.hide();
                a.data.preventDefault()
            }, this);
            this.changeFocus = i;
            var u = this._.element;
            a.focusManager.add(u, 1);
            this.on("show", function () {
                u.on("keydown", o, this);
                if (CKEDITOR.env.opera || CKEDITOR.env.gecko)u.on("keypress", l, this)
            });
            this.on("hide", function () {
                u.removeListener("keydown", o);
                (CKEDITOR.env.opera || CKEDITOR.env.gecko) && u.removeListener("keypress", l);
                B(function (a) {
                    f.apply(a)
                })
            });
            this.on("iframeAdded", function (a) {
                (new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document)).on("keydown", o, this, null, 0)
            });
            this.on("show", function () {
                e();
                if (a.config.dialog_startupFocusTab && q._.pageCount > 1) {
                    q._.tabBarMode = true;
                    q._.tabs[q._.currentTabId][0].focus()
                } else if (!this._.hasFocus) {
                    this._.currentFocusIndex = -1;
                    if (p.onFocus) {
                        var b = p.onFocus.call(this);
                        b && b.focus()
                    } else i(1)
                }
            }, this, null, 4294967295);
            if (CKEDITOR.env.ie6Compat)this.on("load", function () {
                var a = this.getElement(), b = a.getFirst();
                b.remove();
                b.appendTo(a)
            }, this);
            j(this);
            k(this);
            (new CKEDITOR.dom.text(p.title, CKEDITOR.document)).appendTo(this.parts.title);
            for (t = 0; t < p.contents.length; t++)(m = p.contents[t]) && this.addPage(m);
            this.parts.tabs.on("click", function (a) {
                var b = a.data.getTarget();
                if (b.hasClass("cke_dialog_tab")) {
                    b = b.$.id;
                    this.selectPage(b.substring(4, b.lastIndexOf("_")));
                    if (this._.tabBarMode) {
                        this._.tabBarMode = false;
                        this._.currentFocusIndex = -1;
                        i(1)
                    }
                    a.data.preventDefault()
                }
            }, this);
            t = [];
            m = CKEDITOR.dialog._.uiElementBuilders.hbox.build(this,
                {type: "hbox", className: "cke_dialog_footer_buttons", widths: [], children: p.buttons}, t).getChild();
            this.parts.footer.setHtml(t.join(""));
            for (t = 0; t < m.length; t++)this._.buttons[m[t].id] = m[t]
        };
        CKEDITOR.dialog.prototype = {destroy: function () {
            this.hide();
            this._.element.remove()
        }, resize: function () {
            return function (a, b) {
                if (!this._.contentSize || !(this._.contentSize.width == a && this._.contentSize.height == b)) {
                    CKEDITOR.dialog.fire("resize", {dialog: this, width: a, height: b}, this._.editor);
                    this.fire("resize", {width: a, height: b},
                        this._.editor);
                    this.parts.contents.setStyles({width: a + "px", height: b + "px"});
                    if (this._.editor.lang.dir == "rtl" && this._.position)this._.position.x = CKEDITOR.document.getWindow().getViewPaneSize().width - this._.contentSize.width - parseInt(this._.element.getFirst().getStyle("right"), 10);
                    this._.contentSize = {width: a, height: b}
                }
            }
        }(), getSize: function () {
            var a = this._.element.getFirst();
            return{width: a.$.offsetWidth || 0, height: a.$.offsetHeight || 0}
        }, move: function (a, b, d) {
            var e = this._.element.getFirst(), c = this._.editor.lang.dir ==
                "rtl", f = e.getComputedStyle("position") == "fixed";
            CKEDITOR.env.ie && e.setStyle("zoom", "100%");
            if (!f || !this._.position || !(this._.position.x == a && this._.position.y == b)) {
                this._.position = {x: a, y: b};
                if (!f) {
                    f = CKEDITOR.document.getWindow().getScrollPosition();
                    a = a + f.x;
                    b = b + f.y
                }
                if (c) {
                    f = this.getSize();
                    a = CKEDITOR.document.getWindow().getViewPaneSize().width - f.width - a
                }
                b = {top: (b > 0 ? b : 0) + "px"};
                b[c ? "right" : "left"] = (a > 0 ? a : 0) + "px";
                e.setStyles(b);
                d && (this._.moved = 1)
            }
        }, getPosition: function () {
            return CKEDITOR.tools.extend({},
                this._.position)
        }, show: function () {
            var a = this._.element, b = this.definition;
            !a.getParent() || !a.getParent().equals(CKEDITOR.document.getBody()) ? a.appendTo(CKEDITOR.document.getBody()) : a.setStyle("display", "block");
            if (CKEDITOR.env.gecko && CKEDITOR.env.version < 10900) {
                var d = this.parts.dialog;
                d.setStyle("position", "absolute");
                setTimeout(function () {
                    d.setStyle("position", "fixed")
                }, 0)
            }
            this.resize(this._.contentSize && this._.contentSize.width || b.width || b.minWidth, this._.contentSize && this._.contentSize.height ||
                b.height || b.minHeight);
            this.reset();
            this.selectPage(this.definition.contents[0].id);
            if (CKEDITOR.dialog._.currentZIndex === null)CKEDITOR.dialog._.currentZIndex = this._.editor.config.baseFloatZIndex;
            this._.element.getFirst().setStyle("z-index", CKEDITOR.dialog._.currentZIndex = CKEDITOR.dialog._.currentZIndex + 10);
            if (CKEDITOR.dialog._.currentTop === null) {
                CKEDITOR.dialog._.currentTop = this;
                this._.parentDialog = null;
                m(this._.editor)
            } else {
                this._.parentDialog = CKEDITOR.dialog._.currentTop;
                this._.parentDialog.getElement().getFirst().$.style.zIndex -=
                    Math.floor(this._.editor.config.baseFloatZIndex / 2);
                CKEDITOR.dialog._.currentTop = this
            }
            a.on("keydown", B);
            a.on(CKEDITOR.env.opera ? "keypress" : "keyup", z);
            this._.hasFocus = false;
            CKEDITOR.tools.setTimeout(function () {
                    this.layout();
                    i(this);
                    this.parts.dialog.setStyle("visibility", "");
                    this.fireOnce("load", {});
                    CKEDITOR.ui.fire("ready", this);
                    this.fire("show", {});
                    this._.editor.fire("dialogShow", this);
                    this._.parentDialog || this._.editor.focusManager.lock();
                    this.foreach(function (a) {
                        a.setInitValue && a.setInitValue()
                    })
                },
                100, this)
        }, layout: function () {
            var a = this.parts.dialog, b = this.getSize(), d = CKEDITOR.document.getWindow().getViewPaneSize(), e = (d.width - b.width) / 2, c = (d.height - b.height) / 2;
            CKEDITOR.env.ie6Compat || (b.height + (c > 0 ? c : 0) > d.height || b.width + (e > 0 ? e : 0) > d.width ? a.setStyle("position", "absolute") : a.setStyle("position", "fixed"));
            this.move(this._.moved ? this._.position.x : e, this._.moved ? this._.position.y : c)
        }, foreach: function (a) {
            for (var b in this._.contents)for (var d in this._.contents[b])a.call(this, this._.contents[b][d]);
            return this
        }, reset: function () {
            var a = function (a) {
                a.reset && a.reset(1)
            };
            return function () {
                this.foreach(a);
                return this
            }
        }(), setupContent: function () {
            var a = arguments;
            this.foreach(function (b) {
                b.setup && b.setup.apply(b, a)
            })
        }, commitContent: function () {
            var a = arguments;
            this.foreach(function (b) {
                CKEDITOR.env.ie && this._.currentFocusIndex == b.focusIndex && b.getInputElement().$.blur();
                b.commit && b.commit.apply(b, a)
            })
        }, hide: function () {
            if (this.parts.dialog.isVisible()) {
                this.fire("hide", {});
                this._.editor.fire("dialogHide",
                    this);
                this.selectPage(this._.tabIdList[0]);
                var a = this._.element;
                a.setStyle("display", "none");
                this.parts.dialog.setStyle("visibility", "hidden");
                for (C(this); CKEDITOR.dialog._.currentTop != this;)CKEDITOR.dialog._.currentTop.hide();
                if (this._.parentDialog) {
                    var b = this._.parentDialog.getElement().getFirst();
                    b.setStyle("z-index", parseInt(b.$.style.zIndex, 10) + Math.floor(this._.editor.config.baseFloatZIndex / 2))
                } else n(this._.editor);
                if (CKEDITOR.dialog._.currentTop = this._.parentDialog)CKEDITOR.dialog._.currentZIndex =
                    CKEDITOR.dialog._.currentZIndex - 10; else {
                    CKEDITOR.dialog._.currentZIndex = null;
                    a.removeListener("keydown", B);
                    a.removeListener(CKEDITOR.env.opera ? "keypress" : "keyup", z);
                    var d = this._.editor;
                    d.focus();
                    setTimeout(function () {
                        d.focusManager.unlock()
                    }, 0)
                }
                delete this._.parentDialog;
                this.foreach(function (a) {
                    a.resetInitValue && a.resetInitValue()
                })
            }
        }, addPage: function (a) {
            var b = [], d = a.label ? ' title="' + CKEDITOR.tools.htmlEncode(a.label) + '"' : "", e = CKEDITOR.dialog._.uiElementBuilders.vbox.build(this, {type: "vbox", className: "cke_dialog_page_contents",
                children: a.elements, expand: !!a.expand, padding: a.padding, style: a.style || "width: 100%;"}, b), b = CKEDITOR.dom.element.createFromHtml(b.join(""));
            b.setAttribute("role", "tabpanel");
            var c = CKEDITOR.env, f = "cke_" + a.id + "_" + CKEDITOR.tools.getNextNumber(), d = CKEDITOR.dom.element.createFromHtml(['<a class="cke_dialog_tab"', this._.pageCount > 0 ? " cke_last" : "cke_first", d, a.hidden ? ' style="display:none"' : "", ' id="', f, '"', c.gecko && c.version >= 10900 && !c.hc ? "" : ' href="javascript:void(0)"', ' tabIndex="-1" hidefocus="true" role="tab">',
                a.label, "</a>"].join(""));
            b.setAttribute("aria-labelledby", f);
            this._.tabs[a.id] = [d, b];
            this._.tabIdList.push(a.id);
            !a.hidden && this._.pageCount++;
            this._.lastTab = d;
            this.updateStyle();
            f = this._.contents[a.id] = {};
            for (c = e.getChild(); e = c.shift();) {
                f[e.id] = e;
                typeof e.getChild == "function" && c.push.apply(c, e.getChild())
            }
            b.setAttribute("name", a.id);
            b.appendTo(this.parts.contents);
            d.unselectable();
            this.parts.tabs.append(d);
            if (a.accessKey) {
                y(this, this, "CTRL+" + a.accessKey, F, D);
                this._.accessKeyMap["CTRL+" + a.accessKey] =
                    a.id
            }
        }, selectPage: function (b) {
            if (this._.currentTabId != b && this.fire("selectPage", {page: b, currentPage: this._.currentTabId}) !== true) {
                for (var d in this._.tabs) {
                    var e = this._.tabs[d][0], c = this._.tabs[d][1];
                    if (d != b) {
                        e.removeClass("cke_dialog_tab_selected");
                        c.hide()
                    }
                    c.setAttribute("aria-hidden", d != b)
                }
                var f = this._.tabs[b];
                f[0].addClass("cke_dialog_tab_selected");
                if (CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat) {
                    a(f[1]);
                    f[1].show();
                    setTimeout(function () {
                        a(f[1], 1)
                    }, 0)
                } else f[1].show();
                this._.currentTabId = b;
                this._.currentTabIndex = CKEDITOR.tools.indexOf(this._.tabIdList, b)
            }
        }, updateStyle: function () {
            this.parts.dialog[(this._.pageCount === 1 ? "add" : "remove") + "Class"]("cke_single_page")
        }, hidePage: function (a) {
            var d = this._.tabs[a] && this._.tabs[a][0];
            if (d && this._.pageCount != 1 && d.isVisible()) {
                a == this._.currentTabId && this.selectPage(b.call(this));
                d.hide();
                this._.pageCount--;
                this.updateStyle()
            }
        }, showPage: function (a) {
            if (a = this._.tabs[a] && this._.tabs[a][0]) {
                a.show();
                this._.pageCount++;
                this.updateStyle()
            }
        }, getElement: function () {
            return this._.element
        },
            getName: function () {
                return this._.name
            }, getContentElement: function (a, b) {
                var d = this._.contents[a];
                return d && d[b]
            }, getValueOf: function (a, b) {
                return this.getContentElement(a, b).getValue()
            }, setValueOf: function (a, b, d) {
                return this.getContentElement(a, b).setValue(d)
            }, getButton: function (a) {
                return this._.buttons[a]
            }, click: function (a) {
                return this._.buttons[a].click()
            }, disableButton: function (a) {
                return this._.buttons[a].disable()
            }, enableButton: function (a) {
                return this._.buttons[a].enable()
            }, getPageCount: function () {
                return this._.pageCount
            },
            getParentEditor: function () {
                return this._.editor
            }, getSelectedElement: function () {
                return this.getParentEditor().getSelection().getSelectedElement()
            }, addFocusable: function (a, b) {
                if (typeof b == "undefined") {
                    b = this._.focusList.length;
                    this._.focusList.push(new e(this, a, b))
                } else {
                    this._.focusList.splice(b, 0, new e(this, a, b));
                    for (var d = b + 1; d < this._.focusList.length; d++)this._.focusList[d].focusIndex++
                }
            }};
        CKEDITOR.tools.extend(CKEDITOR.dialog, {add: function (a, b) {
            if (!this._.dialogDefinitions[a] || typeof b == "function")this._.dialogDefinitions[a] =
                b
        }, exists: function (a) {
            return!!this._.dialogDefinitions[a]
        }, getCurrent: function () {
            return CKEDITOR.dialog._.currentTop
        }, okButton: function () {
            var a = function (a, b) {
                b = b || {};
                return CKEDITOR.tools.extend({id: "ok", type: "button", label: a.lang.common.ok, "class": "cke_dialog_ui_button_ok", onClick: function (a) {
                    a = a.data.dialog;
                    a.fire("ok", {hide: true}).hide !== false && a.hide()
                }}, b, true)
            };
            a.type = "button";
            a.override = function (b) {
                return CKEDITOR.tools.extend(function (d) {
                    return a(d, b)
                }, {type: "button"}, true)
            };
            return a
        }(), cancelButton: function () {
            var a =
                function (a, b) {
                    b = b || {};
                    return CKEDITOR.tools.extend({id: "cancel", type: "button", label: a.lang.common.cancel, "class": "cke_dialog_ui_button_cancel", onClick: function (a) {
                        a = a.data.dialog;
                        a.fire("cancel", {hide: true}).hide !== false && a.hide()
                    }}, b, true)
                };
            a.type = "button";
            a.override = function (b) {
                return CKEDITOR.tools.extend(function (d) {
                    return a(d, b)
                }, {type: "button"}, true)
            };
            return a
        }(), addUIElement: function (a, b) {
            this._.uiElementBuilders[a] = b
        }});
        CKEDITOR.dialog._ = {uiElementBuilders: {}, dialogDefinitions: {}, currentTop: null,
            currentZIndex: null};
        CKEDITOR.event.implementOn(CKEDITOR.dialog);
        CKEDITOR.event.implementOn(CKEDITOR.dialog.prototype);
        var r = {resizable: CKEDITOR.DIALOG_RESIZE_BOTH, minWidth: 600, minHeight: 400, buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton]}, p = function (a, b, d) {
            for (var e = 0, c; c = a[e]; e++) {
                if (c.id == b)return c;
                if (d && c[d])if (c = p(c[d], b, d))return c
            }
            return null
        }, t = function (a, b, d, e, c) {
            if (d) {
                for (var f = 0, g; g = a[f]; f++) {
                    if (g.id == d) {
                        a.splice(f, 0, b);
                        return b
                    }
                    if (e && g[e])if (g = t(g[e], b, d, e, true))return g
                }
                if (c)return null
            }
            a.push(b);
            return b
        }, x = function (a, b, d) {
            for (var e = 0, c; c = a[e]; e++) {
                if (c.id == b)return a.splice(e, 1);
                if (d && c[d])if (c = x(c[d], b, d))return c
            }
            return null
        }, A = function (a, b) {
            this.dialog = a;
            for (var e = b.contents, c = 0, f; f = e[c]; c++)e[c] = f && new d(a, f);
            CKEDITOR.tools.extend(this, b)
        };
        A.prototype = {getContents: function (a) {
            return p(this.contents, a)
        }, getButton: function (a) {
            return p(this.buttons, a)
        }, addContents: function (a, b) {
            return t(this.contents, a, b)
        }, addButton: function (a, b) {
            return t(this.buttons, a, b)
        }, removeContents: function (a) {
            x(this.contents,
                a)
        }, removeButton: function (a) {
            x(this.buttons, a)
        }};
        d.prototype = {get: function (a) {
            return p(this.elements, a, "children")
        }, add: function (a, b) {
            return t(this.elements, a, b, "children")
        }, remove: function (a) {
            x(this.elements, a, "children")
        }};
        var v, w = {}, q, u = {}, B = function (a) {
            var b = a.data.$.ctrlKey || a.data.$.metaKey, d = a.data.$.altKey, e = a.data.$.shiftKey, c = String.fromCharCode(a.data.$.keyCode);
            if ((b = u[(b ? "CTRL+" : "") + (d ? "ALT+" : "") + (e ? "SHIFT+" : "") + c]) && b.length) {
                b = b[b.length - 1];
                b.keydown && b.keydown.call(b.uiElement, b.dialog,
                    b.key);
                a.data.preventDefault()
            }
        }, z = function (a) {
            var b = a.data.$.ctrlKey || a.data.$.metaKey, d = a.data.$.altKey, e = a.data.$.shiftKey, c = String.fromCharCode(a.data.$.keyCode);
            if ((b = u[(b ? "CTRL+" : "") + (d ? "ALT+" : "") + (e ? "SHIFT+" : "") + c]) && b.length) {
                b = b[b.length - 1];
                if (b.keyup) {
                    b.keyup.call(b.uiElement, b.dialog, b.key);
                    a.data.preventDefault()
                }
            }
        }, y = function (a, b, d, e, c) {
            (u[d] || (u[d] = [])).push({uiElement: a, dialog: b, key: d, keyup: c || a.accessKeyUp, keydown: e || a.accessKeyDown})
        }, C = function (a) {
            for (var b in u) {
                for (var d = u[b],
                         e = d.length - 1; e >= 0; e--)(d[e].dialog == a || d[e].uiElement == a) && d.splice(e, 1);
                d.length === 0 && delete u[b]
            }
        }, D = function (a, b) {
            a._.accessKeyMap[b] && a.selectPage(a._.accessKeyMap[b])
        }, F = function () {
        };
        (function () {
            CKEDITOR.ui.dialog = {uiElement: function (a, b, d, e, c, f, g) {
                if (!(arguments.length < 4)) {
                    var i = (e.call ? e(b) : e) || "div", h = ["<", i, " "], j = (c && c.call ? c(b) : c) || {}, k = (f && f.call ? f(b) : f) || {}, o = (g && g.call ? g.call(this, a, b) : g) || "", r = this.domId = k.id || CKEDITOR.tools.getNextId() + "_uiElement";
                    this.id = b.id;
                    k.id = r;
                    var p = {};
                    b.type &&
                    (p["cke_dialog_ui_" + b.type] = 1);
                    b.className && (p[b.className] = 1);
                    b.disabled && (p.cke_disabled = 1);
                    for (var l = k["class"] && k["class"].split ? k["class"].split(" ") : [], r = 0; r < l.length; r++)l[r] && (p[l[r]] = 1);
                    l = [];
                    for (r in p)l.push(r);
                    k["class"] = l.join(" ");
                    if (b.title)k.title = b.title;
                    p = (b.style || "").split(";");
                    if (b.align) {
                        l = b.align;
                        j["margin-left"] = l == "left" ? 0 : "auto";
                        j["margin-right"] = l == "right" ? 0 : "auto"
                    }
                    for (r in j)p.push(r + ":" + j[r]);
                    b.hidden && p.push("display:none");
                    for (r = p.length - 1; r >= 0; r--)p[r] === "" && p.splice(r,
                        1);
                    if (p.length > 0)k.style = (k.style ? k.style + "; " : "") + p.join("; ");
                    for (r in k)h.push(r + '="' + CKEDITOR.tools.htmlEncode(k[r]) + '" ');
                    h.push(">", o, "</", i, ">");
                    d.push(h.join(""));
                    (this._ || (this._ = {})).dialog = a;
                    if (typeof b.isChanged == "boolean")this.isChanged = function () {
                        return b.isChanged
                    };
                    if (typeof b.isChanged == "function")this.isChanged = b.isChanged;
                    if (typeof b.setValue == "function")this.setValue = CKEDITOR.tools.override(this.setValue, function (a) {
                        return function (d) {
                            a.call(this, b.setValue.call(this, d))
                        }
                    });
                    if (typeof b.getValue ==
                        "function")this.getValue = CKEDITOR.tools.override(this.getValue, function (a) {
                        return function () {
                            return b.getValue.call(this, a.call(this))
                        }
                    });
                    CKEDITOR.event.implementOn(this);
                    this.registerEvents(b);
                    this.accessKeyUp && (this.accessKeyDown && b.accessKey) && y(this, a, "CTRL+" + b.accessKey);
                    var s = this;
                    a.on("load", function () {
                        var b = s.getInputElement();
                        if (b) {
                            var d = s.type in{checkbox: 1, ratio: 1} && CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? "cke_dialog_ui_focused" : "";
                            b.on("focus", function () {
                                a._.tabBarMode = false;
                                a._.hasFocus =
                                    true;
                                s.fire("focus");
                                d && this.addClass(d)
                            });
                            b.on("blur", function () {
                                s.fire("blur");
                                d && this.removeClass(d)
                            })
                        }
                    });
                    if (this.keyboardFocusable) {
                        this.tabIndex = b.tabIndex || 0;
                        this.focusIndex = a._.focusList.push(this) - 1;
                        this.on("focus", function () {
                            a._.currentFocusIndex = s.focusIndex
                        })
                    }
                    CKEDITOR.tools.extend(this, b)
                }
            }, hbox: function (a, b, d, e, c) {
                if (!(arguments.length < 4)) {
                    this._ || (this._ = {});
                    var f = this._.children = b, g = c && c.widths || null, i = c && c.height || null, h, j = {role: "presentation"};
                    c && c.align && (j.align = c.align);
                    CKEDITOR.ui.dialog.uiElement.call(this,
                        a, c || {type: "hbox"}, e, "table", {}, j, function () {
                            var a = ['<tbody><tr class="cke_dialog_ui_hbox">'];
                            for (h = 0; h < d.length; h++) {
                                var b = "cke_dialog_ui_hbox_child", e = [];
                                h === 0 && (b = "cke_dialog_ui_hbox_first");
                                h == d.length - 1 && (b = "cke_dialog_ui_hbox_last");
                                a.push('<td class="', b, '" role="presentation" ');
                                g ? g[h] && e.push("width:" + o(g[h])) : e.push("width:" + Math.floor(100 / d.length) + "%");
                                i && e.push("height:" + o(i));
                                c && c.padding != void 0 && e.push("padding:" + o(c.padding));
                                CKEDITOR.env.ie && (CKEDITOR.env.quirks && f[h].align) && e.push("text-align:" +
                                    f[h].align);
                                e.length > 0 && a.push('style="' + e.join("; ") + '" ');
                                a.push(">", d[h], "</td>")
                            }
                            a.push("</tr></tbody>");
                            return a.join("")
                        })
                }
            }, vbox: function (a, b, d, e, c) {
                if (!(arguments.length < 3)) {
                    this._ || (this._ = {});
                    var f = this._.children = b, g = c && c.width || null, i = c && c.heights || null;
                    CKEDITOR.ui.dialog.uiElement.call(this, a, c || {type: "vbox"}, e, "div", null, {role: "presentation"}, function () {
                        var b = ['<table role="presentation" cellspacing="0" border="0" '];
                        b.push('style="');
                        c && c.expand && b.push("height:100%;");
                        b.push("width:" +
                            o(g || "100%"), ";");
                        CKEDITOR.env.webkit && b.push("float:none;");
                        b.push('"');
                        b.push('align="', CKEDITOR.tools.htmlEncode(c && c.align || (a.getParentEditor().lang.dir == "ltr" ? "left" : "right")), '" ');
                        b.push("><tbody>");
                        for (var e = 0; e < d.length; e++) {
                            var h = [];
                            b.push('<tr><td role="presentation" ');
                            g && h.push("width:" + o(g || "100%"));
                            i ? h.push("height:" + o(i[e])) : c && c.expand && h.push("height:" + Math.floor(100 / d.length) + "%");
                            c && c.padding != void 0 && h.push("padding:" + o(c.padding));
                            CKEDITOR.env.ie && (CKEDITOR.env.quirks && f[e].align) &&
                            h.push("text-align:" + f[e].align);
                            h.length > 0 && b.push('style="', h.join("; "), '" ');
                            b.push(' class="cke_dialog_ui_vbox_child">', d[e], "</td></tr>")
                        }
                        b.push("</tbody></table>");
                        return b.join("")
                    })
                }
            }}
        })();
        CKEDITOR.ui.dialog.uiElement.prototype = {getElement: function () {
            return CKEDITOR.document.getById(this.domId)
        }, getInputElement: function () {
            return this.getElement()
        }, getDialog: function () {
            return this._.dialog
        }, setValue: function (a, b) {
            this.getInputElement().setValue(a);
            !b && this.fire("change", {value: a});
            return this
        },
            getValue: function () {
                return this.getInputElement().getValue()
            }, isChanged: function () {
                return false
            }, selectParentTab: function () {
                for (var a = this.getInputElement(); (a = a.getParent()) && a.$.className.search("cke_dialog_page_contents") == -1;);
                if (!a)return this;
                a = a.getAttribute("name");
                this._.dialog._.currentTabId != a && this._.dialog.selectPage(a);
                return this
            }, focus: function () {
                this.selectParentTab().getInputElement().focus();
                return this
            }, registerEvents: function (a) {
                var b = /^on([A-Z]\w+)/, d, e = function (a, b, d, e) {
                    b.on("load",
                        function () {
                            a.getInputElement().on(d, e, a)
                        })
                }, c;
                for (c in a)if (d = c.match(b))this.eventProcessors[c] ? this.eventProcessors[c].call(this, this._.dialog, a[c]) : e(this, this._.dialog, d[1].toLowerCase(), a[c]);
                return this
            }, eventProcessors: {onLoad: function (a, b) {
                a.on("load", b, this)
            }, onShow: function (a, b) {
                a.on("show", b, this)
            }, onHide: function (a, b) {
                a.on("hide", b, this)
            }}, accessKeyDown: function () {
                this.focus()
            }, accessKeyUp: function () {
            }, disable: function () {
                var a = this.getElement();
                this.getInputElement().setAttribute("disabled",
                    "true");
                a.addClass("cke_disabled")
            }, enable: function () {
                var a = this.getElement();
                this.getInputElement().removeAttribute("disabled");
                a.removeClass("cke_disabled")
            }, isEnabled: function () {
                return!this.getElement().hasClass("cke_disabled")
            }, isVisible: function () {
                return this.getInputElement().isVisible()
            }, isFocusable: function () {
                return!this.isEnabled() || !this.isVisible() ? false : true
            }};
        CKEDITOR.ui.dialog.hbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {getChild: function (a) {
            if (arguments.length <
                1)return this._.children.concat();
            a.splice || (a = [a]);
            return a.length < 2 ? this._.children[a[0]] : this._.children[a[0]] && this._.children[a[0]].getChild ? this._.children[a[0]].getChild(a.slice(1, a.length)) : null
        }}, true);
        CKEDITOR.ui.dialog.vbox.prototype = new CKEDITOR.ui.dialog.hbox;
        (function () {
            var a = {build: function (a, b, d) {
                for (var e = b.children, c, f = [], g = [], i = 0; i < e.length && (c = e[i]); i++) {
                    var h = [];
                    f.push(h);
                    g.push(CKEDITOR.dialog._.uiElementBuilders[c.type].build(a, c, h))
                }
                return new CKEDITOR.ui.dialog[b.type](a,
                    g, f, d, b)
            }};
            CKEDITOR.dialog.addUIElement("hbox", a);
            CKEDITOR.dialog.addUIElement("vbox", a)
        })();
        CKEDITOR.dialogCommand = function (a, b) {
            this.dialogName = a;
            CKEDITOR.tools.extend(this, b, true)
        };
        CKEDITOR.dialogCommand.prototype = {exec: function (a) {
            CKEDITOR.env.opera ? CKEDITOR.tools.setTimeout(function () {
                a.openDialog(this.dialogName)
            }, 0, this) : a.openDialog(this.dialogName)
        }, canUndo: false, editorFocus: 1};
        (function () {
            var a = /^([a]|[^a])+$/, b = /^\d*$/, d = /^\d*(?:\.\d+)?$/, e = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/, c = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i,
                f = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
            CKEDITOR.VALIDATE_OR = 1;
            CKEDITOR.VALIDATE_AND = 2;
            CKEDITOR.dialog.validate = {functions: function () {
                var a = arguments;
                return function () {
                    var b = this && this.getValue ? this.getValue() : a[0], d = void 0, e = CKEDITOR.VALIDATE_AND, c = [], f;
                    for (f = 0; f < a.length; f++)if (typeof a[f] == "function")c.push(a[f]); else break;
                    if (f < a.length && typeof a[f] == "string") {
                        d = a[f];
                        f++
                    }
                    f < a.length && typeof a[f] == "number" && (e = a[f]);
                    var g = e == CKEDITOR.VALIDATE_AND ? true : false;
                    for (f = 0; f < c.length; f++)g = e == CKEDITOR.VALIDATE_AND ?
                        g && c[f](b) : g || c[f](b);
                    return!g ? d : true
                }
            }, regex: function (a, b) {
                return function (d) {
                    d = this && this.getValue ? this.getValue() : d;
                    return!a.test(d) ? b : true
                }
            }, notEmpty: function (b) {
                return this.regex(a, b)
            }, integer: function (a) {
                return this.regex(b, a)
            }, number: function (a) {
                return this.regex(d, a)
            }, cssLength: function (a) {
                return this.functions(function (a) {
                    return c.test(CKEDITOR.tools.trim(a))
                }, a)
            }, htmlLength: function (a) {
                return this.functions(function (a) {
                    return e.test(CKEDITOR.tools.trim(a))
                }, a)
            }, inlineStyle: function (a) {
                return this.functions(function (a) {
                        return f.test(CKEDITOR.tools.trim(a))
                    },
                    a)
            }, equals: function (a, b) {
                return this.functions(function (b) {
                    return b == a
                }, b)
            }, notEqual: function (a, b) {
                return this.functions(function (b) {
                    return b != a
                }, b)
            }};
            CKEDITOR.on("instanceDestroyed", function (a) {
                if (CKEDITOR.tools.isEmpty(CKEDITOR.instances)) {
                    for (var b; b = CKEDITOR.dialog._.currentTop;)b.hide();
                    for (var d in w)w[d].remove();
                    w = {}
                }
                var a = a.editor._.storedDialogs, e;
                for (e in a)a[e].destroy()
            })
        })();
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {openDialog: function (a, b) {
            var d = null, e = CKEDITOR.dialog._.dialogDefinitions[a];
            CKEDITOR.dialog._.currentTop === null && m(this);
            if (typeof e == "function") {
                d = this._.storedDialogs || (this._.storedDialogs = {});
                d = d[a] || (d[a] = new CKEDITOR.dialog(this, a));
                b && b.call(d, d);
                d.show()
            } else {
                if (e == "failed") {
                    n(this);
                    throw Error('[CKEDITOR.dialog.openDialog] Dialog "' + a + '" failed when loading definition.');
                }
                typeof e == "string" && CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(e), function () {
                    typeof CKEDITOR.dialog._.dialogDefinitions[a] != "function" && (CKEDITOR.dialog._.dialogDefinitions[a] = "failed");
                    this.openDialog(a,
                        b)
                }, this, 0, 1)
            }
            CKEDITOR.skin.loadPart("dialog");
            return d
        }})
    }(),CKEDITOR.plugins.add("dialog", {requires: "dialogui", init: function (b) {
        b.on("contentDom", function () {
            var c = b.editable();
            c.attachListener(c, "dblclick", function (a) {
                if (b.readOnly)return false;
                a = {element: a.data.getTarget()};
                b.fire("doubleclick", a);
                a.dialog && b.openDialog(a.dialog);
                return 1
            })
        })
    }}),function () {
        CKEDITOR.plugins.add("a11yhelp", {requires: "dialog", availableLangs: {en: 1, ar: 1, bg: 1, ca: 1, et: 1, cs: 1, cy: 1, da: 1, de: 1, el: 1, eo: 1, es: 1, fa: 1, fi: 1, fr: 1,
            gu: 1, he: 1, hi: 1, hr: 1, hu: 1, it: 1, ja: 1, km: 1, ku: 1, lt: 1, lv: 1, mk: 1, mn: 1, nb: 1, nl: 1, no: 1, pl: 1, pt: 1, "pt-br": 1, ro: 1, ru: 1, sk: 1, sl: 1, sv: 1, th: 1, tr: 1, ug: 1, uk: 1, vi: 1, "zh-cn": 1}, init: function (b) {
            var c = this;
            b.addCommand("a11yHelp", {exec: function () {
                var a = b.langCode, a = c.availableLangs[a] ? a : c.availableLangs[a.replace(/-.*/, "")] ? a.replace(/-.*/, "") : "en";
                CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c.path + "dialogs/lang/" + a + ".js"), function () {
                    b.lang.a11yhelp = c.langEntries[a];
                    b.openDialog("a11yHelp")
                })
            }, modes: {wysiwyg: 1, source: 1},
                readOnly: 1, canUndo: false});
            b.setKeystroke(CKEDITOR.ALT + 48, "a11yHelp");
            CKEDITOR.dialog.add("a11yHelp", this.path + "dialogs/a11yhelp.js")
        }})
    }(),CKEDITOR.plugins.add("about", {requires: "dialog", init: function (b) {
        var c = b.addCommand("about", new CKEDITOR.dialogCommand("about"));
        c.modes = {wysiwyg: 1, source: 1};
        c.canUndo = false;
        c.readOnly = 1;
        b.ui.addButton && b.ui.addButton("About", {label: b.lang.about.title, command: "about", toolbar: "about"});
        CKEDITOR.dialog.add("about", this.path + "dialogs/about.js")
    }}),CKEDITOR.plugins.add("basicstyles",
        {init: function (b) {
            var c = 0, a = function (a, e, f, d) {
                if (d) {
                    d = new CKEDITOR.style(d);
                    b.attachStyleStateChange(d, function (a) {
                        !b.readOnly && b.getCommand(f).setState(a)
                    });
                    b.addCommand(f, new CKEDITOR.styleCommand(d));
                    b.ui.addButton && b.ui.addButton(a, {label: e, command: f, toolbar: "basicstyles," + (c = c + 10)})
                }
            }, h = b.config, f = b.lang.basicstyles;
            a("Bold", f.bold, "bold", h.coreStyles_bold);
            a("Italic", f.italic, "italic", h.coreStyles_italic);
            a("Underline", f.underline, "underline", h.coreStyles_underline);
            a("Strike", f.strike, "strike",
                h.coreStyles_strike);
            a("Subscript", f.subscript, "subscript", h.coreStyles_subscript);
            a("Superscript", f.superscript, "superscript", h.coreStyles_superscript);
            b.setKeystroke([
                [CKEDITOR.CTRL + 66, "bold"],
                [CKEDITOR.CTRL + 73, "italic"],
                [CKEDITOR.CTRL + 85, "underline"]
            ])
        }}),CKEDITOR.config.coreStyles_bold = {element: "strong", overrides: "b"},CKEDITOR.config.coreStyles_italic = {element: "em", overrides: "i"},CKEDITOR.config.coreStyles_underline = {element: "u"},CKEDITOR.config.coreStyles_strike = {element: "strike"},CKEDITOR.config.coreStyles_subscript =
    {element: "sub"},CKEDITOR.config.coreStyles_superscript = {element: "sup"},function () {
        function b(a, b, d, e) {
            if (!a.isReadOnly() && !a.equals(d.editable())) {
                CKEDITOR.dom.element.setMarker(e, a, "bidi_processed", 1);
                for (var e = a, c = d.editable(); (e = e.getParent()) && !e.equals(c);)if (e.getCustomData("bidi_processed")) {
                    a.removeStyle("direction");
                    a.removeAttribute("dir");
                    return
                }
                e = "useComputedState"in d.config ? d.config.useComputedState : 1;
                if ((e ? a.getComputedStyle("direction") : a.getStyle("direction") || a.hasAttribute("dir")) !=
                    b) {
                    a.removeStyle("direction");
                    if (e) {
                        a.removeAttribute("dir");
                        b != a.getComputedStyle("direction") && a.setAttribute("dir", b)
                    } else a.setAttribute("dir", b);
                    d.forceNextSelectionCheck()
                }
            }
        }

        function c(a, b, d) {
            var e = a.getCommonAncestor(false, true), a = a.clone();
            a.enlarge(d == CKEDITOR.ENTER_BR ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
            if (a.checkBoundaryOfElement(e, CKEDITOR.START) && a.checkBoundaryOfElement(e, CKEDITOR.END)) {
                for (var c; e && e.type == CKEDITOR.NODE_ELEMENT && (c = e.getParent()) && c.getChildCount() ==
                    1 && !(e.getName()in b);)e = c;
                return e.type == CKEDITOR.NODE_ELEMENT && e.getName()in b && e
            }
        }

        function a(a) {
            return{context: "p", refresh: function (a, b) {
                var d = a.config.useComputedState, c, d = d === void 0 || d;
                if (!d) {
                    c = b.lastElement;
                    for (var f = a.editable(); c && !(c.getName()in e || c.equals(f));) {
                        var g = c.getParent();
                        if (!g)break;
                        c = g
                    }
                }
                c = c || b.block || b.blockLimit;
                if (c.equals(a.editable()))(f = a.getSelection().getRanges()[0].getEnclosedNode()) && f.type == CKEDITOR.NODE_ELEMENT && (c = f);
                if (c) {
                    d = d ? c.getComputedStyle("direction") : c.getStyle("direction") ||
                        c.getAttribute("dir");
                    a.getCommand("bidirtl").setState(d == "rtl" ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF);
                    a.getCommand("bidiltr").setState(d == "ltr" ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
                }
                d = (b.block || b.blockLimit || a.editable()).getDirection(1);
                if (d != (a._.selDir || a.lang.dir)) {
                    a._.selDir = d;
                    a.fire("contentDirChanged", d)
                }
            }, exec: function (d) {
                var e = d.getSelection(), i = d.config.enterMode, h = e.getRanges();
                if (h && h.length) {
                    for (var j = {}, r = e.createBookmarks(), h = h.createIterator(), p, t = 0; p = h.getNextRange(1);) {
                        var x =
                            p.getEnclosedNode();
                        if (!x || x && !(x.type == CKEDITOR.NODE_ELEMENT && x.getName()in g))x = c(p, f, i);
                        x && b(x, a, d, j);
                        var A = new CKEDITOR.dom.walker(p), v = r[t].startNode, w = r[t++].endNode;
                        A.evaluator = function (a) {
                            return!!(a.type == CKEDITOR.NODE_ELEMENT && a.getName()in f && !(a.getName() == (i == CKEDITOR.ENTER_P ? "p" : "div") && a.getParent().type == CKEDITOR.NODE_ELEMENT && a.getParent().getName() == "blockquote") && a.getPosition(v) & CKEDITOR.POSITION_FOLLOWING && (a.getPosition(w) & CKEDITOR.POSITION_PRECEDING + CKEDITOR.POSITION_CONTAINS) ==
                                CKEDITOR.POSITION_PRECEDING)
                        };
                        for (; x = A.next();)b(x, a, d, j);
                        p = p.createIterator();
                        for (p.enlargeBr = i != CKEDITOR.ENTER_BR; x = p.getNextParagraph(i == CKEDITOR.ENTER_P ? "p" : "div");)b(x, a, d, j)
                    }
                    CKEDITOR.dom.element.clearAllMarkers(j);
                    d.forceNextSelectionCheck();
                    e.selectBookmarks(r);
                    d.focus()
                }
            }}
        }

        function h(a) {
            var b = a == i.setAttribute, d = a == i.removeAttribute, e = /\bdirection\s*:\s*(.*?)\s*(:?$|;)/;
            return function (c, f) {
                if (!this.isReadOnly()) {
                    var g;
                    if (g = c == (b || d ? "dir" : "direction") || c == "style" && (d || e.test(f))) {
                        a:{
                            g = this;
                            for (var i = g.getDocument().getBody().getParent(); g;) {
                                if (g.equals(i)) {
                                    g = false;
                                    break a
                                }
                                g = g.getParent()
                            }
                            g = true
                        }
                        g = !g
                    }
                    if (g) {
                        g = this.getDirection(1);
                        i = a.apply(this, arguments);
                        if (g != this.getDirection(1)) {
                            this.getDocument().fire("dirChanged", this);
                            return i
                        }
                    }
                }
                return a.apply(this, arguments)
            }
        }

        var f = {table: 1, ul: 1, ol: 1, blockquote: 1, div: 1}, g = {}, e = {};
        CKEDITOR.tools.extend(g, f, {tr: 1, p: 1, div: 1, li: 1});
        CKEDITOR.tools.extend(e, g, {td: 1});
        CKEDITOR.plugins.add("bidi", {init: function (b) {
            function d(a, e, c, f, g) {
                b.addCommand(c,
                    new CKEDITOR.command(b, f));
                b.ui.addButton && b.ui.addButton(a, {label: e, command: c, toolbar: "bidi," + g})
            }

            if (!b.blockless) {
                var e = b.lang.bidi;
                b.ui.addToolbarGroup && b.ui.addToolbarGroup("bidi", "align", "paragraph");
                d("BidiLtr", e.ltr, "bidiltr", a("ltr"), 10);
                d("BidiRtl", e.rtl, "bidirtl", a("rtl"), 20);
                b.on("contentDom", function () {
                    b.document.on("dirChanged", function (a) {
                        b.fire("dirChanged", {node: a.data, dir: a.data.getDirection(1)})
                    })
                });
                b.on("contentDirChanged", function (a) {
                    var a = (b.lang.dir != a.data ? "add" : "remove") + "Class",
                        d = b.ui.space(b.config.toolbarLocation);
                    if (d)d[a]("cke_mixed_dir_content")
                })
            }
        }});
        for (var i = CKEDITOR.dom.element.prototype, d = ["setStyle", "removeStyle", "setAttribute", "removeAttribute"], j = 0; j < d.length; j++)i[d[j]] = CKEDITOR.tools.override(i[d[j]], h)
    }(),function () {
        var b = {exec: function (b) {
            var a = b.getCommand("blockquote").state, h = b.getSelection(), f = h && h.getRanges(true)[0];
            if (f) {
                var g = h.createBookmarks();
                if (CKEDITOR.env.ie) {
                    var e = g[0].startNode, i = g[0].endNode, d;
                    if (e && e.getParent().getName() == "blockquote")for (d =
                                                                              e; d = d.getNext();)if (d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary()) {
                        e.move(d, true);
                        break
                    }
                    if (i && i.getParent().getName() == "blockquote")for (d = i; d = d.getPrevious();)if (d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary()) {
                        i.move(d);
                        break
                    }
                }
                var j = f.createIterator();
                j.enlargeBr = b.config.enterMode != CKEDITOR.ENTER_BR;
                if (a == CKEDITOR.TRISTATE_OFF) {
                    for (e = []; a = j.getNextParagraph();)e.push(a);
                    if (e.length < 1) {
                        a = b.document.createElement(b.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div");
                        i = g.shift();
                        f.insertNode(a);
                        a.append(new CKEDITOR.dom.text("﻿", b.document));
                        f.moveToBookmark(i);
                        f.selectNodeContents(a);
                        f.collapse(true);
                        i = f.createBookmark();
                        e.push(a);
                        g.unshift(i)
                    }
                    d = e[0].getParent();
                    f = [];
                    for (i = 0; i < e.length; i++) {
                        a = e[i];
                        d = d.getCommonAncestor(a.getParent())
                    }
                    for (a = {table: 1, tbody: 1, tr: 1, ol: 1, ul: 1}; a[d.getName()];)d = d.getParent();
                    for (i = null; e.length > 0;) {
                        for (a = e.shift(); !a.getParent().equals(d);)a = a.getParent();
                        a.equals(i) || f.push(a);
                        i = a
                    }
                    for (; f.length > 0;) {
                        a = f.shift();
                        if (a.getName() == "blockquote") {
                            for (i = new CKEDITOR.dom.documentFragment(b.document); a.getFirst();) {
                                i.append(a.getFirst().remove());
                                e.push(i.getLast())
                            }
                            i.replace(a)
                        } else e.push(a)
                    }
                    f = b.document.createElement("blockquote");
                    for (f.insertBefore(e[0]); e.length > 0;) {
                        a = e.shift();
                        f.append(a)
                    }
                } else if (a == CKEDITOR.TRISTATE_ON) {
                    i = [];
                    for (d = {}; a = j.getNextParagraph();) {
                        for (e = f = null; a.getParent();) {
                            if (a.getParent().getName() == "blockquote") {
                                f = a.getParent();
                                e = a;
                                break
                            }
                            a = a.getParent()
                        }
                        if (f && e && !e.getCustomData("blockquote_moveout")) {
                            i.push(e);
                            CKEDITOR.dom.element.setMarker(d, e, "blockquote_moveout", true)
                        }
                    }
                    CKEDITOR.dom.element.clearAllMarkers(d);
                    a =
                        [];
                    e = [];
                    for (d = {}; i.length > 0;) {
                        j = i.shift();
                        f = j.getParent();
                        if (j.getPrevious())if (j.getNext()) {
                            j.breakParent(j.getParent());
                            e.push(j.getNext())
                        } else j.remove().insertAfter(f); else j.remove().insertBefore(f);
                        if (!f.getCustomData("blockquote_processed")) {
                            e.push(f);
                            CKEDITOR.dom.element.setMarker(d, f, "blockquote_processed", true)
                        }
                        a.push(j)
                    }
                    CKEDITOR.dom.element.clearAllMarkers(d);
                    for (i = e.length - 1; i >= 0; i--) {
                        f = e[i];
                        a:{
                            d = f;
                            for (var j = 0, k = d.getChildCount(), l = void 0; j < k && (l = d.getChild(j)); j++)if (l.type == CKEDITOR.NODE_ELEMENT &&
                                l.isBlockBoundary()) {
                                d = false;
                                break a
                            }
                            d = true
                        }
                        d && f.remove()
                    }
                    if (b.config.enterMode == CKEDITOR.ENTER_BR)for (f = true; a.length;) {
                        j = a.shift();
                        if (j.getName() == "div") {
                            i = new CKEDITOR.dom.documentFragment(b.document);
                            f && (j.getPrevious() && !(j.getPrevious().type == CKEDITOR.NODE_ELEMENT && j.getPrevious().isBlockBoundary())) && i.append(b.document.createElement("br"));
                            for (f = j.getNext() && !(j.getNext().type == CKEDITOR.NODE_ELEMENT && j.getNext().isBlockBoundary()); j.getFirst();)j.getFirst().remove().appendTo(i);
                            f && i.append(b.document.createElement("br"));
                            i.replace(j);
                            f = false
                        }
                    }
                }
                h.selectBookmarks(g);
                b.focus()
            }
        }, refresh: function (b, a) {
            this.setState(b.elementPath(a.block || a.blockLimit).contains("blockquote", 1) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
        }, context: "blockquote"};
        CKEDITOR.plugins.add("blockquote", {init: function (c) {
            if (!c.blockless) {
                c.addCommand("blockquote", b);
                c.ui.addButton && c.ui.addButton("Blockquote", {label: c.lang.blockquote.toolbar, command: "blockquote", toolbar: "blocks,10"})
            }
        }})
    }(),"use strict",function () {
        function b(a) {
            function b() {
                var d =
                    a.editable();
                d.on(u, function (a) {
                    (!CKEDITOR.env.ie || !v) && t(a)
                });
                CKEDITOR.env.ie && d.on("paste", function (b) {
                    if (!w) {
                        f();
                        b.data.preventDefault();
                        t(b);
                        h("paste") || a.openDialog("paste")
                    }
                });
                if (CKEDITOR.env.ie) {
                    d.on("contextmenu", g, null, null, 0);
                    d.on("beforepaste", function (a) {
                        a.data && !a.data.$.ctrlKey && g()
                    }, null, null, 0)
                }
                d.on("beforecut", function () {
                    !v && o(a)
                });
                d.attachListener(CKEDITOR.env.ie ? d : a.document.getDocumentElement(), "mouseup", function () {
                    setTimeout(function () {
                        x()
                    }, 0)
                });
                d.on("keyup", x)
            }

            function d(b) {
                return{type: b,
                    canUndo: b == "cut", startDisabled: true, exec: function () {
                        this.type == "cut" && o();
                        var b;
                        var d = this.type;
                        if (CKEDITOR.env.ie)b = h(d); else try {
                            b = a.document.$.execCommand(d, false, null)
                        } catch (c) {
                            b = false
                        }
                        b || alert(a.lang.clipboard[this.type + "Error"]);
                        return b
                    }}
            }

            function c() {
                return{canUndo: false, async: true, exec: function (a, b) {
                    var d = function (b, d) {
                        b && n(b.type, b.dataValue, !!d);
                        a.fire("afterCommandExec", {name: "paste", command: e, returnValue: !!b})
                    }, e = this;
                    typeof b == "string" ? d({type: "auto", dataValue: b}, 1) : a.getClipboardData(d)
                }}
            }

            function f() {
                w = 1;
                setTimeout(function () {
                    w = 0
                }, 100)
            }

            function g() {
                v = 1;
                setTimeout(function () {
                    v = 0
                }, 10)
            }

            function h(b) {
                var d = a.document, c = d.getBody(), f = false, g = function () {
                    f = true
                };
                c.on(b, g);
                (CKEDITOR.env.version > 7 ? d.$ : d.$.selection.createRange()).execCommand(b);
                c.removeListener(b, g);
                return f
            }

            function n(b, d, c) {
                b = {type: b};
                if (c && !a.fire("beforePaste", b) || !d)return false;
                b.dataValue = d;
                return a.fire("paste", b)
            }

            function o() {
                if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
                    var b = a.getSelection(), d, c, f;
                    if (b.getType() == CKEDITOR.SELECTION_ELEMENT &&
                        (d = b.getSelectedElement())) {
                        c = b.getRanges()[0];
                        f = a.document.createText("");
                        f.insertBefore(d);
                        c.setStartBefore(f);
                        c.setEndAfter(d);
                        b.selectRanges([c]);
                        setTimeout(function () {
                            if (d.getParent()) {
                                f.remove();
                                b.selectElement(d)
                            }
                        }, 0)
                    }
                }
            }

            function s(b, d) {
                var c = a.document, f = a.editable(), g = function (a) {
                    a.cancel()
                }, i = CKEDITOR.env.gecko && CKEDITOR.env.version <= 10902;
                if (!c.getById("cke_pastebin")) {
                    var h = a.getSelection(), j = h.createBookmarks(), k = new CKEDITOR.dom.element(f.is("body") && !CKEDITOR.env.ie && !CKEDITOR.env.opera ?
                        "body" : "div", c);
                    k.setAttribute("id", "cke_pastebin");
                    CKEDITOR.env.opera && k.appendBogus();
                    var o = 0, c = c.getWindow();
                    if (i) {
                        k.insertAfter(j[0].startNode);
                        k.setStyle("display", "inline")
                    } else {
                        if (CKEDITOR.env.webkit) {
                            f.append(k);
                            k.addClass("cke_editable");
                            o = (f.is("body") ? f : CKEDITOR.dom.element.get(k.$.offsetParent)).getDocumentPosition().y
                        } else f.getAscendant(CKEDITOR.env.ie || CKEDITOR.env.opera ? "body" : "html", 1).append(k);
                        k.setStyles({position: "absolute", top: c.getScrollPosition().y - o + 10 + "px", width: "1px", height: Math.max(1,
                                c.getViewPaneSize().height - 20) + "px", overflow: "hidden", margin: 0, padding: 0})
                    }
                    if (i = k.getParent().isReadOnly()) {
                        k.setOpacity(0);
                        k.setAttribute("contenteditable", true)
                    } else k.setStyle(a.config.contentsLangDirection == "ltr" ? "left" : "right", "-1000px");
                    a.on("selectionChange", g, null, null, 0);
                    i && k.focus();
                    i = new CKEDITOR.dom.range(k);
                    i.selectNodeContents(k);
                    var r = i.select();
                    if (CKEDITOR.env.ie)var p = f.once("blur", function () {
                        a.lockSelection(r)
                    });
                    var s = CKEDITOR.document.getWindow().getScrollPosition().y;
                    setTimeout(function () {
                        if (CKEDITOR.env.webkit ||
                            CKEDITOR.env.opera)CKEDITOR.document[CKEDITOR.env.webkit ? "getBody" : "getDocumentElement"]().$.scrollTop = s;
                        p && p.removeListener();
                        CKEDITOR.env.ie && f.focus();
                        h.selectBookmarks(j);
                        k.remove();
                        var b;
                        if (CKEDITOR.env.webkit && (b = k.getFirst()) && b.is && b.hasClass("Apple-style-span"))k = b;
                        a.removeListener("selectionChange", g);
                        d(k.getHtml())
                    }, 0)
                }
            }

            function r() {
                if (CKEDITOR.env.ie) {
                    a.focus();
                    f();
                    var b = a.focusManager;
                    b.lock();
                    if (a.editable().fire(u) && !h("paste")) {
                        b.unlock();
                        return false
                    }
                    b.unlock()
                } else try {
                    if (a.editable().fire(u) && !a.document.$.execCommand("Paste", false, null))throw 0;
                } catch (d) {
                    return false
                }
                return true
            }

            function p(b) {
                if (a.mode == "wysiwyg")switch (b.data.keyCode) {
                    case CKEDITOR.CTRL + 86:
                    case CKEDITOR.SHIFT + 45:
                        b = a.editable();
                        f();
                        !CKEDITOR.env.ie && b.fire("beforepaste");
                        (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.version < 10900) && b.fire("paste");
                        break;
                    case CKEDITOR.CTRL + 88:
                    case CKEDITOR.SHIFT + 46:
                        a.fire("saveSnapshot");
                        setTimeout(function () {
                            a.fire("saveSnapshot")
                        }, 0)
                }
            }

            function t(b) {
                var d = {type: "auto"}, c = a.fire("beforePaste",
                    d);
                s(b, function (a) {
                    a = a.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, "");
                    c && n(d.type, a, 0, 1)
                })
            }

            function x() {
                if (a.mode == "wysiwyg") {
                    var b = A("Paste");
                    a.getCommand("cut").setState(A("Cut"));
                    a.getCommand("copy").setState(A("Copy"));
                    a.getCommand("paste").setState(b);
                    a.fire("pasteState", b)
                }
            }

            function A(b) {
                var d;
                if (q && b in{Paste: 1, Cut: 1})return CKEDITOR.TRISTATE_DISABLED;
                if (b == "Paste") {
                    CKEDITOR.env.ie && (v = 1);
                    try {
                        d = a.document.$.queryCommandEnabled(b) || CKEDITOR.env.webkit
                    } catch (c) {
                    }
                    v = 0
                } else {
                    b = a.getSelection();
                    d = b.getRanges();
                    d = b.getType() != CKEDITOR.SELECTION_NONE && !(d.length == 1 && d[0].collapsed)
                }
                return d ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
            }

            var v = 0, w = 0, q = 0, u = CKEDITOR.env.ie ? "beforepaste" : "paste";
            (function () {
                a.on("key", p);
                a.on("contentDom", b);
                a.on("selectionChange", function (a) {
                    q = a.data.selection.getRanges()[0].checkReadOnly();
                    x()
                });
                a.contextMenu && a.contextMenu.addListener(function (a, b) {
                    q = b.getRanges()[0].checkReadOnly();
                    return{cut: A("Cut"), copy: A("Copy"), paste: A("Paste")}
                })
            })();
            (function () {
                function b(d, c, f, g, i) {
                    var h = a.lang.clipboard[c];
                    a.addCommand(c, f);
                    a.ui.addButton && a.ui.addButton(d, {label: h, command: c, toolbar: "clipboard," + g});
                    a.addMenuItems && a.addMenuItem(c, {label: h, command: c, group: "clipboard", order: i})
                }

                b("Cut", "cut", d("cut"), 10, 1);
                b("Copy", "copy", d("copy"), 20, 4);
                b("Paste", "paste", c(), 30, 8)
            })();
            a.getClipboardData = function (b, d) {
                function c(a) {
                    a.removeListener();
                    a.cancel();
                    d(a.data)
                }

                function f(a) {
                    a.removeListener();
                    a.cancel();
                    j = true;
                    d({type: h, dataValue: a.data})
                }

                function g() {
                    this.customTitle = b &&
                        b.title
                }

                var i = false, h = "auto", j = false;
                if (!d) {
                    d = b;
                    b = null
                }
                a.on("paste", c, null, null, 0);
                a.on("beforePaste", function (a) {
                    a.removeListener();
                    i = true;
                    h = a.data.type
                }, null, null, 1E3);
                if (r() === false) {
                    a.removeListener("paste", c);
                    if (i && a.fire("pasteDialog", g)) {
                        a.on("pasteDialogCommit", f);
                        a.on("dialogHide", function (a) {
                            a.removeListener();
                            a.data.removeListener("pasteDialogCommit", f);
                            setTimeout(function () {
                                j || d(null)
                            }, 10)
                        })
                    } else d(null)
                }
            }
        }

        function c(a) {
            if (CKEDITOR.env.webkit) {
                if (!a.match(/^[^<]*$/g) && !a.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi))return"html"
            } else if (CKEDITOR.env.ie) {
                if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi) && !a.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi))return"html"
            } else if (CKEDITOR.env.gecko || CKEDITOR.env.opera) {
                if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi))return"html"
            } else return"html";
            return"htmlifiedtext"
        }

        function a(a, b) {
            function d(a) {
                return CKEDITOR.tools.repeat("</p><p>", ~~(a / 2)) + (a % 2 == 1 ? "<br>" : "")
            }

            b = b.replace(/\s+/g, " ").replace(/> +</g, "><").replace(/<br ?\/>/gi, "<br>");
            b = b.replace(/<\/?[A-Z]+>/g, function (a) {
                return a.toLowerCase()
            });
            if (b.match(/^[^<]$/))return b;
            if (CKEDITOR.env.webkit && b.indexOf("<div>") > -1) {
                b = b.replace(/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g, "<br>").replace(/^(<div>(<br>|)<\/div>){2}(?!$)/g, "<div></div>");
                b.match(/<div>(<br>|)<\/div>/) && (b = "<p>" + b.replace(/(<div>(<br>|)<\/div>)+/g, function (a) {
                    return d(a.split("</div><div>").length + 1)
                }) + "</p>");
                b = b.replace(/<\/div><div>/g, "<br>");
                b = b.replace(/<\/?div>/g, "")
            }
            if ((CKEDITOR.env.gecko || CKEDITOR.env.opera) && a.enterMode != CKEDITOR.ENTER_BR) {
                CKEDITOR.env.gecko && (b = b.replace(/^<br><br>$/, "<br>"));
                b.indexOf("<br><br>") > -1 && (b = "<p>" +
                    b.replace(/(<br>){2,}/g, function (a) {
                        return d(a.length / 4)
                    }) + "</p>")
            }
            return g(a, b)
        }

        function h() {
            var a = new CKEDITOR.htmlParser.filter, b = {blockquote: 1, dl: 1, fieldset: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, ol: 1, p: 1, table: 1, ul: 1}, d = CKEDITOR.tools.extend({br: 0}, CKEDITOR.dtd.$inline), c = {p: 1, br: 1, "cke:br": 1}, f = CKEDITOR.dtd, g = CKEDITOR.tools.extend({area: 1, basefont: 1, embed: 1, iframe: 1, map: 1, object: 1, param: 1}, CKEDITOR.dtd.$nonBodyContent, CKEDITOR.dtd.$cdata), h = function (a) {
                    delete a.name;
                    a.add(new CKEDITOR.htmlParser.text(" "))
                },
                n = function (a) {
                    for (var b = a, d; (b = b.next) && b.name && b.name.match(/^h\d$/);) {
                        d = new CKEDITOR.htmlParser.element("cke:br");
                        d.isEmpty = true;
                        for (a.add(d); d = b.children.shift();)a.add(d)
                    }
                };
            a.addRules({elements: {h1: n, h2: n, h3: n, h4: n, h5: n, h6: n, img: function (a) {
                var a = CKEDITOR.tools.trim(a.attributes.alt || ""), b = " ";
                a && !a.match(/(^http|\.(jpe?g|gif|png))/i) && (b = " [" + a + "] ");
                return new CKEDITOR.htmlParser.text(b)
            }, td: h, th: h, $: function (a) {
                var e = a.name, h;
                if (g[e])return false;
                delete a.attributes;
                if (e == "br")return a;
                if (b[e])a.name =
                    "p"; else if (d[e])delete a.name; else if (f[e]) {
                    h = new CKEDITOR.htmlParser.element("cke:br");
                    h.isEmpty = true;
                    if (CKEDITOR.dtd.$empty[e])return h;
                    a.add(h, 0);
                    h = h.clone();
                    h.isEmpty = true;
                    a.add(h);
                    delete a.name
                }
                c[a.name] || delete a.name;
                return a
            }}});
            return a
        }

        function f(a, b, d) {
            var b = new CKEDITOR.htmlParser.fragment.fromHtml(b), c = new CKEDITOR.htmlParser.basicWriter;
            b.writeHtml(c, d);
            var b = c.getHtml(), b = b.replace(/\s*(<\/?[a-z:]+ ?\/?>)\s*/g, "$1").replace(/(<cke:br \/>){2,}/g, "<cke:br />").replace(/(<cke:br \/>)(<\/?p>|<br \/>)/g,
                "$2").replace(/(<\/?p>|<br \/>)(<cke:br \/>)/g, "$1").replace(/<(cke:)?br( \/)?>/g, "<br>").replace(/<p><\/p>/g, ""), f = 0, b = b.replace(/<\/?p>/g, function (a) {
                if (a == "<p>") {
                    if (++f > 1)return"</p><p>"
                } else if (--f > 0)return"</p><p>";
                return a
            }).replace(/<p><\/p>/g, "");
            return g(a, b)
        }

        function g(a, b) {
            a.enterMode == CKEDITOR.ENTER_BR ? b = b.replace(/(<\/p><p>)+/g, function (a) {
                return CKEDITOR.tools.repeat("<br>", a.length / 7 * 2)
            }).replace(/<\/?p>/g, "") : a.enterMode == CKEDITOR.ENTER_DIV && (b = b.replace(/<(\/)?p>/g, "<$1div>"));
            return b
        }

        CKEDITOR.plugins.add("clipboard", {requires: "dialog", init: function (e) {
            var g;
            b(e);
            CKEDITOR.dialog.add("paste", CKEDITOR.getUrl(this.path + "dialogs/paste.js"));
            e.on("paste", function (a) {
                var b = a.data.dataValue, c = CKEDITOR.dtd.$block;
                if (b.indexOf("Apple-") > -1) {
                    b = b.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi, " ");
                    a.data.type != "html" && (b = b.replace(/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi, function (a, b) {
                        return b.replace(/\t/g, "&nbsp;&nbsp; &nbsp;")
                    }));
                    if (b.indexOf('<br class="Apple-interchange-newline">') > -1) {
                        a.data.startsWithEOL = 1;
                        a.data.preSniffing = "html";
                        b = b.replace(/<br class="Apple-interchange-newline">/, "")
                    }
                    b = b.replace(/(<[^>]+) class="Apple-[^"]*"/gi, "$1")
                }
                if (b.match(/^<[^<]+cke_(editable|contents)/i)) {
                    var e, f, g = new CKEDITOR.dom.element("div");
                    for (g.setHtml(b); g.getChildCount() == 1 && (e = g.getFirst()) && e.type == CKEDITOR.NODE_ELEMENT && (e.hasClass("cke_editable") || e.hasClass("cke_contents"));)g = f = e;
                    f && (b = f.getHtml().replace(/<br>$/i, ""))
                }
                CKEDITOR.env.ie ? b = b.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function (b, e) {
                    if (e.toLowerCase()in c) {
                        a.data.preSniffing = "html";
                        return"<" + e
                    }
                    return b
                }) : CKEDITOR.env.webkit ? b = b.replace(/<\/(\w+)><div><br><\/div>$/, function (b, e) {
                    if (e in c) {
                        a.data.endsWithEOL = 1;
                        return"</" + e + ">"
                    }
                    return b
                }) : CKEDITOR.env.gecko && (b = b.replace(/(\s)<br>$/, "$1"));
                a.data.dataValue = b
            }, null, null, 3);
            e.on("paste", function (b) {
                var b = b.data, j = b.type, k = b.dataValue, l, m = e.config.clipboard_defaultContentType || "html";
                l = j == "html" || b.preSniffing == "html" ? "html" : c(k);
                l == "htmlifiedtext" ? k = a(e.config, k) : j == "text" && l ==
                    "html" && (k = f(e.config, k, g || (g = h(e))));
                b.startsWithEOL && (k = '<br data-cke-eol="1">' + k);
                b.endsWithEOL && (k = k + '<br data-cke-eol="1">');
                j == "auto" && (j = l == "html" || m == "html" ? "html" : "text");
                b.type = j;
                b.dataValue = k;
                delete b.preSniffing;
                delete b.startsWithEOL;
                delete b.endsWithEOL
            }, null, null, 6);
            e.on("paste", function (a) {
                a = a.data;
                e.insertHtml(a.dataValue, a.type);
                setTimeout(function () {
                    e.fire("afterPaste")
                }, 0)
            }, null, null, 1E3);
            e.on("pasteDialog", function (a) {
                setTimeout(function () {
                    e.openDialog("paste", a.data)
                }, 0)
            })
        }})
    }(),
    function () {
        var b = '<a id="{id}" class="cke_button cke_button__{name} cke_button_{state} {cls}"' + (CKEDITOR.env.gecko && CKEDITOR.env.version >= 10900 && !CKEDITOR.env.hc ? "" : '" href="javascript:void(\'{titleJs}\')"') + ' title="{title}" tabindex="-1" hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="{hasArrow}"';
        if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac)b = b + ' onkeypress="return false;"';
        CKEDITOR.env.gecko && (b = b + ' onblur="this.style.cssText = this.style.cssText;"');
        var b = b + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);"  onmousedown="return CKEDITOR.tools.callFunction({mousedownFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"'), b = b + '>&nbsp;</span><span id="{id}_label" class="cke_button_label cke_button__{name}_label">{label}</span>{arrowHtml}</a>',
            c = CKEDITOR.addTemplate("buttonArrow", '<span class="cke_button_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : "") + "</span>"), a = CKEDITOR.addTemplate("button", b);
        CKEDITOR.plugins.add("button", {beforeInit: function (a) {
            a.ui.addHandler(CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler)
        }});
        CKEDITOR.UI_BUTTON = "button";
        CKEDITOR.ui.button = function (a) {
            CKEDITOR.tools.extend(this, a, {title: a.label, click: a.click || function (b) {
                b.execCommand(a.command)
            }});
            this._ = {}
        };
        CKEDITOR.ui.button.handler = {create: function (a) {
            return new CKEDITOR.ui.button(a)
        }};
        CKEDITOR.ui.button.prototype = {render: function (b, f) {
            var g = CKEDITOR.env, e = this._.id = CKEDITOR.tools.getNextId(), i = "", d = this.command, j;
            this._.editor = b;
            var k = {id: e, button: this, editor: b, focus: function () {
                CKEDITOR.document.getById(e).focus()
            }, execute: function () {
                this.button.click(b)
            }, attach: function (a) {
                this.button.attach(a)
            }}, l = CKEDITOR.tools.addFunction(function (a) {
                if (k.onkey) {
                    a = new CKEDITOR.dom.event(a);
                    return k.onkey(k, a.getKeystroke()) !== false
                }
            }), m = CKEDITOR.tools.addFunction(function (a) {
                var b;
                k.onfocus &&
                (b = k.onfocus(k, new CKEDITOR.dom.event(a)) !== false);
                CKEDITOR.env.gecko && CKEDITOR.env.version < 10900 && a.preventBubble();
                return b
            }), n = 0, o = CKEDITOR.tools.addFunction(function () {
                if (CKEDITOR.env.opera) {
                    var a = b.editable();
                    if (a.isInline() && a.hasFocus) {
                        b.lockSelection();
                        n = 1
                    }
                }
            });
            k.clickFn = j = CKEDITOR.tools.addFunction(function () {
                if (n) {
                    b.unlockSelection(1);
                    n = 0
                }
                k.execute()
            });
            if (this.modes) {
                var s = {}, r = function () {
                    var a = b.mode;
                    if (a) {
                        a = this.modes[a] ? s[a] != void 0 ? s[a] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
                        this.setState(b.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : a)
                    }
                };
                b.on("beforeModeUnload", function () {
                    if (b.mode && this._.state != CKEDITOR.TRISTATE_DISABLED)s[b.mode] = this._.state
                }, this);
                b.on("mode", r, this);
                !this.readOnly && b.on("readOnly", r, this)
            } else if (d)if (d = b.getCommand(d)) {
                d.on("state", function () {
                    this.setState(d.state)
                }, this);
                i = i + (d.state == CKEDITOR.TRISTATE_ON ? "on" : d.state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off")
            }
            if (this.directional)b.on("contentDirChanged", function (a) {
                var d = CKEDITOR.document.getById(this._.id),
                    c = d.getFirst(), a = a.data;
                a != b.lang.dir ? d.addClass("cke_" + a) : d.removeClass("cke_ltr").removeClass("cke_rtl");
                c.setAttribute("style", CKEDITOR.skin.getIconStyle(p, a == "rtl", this.icon, this.iconOffset))
            }, this);
            d || (i = i + "off");
            var p = r = this.name || this.command;
            if (this.icon && !/\./.test(this.icon)) {
                p = this.icon;
                this.icon = null
            }
            g = {id: e, name: r, iconName: p, label: this.label, cls: this.className || "", state: i, title: this.title, titleJs: g.gecko && g.version >= 10900 && !g.hc ? "" : (this.title || "").replace("'", ""), hasArrow: this.hasArrow ?
                "true" : "false", keydownFn: l, mousedownFn: o, focusFn: m, clickFn: j, style: CKEDITOR.skin.getIconStyle(p, b.lang.dir == "rtl", this.icon, this.iconOffset), arrowHtml: this.hasArrow ? c.output() : ""};
            a.output(g, f);
            if (this.onRender)this.onRender();
            return k
        }, setState: function (a) {
            if (this._.state == a)return false;
            this._.state = a;
            var b = CKEDITOR.document.getById(this._.id);
            if (b) {
                b.setState(a, "cke_button");
                a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled", true) : b.removeAttribute("aria-disabled");
                a == CKEDITOR.TRISTATE_ON ?
                    b.setAttribute("aria-pressed", true) : b.removeAttribute("aria-pressed");
                return true
            }
            return false
        }};
        CKEDITOR.ui.prototype.addButton = function (a, b) {
            this.add(a, CKEDITOR.UI_BUTTON, b)
        }
    }(),CKEDITOR.plugins.add("panelbutton", {requires: "button", onLoad: function () {
        function b(b) {
            var a = this._;
            if (a.state != CKEDITOR.TRISTATE_DISABLED) {
                this.createPanel(b);
                a.on ? a.panel.hide() : a.panel.showBlock(this._.id, this.document.getById(this._.id), 4)
            }
        }

        CKEDITOR.ui.panelButton = CKEDITOR.tools.createClass({base: CKEDITOR.ui.button, $: function (c) {
            var a =
                c.panel || {};
            delete c.panel;
            this.base(c);
            this.document = a.parent && a.parent.getDocument() || CKEDITOR.document;
            a.block = {attributes: a.attributes};
            this.hasArrow = a.toolbarRelated = true;
            this.click = b;
            this._ = {panelDefinition: a}
        }, statics: {handler: {create: function (b) {
            return new CKEDITOR.ui.panelButton(b)
        }}}, proto: {createPanel: function (b) {
            var a = this._;
            if (!a.panel) {
                var h = this._.panelDefinition, f = this._.panelDefinition.block, g = h.parent || CKEDITOR.document.getBody(), e = this._.panel = new CKEDITOR.ui.floatPanel(b, g, h),
                    h = e.addBlock(a.id, f), i = this;
                e.onShow = function () {
                    i.className && this.element.addClass(i.className + "_panel");
                    i.setState(CKEDITOR.TRISTATE_ON);
                    a.on = 1;
                    i.editorFocus && b.focus();
                    if (i.onOpen)i.onOpen()
                };
                e.onHide = function (d) {
                    i.className && this.element.getFirst().removeClass(i.className + "_panel");
                    i.setState(i.modes && i.modes[b.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                    a.on = 0;
                    if (!d && i.onClose)i.onClose()
                };
                e.onEscape = function () {
                    e.hide(1);
                    i.document.getById(a.id).focus()
                };
                if (this.onBlock)this.onBlock(e,
                    h);
                h.onHide = function () {
                    a.on = 0;
                    i.setState(CKEDITOR.TRISTATE_OFF)
                }
            }
        }}})
    }, beforeInit: function (b) {
        b.ui.addHandler(CKEDITOR.UI_PANELBUTTON, CKEDITOR.ui.panelButton.handler)
    }}),CKEDITOR.UI_PANELBUTTON = "panelbutton",function () {
        CKEDITOR.plugins.add("panel", {beforeInit: function (a) {
            a.ui.addHandler(CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler)
        }});
        CKEDITOR.UI_PANEL = "panel";
        CKEDITOR.ui.panel = function (a, b) {
            b && CKEDITOR.tools.extend(this, b);
            CKEDITOR.tools.extend(this, {className: "", css: []});
            this.id = CKEDITOR.tools.getNextId();
            this.document = a;
            this.isFramed = this.forceIFrame || this.css.length;
            this._ = {blocks: {}}
        };
        CKEDITOR.ui.panel.handler = {create: function (a) {
            return new CKEDITOR.ui.panel(a)
        }};
        var b = CKEDITOR.addTemplate("panel", '<div lang="{langCode}" id="{id}" dir={dir} class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style="z-index:{z-index}" role="presentation">{frame}</div>'), c = CKEDITOR.addTemplate("panel-frame", '<iframe id="{id}" class="cke_panel_frame" role="application" frameborder="0" src="{src}"></iframe>'),
            a = CKEDITOR.addTemplate("panel-frame-inner", '<!DOCTYPE html><html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}"><head>{css}</head><body class="cke_{dir}" style="margin:0;padding:0" onload="{onload}"></body></html>');
        CKEDITOR.ui.panel.prototype = {render: function (h, f) {
            this.getHolderElement = function () {
                var b = this._.holder;
                if (!b) {
                    if (this.isFramed) {
                        var b = this.document.getById(this.id + "_frame"), d = b.getParent(), b = b.getFrameDocument();
                        CKEDITOR.env.iOS && d.setStyles({overflow: "scroll", "-webkit-overflow-scrolling": "touch"});
                        d = CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function () {
                            this.isLoaded = true;
                            if (this.onLoad)this.onLoad()
                        }, this));
                        b.write(a.output(CKEDITOR.tools.extend({css: CKEDITOR.tools.buildStyleHtml(this.css), onload: "window.parent.CKEDITOR.tools.callFunction(" + d + ");"}, g)));
                        b.getWindow().$.CKEDITOR = CKEDITOR;
                        b.on("key" + (CKEDITOR.env.opera ? "press" : "down"), function (a) {
                            var b = a.data.getKeystroke(), d = this.document.getById(this.id).getAttribute("dir");
                            this._.onKeyDown && this._.onKeyDown(b) === false ? a.data.preventDefault() :
                                (b == 27 || b == (d == "rtl" ? 39 : 37)) && this.onEscape && this.onEscape(b) === false && a.data.preventDefault()
                        }, this);
                        b = b.getBody();
                        b.unselectable();
                        CKEDITOR.env.air && CKEDITOR.tools.callFunction(d)
                    } else b = this.document.getById(this.id);
                    this._.holder = b
                }
                return b
            };
            var g = {editorId: h.id, id: this.id, langCode: h.langCode, dir: h.lang.dir, cls: this.className, frame: "", env: CKEDITOR.env.cssClass, "z-index": h.config.baseFloatZIndex + 1};
            if (this.isFramed)g.frame = c.output({id: this.id + "_frame", src: "javascript:void(document.open()," + (CKEDITOR.env.isCustomDomain() ?
                "document.domain='" + document.domain + "'," : "") + 'document.close())">'});
            var e = b.output(g);
            f && f.push(e);
            return e
        }, addBlock: function (a, b) {
            b = this._.blocks[a] = b instanceof CKEDITOR.ui.panel.block ? b : new CKEDITOR.ui.panel.block(this.getHolderElement(), b);
            this._.currentBlock || this.showBlock(a);
            return b
        }, getBlock: function (a) {
            return this._.blocks[a]
        }, showBlock: function (a) {
            var a = this._.blocks[a], b = this._.currentBlock, c = !this.forceIFrame || CKEDITOR.env.ie ? this._.holder : this.document.getById(this.id + "_frame");
            if (b) {
                c.removeAttributes(b.attributes);
                b.hide()
            }
            this._.currentBlock = a;
            c.setAttributes(a.attributes);
            CKEDITOR.fire("ariaWidget", c);
            a._.focusIndex = -1;
            this._.onKeyDown = a.onKeyDown && CKEDITOR.tools.bind(a.onKeyDown, a);
            a.show();
            return a
        }, destroy: function () {
            this.element && this.element.remove()
        }};
        CKEDITOR.ui.panel.block = CKEDITOR.tools.createClass({$: function (a, b) {
            this.element = a.append(a.getDocument().createElement("div", {attributes: {tabIndex: -1, "class": "cke_panel_block", role: "presentation"}, styles: {display: "none"}}));
            b && CKEDITOR.tools.extend(this,
                b);
            if (!this.attributes.title)this.attributes.title = this.attributes["aria-label"];
            this.keys = {};
            this._.focusIndex = -1;
            this.element.disableContextMenu()
        }, _: {markItem: function (a) {
            if (a != -1) {
                a = this.element.getElementsByTag("a").getItem(this._.focusIndex = a);
                (CKEDITOR.env.webkit || CKEDITOR.env.opera) && a.getDocument().getWindow().focus();
                a.focus();
                this.onMark && this.onMark(a)
            }
        }}, proto: {show: function () {
            this.element.setStyle("display", "")
        }, hide: function () {
            (!this.onHide || this.onHide.call(this) !== true) && this.element.setStyle("display",
                "none")
        }, onKeyDown: function (a) {
            var b = this.keys[a];
            switch (b) {
                case "next":
                    for (var a = this._.focusIndex, b = this.element.getElementsByTag("a"), c; c = b.getItem(++a);)if (c.getAttribute("_cke_focus") && c.$.offsetWidth) {
                        this._.focusIndex = a;
                        c.focus();
                        break
                    }
                    return false;
                case "prev":
                    a = this._.focusIndex;
                    for (b = this.element.getElementsByTag("a"); a > 0 && (c = b.getItem(--a));)if (c.getAttribute("_cke_focus") && c.$.offsetWidth) {
                        this._.focusIndex = a;
                        c.focus();
                        break
                    }
                    return false;
                case "click":
                case "mouseup":
                    a = this._.focusIndex;
                    (c = a >= 0 && this.element.getElementsByTag("a").getItem(a)) && (c.$[b] ? c.$[b]() : c.$["on" + b]());
                    return false
            }
            return true
        }}})
    }(),CKEDITOR.plugins.add("floatpanel", {requires: "panel"}),function () {
        function b(a, b, f, g, e) {
            var e = CKEDITOR.tools.genKey(b.getUniqueId(), f.getUniqueId(), a.lang.dir, a.uiColor || "", g.css || "", e || ""), i = c[e];
            if (!i) {
                i = c[e] = new CKEDITOR.ui.panel(b, g);
                i.element = f.append(CKEDITOR.dom.element.createFromHtml(i.render(a), b));
                i.element.setStyles({display: "none", position: "absolute"})
            }
            return i
        }

        var c =
        {};
        CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({$: function (a, c, f, g) {
            function e() {
                k.hide()
            }

            f.forceIFrame = 1;
            f.toolbarRelated && a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && (c = CKEDITOR.document.getById("cke_" + a.name));
            var i = c.getDocument(), g = b(a, i, c, f, g || 0), d = g.element, j = d.getFirst(), k = this;
            d.disableContextMenu();
            d.setAttribute("role", "application");
            this.element = d;
            this._ = {editor: a, panel: g, parentElement: c, definition: f, document: i, iframe: j, children: [], dir: a.lang.dir};
            a.on("mode", e);
            a.on("resize", e);
            i.getWindow().on("resize", e)
        }, proto: {addBlock: function (a, b) {
            return this._.panel.addBlock(a, b)
        }, addListBlock: function (a, b) {
            return this._.panel.addListBlock(a, b)
        }, getBlock: function (a) {
            return this._.panel.getBlock(a)
        }, showBlock: function (a, b, c, g, e) {
            var i = this._.panel, d = i.showBlock(a);
            this.allowBlur(false);
            a = this._.editor.editable();
            this._.returnFocus = a.hasFocus ? a : new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);
            var j = this.element, a = this._.iframe, a = CKEDITOR.env.ie ? a : new CKEDITOR.dom.window(a.$.contentWindow),
                k = j.getDocument(), l = this._.parentElement.getPositionedAncestor(), m = b.getDocumentPosition(k), k = l ? l.getDocumentPosition(k) : {x: 0, y: 0}, n = this._.dir == "rtl", o = m.x + (g || 0) - k.x, s = m.y + (e || 0) - k.y;
            if (n && (c == 1 || c == 4))o = o + b.$.offsetWidth; else if (!n && (c == 2 || c == 3))o = o + (b.$.offsetWidth - 1);
            if (c == 3 || c == 4)s = s + (b.$.offsetHeight - 1);
            this._.panel._.offsetParentId = b.getId();
            j.setStyles({top: s + "px", left: 0, display: ""});
            j.setOpacity(0);
            j.getFirst().removeStyle("width");
            this._.editor.focusManager.add(a);
            if (!this._.blurSet) {
                CKEDITOR.event.useCapture =
                    true;
                a.on("blur", function (a) {
                    if (this.allowBlur() && a.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET && this.visible && !this._.activeChild) {
                        delete this._.returnFocus;
                        this.hide()
                    }
                }, this);
                a.on("focus", function () {
                    this._.focused = true;
                    this.hideChild();
                    this.allowBlur(true)
                }, this);
                CKEDITOR.event.useCapture = false;
                this._.blurSet = 1
            }
            i.onEscape = CKEDITOR.tools.bind(function (a) {
                if (this.onEscape && this.onEscape(a) === false)return false
            }, this);
            CKEDITOR.tools.setTimeout(function () {
                var a = CKEDITOR.tools.bind(function () {
                    j.removeStyle("width");
                    if (d.autoSize) {
                        var a = d.element.getDocument(), a = (CKEDITOR.env.webkit ? d.element : a.getBody()).$.scrollWidth;
                        CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((j.$.offsetWidth || 0) - (j.$.clientWidth || 0) + 3));
                        j.setStyle("width", a + 10 + "px");
                        a = d.element.$.scrollHeight;
                        CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((j.$.offsetHeight || 0) - (j.$.clientHeight || 0) + 3));
                        j.setStyle("height", a + "px");
                        i._.currentBlock.element.setStyle("display", "none").removeStyle("display")
                    } else j.removeStyle("height");
                    n && (o = o - j.$.offsetWidth);
                    j.setStyle("left", o + "px");
                    var b = i.element.getWindow(), a = j.$.getBoundingClientRect(), b = b.getViewPaneSize(), c = a.width || a.right - a.left, e = a.height || a.bottom - a.top, f = n ? a.right : b.width - a.left, g = n ? b.width - a.right : a.left;
                    n ? f < c && (o = g > c ? o + c : b.width > c ? o - a.left : o - a.right + b.width) : f < c && (o = g > c ? o - c : b.width > c ? o - a.right + b.width : o - a.left);
                    c = a.top;
                    b.height - a.top < e && (s = c > e ? s - e : b.height > e ? s - a.bottom + b.height : s - a.top);
                    if (CKEDITOR.env.ie) {
                        b = a = new CKEDITOR.dom.element(j.$.offsetParent);
                        b.getName() == "html" && (b = b.getDocument().getBody());
                        b.getComputedStyle("direction") == "rtl" && (o = CKEDITOR.env.ie8Compat ? o - j.getDocument().getDocumentElement().$.scrollLeft * 2 : o - (a.$.scrollWidth - a.$.clientWidth))
                    }
                    var a = j.getFirst(), h;
                    (h = a.getCustomData("activePanel")) && h.onHide && h.onHide.call(this, 1);
                    a.setCustomData("activePanel", this);
                    j.setStyles({top: s + "px", left: o + "px"});
                    j.setOpacity(1)
                }, this);
                i.isLoaded ? a() : i.onLoad = a;
                CKEDITOR.tools.setTimeout(function () {
                    this.focus();
                    this.allowBlur(true);
                    this._.editor.fire("panelShow", this)
                }, 0, this)
            }, CKEDITOR.env.air ?
                200 : 0, this);
            this.visible = 1;
            this.onShow && this.onShow.call(this)
        }, focus: function () {
            if (CKEDITOR.env.webkit) {
                var a = CKEDITOR.document.getActive();
                !a.equals(this._.iframe) && a.$.blur()
            }
            (this._.lastFocused || this._.iframe.getFrameDocument().getWindow()).focus()
        }, blur: function () {
            var a = this._.iframe.getFrameDocument().getActive();
            a.is("a") && (this._.lastFocused = a)
        }, hide: function (a) {
            if (this.visible && (!this.onHide || this.onHide.call(this) !== true)) {
                this.hideChild();
                CKEDITOR.env.gecko && this._.iframe.getFrameDocument().$.activeElement.blur();
                this.element.setStyle("display", "none");
                this.visible = 0;
                this.element.getFirst().removeCustomData("activePanel");
                if (a = a && this._.returnFocus) {
                    CKEDITOR.env.webkit && a.type && a.getWindow().$.focus();
                    a.focus()
                }
                delete this._.lastFocused;
                this._.editor.fire("panelHide", this)
            }
        }, allowBlur: function (a) {
            var b = this._.panel;
            if (a != void 0)b.allowBlur = a;
            return b.allowBlur
        }, showAsChild: function (a, b, c, g, e, i) {
            if (!(this._.activeChild == a && a._.panel._.offsetParentId == c.getId())) {
                this.hideChild();
                a.onHide = CKEDITOR.tools.bind(function () {
                    CKEDITOR.tools.setTimeout(function () {
                        this._.focused ||
                        this.hide()
                    }, 0, this)
                }, this);
                this._.activeChild = a;
                this._.focused = false;
                a.showBlock(b, c, g, e, i);
                this.blur();
                (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) && setTimeout(function () {
                    a.element.getChild(0).$.style.cssText += ""
                }, 100)
            }
        }, hideChild: function (a) {
            var b = this._.activeChild;
            if (b) {
                delete b.onHide;
                delete this._.activeChild;
                b.hide();
                a && this.focus()
            }
        }}});
        CKEDITOR.on("instanceDestroyed", function () {
            var a = CKEDITOR.tools.isEmpty(CKEDITOR.instances), b;
            for (b in c) {
                var f = c[b];
                a ? f.destroy() : f.element.hide()
            }
            a &&
            (c = {})
        })
    }(),CKEDITOR.plugins.add("colorbutton", {requires: "panelbutton,floatpanel", init: function (b) {
        function c(c, f, d, h) {
            var k = CKEDITOR.tools.getNextId() + "_colorBox";
            b.ui.add(c, CKEDITOR.UI_PANELBUTTON, {label: d, title: d, modes: {wysiwyg: 1}, editorFocus: 1, toolbar: "colors," + h, panel: {css: CKEDITOR.skin.getPath("editor"), attributes: {role: "listbox", "aria-label": g.panelTitle}}, onBlock: function (d, c) {
                c.autoSize = true;
                c.element.addClass("cke_colorblock");
                c.element.setHtml(a(d, f, k));
                c.element.getDocument().getBody().setStyle("overflow",
                    "hidden");
                CKEDITOR.ui.fire("ready", this);
                var e = c.keys, g = b.lang.dir == "rtl";
                e[g ? 37 : 39] = "next";
                e[40] = "next";
                e[9] = "next";
                e[g ? 39 : 37] = "prev";
                e[38] = "prev";
                e[CKEDITOR.SHIFT + 9] = "prev";
                e[32] = "click"
            }, onOpen: function () {
                var a = b.getSelection(), a = a && a.getStartElement(), a = b.elementPath(a), d, a = a.block || a.blockLimit || b.document.getBody();
                do d = a && a.getComputedStyle(f == "back" ? "background-color" : "color") || "transparent"; while (f == "back" && d == "transparent" && a && (a = a.getParent()));
                if (!d || d == "transparent")d = "#ffffff";
                this._.panel._.iframe.getFrameDocument().getById(k).setStyle("background-color",
                    d);
                return d
            }})
        }

        function a(a, c, d) {
            var j = [], k = f.colorButton_colors.split(","), l = CKEDITOR.tools.addFunction(function (d, c) {
                if (d == "?") {
                    var g = arguments.callee, i = function (a) {
                        this.removeListener("ok", i);
                        this.removeListener("cancel", i);
                        a.name == "ok" && g(this.getContentElement("picker", "selectedColor").getValue(), c)
                    };
                    b.openDialog("colordialog", function () {
                        this.on("ok", i);
                        this.on("cancel", i)
                    })
                } else {
                    b.focus();
                    a.hide();
                    b.fire("saveSnapshot");
                    b.removeStyle(new CKEDITOR.style(f["colorButton_" + c + "Style"], {color: "inherit"}));
                    if (d) {
                        var j = f["colorButton_" + c + "Style"];
                        j.childRule = c == "back" ? function (a) {
                            return h(a)
                        } : function (a) {
                            return!(a.is("a") || a.getElementsByTag("a").count()) || h(a)
                        };
                        b.applyStyle(new CKEDITOR.style(j, {color: d}))
                    }
                    b.fire("saveSnapshot")
                }
            });
            j.push('<a class="cke_colorauto" _cke_focus=1 hidefocus=true title="', g.auto, '" onclick="CKEDITOR.tools.callFunction(', l, ",null,'", c, "');return false;\" href=\"javascript:void('", g.auto, '\')" role="option"><table role="presentation" cellspacing=0 cellpadding=0 width="100%"><tr><td><span class="cke_colorbox" id="',
                d, '"></span></td><td colspan=7 align=center>', g.auto, '</td></tr></table></a><table role="presentation" cellspacing=0 cellpadding=0 width="100%">');
            for (d = 0; d < k.length; d++) {
                d % 8 === 0 && j.push("</tr><tr>");
                var m = k[d].split("/"), n = m[0], o = m[1] || n;
                m[1] || (n = "#" + n.replace(/^(.)(.)(.)$/, "$1$1$2$2$3$3"));
                m = b.lang.colorbutton.colors[o] || o;
                j.push('<td><a class="cke_colorbox" _cke_focus=1 hidefocus=true title="', m, '" onclick="CKEDITOR.tools.callFunction(', l, ",'", n, "','", c, "'); return false;\" href=\"javascript:void('",
                    m, '\')" role="option"><span class="cke_colorbox" style="background-color:#', o, '"></span></a></td>')
            }
            (b.plugins.colordialog && f.colorButton_enableMore === void 0 || f.colorButton_enableMore) && j.push('</tr><tr><td colspan=8 align=center><a class="cke_colormore" _cke_focus=1 hidefocus=true title="', g.more, '" onclick="CKEDITOR.tools.callFunction(', l, ",'?','", c, "');return false;\" href=\"javascript:void('", g.more, "')\"", ' role="option">', g.more, "</a></td>");
            j.push("</tr></table>");
            return j.join("")
        }

        function h(a) {
            return a.getAttribute("contentEditable") ==
                "false" || a.getAttribute("data-nostyle")
        }

        var f = b.config, g = b.lang.colorbutton;
        if (!CKEDITOR.env.hc) {
            c("TextColor", "fore", g.textColorTitle, 10);
            c("BGColor", "back", g.bgColorTitle, 20)
        }
    }}),CKEDITOR.config.colorButton_colors = "000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969,B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9,FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF",CKEDITOR.config.colorButton_foreStyle =
    {element: "span", styles: {color: "#(color)"}, overrides: [
        {element: "font", attributes: {color: null}}
    ]},CKEDITOR.config.colorButton_backStyle = {element: "span", styles: {"background-color": "#(color)"}},CKEDITOR.plugins.colordialog = {requires: "dialog", init: function (b) {
        b.addCommand("colordialog", new CKEDITOR.dialogCommand("colordialog"));
        CKEDITOR.dialog.add("colordialog", this.path + "dialogs/colordialog.js");
        b.getColorFromDialog = function (c, a) {
            var h = function (b) {
                this.removeListener("ok", h);
                this.removeListener("cancel",
                    h);
                b = b.name == "ok" ? this.getValueOf("picker", "selectedColor") : null;
                c.call(a, b)
            }, f = function (a) {
                a.on("ok", h);
                a.on("cancel", h)
            };
            b.execCommand("colordialog");
            if (b._.storedDialogs && b._.storedDialogs.colordialog)f(b._.storedDialogs.colordialog); else CKEDITOR.on("dialogDefinition", function (a) {
                if (a.data.name == "colordialog") {
                    var b = a.data.definition;
                    a.removeListener();
                    b.onLoad = CKEDITOR.tools.override(b.onLoad, function (a) {
                        return function () {
                            f(this);
                            b.onLoad = a;
                            typeof a == "function" && a.call(this)
                        }
                    })
                }
            })
        }
    }},CKEDITOR.plugins.add("colordialog",
        CKEDITOR.plugins.colordialog),CKEDITOR.plugins.add("menu", {requires: "floatpanel", beforeInit: function (b) {
        for (var c = b.config.menu_groups.split(","), a = b._.menuGroups = {}, h = b._.menuItems = {}, f = 0; f < c.length; f++)a[c[f]] = f + 1;
        b.addMenuGroup = function (b, c) {
            a[b] = c || 100
        };
        b.addMenuItem = function (b, c) {
            a[c.group] && (h[b] = new CKEDITOR.menuItem(this, b, c))
        };
        b.addMenuItems = function (a) {
            for (var b in a)this.addMenuItem(b, a[b])
        };
        b.getMenuItem = function (a) {
            return h[a]
        };
        b.removeMenuItem = function (a) {
            delete h[a]
        }
    }}),function () {
        function b(a) {
            a.sort(function (a, b) {
                return a.group < b.group ? -1 : a.group > b.group ? 1 : a.order < b.order ? -1 : a.order > b.order ? 1 : 0
            })
        }

        var c = '<span class="cke_menuitem"><a id="{id}" class="cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href="{href}" title="{title}" tabindex="-1"_cke_focus=1 hidefocus="true" role="menuitem" aria-haspopup="{hasPopup}" aria-disabled="{disabled}"';
        if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac)c = c + ' onkeypress="return false;"';
        CKEDITOR.env.gecko && (c = c + ' onblur="this.style.cssText = this.style.cssText;"');
        var c = c + (' onmouseover="CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout="CKEDITOR.tools.callFunction({moveOutFn},{index});" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},{index}); return false;">'), a = CKEDITOR.addTemplate("menuItem", c + '<span class="cke_menubutton_inner"><span class="cke_menubutton_icon"><span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}"></span></span><span class="cke_menubutton_label">{label}</span>{arrowHtml}</span></a></span>'),
            h = CKEDITOR.addTemplate("menuArrow", '<span class="cke_menuarrow"><span>{label}</span></span>');
        CKEDITOR.menu = CKEDITOR.tools.createClass({$: function (a, b) {
            b = this._.definition = b || {};
            this.id = CKEDITOR.tools.getNextId();
            this.editor = a;
            this.items = [];
            this._.listeners = [];
            this._.level = b.level || 1;
            var c = CKEDITOR.tools.extend({}, b.panel, {css: [CKEDITOR.skin.getPath("editor")], level: this._.level - 1, block: {}}), i = c.block.attributes = c.attributes || {};
            !i.role && (i.role = "menu");
            this._.panelDefinition = c
        }, _: {onShow: function () {
            var a =
                this.editor.getSelection(), b = a && a.getStartElement(), c = this.editor.elementPath(), i = this._.listeners;
            this.removeAll();
            for (var d = 0; d < i.length; d++) {
                var h = i[d](b, a, c);
                if (h)for (var k in h) {
                    var l = this.editor.getMenuItem(k);
                    if (l && (!l.command || this.editor.getCommand(l.command).state)) {
                        l.state = h[k];
                        this.add(l)
                    }
                }
            }
        }, onClick: function (a) {
            this.hide();
            if (a.onClick)a.onClick(); else a.command && this.editor.execCommand(a.command)
        }, onEscape: function (a) {
            var b = this.parent;
            b ? b._.panel.hideChild(1) : a == 27 && this.hide(1);
            return false
        },
            onHide: function () {
                this.onHide && this.onHide()
            }, showSubMenu: function (a) {
                var b = this._.subMenu, c = this.items[a];
                if (c = c.getItems && c.getItems()) {
                    if (b)b.removeAll(); else {
                        b = this._.subMenu = new CKEDITOR.menu(this.editor, CKEDITOR.tools.extend({}, this._.definition, {level: this._.level + 1}, true));
                        b.parent = this;
                        b._.onClick = CKEDITOR.tools.bind(this._.onClick, this)
                    }
                    for (var i in c) {
                        var d = this.editor.getMenuItem(i);
                        if (d) {
                            d.state = c[i];
                            b.add(d)
                        }
                    }
                    var h = this._.panel.getBlock(this.id).element.getDocument().getById(this.id +
                        ("" + a));
                    setTimeout(function () {
                        b.show(h, 2)
                    }, 0)
                } else this._.panel.hideChild(1)
            }}, proto: {add: function (a) {
            if (!a.order)a.order = this.items.length;
            this.items.push(a)
        }, removeAll: function () {
            this.items = []
        }, show: function (a, c, e, i) {
            if (!this.parent) {
                this._.onShow();
                if (!this.items.length)return
            }
            var c = c || (this.editor.lang.dir == "rtl" ? 2 : 1), d = this.items, h = this.editor, k = this._.panel, l = this._.element;
            if (!k) {
                k = this._.panel = new CKEDITOR.ui.floatPanel(this.editor, CKEDITOR.document.getBody(), this._.panelDefinition, this._.level);
                k.onEscape = CKEDITOR.tools.bind(function (a) {
                    if (this._.onEscape(a) === false)return false
                }, this);
                k.onShow = function () {
                    k._.panel.getHolderElement().getParent().addClass("cke cke_reset_all")
                };
                k.onHide = CKEDITOR.tools.bind(function () {
                    this._.onHide && this._.onHide()
                }, this);
                l = k.addBlock(this.id, this._.panelDefinition.block);
                l.autoSize = true;
                var m = l.keys;
                m[40] = "next";
                m[9] = "next";
                m[38] = "prev";
                m[CKEDITOR.SHIFT + 9] = "prev";
                m[h.lang.dir == "rtl" ? 37 : 39] = CKEDITOR.env.ie ? "mouseup" : "click";
                m[32] = CKEDITOR.env.ie ? "mouseup" :
                    "click";
                CKEDITOR.env.ie && (m[13] = "mouseup");
                l = this._.element = l.element;
                m = l.getDocument();
                m.getBody().setStyle("overflow", "hidden");
                m.getElementsByTag("html").getItem(0).setStyle("overflow", "hidden");
                this._.itemOverFn = CKEDITOR.tools.addFunction(function (a) {
                    clearTimeout(this._.showSubTimeout);
                    this._.showSubTimeout = CKEDITOR.tools.setTimeout(this._.showSubMenu, h.config.menu_subMenuDelay || 400, this, [a])
                }, this);
                this._.itemOutFn = CKEDITOR.tools.addFunction(function () {
                    clearTimeout(this._.showSubTimeout)
                }, this);
                this._.itemClickFn = CKEDITOR.tools.addFunction(function (a) {
                    var b = this.items[a];
                    if (b.state == CKEDITOR.TRISTATE_DISABLED)this.hide(1); else if (b.getItems)this._.showSubMenu(a); else this._.onClick(b)
                }, this)
            }
            b(d);
            for (var m = h.elementPath(), m = ['<div class="cke_menu' + (m && m.direction() != h.lang.dir ? " cke_mixed_dir_content" : "") + '" role="presentation">'], n = d.length, o = n && d[0].group, s = 0; s < n; s++) {
                var r = d[s];
                if (o != r.group) {
                    m.push('<div class="cke_menuseparator" role="separator"></div>');
                    o = r.group
                }
                r.render(this, s, m)
            }
            m.push("</div>");
            l.setHtml(m.join(""));
            CKEDITOR.ui.fire("ready", this);
            this.parent ? this.parent._.panel.showAsChild(k, this.id, a, c, e, i) : k.showBlock(this.id, a, c, e, i);
            h.fire("menuShow", [k])
        }, addListener: function (a) {
            this._.listeners.push(a)
        }, hide: function (a) {
            this._.onHide && this._.onHide();
            this._.panel && this._.panel.hide(a)
        }}});
        CKEDITOR.menuItem = CKEDITOR.tools.createClass({$: function (a, b, c) {
            CKEDITOR.tools.extend(this, c, {order: 0, className: "cke_menubutton__" + b});
            this.group = a._.menuGroups[this.group];
            this.editor = a;
            this.name =
                b
        }, proto: {render: function (b, c, e) {
            var i = b.id + ("" + c), d = typeof this.state == "undefined" ? CKEDITOR.TRISTATE_OFF : this.state, j = d == CKEDITOR.TRISTATE_ON ? "on" : d == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off", k = this.getItems, l = "&#" + (this.editor.lang.dir == "rtl" ? "9668" : "9658") + ";", m = this.name;
            if (this.icon && !/\./.test(this.icon))m = this.icon;
            b = {id: i, name: this.name, iconName: m, label: this.label, cls: this.className || "", state: j, hasPopup: k ? "true" : "false", disabled: d == CKEDITOR.TRISTATE_DISABLED, title: this.label, href: "javascript:void('" +
                (this.label || "").replace("'") + "')", hoverFn: b._.itemOverFn, moveOutFn: b._.itemOutFn, clickFn: b._.itemClickFn, index: c, iconStyle: CKEDITOR.skin.getIconStyle(m, this.editor.lang.dir == "rtl", m == this.icon ? null : this.icon, this.iconOffset), arrowHtml: k ? h.output({label: l}) : ""};
            a.output(b, e)
        }}})
    }(),CKEDITOR.config.menu_groups = "clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div",CKEDITOR.plugins.add("contextmenu",
        {requires: "menu", onLoad: function () {
            CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({base: CKEDITOR.menu, $: function (b) {
                this.base.call(this, b, {panel: {className: "cke_menu_panel", attributes: {"aria-label": b.lang.contextmenu.options}}})
            }, proto: {addTarget: function (b, c) {
                if (CKEDITOR.env.opera && !("oncontextmenu"in document.body)) {
                    var a;
                    b.on("mousedown", function (f) {
                        f = f.data;
                        if (f.$.button != 2)f.getKeystroke() == CKEDITOR.CTRL + 1 && b.fire("contextmenu", f); else if (!c || !(CKEDITOR.env.mac ? f.$.metaKey : f.$.ctrlKey)) {
                            var e =
                                f.getTarget();
                            if (!a) {
                                e = e.getDocument();
                                a = e.createElement("input");
                                a.$.type = "button";
                                e.getBody().append(a)
                            }
                            a.setAttribute("style", "position:absolute;top:" + (f.$.clientY - 2) + "px;left:" + (f.$.clientX - 2) + "px;width:5px;height:5px;opacity:0.01")
                        }
                    });
                    b.on("mouseup", function (c) {
                        if (a) {
                            a.remove();
                            a = void 0;
                            b.fire("contextmenu", c.data)
                        }
                    })
                }
                b.on("contextmenu", function (a) {
                    a = a.data;
                    if (!c || !(CKEDITOR.env.webkit ? h : CKEDITOR.env.mac ? a.$.metaKey : a.$.ctrlKey)) {
                        a.preventDefault();
                        var b = a.getTarget().getDocument(), f = a.getTarget().getDocument().getDocumentElement(),
                            d = !b.equals(CKEDITOR.document), b = b.getWindow().getScrollPosition(), j = d ? a.$.clientX : a.$.pageX || b.x + a.$.clientX, k = d ? a.$.clientY : a.$.pageY || b.y + a.$.clientY;
                        CKEDITOR.tools.setTimeout(function () {
                            this.open(f, null, j, k)
                        }, CKEDITOR.env.ie ? 200 : 0, this)
                    }
                }, this);
                if (CKEDITOR.env.opera)b.on("keypress", function (a) {
                    a = a.data;
                    a.$.keyCode === 0 && a.preventDefault()
                });
                if (CKEDITOR.env.webkit) {
                    var h, f = function () {
                        h = 0
                    };
                    b.on("keydown", function (a) {
                        h = CKEDITOR.env.mac ? a.data.$.metaKey : a.data.$.ctrlKey
                    });
                    b.on("keyup", f);
                    b.on("contextmenu",
                        f)
                }
            }, open: function (b, c, a, h) {
                this.editor.focus();
                b = b || CKEDITOR.document.getDocumentElement();
                this.editor.selectionChange(1);
                this.show(b, c, a, h)
            }}})
        }, beforeInit: function (b) {
            var c = b.contextMenu = new CKEDITOR.plugins.contextMenu(b);
            b.on("contentDom", function () {
                c.addTarget(b.editable(), b.config.browserContextMenuOnCtrl !== false)
            });
            b.addCommand("contextMenu", {exec: function () {
                b.contextMenu.open(b.document.getBody())
            }});
            b.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu");
            b.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT +
                121, "contextMenu")
        }}),function () {
        function b(a) {
            var b = this.att, a = a && a.hasAttribute(b) && a.getAttribute(b) || "";
            a !== void 0 && this.setValue(a)
        }

        function c() {
            for (var a, b = 0; b < arguments.length; b++)if (arguments[b]instanceof CKEDITOR.dom.element) {
                a = arguments[b];
                break
            }
            if (a) {
                var b = this.att, c = this.getValue();
                c ? a.setAttribute(b, c) : a.removeAttribute(b, c)
            }
        }

        CKEDITOR.plugins.add("dialogadvtab", {requires: "dialog", createAdvancedTab: function (a, h) {
            h || (h = {id: 1, dir: 1, classes: 1, styles: 1});
            var f = a.lang.common, g = {id: "advanced",
                label: f.advancedTab, title: f.advancedTab, elements: [
                    {type: "vbox", padding: 1, children: []}
                ]}, e = [];
            if (h.id || h.dir) {
                h.id && e.push({id: "advId", att: "id", type: "text", label: f.id, setup: b, commit: c});
                h.dir && e.push({id: "advLangDir", att: "dir", type: "select", label: f.langDir, "default": "", style: "width:100%", items: [
                    [f.notSet, ""],
                    [f.langDirLTR, "ltr"],
                    [f.langDirRTL, "rtl"]
                ], setup: b, commit: c});
                g.elements[0].children.push({type: "hbox", widths: ["50%", "50%"], children: [].concat(e)})
            }
            if (h.styles || h.classes) {
                e = [];
                h.styles && e.push({id: "advStyles",
                    att: "style", type: "text", label: f.styles, "default": "", validate: CKEDITOR.dialog.validate.inlineStyle(f.invalidInlineStyle), onChange: function () {
                    }, getStyle: function (a, b) {
                        var c = this.getValue().match(RegExp("(?:^|;)\\s*" + a + "\\s*:\\s*([^;]*)", "i"));
                        return c ? c[1] : b
                    }, updateStyle: function (b, d) {
                        var c = this.getValue(), e = a.document.createElement("span");
                        e.setAttribute("style", c);
                        e.setStyle(b, d);
                        c = CKEDITOR.tools.normalizeCssText(e.getAttribute("style"));
                        this.setValue(c, 1)
                    }, setup: b, commit: c});
                h.classes && e.push({type: "hbox",
                    widths: ["45%", "55%"], children: [
                        {id: "advCSSClasses", att: "class", type: "text", label: f.cssClasses, "default": "", setup: b, commit: c}
                    ]});
                g.elements[0].children.push({type: "hbox", widths: ["50%", "50%"], children: [].concat(e)})
            }
            return g
        }})
    }(),function () {
        CKEDITOR.plugins.add("div", {requires: "dialog", init: function (b) {
            if (!b.blockless) {
                var c = b.lang.div;
                b.addCommand("creatediv", new CKEDITOR.dialogCommand("creatediv", {contextSensitive: true, refresh: function (a, b) {
                    this.setState("div"in(a.config.div_wrapTable ? b.root : b.blockLimit).getDtd() ?
                        CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
                }}));
                b.addCommand("editdiv", new CKEDITOR.dialogCommand("editdiv"));
                b.addCommand("removediv", {exec: function (a) {
                    function b(c) {
                        if ((c = CKEDITOR.plugins.div.getSurroundDiv(a, c)) && !c.data("cke-div-added")) {
                            d.push(c);
                            c.data("cke-div-added")
                        }
                    }

                    for (var c = a.getSelection(), g = c && c.getRanges(), e, i = c.createBookmarks(), d = [], j = 0; j < g.length; j++) {
                        e = g[j];
                        if (e.collapsed)b(c.getStartElement()); else {
                            e = new CKEDITOR.dom.walker(e);
                            e.evaluator = b;
                            e.lastForward()
                        }
                    }
                    for (j = 0; j < d.length; j++)d[j].remove(true);
                    c.selectBookmarks(i)
                }});
                b.ui.addButton && b.ui.addButton("CreateDiv", {label: c.toolbar, command: "creatediv", toolbar: "blocks,50"});
                if (b.addMenuItems) {
                    b.addMenuItems({editdiv: {label: c.edit, command: "editdiv", group: "div", order: 1}, removediv: {label: c.remove, command: "removediv", group: "div", order: 5}});
                    b.contextMenu && b.contextMenu.addListener(function (a) {
                        return!a || a.isReadOnly() ? null : CKEDITOR.plugins.div.getSurroundDiv(b) ? {editdiv: CKEDITOR.TRISTATE_OFF, removediv: CKEDITOR.TRISTATE_OFF} : null
                    })
                }
                CKEDITOR.dialog.add("creatediv",
                        this.path + "dialogs/div.js");
                CKEDITOR.dialog.add("editdiv", this.path + "dialogs/div.js")
            }
        }});
        CKEDITOR.plugins.div = {getSurroundDiv: function (b, c) {
            var a = b.elementPath(c);
            return b.elementPath(a.blockLimit).contains("div", 1)
        }}
    }(),function () {
        var b = {editorFocus: false, readOnly: 1, exec: function (a) {
            (a = CKEDITOR.document.getById(a._.elementsPath.idBase + "0")) && a.focus(CKEDITOR.env.ie || CKEDITOR.env.air)
        }}, c = '<span class="cke_path_empty">&nbsp;</span>', a = "";
        if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac)a =
            a + ' onkeypress="return false;"';
        CKEDITOR.env.gecko && (a = a + ' onblur="this.style.cssText = this.style.cssText;"');
        var h = CKEDITOR.addTemplate("pathItem", '<a id="{id}" href="{jsTitle}" tabindex="-1" class="cke_path_item" title="{label}"' + (CKEDITOR.env.gecko && CKEDITOR.env.version < 10900 ? ' onfocus="event.preventBubble();"' : "") + a + ' hidefocus="true"  onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role="button" aria-label="{label}">{text}</a>');
        CKEDITOR.plugins.add("elementspath", {init: function (a) {
            function g(b) {
                b = a._.elementsPath.list[b];
                if (b.equals(a.editable())) {
                    var d = a.createRange();
                    d.selectNodeContents(b);
                    d.select()
                } else a.getSelection().selectElement(b);
                a.focus()
            }

            function e() {
                d && d.setHtml(c);
                delete a._.elementsPath.list
            }

            if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                var i = a.ui.spaceId("path"), d, j = "cke_elementspath_" + CKEDITOR.tools.getNextNumber() + "_";
                a._.elementsPath = {idBase: j, filters: []};
                a.on("uiSpace", function (b) {
                    if (b.data.space ==
                        "bottom")b.data.html = b.data.html + ('<span id="' + i + '_label" class="cke_voice_label">' + a.lang.elementspath.eleLabel + '</span><span id="' + i + '" class="cke_path" role="group" aria-labelledby="' + i + '_label">' + c + "</span>")
                });
                a.on("uiReady", function () {
                    var b = a.ui.space("path");
                    b && a.focusManager.add(b, 1)
                });
                var k = CKEDITOR.tools.addFunction(g), l = CKEDITOR.tools.addFunction(function (b, d) {
                    var c = a._.elementsPath.idBase, e, d = new CKEDITOR.dom.event(d);
                    e = a.lang.dir == "rtl";
                    switch (d.getKeystroke()) {
                        case e ? 39 : 37:
                        case 9:
                            (e =
                                CKEDITOR.document.getById(c + (b + 1))) || (e = CKEDITOR.document.getById(c + "0"));
                            e.focus();
                            return false;
                        case e ? 37 : 39:
                        case CKEDITOR.SHIFT + 9:
                            (e = CKEDITOR.document.getById(c + (b - 1))) || (e = CKEDITOR.document.getById(c + (a._.elementsPath.list.length - 1)));
                            e.focus();
                            return false;
                        case 27:
                            a.focus();
                            return false;
                        case 13:
                        case 32:
                            g(b);
                            return false
                    }
                    return true
                });
                a.on("selectionChange", function (b) {
                    for (var e = a.editable(), g = b.data.selection.getStartElement(), b = [], s = a._.elementsPath.list = [], r = a._.elementsPath.filters; g;) {
                        var p =
                            0, t;
                        t = g.data("cke-display-name") ? g.data("cke-display-name") : g.data("cke-real-element-type") ? g.data("cke-real-element-type") : g.getName();
                        for (var x = 0; x < r.length; x++) {
                            var A = r[x](g, t);
                            if (A === false) {
                                p = 1;
                                break
                            }
                            t = A || t
                        }
                        if (!p) {
                            p = s.push(g) - 1;
                            x = a.lang.elementspath.eleTitle.replace(/%1/, t);
                            t = h.output({id: j + p, label: x, text: t, jsTitle: "javascript:void('" + t + "')", index: p, keyDownFn: l, clickFn: k});
                            b.unshift(t)
                        }
                        if (g.equals(e))break;
                        g = g.getParent()
                    }
                    d || (d = CKEDITOR.document.getById(i));
                    e = d;
                    e.setHtml(b.join("") + c);
                    a.fire("elementsPathUpdate",
                        {space: e})
                });
                a.on("readOnly", e);
                a.on("contentDomUnload", e);
                a.addCommand("elementsPathFocus", b);
                a.setKeystroke(CKEDITOR.ALT + 122, "elementsPathFocus")
            }
        }})
    }(),function () {
        function b(a, b, d) {
            function c(d) {
                if ((j = h[d ? "getFirst" : "getLast"]()) && (!j.is || !j.isBlockBoundary()) && (k = b.root[d ? "getPrevious" : "getNext"](CKEDITOR.dom.walker.invisible(true))) && (!k.is || !k.isBlockBoundary({br: 1})))a.document.createElement("br")[d ? "insertBefore" : "insertAfter"](j)
            }

            for (var e = CKEDITOR.plugins.list.listToArray(b.root, d), f = [],
                     g = 0; g < b.contents.length; g++) {
                var i = b.contents[g];
                if ((i = i.getAscendant("li", true)) && !i.getCustomData("list_item_processed")) {
                    f.push(i);
                    CKEDITOR.dom.element.setMarker(d, i, "list_item_processed", true)
                }
            }
            i = null;
            for (g = 0; g < f.length; g++) {
                i = f[g].getCustomData("listarray_index");
                e[i].indent = -1
            }
            for (g = i + 1; g < e.length; g++)if (e[g].indent > e[g - 1].indent + 1) {
                f = e[g - 1].indent + 1 - e[g].indent;
                for (i = e[g].indent; e[g] && e[g].indent >= i;) {
                    e[g].indent = e[g].indent + f;
                    g++
                }
                g--
            }
            var h = CKEDITOR.plugins.list.arrayToList(e, d, null, a.config.enterMode,
                b.root.getAttribute("dir")).listNode, j, k;
            c(true);
            c();
            h.replace(b.root)
        }

        function c(a, b) {
            this.name = a;
            this.context = this.type = b
        }

        function a(a, b, d, c) {
            for (var e, f; e = a[c ? "getLast" : "getFirst"](n);) {
                (f = e.getDirection(1)) !== b.getDirection(1) && e.setAttribute("dir", f);
                e.remove();
                d ? e[c ? "insertBefore" : "insertAfter"](d) : b.append(e, c)
            }
        }

        function h(b) {
            var d;
            (d = function (d) {
                var c = b[d ? "getPrevious" : "getNext"](k);
                if (c && c.type == CKEDITOR.NODE_ELEMENT && c.is(b.getName())) {
                    a(b, c, null, !d);
                    b.remove();
                    b = c
                }
            })();
            d(1)
        }

        function f(a) {
            return a.type ==
                CKEDITOR.NODE_ELEMENT && (a.getName()in CKEDITOR.dtd.$block || a.getName()in CKEDITOR.dtd.$listItem) && CKEDITOR.dtd[a.getName()]["#"]
        }

        function g(b, d, c) {
            b.fire("saveSnapshot");
            c.enlarge(CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS);
            var f = c.extractContents();
            d.trim(false, true);
            var g = d.createBookmark(), i = new CKEDITOR.dom.elementPath(d.startContainer), j = i.block, i = i.lastElement.getAscendant("li", 1) || j, n = new CKEDITOR.dom.elementPath(c.startContainer), m = n.contains(CKEDITOR.dtd.$listItem), n = n.contains(CKEDITOR.dtd.$list);
            if (j)(j = j.getBogus()) && j.remove(); else if (n)(j = n.getPrevious(k)) && l(j) && j.remove();
            (j = f.getLast()) && (j.type == CKEDITOR.NODE_ELEMENT && j.is("br")) && j.remove();
            (j = d.startContainer.getChild(d.startOffset)) ? f.insertBefore(j) : d.startContainer.append(f);
            if (m)if (f = e(m))if (i.contains(m)) {
                a(f, m.getParent(), m);
                f.remove()
            } else i.append(f);
            for (; c.checkStartOfBlock() && c.checkEndOfBlock();) {
                n = c.startPath();
                f = n.block;
                if (f.is("li")) {
                    i = f.getParent();
                    f.equals(i.getLast(k)) && f.equals(i.getFirst(k)) && (f = i)
                }
                c.moveToPosition(f,
                    CKEDITOR.POSITION_BEFORE_START);
                f.remove()
            }
            c = c.clone();
            f = b.editable();
            c.setEndAt(f, CKEDITOR.POSITION_BEFORE_END);
            c = new CKEDITOR.dom.walker(c);
            c.evaluator = function (a) {
                return k(a) && !l(a)
            };
            (c = c.next()) && (c.type == CKEDITOR.NODE_ELEMENT && c.getName()in CKEDITOR.dtd.$list) && h(c);
            d.moveToBookmark(g);
            d.select();
            b.fire("saveSnapshot")
        }

        function e(a) {
            return(a = a.getLast(k)) && a.type == CKEDITOR.NODE_ELEMENT && a.getName()in i ? a : null
        }

        var i = {ol: 1, ul: 1}, d = CKEDITOR.dom.walker.whitespaces(), j = CKEDITOR.dom.walker.bookmark(),
            k = function (a) {
                return!(d(a) || j(a))
            }, l = CKEDITOR.dom.walker.bogus();
        CKEDITOR.plugins.list = {listToArray: function (a, b, d, c, e) {
            if (!i[a.getName()])return[];
            c || (c = 0);
            d || (d = []);
            for (var f = 0, g = a.getChildCount(); f < g; f++) {
                var h = a.getChild(f);
                h.type == CKEDITOR.NODE_ELEMENT && h.getName()in CKEDITOR.dtd.$list && CKEDITOR.plugins.list.listToArray(h, b, d, c + 1);
                if (h.$.nodeName.toLowerCase() == "li") {
                    var j = {parent: a, indent: c, element: h, contents: []};
                    if (e)j.grandparent = e; else {
                        j.grandparent = a.getParent();
                        if (j.grandparent && j.grandparent.$.nodeName.toLowerCase() ==
                            "li")j.grandparent = j.grandparent.getParent()
                    }
                    b && CKEDITOR.dom.element.setMarker(b, h, "listarray_index", d.length);
                    d.push(j);
                    for (var k = 0, l = h.getChildCount(), n; k < l; k++) {
                        n = h.getChild(k);
                        n.type == CKEDITOR.NODE_ELEMENT && i[n.getName()] ? CKEDITOR.plugins.list.listToArray(n, b, d, c + 1, j.grandparent) : j.contents.push(n)
                    }
                }
            }
            return d
        }, arrayToList: function (a, b, d, c, e) {
            d || (d = 0);
            if (!a || a.length < d + 1)return null;
            for (var f, g = a[d].parent.getDocument(), h = new CKEDITOR.dom.documentFragment(g), j = null, l = d, n = Math.max(a[d].indent, 0),
                     m = null, z, y, C = c == CKEDITOR.ENTER_P ? "p" : "div"; ;) {
                var D = a[l];
                f = D.grandparent;
                z = D.element.getDirection(1);
                if (D.indent == n) {
                    if (!j || a[l].parent.getName() != j.getName()) {
                        j = a[l].parent.clone(false, 1);
                        e && j.setAttribute("dir", e);
                        h.append(j)
                    }
                    m = j.append(D.element.clone(0, 1));
                    z != j.getDirection(1) && m.setAttribute("dir", z);
                    for (f = 0; f < D.contents.length; f++)m.append(D.contents[f].clone(1, 1));
                    l++
                } else if (D.indent == Math.max(n, 0) + 1) {
                    y = a[l - 1].element.getDirection(1);
                    l = CKEDITOR.plugins.list.arrayToList(a, null, l, c, y != z ? z : null);
                    !m.getChildCount() && (CKEDITOR.env.ie && !(g.$.documentMode > 7)) && m.append(g.createText(" "));
                    m.append(l.listNode);
                    l = l.nextIndex
                } else if (D.indent == -1 && !d && f) {
                    if (i[f.getName()]) {
                        m = D.element.clone(false, true);
                        z != f.getDirection(1) && m.setAttribute("dir", z)
                    } else m = new CKEDITOR.dom.documentFragment(g);
                    var j = f.getDirection(1) != z, F = D.element, E = F.getAttribute("class"), K = F.getAttribute("style"), I = m.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && (c != CKEDITOR.ENTER_BR || j || K || E), G, H = D.contents.length;
                    for (f = 0; f < H; f++) {
                        G = D.contents[f];
                        if (G.type == CKEDITOR.NODE_ELEMENT && G.isBlockBoundary()) {
                            j && !G.getDirection() && G.setAttribute("dir", z);
                            var L = G, J = F.getAttribute("style");
                            J && L.setAttribute("style", J.replace(/([^;])$/, "$1;") + (L.getAttribute("style") || ""));
                            E && G.addClass(E)
                        } else if (I) {
                            if (!y) {
                                y = g.createElement(C);
                                j && y.setAttribute("dir", z)
                            }
                            K && y.setAttribute("style", K);
                            E && y.setAttribute("class", E);
                            y.append(G.clone(1, 1))
                        }
                        m.append(y || G.clone(1, 1))
                    }
                    if (m.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && l != a.length - 1) {
                        (z = m.getLast()) && (z.type == CKEDITOR.NODE_ELEMENT &&
                            z.getAttribute("type") == "_moz") && z.remove();
                        (!m.getLast(k) || !(z.type == CKEDITOR.NODE_ELEMENT && z.getName()in CKEDITOR.dtd.$block)) && m.append(g.createElement("br"))
                    }
                    z = m.$.nodeName.toLowerCase();
                    !CKEDITOR.env.ie && (z == "div" || z == "p") && m.appendBogus();
                    h.append(m);
                    j = null;
                    l++
                } else return null;
                y = null;
                if (a.length <= l || Math.max(a[l].indent, 0) < n)break
            }
            if (b)for (a = h.getFirst(); a;) {
                if (a.type == CKEDITOR.NODE_ELEMENT) {
                    CKEDITOR.dom.element.clearMarkers(b, a);
                    if (a.getName()in CKEDITOR.dtd.$listItem) {
                        d = a;
                        g = e = c = void 0;
                        if (c =
                            d.getDirection()) {
                            for (e = d.getParent(); e && !(g = e.getDirection());)e = e.getParent();
                            c == g && d.removeAttribute("dir")
                        }
                    }
                }
                a = a.getNextSourceNode()
            }
            return{listNode: h, nextIndex: l}
        }};
        var m = /^h[1-6]$/, n = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT);
        c.prototype = {exec: function (a) {
            this.refresh(a, a.elementPath());
            var d = a.config, c = a.getSelection(), e = c && c.getRanges(true);
            if (this.state == CKEDITOR.TRISTATE_OFF) {
                var f = a.editable();
                if (f.getFirst(k)) {
                    var g = e.length == 1 && e[0];
                    (d = g && g.getEnclosedNode()) && (d.is && this.type ==
                        d.getName()) && this.setState(CKEDITOR.TRISTATE_ON)
                } else {
                    d.enterMode == CKEDITOR.ENTER_BR ? f.appendBogus() : e[0].fixBlock(1, d.enterMode == CKEDITOR.ENTER_P ? "p" : "div");
                    c.selectRanges(e)
                }
            }
            for (var d = c.createBookmarks(true), f = [], j = {}, e = e.createIterator(), l = 0; (g = e.getNextRange()) && ++l;) {
                var n = g.getBoundaryNodes(), q = n.startNode, u = n.endNode;
                q.type == CKEDITOR.NODE_ELEMENT && q.getName() == "td" && g.setStartAt(n.startNode, CKEDITOR.POSITION_AFTER_START);
                u.type == CKEDITOR.NODE_ELEMENT && u.getName() == "td" && g.setEndAt(n.endNode,
                    CKEDITOR.POSITION_BEFORE_END);
                g = g.createIterator();
                for (g.forceBrBreak = this.state == CKEDITOR.TRISTATE_OFF; n = g.getNextParagraph();)if (!n.getCustomData("list_block")) {
                    CKEDITOR.dom.element.setMarker(j, n, "list_block", 1);
                    for (var B = a.elementPath(n), q = B.elements, u = 0, B = B.blockLimit, z, y = q.length - 1; y >= 0 && (z = q[y]); y--)if (i[z.getName()] && B.contains(z)) {
                        B.removeCustomData("list_group_object_" + l);
                        if (q = z.getCustomData("list_group_object"))q.contents.push(n); else {
                            q = {root: z, contents: [n]};
                            f.push(q);
                            CKEDITOR.dom.element.setMarker(j,
                                z, "list_group_object", q)
                        }
                        u = 1;
                        break
                    }
                    if (!u) {
                        u = B;
                        if (u.getCustomData("list_group_object_" + l))u.getCustomData("list_group_object_" + l).contents.push(n); else {
                            q = {root: u, contents: [n]};
                            CKEDITOR.dom.element.setMarker(j, u, "list_group_object_" + l, q);
                            f.push(q)
                        }
                    }
                }
            }
            for (z = []; f.length > 0;) {
                q = f.shift();
                if (this.state == CKEDITOR.TRISTATE_OFF)if (i[q.root.getName()]) {
                    n = a;
                    e = q;
                    q = j;
                    l = z;
                    u = CKEDITOR.plugins.list.listToArray(e.root, q);
                    B = [];
                    for (g = 0; g < e.contents.length; g++) {
                        y = e.contents[g];
                        if ((y = y.getAscendant("li", true)) && !y.getCustomData("list_item_processed")) {
                            B.push(y);
                            CKEDITOR.dom.element.setMarker(q, y, "list_item_processed", true)
                        }
                    }
                    for (var y = e.root.getDocument(), C = void 0, D = void 0, g = 0; g < B.length; g++) {
                        var F = B[g].getCustomData("listarray_index"), C = u[F].parent;
                        if (!C.is(this.type)) {
                            D = y.createElement(this.type);
                            C.copyAttributes(D, {start: 1, type: 1});
                            D.removeStyle("list-style-type");
                            u[F].parent = D
                        }
                    }
                    n = CKEDITOR.plugins.list.arrayToList(u, q, null, n.config.enterMode);
                    q = void 0;
                    u = n.listNode.getChildCount();
                    for (g = 0; g < u && (q = n.listNode.getChild(g)); g++)q.getName() == this.type && l.push(q);
                    n.listNode.replace(e.root)
                } else {
                    u = a;
                    n = q;
                    g = z;
                    B = n.contents;
                    e = n.root.getDocument();
                    l = [];
                    if (B.length == 1 && B[0].equals(n.root)) {
                        q = e.createElement("div");
                        B[0].moveChildren && B[0].moveChildren(q);
                        B[0].append(q);
                        B[0] = q
                    }
                    n = n.contents[0].getParent();
                    for (y = 0; y < B.length; y++)n = n.getCommonAncestor(B[y].getParent());
                    C = u.config.useComputedState;
                    u = q = void 0;
                    C = C === void 0 || C;
                    for (y = 0; y < B.length; y++)for (D = B[y]; F = D.getParent();) {
                        if (F.equals(n)) {
                            l.push(D);
                            !u && D.getDirection() && (u = 1);
                            D = D.getDirection(C);
                            q !== null && (q = q && q != D ?
                                null : D);
                            break
                        }
                        D = F
                    }
                    if (!(l.length < 1)) {
                        B = l[l.length - 1].getNext();
                        y = e.createElement(this.type);
                        g.push(y);
                        for (C = g = void 0; l.length;) {
                            g = l.shift();
                            C = e.createElement("li");
                            if (g.is("pre") || m.test(g.getName()))g.appendTo(C); else {
                                g.copyAttributes(C);
                                if (q && g.getDirection()) {
                                    C.removeStyle("direction");
                                    C.removeAttribute("dir")
                                }
                                g.moveChildren(C);
                                g.remove()
                            }
                            C.appendTo(y)
                        }
                        q && u && y.setAttribute("dir", q);
                        B ? y.insertBefore(B) : y.appendTo(n)
                    }
                } else this.state == CKEDITOR.TRISTATE_ON && i[q.root.getName()] && b.call(this, a, q, j)
            }
            for (y =
                     0; y < z.length; y++)h(z[y]);
            CKEDITOR.dom.element.clearAllMarkers(j);
            c.selectBookmarks(d);
            a.focus()
        }, refresh: function (a, b) {
            var d = b.contains(i, 1), c = b.blockLimit || b.root;
            d && c.contains(d) ? this.setState(d.is(this.type) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_OFF)
        }};
        CKEDITOR.plugins.add("list", {init: function (a) {
            if (!a.blockless) {
                a.addCommand("numberedlist", new c("numberedlist", "ol"));
                a.addCommand("bulletedlist", new c("bulletedlist", "ul"));
                if (a.ui.addButton) {
                    a.ui.addButton("NumberedList",
                        {label: a.lang.list.numberedlist, command: "numberedlist", directional: true, toolbar: "list,10"});
                    a.ui.addButton("BulletedList", {label: a.lang.list.bulletedlist, command: "bulletedlist", directional: true, toolbar: "list,20"})
                }
                a.on("key", function (b) {
                    var d = b.data.keyCode;
                    if (a.mode == "wysiwyg" && d in{8: 1, 46: 1}) {
                        var c = a.getSelection().getRanges()[0], h = c.startPath();
                        if (c.collapsed) {
                            var h = new CKEDITOR.dom.elementPath(c.startContainer), j = d == 8, n = a.editable(), m = new CKEDITOR.dom.walker(c.clone());
                            m.evaluator = function (a) {
                                return k(a) && !l(a)
                            };
                            m.guard = function (a, b) {
                                return!(b && a.type == CKEDITOR.NODE_ELEMENT && a.is("table"))
                            };
                            d = c.clone();
                            if (j) {
                                var w, q;
                                if ((w = h.contains(i)) && c.checkBoundaryOfElement(w, CKEDITOR.START) && (w = w.getParent()) && w.is("li") && (w = e(w))) {
                                    q = w;
                                    w = w.getPrevious(k);
                                    d.moveToPosition(w && l(w) ? w : q, CKEDITOR.POSITION_BEFORE_START)
                                } else {
                                    m.range.setStartAt(n, CKEDITOR.POSITION_AFTER_START);
                                    m.range.setEnd(c.startContainer, c.startOffset);
                                    if ((w = m.previous()) && w.type == CKEDITOR.NODE_ELEMENT && (w.getName()in i || w.is("li"))) {
                                        if (!w.is("li")) {
                                            m.range.selectNodeContents(w);
                                            m.reset();
                                            m.evaluator = f;
                                            w = m.previous()
                                        }
                                        q = w;
                                        d.moveToElementEditEnd(q)
                                    }
                                }
                                if (q) {
                                    g(a, d, c);
                                    b.cancel()
                                } else if ((d = h.contains(i)) && c.checkBoundaryOfElement(d, CKEDITOR.START)) {
                                    q = d.getFirst(k);
                                    if (c.checkBoundaryOfElement(q, CKEDITOR.START)) {
                                        w = d.getPrevious(k);
                                        if (e(q)) {
                                            if (w) {
                                                c.moveToElementEditEnd(w);
                                                c.select()
                                            }
                                        } else a.execCommand("outdent");
                                        b.cancel()
                                    }
                                }
                            } else if (q = h.contains("li")) {
                                m.range.setEndAt(n, CKEDITOR.POSITION_BEFORE_END);
                                n = (h = q.getLast(k)) && f(h) ? h : q;
                                q = 0;
                                if ((w = m.next()) && w.type == CKEDITOR.NODE_ELEMENT &&
                                    w.getName()in i && w.equals(h)) {
                                    q = 1;
                                    w = m.next()
                                } else c.checkBoundaryOfElement(n, CKEDITOR.END) && (q = 1);
                                if (q && w) {
                                    c = c.clone();
                                    c.moveToElementEditStart(w);
                                    g(a, d, c);
                                    b.cancel()
                                }
                            } else {
                                m.range.setEndAt(n, CKEDITOR.POSITION_BEFORE_END);
                                if ((w = m.next()) && w.type == CKEDITOR.NODE_ELEMENT && w.is(i)) {
                                    w = w.getFirst(k);
                                    if (h.block && c.checkStartOfBlock() && c.checkEndOfBlock()) {
                                        h.block.remove();
                                        c.moveToElementEditStart(w);
                                        c.select()
                                    } else if (e(w)) {
                                        c.moveToElementEditStart(w);
                                        c.select()
                                    } else {
                                        c = c.clone();
                                        c.moveToElementEditStart(w);
                                        g(a, d, c)
                                    }
                                    b.cancel()
                                }
                            }
                            setTimeout(function () {
                                a.selectionChange(1)
                            })
                        }
                    }
                })
            }
        }})
    }(),function () {
        function b(a, b) {
            this.name = b;
            if (this.useIndentClasses = a.config.indentClasses && a.config.indentClasses.length > 0) {
                this.classNameRegex = RegExp("(?:^|\\s+)(" + a.config.indentClasses.join("|") + ")(?=$|\\s)");
                this.indentClassMap = {};
                for (var d = 0; d < a.config.indentClasses.length; d++)this.indentClassMap[a.config.indentClasses[d]] = d + 1
            }
            this.startDisabled = b == "outdent"
        }

        function c(a, b) {
            return(b || a.getComputedStyle("direction")) == "ltr" ?
                "margin-left" : "margin-right"
        }

        function a(a) {
            return a.type == CKEDITOR.NODE_ELEMENT && a.is("li")
        }

        var h = {ol: 1, ul: 1}, f = CKEDITOR.dom.walker.whitespaces(true), g = CKEDITOR.dom.walker.bookmark(false, true);
        b.prototype = {context: "p", refresh: function (a, b) {
            var d = b && b.contains(h), f = b.block || b.blockLimit;
            if (d)this.setState(CKEDITOR.TRISTATE_OFF); else if (!this.useIndentClasses && this.name == "indent")this.setState(CKEDITOR.TRISTATE_OFF); else if (f)if (this.useIndentClasses) {
                d = f.$.className.match(this.classNameRegex);
                f = 0;
                if (d) {
                    d = d[1];
                    f = this.indentClassMap[d]
                }
                this.name == "outdent" && !f || this.name == "indent" && f == a.config.indentClasses.length ? this.setState(CKEDITOR.TRISTATE_DISABLED) : this.setState(CKEDITOR.TRISTATE_OFF)
            } else {
                d = parseInt(f.getStyle(c(f)), 10);
                isNaN(d) && (d = 0);
                d <= 0 ? this.setState(CKEDITOR.TRISTATE_DISABLED) : this.setState(CKEDITOR.TRISTATE_OFF)
            } else this.setState(CKEDITOR.TRISTATE_DISABLED)
        }, exec: function (b) {
            function i(a) {
                for (var d = o.startContainer, c = o.endContainer; d && !d.getParent().equals(a);)d = d.getParent();
                for (; c && !c.getParent().equals(a);)c = c.getParent();
                if (d && c) {
                    for (var i = d, d = [], j = false; !j;) {
                        i.equals(c) && (j = true);
                        d.push(i);
                        i = i.getNext()
                    }
                    if (!(d.length < 1)) {
                        i = a.getParents(true);
                        for (c = 0; c < i.length; c++)if (i[c].getName && h[i[c].getName()]) {
                            a = i[c];
                            break
                        }
                        for (var i = k.name == "indent" ? 1 : -1, c = d[0], d = d[d.length - 1], j = CKEDITOR.plugins.list.listToArray(a, l), n = j[d.getCustomData("listarray_index")].indent, c = c.getCustomData("listarray_index"); c <= d.getCustomData("listarray_index"); c++) {
                            j[c].indent = j[c].indent + i;
                            if (i > 0) {
                                var r =
                                    j[c].parent;
                                j[c].parent = new CKEDITOR.dom.element(r.getName(), r.getDocument())
                            }
                        }
                        for (c = d.getCustomData("listarray_index") + 1; c < j.length && j[c].indent > n; c++)j[c].indent = j[c].indent + i;
                        d = CKEDITOR.plugins.list.arrayToList(j, l, null, b.config.enterMode, a.getDirection());
                        if (k.name == "outdent") {
                            var s;
                            if ((s = a.getParent()) && s.is("li"))for (var i = d.listNode.getChildren(), p = [], m, c = i.count() - 1; c >= 0; c--)(m = i.getItem(c)) && (m.is && m.is("li")) && p.push(m)
                        }
                        d && d.listNode.replace(a);
                        if (p && p.length)for (c = 0; c < p.length; c++) {
                            for (m =
                                     a = p[c]; (m = m.getNext()) && m.is && m.getName()in h;) {
                                CKEDITOR.env.ie && !a.getFirst(function (a) {
                                    return f(a) && g(a)
                                }) && a.append(o.document.createText(" "));
                                a.append(m)
                            }
                            a.insertAfter(s)
                        }
                    }
                }
            }

            function d() {
                var a = o.createIterator(), d = b.config.enterMode;
                a.enforceRealBlocks = true;
                a.enlargeBr = d != CKEDITOR.ENTER_BR;
                for (var c; c = a.getNextParagraph(d == CKEDITOR.ENTER_P ? "p" : "div");)j(c)
            }

            function j(a, d) {
                if (a.getCustomData("indent_processed"))return false;
                if (k.useIndentClasses) {
                    var f = a.$.className.match(k.classNameRegex), g =
                        0;
                    if (f) {
                        f = f[1];
                        g = k.indentClassMap[f]
                    }
                    k.name == "outdent" ? g-- : g++;
                    if (g < 0)return false;
                    g = Math.min(g, b.config.indentClasses.length);
                    g = Math.max(g, 0);
                    a.$.className = CKEDITOR.tools.ltrim(a.$.className.replace(k.classNameRegex, ""));
                    g > 0 && a.addClass(b.config.indentClasses[g - 1])
                } else {
                    f = c(a, d);
                    g = parseInt(a.getStyle(f), 10);
                    isNaN(g) && (g = 0);
                    var i = b.config.indentOffset || 40, g = g + (k.name == "indent" ? 1 : -1) * i;
                    if (g < 0)return false;
                    g = Math.max(g, 0);
                    g = Math.ceil(g / i) * i;
                    a.setStyle(f, g ? g + (b.config.indentUnit || "px") : "");
                    a.getAttribute("style") ===
                    "" && a.removeAttribute("style")
                }
                CKEDITOR.dom.element.setMarker(l, a, "indent_processed", 1);
                return true
            }

            for (var k = this, l = {}, m = b.getSelection(), n = m.createBookmarks(1), o, s = (m && m.getRanges(1)).createIterator(); o = s.getNextRange();) {
                for (var r = o.getCommonAncestor(); r && !(r.type == CKEDITOR.NODE_ELEMENT && h[r.getName()]);)r = r.getParent();
                if (!r) {
                    var p = o.getEnclosedNode();
                    if (p && p.type == CKEDITOR.NODE_ELEMENT && p.getName()in h) {
                        o.setStartAt(p, CKEDITOR.POSITION_AFTER_START);
                        o.setEndAt(p, CKEDITOR.POSITION_BEFORE_END);
                        r = p
                    }
                }
                if (r && o.startContainer.type == CKEDITOR.NODE_ELEMENT && o.startContainer.getName()in h) {
                    p = new CKEDITOR.dom.walker(o);
                    p.evaluator = a;
                    o.startContainer = p.next()
                }
                if (r && o.endContainer.type == CKEDITOR.NODE_ELEMENT && o.endContainer.getName()in h) {
                    p = new CKEDITOR.dom.walker(o);
                    p.evaluator = a;
                    o.endContainer = p.previous()
                }
                if (r) {
                    var p = r.getFirst(a), t = !!p.getNext(a), x = o.startContainer;
                    (!p.equals(x) && !p.contains(x) || !(k.name == "indent" || k.useIndentClasses || parseInt(r.getStyle(c(r)), 10)) || !j(r, !t && p.getDirection())) &&
                    i(r)
                } else d()
            }
            CKEDITOR.dom.element.clearAllMarkers(l);
            b.forceNextSelectionCheck();
            m.selectBookmarks(n)
        }};
        CKEDITOR.plugins.add("indent", {requires: "list", onLoad: function () {
            (CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat) && CKEDITOR.addCss(".cke_editable ul,.cke_editable ol{\tmargin-left: 0px;\tpadding-left: 40px;}")
        }, init: function (a) {
            if (!a.blockless) {
                a.addCommand("indent", new b(a, "indent"));
                a.addCommand("outdent", new b(a, "outdent"));
                if (a.ui.addButton) {
                    a.ui.addButton("Indent", {label: a.lang.indent.indent,
                        command: "indent", directional: true, toolbar: "indent,20"});
                    a.ui.addButton("Outdent", {label: a.lang.indent.outdent, command: "outdent", directional: true, toolbar: "indent,10"})
                }
                a.on("dirChanged", function (b) {
                    var d = a.createRange();
                    d.setStartBefore(b.data.node);
                    d.setEndAfter(b.data.node);
                    for (var c = new CKEDITOR.dom.walker(d), f; f = c.next();)if (f.type == CKEDITOR.NODE_ELEMENT)if (!f.equals(b.data.node) && f.getDirection()) {
                        d.setStartAfter(f);
                        c = new CKEDITOR.dom.walker(d)
                    } else {
                        var g = a.config.indentClasses;
                        if (g)for (var h =
                                b.data.dir == "ltr" ? ["_rtl", ""] : ["", "_rtl"], n = 0; n < g.length; n++)if (f.hasClass(g[n] + h[0])) {
                            f.removeClass(g[n] + h[0]);
                            f.addClass(g[n] + h[1])
                        }
                        g = f.getStyle("margin-right");
                        h = f.getStyle("margin-left");
                        g ? f.setStyle("margin-left", g) : f.removeStyle("margin-left");
                        h ? f.setStyle("margin-right", h) : f.removeStyle("margin-right")
                    }
                })
            }
        }})
    }(),function () {
        function b(a, b, c) {
            c = a.config.forceEnterMode || c;
            if (a.mode != "wysiwyg")return false;
            if (!b)b = a.config.enterMode;
            if (!a.elementPath().isContextFor("p")) {
                b = CKEDITOR.ENTER_BR;
                c =
                    1
            }
            a.fire("saveSnapshot");
            b == CKEDITOR.ENTER_BR ? g(a, b, null, c) : e(a, b, null, c);
            a.fire("saveSnapshot");
            return true
        }

        function c(a) {
            for (var a = a.getSelection().getRanges(true), b = a.length - 1; b > 0; b--)a[b].deleteContents();
            return a[0]
        }

        CKEDITOR.plugins.add("enterkey", {requires: "indent", init: function (a) {
            a.addCommand("enter", {modes: {wysiwyg: 1}, editorFocus: false, exec: function (a) {
                b(a)
            }});
            a.addCommand("shiftEnter", {modes: {wysiwyg: 1}, editorFocus: false, exec: function (a) {
                a.mode == "wysiwyg" && b(a, a.config.shiftEnterMode, 1)
            }});
            a.setKeystroke([
                [13, "enter"],
                [CKEDITOR.SHIFT + 13, "shiftEnter"]
            ])
        }});
        var a = CKEDITOR.dom.walker.whitespaces(), h = CKEDITOR.dom.walker.bookmark();
        CKEDITOR.plugins.enterkey = {enterBlock: function (b, e, f, l) {
            if (f = f || c(b)) {
                var m = f.document, n = f.checkStartOfBlock(), o = f.checkEndOfBlock(), s = b.elementPath(f.startContainer).block;
                if (n && o) {
                    if (s && (s.is("li") || s.getParent().is("li"))) {
                        b.execCommand("outdent");
                        return
                    }
                    if (s && s.getParent().is("blockquote")) {
                        s.breakParent(s.getParent());
                        s.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1)) ||
                        s.getPrevious().remove();
                        s.getNext().getFirst(CKEDITOR.dom.walker.invisible(1)) || s.getNext().remove();
                        f.moveToElementEditStart(s);
                        f.select();
                        return
                    }
                } else if (s && s.is("pre") && !o) {
                    g(b, e, f, l);
                    return
                }
                var s = e == CKEDITOR.ENTER_DIV ? "div" : "p", r = f.splitBlock(s);
                if (r) {
                    var e = r.previousBlock, b = r.nextBlock, n = r.wasStartOfBlock, o = r.wasEndOfBlock, p;
                    if (b) {
                        p = b.getParent();
                        if (p.is("li")) {
                            b.breakParent(p);
                            b.move(b.getNext(), 1)
                        }
                    } else if (e && (p = e.getParent()) && p.is("li")) {
                        e.breakParent(p);
                        p = e.getNext();
                        f.moveToElementEditStart(p);
                        e.move(e.getPrevious())
                    }
                    if (!n && !o) {
                        if (b.is("li")) {
                            var t = f.clone();
                            t.selectNodeContents(b);
                            t = new CKEDITOR.dom.walker(t);
                            t.evaluator = function (b) {
                                return!(h(b) || a(b) || b.type == CKEDITOR.NODE_ELEMENT && b.getName()in CKEDITOR.dtd.$inline && !(b.getName()in CKEDITOR.dtd.$empty))
                            };
                            (p = t.next()) && (p.type == CKEDITOR.NODE_ELEMENT && p.is("ul", "ol")) && (CKEDITOR.env.ie ? m.createText(" ") : m.createElement("br")).insertBefore(p)
                        }
                        b && f.moveToElementEditStart(b)
                    } else {
                        var x;
                        if (e) {
                            if (e.is("li") || !i.test(e.getName()) && !e.is("pre"))t =
                                e.clone()
                        } else b && (t = b.clone());
                        if (t)l && !t.is("li") && t.renameNode(s); else if (p && p.is("li"))t = p; else {
                            t = m.createElement(s);
                            e && (x = e.getDirection()) && t.setAttribute("dir", x)
                        }
                        if (m = r.elementPath) {
                            l = 0;
                            for (p = m.elements.length; l < p; l++) {
                                x = m.elements[l];
                                if (x.equals(m.block) || x.equals(m.blockLimit))break;
                                if (CKEDITOR.dtd.$removeEmpty[x.getName()]) {
                                    x = x.clone();
                                    t.moveChildren(x);
                                    t.append(x)
                                }
                            }
                        }
                        CKEDITOR.env.ie || t.appendBogus();
                        t.getParent() || f.insertNode(t);
                        t.is("li") && t.removeAttribute("value");
                        if (CKEDITOR.env.ie &&
                            n && (!o || !e.getChildCount())) {
                            f.moveToElementEditStart(o ? e : t);
                            f.select()
                        }
                        f.moveToElementEditStart(n && !o ? b : t)
                    }
                    f.select();
                    f.scrollIntoView()
                }
            }
        }, enterBr: function (a, b, f, g) {
            if (f = f || c(a)) {
                var h = f.document, n = f.checkEndOfBlock(), o = new CKEDITOR.dom.elementPath(a.getSelection().getStartElement()), s = o.block, o = s && o.block.getName();
                if (!g && o == "li")e(a, b, f, g); else {
                    if (!g && n && i.test(o))if (n = s.getDirection()) {
                        h = h.createElement("div");
                        h.setAttribute("dir", n);
                        h.insertAfter(s);
                        f.setStart(h, 0)
                    } else {
                        h.createElement("br").insertAfter(s);
                        CKEDITOR.env.gecko && h.createText("").insertAfter(s);
                        f.setStartAt(s.getNext(), CKEDITOR.env.ie ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START)
                    } else {
                        s = o == "pre" && CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? h.createText("\r") : h.createElement("br");
                        f.deleteContents();
                        f.insertNode(s);
                        if (CKEDITOR.env.ie)f.setStartAt(s, CKEDITOR.POSITION_AFTER_END); else {
                            h.createText("﻿").insertAfter(s);
                            n && s.getParent().appendBogus();
                            s.getNext().$.nodeValue = "";
                            f.setStartAt(s.getNext(), CKEDITOR.POSITION_AFTER_START)
                        }
                    }
                    f.collapse(true);
                    f.select();
                    f.scrollIntoView()
                }
            }
        }};
        var f = CKEDITOR.plugins.enterkey, g = f.enterBr, e = f.enterBlock, i = /^h[1-6]$/
    }(),function () {
        function b(b, a) {
            var h = {}, f = [], g = {nbsp: " ", shy: "­", gt: ">", lt: "<", amp: "&", apos: "'", quot: '"'}, b = b.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function (b, d) {
                var c = a ? "&" + d + ";" : g[d];
                h[c] = a ? g[d] : "&" + d + ";";
                f.push(c);
                return""
            });
            if (!a && b) {
                var b = b.split(","), e = document.createElement("div"), i;
                e.innerHTML = "&" + b.join(";&") + ";";
                i = e.innerHTML;
                e = null;
                for (e = 0; e < i.length; e++) {
                    var d = i.charAt(e);
                    h[d] = "&" + b[e] + ";";
                    f.push(d)
                }
            }
            h.regex = f.join(a ? "|" : "");
            return h
        }

        CKEDITOR.plugins.add("entities", {afterInit: function (c) {
            var a = c.config;
            if (c = (c = c.dataProcessor) && c.htmlFilter) {
                var h = [];
                a.basicEntities !== false && h.push("nbsp,gt,lt,amp");
                if (a.entities) {
                    h.length && h.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro");
                    a.entities_latin && h.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml");
                    a.entities_greek && h.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv");
                    a.entities_additional && h.push(a.entities_additional)
                }
                var f = b(h.join(",")), g = f.regex ? "[" + f.regex + "]" : "a^";
                delete f.regex;
                a.entities && a.entities_processNumerical && (g = "[^ -~]|" + g);
                var g = RegExp(g, "g"), e = function (b) {
                    return a.entities_processNumerical == "force" || !f[b] ? "&#" + b.charCodeAt(0) + ";" : f[b]
                }, i = b("nbsp,gt,lt,amp,shy", true), d = RegExp(i.regex, "g"), j = function (a) {
                    return i[a]
                };
                c.addRules({text: function (a) {
                    return a.replace(d, j).replace(g, e)
                }})
            }
        }})
    }(),CKEDITOR.config.basicEntities = !0,CKEDITOR.config.entities = !0,CKEDITOR.config.entities_latin = !0,CKEDITOR.config.entities_greek = !0,CKEDITOR.config.entities_additional = "#39",CKEDITOR.plugins.add("popup"),CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {popup: function (b, c, a, h) {
        c = c || "80%";
        a = a || "70%";
        typeof c == "string" && (c.length > 1 && c.substr(c.length - 1, 1) == "%") && (c = parseInt(window.screen.width * parseInt(c, 10) / 100, 10));
        typeof a == "string" && (a.length > 1 && a.substr(a.length - 1, 1) == "%") && (a = parseInt(window.screen.height * parseInt(a, 10) / 100, 10));
        c < 640 && (c = 640);
        a < 420 && (a =
            420);
        var f = parseInt((window.screen.height - a) / 2, 10), g = parseInt((window.screen.width - c) / 2, 10), h = (h || "location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes") + ",width=" + c + ",height=" + a + ",top=" + f + ",left=" + g, e = window.open("", null, h, true);
        if (!e)return false;
        try {
            if (navigator.userAgent.toLowerCase().indexOf(" chrome/") == -1) {
                e.moveTo(g, f);
                e.resizeTo(c, a)
            }
            e.focus();
            e.location.href = b
        } catch (i) {
            window.open(b, null, h, true)
        }
        return true
    }}),function () {
        function b(a, b) {
            var c = [];
            if (b)for (var e in b)c.push(e + "=" + encodeURIComponent(b[e])); else return a;
            return a + (a.indexOf("?") != -1 ? "&" : "?") + c.join("&")
        }

        function c(a) {
            a = a + "";
            return a.charAt(0).toUpperCase() + a.substr(1)
        }

        function a() {
            var a = this.getDialog(), e = a.getParentEditor();
            e._.filebrowserSe = this;
            var f = e.config["filebrowser" + c(a.getName()) + "WindowWidth"] || e.config.filebrowserWindowWidth || "80%", a = e.config["filebrowser" + c(a.getName()) + "WindowHeight"] || e.config.filebrowserWindowHeight || "70%", g = this.filebrowser.params ||
            {};
            g.CKEditor = e.name;
            g.CKEditorFuncNum = e._.filebrowserFn;
            if (!g.langCode)g.langCode = e.langCode;
            g = b(this.filebrowser.url, g);
            e.popup(g, f, a, e.config.filebrowserWindowFeatures || e.config.fileBrowserWindowFeatures)
        }

        function h() {
            var a = this.getDialog();
            a.getParentEditor()._.filebrowserSe = this;
            return!a.getContentElement(this["for"][0], this["for"][1]).getInputElement().$.value || !a.getContentElement(this["for"][0], this["for"][1]).getAction() ? false : true
        }

        function f(a, c, e) {
            var f = e.params || {};
            f.CKEditor = a.name;
            f.CKEditorFuncNum =
                a._.filebrowserFn;
            if (!f.langCode)f.langCode = a.langCode;
            c.action = b(e.url, f);
            c.filebrowser = e
        }

        function g(b, e, i, l) {
            var m, n;
            for (n in l) {
                m = l[n];
                (m.type == "hbox" || m.type == "vbox" || m.type == "fieldset") && g(b, e, i, m.children);
                if (m.filebrowser) {
                    if (typeof m.filebrowser == "string")m.filebrowser = {action: m.type == "fileButton" ? "QuickUpload" : "Browse", target: m.filebrowser};
                    if (m.filebrowser.action == "Browse") {
                        var o = m.filebrowser.url;
                        if (o === void 0) {
                            o = b.config["filebrowser" + c(e) + "BrowseUrl"];
                            if (o === void 0)o = b.config.filebrowserBrowseUrl
                        }
                        if (o) {
                            m.onClick =
                                a;
                            m.filebrowser.url = o;
                            m.hidden = false
                        }
                    } else if (m.filebrowser.action == "QuickUpload" && m["for"]) {
                        o = m.filebrowser.url;
                        if (o === void 0) {
                            o = b.config["filebrowser" + c(e) + "UploadUrl"];
                            if (o === void 0)o = b.config.filebrowserUploadUrl
                        }
                        if (o) {
                            var s = m.onClick;
                            m.onClick = function (a) {
                                var b = a.sender;
                                return s && s.call(b, a) === false ? false : h.call(b, a)
                            };
                            m.filebrowser.url = o;
                            m.hidden = false;
                            f(b, i.getContents(m["for"][0]).get(m["for"][1]), m.filebrowser)
                        }
                    }
                }
            }
        }

        function e(a, b, c) {
            if (c.indexOf(";") !== -1) {
                for (var c = c.split(";"), f = 0; f < c.length; f++)if (e(a,
                    b, c[f]))return true;
                return false
            }
            return(a = a.getContents(b).get(c).filebrowser) && a.url
        }

        function i(a, b) {
            var c = this._.filebrowserSe.getDialog(), e = this._.filebrowserSe["for"], f = this._.filebrowserSe.filebrowser.onSelect;
            e && c.getContentElement(e[0], e[1]).reset();
            if (!(typeof b == "function" && b.call(this._.filebrowserSe) === false) && !(f && f.call(this._.filebrowserSe, a, b) === false)) {
                if (a) {
                    e = this._.filebrowserSe;
                    c = e.getDialog();
                    if (e = e.filebrowser.target || null) {
                        e = e.split(":");
                        if (f =
                            c.getContentElement(e[0], e[1])) {
                            f.setValue(a);
                            c.selectPage(e[0])
                        }
                    }
                }
            }
        }

        CKEDITOR.plugins.add("filebrowser", {requires: "popup", init: function (a) {
            a._.filebrowserFn = CKEDITOR.tools.addFunction(i, a);
            a.on("destroy", function () {
                CKEDITOR.tools.removeFunction(this._.filebrowserFn)
            })
        }});
        CKEDITOR.on("dialogDefinition", function (a) {
            var b = a.data.definition, c, f;
            for (f in b.contents)if (c = b.contents[f]) {
                g(a.editor, a.data.name, b, c.elements);
                if (c.hidden && c.filebrowser)c.hidden = !e(b, c.id, c.filebrowser)
            }
        })
    }(),CKEDITOR.plugins.add("find",
        {requires: "dialog", init: function (b) {
            var c = b.addCommand("find", new CKEDITOR.dialogCommand("find"));
            c.canUndo = false;
            c.readOnly = 1;
            b.addCommand("replace", new CKEDITOR.dialogCommand("replace")).canUndo = false;
            if (b.ui.addButton) {
                b.ui.addButton("Find", {label: b.lang.find.find, command: "find", toolbar: "find,10"});
                b.ui.addButton("Replace", {label: b.lang.find.replace, command: "replace", toolbar: "find,20"})
            }
            CKEDITOR.dialog.add("find", this.path + "dialogs/find.js");
            CKEDITOR.dialog.add("replace", this.path + "dialogs/find.js")
        }}),
    CKEDITOR.config.find_highlight = {element: "span", styles: {"background-color": "#004", color: "#fff"}},function () {
        function b(a, b) {
            var c = h.exec(a), f = h.exec(b);
            if (c) {
                if (!c[2] && f[2] == "px")return f[1];
                if (c[2] == "px" && !f[2])return f[1] + "px"
            }
            return b
        }

        var c = CKEDITOR.htmlParser.cssStyle, a = CKEDITOR.tools.cssLength, h = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i, f = {elements: {$: function (a) {
            var f = a.attributes;
            if ((f = (f = (f = f && f["data-cke-realelement"]) && new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(f))) && f.children[0]) &&
                a.attributes["data-cke-resizable"]) {
                var d = (new c(a)).rules, a = f.attributes, g = d.width, d = d.height;
                g && (a.width = b(a.width, g));
                d && (a.height = b(a.height, d))
            }
            return f
        }}}, g = CKEDITOR.plugins.add("fakeobjects", {afterInit: function (a) {
            (a = (a = a.dataProcessor) && a.htmlFilter) && a.addRules(f)
        }});
        CKEDITOR.editor.prototype.createFakeElement = function (b, f, d, h) {
            var k = this.lang.fakeobjects, k = k[d] || k.unknown, f = {"class": f, "data-cke-realelement": encodeURIComponent(b.getOuterHtml()), "data-cke-real-node-type": b.type, alt: k, title: k,
                align: b.getAttribute("align") || ""};
            if (!CKEDITOR.env.hc)f.src = CKEDITOR.getUrl(g.path + "images/spacer.gif");
            d && (f["data-cke-real-element-type"] = d);
            if (h) {
                f["data-cke-resizable"] = h;
                d = new c;
                h = b.getAttribute("width");
                b = b.getAttribute("height");
                h && (d.rules.width = a(h));
                b && (d.rules.height = a(b));
                d.populate(f)
            }
            return this.document.createElement("img", {attributes: f})
        };
        CKEDITOR.editor.prototype.createFakeParserElement = function (b, f, d, h) {
            var k = this.lang.fakeobjects, k = k[d] || k.unknown, l;
            l = new CKEDITOR.htmlParser.basicWriter;
            b.writeHtml(l);
            l = l.getHtml();
            f = {"class": f, "data-cke-realelement": encodeURIComponent(l), "data-cke-real-node-type": b.type, alt: k, title: k, align: b.attributes.align || ""};
            if (!CKEDITOR.env.hc)f.src = CKEDITOR.getUrl(g.path + "images/spacer.gif");
            d && (f["data-cke-real-element-type"] = d);
            if (h) {
                f["data-cke-resizable"] = h;
                h = b.attributes;
                b = new c;
                d = h.width;
                h = h.height;
                d != void 0 && (b.rules.width = a(d));
                h != void 0 && (b.rules.height = a(h));
                b.populate(f)
            }
            return new CKEDITOR.htmlParser.element("img", f)
        };
        CKEDITOR.editor.prototype.restoreRealElement =
            function (a) {
                if (a.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT)return null;
                var c = CKEDITOR.dom.element.createFromHtml(decodeURIComponent(a.data("cke-realelement")), this.document);
                if (a.data("cke-resizable")) {
                    var d = a.getStyle("width"), a = a.getStyle("height");
                    d && c.setAttribute("width", b(c.getAttribute("width"), d));
                    a && c.setAttribute("height", b(c.getAttribute("height"), a))
                }
                return c
            }
    }(),function () {
        function b(b) {
            b = b.attributes;
            return b.type == "application/x-shockwave-flash" || a.test(b.src || "")
        }

        function c(a, b) {
            return a.createFakeParserElement(b, "cke_flash", "flash", true)
        }

        var a = /\.swf(?:$|\?)/i;
        CKEDITOR.plugins.add("flash", {requires: "dialog,fakeobjects", onLoad: function () {
            CKEDITOR.addCss("img.cke_flash{background-image: url(" + CKEDITOR.getUrl(this.path + "images/placeholder.png") + ");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 80px;height: 80px;}")
        }, init: function (a) {
            a.addCommand("flash", new CKEDITOR.dialogCommand("flash"));
            a.ui.addButton && a.ui.addButton("Flash",
                {label: a.lang.common.flash, command: "flash", toolbar: "insert,20"});
            CKEDITOR.dialog.add("flash", this.path + "dialogs/flash.js");
            a.addMenuItems && a.addMenuItems({flash: {label: a.lang.flash.properties, command: "flash", group: "flash"}});
            a.on("doubleclick", function (a) {
                var b = a.data.element;
                if (b.is("img") && b.data("cke-real-element-type") == "flash")a.data.dialog = "flash"
            });
            a.contextMenu && a.contextMenu.addListener(function (a) {
                if (a && a.is("img") && !a.isReadOnly() && a.data("cke-real-element-type") == "flash")return{flash: CKEDITOR.TRISTATE_OFF}
            })
        },
            afterInit: function (a) {
                var f = a.dataProcessor;
                (f = f && f.dataFilter) && f.addRules({elements: {"cke:object": function (f) {
                    var e = f.attributes;
                    if ((!e.classid || !("" + e.classid).toLowerCase()) && !b(f)) {
                        for (e = 0; e < f.children.length; e++)if (f.children[e].name == "cke:embed") {
                            if (!b(f.children[e]))break;
                            return c(a, f)
                        }
                        return null
                    }
                    return c(a, f)
                }, "cke:embed": function (f) {
                    return!b(f) ? null : c(a, f)
                }}}, 5)
            }})
    }(),CKEDITOR.tools.extend(CKEDITOR.config, {flashEmbedTagOnly: !1, flashAddEmbedTag: !0, flashConvertOnEdit: !1}),function () {
        function b(a) {
            var b =
                    a == "left" ? "pageXOffset" : "pageYOffset";
            return b in h.$ ? h.$[b] : CKEDITOR.document.$.documentElement[a == "left" ? "scrollLeft" : "scrollTop"]
        }

        function c(c) {
            var e, i = c.config, d = i.floatSpaceDockedOffsetX || 0, j = i.floatSpaceDockedOffsetY || 0, k = i.floatSpacePinnedOffsetX || 0, l = i.floatSpacePinnedOffsetY || 0, m = function (a) {
                function i(a, b, c) {
                    s.setStyle(b, f(c));
                    s.setStyle("position", a)
                }

                function n(a) {
                    var b = o.getDocumentPosition();
                    switch (a) {
                        case "top":
                            i("absolute", "top", b.y - w - j);
                            break;
                        case "pin":
                            i("fixed", "top", l);
                            break;
                        case "bottom":
                            i("absolute",
                                "top", b.y + (v.height || v.bottom - v.top) + j)
                    }
                    e = a
                }

                a.name == "focus" && s.show();
                s.removeStyle("left");
                s.removeStyle("right");
                var o = c.editable(), A = s.getClientRect(), v = o.getClientRect(), w = A.height, q = b("left");
                if (e) {
                    e == "top" && A.top < l ? n("pin") : e == "pin" ? v.top > j + w ? n("top") : v.bottom - A.bottom < w && n("bottom") : e == "bottom" && (v.top > j + w ? n("top") : v.bottom > 2 * w + l && n("pin"));
                    var a = h.getViewPaneSize(), u = a.width / 2, u = v.left > 0 && v.right < a.width && v.width > A.width ? c.config.contentsLangDirection == "rtl" ? "right" : "left" : u - v.left > v.right -
                        u ? "left" : "right", B;
                    if (A.width > a.width) {
                        u = "left";
                        B = 0
                    } else {
                        B = u == "left" ? v.left > 0 ? v.left : 0 : v.right < a.width ? a.width - v.right : 0;
                        if (B + A.width > a.width) {
                            u = u == "left" ? "right" : "left";
                            B = 0
                        }
                    }
                    s.setStyle(u, f((e == "pin" ? k : d) + B + (e == "pin" ? 0 : u == "left" ? q : -q)))
                } else {
                    e = "pin";
                    n("pin");
                    m(a)
                }
            }, i = CKEDITOR.document.getBody(), n = {id: c.id, name: c.name, langDir: c.lang.dir, langCode: c.langCode}, o = c.fire("uiSpace", {space: "top", html: ""}).html;
            if (o) {
                var s = i.append(CKEDITOR.dom.element.createFromHtml(a.output(CKEDITOR.tools.extend({topId: c.ui.spaceId("top"),
                    content: o, style: "display:none;z-index:" + (c.config.baseFloatZIndex - 1)}, n))));
                s.unselectable();
                s.on("mousedown", function (a) {
                    a = a.data;
                    a.getTarget().hasAscendant("a", 1) || a.preventDefault()
                });
                c.on("focus", function (a) {
                    m(a);
                    h.on("scroll", m);
                    h.on("resize", m)
                });
                c.on("blur", function () {
                    s.hide();
                    h.removeListener("scroll", m);
                    h.removeListener("resize", m)
                });
                c.on("destroy", function () {
                    h.removeListener("scroll", m);
                    h.removeListener("resize", m);
                    s.clearCustomData();
                    s.remove()
                });
                c.focusManager.hasFocus && s.show();
                c.focusManager.add(s,
                    1)
            }
        }

        var a = CKEDITOR.addTemplate("floatcontainer", '<div id="cke_{name}" class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '" dir="{langDir}" title="' + (CKEDITOR.env.gecko ? " " : "") + '" lang="{langCode}" role="application" style="{style}"><div class="cke_inner"><div id="{topId}" class="cke_top" role="presentation">{content}</div></div></div>');
        CKEDITOR.plugins.add("floatingspace", {init: function (a) {
            a.on("contentDom", function () {
                c(a)
            })
        }});
        var h = CKEDITOR.document.getWindow(),
            f = CKEDITOR.tools.cssLength
    }(),CKEDITOR.plugins.add("listblock", {requires: "panel", onLoad: function () {
        var b = CKEDITOR.addTemplate("panel-list", '<ul role="presentation" class="cke_panel_list">{items}</ul>'), c = CKEDITOR.addTemplate("panel-list-item", '<li id="{id}" class="cke_panel_listItem" role=presentation><a id="{id}_option" _cke_focus=1 hidefocus=true title="{title}" href="javascript:void(\'{val}\')"  {onclick}="CKEDITOR.tools.callFunction({clickFn},\'{val}\'); return false;" role="option">{text}</a></li>'),
            a = CKEDITOR.addTemplate("panel-list-group", '<h1 id="{id}" class="cke_panel_grouptitle" role="presentation" >{label}</h1>');
        CKEDITOR.ui.panel.prototype.addListBlock = function (a, b) {
            return this.addBlock(a, new CKEDITOR.ui.listBlock(this.getHolderElement(), b))
        };
        CKEDITOR.ui.listBlock = CKEDITOR.tools.createClass({base: CKEDITOR.ui.panel.block, $: function (a, b) {
            var b = b || {}, c = b.attributes || (b.attributes = {});
            (this.multiSelect = !!b.multiSelect) && (c["aria-multiselectable"] = true);
            !c.role && (c.role = "listbox");
            this.base.apply(this,
                arguments);
            c = this.keys;
            c[40] = "next";
            c[9] = "next";
            c[38] = "prev";
            c[CKEDITOR.SHIFT + 9] = "prev";
            c[32] = CKEDITOR.env.ie ? "mouseup" : "click";
            CKEDITOR.env.ie && (c[13] = "mouseup");
            this._.pendingHtml = [];
            this._.pendingList = [];
            this._.items = {};
            this._.groups = {}
        }, _: {close: function () {
            if (this._.started) {
                var a = b.output({items: this._.pendingList.join("")});
                this._.pendingList = [];
                this._.pendingHtml.push(a);
                delete this._.started
            }
        }, getClick: function () {
            if (!this._.click)this._.click = CKEDITOR.tools.addFunction(function (a) {
                var b = this.toggle(a);
                if (this.onClick)this.onClick(a, b)
            }, this);
            return this._.click
        }}, proto: {add: function (a, b, g) {
            var e = CKEDITOR.tools.getNextId();
            if (!this._.started) {
                this._.started = 1;
                this._.size = this._.size || 0
            }
            this._.items[a] = e;
            a = {id: e, val: a, onclick: CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick", clickFn: this._.getClick(), title: g || a, text: b || a};
            this._.pendingList.push(c.output(a))
        }, startGroup: function (b) {
            this._.close();
            var c = CKEDITOR.tools.getNextId();
            this._.groups[b] = c;
            this._.pendingHtml.push(a.output({id: c,
                label: b}))
        }, commit: function () {
            this._.close();
            this.element.appendHtml(this._.pendingHtml.join(""));
            delete this._.size;
            this._.pendingHtml = []
        }, toggle: function (a) {
            var b = this.isMarked(a);
            b ? this.unmark(a) : this.mark(a);
            return!b
        }, hideGroup: function (a) {
            var b = (a = this.element.getDocument().getById(this._.groups[a])) && a.getNext();
            if (a) {
                a.setStyle("display", "none");
                b && b.getName() == "ul" && b.setStyle("display", "none")
            }
        }, hideItem: function (a) {
            this.element.getDocument().getById(this._.items[a]).setStyle("display", "none")
        },
            showAll: function () {
                var a = this._.items, b = this._.groups, c = this.element.getDocument(), e;
                for (e in a)c.getById(a[e]).setStyle("display", "");
                for (var i in b) {
                    a = c.getById(b[i]);
                    e = a.getNext();
                    a.setStyle("display", "");
                    e && e.getName() == "ul" && e.setStyle("display", "")
                }
            }, mark: function (a) {
                this.multiSelect || this.unmarkAll();
                var a = this._.items[a], b = this.element.getDocument().getById(a);
                b.addClass("cke_selected");
                this.element.getDocument().getById(a + "_option").setAttribute("aria-selected", true);
                this.onMark && this.onMark(b)
            },
            unmark: function (a) {
                var b = this.element.getDocument(), a = this._.items[a], c = b.getById(a);
                c.removeClass("cke_selected");
                b.getById(a + "_option").removeAttribute("aria-selected");
                this.onUnmark && this.onUnmark(c)
            }, unmarkAll: function () {
                var a = this._.items, b = this.element.getDocument(), c;
                for (c in a) {
                    var e = a[c];
                    b.getById(e).removeClass("cke_selected");
                    b.getById(e + "_option").removeAttribute("aria-selected")
                }
                this.onUnmark && this.onUnmark()
            }, isMarked: function (a) {
                return this.element.getDocument().getById(this._.items[a]).hasClass("cke_selected")
            },
            focus: function (a) {
                this._.focusIndex = -1;
                if (a) {
                    for (var b = this.element.getDocument().getById(this._.items[a]).getFirst(), a = this.element.getElementsByTag("a"), c, e = -1; c = a.getItem(++e);)if (c.equals(b)) {
                        this._.focusIndex = e;
                        break
                    }
                    setTimeout(function () {
                        b.focus()
                    }, 0)
                }
            }}})
    }}),CKEDITOR.plugins.add("richcombo", {requires: "floatpanel,listblock,button", beforeInit: function (b) {
        b.ui.addHandler(CKEDITOR.UI_RICHCOMBO, CKEDITOR.ui.richCombo.handler)
    }}),function () {
        var b = '<span id="{id}" class="cke_combo cke_combo__{name} {cls}" role="presentation"><span id="{id}_label" class="cke_combo_label">{label}</span><a class="cke_combo_button" hidefocus=true title="{title}" tabindex="-1"' +
            (CKEDITOR.env.gecko && CKEDITOR.env.version >= 10900 && !CKEDITOR.env.hc ? "" : '" href="javascript:void(\'{titleJs}\')"') + ' hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="true"';
        if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac)b = b + ' onkeypress="return false;"';
        CKEDITOR.env.gecko && (b = b + ' onblur="this.style.cssText = this.style.cssText;"');
        var b = b + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event,this);" onmousedown="return CKEDITOR.tools.callFunction({mousedownFn},event);"  onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' +
            (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span id="{id}_text" class="cke_combo_text cke_combo_inlinelabel">{label}</span><span class="cke_combo_open"><span class="cke_combo_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : CKEDITOR.env.air ? "&nbsp;" : "") + "</span></span></a></span>"), c = CKEDITOR.addTemplate("combo", b);
        CKEDITOR.UI_RICHCOMBO = "richcombo";
        CKEDITOR.ui.richCombo = CKEDITOR.tools.createClass({$: function (a) {
            CKEDITOR.tools.extend(this,
                a, {canGroup: false, title: a.label, modes: {wysiwyg: 1}, editorFocus: 1});
            a = this.panel || {};
            delete this.panel;
            this.id = CKEDITOR.tools.getNextNumber();
            this.document = a.parent && a.parent.getDocument() || CKEDITOR.document;
            a.className = "cke_combopanel";
            a.block = {multiSelect: a.multiSelect, attributes: a.attributes};
            a.toolbarRelated = true;
            this._ = {panelDefinition: a, items: {}}
        }, proto: {renderHtml: function (a) {
            var b = [];
            this.render(a, b);
            return b.join("")
        }, render: function (a, b) {
            function f() {
                var b = this.modes[a.mode] ? CKEDITOR.TRISTATE_OFF :
                    CKEDITOR.TRISTATE_DISABLED;
                this.setState(a.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : b);
                this.setValue("")
            }

            var g = CKEDITOR.env, e = "cke_" + this.id, i = CKEDITOR.tools.addFunction(function (b) {
                if (m) {
                    a.unlockSelection(1);
                    m = 0
                }
                j.execute(b)
            }, this), d = this, j = {id: e, combo: this, focus: function () {
                CKEDITOR.document.getById(e).getChild(1).focus()
            }, execute: function (b) {
                var c = d._;
                if (c.state != CKEDITOR.TRISTATE_DISABLED) {
                    d.createPanel(a);
                    if (c.on)c.panel.hide(); else {
                        d.commit();
                        var e = d.getValue();
                        e ? c.list.mark(e) : c.list.unmarkAll();
                        c.panel.showBlock(d.id, new CKEDITOR.dom.element(b), 4)
                    }
                }
            }, clickFn: i};
            a.on("mode", f, this);
            !this.readOnly && a.on("readOnly", f, this);
            var k = CKEDITOR.tools.addFunction(function (a, b) {
                var a = new CKEDITOR.dom.event(a), c = a.getKeystroke();
                switch (c) {
                    case 13:
                    case 32:
                    case 40:
                        CKEDITOR.tools.callFunction(i, b);
                        break;
                    default:
                        j.onkey(j, c)
                }
                a.preventDefault()
            }), l = CKEDITOR.tools.addFunction(function () {
                j.onfocus && j.onfocus()
            }), m = 0, n = CKEDITOR.tools.addFunction(function () {
                if (CKEDITOR.env.opera) {
                    var b = a.editable();
                    if (b.isInline() &&
                        b.hasFocus) {
                        a.lockSelection();
                        m = 1
                    }
                }
            });
            j.keyDownFn = k;
            g = {id: e, name: this.name || this.command, label: this.label, title: this.title, cls: this.className || "", titleJs: g.gecko && g.version >= 10900 && !g.hc ? "" : (this.title || "").replace("'", ""), keydownFn: k, mousedownFn: n, focusFn: l, clickFn: i};
            c.output(g, b);
            if (this.onRender)this.onRender();
            return j
        }, createPanel: function (a) {
            if (!this._.panel) {
                var b = this._.panelDefinition, c = this._.panelDefinition.block, g = b.parent || CKEDITOR.document.getBody(), e = "cke_combopanel__" + this.name, i =
                    new CKEDITOR.ui.floatPanel(a, g, b), d = i.addListBlock(this.id, c), j = this;
                i.onShow = function () {
                    this.element.addClass(e);
                    j.setState(CKEDITOR.TRISTATE_ON);
                    d.focus(!d.multiSelect && j.getValue());
                    j._.on = 1;
                    j.editorFocus && a.focus();
                    if (j.onOpen)j.onOpen()
                };
                i.onHide = function (b) {
                    this.element.removeClass(e);
                    j.setState(j.modes && j.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                    j._.on = 0;
                    if (!b && j.onClose)j.onClose()
                };
                i.onEscape = function () {
                    i.hide(1)
                };
                d.onClick = function (a, b) {
                    j.onClick && j.onClick.call(j,
                        a, b);
                    i.hide()
                };
                this._.panel = i;
                this._.list = d;
                i.getBlock(this.id).onHide = function () {
                    j._.on = 0;
                    j.setState(CKEDITOR.TRISTATE_OFF)
                };
                this.init && this.init()
            }
        }, setValue: function (a, b) {
            this._.value = a;
            var c = this.document.getById("cke_" + this.id + "_text");
            if (c) {
                if (!a && !b) {
                    b = this.label;
                    c.addClass("cke_combo_inlinelabel")
                } else c.removeClass("cke_combo_inlinelabel");
                c.setText(typeof b != "undefined" ? b : a)
            }
        }, getValue: function () {
            return this._.value || ""
        }, unmarkAll: function () {
            this._.list.unmarkAll()
        }, mark: function (a) {
            this._.list.mark(a)
        },
            hideItem: function (a) {
                this._.list.hideItem(a)
            }, hideGroup: function (a) {
                this._.list.hideGroup(a)
            }, showAll: function () {
                this._.list.showAll()
            }, add: function (a, b, c) {
                this._.items[a] = c || a;
                this._.list.add(a, b, c)
            }, startGroup: function (a) {
                this._.list.startGroup(a)
            }, commit: function () {
                if (!this._.committed) {
                    this._.list.commit();
                    this._.committed = 1;
                    CKEDITOR.ui.fire("ready", this)
                }
                this._.committed = 1
            }, setState: function (a) {
                if (this._.state != a) {
                    var b = this.document.getById("cke_" + this.id);
                    b.setState(a, "cke_combo");
                    a == CKEDITOR.TRISTATE_DISABLED ?
                        b.setAttribute("aria-disabled", true) : b.removeAttribute("aria-disabled");
                    this._.state = a
                }
            }, enable: function () {
                this._.state == CKEDITOR.TRISTATE_DISABLED && this.setState(this._.lastState)
            }, disable: function () {
                if (this._.state != CKEDITOR.TRISTATE_DISABLED) {
                    this._.lastState = this._.state;
                    this.setState(CKEDITOR.TRISTATE_DISABLED)
                }
            }}, statics: {handler: {create: function (a) {
            return new CKEDITOR.ui.richCombo(a)
        }}}});
        CKEDITOR.ui.prototype.addRichCombo = function (a, b) {
            this.add(a, CKEDITOR.UI_RICHCOMBO, b)
        }
    }(),function () {
        function b(b, a, h, f, g, e, i, d) {
            for (var j = b.config, k = g.split(";"), g = [], l = {}, m = 0; m < k.length; m++) {
                var n = k[m];
                if (n) {
                    var n = n.split("/"), o = {}, s = k[m] = n[0];
                    o[h] = g[m] = n[1] || s;
                    l[s] = new CKEDITOR.style(i, o);
                    l[s]._.definition.name = s
                } else k.splice(m--, 1)
            }
            b.ui.addRichCombo(a, {label: f.label, title: f.panelTitle, toolbar: "styles," + d, panel: {css: [CKEDITOR.skin.getPath("editor")].concat(j.contentsCss), multiSelect: false, attributes: {"aria-label": f.panelTitle}}, init: function () {
                this.startGroup(f.panelTitle);
                for (var a = 0; a < k.length; a++) {
                    var b =
                        k[a];
                    this.add(b, l[b].buildPreview(), b)
                }
            }, onClick: function (a) {
                b.focus();
                b.fire("saveSnapshot");
                var d = l[a];
                b[this.getValue() == a ? "removeStyle" : "applyStyle"](d);
                b.fire("saveSnapshot")
            }, onRender: function () {
                b.on("selectionChange", function (a) {
                    for (var b = this.getValue(), a = a.data.path.elements, c = 0, d; c < a.length; c++) {
                        d = a[c];
                        for (var f in l)if (l[f].checkElementMatch(d, true)) {
                            f != b && this.setValue(f);
                            return
                        }
                    }
                    this.setValue("", e)
                }, this)
            }})
        }

        CKEDITOR.plugins.add("font", {requires: "richcombo", init: function (c) {
            var a = c.config;
            b(c, "Font", "family", c.lang.font, a.font_names, a.font_defaultLabel, a.font_style, 30);
            b(c, "FontSize", "size", c.lang.font.fontSize, a.fontSize_sizes, a.fontSize_defaultLabel, a.fontSize_style, 40)
        }})
    }(),CKEDITOR.config.font_names = "Arial/Arial, Helvetica, sans-serif;Comic Sans MS/Comic Sans MS, cursive;Courier New/Courier New, Courier, monospace;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif",
    CKEDITOR.config.font_defaultLabel = "",CKEDITOR.config.font_style = {element: "span", styles: {"font-family": "#(family)"}, overrides: [
        {element: "font", attributes: {face: null}}
    ]},CKEDITOR.config.fontSize_sizes = "8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px",CKEDITOR.config.fontSize_defaultLabel = "",CKEDITOR.config.fontSize_style = {element: "span", styles: {"font-size": "#(size)"}, overrides: [
        {element: "font", attributes: {size: null}}
    ]},CKEDITOR.plugins.add("format",
        {requires: "richcombo", init: function (b) {
            if (!b.blockless) {
                for (var c = b.config, a = b.lang.format, h = c.format_tags.split(";"), f = {}, g = 0; g < h.length; g++) {
                    var e = h[g];
                    f[e] = new CKEDITOR.style(c["format_" + e]);
                    f[e]._.enterMode = b.config.enterMode
                }
                b.ui.addRichCombo("Format", {label: a.label, title: a.panelTitle, toolbar: "styles,20", panel: {css: [CKEDITOR.skin.getPath("editor")].concat(c.contentsCss), multiSelect: false, attributes: {"aria-label": a.panelTitle}}, init: function () {
                    this.startGroup(a.panelTitle);
                    for (var b in f) {
                        var c =
                            a["tag_" + b];
                        this.add(b, f[b].buildPreview(c), c)
                    }
                }, onClick: function (a) {
                    b.focus();
                    b.fire("saveSnapshot");
                    var a = f[a], c = b.elementPath();
                    b[a.checkActive(c) ? "removeStyle" : "applyStyle"](a);
                    setTimeout(function () {
                        b.fire("saveSnapshot")
                    }, 0)
                }, onRender: function () {
                    b.on("selectionChange", function (a) {
                            var c = this.getValue(), a = a.data.path, e = !b.readOnly && a.isContextFor("p");
                            this[e ? "enable" : "disable"]();
                            if (e) {
                                for (var g in f)if (f[g].checkActive(a)) {
                                    g != c && this.setValue(g, b.lang.format["tag_" + g]);
                                    return
                                }
                                this.setValue("")
                            }
                        },
                        this)
                }})
            }
        }}),CKEDITOR.config.format_tags = "p;h1;h2;h3;h4;h5;h6;pre;address;div",CKEDITOR.config.format_p = {element: "p"},CKEDITOR.config.format_div = {element: "div"},CKEDITOR.config.format_pre = {element: "pre"},CKEDITOR.config.format_address = {element: "address"},CKEDITOR.config.format_h1 = {element: "h1"},CKEDITOR.config.format_h2 = {element: "h2"},CKEDITOR.config.format_h3 = {element: "h3"},CKEDITOR.config.format_h4 = {element: "h4"},CKEDITOR.config.format_h5 = {element: "h5"},CKEDITOR.config.format_h6 = {element: "h6"},
    CKEDITOR.plugins.add("forms", {requires: "dialog,fakeobjects", onLoad: function () {
        CKEDITOR.addCss(".cke_editable form{border: 1px dotted #FF0000;padding: 2px;}\n");
        CKEDITOR.addCss("img.cke_hidden{background-image: url(" + CKEDITOR.getUrl(this.path + "images/hiddenfield.gif") + ");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 16px !important;height: 16px !important;}")
    }, init: function (b) {
        var c = b.lang, a = 0, h = {email: 1, password: 1, search: 1, tel: 1, text: 1, url: 1}, f = function (e, d, f) {
            var g = {};
            d == "form" && (g.context = "form");
            b.addCommand(d, new CKEDITOR.dialogCommand(d, g));
            b.ui.addButton && b.ui.addButton(e, {label: c.common[e.charAt(0).toLowerCase() + e.slice(1)], command: d, toolbar: "forms," + (a = a + 10)});
            CKEDITOR.dialog.add(d, f)
        }, g = this.path + "dialogs/";
        !b.blockless && f("Form", "form", g + "form.js");
        f("Checkbox", "checkbox", g + "checkbox.js");
        f("Radio", "radio", g + "radio.js");
        f("TextField", "textfield", g + "textfield.js");
        f("Textarea", "textarea", g + "textarea.js");
        f("Select", "select", g + "select.js");
        f("Button", "button", g + "button.js");
        var e = CKEDITOR.plugins.get("image");
        e && f("ImageButton", "imagebutton", CKEDITOR.plugins.getPath("image") + "dialogs/image.js");
        f("HiddenField", "hiddenfield", g + "hiddenfield.js");
        if (b.addMenuItems) {
            f = {checkbox: {label: c.forms.checkboxAndRadio.checkboxTitle, command: "checkbox", group: "checkbox"}, radio: {label: c.forms.checkboxAndRadio.radioTitle, command: "radio", group: "radio"}, textfield: {label: c.forms.textfield.title, command: "textfield", group: "textfield"}, hiddenfield: {label: c.forms.hidden.title,
                command: "hiddenfield", group: "hiddenfield"}, imagebutton: {label: c.image.titleButton, command: "imagebutton", group: "imagebutton"}, button: {label: c.forms.button.title, command: "button", group: "button"}, select: {label: c.forms.select.title, command: "select", group: "select"}, textarea: {label: c.forms.textarea.title, command: "textarea", group: "textarea"}};
            !b.blockless && (f.form = {label: c.forms.form.menu, command: "form", group: "form"});
            b.addMenuItems(f)
        }
        if (b.contextMenu) {
            !b.blockless && b.contextMenu.addListener(function (a, b, c) {
                if ((a = c.contains("form", 1)) && !a.isReadOnly())return{form: CKEDITOR.TRISTATE_OFF}
            });
            b.contextMenu.addListener(function (a) {
                if (a && !a.isReadOnly()) {
                    var b = a.getName();
                    if (b == "select")return{select: CKEDITOR.TRISTATE_OFF};
                    if (b == "textarea")return{textarea: CKEDITOR.TRISTATE_OFF};
                    if (b == "input") {
                        var c = a.getAttribute("type") || "text";
                        switch (c) {
                            case "button":
                            case "submit":
                            case "reset":
                                return{button: CKEDITOR.TRISTATE_OFF};
                            case "checkbox":
                                return{checkbox: CKEDITOR.TRISTATE_OFF};
                            case "radio":
                                return{radio: CKEDITOR.TRISTATE_OFF};
                            case "image":
                                return e ? {imagebutton: CKEDITOR.TRISTATE_OFF} : null
                        }
                        if (h[c])return{textfield: CKEDITOR.TRISTATE_OFF}
                    }
                    if (b == "img" && a.data("cke-real-element-type") == "hiddenfield")return{hiddenfield: CKEDITOR.TRISTATE_OFF}
                }
            })
        }
        b.on("doubleclick", function (a) {
            var c = a.data.element;
            if (!b.blockless && c.is("form"))a.data.dialog = "form"; else if (c.is("select"))a.data.dialog = "select"; else if (c.is("textarea"))a.data.dialog = "textarea"; else if (c.is("img") && c.data("cke-real-element-type") == "hiddenfield")a.data.dialog = "hiddenfield";
            else if (c.is("input")) {
                c = c.getAttribute("type") || "text";
                switch (c) {
                    case "button":
                    case "submit":
                    case "reset":
                        a.data.dialog = "button";
                        break;
                    case "checkbox":
                        a.data.dialog = "checkbox";
                        break;
                    case "radio":
                        a.data.dialog = "radio";
                        break;
                    case "image":
                        a.data.dialog = "imagebutton"
                }
                if (h[c])a.data.dialog = "textfield"
            }
        })
    }, afterInit: function (b) {
        var c = b.dataProcessor, a = c && c.htmlFilter, c = c && c.dataFilter;
        CKEDITOR.env.ie && a && a.addRules({elements: {input: function (a) {
            var a = a.attributes, b = a.type;
            if (!b)a.type = "text";
            (b == "checkbox" ||
                b == "radio") && a.value == "on" && delete a.value
        }}});
        c && c.addRules({elements: {input: function (a) {
            if (a.attributes.type == "hidden")return b.createFakeParserElement(a, "cke_hidden", "hiddenfield")
        }}})
    }}),CKEDITOR.env.ie && (CKEDITOR.dom.element.prototype.hasAttribute = CKEDITOR.tools.override(CKEDITOR.dom.element.prototype.hasAttribute, function (b) {
        return function (c) {
            this.$.attributes.getNamedItem(c);
            if (this.getName() == "input")switch (c) {
                case "class":
                    return this.$.className.length > 0;
                case "checked":
                    return!!this.$.checked;
                case "value":
                    var a = this.getAttribute("type");
                    return a == "checkbox" || a == "radio" ? this.$.value != "on" : this.$.value
            }
            return b.apply(this, arguments)
        }
    })),function () {
        var b = {canUndo: false, exec: function (b) {
            var a = b.document.createElement("hr");
            b.insertElement(a)
        }};
        CKEDITOR.plugins.add("horizontalrule", {init: function (c) {
            if (!c.blockless) {
                c.addCommand("horizontalrule", b);
                c.ui.addButton && c.ui.addButton("HorizontalRule", {label: c.lang.horizontalrule.toolbar, command: "horizontalrule", toolbar: "insert,40"})
            }
        }})
    }(),CKEDITOR.plugins.add("htmlwriter",
        {init: function (b) {
            var c = new CKEDITOR.htmlWriter;
            c.forceSimpleAmpersand = b.config.forceSimpleAmpersand;
            c.indentationChars = b.config.dataIndentationChars || "\t";
            b.dataProcessor.writer = c
        }}),CKEDITOR.htmlWriter = CKEDITOR.tools.createClass({base: CKEDITOR.htmlParser.basicWriter, $: function () {
        this.base();
        this.indentationChars = "\t";
        this.selfClosingEnd = " />";
        this.lineBreakChars = "\n";
        this.sortAttributes = 1;
        this._.indent = 0;
        this._.indentation = "";
        this._.inPre = 0;
        this._.rules = {};
        var b = CKEDITOR.dtd, c;
        for (c in CKEDITOR.tools.extend({},
            b.$nonBodyContent, b.$block, b.$listItem, b.$tableContent))this.setRules(c, {indent: !b[c]["#"], breakBeforeOpen: 1, breakBeforeClose: !b[c]["#"], breakAfterClose: 1, needsSpace: c in b.$block && !(c in{li: 1, dt: 1, dd: 1})});
        this.setRules("br", {breakAfterOpen: 1});
        this.setRules("title", {indent: 0, breakAfterOpen: 0});
        this.setRules("style", {indent: 0, breakBeforeClose: 1});
        this.setRules("pre", {breakAfterOpen: 1, indent: 0})
    }, proto: {openTag: function (b) {
        var c = this._.rules[b];
        this._.afterCloser && (c && c.needsSpace && this._.needsSpace) &&
        this._.output.push("\n");
        if (this._.indent)this.indentation(); else if (c && c.breakBeforeOpen) {
            this.lineBreak();
            this.indentation()
        }
        this._.output.push("<", b);
        this._.afterCloser = 0
    }, openTagClose: function (b, c) {
        var a = this._.rules[b];
        if (c) {
            this._.output.push(this.selfClosingEnd);
            if (a && a.breakAfterClose)this._.needsSpace = a.needsSpace
        } else {
            this._.output.push(">");
            if (a && a.indent)this._.indentation = this._.indentation + this.indentationChars
        }
        a && a.breakAfterOpen && this.lineBreak();
        b == "pre" && (this._.inPre = 1)
    }, attribute: function (b, c) {
        if (typeof c == "string") {
            this.forceSimpleAmpersand && (c = c.replace(/&amp;/g, "&"));
            c = CKEDITOR.tools.htmlEncodeAttr(c)
        }
        this._.output.push(" ", b, '="', c, '"')
    }, closeTag: function (b) {
        var c = this._.rules[b];
        if (c && c.indent)this._.indentation = this._.indentation.substr(this.indentationChars.length);
        if (this._.indent)this.indentation(); else if (c && c.breakBeforeClose) {
            this.lineBreak();
            this.indentation()
        }
        this._.output.push("</", b, ">");
        b == "pre" && (this._.inPre = 0);
        if (c && c.breakAfterClose) {
            this.lineBreak();
            this._.needsSpace =
                c.needsSpace
        }
        this._.afterCloser = 1
    }, text: function (b) {
        if (this._.indent) {
            this.indentation();
            !this._.inPre && (b = CKEDITOR.tools.ltrim(b))
        }
        this._.output.push(b)
    }, comment: function (b) {
        this._.indent && this.indentation();
        this._.output.push("<\!--", b, "--\>")
    }, lineBreak: function () {
        !this._.inPre && this._.output.length > 0 && this._.output.push(this.lineBreakChars);
        this._.indent = 1
    }, indentation: function () {
        !this._.inPre && this._.indentation && this._.output.push(this._.indentation);
        this._.indent = 0
    }, reset: function () {
        this._.output =
            [];
        this._.indent = 0;
        this._.indentation = "";
        this._.afterCloser = 0;
        this._.inPre = 0
    }, setRules: function (b, c) {
        var a = this._.rules[b];
        a ? CKEDITOR.tools.extend(a, c, true) : this._.rules[b] = c
    }}}),function () {
        CKEDITOR.plugins.add("iframe", {requires: "dialog,fakeobjects", onLoad: function () {
            CKEDITOR.addCss("img.cke_iframe{background-image: url(" + CKEDITOR.getUrl(this.path + "images/placeholder.png") + ");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 80px;height: 80px;}")
        }, init: function (b) {
            var c =
                b.lang.iframe;
            CKEDITOR.dialog.add("iframe", this.path + "dialogs/iframe.js");
            b.addCommand("iframe", new CKEDITOR.dialogCommand("iframe"));
            b.ui.addButton && b.ui.addButton("Iframe", {label: c.toolbar, command: "iframe", toolbar: "insert,80"});
            b.on("doubleclick", function (a) {
                var b = a.data.element;
                if (b.is("img") && b.data("cke-real-element-type") == "iframe")a.data.dialog = "iframe"
            });
            b.addMenuItems && b.addMenuItems({iframe: {label: c.title, command: "iframe", group: "image"}});
            b.contextMenu && b.contextMenu.addListener(function (a) {
                if (a &&
                    a.is("img") && a.data("cke-real-element-type") == "iframe")return{iframe: CKEDITOR.TRISTATE_OFF}
            })
        }, afterInit: function (b) {
            var c = b.dataProcessor;
            (c = c && c.dataFilter) && c.addRules({elements: {iframe: function (a) {
                return b.createFakeParserElement(a, "cke_iframe", "iframe", true)
            }}})
        }})
    }(),function () {
        function b(a, b) {
            b || (b = a.getSelection().getSelectedElement());
            if (b && b.is("img") && !b.data("cke-realelement") && !b.isReadOnly())return b
        }

        function c(a) {
            var b = a.getStyle("float");
            if (b == "inherit" || b == "none")b = 0;
            b || (b = a.getAttribute("align"));
            return b
        }

        CKEDITOR.plugins.add("image", {requires: "dialog", init: function (a) {
            CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
            a.addCommand("image", new CKEDITOR.dialogCommand("image"));
            a.ui.addButton && a.ui.addButton("Image", {label: a.lang.common.image, command: "image", toolbar: "insert,10"});
            a.on("doubleclick", function (a) {
                var b = a.data.element;
                if (b.is("img") && !b.data("cke-realelement") && !b.isReadOnly())a.data.dialog = "image"
            });
            a.addMenuItems && a.addMenuItems({image: {label: a.lang.image.menu, command: "image",
                group: "image"}});
            a.contextMenu && a.contextMenu.addListener(function (c) {
                if (b(a, c))return{image: CKEDITOR.TRISTATE_OFF}
            })
        }, afterInit: function (a) {
            function h(f) {
                var g = a.getCommand("justify" + f);
                if (g) {
                    if (f == "left" || f == "right")g.on("exec", function (e) {
                        var g = b(a), d;
                        if (g) {
                            d = c(g);
                            if (d == f) {
                                g.removeStyle("float");
                                f == c(g) && g.removeAttribute("align")
                            } else g.setStyle("float", f);
                            e.cancel()
                        }
                    });
                    g.on("refresh", function (e) {
                        var g = b(a);
                        if (g) {
                            g = c(g);
                            this.setState(g == f ? CKEDITOR.TRISTATE_ON : f == "right" || f == "left" ? CKEDITOR.TRISTATE_OFF :
                                CKEDITOR.TRISTATE_DISABLED);
                            e.cancel()
                        }
                    })
                }
            }

            h("left");
            h("right");
            h("center");
            h("block")
        }})
    }(),CKEDITOR.config.image_removeLinkByEmptyURL = !0,function () {
        function b(a, b) {
            var b = b === void 0 || b, c;
            if (b)c = a.getComputedStyle("text-align"); else {
                for (; !a.hasAttribute || !a.hasAttribute("align") && !a.getStyle("text-align");) {
                    c = a.getParent();
                    if (!c)break;
                    a = c
                }
                c = a.getStyle("text-align") || a.getAttribute("align") || ""
            }
            c && (c = c.replace(/(?:-(?:moz|webkit)-)?(?:start|auto)/i, ""));
            !c && b && (c = a.getComputedStyle("direction") == "rtl" ?
                "right" : "left");
            return c
        }

        function c(a, b, c) {
            this.editor = a;
            this.name = b;
            this.value = c;
            this.context = "p";
            if (a = a.config.justifyClasses) {
                switch (c) {
                    case "left":
                        this.cssClassName = a[0];
                        break;
                    case "center":
                        this.cssClassName = a[1];
                        break;
                    case "right":
                        this.cssClassName = a[2];
                        break;
                    case "justify":
                        this.cssClassName = a[3]
                }
                this.cssClassRegex = RegExp("(?:^|\\s+)(?:" + a.join("|") + ")(?=$|\\s)")
            }
        }

        function a(a) {
            var b = a.editor, c = b.createRange();
            c.setStartBefore(a.data.node);
            c.setEndAfter(a.data.node);
            for (var e = new CKEDITOR.dom.walker(c),
                     i; i = e.next();)if (i.type == CKEDITOR.NODE_ELEMENT)if (!i.equals(a.data.node) && i.getDirection()) {
                c.setStartAfter(i);
                e = new CKEDITOR.dom.walker(c)
            } else {
                var d = b.config.justifyClasses;
                if (d)if (i.hasClass(d[0])) {
                    i.removeClass(d[0]);
                    i.addClass(d[2])
                } else if (i.hasClass(d[2])) {
                    i.removeClass(d[2]);
                    i.addClass(d[0])
                }
                d = i.getStyle("text-align");
                d == "left" ? i.setStyle("text-align", "right") : d == "right" && i.setStyle("text-align", "left")
            }
        }

        c.prototype = {exec: function (a) {
            var c = a.getSelection(), g = a.config.enterMode;
            if (c) {
                for (var e =
                    c.createBookmarks(), i = c.getRanges(true), d = this.cssClassName, j, k, l = a.config.useComputedState, l = l === void 0 || l, m = i.length - 1; m >= 0; m--) {
                    j = i[m].createIterator();
                    for (j.enlargeBr = g != CKEDITOR.ENTER_BR; k = j.getNextParagraph(g == CKEDITOR.ENTER_P ? "p" : "div");) {
                        k.removeAttribute("align");
                        k.removeStyle("text-align");
                        var n = d && (k.$.className = CKEDITOR.tools.ltrim(k.$.className.replace(this.cssClassRegex, ""))), o = this.state == CKEDITOR.TRISTATE_OFF && (!l || b(k, true) != this.value);
                        d ? o ? k.addClass(d) : n || k.removeAttribute("class") :
                            o && k.setStyle("text-align", this.value)
                    }
                }
                a.focus();
                a.forceNextSelectionCheck();
                c.selectBookmarks(e)
            }
        }, refresh: function (a, c) {
            var g = c.block || c.blockLimit;
            this.setState(g.getName() != "body" && b(g, this.editor.config.useComputedState) == this.value ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
        }};
        CKEDITOR.plugins.add("justify", {init: function (b) {
            if (!b.blockless) {
                var f = new c(b, "justifyleft", "left"), g = new c(b, "justifycenter", "center"), e = new c(b, "justifyright", "right"), i = new c(b, "justifyblock", "justify");
                b.addCommand("justifyleft",
                    f);
                b.addCommand("justifycenter", g);
                b.addCommand("justifyright", e);
                b.addCommand("justifyblock", i);
                if (b.ui.addButton) {
                    b.ui.addButton("JustifyLeft", {label: b.lang.justify.left, command: "justifyleft", toolbar: "align,10"});
                    b.ui.addButton("JustifyCenter", {label: b.lang.justify.center, command: "justifycenter", toolbar: "align,20"});
                    b.ui.addButton("JustifyRight", {label: b.lang.justify.right, command: "justifyright", toolbar: "align,30"});
                    b.ui.addButton("JustifyBlock", {label: b.lang.justify.block, command: "justifyblock",
                        toolbar: "align,40"})
                }
                b.on("dirChanged", a)
            }
        }})
    }(),CKEDITOR.plugins.add("link", {requires: "dialog,fakeobjects", onLoad: function () {
        function b(b) {
            return a.replace(/%1/g, b == "rtl" ? "right" : "left").replace(/%2/g, "cke_contents_" + b)
        }

        var c = "background:url(" + CKEDITOR.getUrl(this.path + "images/anchor.png") + ") no-repeat %1 center;border:1px dotted #00f;", a = ".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" + c + "padding-%1:18px;cursor:auto;}" + (CKEDITOR.env.ie ?
            "a.cke_anchor_empty{display:inline-block;}" : "") + ".%2 img.cke_anchor{" + c + "width:16px;min-height:15px;height:1.15em;vertical-align:" + (CKEDITOR.env.opera ? "middle" : "text-bottom") + ";}";
        CKEDITOR.addCss(b("ltr") + b("rtl"))
    }, init: function (b) {
        b.addCommand("link", new CKEDITOR.dialogCommand("link"));
        b.addCommand("anchor", new CKEDITOR.dialogCommand("anchor"));
        b.addCommand("unlink", new CKEDITOR.unlinkCommand);
        b.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand);
        b.setKeystroke(CKEDITOR.CTRL + 76, "link");
        if (b.ui.addButton) {
            b.ui.addButton("Link", {label: b.lang.link.toolbar, command: "link", toolbar: "links,10"});
            b.ui.addButton("Unlink", {label: b.lang.link.unlink, command: "unlink", toolbar: "links,20"});
            b.ui.addButton("Anchor", {label: b.lang.link.anchor.toolbar, command: "anchor", toolbar: "links,30"})
        }
        CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
        CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
        b.on("doubleclick", function (c) {
            var a = CKEDITOR.plugins.link.getSelectedLink(b) || c.data.element;
            if (!a.isReadOnly())if (a.is("a")) {
                c.data.dialog =
                        a.getAttribute("name") && (!a.getAttribute("href") || !a.getChildCount()) ? "anchor" : "link";
                b.getSelection().selectElement(a)
            } else if (CKEDITOR.plugins.link.tryRestoreFakeAnchor(b, a))c.data.dialog = "anchor"
        });
        b.addMenuItems && b.addMenuItems({anchor: {label: b.lang.link.anchor.menu, command: "anchor", group: "anchor", order: 1}, removeAnchor: {label: b.lang.link.anchor.remove, command: "removeAnchor", group: "anchor", order: 5}, link: {label: b.lang.link.menu, command: "link", group: "link", order: 1}, unlink: {label: b.lang.link.unlink,
            command: "unlink", group: "link", order: 5}});
        b.contextMenu && b.contextMenu.addListener(function (c) {
            if (!c || c.isReadOnly())return null;
            c = CKEDITOR.plugins.link.tryRestoreFakeAnchor(b, c);
            if (!c && !(c = CKEDITOR.plugins.link.getSelectedLink(b)))return null;
            var a = {};
            c.getAttribute("href") && c.getChildCount() && (a = {link: CKEDITOR.TRISTATE_OFF, unlink: CKEDITOR.TRISTATE_OFF});
            if (c && c.hasAttribute("name"))a.anchor = a.removeAnchor = CKEDITOR.TRISTATE_OFF;
            return a
        })
    }, afterInit: function (b) {
        var c = b.dataProcessor, a = c && c.dataFilter,
            c = c && c.htmlFilter, h = b._.elementsPath && b._.elementsPath.filters;
        a && a.addRules({elements: {a: function (a) {
            var c = a.attributes;
            if (!c.name)return null;
            var e = !a.children.length;
            if (CKEDITOR.plugins.link.synAnchorSelector) {
                var a = e ? "cke_anchor_empty" : "cke_anchor", i = c["class"];
                if (c.name && (!i || i.indexOf(a) < 0))c["class"] = (i || "") + " " + a;
                if (e && CKEDITOR.plugins.link.emptyAnchorFix) {
                    c.contenteditable = "false";
                    c["data-cke-editable"] = 1
                }
            } else if (CKEDITOR.plugins.link.fakeAnchor && e)return b.createFakeParserElement(a, "cke_anchor",
                "anchor");
            return null
        }}});
        CKEDITOR.plugins.link.emptyAnchorFix && c && c.addRules({elements: {a: function (a) {
            delete a.attributes.contenteditable
        }}});
        h && h.push(function (a, c) {
            if (c == "a" && (CKEDITOR.plugins.link.tryRestoreFakeAnchor(b, a) || a.getAttribute("name") && (!a.getAttribute("href") || !a.getChildCount())))return"anchor"
        })
    }}),CKEDITOR.plugins.link = {getSelectedLink: function (b) {
        var c = b.getSelection(), a = c.getSelectedElement();
        if (a && a.is("a"))return a;
        if (c = c.getRanges(true)[0]) {
            c.shrink(CKEDITOR.SHRINK_TEXT);
            return b.elementPath(c.getCommonAncestor()).contains("a", 1)
        }
        return null
    }, fakeAnchor: CKEDITOR.env.opera || CKEDITOR.env.webkit, synAnchorSelector: CKEDITOR.env.ie, emptyAnchorFix: CKEDITOR.env.ie && 8 > CKEDITOR.env.version, tryRestoreFakeAnchor: function (b, c) {
        if (c && c.data("cke-real-element-type") && c.data("cke-real-element-type") == "anchor") {
            var a = b.restoreRealElement(c);
            if (a.data("cke-saved-name"))return a
        }
    }},CKEDITOR.unlinkCommand = function () {
    },CKEDITOR.unlinkCommand.prototype = {exec: function (b) {
        var c = new CKEDITOR.style({element: "a",
            type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1});
        b.removeStyle(c)
    }, refresh: function (b, c) {
        var a = c.lastElement && c.lastElement.getAscendant("a", true);
        a && a.getName() == "a" && a.getAttribute("href") && a.getChildCount() ? this.setState(CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_DISABLED)
    }, contextSensitive: 1, startDisabled: 1},CKEDITOR.removeAnchorCommand = function () {
    },CKEDITOR.removeAnchorCommand.prototype = {exec: function (b) {
        var c = b.getSelection(), a = c.createBookmarks(), h;
        if (c && (h = c.getSelectedElement()) &&
            (CKEDITOR.plugins.link.fakeAnchor && !h.getChildCount() ? CKEDITOR.plugins.link.tryRestoreFakeAnchor(b, h) : h.is("a")))h.remove(1); else if (h = CKEDITOR.plugins.link.getSelectedLink(b))if (h.hasAttribute("href")) {
            h.removeAttributes({name: 1, "data-cke-saved-name": 1});
            h.removeClass("cke_anchor")
        } else h.remove(1);
        c.selectBookmarks(a)
    }},CKEDITOR.tools.extend(CKEDITOR.config, {linkShowAdvancedTab: !0, linkShowTargetTab: !0}),function () {
        CKEDITOR.plugins.liststyle = {requires: "dialog,contextmenu", init: function (b) {
            b.addCommand("numberedListStyle",
                new CKEDITOR.dialogCommand("numberedListStyle"));
            CKEDITOR.dialog.add("numberedListStyle", this.path + "dialogs/liststyle.js");
            b.addCommand("bulletedListStyle", new CKEDITOR.dialogCommand("bulletedListStyle"));
            CKEDITOR.dialog.add("bulletedListStyle", this.path + "dialogs/liststyle.js");
            b.addMenuGroup("list", 108);
            b.addMenuItems({numberedlist: {label: b.lang.liststyle.numberedTitle, group: "list", command: "numberedListStyle"}, bulletedlist: {label: b.lang.liststyle.bulletedTitle, group: "list", command: "bulletedListStyle"}});
            b.contextMenu.addListener(function (b) {
                if (!b || b.isReadOnly())return null;
                for (; b;) {
                    var a = b.getName();
                    if (a == "ol")return{numberedlist: CKEDITOR.TRISTATE_OFF};
                    if (a == "ul")return{bulletedlist: CKEDITOR.TRISTATE_OFF};
                    b = b.getParent()
                }
                return null
            })
        }};
        CKEDITOR.plugins.add("liststyle", CKEDITOR.plugins.liststyle)
    }(),"use strict",function () {
        function b(a, b, c) {
            return j(b) && j(c) && c.equals(b.getNext(function (a) {
                return!(T(a) || V(a) || k(a))
            }))
        }

        function c(a) {
            this.upper = a[0];
            this.lower = a[1];
            this.set.apply(this, a.slice(2))
        }

        function a(a) {
            var b = a.element, c;
            return b && j(b) ? (c = b.getAscendant(a.triggers, true)) && !c.contains(a.editable) && !c.equals(a.editable) ? c : null : null
        }

        function h(a, b, c) {
            p(a, b);
            p(a, c);
            a = b.size.bottom;
            c = c.size.top;
            return a && c ? 0 | (a + c) / 2 : a || c
        }

        function f(a, b, c) {
            return b = b[c ? "getPrevious" : "getNext"](function (b) {
                return b && b.type == CKEDITOR.NODE_TEXT && !T(b) || j(b) && !k(b) && !d(a, b)
            })
        }

        function g(a) {
            var b = a.doc, c = q('<span contenteditable="false" style="' + Q + "position:absolute;border-top:1px dashed " + a.boxColor + '"></span>',
                b);
            v(c, {attach: function () {
                this.wrap.getParent() || this.wrap.appendTo(a.editable, true);
                return this
            }, lineChildren: [v(q('<span title="' + a.editor.lang.magicline.title + '" contenteditable="false">&#8629;</span>', b), {base: Q + "height:17px;width:17px;" + (a.rtl ? "left" : "right") + ":17px;background:url(" + this.path + "images/icon.png) center no-repeat " + a.boxColor + ";cursor:pointer;" + (u.hc ? "font-size: 15px;line-height:14px;border:1px solid #fff;text-align:center;" : ""), looks: ["top:-8px;" + CKEDITOR.tools.cssVendorPrefix("border-radius",
                "2px", 1), "top:-17px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "2px 2px 0px 0px", 1), "top:-1px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "0px 0px 2px 2px", 1)]}), v(q(O, b), {base: R + "left:0px;border-left-color:" + a.boxColor + ";", looks: ["border-width:8px 0 8px 8px;top:-8px", "border-width:8px 0 0 8px;top:-8px", "border-width:0 0 8px 8px;top:0px"]}), v(q(O, b), {base: R + "right:0px;border-right-color:" + a.boxColor + ";", looks: ["border-width:8px 8px 8px 0;top:-8px", "border-width:8px 8px 0 0;top:-8px", "border-width:0 8px 8px 0;top:0px"]})],
                detach: function () {
                    this.wrap.getParent() && this.wrap.remove();
                    return this
                }, mouseNear: function () {
                    p(a, this);
                    var b = a.holdDistance, c = this.size;
                    return c && a.mouse.y > c.top - b && a.mouse.y < c.bottom + b && a.mouse.x > c.left - b && a.mouse.x < c.right + b ? true : false
                }, place: function () {
                    var b = a.view, c = a.editable, d = a.trigger, e = d.upper, f = d.lower, g = e || f, i = g.getParent(), h = {};
                    this.trigger = d;
                    e && p(a, e, true);
                    f && p(a, f, true);
                    p(a, i, true);
                    a.inInlineMode && t(a, true);
                    if (i.equals(c)) {
                        h.left = b.scroll.x;
                        h.right = -b.scroll.x;
                        h.width = ""
                    } else {
                        h.left =
                            g.size.left - g.size.margin.left + b.scroll.x - (a.inInlineMode ? b.editable.left + b.editable.border.left : 0);
                        h.width = g.size.outerWidth + g.size.margin.left + g.size.margin.right + b.scroll.x;
                        h.right = ""
                    }
                    if (e && f)h.top = e.size.margin.bottom === f.size.margin.top ? 0 | e.size.bottom + e.size.margin.bottom / 2 : e.size.margin.bottom < f.size.margin.top ? e.size.bottom + e.size.margin.bottom : e.size.bottom + e.size.margin.bottom - f.size.margin.top; else if (e) {
                        if (!f)h.top = e.size.bottom + e.size.margin.bottom
                    } else h.top = f.size.top - f.size.margin.top;
                    if (d.is(E) || h.top > b.scroll.y - 15 && h.top < b.scroll.y + 5) {
                        h.top = a.inInlineMode ? 0 : b.scroll.y;
                        this.look(E)
                    } else if (d.is(K) || h.top > b.pane.bottom - 5 && h.top < b.pane.bottom + 15) {
                        h.top = a.inInlineMode ? b.editable.height + b.editable.padding.top + b.editable.padding.bottom : b.pane.bottom - 1;
                        this.look(K)
                    } else {
                        if (a.inInlineMode)h.top = h.top - (b.editable.top + b.editable.border.top);
                        this.look(I)
                    }
                    if (a.inInlineMode) {
                        h.top--;
                        h.top = h.top + b.editable.scroll.top;
                        h.left = h.left + b.editable.scroll.left
                    }
                    for (var j in h)h[j] = CKEDITOR.tools.cssLength(h[j]);
                    this.setStyles(h)
                }, look: function (a) {
                    if (this.oldLook != a) {
                        for (var b = this.lineChildren.length, c; b--;)(c = this.lineChildren[b]).setAttribute("style", c.base + c.looks[0 | a / 2]);
                        this.oldLook = a
                    }
                }, wrap: new w("span", a.doc)});
            for (b = c.lineChildren.length; b--;)c.lineChildren[b].appendTo(c);
            c.look(I);
            c.appendTo(c.wrap);
            c.unselectable();
            c.lineChildren[0].on("mouseup", function (b) {
                c.detach();
                e(a, function (b) {
                    var c = a.line.trigger;
                    b[c.is(z) ? "insertBefore" : "insertAfter"](c.is(z) ? c.lower : c.upper)
                }, true);
                a.editor.focus();
                !u.ie &&
                    a.enterMode != CKEDITOR.ENTER_BR && a.hotNode.scrollIntoView();
                b.data.preventDefault(true)
            });
            c.on("mousedown", function (a) {
                a.data.preventDefault(true)
            });
            a.line = c
        }

        function e(a, b, c) {
            var d = new CKEDITOR.dom.range(a.doc), e = a.editor, f;
            if (u.ie && a.enterMode == CKEDITOR.ENTER_BR)f = a.doc.createText(G); else {
                f = new w(a.enterBehavior, a.doc);
                a.enterMode != CKEDITOR.ENTER_BR && a.doc.createText(G).appendTo(f)
            }
            c && e.fire("saveSnapshot");
            b(f);
            d.moveToPosition(f, CKEDITOR.POSITION_AFTER_START);
            e.getSelection().selectRanges([d]);
            a.hotNode = f;
            c && e.fire("saveSnapshot")
        }

        function i(b, c) {
            return{canUndo: true, modes: {wysiwyg: 1}, exec: function () {
                function d(a) {
                    var f = u.ie && u.version < 9 ? " " : G, g = b.hotNode && b.hotNode.getText() == f && b.element.equals(b.hotNode) && b.lastCmdDirection === !!c;
                    e(b, function (d) {
                        g && b.hotNode && b.hotNode.remove();
                        d[c ? "insertAfter" : "insertBefore"](a);
                        d.setAttributes({"data-cke-magicline-hot": 1, "data-cke-magicline-dir": !!c});
                        b.lastCmdDirection = !!c
                    });
                    !u.ie && b.enterMode != CKEDITOR.ENTER_BR && b.hotNode.scrollIntoView();
                    b.line.detach()
                }

                return function (e) {
                    e = e.getSelection().getStartElement();
                    if ((e = e.getAscendant(P, 1)) && !e.equals(b.editable) && !e.contains(b.editable)) {
                        b.element = e;
                        var g = f(b, e, !c), i;
                        if (j(g) && g.is(b.triggers) && g.is(J) && (!f(b, g, !c) || (i = f(b, g, !c)) && j(i) && i.is(b.triggers)))d(g); else {
                            i = a(b, e);
                            if (j(i))if (f(b, i, !c))(e = f(b, i, !c)) && (j(e) && e.is(b.triggers)) && d(i); else d(i)
                        }
                    }
                }
            }()}
        }

        function d(a, b) {
            if (!b || !(b.type == CKEDITOR.NODE_ELEMENT && b.$))return false;
            var c = a.line;
            return c.wrap.equals(b) || c.wrap.contains(b)
        }

        function j(a) {
            return a &&
                a.type == CKEDITOR.NODE_ELEMENT && a.$
        }

        function k(a) {
            if (!j(a))return false;
            var b;
            if (!(b = l(a)))if (j(a)) {
                b = {left: 1, right: 1, center: 1};
                b = !(!b[a.getComputedStyle("float")] && !b[a.getAttribute("align")])
            } else b = false;
            return b
        }

        function l(a) {
            return!!{absolute: 1, fixed: 1, relative: 1}[a.getComputedStyle("position")]
        }

        function m(a, b) {
            return j(b) ? b.is(a.triggers) : null
        }

        function n(a, b, c) {
            b = b[c ? "getLast" : "getFirst"](function (b) {
                return a.isRelevant(b) && !b.is(L)
            });
            if (!b)return false;
            p(a, b);
            return c ? b.size.top > a.mouse.y : b.size.bottom <
                a.mouse.y
        }

        function o(a) {
            var b = a.editable, e = a.mouse, f = a.view, g = a.triggerOffset;
            t(a);
            var i = e.y > (a.inInlineMode ? f.editable.top + f.editable.height / 2 : Math.min(f.editable.height, f.pane.height) / 2), b = b[i ? "getLast" : "getFirst"](function (a) {
                return!(T(a) || V(a))
            });
            if (!b)return null;
            d(a, b) && (b = a.line.wrap[i ? "getPrevious" : "getNext"](function (a) {
                return!(T(a) || V(a))
            }));
            if (!j(b) || k(b) || !m(a, b))return null;
            p(a, b);
            if (!i && b.size.top >= 0 && e.y > 0 && e.y < b.size.top + g) {
                a = a.inInlineMode || f.scroll.y === 0 ? E : I;
                return new c([null, b,
                    z, D, a])
            }
            if (i && b.size.bottom <= f.pane.height && e.y > b.size.bottom - g && e.y < f.pane.height) {
                a = a.inInlineMode || b.size.bottom > f.pane.height - g && b.size.bottom < f.pane.height ? K : I;
                return new c([b, null, y, D, a])
            }
            return null
        }

        function s(b) {
            var d = b.mouse, e = b.view, g = b.triggerOffset, i = a(b);
            if (!i)return null;
            p(b, i);
            var g = Math.min(g, 0 | i.size.outerHeight / 2), h = [], o, l;
            if (d.y > i.size.top - 1 && d.y < i.size.top + g)l = false; else if (d.y > i.size.bottom - g && d.y < i.size.bottom + 1)l = true; else return null;
            if (k(i) || n(b, i, l) || i.getParent().is(H))return null;
            var r = f(b, i, !l);
            if (r) {
                if (r && r.type == CKEDITOR.NODE_TEXT)return null;
                if (j(r)) {
                    if (k(r) || !m(b, r) || r.getParent().is(H))return null;
                    h = [r, i][l ? "reverse" : "concat"]().concat([C, D])
                }
            } else {
                if (i.equals(b.editable[l ? "getLast" : "getFirst"](b.isRelevant))) {
                    t(b);
                    l && d.y > i.size.bottom - g && d.y < e.pane.height && i.size.bottom > e.pane.height - g && i.size.bottom < e.pane.height ? o = K : d.y > 0 && d.y < i.size.top + g && (o = E)
                } else o = I;
                h = [null, i][l ? "reverse" : "concat"]().concat([l ? y : z, D, o, i.equals(b.editable[l ? "getLast" : "getFirst"](b.isRelevant)) ?
                    l ? K : E : I])
            }
            return 0 in h ? new c(h) : null
        }

        function r(a, b, c, d) {
            for (var e = function () {
                var c = u.ie ? b.$.currentStyle : a.win.$.getComputedStyle(b.$, "");
                return u.ie ? function (a) {
                    return c[CKEDITOR.tools.cssStyleToDomStyle(a)]
                } : function (a) {
                    return c.getPropertyValue(a)
                }
            }(), f = b.getDocumentPosition(), g = {}, i = {}, h = {}, j = {}, k = S.length; k--;) {
                g[S[k]] = parseInt(e("border-" + S[k] + "-width"), 10) || 0;
                h[S[k]] = parseInt(e("padding-" + S[k]), 10) || 0;
                i[S[k]] = parseInt(e("margin-" + S[k]), 10) || 0
            }
            (!c || d) && x(a, d);
            j.top = f.y - (c ? 0 : a.view.scroll.y);
            j.left = f.x - (c ? 0 : a.view.scroll.x);
            j.outerWidth = b.$.offsetWidth;
            j.outerHeight = b.$.offsetHeight;
            j.height = j.outerHeight - (h.top + h.bottom + g.top + g.bottom);
            j.width = j.outerWidth - (h.left + h.right + g.left + g.right);
            j.bottom = j.top + j.outerHeight;
            j.right = j.left + j.outerWidth;
            if (a.inInlineMode)j.scroll = {top: b.$.scrollTop, left: b.$.scrollLeft};
            return v({border: g, padding: h, margin: i, ignoreScroll: c}, j, true)
        }

        function p(a, b, c) {
            if (!j(b))return b.size = null;
            if (b.size) {
                if (b.size.ignoreScroll == c && b.size.date > new Date - M)return null
            } else b.size =
            {};
            return v(b.size, r(a, b, c), {date: +new Date}, true)
        }

        function t(a, b) {
            a.view.editable = r(a, a.editable, b, true)
        }

        function x(a, b) {
            if (!a.view)a.view = {};
            var c = a.view;
            if (b || !(c && c.date > new Date - M)) {
                var d = a.win, c = d.getScrollPosition(), d = d.getViewPaneSize();
                v(a.view, {scroll: {x: c.x, y: c.y, width: a.doc.$.documentElement.scrollWidth - d.width, height: a.doc.$.documentElement.scrollHeight - d.height}, pane: {width: d.width, height: d.height, bottom: d.height + c.y}, date: +new Date}, true)
            }
        }

        function A(a, b, d, e) {
            for (var f = e, g = e, i = 0, h =
                false, j = false, k = a.view.pane.height, n = a.mouse; n.y + i < k && n.y - i > 0;) {
                h || (h = b(f, e));
                j || (j = b(g, e));
                !h && n.y - i > 0 && (f = d(a, {x: n.x, y: n.y - i}));
                !j && n.y + i < k && (g = d(a, {x: n.x, y: n.y + i}));
                if (h && j)break;
                i = i + 2
            }
            return new c([f, g, null, null])
        }

        CKEDITOR.plugins.add("magicline", {init: function (b) {
            var h = {};
            h[CKEDITOR.ENTER_BR] = "br";
            h[CKEDITOR.ENTER_P] = "p";
            h[CKEDITOR.ENTER_DIV] = "div";
            var n = b.config, p = n.magicline_triggerOffset || 30, m = n.enterMode, q = {editor: b, enterBehavior: h[m], enterMode: m, triggerOffset: p, holdDistance: 0 | p * (n.magicline_holdDistance ||
                0.5), boxColor: n.magicline_color || "#ff0000", rtl: n.contentsLangDirection == "rtl", triggers: n.magicline_everywhere ? P : {table: 1, hr: 1, div: 1, ul: 1, ol: 1, dl: 1, form: 1, blockquote: 1}}, w, A, z;
            q.isRelevant = function (a) {
                return j(a) && !d(q, a) && !k(a)
            };
            b.on("contentDom", function () {
                var h = b.editable(), j = b.document, k = b.window;
                v(q, {editable: h, inInlineMode: h.isInline(), doc: j, win: k}, true);
                q.boundary = q.inInlineMode ? q.editable : q.doc.getDocumentElement();
                if (!h.is(B.$inline)) {
                    q.inInlineMode && !l(h) && h.setStyles({position: "relative",
                        top: null, left: null});
                    g.call(this, q);
                    x(q);
                    h.attachListener(b, "beforeUndoImage", function () {
                        q.line.detach()
                    });
                    h.attachListener(b, "beforeGetData", function () {
                        if (q.line.wrap.getParent()) {
                            q.line.detach();
                            b.once("getData", function () {
                                q.line.attach()
                            }, null, null, 1E3)
                        }
                    }, null, null, 0);
                    h.attachListener(q.inInlineMode ? j : j.getWindow().getFrame(), "mouseout", function (a) {
                        if (b.mode == "wysiwyg")if (q.inInlineMode) {
                            var c = a.data.$.clientX, a = a.data.$.clientY;
                            x(q);
                            t(q, true);
                            var d = q.view.editable, e = q.view.scroll;
                            if (!(c > d.left -
                                e.x && c < d.right - e.x) || !(a > d.top - e.y && a < d.bottom - e.y)) {
                                clearTimeout(z);
                                z = null;
                                q.line.detach()
                            }
                        } else {
                            clearTimeout(z);
                            z = null;
                            q.line.detach()
                        }
                    });
                    h.attachListener(h, "keyup", function () {
                        q.hiddenMode = 0
                    });
                    h.attachListener(h, "keydown", function (a) {
                        if (b.mode == "wysiwyg") {
                            a = a.data.getKeystroke();
                            b.getSelection().getStartElement();
                            switch (a) {
                                case 2228240:
                                case 16:
                                    q.hiddenMode = 1;
                                    q.line.detach()
                            }
                        }
                    });
                    h.attachListener(q.inInlineMode ? h : j, "mousemove", function (a) {
                        A = true;
                        if (!(b.mode != "wysiwyg" || b.readOnly || z)) {
                            var c = {x: a.data.$.clientX,
                                y: a.data.$.clientY};
                            z = setTimeout(function () {
                                q.mouse = c;
                                z = q.trigger = null;
                                x(q);
                                if (A && !q.hiddenMode && b.focusManager.hasFocus && !q.line.mouseNear() && (q.element = U(q, true))) {
                                    if (q.trigger = o(q) || s(q) || W(q))q.line.attach().place(); else {
                                        q.trigger = null;
                                        q.line.detach()
                                    }
                                    A = false
                                }
                            }, 30)
                        }
                    });
                    h.attachListener(k, "scroll", function () {
                        if (b.mode == "wysiwyg") {
                            q.line.detach();
                            if (u.webkit) {
                                q.hiddenMode = 1;
                                clearTimeout(w);
                                w = setTimeout(function () {
                                    q.hiddenMode = 0
                                }, 50)
                            }
                        }
                    });
                    h.attachListener(k, "mousedown", function () {
                        if (b.mode == "wysiwyg") {
                            q.line.detach();
                            q.hiddenMode = 1
                        }
                    });
                    h.attachListener(k, "mouseup", function () {
                        q.hiddenMode = 0
                    });
                    b.addCommand("accessPreviousSpace", i(q));
                    b.addCommand("accessNextSpace", i(q, true));
                    b.setKeystroke([
                        [n.magicline_keystrokePrevious, "accessPreviousSpace"],
                        [n.magicline_keystrokeNext, "accessNextSpace"]
                    ]);
                    b.on("loadSnapshot", function () {
                        for (var a = b.document.getElementsByTag(q.enterBehavior), c, d = a.count(); d--;)if ((c = a.getItem(d)).hasAttribute("data-cke-magicline-hot")) {
                            q.hotNode = c;
                            q.lastCmdDirection = c.getAttribute("data-cke-magicline-dir") ===
                                "true" ? true : false;
                            break
                        }
                    });
                    this.backdoor = {accessFocusSpace: e, boxTrigger: c, isLine: d, getAscendantTrigger: a, getNonEmptyNeighbour: f, getSize: r, that: q, triggerEdge: s, triggerEditable: o, triggerExpand: W}
                }
            }, this)
        }});
        var v = CKEDITOR.tools.extend, w = CKEDITOR.dom.element, q = w.createFromHtml, u = CKEDITOR.env, B = CKEDITOR.dtd, z = 128, y = 64, C = 32, D = 16, F = 8, E = 4, K = 2, I = 1, G = " ", H = B.$listItem, L = B.$tableContent, J = v({}, B.$nonEditable, B.$empty), P = B.$block, M = 100, Q = "width:0px;height:0px;padding:0px;margin:0px;display:block;z-index:9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;",
            R = Q + "border-color:transparent;display:block;border-style:solid;", O = "<span>" + G + "</span>";
        c.prototype = {set: function (a, b, c) {
            this.properties = a + b + (c || I);
            return this
        }, is: function (a) {
            return(this.properties & a) == a
        }};
        var U = function () {
            return function (a, b, c) {
                if (!a.mouse)return null;
                var e = a.doc, f = a.line.wrap, c = c || a.mouse, g = new CKEDITOR.dom.element(e.$.elementFromPoint(c.x, c.y));
                if (b && d(a, g)) {
                    f.hide();
                    g = new CKEDITOR.dom.element(e.$.elementFromPoint(c.x, c.y));
                    f.show()
                }
                return!g || !(g.type == CKEDITOR.NODE_ELEMENT &&
                    g.$) || u.ie && u.version < 9 && !a.boundary.equals(g) && !a.boundary.contains(g) ? null : g
            }
        }(), T = CKEDITOR.dom.walker.whitespaces(), V = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_COMMENT), W = function () {
            function a(d) {
                var e = d.element, f, g, i;
                if (!j(e) || e.contains(d.editable))return null;
                i = A(d, function (a, b) {
                    return!b.equals(a)
                }, function (a, b) {
                    return U(a, true, b)
                }, e);
                f = i.upper;
                g = i.lower;
                if (b(d, f, g))return i.set(C, F);
                if (f && e.contains(f))for (; !f.getParent().equals(e);)f = f.getParent(); else f = e.getFirst(function (a) {
                    return c(d,
                        a)
                });
                if (g && e.contains(g))for (; !g.getParent().equals(e);)g = g.getParent(); else g = e.getLast(function (a) {
                    return c(d, a)
                });
                if (!f || !g)return null;
                p(d, f);
                p(d, g);
                if (!(d.mouse.y > f.size.top && d.mouse.y < g.size.bottom))return null;
                for (var e = Number.MAX_VALUE, k, n, l, o; g && !g.equals(f);) {
                    if (!(n = f.getNext(d.isRelevant)))break;
                    k = Math.abs(h(d, f, n) - d.mouse.y);
                    if (k < e) {
                        e = k;
                        l = f;
                        o = n
                    }
                    f = n;
                    p(d, f)
                }
                if (!l || !o || !(d.mouse.y > l.size.top && d.mouse.y < o.size.bottom))return null;
                i.upper = l;
                i.lower = o;
                return i.set(C, F)
            }

            function c(a, b) {
                return!(b &&
                    b.type == CKEDITOR.NODE_TEXT || V(b) || k(b) || d(a, b) || b.type == CKEDITOR.NODE_ELEMENT && b.$ && b.is("br"))
            }

            return function (c) {
                var d = a(c), e;
                if (e = d) {
                    e = d.upper;
                    var f = d.lower;
                    e = !e || !f || k(f) || k(e) || f.equals(e) || e.equals(f) || f.contains(e) || e.contains(f) ? false : m(c, e) && m(c, f) && b(c, e, f) ? true : false
                }
                return e ? d : null
            }
        }(), S = ["top", "left", "right", "bottom"]
    }(),CKEDITOR.config.magicline_keystrokePrevious = CKEDITOR.CTRL + CKEDITOR.SHIFT + 219,CKEDITOR.config.magicline_keystrokeNext = CKEDITOR.CTRL + CKEDITOR.SHIFT + 221,function () {
        function b(a) {
            if (!a ||
                a.type != CKEDITOR.NODE_ELEMENT || a.getName() != "form")return[];
            for (var b = [], c = ["style", "className"], d = 0; d < c.length; d++) {
                var f = a.$.elements.namedItem(c[d]);
                if (f) {
                    f = new CKEDITOR.dom.element(f);
                    b.push([f, f.nextSibling]);
                    f.remove()
                }
            }
            return b
        }

        function c(a, b) {
            if (a && !(a.type != CKEDITOR.NODE_ELEMENT || a.getName() != "form") && b.length > 0)for (var c = b.length - 1; c >= 0; c--) {
                var d = b[c][0], f = b[c][1];
                f ? d.insertBefore(f) : d.appendTo(a)
            }
        }

        function a(a, e) {
            var f = b(a), d = {}, h = a.$;
            if (!e) {
                d["class"] = h.className || "";
                h.className = ""
            }
            d.inline =
                h.style.cssText || "";
            if (!e)h.style.cssText = "position: static; overflow: visible";
            c(f);
            return d
        }

        function h(a, e) {
            var f = b(a), d = a.$;
            if ("class"in e)d.className = e["class"];
            if ("inline"in e)d.style.cssText = e.inline;
            c(f)
        }

        function f(a) {
            if (!a.editable().isInline()) {
                var b = CKEDITOR.instances, c;
                for (c in b) {
                    var d = b[c];
                    if (d.mode == "wysiwyg" && !d.readOnly) {
                        d = d.document.getBody();
                        d.setAttribute("contentEditable", false);
                        d.setAttribute("contentEditable", true)
                    }
                }
                if (a.editable().hasFocus) {
                    a.toolbox.focus();
                    a.focus()
                }
            }
        }

        CKEDITOR.plugins.add("maximize",
            {init: function (b) {
                function c() {
                    var a = j.getViewPaneSize();
                    b.resize(a.width, a.height, null, true)
                }

                if (b.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                    var i = b.lang, d = CKEDITOR.document, j = d.getWindow(), k, l, m, n = CKEDITOR.TRISTATE_OFF;
                    b.addCommand("maximize", {modes: {wysiwyg: !CKEDITOR.env.iOS, source: !CKEDITOR.env.iOS}, readOnly: 1, editorFocus: false, exec: function () {
                        var o = b.container.getChild(1), s = b.ui.space("contents");
                        if (b.mode == "wysiwyg") {
                            var r = b.getSelection();
                            k = r && r.getRanges();
                            l = j.getScrollPosition()
                        } else {
                            var p =
                                b.editable().$;
                            k = !CKEDITOR.env.ie && [p.selectionStart, p.selectionEnd];
                            l = [p.scrollLeft, p.scrollTop]
                        }
                        if (this.state == CKEDITOR.TRISTATE_OFF) {
                            j.on("resize", c);
                            m = j.getScrollPosition();
                            for (r = b.container; r = r.getParent();) {
                                r.setCustomData("maximize_saved_styles", a(r));
                                r.setStyle("z-index", b.config.baseFloatZIndex - 5)
                            }
                            s.setCustomData("maximize_saved_styles", a(s, true));
                            o.setCustomData("maximize_saved_styles", a(o, true));
                            s = {overflow: CKEDITOR.env.webkit ? "" : "hidden", width: 0, height: 0};
                            d.getDocumentElement().setStyles(s);
                            !CKEDITOR.env.gecko && d.getDocumentElement().setStyle("position", "fixed");
                            (!CKEDITOR.env.gecko || !CKEDITOR.env.quirks) && d.getBody().setStyles(s);
                            CKEDITOR.env.ie ? setTimeout(function () {
                                j.$.scrollTo(0, 0)
                            }, 0) : j.$.scrollTo(0, 0);
                            o.setStyle("position", CKEDITOR.env.gecko && CKEDITOR.env.quirks ? "fixed" : "absolute");
                            o.$.offsetLeft;
                            o.setStyles({"z-index": b.config.baseFloatZIndex - 5, left: "0px", top: "0px"});
                            o.addClass("cke_maximized");
                            c();
                            s = o.getDocumentPosition();
                            o.setStyles({left: -1 * s.x + "px", top: -1 * s.y + "px"});
                            CKEDITOR.env.gecko &&
                            f(b)
                        } else if (this.state == CKEDITOR.TRISTATE_ON) {
                            j.removeListener("resize", c);
                            s = [s, o];
                            for (r = 0; r < s.length; r++) {
                                h(s[r], s[r].getCustomData("maximize_saved_styles"));
                                s[r].removeCustomData("maximize_saved_styles")
                            }
                            for (r = b.container; r = r.getParent();) {
                                h(r, r.getCustomData("maximize_saved_styles"));
                                r.removeCustomData("maximize_saved_styles")
                            }
                            CKEDITOR.env.ie ? setTimeout(function () {
                                j.$.scrollTo(m.x, m.y)
                            }, 0) : j.$.scrollTo(m.x, m.y);
                            o.removeClass("cke_maximized");
                            if (CKEDITOR.env.webkit) {
                                o.setStyle("display", "inline");
                                setTimeout(function () {
                                    o.setStyle("display", "block")
                                }, 0)
                            }
                            b.fire("resize")
                        }
                        this.toggleState();
                        if (r = this.uiItems[0]) {
                            s = this.state == CKEDITOR.TRISTATE_OFF ? i.maximize.maximize : i.maximize.minimize;
                            r = CKEDITOR.document.getById(r._.id);
                            r.getChild(1).setHtml(s);
                            r.setAttribute("title", s);
                            r.setAttribute("href", 'javascript:void("' + s + '");')
                        }
                        if (b.mode == "wysiwyg")if (k) {
                            CKEDITOR.env.gecko && f(b);
                            b.getSelection().selectRanges(k);
                            (p = b.getSelection().getStartElement()) && p.scrollIntoView(true)
                        } else j.$.scrollTo(l.x, l.y);
                        else {
                            if (k) {
                                p.selectionStart = k[0];
                                p.selectionEnd = k[1]
                            }
                            p.scrollLeft = l[0];
                            p.scrollTop = l[1]
                        }
                        k = l = null;
                        n = this.state;
                        b.fire("maximize", this.state)
                    }, canUndo: false});
                    b.ui.addButton && b.ui.addButton("Maximize", {label: i.maximize.maximize, command: "maximize", toolbar: "tools,10"});
                    b.on("mode", function () {
                        var a = b.getCommand("maximize");
                        a.setState(a.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : n)
                    }, null, null, 100)
                }
            }})
    }(),CKEDITOR.plugins.add("newpage", {init: function (b) {
        b.addCommand("newpage", {modes: {wysiwyg: 1,
            source: 1}, exec: function (b) {
            var a = this;
            b.setData(b.config.newpage_html || "", function () {
                b.focus();
                setTimeout(function () {
                    b.fire("afterCommandExec", {name: "newpage", command: a});
                    b.selectionChange()
                }, 200)
            })
        }, async: true});
        b.ui.addButton && b.ui.addButton("NewPage", {label: b.lang.newpage.toolbar, command: "newpage", toolbar: "document,20"})
    }}),CKEDITOR.plugins.add("pagebreak", {requires: "fakeobjects", onLoad: function () {
        var b = ["{", "background: url(" + CKEDITOR.getUrl(this.path + "images/pagebreak.gif") + ") no-repeat center center;",
            "clear: both;width:100%; _width:99.9%;border-top: #999999 1px dotted;border-bottom: #999999 1px dotted;padding:0;height: 5px;cursor: default;}"].join("").replace(/;/g, " !important;");
        CKEDITOR.addCss("div.cke_pagebreak" + b)
    }, init: function (b) {
        if (!b.blockless) {
            b.addCommand("pagebreak", CKEDITOR.plugins.pagebreakCmd);
            b.ui.addButton && b.ui.addButton("PageBreak", {label: b.lang.pagebreak.toolbar, command: "pagebreak", toolbar: "insert,70"});
            CKEDITOR.env.opera && b.on("contentDom", function () {
                b.document.on("click",
                    function (c) {
                        c = c.data.getTarget();
                        c.is("div") && c.hasClass("cke_pagebreak") && b.getSelection().selectElement(c)
                    })
            })
        }
    }, afterInit: function (b) {
        var c = b.lang.pagebreak.alt, a = b.dataProcessor, b = a && a.dataFilter;
        (a = a && a.htmlFilter) && a.addRules({attributes: {"class": function (a, b) {
                var c = a.replace("cke_pagebreak", "");
                if (c != a) {
                    var e = CKEDITOR.htmlParser.fragment.fromHtml('<span style="display: none;">&nbsp;</span>');
                    b.children.length = 0;
                    b.add(e);
                    e = b.attributes;
                    delete e["aria-label"];
                    delete e.contenteditable;
                    delete e.title
                }
                return c
            }}},
            5);
        b && b.addRules({elements: {div: function (a) {
            var b = a.attributes, g = b && b.style, e = g && a.children.length == 1 && a.children[0];
            if ((e = e && e.name == "span" && e.attributes.style) && /page-break-after\s*:\s*always/i.test(g) && /display\s*:\s*none/i.test(e)) {
                b.contenteditable = "false";
                b["class"] = "cke_pagebreak";
                b["data-cke-display-name"] = "pagebreak";
                b["aria-label"] = c;
                b.title = c;
                a.children.length = 0
            }
        }}})
    }}),CKEDITOR.plugins.pagebreakCmd = {exec: function (b) {
        var c = b.lang.pagebreak.alt, c = CKEDITOR.dom.element.createFromHtml('<div style="page-break-after: always;"contenteditable="false" title="' +
            c + '" aria-label="' + c + '" data-cke-display-name="pagebreak" class="cke_pagebreak"></div>', b.document);
        b.insertElement(c)
    }, context: "div"},function () {
        function b(a, b, c) {
            var g = CKEDITOR.cleanWord;
            if (g)c(); else {
                a = CKEDITOR.getUrl(a.config.pasteFromWordCleanupFile || b + "filter/default.js");
                CKEDITOR.scriptLoader.load(a, c, null, true)
            }
            return!g
        }

        function c(a) {
            a.data.type = "html"
        }

        CKEDITOR.plugins.add("pastefromword", {requires: "clipboard", init: function (a) {
            var h = 0, f = this.path;
            a.addCommand("pastefromword", {canUndo: false,
                async: true, exec: function (a) {
                    var b = this;
                    h = 1;
                    a.once("beforePaste", c);
                    a.getClipboardData({title: a.lang.pastefromword.title}, function (c) {
                        c && a.fire("paste", {type: "html", dataValue: c.dataValue});
                        a.fire("afterCommandExec", {name: "pastefromword", command: b, returnValue: !!c})
                    })
                }});
            a.ui.addButton && a.ui.addButton("PasteFromWord", {label: a.lang.pastefromword.toolbar, command: "pastefromword", toolbar: "clipboard,50"});
            a.on("pasteState", function (b) {
                a.getCommand("pastefromword").setState(b.data)
            });
            a.on("paste", function (c) {
                var e =
                    c.data, i = e.dataValue;
                if (i && (h || /(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/.test(i))) {
                    var d = b(a, f, function () {
                        if (d)a.fire("paste", e); else if (!a.config.pasteFromWordPromptCleanup || h || confirm(a.lang.pastefromword.confirmCleanup))e.dataValue = CKEDITOR.cleanWord(i, a)
                    });
                    d && c.cancel()
                }
            }, null, null, 3)
        }})
    }(),function () {
        var b = {canUndo: false, async: true, exec: function (c) {
            c.getClipboardData({title: c.lang.pastetext.title}, function (a) {
                a && c.fire("paste", {type: "text", dataValue: a.dataValue});
                c.fire("afterCommandExec",
                    {name: "pastetext", command: b, returnValue: !!a})
            })
        }};
        CKEDITOR.plugins.add("pastetext", {requires: "clipboard", init: function (c) {
            c.addCommand("pastetext", b);
            c.ui.addButton && c.ui.addButton("PasteText", {label: c.lang.pastetext.button, command: "pastetext", toolbar: "clipboard,40"});
            if (c.config.forcePasteAsPlainText)c.on("beforePaste", function (a) {
                if (a.data.type != "html")a.data.type = "text"
            });
            c.on("pasteState", function (a) {
                c.getCommand("pastetext").setState(a.data)
            })
        }})
    }(),function () {
        var b, c = {modes: {wysiwyg: 1, source: 1},
            canUndo: false, readOnly: 1, exec: function (a) {
                var c = a.config, f = c.baseHref ? '<base href="' + c.baseHref + '"/>' : "", g = CKEDITOR.env.isCustomDomain();
                if (c.fullPage)a = a.getData().replace(/<head>/, "$&" + f).replace(/[^>]*(?=<\/title>)/, "$& &mdash; " + a.lang.preview.preview); else {
                    var c = "<body ", e = a.document && a.document.getBody();
                    if (e) {
                        e.getAttribute("id") && (c = c + ('id="' + e.getAttribute("id") + '" '));
                        e.getAttribute("class") && (c = c + ('class="' + e.getAttribute("class") + '" '))
                    }
                    a = a.config.docType + '<html dir="' + a.config.contentsLangDirection +
                        '"><head>' + f + "<title>" + a.lang.preview.preview + "</title>" + CKEDITOR.tools.buildStyleHtml(a.config.contentsCss) + "</head>" + (c + ">") + a.getData() + "</body></html>"
                }
                f = 640;
                c = 420;
                e = 80;
                try {
                    var i = window.screen, f = Math.round(i.width * 0.8), c = Math.round(i.height * 0.7), e = Math.round(i.width * 0.1)
                } catch (d) {
                }
                i = "";
                if (g) {
                    window._cke_htmlToLoad = a;
                    i = 'javascript:void( (function(){document.open();document.domain="' + document.domain + '";document.write( window.opener._cke_htmlToLoad );document.close();window.opener._cke_htmlToLoad = null;})() )'
                }
                if (CKEDITOR.env.gecko) {
                    window._cke_htmlToLoad =
                        a;
                    i = b + "preview.html"
                }
                i = window.open(i, null, "toolbar=yes,location=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes,width=" + f + ",height=" + c + ",left=" + e);
                if (!g && !CKEDITOR.env.gecko) {
                    var j = i.document;
                    j.open();
                    j.write(a);
                    j.close();
                    CKEDITOR.env.webkit && setTimeout(function () {
                        j.body.innerHTML = j.body.innerHTML + ""
                    }, 0)
                }
            }};
        CKEDITOR.plugins.add("preview", {init: function (a) {
            if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                b = this.path;
                a.addCommand("preview", c);
                a.ui.addButton && a.ui.addButton("Preview", {label: a.lang.preview.preview,
                    command: "preview", toolbar: "document,40"})
            }
        }})
    }(),CKEDITOR.plugins.add("print", {init: function (b) {
        if (b.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
            b.addCommand("print", CKEDITOR.plugins.print);
            b.ui.addButton && b.ui.addButton("Print", {label: b.lang.print.toolbar, command: "print", toolbar: "document,50"})
        }
    }}),CKEDITOR.plugins.print = {exec: function (b) {
        CKEDITOR.env.opera || (CKEDITOR.env.gecko ? b.window.$.print() : b.document.$.execCommand("Print"))
    }, canUndo: !1, readOnly: 1, modes: {wysiwyg: !CKEDITOR.env.opera}},CKEDITOR.plugins.add("removeformat",
        {init: function (b) {
            b.addCommand("removeFormat", CKEDITOR.plugins.removeformat.commands.removeformat);
            b.ui.addButton && b.ui.addButton("RemoveFormat", {label: b.lang.removeformat.toolbar, command: "removeFormat", toolbar: "cleanup,10"})
        }}),CKEDITOR.plugins.removeformat = {commands: {removeformat: {exec: function (b) {
        for (var c = b._.removeFormatRegex || (b._.removeFormatRegex = RegExp("^(?:" + b.config.removeFormatTags.replace(/,/g, "|") + ")$", "i")), a = b._.removeAttributes || (b._.removeAttributes = b.config.removeFormatAttributes.split(",")),
                 h = CKEDITOR.plugins.removeformat.filter, f = b.getSelection().getRanges(1), g = f.createIterator(), e; e = g.getNextRange();) {
            e.collapsed || e.enlarge(CKEDITOR.ENLARGE_ELEMENT);
            var i = e.createBookmark(), d = i.startNode, j = i.endNode, k = function (a) {
                for (var d = b.elementPath(a), e = d.elements, f = 1, g; g = e[f]; f++) {
                    if (g.equals(d.block) || g.equals(d.blockLimit))break;
                    c.test(g.getName()) && h(b, g) && a.breakParent(g)
                }
            };
            k(d);
            if (j) {
                k(j);
                for (d = d.getNextSourceNode(true, CKEDITOR.NODE_ELEMENT); d;) {
                    if (d.equals(j))break;
                    k = d.getNextSourceNode(false,
                        CKEDITOR.NODE_ELEMENT);
                    if (!(d.getName() == "img" && d.data("cke-realelement")) && h(b, d))if (c.test(d.getName()))d.remove(1); else {
                        d.removeAttributes(a);
                        b.fire("removeFormatCleanup", d)
                    }
                    d = k
                }
            }
            e.moveToBookmark(i)
        }
        b.forceNextSelectionCheck();
        b.getSelection().selectRanges(f)
    }}}, filter: function (b, c) {
        for (var a = b._.removeFormatFilters || [], h = 0; h < a.length; h++)if (a[h](c) === false)return false;
        return true
    }},CKEDITOR.editor.prototype.addRemoveFormatFilter = function (b) {
        if (!this._.removeFormatFilters)this._.removeFormatFilters =
            [];
        this._.removeFormatFilters.push(b)
    },CKEDITOR.config.removeFormatTags = "b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var",CKEDITOR.config.removeFormatAttributes = "class,style,lang,width,height,align,hspace,valign",CKEDITOR.plugins.add("resize", {init: function (b) {
        var c, a, h, f, g = b.config, e = b.ui.spaceId("resizer"), i = b.element ? b.element.getDirection(1) : "ltr";
        !g.resize_dir && (g.resize_dir = "vertical");
        g.resize_maxWidth == void 0 && (g.resize_maxWidth = 3E3);
        g.resize_maxHeight == void 0 && (g.resize_maxHeight = 3E3);
        g.resize_minWidth == void 0 && (g.resize_minWidth = 750);
        g.resize_minHeight == void 0 && (g.resize_minHeight = 250);
        if (g.resize_enabled !== false) {
            var d = null, j = (g.resize_dir == "both" || g.resize_dir == "horizontal") && g.resize_minWidth != g.resize_maxWidth, k = (g.resize_dir == "both" || g.resize_dir == "vertical") && g.resize_minHeight != g.resize_maxHeight, l = function (d) {
                var e = c, n = a, l = e + (d.data.$.screenX - h) * (i == "rtl" ? -1 : 1), d = n + (d.data.$.screenY - f);
                j && (e = Math.max(g.resize_minWidth, Math.min(l, g.resize_maxWidth)));
                k && (n = Math.max(g.resize_minHeight, Math.min(d, g.resize_maxHeight)));
                b.resize(j ? e : null, n)
            }, m = function () {
                CKEDITOR.document.removeListener("mousemove", l);
                CKEDITOR.document.removeListener("mouseup", m);
                if (b.document) {
                    b.document.removeListener("mousemove", l);
                    b.document.removeListener("mouseup", m)
                }
            }, n = CKEDITOR.tools.addFunction(function (e) {
                d || (d = b.getResizable());
                c = d.$.offsetWidth || 0;
                a = d.$.offsetHeight || 0;
                h = e.screenX;
                f = e.screenY;
                g.resize_minWidth > c && (g.resize_minWidth = c);
                g.resize_minHeight > a && (g.resize_minHeight =
                    a);
                CKEDITOR.document.on("mousemove", l);
                CKEDITOR.document.on("mouseup", m);
                if (b.document) {
                    b.document.on("mousemove", l);
                    b.document.on("mouseup", m)
                }
                e.preventDefault && e.preventDefault()
            });
            b.on("destroy", function () {
                CKEDITOR.tools.removeFunction(n)
            });
            b.on("uiSpace", function (a) {
                if (a.data.space == "bottom") {
                    var c = "";
                    j && !k && (c = " cke_resizer_horizontal");
                    !j && k && (c = " cke_resizer_vertical");
                    var d = '<span id="' + e + '" class="cke_resizer' + c + " cke_resizer_" + i + '" title="' + CKEDITOR.tools.htmlEncode(b.lang.common.resize) +
                        '" onmousedown="CKEDITOR.tools.callFunction(' + n + ', event)">' + (i == "ltr" ? "◢" : "◣") + "</span>";
                    i == "ltr" && c == "ltr" ? a.data.html = a.data.html + d : a.data.html = d + a.data.html
                }
            }, b, null, 100);
            b.on("maximize", function (a) {
                b.ui.space("resizer")[a.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]()
            })
        }
    }}),function () {
        var b = {modes: {wysiwyg: 1, source: 1}, readOnly: 1, exec: function (b) {
            if (b = b.element.$.form)try {
                b.submit()
            } catch (a) {
                b.submit.click && b.submit.click()
            }
        }};
        CKEDITOR.plugins.add("save", {init: function (c) {
            if (c.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE) {
                c.addCommand("save",
                    b).modes = {wysiwyg: !!c.element.$.form};
                c.ui.addButton && c.ui.addButton("Save", {label: c.lang.save.toolbar, command: "save", toolbar: "document,10"})
            }
        }})
    }(),function () {
        CKEDITOR.plugins.add("selectall", {init: function (b) {
            b.addCommand("selectAll", {modes: {wysiwyg: 1, source: 1}, exec: function (b) {
                var a = b.editable();
                if (a.is("textarea")) {
                    b = a.$;
                    if (CKEDITOR.env.ie)b.createTextRange().execCommand("SelectAll"); else {
                        b.selectionStart = 0;
                        b.selectionEnd = b.value.length
                    }
                    b.focus()
                } else {
                    if (a.is("body"))b.document.$.execCommand("SelectAll",
                        false, null); else {
                        var h = b.createRange();
                        h.selectNodeContents(a);
                        h.select()
                    }
                    b.forceNextSelectionCheck();
                    b.selectionChange()
                }
            }, canUndo: false});
            b.ui.addButton && b.ui.addButton("SelectAll", {label: b.lang.selectall.toolbar, command: "selectAll", toolbar: "selection,10"})
        }})
    }(),function () {
        var b = {readOnly: 1, preserveState: true, editorFocus: false, exec: function (b) {
            this.toggleState();
            this.refresh(b)
        }, refresh: function (b) {
            if (b.document) {
                var a = this.state == CKEDITOR.TRISTATE_ON && (b.elementMode != CKEDITOR.ELEMENT_MODE_INLINE ||
                    b.focusManager.hasFocus) ? "attachClass" : "removeClass";
                b.editable()[a]("cke_show_blocks")
            }
        }};
        CKEDITOR.plugins.add("showblocks", {onLoad: function () {
            function b(a) {
                return".%1.%2 p,.%1.%2 div,.%1.%2 pre,.%1.%2 address,.%1.%2 blockquote,.%1.%2 h1,.%1.%2 h2,.%1.%2 h3,.%1.%2 h4,.%1.%2 h5,.%1.%2 h6{background-position: top %3;padding-%3: 8px;}".replace(/%1/g, "cke_show_blocks").replace(/%2/g, "cke_contents_" + a).replace(/%3/g, a == "rtl" ? "right" : "left")
            }

            CKEDITOR.addCss(".%2 p,.%2 div,.%2 pre,.%2 address,.%2 blockquote,.%2 h1,.%2 h2,.%2 h3,.%2 h4,.%2 h5,.%2 h6{background-repeat: no-repeat;border: 1px dotted gray;padding-top: 8px;}.%2 p{%1p.png);}.%2 div{%1div.png);}.%2 pre{%1pre.png);}.%2 address{%1address.png);}.%2 blockquote{%1blockquote.png);}.%2 h1{%1h1.png);}.%2 h2{%1h2.png);}.%2 h3{%1h3.png);}.%2 h4{%1h4.png);}.%2 h5{%1h5.png);}.%2 h6{%1h6.png);}".replace(/%1/g,
                    "background-image: url(" + CKEDITOR.getUrl(this.path) + "images/block_").replace(/%2/g, "cke_show_blocks ") + b("ltr") + b("rtl"))
        }, init: function (c) {
            if (!c.blockless) {
                var a = c.addCommand("showblocks", b);
                a.canUndo = false;
                c.config.startupOutlineBlocks && a.setState(CKEDITOR.TRISTATE_ON);
                c.ui.addButton && c.ui.addButton("ShowBlocks", {label: c.lang.showblocks.toolbar, command: "showblocks", toolbar: "tools,20"});
                c.on("mode", function () {
                    a.state != CKEDITOR.TRISTATE_DISABLED && a.refresh(c)
                });
                if (c.elementMode == CKEDITOR.ELEMENT_MODE_INLINE) {
                    var h =
                        function () {
                            a.refresh(c)
                        };
                    c.on("focus", h);
                    c.on("blur", h)
                }
                c.on("contentDom", function () {
                    a.state != CKEDITOR.TRISTATE_DISABLED && a.refresh(c)
                })
            }
        }})
    }(),function () {
        var b = {preserveState: true, editorFocus: false, readOnly: 1, exec: function (b) {
            this.toggleState();
            this.refresh(b)
        }, refresh: function (b) {
            if (b.document) {
                var a = this.state == CKEDITOR.TRISTATE_ON ? "attachClass" : "removeClass";
                b.editable()[a]("cke_show_borders")
            }
        }};
        CKEDITOR.plugins.add("showborders", {modes: {wysiwyg: 1}, onLoad: function () {
            var b;
            b = (CKEDITOR.env.ie6Compat ?
                [".%1 table.%2,", ".%1 table.%2 td, .%1 table.%2 th", "{", "border : #d3d3d3 1px dotted", "}"] : [".%1 table.%2,", ".%1 table.%2 > tr > td, .%1 table.%2 > tr > th,", ".%1 table.%2 > tbody > tr > td, .%1 table.%2 > tbody > tr > th,", ".%1 table.%2 > thead > tr > td, .%1 table.%2 > thead > tr > th,", ".%1 table.%2 > tfoot > tr > td, .%1 table.%2 > tfoot > tr > th", "{", "border : #d3d3d3 1px dotted", "}"]).join("").replace(/%2/g, "cke_show_border").replace(/%1/g, "cke_show_borders ");
            CKEDITOR.addCss(b)
        }, init: function (c) {
            var a =
                c.addCommand("showborders", b);
            a.canUndo = false;
            c.config.startupShowBorders !== false && a.setState(CKEDITOR.TRISTATE_ON);
            c.on("mode", function () {
                a.state != CKEDITOR.TRISTATE_DISABLED && a.refresh(c)
            }, null, null, 100);
            c.on("contentDom", function () {
                a.state != CKEDITOR.TRISTATE_DISABLED && a.refresh(c)
            });
            c.on("removeFormatCleanup", function (a) {
                a = a.data;
                c.getCommand("showborders").state == CKEDITOR.TRISTATE_ON && (a.is("table") && (!a.hasAttribute("border") || parseInt(a.getAttribute("border"), 10) <= 0)) && a.addClass("cke_show_border")
            })
        },
            afterInit: function (b) {
                var a = b.dataProcessor, b = a && a.dataFilter, a = a && a.htmlFilter;
                b && b.addRules({elements: {table: function (a) {
                    var a = a.attributes, b = a["class"], c = parseInt(a.border, 10);
                    if ((!c || c <= 0) && (!b || b.indexOf("cke_show_border") == -1))a["class"] = (b || "") + " cke_show_border"
                }}});
                a && a.addRules({elements: {table: function (a) {
                    var a = a.attributes, b = a["class"];
                    b && (a["class"] = b.replace("cke_show_border", "").replace(/\s{2}/, " ").replace(/^\s+|\s+$/, ""))
                }}})
            }});
        CKEDITOR.on("dialogDefinition", function (b) {
            var a = b.data.name;
            if (a == "table" || a == "tableProperties") {
                b = b.data.definition;
                a = b.getContents("info").get("txtBorder");
                a.commit = CKEDITOR.tools.override(a.commit, function (a) {
                    return function (b, c) {
                        a.apply(this, arguments);
                        var e = parseInt(this.getValue(), 10);
                        c[!e || e <= 0 ? "addClass" : "removeClass"]("cke_show_border")
                    }
                });
                if (b = (b = b.getContents("advanced")) && b.get("advCSSClasses")) {
                    b.setup = CKEDITOR.tools.override(b.setup, function (a) {
                        return function () {
                            a.apply(this, arguments);
                            this.setValue(this.getValue().replace(/cke_show_border/,
                                ""))
                        }
                    });
                    b.commit = CKEDITOR.tools.override(b.commit, function (a) {
                        return function (b, c) {
                            a.apply(this, arguments);
                            parseInt(c.getAttribute("border"), 10) || c.addClass("cke_show_border")
                        }
                    })
                }
            }
        })
    }(),CKEDITOR.plugins.add("smiley", {requires: "dialog", init: function (b) {
        b.config.smiley_path = b.config.smiley_path || this.path + "images/";
        b.addCommand("smiley", new CKEDITOR.dialogCommand("smiley"));
        b.ui.addButton && b.ui.addButton("Smiley", {label: b.lang.smiley.toolbar, command: "smiley", toolbar: "insert,50"});
        CKEDITOR.dialog.add("smiley",
                this.path + "dialogs/smiley.js")
    }}),CKEDITOR.config.smiley_images = "regular_smile.gif sad_smile.gif wink_smile.gif teeth_smile.gif confused_smile.gif tongue_smile.gif embarrassed_smile.gif omg_smile.gif whatchutalkingabout_smile.gif angry_smile.gif angel_smile.gif shades_smile.gif devil_smile.gif cry_smile.gif lightbulb.gif thumbs_down.gif thumbs_up.gif heart.gif broken_heart.gif kiss.gif envelope.gif".split(" "),CKEDITOR.config.smiley_descriptions = "smiley;sad;wink;laugh;frown;cheeky;blush;surprise;indecision;angry;angel;cool;devil;crying;enlightened;no;yes;heart;broken heart;kiss;mail".split(";"),
    function () {
        CKEDITOR.plugins.add("sourcearea", {init: function (c) {
            function a() {
                this.hide();
                this.setStyle("height", this.getParent().$.clientHeight + "px");
                this.setStyle("width", this.getParent().$.clientWidth + "px");
                this.show()
            }

            if (c.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                var h = CKEDITOR.plugins.sourcearea;
                c.addMode("source", function (f) {
                    var g = c.ui.space("contents").getDocument().createElement("textarea");
                    g.setStyles(CKEDITOR.tools.extend({width: CKEDITOR.env.ie7Compat ? "99%" : "100%", height: "100%", resize: "none",
                        outline: "none", "text-align": "left"}, CKEDITOR.tools.cssVendorPrefix("tab-size", c.config.sourceAreaTabSize || 4)));
                    g.setAttribute("dir", "ltr");
                    g.addClass("cke_source cke_reset cke_enable_context_menu");
                    c.ui.space("contents").append(g);
                    g = c.editable(new b(c, g));
                    g.setData(c.getData(1));
                    if (CKEDITOR.env.ie) {
                        g.attachListener(c, "resize", a, g);
                        g.attachListener(CKEDITOR.document.getWindow(), "resize", a, g);
                        CKEDITOR.tools.setTimeout(a, 0, g)
                    }
                    c.fire("ariaWidget", this);
                    f()
                });
                c.addCommand("source", h.commands.source);
                c.ui.addButton &&
                c.ui.addButton("Source", {label: c.lang.sourcearea.toolbar, command: "source", toolbar: "mode,10"});
                c.on("mode", function () {
                    c.getCommand("source").setState(c.mode == "source" ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
                })
            }
        }});
        var b = CKEDITOR.tools.createClass({base: CKEDITOR.editable, proto: {setData: function (b) {
            this.setValue(b);
            this.editor.fire("dataReady")
        }, getData: function () {
            return this.getValue()
        }, insertHtml: function () {
        }, insertElement: function () {
        }, insertText: function () {
        }, setReadOnly: function (b) {
            this[(b ? "set" :
                "remove") + "Attribute"]("readOnly", "readonly")
        }, detach: function () {
            b.baseProto.detach.call(this);
            this.clearCustomData();
            this.remove()
        }}})
    }(),CKEDITOR.plugins.sourcearea = {commands: {source: {modes: {wysiwyg: 1, source: 1}, editorFocus: !1, readOnly: 1, exec: function (b) {
        b.mode == "wysiwyg" && b.fire("saveSnapshot");
        b.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);
        b.setMode(b.mode == "source" ? "wysiwyg" : "source")
    }, canUndo: !1}}},CKEDITOR.plugins.add("specialchar", {availableLangs: {ca: 1, cs: 1, cy: 1, de: 1, en: 1, eo: 1,
        et: 1, fa: 1, fi: 1, fr: 1, he: 1, hr: 1, it: 1, ku: 1, lv: 1, nb: 1, nl: 1, no: 1, pl: 1, "pt-br": 1, sk: 1, sv: 1, th: 1, tr: 1, ug: 1, "zh-cn": 1}, requires: "dialog", init: function (b) {
        var c = this;
        CKEDITOR.dialog.add("specialchar", this.path + "dialogs/specialchar.js");
        b.addCommand("specialchar", {exec: function () {
            var a = b.langCode, a = c.availableLangs[a] ? a : c.availableLangs[a.replace(/-.*/, "")] ? a.replace(/-.*/, "") : "en";
            CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c.path + "dialogs/lang/" + a + ".js"), function () {
                CKEDITOR.tools.extend(b.lang.specialchar,
                    c.langEntries[a]);
                b.openDialog("specialchar")
            })
        }, modes: {wysiwyg: 1}, canUndo: false});
        b.ui.addButton && b.ui.addButton("SpecialChar", {label: b.lang.specialchar.toolbar, command: "specialchar", toolbar: "insert,50"})
    }}),CKEDITOR.config.specialChars = "! &quot; # $ % &amp; ' ( ) * + - . / 0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~ &euro; &lsquo; &rsquo; &ldquo; &rdquo; &ndash; &mdash; &iexcl; &cent; &pound; &curren; &yen; &brvbar; &sect; &uml; &copy; &ordf; &laquo; &not; &reg; &macr; &deg; &sup2; &sup3; &acute; &micro; &para; &middot; &cedil; &sup1; &ordm; &raquo; &frac14; &frac12; &frac34; &iquest; &Agrave; &Aacute; &Acirc; &Atilde; &Auml; &Aring; &AElig; &Ccedil; &Egrave; &Eacute; &Ecirc; &Euml; &Igrave; &Iacute; &Icirc; &Iuml; &ETH; &Ntilde; &Ograve; &Oacute; &Ocirc; &Otilde; &Ouml; &times; &Oslash; &Ugrave; &Uacute; &Ucirc; &Uuml; &Yacute; &THORN; &szlig; &agrave; &aacute; &acirc; &atilde; &auml; &aring; &aelig; &ccedil; &egrave; &eacute; &ecirc; &euml; &igrave; &iacute; &icirc; &iuml; &eth; &ntilde; &ograve; &oacute; &ocirc; &otilde; &ouml; &divide; &oslash; &ugrave; &uacute; &ucirc; &uuml; &yacute; &thorn; &yuml; &OElig; &oelig; &#372; &#374 &#373 &#375; &sbquo; &#8219; &bdquo; &hellip; &trade; &#9658; &bull; &rarr; &rArr; &hArr; &diams; &asymp;".split(" "),
    function () {
        CKEDITOR.plugins.add("stylescombo", {requires: "richcombo", init: function (b) {
            function c(c) {
                b.getStylesSet(function (d) {
                    if (!g.length) {
                        for (var e, h, l = 0, m = d.length; l < m; l++) {
                            e = d[l];
                            if (!(b.blockless && e.element in CKEDITOR.dtd.$block)) {
                                h = e.name;
                                e = f[h] = new CKEDITOR.style(e);
                                e._name = h;
                                e._.enterMode = a.enterMode;
                                e._.weight = l + (e.type == CKEDITOR.STYLE_OBJECT ? 1 : e.type == CKEDITOR.STYLE_BLOCK ? 2 : 3) * 1E3;
                                g.push(e)
                            }
                        }
                        g.sort(function (a, b) {
                            return a._.weight - b._.weight
                        })
                    }
                    c && c()
                })
            }

            var a = b.config, h = b.lang.stylescombo,
                f = {}, g = [], e;
            b.ui.addRichCombo("Styles", {label: h.label, title: h.panelTitle, toolbar: "styles,10", panel: {css: [CKEDITOR.skin.getPath("editor")].concat(a.contentsCss), multiSelect: true, attributes: {"aria-label": h.panelTitle}}, init: function () {
                e = this;
                c(function () {
                    var a, b, c, f, l, m;
                    l = 0;
                    for (m = g.length; l < m; l++) {
                        a = g[l];
                        b = a._name;
                        f = a.type;
                        if (f != c) {
                            e.startGroup(h["panelTitle" + f]);
                            c = f
                        }
                        e.add(b, a.type == CKEDITOR.STYLE_OBJECT ? b : a.buildPreview(), b)
                    }
                    e.commit()
                })
            }, onClick: function (a) {
                b.focus();
                b.fire("saveSnapshot");
                var a =
                    f[a], c = b.elementPath();
                b[a.checkActive(c) ? "removeStyle" : "applyStyle"](a);
                b.fire("saveSnapshot")
            }, onRender: function () {
                b.on("selectionChange", function (a) {
                    for (var b = this.getValue(), a = a.data.path.elements, c = 0, e = a.length, g; c < e; c++) {
                        g = a[c];
                        for (var h in f)if (f[h].checkElementRemovable(g, true)) {
                            h != b && this.setValue(h);
                            return
                        }
                    }
                    this.setValue("")
                }, this)
            }, onOpen: function () {
                var a = b.getSelection().getSelectedElement(), a = b.elementPath(a), c = [0, 0, 0, 0];
                this.showAll();
                this.unmarkAll();
                for (var e in f) {
                    var g = f[e], l = g.type;
                    if (l == CKEDITOR.STYLE_BLOCK && !a.isContextFor(g.element))this.hideItem(e); else {
                        if (g.checkActive(a))this.mark(e); else if (l == CKEDITOR.STYLE_OBJECT && !g.checkApplicable(a)) {
                            this.hideItem(e);
                            c[l]--
                        }
                        c[l]++
                    }
                }
                c[CKEDITOR.STYLE_BLOCK] || this.hideGroup(h["panelTitle" + CKEDITOR.STYLE_BLOCK]);
                c[CKEDITOR.STYLE_INLINE] || this.hideGroup(h["panelTitle" + CKEDITOR.STYLE_INLINE]);
                c[CKEDITOR.STYLE_OBJECT] || this.hideGroup(h["panelTitle" + CKEDITOR.STYLE_OBJECT])
            }, reset: function () {
                if (e) {
                    delete e._.panel;
                    delete e._.list;
                    e._.committed =
                        0;
                    e._.items = {};
                    e._.state = CKEDITOR.TRISTATE_OFF
                }
                f = {};
                g = [];
                c()
            }});
            b.on("instanceReady", function () {
                c()
            })
        }})
    }(),function () {
        function b(a) {
            return{editorFocus: false, canUndo: false, modes: {wysiwyg: 1}, exec: function (b) {
                if (b.editable().hasFocus) {
                    var c = b.getSelection(), i;
                    if (i = (new CKEDITOR.dom.elementPath(c.getCommonAncestor(), c.root)).contains({td: 1, th: 1}, 1)) {
                        var c = b.createRange(), d = CKEDITOR.tools.tryThese(function () {
                            var b = i.getParent().$.cells[i.$.cellIndex + (a ? -1 : 1)];
                            b.parentNode.parentNode;
                            return b
                        }, function () {
                            var b =
                                i.getParent(), b = b.getAscendant("table").$.rows[b.$.rowIndex + (a ? -1 : 1)];
                            return b.cells[a ? b.cells.length - 1 : 0]
                        });
                        if (!d && !a) {
                            for (var h = i.getAscendant("table").$, d = i.getParent().$.cells, h = new CKEDITOR.dom.element(h.insertRow(-1), b.document), k = 0, l = d.length; k < l; k++) {
                                var m = h.append((new CKEDITOR.dom.element(d[k], b.document)).clone(false, false));
                                !CKEDITOR.env.ie && m.appendBogus()
                            }
                            c.moveToElementEditStart(h)
                        } else if (d) {
                            d = new CKEDITOR.dom.element(d);
                            c.moveToElementEditStart(d);
                            (!c.checkStartOfBlock() || !c.checkEndOfBlock()) &&
                            c.selectNodeContents(d)
                        } else return true;
                        c.select(true);
                        return true
                    }
                }
                return false
            }}
        }

        var c = {editorFocus: false, modes: {wysiwyg: 1, source: 1}}, a = {exec: function (a) {
            a.container.focusNext(true, a.tabIndex)
        }}, h = {exec: function (a) {
            a.container.focusPrevious(true, a.tabIndex)
        }};
        CKEDITOR.plugins.add("tab", {init: function (f) {
            for (var g = f.config.enableTabKeyTools !== false, e = f.config.tabSpaces || 0, i = ""; e--;)i = i + " ";
            if (i)f.on("key", function (a) {
                if (a.data.keyCode == 9) {
                    f.insertHtml(i);
                    a.cancel()
                }
            });
            if (g)f.on("key", function (a) {
                (a.data.keyCode ==
                    9 && f.execCommand("selectNextCell") || a.data.keyCode == CKEDITOR.SHIFT + 9 && f.execCommand("selectPreviousCell")) && a.cancel()
            });
            f.addCommand("blur", CKEDITOR.tools.extend(a, c));
            f.addCommand("blurBack", CKEDITOR.tools.extend(h, c));
            f.addCommand("selectNextCell", b());
            f.addCommand("selectPreviousCell", b(true))
        }})
    }(),CKEDITOR.dom.element.prototype.focusNext = function (b, c) {
        var a = c === void 0 ? this.getTabIndex() : c, h, f, g, e, i, d;
        if (a <= 0)for (i = this.getNextSourceNode(b, CKEDITOR.NODE_ELEMENT); i;) {
            if (i.isVisible() && i.getTabIndex() ===
                0) {
                g = i;
                break
            }
            i = i.getNextSourceNode(false, CKEDITOR.NODE_ELEMENT)
        } else for (i = this.getDocument().getBody().getFirst(); i = i.getNextSourceNode(false, CKEDITOR.NODE_ELEMENT);) {
            if (!h)if (!f && i.equals(this)) {
                f = true;
                if (b) {
                    if (!(i = i.getNextSourceNode(true, CKEDITOR.NODE_ELEMENT)))break;
                    h = 1
                }
            } else f && !this.contains(i) && (h = 1);
            if (i.isVisible() && !((d = i.getTabIndex()) < 0)) {
                if (h && d == a) {
                    g = i;
                    break
                }
                if (d > a && (!g || !e || d < e)) {
                    g = i;
                    e = d
                } else if (!g && d === 0) {
                    g = i;
                    e = d
                }
            }
        }
        g && g.focus()
    },CKEDITOR.dom.element.prototype.focusPrevious = function (b, c) {
        for (var a = c === void 0 ? this.getTabIndex() : c, h, f, g, e = 0, i, d = this.getDocument().getBody().getLast(); d = d.getPreviousSourceNode(false, CKEDITOR.NODE_ELEMENT);) {
            if (!h)if (!f && d.equals(this)) {
                f = true;
                if (b) {
                    if (!(d = d.getPreviousSourceNode(true, CKEDITOR.NODE_ELEMENT)))break;
                    h = 1
                }
            } else f && !this.contains(d) && (h = 1);
            if (d.isVisible() && !((i = d.getTabIndex()) < 0))if (a <= 0) {
                if (h && i === 0) {
                    g = d;
                    break
                }
                if (i > e) {
                    g = d;
                    e = i
                }
            } else {
                if (h && i == a) {
                    g = d;
                    break
                }
                if (i < a && (!g || i > e)) {
                    g = d;
                    e = i
                }
            }
        }
        g && g.focus()
    },CKEDITOR.plugins.add("table", {requires: "dialog",
        init: function (b) {
            function c(a) {
                return CKEDITOR.tools.extend(a || {}, {contextSensitive: 1, refresh: function (a, b) {
                    this.setState(b.contains("table", 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
                }})
            }

            if (!b.blockless) {
                var a = b.lang.table;
                b.addCommand("table", new CKEDITOR.dialogCommand("table", {context: "table"}));
                b.addCommand("tableProperties", new CKEDITOR.dialogCommand("tableProperties", c()));
                b.addCommand("tableDelete", c({exec: function (a) {
                    var b = a.elementPath().contains("table", 1);
                    if (b) {
                        var c = b.getParent();
                        c.getChildCount() == 1 && !c.is("body", "td", "th") && (b = c);
                        a = a.createRange();
                        a.moveToPosition(b, CKEDITOR.POSITION_BEFORE_START);
                        b.remove();
                        a.select()
                    }
                }}));
                b.ui.addButton && b.ui.addButton("Table", {label: a.toolbar, command: "table", toolbar: "insert,30"});
                CKEDITOR.dialog.add("table", this.path + "dialogs/table.js");
                CKEDITOR.dialog.add("tableProperties", this.path + "dialogs/table.js");
                b.addMenuItems && b.addMenuItems({table: {label: a.menu, command: "tableProperties", group: "table", order: 5}, tabledelete: {label: a.deleteTable,
                    command: "tableDelete", group: "table", order: 1}});
                b.on("doubleclick", function (a) {
                    if (a.data.element.is("table"))a.data.dialog = "tableProperties"
                });
                b.contextMenu && b.contextMenu.addListener(function () {
                    return{tabledelete: CKEDITOR.TRISTATE_OFF, table: CKEDITOR.TRISTATE_OFF}
                })
            }
        }}),function () {
        function b(a) {
            function b(a) {
                if (!(c.length > 0) && a.type == CKEDITOR.NODE_ELEMENT && m.test(a.getName()) && !a.getCustomData("selected_cell")) {
                    CKEDITOR.dom.element.setMarker(d, a, "selected_cell", true);
                    c.push(a)
                }
            }

            for (var a = a.getRanges(),
                     c = [], d = {}, e = 0; e < a.length; e++) {
                var f = a[e];
                if (f.collapsed) {
                    f = f.getCommonAncestor();
                    (f = f.getAscendant("td", true) || f.getAscendant("th", true)) && c.push(f)
                } else {
                    var f = new CKEDITOR.dom.walker(f), g;
                    for (f.guard = b; g = f.next();)if (g.type != CKEDITOR.NODE_ELEMENT || !g.is(CKEDITOR.dtd.table))if ((g = g.getAscendant("td", true) || g.getAscendant("th", true)) && !g.getCustomData("selected_cell")) {
                        CKEDITOR.dom.element.setMarker(d, g, "selected_cell", true);
                        c.push(g)
                    }
                }
            }
            CKEDITOR.dom.element.clearAllMarkers(d);
            return c
        }

        function c(a, c) {
            for (var d = b(a), e = d[0], f = e.getAscendant("table"), e = e.getDocument(), g = d[0].getParent(), i = g.$.rowIndex, d = d[d.length - 1], h = d.getParent().$.rowIndex + d.$.rowSpan - 1, d = new CKEDITOR.dom.element(f.$.rows[h]), i = c ? i : h, g = c ? g : d, d = CKEDITOR.tools.buildTableMap(f), f = d[i], i = c ? d[i - 1] : d[i + 1], d = d[0].length, e = e.createElement("tr"), h = 0; f[h] && h < d; h++) {
                var j;
                if (f[h].rowSpan > 1 && i && f[h] == i[h]) {
                    j = f[h];
                    j.rowSpan = j.rowSpan + 1
                } else {
                    j = (new CKEDITOR.dom.element(f[h])).clone();
                    j.removeAttribute("rowSpan");
                    !CKEDITOR.env.ie && j.appendBogus();
                    e.append(j);
                    j = j.$
                }
                h = h + (j.colSpan - 1)
            }
            c ? e.insertBefore(g) : e.insertAfter(g)
        }

        function a(c) {
            if (c instanceof CKEDITOR.dom.selection) {
                for (var d = b(c), e = d[0].getAscendant("table"), f = CKEDITOR.tools.buildTableMap(e), c = d[0].getParent().$.rowIndex, d = d[d.length - 1], g = d.getParent().$.rowIndex + d.$.rowSpan - 1, d = [], i = c; i <= g; i++) {
                    for (var h = f[i], j = new CKEDITOR.dom.element(e.$.rows[i]), k = 0; k < h.length; k++) {
                        var l = new CKEDITOR.dom.element(h[k]), m = l.getParent().$.rowIndex;
                        if (l.$.rowSpan == 1)l.remove(); else {
                            l.$.rowSpan = l.$.rowSpan -
                                1;
                            if (m == i) {
                                m = f[i + 1];
                                m[k - 1] ? l.insertAfter(new CKEDITOR.dom.element(m[k - 1])) : (new CKEDITOR.dom.element(e.$.rows[i + 1])).append(l, 1)
                            }
                        }
                        k = k + (l.$.colSpan - 1)
                    }
                    d.push(j)
                }
                f = e.$.rows;
                e = new CKEDITOR.dom.element(f[g + 1] || (c > 0 ? f[c - 1] : null) || e.$.parentNode);
                for (i = d.length; i >= 0; i--)a(d[i]);
                return e
            }
            if (c instanceof CKEDITOR.dom.element) {
                e = c.getAscendant("table");
                e.$.rows.length == 1 ? e.remove() : c.remove()
            }
            return null
        }

        function h(a, b) {
            for (var c = b ? Infinity : 0, d = 0; d < a.length; d++) {
                var e;
                e = a[d];
                for (var f = b, g = e.getParent().$.cells,
                         i = 0, h = 0; h < g.length; h++) {
                    var j = g[h], i = i + (f ? 1 : j.colSpan);
                    if (j == e.$)break
                }
                e = i - 1;
                if (b ? e < c : e > c)c = e
            }
            return c
        }

        function f(a, c) {
            for (var d = b(a), e = d[0].getAscendant("table"), f = h(d, 1), d = h(d), f = c ? f : d, g = CKEDITOR.tools.buildTableMap(e), e = [], d = [], i = g.length, j = 0; j < i; j++) {
                e.push(g[j][f]);
                d.push(c ? g[j][f - 1] : g[j][f + 1])
            }
            for (j = 0; j < i; j++)if (e[j]) {
                if (e[j].colSpan > 1 && d[j] == e[j]) {
                    f = e[j];
                    f.colSpan = f.colSpan + 1
                } else {
                    f = (new CKEDITOR.dom.element(e[j])).clone();
                    f.removeAttribute("colSpan");
                    !CKEDITOR.env.ie && f.appendBogus();
                    f[c ?
                        "insertBefore" : "insertAfter"].call(f, new CKEDITOR.dom.element(e[j]));
                    f = f.$
                }
                j = j + (f.rowSpan - 1)
            }
        }

        function g(a, b) {
            var c = a.getStartElement();
            if (c = c.getAscendant("td", 1) || c.getAscendant("th", 1)) {
                var d = c.clone();
                CKEDITOR.env.ie || d.appendBogus();
                b ? d.insertBefore(c) : d.insertAfter(c)
            }
        }

        function e(a) {
            if (a instanceof CKEDITOR.dom.selection) {
                var a = b(a), c = a[0] && a[0].getAscendant("table"), d;
                a:{
                    var f = 0;
                    d = a.length - 1;
                    for (var g = {}, h, j; h = a[f++];)CKEDITOR.dom.element.setMarker(g, h, "delete_cell", true);
                    for (f = 0; h = a[f++];)if ((j =
                        h.getPrevious()) && !j.getCustomData("delete_cell") || (j = h.getNext()) && !j.getCustomData("delete_cell")) {
                        CKEDITOR.dom.element.clearAllMarkers(g);
                        d = j;
                        break a
                    }
                    CKEDITOR.dom.element.clearAllMarkers(g);
                    j = a[0].getParent();
                    if (j = j.getPrevious())d = j.getLast(); else {
                        j = a[d].getParent();
                        d = (j = j.getNext()) ? j.getChild(0) : null
                    }
                }
                for (j = a.length - 1; j >= 0; j--)e(a[j]);
                d ? i(d, true) : c && c.remove()
            } else if (a instanceof CKEDITOR.dom.element) {
                c = a.getParent();
                c.getChildCount() == 1 ? c.remove() : a.remove()
            }
        }

        function i(a, b) {
            var c = new CKEDITOR.dom.range(a.getDocument());
            if (!c["moveToElementEdit" + (b ? "End" : "Start")](a)) {
                c.selectNodeContents(a);
                c.collapse(b ? false : true)
            }
            c.select(true)
        }

        function d(a, b, c) {
            a = a[b];
            if (typeof c == "undefined")return a;
            for (b = 0; a && b < a.length; b++) {
                if (c.is && a[b] == c.$)return b;
                if (b == c)return new CKEDITOR.dom.element(a[b])
            }
            return c.is ? -1 : null
        }

        function j(a, c, e) {
            var f = b(a), g;
            if ((c ? f.length != 1 : f.length < 2) || (g = a.getCommonAncestor()) && g.type == CKEDITOR.NODE_ELEMENT && g.is("table"))return false;
            var i, a = f[0];
            g = a.getAscendant("table");
            var h = CKEDITOR.tools.buildTableMap(g),
                j = h.length, k = h[0].length, l = a.getParent().$.rowIndex, m = d(h, l, a);
            if (c) {
                var u;
                try {
                    var B = parseInt(a.getAttribute("rowspan"), 10) || 1;
                    i = parseInt(a.getAttribute("colspan"), 10) || 1;
                    u = h[c == "up" ? l - B : c == "down" ? l + B : l][c == "left" ? m - i : c == "right" ? m + i : m]
                } catch (z) {
                    return false
                }
                if (!u || a.$ == u)return false;
                f[c == "up" || c == "left" ? "unshift" : "push"](new CKEDITOR.dom.element(u))
            }
            for (var c = a.getDocument(), y = l, B = u = 0, C = !e && new CKEDITOR.dom.documentFragment(c), D = 0, c = 0; c < f.length; c++) {
                i = f[c];
                var F = i.getParent(), E = i.getFirst(), K = i.$.colSpan,
                    I = i.$.rowSpan, F = F.$.rowIndex, G = d(h, F, i), D = D + K * I, B = Math.max(B, G - m + K);
                u = Math.max(u, F - l + I);
                if (!e) {
                    K = i;
                    (I = K.getBogus()) && I.remove();
                    K.trim();
                    if (i.getChildren().count()) {
                        if (F != y && E && (!E.isBlockBoundary || !E.isBlockBoundary({br: 1})))(y = C.getLast(CKEDITOR.dom.walker.whitespaces(true))) && (!y.is || !y.is("br")) && C.append("br");
                        i.moveChildren(C)
                    }
                    c ? i.remove() : i.setHtml("")
                }
                y = F
            }
            if (e)return u * B == D;
            C.moveChildren(a);
            CKEDITOR.env.ie || a.appendBogus();
            B >= k ? a.removeAttribute("rowSpan") : a.$.rowSpan = u;
            u >= j ? a.removeAttribute("colSpan") :
                a.$.colSpan = B;
            e = new CKEDITOR.dom.nodeList(g.$.rows);
            f = e.count();
            for (c = f - 1; c >= 0; c--) {
                g = e.getItem(c);
                if (!g.$.cells.length) {
                    g.remove();
                    f++
                }
            }
            return a
        }

        function k(a, c) {
            var e = b(a);
            if (e.length > 1)return false;
            if (c)return true;
            var e = e[0], f = e.getParent(), g = f.getAscendant("table"), i = CKEDITOR.tools.buildTableMap(g), h = f.$.rowIndex, j = d(i, h, e), k = e.$.rowSpan, l;
            if (k > 1) {
                l = Math.ceil(k / 2);
                for (var k = Math.floor(k / 2), f = h + l, g = new CKEDITOR.dom.element(g.$.rows[f]), i = d(i, f), m, f = e.clone(), h = 0; h < i.length; h++) {
                    m = i[h];
                    if (m.parentNode ==
                        g.$ && h > j) {
                        f.insertBefore(new CKEDITOR.dom.element(m));
                        break
                    } else m = null
                }
                m || g.append(f, true)
            } else {
                k = l = 1;
                g = f.clone();
                g.insertAfter(f);
                g.append(f = e.clone());
                m = d(i, h);
                for (j = 0; j < m.length; j++)m[j].rowSpan++
            }
            CKEDITOR.env.ie || f.appendBogus();
            e.$.rowSpan = l;
            f.$.rowSpan = k;
            l == 1 && e.removeAttribute("rowSpan");
            k == 1 && f.removeAttribute("rowSpan");
            return f
        }

        function l(a, c) {
            var e = b(a);
            if (e.length > 1)return false;
            if (c)return true;
            var e = e[0], f = e.getParent(), g = f.getAscendant("table"), g = CKEDITOR.tools.buildTableMap(g), i =
                d(g, f.$.rowIndex, e), h = e.$.colSpan;
            if (h > 1) {
                f = Math.ceil(h / 2);
                h = Math.floor(h / 2)
            } else {
                for (var h = f = 1, j = [], k = 0; k < g.length; k++) {
                    var l = g[k];
                    j.push(l[i]);
                    l[i].rowSpan > 1 && (k = k + (l[i].rowSpan - 1))
                }
                for (g = 0; g < j.length; g++)j[g].colSpan++
            }
            g = e.clone();
            g.insertAfter(e);
            CKEDITOR.env.ie || g.appendBogus();
            e.$.colSpan = f;
            g.$.colSpan = h;
            f == 1 && e.removeAttribute("colSpan");
            h == 1 && g.removeAttribute("colSpan");
            return g
        }

        var m = /^(?:td|th)$/;
        CKEDITOR.plugins.tabletools = {requires: "table,dialog,contextmenu", init: function (d) {
            function h(a) {
                return CKEDITOR.tools.extend(a ||
                {}, {contextSensitive: 1, refresh: function (a, b) {
                    this.setState(b.contains({td: 1, th: 1}, 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
                }})
            }

            var m = d.lang.table;
            d.addCommand("cellProperties", new CKEDITOR.dialogCommand("cellProperties", h()));
            CKEDITOR.dialog.add("cellProperties", this.path + "dialogs/tableCell.js");
            d.addCommand("rowDelete", h({exec: function (b) {
                b = b.getSelection();
                i(a(b))
            }}));
            d.addCommand("rowInsertBefore", h({exec: function (a) {
                a = a.getSelection();
                c(a, true)
            }}));
            d.addCommand("rowInsertAfter", h({exec: function (a) {
                a =
                    a.getSelection();
                c(a)
            }}));
            d.addCommand("columnDelete", h({exec: function (a) {
                for (var a = a.getSelection(), a = b(a), c = a[0], d = a[a.length - 1], a = c.getAscendant("table"), e = CKEDITOR.tools.buildTableMap(a), f, g, h = [], j = 0, k = e.length; j < k; j++)for (var l = 0, m = e[j].length; l < m; l++) {
                    e[j][l] == c.$ && (f = l);
                    e[j][l] == d.$ && (g = l)
                }
                for (j = f; j <= g; j++)for (l = 0; l < e.length; l++) {
                    d = e[l];
                    c = new CKEDITOR.dom.element(a.$.rows[l]);
                    d = new CKEDITOR.dom.element(d[j]);
                    if (d.$) {
                        d.$.colSpan == 1 ? d.remove() : d.$.colSpan = d.$.colSpan - 1;
                        l = l + (d.$.rowSpan - 1);
                        c.$.cells.length ||
                        h.push(c)
                    }
                }
                g = a.$.rows[0] && a.$.rows[0].cells;
                f = new CKEDITOR.dom.element(g[f] || (f ? g[f - 1] : a.$.parentNode));
                h.length == k && a.remove();
                f && i(f, true)
            }}));
            d.addCommand("columnInsertBefore", h({exec: function (a) {
                a = a.getSelection();
                f(a, true)
            }}));
            d.addCommand("columnInsertAfter", h({exec: function (a) {
                a = a.getSelection();
                f(a)
            }}));
            d.addCommand("cellDelete", h({exec: function (a) {
                a = a.getSelection();
                e(a)
            }}));
            d.addCommand("cellMerge", h({exec: function (a) {
                i(j(a.getSelection()), true)
            }}));
            d.addCommand("cellMergeRight", h({exec: function (a) {
                i(j(a.getSelection(),
                    "right"), true)
            }}));
            d.addCommand("cellMergeDown", h({exec: function (a) {
                i(j(a.getSelection(), "down"), true)
            }}));
            d.addCommand("cellVerticalSplit", h({exec: function (a) {
                i(k(a.getSelection()))
            }}));
            d.addCommand("cellHorizontalSplit", h({exec: function (a) {
                i(l(a.getSelection()))
            }}));
            d.addCommand("cellInsertBefore", h({exec: function (a) {
                a = a.getSelection();
                g(a, true)
            }}));
            d.addCommand("cellInsertAfter", h({exec: function (a) {
                a = a.getSelection();
                g(a)
            }}));
            d.addMenuItems && d.addMenuItems({tablecell: {label: m.cell.menu, group: "tablecell",
                order: 1, getItems: function () {
                    var a = d.getSelection(), c = b(a);
                    return{tablecell_insertBefore: CKEDITOR.TRISTATE_OFF, tablecell_insertAfter: CKEDITOR.TRISTATE_OFF, tablecell_delete: CKEDITOR.TRISTATE_OFF, tablecell_merge: j(a, null, true) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, tablecell_merge_right: j(a, "right", true) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, tablecell_merge_down: j(a, "down", true) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, tablecell_split_vertical: k(a, true) ? CKEDITOR.TRISTATE_OFF :
                        CKEDITOR.TRISTATE_DISABLED, tablecell_split_horizontal: l(a, true) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, tablecell_properties: c.length > 0 ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED}
                }}, tablecell_insertBefore: {label: m.cell.insertBefore, group: "tablecell", command: "cellInsertBefore", order: 5}, tablecell_insertAfter: {label: m.cell.insertAfter, group: "tablecell", command: "cellInsertAfter", order: 10}, tablecell_delete: {label: m.cell.deleteCell, group: "tablecell", command: "cellDelete", order: 15}, tablecell_merge: {label: m.cell.merge,
                group: "tablecell", command: "cellMerge", order: 16}, tablecell_merge_right: {label: m.cell.mergeRight, group: "tablecell", command: "cellMergeRight", order: 17}, tablecell_merge_down: {label: m.cell.mergeDown, group: "tablecell", command: "cellMergeDown", order: 18}, tablecell_split_horizontal: {label: m.cell.splitHorizontal, group: "tablecell", command: "cellHorizontalSplit", order: 19}, tablecell_split_vertical: {label: m.cell.splitVertical, group: "tablecell", command: "cellVerticalSplit", order: 20}, tablecell_properties: {label: m.cell.title,
                group: "tablecellproperties", command: "cellProperties", order: 21}, tablerow: {label: m.row.menu, group: "tablerow", order: 1, getItems: function () {
                return{tablerow_insertBefore: CKEDITOR.TRISTATE_OFF, tablerow_insertAfter: CKEDITOR.TRISTATE_OFF, tablerow_delete: CKEDITOR.TRISTATE_OFF}
            }}, tablerow_insertBefore: {label: m.row.insertBefore, group: "tablerow", command: "rowInsertBefore", order: 5}, tablerow_insertAfter: {label: m.row.insertAfter, group: "tablerow", command: "rowInsertAfter", order: 10}, tablerow_delete: {label: m.row.deleteRow,
                group: "tablerow", command: "rowDelete", order: 15}, tablecolumn: {label: m.column.menu, group: "tablecolumn", order: 1, getItems: function () {
                return{tablecolumn_insertBefore: CKEDITOR.TRISTATE_OFF, tablecolumn_insertAfter: CKEDITOR.TRISTATE_OFF, tablecolumn_delete: CKEDITOR.TRISTATE_OFF}
            }}, tablecolumn_insertBefore: {label: m.column.insertBefore, group: "tablecolumn", command: "columnInsertBefore", order: 5}, tablecolumn_insertAfter: {label: m.column.insertAfter, group: "tablecolumn", command: "columnInsertAfter", order: 10}, tablecolumn_delete: {label: m.column.deleteColumn,
                group: "tablecolumn", command: "columnDelete", order: 15}});
            d.contextMenu && d.contextMenu.addListener(function (a, b, c) {
                return(a = c.contains({td: 1, th: 1}, 1)) && !a.isReadOnly() ? {tablecell: CKEDITOR.TRISTATE_OFF, tablerow: CKEDITOR.TRISTATE_OFF, tablecolumn: CKEDITOR.TRISTATE_OFF} : null
            })
        }, getSelectedCells: b};
        CKEDITOR.plugins.add("tabletools", CKEDITOR.plugins.tabletools)
    }(),CKEDITOR.tools.buildTableMap = function (b) {
        for (var b = b.$.rows, c = -1, a = [], h = 0; h < b.length; h++) {
            c++;
            !a[c] && (a[c] = []);
            for (var f = -1, g = 0; g < b[h].cells.length; g++) {
                var e =
                    b[h].cells[g];
                for (f++; a[c][f];)f++;
                for (var i = isNaN(e.colSpan) ? 1 : e.colSpan, e = isNaN(e.rowSpan) ? 1 : e.rowSpan, d = 0; d < e; d++) {
                    a[c + d] || (a[c + d] = []);
                    for (var j = 0; j < i; j++)a[c + d][f + j] = b[h].cells[g]
                }
                f = f + (i - 1)
            }
        }
        return a
    },function () {
        CKEDITOR.plugins.add("templates", {requires: "dialog", init: function (a) {
            CKEDITOR.dialog.add("templates", CKEDITOR.getUrl(this.path + "dialogs/templates.js"));
            a.addCommand("templates", new CKEDITOR.dialogCommand("templates"));
            a.ui.addButton && a.ui.addButton("Templates", {label: a.lang.templates.button,
                command: "templates", toolbar: "doctools,10"})
        }});
        var b = {}, c = {};
        CKEDITOR.addTemplates = function (a, c) {
            b[a] = c
        };
        CKEDITOR.getTemplates = function (a) {
            return b[a]
        };
        CKEDITOR.loadTemplates = function (a, b) {
            for (var f = [], g = 0, e = a.length; g < e; g++)if (!c[a[g]]) {
                f.push(a[g]);
                c[a[g]] = 1
            }
            f.length ? CKEDITOR.scriptLoader.load(f, b) : setTimeout(b, 0)
        }
    }(),CKEDITOR.config.templates_files = [CKEDITOR.getUrl("plugins/templates/templates/default.js")],CKEDITOR.config.templates_replaceContent = !0,function () {
        function b(a) {
            function b() {
                for (var d =
                    e(), g = CKEDITOR.tools.clone(a.config.toolbarGroups) || c(a), h = 0; h < g.length; h++) {
                    var m = g[h];
                    if (m != "/") {
                        typeof m == "string" && (m = g[h] = {name: m});
                        var n, o = m.groups;
                        if (o)for (var s = 0; s < o.length; s++) {
                            n = o[s];
                            (n = d[n]) && i(m, n)
                        }
                        (n = d[m.name]) && i(m, n)
                    }
                }
                return g
            }

            function e() {
                var b = {}, c, d, e;
                for (c in a.ui.items) {
                    d = a.ui.items[c];
                    e = d.toolbar || "others";
                    e = e.split(",");
                    d = e[0];
                    e = parseInt(e[1] || -1, 10);
                    b[d] || (b[d] = []);
                    b[d].push({name: c, order: e})
                }
                for (d in b)b[d] = b[d].sort(function (a, b) {
                    return a.order == b.order ? 0 : b.order < 0 ? -1 : a.order <
                        0 ? 1 : a.order < b.order ? -1 : 1
                });
                return b
            }

            function i(a, b) {
                if (b.length) {
                    a.items ? a.items.push("-") : a.items = [];
                    for (var c; c = b.shift();)a.items.push(c.name)
                }
            }

            var d = a.config.toolbar;
            typeof d == "string" && (d = a.config["toolbar_" + d]);
            return a.toolbar = d || b()
        }

        function c(a) {
            return a._.toolbarGroups || (a._.toolbarGroups = [
                {name: "document", groups: ["mode", "document", "doctools"]},
                {name: "clipboard", groups: ["clipboard", "undo"]},
                {name: "editing", groups: ["find", "selection", "spellchecker"]},
                {name: "forms"},
                "/",
                {name: "basicstyles",
                    groups: ["basicstyles", "cleanup"]},
                {name: "paragraph", groups: ["list", "indent", "blocks", "align"]},
                {name: "links"},
                {name: "insert"},
                "/",
                {name: "styles"},
                {name: "colors"},
                {name: "tools"},
                {name: "others"},
                {name: "about"}
            ])
        }

        var a = function () {
            this.toolbars = [];
            this.focusCommandExecuted = false
        };
        a.prototype.focus = function () {
            for (var a = 0, b; b = this.toolbars[a++];)for (var c = 0, i; i = b.items[c++];)if (i.focus) {
                i.focus();
                return
            }
        };
        var h = {modes: {wysiwyg: 1, source: 1}, readOnly: 1, exec: function (a) {
            if (a.toolbox) {
                a.toolbox.focusCommandExecuted =
                    true;
                CKEDITOR.env.ie || CKEDITOR.env.air ? setTimeout(function () {
                    a.toolbox.focus()
                }, 100) : a.toolbox.focus()
            }
        }};
        CKEDITOR.plugins.add("toolbar", {requires: "button", init: function (c) {
            var g, e = function (a, b) {
                var h, k = c.lang.dir == "rtl", l = c.config.toolbarGroupCycling, l = l === void 0 || l;
                switch (b) {
                    case 9:
                    case CKEDITOR.SHIFT + 9:
                        for (; !h || !h.items.length;) {
                            h = b == 9 ? (h ? h.next : a.toolbar.next) || c.toolbox.toolbars[0] : (h ? h.previous : a.toolbar.previous) || c.toolbox.toolbars[c.toolbox.toolbars.length - 1];
                            if (h.items.length)for (a = h.items[g ?
                                h.items.length - 1 : 0]; a && !a.focus;)(a = g ? a.previous : a.next) || (h = 0)
                        }
                        a && a.focus();
                        return false;
                    case k ? 37 : 39:
                    case 40:
                        h = a;
                        do {
                            h = h.next;
                            !h && l && (h = a.toolbar.items[0])
                        } while (h && !h.focus);
                        h ? h.focus() : e(a, 9);
                        return false;
                    case k ? 39 : 37:
                    case 38:
                        h = a;
                        do {
                            h = h.previous;
                            !h && l && (h = a.toolbar.items[a.toolbar.items.length - 1])
                        } while (h && !h.focus);
                        if (h)h.focus(); else {
                            g = 1;
                            e(a, CKEDITOR.SHIFT + 9);
                            g = 0
                        }
                        return false;
                    case 27:
                        c.focus();
                        return false;
                    case 13:
                    case 32:
                        a.execute();
                        return false
                }
                return true
            };
            c.on("uiSpace", function (g) {
                if (g.data.space ==
                    c.config.toolbarLocation) {
                    c.toolbox = new a;
                    var d = CKEDITOR.tools.getNextId(), h = c.config.removeButtons, h = h && h.split(","), k = ['<span id="', d, '" class="cke_voice_label">', c.lang.toolbar.toolbars, "</span>", '<span id="' + c.ui.spaceId("toolbox") + '" class="cke_toolbox" role="group" aria-labelledby="', d, '" onmousedown="return false;">'], d = c.config.toolbarStartupExpanded !== false, l, m;
                    c.config.toolbarCanCollapse && c.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && k.push('<span class="cke_toolbox_main"' + (d ? ">" : ' style="display:none">'));
                    for (var n = c.toolbox.toolbars, o = b(c), s = 0; s < o.length; s++) {
                        var r, p = 0, t, x = o[s], A;
                        if (x) {
                            if (l) {
                                k.push("</span>");
                                m = l = 0
                            }
                            if (x === "/")k.push('<span class="cke_toolbar_break"></span>'); else {
                                A = x.items || x;
                                for (var v = 0; v < A.length; v++) {
                                    var w;
                                    w = A[v];
                                    var q;
                                    if (!(h && CKEDITOR.tools.indexOf(h, w) >= 0))if (w = c.ui.create(w))if (w.type == CKEDITOR.UI_SEPARATOR)m = l && w; else {
                                        q = w.canGroup !== false;
                                        if (!p) {
                                            r = CKEDITOR.tools.getNextId();
                                            p = {id: r, items: []};
                                            t = x.name && (c.lang.toolbar.toolbarGroups[x.name] || x.name);
                                            k.push('<span id="', r, '" class="cke_toolbar"',
                                                t ? ' aria-labelledby="' + r + '_label"' : "", ' role="toolbar">');
                                            t && k.push('<span id="', r, '_label" class="cke_voice_label">', t, "</span>");
                                            k.push('<span class="cke_toolbar_start"></span>');
                                            var u = n.push(p) - 1;
                                            if (u > 0) {
                                                p.previous = n[u - 1];
                                                p.previous.next = p
                                            }
                                        }
                                        if (q) {
                                            if (!l) {
                                                k.push('<span class="cke_toolgroup" role="presentation">');
                                                l = 1
                                            }
                                        } else if (l) {
                                            k.push("</span>");
                                            l = 0
                                        }
                                        r = function (a) {
                                            a = a.render(c, k);
                                            u = p.items.push(a) - 1;
                                            if (u > 0) {
                                                a.previous = p.items[u - 1];
                                                a.previous.next = a
                                            }
                                            a.toolbar = p;
                                            a.onkey = e;
                                            a.onfocus = function () {
                                                c.toolbox.focusCommandExecuted ||
                                                c.focus()
                                            }
                                        };
                                        if (m) {
                                            r(m);
                                            m = 0
                                        }
                                        r(w)
                                    }
                                }
                                if (l) {
                                    k.push("</span>");
                                    m = l = 0
                                }
                                p && k.push('<span class="cke_toolbar_end"></span></span>')
                            }
                        }
                    }
                    c.config.toolbarCanCollapse && k.push("</span>");
                    if (c.config.toolbarCanCollapse && c.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                        var B = CKEDITOR.tools.addFunction(function () {
                            c.execCommand("toolbarCollapse")
                        });
                        c.on("destroy", function () {
                            CKEDITOR.tools.removeFunction(B)
                        });
                        c.addCommand("toolbarCollapse", {readOnly: 1, exec: function (a) {
                            var b = a.ui.space("toolbar_collapser"), c = b.getPrevious(),
                                d = a.ui.space("contents"), e = c.getParent(), f = parseInt(d.$.style.height, 10), g = e.$.offsetHeight, i = b.hasClass("cke_toolbox_collapser_min");
                            if (i) {
                                c.show();
                                b.removeClass("cke_toolbox_collapser_min");
                                b.setAttribute("title", a.lang.toolbar.toolbarCollapse)
                            } else {
                                c.hide();
                                b.addClass("cke_toolbox_collapser_min");
                                b.setAttribute("title", a.lang.toolbar.toolbarExpand)
                            }
                            b.getFirst().setText(i ? "▲" : "◀");
                            d.setStyle("height", f - (e.$.offsetHeight - g) + "px");
                            a.fire("resize")
                        }, modes: {wysiwyg: 1, source: 1}});
                        c.setKeystroke(CKEDITOR.ALT +
                            (CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109), "toolbarCollapse");
                        k.push('<a title="' + (d ? c.lang.toolbar.toolbarCollapse : c.lang.toolbar.toolbarExpand) + '" id="' + c.ui.spaceId("toolbar_collapser") + '" tabIndex="-1" class="cke_toolbox_collapser');
                        d || k.push(" cke_toolbox_collapser_min");
                        k.push('" onclick="CKEDITOR.tools.callFunction(' + B + ')">', '<span class="cke_arrow">&#9650;</span>', "</a>")
                    }
                    k.push("</span>");
                    g.data.html = g.data.html + k.join("")
                }
            });
            c.on("destroy", function () {
                if (this.toolbox) {
                    var a, b = 0, c, e, f;
                    for (a = this.toolbox.toolbars; b < a.length; b++) {
                        e = a[b].items;
                        for (c = 0; c < e.length; c++) {
                            f = e[c];
                            f.clickFn && CKEDITOR.tools.removeFunction(f.clickFn);
                            f.keyDownFn && CKEDITOR.tools.removeFunction(f.keyDownFn)
                        }
                    }
                }
            });
            c.on("uiReady", function () {
                var a = c.ui.space("toolbox");
                a && c.focusManager.add(a, 1)
            });
            c.addCommand("toolbarFocus", h);
            c.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus");
            c.ui.add("-", CKEDITOR.UI_SEPARATOR, {});
            c.ui.addHandler(CKEDITOR.UI_SEPARATOR, {create: function () {
                return{render: function (a, b) {
                    b.push('<span class="cke_toolbar_separator" role="separator"></span>');
                    return{}
                }}
            }})
        }});
        CKEDITOR.ui.prototype.addToolbarGroup = function (a, b, e) {
            var i = c(this.editor), d = b === 0, h = {name: a};
            if (e) {
                if (e = CKEDITOR.tools.search(i, function (a) {
                    return a.name == e
                })) {
                    !e.groups && (e.groups = []);
                    if (b) {
                        b = CKEDITOR.tools.indexOf(e.groups, b);
                        if (b >= 0) {
                            e.groups.splice(b + 1, 0, a);
                            return
                        }
                    }
                    d ? e.groups.splice(0, 0, a) : e.groups.push(a);
                    return
                }
                b = null
            }
            b && (b = CKEDITOR.tools.indexOf(i, function (a) {
                return a.name == b
            }));
            d ? i.splice(0, 0, a) : typeof b == "number" ? i.splice(b + 1, 0, h) : i.push(a)
        }
    }(),CKEDITOR.UI_SEPARATOR = "separator",
    CKEDITOR.config.toolbarLocation = "top",function () {
        function b(a) {
            this.editor = a;
            this.reset()
        }

        CKEDITOR.plugins.add("undo", {init: function (a) {
            function c(a) {
                d.enabled && a.data.command.canUndo !== false && d.save()
            }

            var d = new b(a), f = a.addCommand("undo", {exec: function () {
                if (d.undo()) {
                    a.selectionChange();
                    this.fire("afterUndo")
                }
            }, state: CKEDITOR.TRISTATE_DISABLED, canUndo: false}), g = a.addCommand("redo", {exec: function () {
                if (d.redo()) {
                    a.selectionChange();
                    this.fire("afterRedo")
                }
            }, state: CKEDITOR.TRISTATE_DISABLED, canUndo: false});
            a.setKeystroke([
                [CKEDITOR.CTRL + 90, "undo"],
                [CKEDITOR.CTRL + 89, "redo"],
                [CKEDITOR.CTRL + CKEDITOR.SHIFT + 90, "redo"]
            ]);
            d.onChange = function () {
                f.setState(d.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                g.setState(d.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
            };
            a.on("beforeCommandExec", c);
            a.on("afterCommandExec", c);
            a.on("saveSnapshot", function (a) {
                d.save(a.data && a.data.contentOnly)
            });
            a.on("contentDom", function () {
                a.editable().on("keydown", function (a) {
                    !a.data.$.ctrlKey && !a.data.$.metaKey &&
                    d.type(a)
                })
            });
            a.on("beforeModeUnload", function () {
                a.mode == "wysiwyg" && d.save(true)
            });
            a.on("mode", function () {
                d.enabled = a.readOnly ? false : a.mode == "wysiwyg";
                d.onChange()
            });
            if (a.ui.addButton) {
                a.ui.addButton("Undo", {label: a.lang.undo.undo, command: "undo", toolbar: "undo,10"});
                a.ui.addButton("Redo", {label: a.lang.undo.redo, command: "redo", toolbar: "undo,20"})
            }
            a.resetUndo = function () {
                d.reset();
                a.fire("saveSnapshot")
            };
            a.on("updateSnapshot", function () {
                d.currentImage && d.update()
            });
            a.on("lockSnapshot", d.lock, d);
            a.on("unlockSnapshot",
                d.unlock, d)
        }});
        CKEDITOR.plugins.undo = {};
        var c = CKEDITOR.plugins.undo.Image = function (a) {
            this.editor = a;
            a.fire("beforeUndoImage");
            var b = a.getSnapshot(), c = b && a.getSelection();
            CKEDITOR.env.ie && b && (b = b.replace(/\s+data-cke-expando=".*?"/g, ""));
            this.contents = b;
            this.bookmarks = c && c.createBookmarks2(true);
            a.fire("afterUndoImage")
        }, a = /\b(?:href|src|name)="[^"]*?"/gi;
        c.prototype = {equals: function (b, c) {
            var d = this.contents, f = b.contents;
            if (CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat)) {
                d = d.replace(a,
                    "");
                f = f.replace(a, "")
            }
            if (d != f)return false;
            if (c)return true;
            d = this.bookmarks;
            f = b.bookmarks;
            if (d || f) {
                if (!d || !f || d.length != f.length)return false;
                for (var g = 0; g < d.length; g++) {
                    var h = d[g], m = f[g];
                    if (h.startOffset != m.startOffset || h.endOffset != m.endOffset || !CKEDITOR.tools.arrayCompare(h.start, m.start) || !CKEDITOR.tools.arrayCompare(h.end, m.end))return false
                }
            }
            return true
        }};
        var h = {8: 1, 46: 1}, f = {16: 1, 17: 1, 18: 1}, g = {37: 1, 38: 1, 39: 1, 40: 1};
        b.prototype = {type: function (a) {
            var a = a && a.data.getKey(), b = a in h, d = this.lastKeystroke in
                h, j = b && a == this.lastKeystroke, k = a in g, l = this.lastKeystroke in g;
            if (!(a in f || this.typing) || !b && !k && (d || l) || b && !j) {
                var m = new c(this.editor), n = this.snapshots.length;
                CKEDITOR.tools.setTimeout(function () {
                    var a = this.editor.getSnapshot();
                    CKEDITOR.env.ie && (a = a.replace(/\s+data-cke-expando=".*?"/g, ""));
                    if (m.contents != a && n == this.snapshots.length) {
                        this.typing = true;
                        this.save(false, m, false) || this.snapshots.splice(this.index + 1, this.snapshots.length - this.index - 1);
                        this.hasUndo = true;
                        this.hasRedo = false;
                        this.modifiersCount =
                            this.typesCount = 1;
                        this.onChange()
                    }
                }, 0, this)
            }
            this.lastKeystroke = a;
            if (b) {
                this.typesCount = 0;
                this.modifiersCount++;
                if (this.modifiersCount > 25) {
                    this.save(false, null, false);
                    this.modifiersCount = 1
                }
            } else if (!k) {
                this.modifiersCount = 0;
                this.typesCount++;
                if (this.typesCount > 25) {
                    this.save(false, null, false);
                    this.typesCount = 1
                }
            }
        }, reset: function () {
            this.lastKeystroke = 0;
            this.snapshots = [];
            this.index = -1;
            this.limit = this.editor.config.undoStackSize || 20;
            this.currentImage = null;
            this.hasRedo = this.hasUndo = false;
            this.locked = null;
            this.resetType()
        }, resetType: function () {
            this.typing = false;
            delete this.lastKeystroke;
            this.modifiersCount = this.typesCount = 0
        }, fireChange: function () {
            this.hasUndo = !!this.getNextImage(true);
            this.hasRedo = !!this.getNextImage(false);
            this.resetType();
            this.onChange()
        }, save: function (a, b, d) {
            if (this.locked)return false;
            var f = this.snapshots;
            b || (b = new c(this.editor));
            if (b.contents === false || this.currentImage && b.equals(this.currentImage, a))return false;
            f.splice(this.index + 1, f.length - this.index - 1);
            f.length == this.limit &&
            f.shift();
            this.index = f.push(b) - 1;
            this.currentImage = b;
            d !== false && this.fireChange();
            return true
        }, restoreImage: function (a) {
            var b = this.editor, c;
            if (a.bookmarks) {
                b.focus();
                c = b.getSelection()
            }
            this.locked = 1;
            this.editor.loadSnapshot(a.contents);
            if (a.bookmarks)c.selectBookmarks(a.bookmarks); else if (CKEDITOR.env.ie) {
                b = this.editor.document.getBody().$.createTextRange();
                b.collapse(true);
                b.select()
            }
            this.locked = 0;
            this.index = a.index;
            this.update();
            this.fireChange()
        }, getNextImage: function (a) {
            var b = this.snapshots, c =
                this.currentImage, f;
            if (c)if (a)for (f = this.index - 1; f >= 0; f--) {
                a = b[f];
                if (!c.equals(a, true)) {
                    a.index = f;
                    return a
                }
            } else for (f = this.index + 1; f < b.length; f++) {
                a = b[f];
                if (!c.equals(a, true)) {
                    a.index = f;
                    return a
                }
            }
            return null
        }, redoable: function () {
            return this.enabled && this.hasRedo
        }, undoable: function () {
            return this.enabled && this.hasUndo
        }, undo: function () {
            if (this.undoable()) {
                this.save(true);
                var a = this.getNextImage(true);
                if (a)return this.restoreImage(a), true
            }
            return false
        }, redo: function () {
            if (this.redoable()) {
                this.save(true);
                if (this.redoable()) {
                    var a = this.getNextImage(false);
                    if (a)return this.restoreImage(a), true
                }
            }
            return false
        }, update: function () {
            if (!this.locked)this.snapshots.splice(this.index, 1, this.currentImage = new c(this.editor))
        }, lock: function () {
            if (!this.locked) {
                var a = this.editor.getSnapshot();
                this.locked = {update: this.currentImage && a == this.currentImage.contents ? a : null}
            }
        }, unlock: function () {
            if (this.locked) {
                var a = this.locked.update, b = this.editor.getSnapshot();
                this.locked = null;
                typeof a == "string" && b != a && this.update()
            }
        }}
    }(),
    function () {
        function b(b) {
            var c = this.editor, d = b.document, f = d.body;
            (b = d.getElementById("cke_actscrpt")) && b.parentNode.removeChild(b);
            (b = d.getElementById("cke_shimscrpt")) && b.parentNode.removeChild(b);
            if (CKEDITOR.env.gecko) {
                f.contentEditable = false;
                if (CKEDITOR.env.version < 2E4) {
                    f.innerHTML = f.innerHTML.replace(/^.*<\!-- cke-content-start --\>/, "");
                    setTimeout(function () {
                        var a = new CKEDITOR.dom.range(new CKEDITOR.dom.document(d));
                        a.setStart(new CKEDITOR.dom.node(f), 0);
                        c.getSelection().selectRanges([a])
                    }, 0)
                }
            }
            f.contentEditable =
                true;
            if (CKEDITOR.env.ie) {
                f.hideFocus = true;
                f.disabled = true;
                f.removeAttribute("disabled")
            }
            delete this._.isLoadingData;
            this.$ = f;
            d = new CKEDITOR.dom.document(d);
            this.setup();
            if (CKEDITOR.env.ie) {
                d.getDocumentElement().addClass(d.$.compatMode);
                c.config.enterMode != CKEDITOR.ENTER_P && d.on("selectionchange", function () {
                    var a = d.getBody(), b = c.getSelection(), e = b && b.getRanges()[0];
                    e && (a.getHtml().match(/^<p>&nbsp;<\/p>$/i) && e.startContainer.equals(a)) && setTimeout(function () {
                        e = c.getSelection().getRanges()[0];
                        if (!e.startContainer.equals("body")) {
                            a.getFirst().remove(1);
                            e.moveToElementEditEnd(a);
                            e.select()
                        }
                    }, 0)
                })
            } else if (CKEDITOR.env.webkit)d.getDocumentElement().on("mousedown", function (a) {
                a.data.getTarget().is("html") && c.editable().focus()
            });
            CKEDITOR.env.gecko && CKEDITOR.tools.setTimeout(a, 0, this, c);
            try {
                c.document.$.execCommand("2D-position", false, true)
            } catch (g) {
            }
            try {
                c.document.$.execCommand("enableInlineTableEditing", false, !c.config.disableNativeTableHandles)
            } catch (h) {
            }
            if (c.config.disableObjectResizing)try {
                this.getDocument().$.execCommand("enableObjectResizing",
                    false, false)
            } catch (m) {
                this.attachListener(this, CKEDITOR.env.ie ? "resizestart" : "resize", function (a) {
                    a.data.preventDefault()
                })
            }
            (CKEDITOR.env.gecko || CKEDITOR.env.ie && c.document.$.compatMode == "CSS1Compat") && this.attachListener(this, "keydown", function (a) {
                var b = a.data.getKeystroke();
                if (b == 33 || b == 34)if (CKEDITOR.env.ie)setTimeout(function () {
                    c.getSelection().scrollIntoView()
                }, 0); else if (c.window.$.innerHeight > this.$.offsetHeight) {
                    var d = c.createRange();
                    d[b == 33 ? "moveToElementEditStart" : "moveToElementEditEnd"](this);
                    d.select();
                    a.data.preventDefault()
                }
            });
            CKEDITOR.env.ie && this.attachListener(d, "blur", function () {
                try {
                    d.$.selection.empty()
                } catch (a) {
                }
            });
            c.document.getElementsByTag("title").getItem(0).data("cke-title", c.document.$.title);
            if (CKEDITOR.env.ie)c.document.$.title = this._.docTitle;
            CKEDITOR.tools.setTimeout(function () {
                c.fire("contentDom");
                if (this._.isPendingFocus) {
                    c.focus();
                    this._.isPendingFocus = false
                }
                setTimeout(function () {
                    c.fire("dataReady")
                }, 0);
                CKEDITOR.env.ie && setTimeout(function () {
                    if (c.document) {
                        var a =
                            c.document.$.body;
                        a.runtimeStyle.marginBottom = "0px";
                        a.runtimeStyle.marginBottom = ""
                    }
                }, 1E3)
            }, 0, this)
        }

        function c(a) {
            a.checkDirty() || setTimeout(function () {
                a.resetDirty()
            }, 0)
        }

        function a(a) {
            if (!a.readOnly) {
                var b = a.window, d = a.document, f = d.getBody(), g = f.getFirst(), h = f.getChildren().count();
                if (!h || h == 1 && g.type == CKEDITOR.NODE_ELEMENT && g.hasAttribute("_moz_editor_bogus_node")) {
                    c(a);
                    var g = CKEDITOR.document, m = g.getDocumentElement(), n = m.$.scrollTop, o = m.$.scrollLeft, s = d.$.createEvent("KeyEvents");
                    s.initKeyEvent("keypress",
                        true, true, b.$, false, false, false, false, 0, 32);
                    d.$.dispatchEvent(s);
                    (n != m.$.scrollTop || o != m.$.scrollLeft) && g.getWindow().$.scrollTo(o, n);
                    h && f.getFirst().remove();
                    d.getBody().appendBogus();
                    a = a.createRange();
                    a.setStartAt(f, CKEDITOR.POSITION_AFTER_START);
                    a.select()
                }
            }
        }

        function h() {
            var a = [];
            if (CKEDITOR.document.$.documentMode >= 8) {
                a.push("html.CSS1Compat [contenteditable=false]{min-height:0 !important}");
                var b = [], c;
                for (c in CKEDITOR.dtd.$removeEmpty)b.push("html.CSS1Compat " + c + "[contenteditable=false]");
                a.push(b.join(",") +
                    "{display:inline-block}")
            } else if (CKEDITOR.env.gecko) {
                a.push("html{height:100% !important}");
                a.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}")
            }
            a.push("html{cursor:text;*cursor:auto}");
            a.push("img,input,textarea{cursor:default}");
            return a.join("\n")
        }

        CKEDITOR.plugins.add("wysiwygarea", {init: function (a) {
            a.addMode("wysiwyg", function (b) {
                function c(d) {
                    d && d.removeListener();
                    a.editable(new g(a, h.$.contentWindow.document.body));
                    a.setData(a.getData(1), b)
                }

                var h = CKEDITOR.document.createElement("iframe");
                h.setStyles({width: "100%", height: "100%"});
                h.addClass("cke_wysiwyg_frame cke_reset");
                var k = a.ui.space("contents");
                k.append(h);
                var l = "document.open();" + (f ? 'document.domain="' + document.domain + '";' : "") + "document.close();", l = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent(l) + "}())" : "", m = CKEDITOR.env.ie || CKEDITOR.env.gecko;
                if (m)h.on("load", c);
                var n = [a.lang.editor, a.name].join(), o = a.lang.common.editorHelp;
                CKEDITOR.env.ie && (n = n + (", " + o));
                var s = CKEDITOR.tools.getNextId(),
                    r = CKEDITOR.dom.element.createFromHtml('<span id="' + s + '" class="cke_voice_label">' + o + "</span>");
                k.append(r, 1);
                a.on("beforeModeUnload", function (a) {
                    a.removeListener();
                    r.remove()
                });
                h.setAttributes({frameBorder: 0, "aria-describedby": s, title: n, src: l, tabIndex: a.tabIndex, allowTransparency: "true"});
                !m && c();
                if (CKEDITOR.env.webkit) {
                    l = function () {
                        k.setStyle("width", "100%");
                        h.hide();
                        h.setSize("width", k.getSize("width"));
                        k.removeStyle("width");
                        h.show()
                    };
                    h.setCustomData("onResize", l);
                    CKEDITOR.document.getWindow().on("resize",
                        l)
                }
                a.fire("ariaWidget", h)
            })
        }});
        var f = CKEDITOR.env.isCustomDomain(), g = CKEDITOR.tools.createClass({$: function (a) {
            this.base.apply(this, arguments);
            this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function (a) {
                CKEDITOR.tools.setTimeout(b, 0, this, a)
            }, this);
            this._.docTitle = this.getWindow().getFrame().getAttribute("title")
        }, base: CKEDITOR.editable, proto: {setData: function (a, b) {
            var c = this.editor;
            if (b)this.setHtml(a); else {
                this._.isLoadingData = true;
                c._.dataStore = {id: 1};
                var g = c.config, k = g.fullPage, l = g.docType,
                    m = CKEDITOR.tools.buildStyleHtml(h()).replace(/<style>/, '<style data-cke-temp="1">');
                k || (m = m + CKEDITOR.tools.buildStyleHtml(c.config.contentsCss));
                var n = g.baseHref ? '<base href="' + g.baseHref + '" data-cke-temp="1" />' : "";
                k && (a = a.replace(/<!DOCTYPE[^>]*>/i, function (a) {
                    c.docType = l = a;
                    return""
                }).replace(/<\?xml\s[^\?]*\?>/i, function (a) {
                    c.xmlDeclaration = a;
                    return""
                }));
                c.dataProcessor && (a = c.dataProcessor.toHtml(a));
                if (k) {
                    /<body[\s|>]/.test(a) || (a = "<body>" + a);
                    /<html[\s|>]/.test(a) || (a = "<html>" + a + "</html>");
                    /<head[\s|>]/.test(a) ?
                        /<title[\s|>]/.test(a) || (a = a.replace(/<head[^>]*>/, "$&<title></title>")) : a = a.replace(/<html[^>]*>/, "$&<head><title></title></head>");
                    n && (a = a.replace(/<head>/, "$&" + n));
                    a = a.replace(/<\/head\s*>/, m + "$&");
                    a = l + a
                } else a = g.docType + '<html dir="' + g.contentsLangDirection + '" lang="' + (g.contentsLanguage || c.langCode) + '"><head><title>' + this._.docTitle + "</title>" + n + m + "</head><body" + (g.bodyId ? ' id="' + g.bodyId + '"' : "") + (g.bodyClass ? ' class="' + g.bodyClass + '"' : "") + ">" + a + "</body></html>";
                if (CKEDITOR.env.gecko) {
                    a = a.replace(/<body/,
                        '<body contenteditable="true" ');
                    CKEDITOR.env.version < 2E4 && (a = a.replace(/<body[^>]*>/, "$&<\!-- cke-content-start --\>"))
                }
                g = '<script id="cke_actscrpt" type="text/javascript"' + (CKEDITOR.env.ie ? ' defer="defer" ' : "") + ">" + (f ? 'document.domain="' + document.domain + '";' : "") + "var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" + this._.frameLoadedHandler + ",window);wasLoaded=1;}" + (CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') +
                    "<\/script>";
                CKEDITOR.env.ie && CKEDITOR.env.version < 9 && (g = g + '<script id="cke_shimscrpt">(function(){var e="abbr,article,aside,audio,bdi,canvas,data,datalist,details,figcaption,figure,footer,header,hgroup,mark,meter,nav,output,progress,section,summary,time,video".split(","),i=e.length;while(i--){document.createElement(e[i])}})()<\/script>');
                a = a.replace(/(?=\s*<\/(:?head)>)/, g);
                this.clearCustomData();
                this.clearListeners();
                c.fire("contentDomUnload");
                var o = this.getDocument();
                try {
                    o.write(a)
                } catch (s) {
                    setTimeout(function () {
                            o.write(a)
                        },
                        0)
                }
            }
        }, getData: function (a) {
            if (a)return this.getHtml();
            var a = this.editor, b = a.config.fullPage, c = b && a.docType, f = b && a.xmlDeclaration, g = this.getDocument(), b = b ? g.getDocumentElement().getOuterHtml() : g.getBody().getHtml();
            CKEDITOR.env.gecko && (b = b.replace(/<br>(?=\s*(:?$|<\/body>))/, ""));
            a.dataProcessor && (b = a.dataProcessor.toDataFormat(b));
            f && (b = f + "\n" + b);
            c && (b = c + "\n" + b);
            return b
        }, focus: function () {
            this._.isLoadingData ? this._.isPendingFocus = true : g.baseProto.focus.call(this)
        }, detach: function () {
            var a = this.editor,
                b = a.document, c = a.window.getFrame();
            g.baseProto.detach.call(this);
            this.clearCustomData();
            b.getDocumentElement().clearCustomData();
            c.clearCustomData();
            CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
            (b = c.removeCustomData("onResize")) && b.removeListener();
            a.fire("contentDomUnload");
            c.remove()
        }}})
    }(),CKEDITOR.config.disableObjectResizing = !1,CKEDITOR.config.disableNativeTableHandles = !0,CKEDITOR.config.disableNativeSpellChecker = !0,CKEDITOR.config.contentsCss = CKEDITOR.basePath + "contents.css",CKEDITOR.config.plugins =
        "dialogui,dialog,a11yhelp,about,basicstyles,bidi,blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,colordialog,menu,contextmenu,dialogadvtab,div,elementspath,list,indent,enterkey,entities,popup,filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo,font,format,forms,horizontalrule,htmlwriter,iframe,image,justify,link,liststyle,magicline,maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,removeformat,resize,save,selectall,showblocks,showborders,smiley,sourcearea,specialchar,stylescombo,tab,table,tabletools,templates,toolbar,undo,wysiwygarea",
    CKEDITOR.config.skin = "moono",function () {
        for (var b = "about,0,bold,32,italic,64,strike,96,subscript,128,superscript,160,underline,192,bidiltr,224,bidirtl,256,blockquote,288,copy-rtl,320,copy,352,cut-rtl,384,cut,416,paste-rtl,448,paste,480,bgcolor,512,textcolor,544,creatediv,576,docprops-rtl,608,docprops,640,find-rtl,672,find,704,replace,736,flash,768,button,800,checkbox,832,form,864,hiddenfield,896,imagebutton,928,radio,960,select-rtl,992,select,1024,textarea-rtl,1056,textarea,1088,textfield-rtl,1120,textfield,1152,horizontalrule,1184,iframe,1216,image,1248,indent-rtl,1280,indent,1312,outdent-rtl,1344,outdent,1376,justifyblock,1408,justifycenter,1440,justifyleft,1472,justifyright,1504,anchor-rtl,1536,anchor,1568,link,1600,unlink,1632,bulletedlist-rtl,1664,bulletedlist,1696,numberedlist-rtl,1728,numberedlist,1760,maximize,1792,newpage-rtl,1824,newpage,1856,pagebreak-rtl,1888,pagebreak,1920,pastefromword-rtl,1952,pastefromword,1984,pastetext-rtl,2016,pastetext,2048,placeholder,2080,preview-rtl,2112,preview,2144,print,2176,removeformat,2208,save,2240,selectall,2272,showblocks-rtl,2304,showblocks,2336,smiley,2368,source-rtl,2400,source,2432,specialchar,2464,table,2496,templates-rtl,2528,templates,2560,uicolor,2592,redo-rtl,2624,redo,2656,undo-rtl,2688,undo,2720",
                 c = CKEDITOR.getUrl("plugins/icons.png"), b = b.split(","), a = 0; a < b.length; a++)CKEDITOR.skin.icons[b[a]] = {path: c, offset: -b[++a]}
    }()
})();