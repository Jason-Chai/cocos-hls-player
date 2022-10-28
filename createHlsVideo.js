"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createHlsVideo(options) {
    if (!options.hls.isSupported()) {
        return new Error('当前环境不支持 HLS！');
    }
    var _hls = new options.hls();
    _hls.attachMedia(options.videoDOM);
    options.videoDOM.addEventListener("timeupdate", function () {
        var _a = options.videoDOM, currentTime = _a.currentTime, duration = _a.duration;
        options.timeUpdate(currentTime, duration, currentTime / duration * 100);
    }, false);
    _hls.on(options.hls.Events.MEDIA_ATTACHED, function () {
        console.warn('HLS 已绑定 Video 标签', options.videoDOM);
        var next;
        var urls = null;
        var tail = null; // 尾节点
        var arr = []; // url 数组
        for (var key in options.videoURL) {
            arr.push({ url: options.videoURL[key], type: key });
        }
        // @ts-ignore
        arr.sort(function (a, b) {
            if (a.type === 'origin' || b.type === 'origin') {
                return false;
            }
            return Number(b.type) - Number(a.type);
        });
        arr.forEach(function (item) {
            if (urls === null) {
                tail = urls = {
                    data: { url: item.url, type: item.type },
                    next: null
                };
            }
            else {
                var node = {
                    data: { url: item.url, type: item.type },
                    next: null
                };
                tail.next = node;
                tail = node;
            }
        });
        tail = null;
        next = urls.next;
        _hls.loadSource(urls.data.url);
        // @ts-ignore m3u8 文件解析成功
        _hls.on(options.hls.MANIFEST_PARSED, function (event, data) {
            console.warn('m3u8 清单已加载', data);
        });
        // @ts-ignore 错误处理
        _hls.on(options.hls.Events.ERROR, function (event, data) {
            console.log('[Hls.Error] ', event, data);
            var errorType = data.type;
            var errorDetails = data.details;
            var errorFatal = data.fatal;
            if (data.fatal) {
                switch (errorType) {
                    case options.hls.ErrorTypes.NETWORK_ERROR:
                        // try to recover network error
                        console.error('网络错误');
                        console.error('错误信息：' + errorDetails + '，致命性：' + errorFatal);
                        _hls.startLoad(); // 应调用以恢复网络错误。
                        if (next === undefined) {
                            throw new Error('所有连接均不能播放');
                        }
                        _hls.loadSource(next.data.url);
                        if (next.next) {
                            next = next.next;
                        }
                        else {
                            next = undefined;
                        }
                        break;
                    case options.hls.ErrorTypes.MEDIA_ERROR:
                        console.error('媒体错误');
                        _hls.recoverMediaError(); // 应调用以恢复媒体错误。
                        break;
                    case options.hls.ErrorTypes.KEY_SYSTEM_ERROR:
                        console.error('系统错误');
                        _hls.destroy();
                        break;
                    case options.hls.ErrorTypes.MUX_ERROR:
                        console.error('MUX 错误');
                        _hls.destroy();
                        break;
                    case options.hls.ErrorTypes.OTHER_ERROR:
                        console.error('其他错误');
                        _hls.destroy();
                        break;
                    default:
                        _hls.destroy();
                        break;
                }
            }
        });
        // 指定播放时间
        _hls.seek = function (time) {
            options.videoDOM.currentTime = time;
        };
        // 视频全屏
        _hls.requestFullScreen = function () {
            var videoDOM = options.videoDOM;
            if (videoDOM["requestFullScreen"]) {
                videoDOM["requestFullScreen"]();
            }
            else if (videoDOM["mozRequestFullScreen"]) {
                videoDOM["mozRequestFullScreen"]();
            }
            else if (videoDOM["webkitRequestFullScreen"]) {
                videoDOM["webkitRequestFullScreen"]();
            }
            this.VideoPlayer.play();
        };
        _hls.play = function () {
            options.videoDOM.play();
        };
        _hls.stop = function () {
            options.videoDOM.pause();
            options.videoDOM.currentTime = 0;
        };
        _hls.pause = function () {
            options.videoDOM.pause();
        };
        _hls.toggle = function () {
            var videoDOM = options.videoDOM;
            if (videoDOM.paused) {
                videoDOM.play();
            }
            else {
                videoDOM.pause();
            }
        };
        _hls.switchVideo = function (url) {
            // todo...
            console.log('todo...', url);
        };
        _hls.volume = function (volume) {
            options.videoDOM.volume = volume;
        };
        _hls.video = options.videoDOM;
        _hls.duration = options.videoDOM.duration;
        _hls.paused = options.videoDOM.paused;
    });
    return _hls;
}
exports.default = createHlsVideo;
