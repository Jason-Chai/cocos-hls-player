"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHlsVideo = void 0;
var Hls = __importStar(require("hls.js"));
function createHlsVideo(options) {
    // @ts-ignore
    if (!Hls.isSupported()) {
        return new Error('不支持 HLS');
    }
    // @ts-ignore
    var hls = new Hls();
    hls.attachMedia(options.videoDOM);
    options.videoDOM.addEventListener("timeupdate", function () {
        var _a = options.videoDOM, currentTime = _a.currentTime, duration = _a.duration;
        options.timeUpdate(currentTime, duration, currentTime / duration * 100);
    }, false);
    // 监听 获取video标签成功
    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
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
                // @ts-ignore
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
        hls.loadSource(urls.data.url);
        // @ts-ignore m3u8 文件解析成功
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            console.warn('m3u8 清单已加载', data);
        });
        // @ts-ignore 错误处理
        hls.on(Hls.Events.ERROR, function (event, data) {
            console.log(event, data, 'Hls.Error');
            var errorType = data.type;
            var errorDetails = data.details;
            var errorFatal = data.fatal;
            if (data.fatal) {
                switch (errorType) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        // try to recover network error
                        console.error('网络错误');
                        console.error('错误信息：' + errorDetails + '，致命性：' + errorFatal);
                        console.warn(hls.loadLevel, 123123);
                        hls.startLoad(); // 应调用以恢复网络错误。
                        if (next === undefined) {
                            throw new Error('所有连接均不能播放');
                        }
                        hls.loadSource(next.data.url);
                        if (next.next) {
                            next = next.next;
                        }
                        else {
                            next = undefined;
                        }
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error('媒体错误');
                        hls.recoverMediaError(); // 应调用以恢复媒体错误。
                        break;
                    case Hls.ErrorTypes.KEY_SYSTEM_ERROR:
                        console.error('系统错误');
                        hls.destroy();
                        break;
                    case Hls.ErrorTypes.MUX_ERROR:
                        console.error('MUX 错误');
                        hls.destroy();
                        break;
                    case Hls.ErrorTypes.OTHER_ERROR:
                        console.error('其他错误');
                        hls.destroy();
                        break;
                    default:
                        hls.destroy();
                        break;
                }
            }
        });
        // 指定播放时间
        hls.seek = function (time) {
            options.videoDOM.currentTime = time;
        };
        // 视频全屏
        hls.requestFullScreen = function () {
            var fullScreen = [
                'requestFullScreen',
                'mozRequestFullScreen',
                'webkitRequestFullScreen'
            ];
            var videoDOM = options.videoDOM;
            fullScreen.forEach(function (item) {
                // @ts-ignore
                if (videoDOM[item]) {
                    // @ts-ignore
                    videoDOM[item]();
                    return;
                }
            });
            this.VideoPlayer.play();
        };
        hls.play = function () {
            options.videoDOM.play();
        };
        hls.stop = function () {
            options.videoDOM.pause();
            options.videoDOM.currentTime = 0;
        };
        hls.pause = function () {
            options.videoDOM.pause();
        };
        hls.toggle = function () {
        };
        hls.switchVideo = function () {
        };
        hls.volume = function () {
        };
        hls.video = options.videoDOM;
        hls.duration = options.videoDOM.duration;
        // hls.paused = options.videoDOM.isPaused
    });
    return hls;
}
exports.createHlsVideo = createHlsVideo;
