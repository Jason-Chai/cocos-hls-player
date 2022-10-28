"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createHlsVideo(options) {
    if (!options.hls.isSupported()) {
        return new Error('不支持 HLS');
    }
    var hlsa = new options.hls();
    hlsa.attachMedia(options.videoDOM);
    options.videoDOM.addEventListener("timeupdate", function () {
        var _a = options.videoDOM, currentTime = _a.currentTime, duration = _a.duration;
        options.timeUpdate(currentTime, duration, currentTime / duration * 100);
    }, false);
    // 监听 获取video标签成功
    hlsa.on(options.hls.Events.MEDIA_ATTACHED, function () {
        console.warn('HLS 已绑定 Video 标签', options.videoDOM);
        /*
        * 加载视频资源
        * string 类型 直接读取 object 则进行清晰度切换
        * 根据文件名 判断视频类型
        * */
        var next;
        var urls = null;
        var tail = null; // 尾节点
        var arr = []; // url 数组
        for (var key in options.videoURL) {
            arr.push({
                url: options.videoURL[key],
                type: key
            });
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
                    data: {
                        url: item.url,
                        type: item.type
                    },
                    next: null
                };
            }
            else {
                var node = {
                    data: {
                        url: item.url,
                        type: item.type
                    },
                    next: null
                };
                tail.next = node;
                tail = node;
            }
        });
        tail = null;
        // arr = null
        console.log(urls);
        next = urls.next;
        hlsa.loadSource(urls.data.url);
        // @ts-ignore m3u8 文件解析成功
        hlsa.on(options.hls.MANIFEST_PARSED, function (event, data) {
            console.warn('m3u8 清单已加载', data);
        });
        // @ts-ignore 错误处理
        hlsa.on(options.hls.Events.ERROR, function (event, data) {
            console.log(event, data, 'Hls.Error');
            var errorType = data.type;
            var errorDetails = data.details;
            var errorFatal = data.fatal;
            if (data.fatal) {
                switch (errorType) {
                    case options.hls.ErrorTypes.NETWORK_ERROR:
                        // try to recover network error
                        console.error('网络错误');
                        console.error('错误信息：' + errorDetails + '，致命性：' + errorFatal);
                        console.warn(hlsa.loadLevel, 123123);
                        hlsa.startLoad(); // 应调用以恢复网络错误。
                        if (next === undefined) {
                            throw new Error('所有连接均不能播放');
                        }
                        hlsa.loadSource(next.data.url);
                        if (next.next) {
                            next = next.next;
                        }
                        else {
                            next = undefined;
                        }
                        break;
                    case options.hls.ErrorTypes.MEDIA_ERROR:
                        console.error('媒体错误');
                        hlsa.recoverMediaError(); // 应调用以恢复媒体错误。
                        break;
                    case options.hls.ErrorTypes.KEY_SYSTEM_ERROR:
                        console.error('系统错误');
                        hlsa.destroy();
                        break;
                    case options.hls.ErrorTypes.MUX_ERROR:
                        console.error('MUX 错误');
                        hlsa.destroy();
                        break;
                    case options.hls.ErrorTypes.OTHER_ERROR:
                        console.error('其他错误');
                        hlsa.destroy();
                        break;
                    default:
                        hlsa.destroy();
                        break;
                }
            }
        });
        // 指定播放时间
        hlsa.seek = function (time) {
            options.videoDOM.currentTime = time;
        };
        // 视频全屏
        hlsa.requestFullScreen = function () {
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
        hlsa.play = function () {
            options.videoDOM.play();
        };
        hlsa.stop = function () {
            options.videoDOM.pause();
            options.videoDOM.currentTime = 0;
        };
        hlsa.pause = function () {
            options.videoDOM.pause();
        };
        hlsa.toggle = function () {
        };
        hlsa.switchVideo = function () {
        };
        hlsa.volume = function () {
        };
        hlsa.video = options.videoDOM;
        hlsa.duration = options.videoDOM.duration;
        hlsa.paused = options.videoDOM.isPaused;
    });
    return hlsa;
}
exports.default = createHlsVideo;
