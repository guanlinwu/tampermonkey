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

$(function() {
    'use strict';
    var host = window.location.host;
    var util = {
        addStyle: function() {
            var styleDom = document.createElement('style');
            styleDom.innerHTML = '.speedBox{position:fixed;top:10px;left:10px;z-index:9999;display:flex;height:30px;border-radius:4px;background:rgba(255, 255, 255, 0.7);text-align:center;overflow: hidden;}.speedBox span{display:inline-block;width: 40px;flex:1;font-size:14px;line-height:30px;color:#fdfdfd;cursor: pointer;}.speedBox span:not(:first-child){border-left: 1px solid #fff;}.speedBox span:hover{color: #222;background: rgba(255,255,255,.6)}';
            document.body.appendChild(styleDom);
        },
        addBtn : function() {
            var btnDom = $('<div class="speedBox j-speedBox"><span>1</span><span>1.5</span><span>2</span><span>2.5</span><span>3</span></div>');
            $('body').append(btnDom);
        },
        setSpeed: function() {

        }
    }

    // Your code here...
    switch (true) {
        case /xlyy100.com/.test(host): //仅仅是获取视频源，弹出视频源给用户复制到其他浏览器打开
            var iframeUrl = document.querySelectorAll('iframe')[1].getAttribute('src'),
            videoSeeUrl = iframeUrl.match(/url=(.+)/)[1];
            alert(videoSeeUrl);
            break;
        case /youku163\.zuida-bofang\.com/.test(host):
            util.addStyle();
            util.addBtn();
            util.setSpeed = function (opts) {
                var videoDom = document.querySelector('video');
                videoDom.playbackRate = opts.speed;
                videoDom.preload = 'auto';
            }
            break;
        default:
            break;
    }

    $(document).on('click', '.j-speedBox span', function() {
        var $this = $(this),
        speed = +$this.text();
        util.setSpeed({
            speed: speed
        });
    });
});