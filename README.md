# 安装
```npm
npm install --save cocos-hls-player
npm install --save hls.js
```
# 使用
```javascript
import * as Hls from 'hls.js'
import createHlsVideo from 'cocos-hls-player'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

  @property(cc.VideoPlayer)
  VideoPlayer: cc.VideoPlayer = null;

  private hls = null

  start() {
    console.log(createHlsVideo)

    this.hls = createHlsVideo({
      hls: Hls,
      videoDOM: this.VideoPlayer._impl._video,
      volume: 1,
      videoURL: {
        '1080': 'http://localhost:8080/m3u8/1/b190611da88946d89713f2b87369fa9d.m3u8',
        '720': 'http://localhost:8080/m3u8/1/b190611da88946d89713f2b87369fa9d.m3u8',
        origin: 'https://stream.quanren.cn/hls/6fddaea806934e1b9e5e7015121504c8/720/c50f5d91dc8d4e3f8b2e4ea582fe0b51.m3u8'
      },
      timeUpdate: this.timeUpdate,
    })
  }

  // 添加URL
  addRemoteUrl() {

  }

  // 更换播放地址URL
  changeRemoteUrl() {

  }

  // 没帧更新
  timeUpdate(currentTime, duration, percentage) {
    console.log(currentTime, duration, percentage)
  }

  // 从10秒开始播放
  setCurrentTime() {
    this.hls.seek(5)
  }

  // 播放
  playVideo() {
    this.hls.play()
  }

  // 停止
  stopVideo() {
    this.hls.stop()
  }

  // 暂停
  pauseVideo() {
    this.hls.pause()
  }

}

```