(function (g, r, f) {
    var s = function () {
        for (var b = /audio(.min)?.js.*/, a = document.getElementsByTagName("script"), c = 0, d = a.length; c < d; c++) {
            var e = a[c].getAttribute("src");
            if (b.test(e)) return e.replace(b, "")
        }
    }();
    f[g] = {
        instanceCount: 0,
        instances: {},
        flashSource: '      <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="$1" width="1" height="1" name="$1" style="position: absolute; left: -1px;">         <param name="movie" value="$2?playerInstance=' + g + '.instances[\'$1\']&datetime=$3">         <param name="allowscriptaccess" value="always">         <embed name="$1" src="$2?playerInstance=' + g + '.instances[\'$1\']&datetime=$3" width="1" height="1" allowscriptaccess="always">       </object>',
        settings: {
            autoplay: false,
            loop: false,
            preload: true,
            imageLocation: s + "player-graphics.png",
            swfLocation: s + "audiojs.swf",
            useFlash: function () {
                var b = document.createElement("audio");
                return !(b.canPlayType && b.canPlayType("audio/mpeg;").replace(/no/, ""))
            }(),
            hasFlash: function () {
                if (navigator.plugins && navigator.plugins.length && navigator.plugins["Shockwave Flash"]) return true;
                else if (navigator.mimeTypes && navigator.mimeTypes.length) {
                    var b = navigator.mimeTypes["application/x-shockwave-flash"];
                    return b && b.enabledPlugin
                } else try {
                    new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    return true
                } catch (a) {}
                return false
            }(),
            createPlayer: {
                markup: '<div class="play-pause">\
                            <p class="play"></p>\
                            <p class="pause"></p>\
                            <p class="loading"></p>\
                            <p class="error"></p>\
                            </div>\
                            <div class="scrubber">\
                            <div class="progress"></div>\
                            </div>\
                            <div class="time"> <em class="played">00:00</em>/<strong class="duration">00:00</strong>\
                            </div>\
                            <div class="error-message"></div>',
                playPauseClass: "play-pause",
                scrubberClass: "scrubber",
                progressClass: "progress",
                loaderClass: "loaded",
                timeClass: "time",
                durationClass: "duration",
                playedClass: "played",
                errorMessageClass: "error-message",
                playingClass: "playing",
                loadingClass: "loading",
                errorClass: "error"
            },
            css: '.audiojs p { display: none; width: 25px; height: 25px; margin: 0px; cursor: pointer; opacity: 0.6; }\
                    .audiojs p:hover { opacity: 1; }\
                    .audiojs .play { display: block; }\
                    .audiojs .scrubber, .audiojs .time { display: none }\
                    .audiojs .play { background: url("$1") -2px -1px no-repeat; }\
                    .audiojs .pause { background: url("$1") -2px -91px no-repeat; }\
                    .playing .play { display: none; }\
                    .playing .pause { display: block; }',
            trackEnded: function () {},
            flashError: function () {
                var b = this.settings.createPlayer,
                    a = m(b.errorMessageClass, this.wrapper),
                    c = 'Missing <a href="http://get.adobe.com/flashplayer/">flash player</a> plugin.';
                if (this.mp3) c += ' <a href="' + this.mp3 + '">Download audio file</a>.';
                f[g].helpers.removeClass(this.wrapper, b.loadingClass);
                f[g].helpers.addClass(this.wrapper, b.errorClass);
                a.innerHTML = c
            },
            loadError: function () {
                var b = this.settings.createPlayer,
                    a = m(b.errorMessageClass, this.wrapper);
                f[g].helpers.removeClass(this.wrapper,
                    b.loadingClass);
                f[g].helpers.addClass(this.wrapper, b.errorClass);
                a.innerHTML = 'Error loading: "' + this.mp3 + '"'
            },
            init: function () {
                f[g].helpers.addClass(this.wrapper, this.settings.createPlayer.loadingClass)
            },
            loadStarted: function () {
                var b = this.settings.createPlayer,
                    a = m(b.durationClass, this.wrapper),
                    c = Math.floor(this.duration / 60),
                    d = Math.floor(this.duration % 60);
                f[g].helpers.removeClass(this.wrapper, b.loadingClass);
                a.innerHTML = (c < 10 ? "0" : "") + c + ":" + (d < 10 ? "0" : "") + d
            },
            loadProgress: function (b) {
                var a = this.settings.createPlayer,
                    c = m(a.scrubberClass, this.wrapper);
                m(a.loaderClass, this.wrapper).style.width = c.offsetWidth * b + "px"
            },
            playPause: function () {
                this.playing ? this.settings.play() : this.settings.pause()
            },
            play: function () {
                f[g].helpers.addClass(this.wrapper, this.settings.createPlayer.playingClass)
            },
            pause: function () {
                f[g].helpers.removeClass(this.wrapper, this.settings.createPlayer.playingClass)
            },
            updatePlayhead: function (b) {
                var a = this.settings.createPlayer,
                    c = m(a.scrubberClass, this.wrapper);
                m(a.progressClass, this.wrapper).style.width = c.offsetWidth * b + "px";
                a = m(a.playedClass, this.wrapper);
                c = this.duration * b;
                b = Math.floor(c / 60);
                c = Math.floor(c % 60);
                a.innerHTML = (b < 10 ? "0" : "") + b + ":" + (c < 10 ? "0" : "") + c
            }
        },
        create: function (b, a) {
            a = a || {};
            return b.length ? this.createAll(a, b) : this.newInstance(b, a)
        },
        createAll: function (b, a) {
            var c = a || document.getElementsByTagName("audio"),
                d = [];
            b = b || {};
            for (var e = 0, k = c.length; e < k; e++) d.push(this.newInstance(c[e], b));
            return d
        },
        newInstance: function (b, a) {
            var c = this.helpers.clone(this.settings),
                d = "audiojs" + this.instanceCount,
                e = "audiojs_wrapper" + this.instanceCount;
            this.instanceCount++;
            if (b.getAttribute("autoplay") != null) c.autoplay = true;
            if (b.getAttribute("loop") != null) c.loop = true;
            if (b.getAttribute("preload") == "none") c.preload = false;
            a && this.helpers.merge(c, a);
            if (c.createPlayer.markup) b = this.createPlayer(b, c.createPlayer, e);
            else b.parentNode.setAttribute("id", e);
            e = new f[r](b, c);
            c.css && this.helpers.injectCss(e, c.css);
            if (c.useFlash && c.hasFlash) {
                this.injectFlash(e, d);
                this.attachFlashEvents(e.wrapper, e)
            } else c.useFlash && !c.hasFlash && this.settings.flashError.apply(e);
            if (!c.useFlash || c.useFlash && c.hasFlash) this.attachEvents(e.wrapper, e);
            return this.instances[d] = e
        },
        createPlayer: function (b, a, c) {
            var d = document.createElement("div"),
                e = b.cloneNode(true);
            d.setAttribute("class", "audiojs");
            d.setAttribute("className", "audiojs");
            d.setAttribute("id", c);
            if (e.outerHTML && !document.createElement("audio").canPlayType) {
                e = this.helpers.cloneHtml5Node(b);
                d.innerHTML = a.markup;
                d.appendChild(e);
                b.outerHTML = d.outerHTML;
                d = document.getElementById(c)
            } else {
                d.appendChild(e);
                d.innerHTML += a.markup;
                b.parentNode.replaceChild(d, b)
            }
            return d.getElementsByTagName("audio")[0]
        },
        attachEvents: function (b, a) {
            if (a.settings.createPlayer) {
                var c = a.settings.createPlayer,
                    d = m(c.playPauseClass, b),
                    e = m(c.scrubberClass, b);
                f[g].events.addListener(d, "click", function () {
                    a.playPause.apply(a)
                });
                f[g].events.addListener(e, "click", function (k) {
                    k = k.clientX;
                    var h = this,
                        n = 0;
                    if (h.offsetParent) {
                        do n += h.offsetLeft;
                        while (h = h.offsetParent)
                    }
                    a.skipTo((k - n) / e.offsetWidth)
                });
                if (!a.settings.useFlash) {
                    f[g].events.trackLoadProgress(a);
                    f[g].events.addListener(a.element, "timeupdate", function () {
                        a.updatePlayhead.apply(a)
                    });
                    f[g].events.addListener(a.element, "ended", function () {
                        a.trackEnded.apply(a)
                    });
                    f[g].events.addListener(a.source, "error", function () {
                        clearInterval(a.readyTimer);
                        clearInterval(a.loadTimer);
                        a.settings.loadError.apply(a)
                    })
                }
            }
        },
        attachFlashEvents: function (b, a) {
            a.swfReady = false;
            a.load = function (c) {
                a.mp3 = c;
                a.swfReady && a.element.load(c)
            };
            a.loadProgress = function (c, d) {
                a.loadedPercent = c;
                a.duration = d;
                a.settings.loadStarted.apply(a);
                a.settings.loadProgress.apply(a, [c])
            };
            a.skipTo = function (c) {
                if (!(c > a.loadedPercent)) {
                    a.updatePlayhead.call(a, [c]);
                    a.element.skipTo(c)
                }
            };
            a.updatePlayhead = function (c) {
                a.settings.updatePlayhead.apply(a, [c])
            };
            a.play = function () {
                if (!a.settings.preload) {
                    a.settings.preload = true;
                    a.element.init(a.mp3)
                }
                a.playing = true;
                a.element.pplay();
                a.settings.play.apply(a)
            };
            a.pause = function () {
                a.playing = false;
                a.element.ppause();
                a.settings.pause.apply(a)
            };
            a.setVolume = function (c) {
                a.element.setVolume(c)
            };
            a.loadStarted = function () {
                a.swfReady = true;
                a.settings.preload && a.element.init(a.mp3);
                a.settings.autoplay && a.play.apply(a)
            }
        },
        injectFlash: function (b, a) {
            var c = this.flashSource.replace(/\$1/g, a);
            c = c.replace(/\$2/g, b.settings.swfLocation);
            c = c.replace(/\$3/g, +new Date + Math.random());
            var d = b.wrapper.innerHTML,
                e = document.createElement("div");
            e.innerHTML = c + d;
            b.wrapper.innerHTML = e.innerHTML;
            b.element = this.helpers.getSwf(a)
        },
        helpers: {
            merge: function (b, a) {
                for (attr in a) if (b.hasOwnProperty(attr) || a.hasOwnProperty(attr)) b[attr] = a[attr]
            },
            clone: function (b) {
                if (b == null || typeof b !== "object") return b;
                var a = new b.constructor,
                    c;
                for (c in b) a[c] = arguments.callee(b[c]);
                return a
            },
            addClass: function (b, a) {
                RegExp("(\\s|^)" + a + "(\\s|$)").test(b.className) || (b.className += " " + a)
            },
            removeClass: function (b, a) {
                b.className = b.className.replace(RegExp("(\\s|^)" + a + "(\\s|$)"), " ")
            },
            injectCss: function (b, a) {
                for (var c = "", d = document.getElementsByTagName("style"), e = a.replace(/\$1/g, b.settings.imageLocation), k = 0, h = d.length; k < h; k++) {
                    var n = d[k].getAttribute("title");
                    if (n && ~n.indexOf("audiojs")) {
                        h = d[k];
                        if (h.innerHTML === e) return;
                        c = h.innerHTML;
                        break
                    }
                }
                d = document.getElementsByTagName("head")[0];
                k = d.firstChild;
                h = document.createElement("style");
                if (d) {
                    h.setAttribute("type", "text/css");
                    h.setAttribute("title", "audiojs");
                    if (h.styleSheet) h.styleSheet.cssText = c + e;
                    else h.appendChild(document.createTextNode(c + e));
                    k ? d.insertBefore(h, k) : d.appendChild(styleElement)
                }
            },
            cloneHtml5Node: function (b) {
                var a = document.createDocumentFragment();
                a.createElement("audio");
                var c = a.createElement("div");
                a.appendChild(c);
                c.innerHTML = b.outerHTML;
                return c.firstChild
            },
            getSwf: function (b) {
                b = document[b] || window[b];
                return b.length > 1 ? b[b.length - 1] : b
            }
        },
        events: {
            memoryLeaking: false,
            listeners: [],
            addListener: function (b, a, c) {
                if (b.addEventListener) b.addEventListener(a, c, false);
                else if (b.attachEvent) {
                    this.listeners.push(b);
                    if (!this.memoryLeaking) {
                        window.attachEvent("onunload", function () {
                            if (this.listeners) for (var d = 0, e = this.listeners.length; d < e; d++) f[g].events.purge(this.listeners[d])
                        });
                        this.memoryLeaking = true
                    }
                    b.attachEvent("on" + a, function () {
                        c.call(b,
                            window.event)
                    })
                }
            },
            trackLoadProgress: function (b) {
                if (b.settings.preload) {
                    var a, c;
                    b = b;
                    var d = /(ipod|iphone|ipad)/i.test(navigator.userAgent);
                    a = setInterval(function () {
                        if (b.element.readyState > -1) d || b.init.apply(b);
                        if (b.element.readyState > 1) {
                            b.settings.autoplay && b.play.apply(b);
                            clearInterval(a);
                            c = setInterval(function () {
                                b.loadProgress.apply(b);
                                b.loadedPercent >= 1 && clearInterval(c)
                            })
                        }
                    }, 10);
                    b.readyTimer = a;
                    b.loadTimer = c
                }
            },
            purge: function (b) {
                var a = b.attributes,
                    c;
                if (a) for (c = 0; c < a.length; c += 1) if (typeof b[a[c].name] ===
                    "function") b[a[c].name] = null;
                if (a = b.childNodes) for (c = 0; c < a.length; c += 1) purge(b.childNodes[c])
            },
            ready: function () {
                return function (b) {
                    var a = window,
                        c = false,
                        d = true,
                        e = a.document,
                        k = e.documentElement,
                        h = e.addEventListener ? "addEventListener" : "attachEvent",
                        n = e.addEventListener ? "removeEventListener" : "detachEvent",
                        q = e.addEventListener ? "" : "on",
                        p = function (o) {
                            if (!(o.type == "readystatechange" && e.readyState != "complete")) {
                                (o.type == "load" ? a : e)[n](q + o.type, p, false);
                                if (!c && (c = true)) b.call(a, o.type || o)
                            }
                        }, t = function () {
                            try {
                                k.doScroll("left")
                            } catch (o) {
                                setTimeout(t,
                                    50);
                                return
                            }
                            p("poll")
                        };
                    if (e.readyState == "complete") b.call(a, "lazy");
                    else {
                        if (e.createEventObject && k.doScroll) {
                            try {
                                d = !a.frameElement
                            } catch (u) {}
                            d && t()
                        }
                        e[h](q + "DOMContentLoaded", p, false);
                        e[h](q + "readystatechange", p, false);
                        a[h](q + "load", p, false)
                    }
                }
            }()
        }
    };
    f[r] = function (b, a) {
        this.element = b;
        this.wrapper = b.parentNode;
        this.source = b.getElementsByTagName("source")[0] || b;
        this.mp3 = function (c) {
            var d = c.getElementsByTagName("source")[0];
            return c.getAttribute("src") || (d ? d.getAttribute("src") : null)
        }(b);
        this.settings = a;
        this.loadStartedCalled = false;
        this.loadedPercent = 0;
        this.duration = 1;
        this.playing = false
    };
    f[r].prototype = {
        updatePlayhead: function () {
            this.settings.updatePlayhead.apply(this, [this.element.currentTime / this.duration])
        },
        skipTo: function (b) {
            if (!(b > this.loadedPercent)) {
                this.element.currentTime = this.duration * b;
                this.updatePlayhead()
            }
        },
        load: function (b) {
            this.loadStartedCalled = false;
            this.source.setAttribute("src", b);
            this.element.load();
            this.mp3 = b;
            f[g].events.trackLoadProgress(this)
        },
        loadError: function () {
            this.settings.loadError.apply(this)
        },
        init: function () {
            this.settings.init.apply(this)
        },
        loadStarted: function () {
            if (!this.element.duration) return false;
            this.duration = this.element.duration;
            this.updatePlayhead();
            this.settings.loadStarted.apply(this)
        },
        loadProgress: function () {
            if (this.element.buffered != null && this.element.buffered.length) {
                if (!this.loadStartedCalled) this.loadStartedCalled = this.loadStarted();
                this.loadedPercent = this.element.buffered.end(this.element.buffered.length - 1) / this.duration;
                this.settings.loadProgress.apply(this, [this.loadedPercent])
            }
        },
        playPause: function () {
            this.playing ? this.pause() : this.play()
        },
        play: function () {
            /(ipod|iphone|ipad)/i.test(navigator.userAgent) && this.element.readyState == 0 && this.init.apply(this);
            if (!this.settings.preload) {
                this.settings.preload = true;
                this.element.setAttribute("preload", "auto");
                f[g].events.trackLoadProgress(this)
            }
            this.playing = true;
            this.element.play();
            this.settings.play.apply(this)
        },
        pause: function () {
            this.playing = false;
            this.element.pause();
            this.settings.pause.apply(this)
        },
        setVolume: function (b) {
            this.element.volume = b
        },
        trackEnded: function () {
            this.skipTo.apply(this, [0]);
            this.settings.loop || this.pause.apply(this);
            this.settings.trackEnded.apply(this)
        }
    };
    var m = function (b, a, c) {
        var d = [];
        if (document.getElementsByClassName) d = a.getElementsByClassName(b);
        else {
            a = a || document;
            c = c || "*";
            a = a.getElementsByTagName(c);
            b = RegExp("(^|\\s)" + b + "(\\s|$)");
            j = i = 0;
            for (l = a.length; i < l; i++) if (b.test(a[i].className)) {
                d[j] = a[i];
                j++
            }
        }
        return d.length > 1 ? d : d[0]
    }
})("audiojs", "audiojsInstance", this);