"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = void 0;
// import * as Hls from "hls.js";
//
//
// type Options = {
//   videoDOM: HTMLVideoElement,
//   videoURL: {
//     '1080': string,
//     '720': string,
//   },
//   timeUpdate: Function
// }
//
//
// export function createHlsVideo(options: Options) {
//   // @ts-ignore
//   if (!Hls.isSupported()) {
//     return new Error('不支持 HLS')
//   }
//
//   // @ts-ignore
//   const hls = new Hls();
//   hls.attachMedia(options.videoDOM);
//
//   options.videoDOM.addEventListener("timeupdate", function () {
//     const {currentTime, duration} = options.videoDOM
//     options.timeUpdate(currentTime, duration, currentTime / duration * 100)
//   }, false)
//
//   // 监听 获取video标签成功
//   hls.on(Hls.Events.MEDIA_ATTACHED, () => {
//
//     console.warn('HLS 已绑定 Video 标签', options.videoDOM);
//     /*
//     * 加载视频资源
//     * string 类型 直接读取 object 则进行清晰度切换
//     * 根据文件名 判断视频类型
//     * */
//     let next: any
//     let urls: any = null
//     let tail: any = null // 尾节点
//     let arr = [] // url 数组
//     for (let key in options.videoURL) {
//
//       arr.push({
//         // @ts-ignore
//         url: options.videoURL[key],
//         type: key
//       })
//     }
//     // @ts-ignore
//     arr.sort((a: any, b: any) => {
//       if (a.type === 'origin' || b.type === 'origin') {
//         return false
//       }
//       return Number(b.type) - Number(a.type)
//     })
//     arr.forEach((item) => {
//       if (urls === null) {
//         tail = urls = {
//           data: {
//             url: item.url,
//             type: item.type
//           },
//           next: null
//         }
//       } else {
//         let node = {
//           data: {
//             url: item.url,
//             type: item.type
//           },
//           next: null
//         }
//         tail.next = node
//         tail = node
//       }
//     })
//     tail = null
//     // arr = null
//
//     console.log(urls)
//     next = urls.next
//
//     hls.loadSource(urls.data.url);
//
//     // @ts-ignore m3u8 文件解析成功
//     hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
//       console.warn('m3u8 清单已加载', data)
//     });
//
//     // @ts-ignore 错误处理
//     hls.on(Hls.Events.ERROR, (event, data) => {
//       console.log(event, data, 'Hls.Error')
//       const errorType = data.type;
//       const errorDetails = data.details;
//       const errorFatal = data.fatal;
//       if (data.fatal) {
//         switch (errorType) {
//           case Hls.ErrorTypes.NETWORK_ERROR:
//             // try to recover network error
//             console.error('网络错误')
//             console.error('错误信息：' + errorDetails + '，致命性：' + errorFatal)
//             console.warn(hls.loadLevel, 123123)
//             hls.startLoad(); // 应调用以恢复网络错误。
//
//
//             if (next === undefined) {
//               throw new Error('所有连接均不能播放')
//             }
//             hls.loadSource(next.data.url);
//             if (next.next) {
//               next = next.next
//             } else {
//               next = undefined
//             }
//
//             break;
//           case Hls.ErrorTypes.MEDIA_ERROR:
//             console.error('媒体错误');
//             hls.recoverMediaError(); // 应调用以恢复媒体错误。
//             break;
//           case Hls.ErrorTypes.KEY_SYSTEM_ERROR:
//             console.error('系统错误');
//             hls.destroy();
//             break;
//           case Hls.ErrorTypes.MUX_ERROR:
//             console.error('MUX 错误');
//             hls.destroy();
//             break;
//           case Hls.ErrorTypes.OTHER_ERROR:
//             console.error('其他错误');
//             hls.destroy();
//             break;
//           default:
//             hls.destroy();
//             break;
//         }
//       }
//     });
//
//     // 指定播放时间
//     hls.seek = function (time: number) {
//       options.videoDOM.currentTime = time
//     }
//     // 视频全屏
//     hls.requestFullScreen = function () {
//       let fullScreen = [
//         'requestFullScreen',
//         'mozRequestFullScreen',
//         'webkitRequestFullScreen'
//       ]
//       const {videoDOM} = options
//       fullScreen.forEach((item) => {
//         // @ts-ignore
//         if (videoDOM[item]) {
//           // @ts-ignore
//           videoDOM[item]()
//           return
//         }
//       })
//       this.VideoPlayer.play()
//     }
//     hls.play = function () {
//       options.videoDOM.play()
//     }
//
//     hls.stop = function () {
//       options.videoDOM.pause()
//       options.videoDOM.currentTime = 0
//     }
//
//     hls.pause = function () {
//       options.videoDOM.pause()
//     }
//
//     hls.toggle = function () {
//     }
//
//     hls.switchVideo = function () {
//     }
//
//     hls.volume = function () {
//     }
//
//     hls.video = options.videoDOM
//     hls.duration = options.videoDOM.duration
//     // hls.paused = options.videoDOM.isPaused
//
//
//   });
//
//
//   return hls
// }
function add(a, b) {
    return a + b;
}
exports.add = add;
