// ==UserScript==
// @name         Video 加速
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  try to take over the world!
// @author       GuanLin Wu
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @updateURL    https://raw.githubusercontent.com/guanlinwu/tampermonkey/master/video.js?v=20180705
// @include      *://xlyy100.com/*
// @include      *://youku163.zuida-bofang.com/*
// @include      *://fuli.zuida-youku-le.com/*
// @include      *://pan.baidu.com/play/video*
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    var host = window.location.host;
    var curSpeed = 1;
    var g_uaSamsung = 'Mozilla/5.0 (Linux; U; Android 4.0.4; GT-I9300 Build/IMM76D) AppleWebKit/534.30 Version/4.0 Mobile Safari/534.30',
        g_uaChrome = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
        g_uaIPad = 'Mozilla/5.0 (iPad; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        g_uaSafari = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.1 Safari/605.1.15';
    const g_speed_box_style = '.speed-box-outer{position:fixed;top:10px;left:10px;z-index:99999999999999999;cursor:pointer}.speed-box{display:flex;height:30px;border-radius:4px;background:rgba(255,202,202,0.62);text-align:center;overflow:hidden;border:1px solid rgb(255, 202, 202)}.speed-box span{display:inline-block;width:40px;flex:1;font-size:14px;line-height:30px;color:#fff;}.speed-box span:not(:first-child){border-left: 1px solid #fff;}.speed-box span:hover{background:rgba(253, 116, 230, 0.36)}.speed-box span.e-active{background:rgba(255, 34, 218, 0.36)}.video-size-box{display:flex;margin-top:5px}.btn-video-size{padding:0 6px;background:rgba(250,152,223,.52);color:#fff;font-size:10px;line-height:18px}';
    const g_video_own_style = '.video-own{position:fixed;top:50%;left:50%;transform: translate(-50%, -50%);height:80%;width:80%;z-index:9999999999999999;}.video-own.e-size{top:100px;left:60px;height:100px;width:100px;opacity:.5;font-size:.2em}';
    const g_speed_box_html =
        `<div class="speed-box-outer">
            <div class="speed-box j-speed-box">
                <span>0.8</span><span class="e-active">1</span><span>1.5</span><span>2</span><span>2.5</span><span>3</span>
            </div>
            <div class="video-size-box">
                <span class="btn-video-size j-size-video">隐藏/展开</span>
            </div>
        </div>`;

    var util = {
        injectStyle(style) {
            var styleDom;
            if (style.startsWith('http')) {
                styleDom = document.createElement('link');
                styleDom.href = style;
                styleDom.rel = 'stylesheet';
            } else {
                styleDom = document.createElement('style');
                styleDom.innerHTML = style;
            }
            document.body.appendChild(styleDom);
            return this;
        },
        injectJS(src) {
            const js = document.createElement('script');
            if (src.startsWith('http')) {
                js.src = src
            }
            else {
                js.textContent = src;
            }
            document.body.appendChild(js);
            return this;
        },
        injectHtml(html) {
            const div = document.createElement('div');
            div.innerHTML = html;
            document.body.appendChild(div);
            return this;
        },
        fakeUA(ua) {
            Object.defineProperty(navigator, 'userAgent', {
                value: ua,
                writable: false,
                configurable: false,
                enumerable: true
            });
            return this;
        },
        addSpeedBoxDom() {

            this.injectHtml(g_speed_box_html);
            return this;
        },
        setSpeed() {
            return this;
        }
    }



    $(function () {
        // dom ready执行的代码
        // 进来执行的代码
        switch (true) {
            /**
             * 降龙
             */
            case /xlyy100.com/.test(host): //仅仅是获取视频源，弹出视频源给用户复制到其他浏览器打开
                var iframe = document.querySelectorAll('iframe');
                var iframeUrl = !!iframe[1] ? iframe[1].getAttribute('src') : null;
                if (!!iframeUrl) {
                    util.injectStyle('https://unpkg.com/video.js/dist/video-js.css').injectStyle(g_video_own_style);
                    util.injectHtml('<video class="video-own e-size video-js vjs-big-play-centered" controls preload="auto" width="100%" height="100%" data-setup="{}"><source src="http://fuli.zuida-youku-le.com/20180625/28792_4f40f0c7/index.m3u8" type="application/x-mpegURL"></video>');
                    util.injectJS('https://unpkg.com/video.js/dist/video.js').injectJS('https://unpkg.com/videojs-contrib-hls/dist/videojs-contrib-hls.js');
                    util.injectStyle(g_speed_box_style).addSpeedBoxDom();
                    util.setSpeed = function (opts) {
                        var videoDom = document.querySelector('video');
                        videoDom.playbackRate = opts.speed;
                        videoDom.preload = 'auto';
                        return this;
                    }

                    var videoSeeUrl = iframeUrl.match(/url=(.+)/)[1];

                    GM_setClipboard(videoSeeUrl, 'text');
                    GM_notification({
                        title: '获取视频源成功，请复制链接在支持m3u8的浏览器打开',
                        text: `${videoSeeUrl}`
                    });
                    $('iframe').remove();
                }
                break;
            case /(youku163\.zuida-bofang\.com)|(fuli\.zuida-youku-le\.com)|(cn2\.zuidadianying\.com)/.test(host):
                util.fakeUA(g_uaSafari).injectStyle(g_speed_box_style).addSpeedBoxDom();
                util.setSpeed = function (opts) {
                    var videoDom = document.querySelector('video');
                    videoDom.playbackRate = opts.speed;
                    videoDom.preload = 'auto';
                    return this;
                }
                break;
            case /pan\.baidu\.com/.test(host):

                break;
            default:
                break;
        }

        $(document)
        .on('click', '.j-speed-box span', function () {
            var $this = $(this),
                speed = +$this.text();
            $this.addClass('e-active').siblings().removeClass('e-active');
            util.setSpeed({
                speed: speed
            });
        })
        .on('click', '.j-size-video', function () {
            console.log(1)
            $('.video-own').toggleClass('e-size');
        });
    });
})();

