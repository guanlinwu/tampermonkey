// ==UserScript==
// @name         视频加速
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @match        *://xlyy100.com/*
// @match        *://youku163.zuida-bofang.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    var href = window.location.href,
        util = new Util();

    // Your code here...
    switch (true) {
        case /xlyy100.com\/\?/.test(href): //仅仅是获取视频源，弹出视频源给用户复制到其他浏览器打开
            var iframeUrl = document.querySelectorAll('iframe')[1].getAttribute('src'),
            videoSeeUrl = iframeUrl.match(/url=(.+)/)[1];
            alert(videoSeeUrl);
            break;
        case /youku163\.zuida-bofang\.com/.test(href):
            var videoDom = document.querySelector('video');
            videoDom.playbackRate = 2;
            videoDom.preload = 'auto';
            break;
        default:
            break;
    }

    /**
     * 工具函数
     */
    function Util() {
    }

    Util.prototype.addBtn = function() {
        var btnDom = $('<div><span>1</span><span>1.5</span><span>2</span></div>');
        $(html).append(btnDom);
    }


})();