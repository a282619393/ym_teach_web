<template>
  <!-- <div  class="prism-player" id="J_prismPlayer"></div> -->
  <div>

    <div class="realize">

      <div class="prism-player" :id="playerId" :style="playStyle" v-show="videoTab && playauth!=''"></div>
      <div v-show="!videoTab" v-if="bookContent" class="bookContent" v-html="bookContent"></div>
    </div>
    <div class="realize-link clear">
      <div
        @click="videoTab=true"
        v-show="playauth"
        class="realize-link-btn"
        :class="videoTab==true?'act':''"
      >视频讲解</div>
      <div
        @click="videoTabBtn"
        class="realize-link-btn"
        :class="videoTab==true?'':'act'"
        v-if="bookContent"
      >讲解板书</div>
    </div>
  </div>
</template>

<script>
// import '../api/aliplayer-h5-min'
// import '../api/aliplayer-min'
export default {
  name: "Aliplayer",
  props: {
    bookCt: {
      type: Boolean,
      default: false
    },
    bookContent: {
      type: String,
      default: ""
    },
    playStyle: {
      type: String,
      default: ""
    },
    aliplayerSdkPath: {
      // Aliplayer 代码的路径
      type: String,
      default: "//g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js"
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    isLive: {
      type: Boolean,
      default: false
    },
    playsinline: {
      // H5是否内置播放，有的Android浏览器不起作用。
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "900px"
    },
    height: {
      type: String,
      default: "540px"
    },
    controlBarVisibility: {
      // 控制面板的实现，默认为‘hover’， 可选的值为：‘click’、‘hover’、‘always’。
      type: String,
      default: "hover"
    },
    useH5Prism: {
      type: Boolean,
      default: true
    },
    useFlashPrism: {
      type: Boolean,
      default: false
    },
    vid: {
      type: String,
      default: "4bf36118ceab48c5aef0f919b4dc53b3"
    },
    playauth: {
      type: String,
      default: ""
    },
    source: {
      type: String,
      default:
        "http://video.ymgxjy.com/customerTrans/4946d9a9c5efcafa37536625ac3974d2/1c28f6c-16e4ee493de-0006-8b68-b13-29f07.mp4"
    },
    cover: {
      type: String,
      default: ""
    },
    format: {
      type: String,
      default: "m3u8"
    },
    skinLayout: {
      type: Array,
      default: function() {
        return [];
      }
    },
    x5_video_position: {
      type: String,
      default: "top"
    },
    x5_type: {
      type: String,
      default: "h5"
    },
    x5_fullscreen: {
      type: Boolean,
      default: false
    },
    x5_orientation: {
      type: Number,
      default: 2
    },
    autoPlayDelay: {
      type: Number,
      default: 0
    },
    autoPlayDelayDisplayText: {
      type: String
    }
  },
  data() {
    return {
      videoTab: true,
      playerId:
        "aliplayer" +
        Math.random()
          .toString(36)
          .substr(2),
      scriptTagStatus: 2,
      isReload: false,
      instance: null
    };
  },
  created() {
      this.playauth == "" ? (this.videoTab = false) : "";
    if (window.Aliplayer !== undefined) {
      // 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器
      this.scriptTagStatus = 2;
      this.initAliplayer();
    } else {
      // 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
      this.insertScriptTag();
    }
  },
  mounted() {
    // if (window.Aliplayer !== undefined) {
    //   // 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器
    //   this.scriptTagStatus = 2;
    //   this.initAliplayer();
    // } else {
    //   // 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
    //   this.insertScriptTag();
    // }
  },
  methods: {
    videoTabBtn() {
      this.videoTab = false;
      this.pause();
    },
    insertScriptTag() {

      const _this = this;
      let playerScriptTag = document.getElementById("playerScriptTag");
      // 如果这个tag不存在，则生成相关代码tag以加载代码
      if (playerScriptTag === null) {
        playerScriptTag = document.createElement("script");
        playerScriptTag.type = "text/javascript";
        playerScriptTag.src = this.aliplayerSdkPath;
        playerScriptTag.id = "playerScriptTag";
        let s = document.getElementsByTagName("head")[0];
        s.appendChild(playerScriptTag);
      }
      //if (playerScriptTag.loaded) {
      //   _this.scriptTagStatus++;
      // } else {
      playerScriptTag.addEventListener("load", () => {
        // _this.scriptTagStatus++;
        playerScriptTag.loaded = true;
        _this.initAliplayer();
      });
      // }
      //  _this.initAliplayer();
    },
    initAliplayer() {
      const _this = this;
      // scriptTagStatus 为 2 的时候，说明两个必需引入的 js 文件都已经被引入，且加载完成
      if (
        _this.scriptTagStatus === 2 &&
        (_this.instance === null || _this.reloadPlayer)
      ) {
        _this.instance && _this.instance.dispose();
        //document.querySelector("#" + _this.playerId).innerHTML = "";
        // Vue 异步执行 DOM 更新，这样一来代码执行到这里的时候可能 template 里面的 script 标签还没真正创建
        // 所以，我们只能在 nextTick 里面初始化 Aliplayer
        _this.$nextTick(() => {
          if (!_this.instance) {
            _this.instance = new Aliplayer({
              id: _this.playerId,
              autoplay: false,
              isLive: _this.isLive,
              playsinline: _this.playsinline,
              format: _this.format,
              width: _this.width,
              height: _this.height,
              controlBarVisibility: _this.controlBarVisibility,
              useH5Prism: _this.useH5Prism,
              useFlashPrism: _this.useFlashPrism,
              encryptType: 1,
              vid: _this.vid,
              playauth: _this.playauth,
              //source: _this.source,
              cover: _this.cover,
              // skinLayout: _this.skinLayout, // 说明：功能组件布局配置，不传该字段使用默认布局传false隐藏所有功能组件，请参照皮肤定制
              x5_video_position: _this.x5_video_position,
              x5_type: _this.x5_type,
              x5_fullscreen: _this.x5_fullscreen,
              x5_orientation: _this.x5_orientation,
              autoPlayDelay: _this.autoPlayDelay,
              autoPlayDelayDisplayText: _this.autoPlayDelayDisplayText,
              skinLayout: [
                {
                  name: "bigPlayButton",
                  align: "blabs",
                  x: 30,
                  y: 80
                },
                {
                  name: "H5Loading",
                  align: "cc"
                },
                {
                  name: "errorDisplay",
                  align: "tlabs",
                  x: 0,
                  y: 0
                },
                {
                  name: "infoDisplay"
                },
                {
                  name: "tooltip",
                  align: "blabs",
                  x: 0,
                  y: 56
                },
                {
                  name: "thumbnail"
                },
                {
                  name: "controlBar",
                  align: "blabs",
                  x: 0,
                  y: 0,
                  children: [
                    {
                      name: "progress",
                      align: "blabs",
                      x: 0,
                      y: 44
                    },
                    {
                      name: "playButton",
                      align: "tl",
                      x: 15,
                      y: 12
                    },
                    {
                      name: "timeDisplay",
                      align: "tl",
                      x: 10,
                      y: 7
                    },
                    {
                      name: "fullScreenButton",
                      align: "tr",
                      x: 10,
                      y: 12
                    },
                    {
                      name: "setting",
                      align: "tr",
                      x: 15,
                      y: 12
                    },
                    {
                      name: "volume",
                      align: "tr",
                      x: 5,
                      y: 10
                    }
                  ]
                }
              ]
            });
            // 绑定事件，当 AliPlayer 初始化完成后，将编辑器实例通过自定义的 ready 事件交出去
            _this.instance.on("ready", () => {
              _this.$emit("ready", _this.instance);
            });
            _this.instance.on("play", () => {
              _this.$emit("play", _this.instance);
            });
            _this.instance.on("pause", () => {
              _this.$emit("pause", _this.instance);
            });
            _this.instance.on("ended", () => {
              _this.$emit("ended", _this.instance);
            });
            _this.instance.on("liveStreamStop", () => {
              _this.$emit("liveStreamStop", _this.instance);
            });
            _this.instance.on("m3u8Retry", () => {
              _this.$emit("m3u8Retry", _this.instance);
            });
            _this.instance.on("hideBar", () => {
              _this.$emit("hideBar", _this.instance);
            });
            _this.instance.on("waiting", () => {
              _this.$emit("waiting", _this.instance);
            });
            _this.instance.on("snapshoted", () => {
              _this.$emit("snapshoted", _this.instance);
            });
            _this.instance.on("timeupdate", () => {
              _this.$emit("timeupdate", _this.instance);
            });
            _this.instance.on("requestFullScreen", () => {
              _this.$emit("requestFullScreen", _this.instance);
            });
            _this.instance.on("cancelFullScreen", () => {
              _this.$emit("cancelFullScreen", _this.instance);
            });
            _this.instance.on("error", () => {
              _this.$emit("error", _this.instance);
            });
            _this.instance.on("startSeek", () => {
              _this.$emit("startSeek", _this.instance);
            });
            _this.instance.on("completeSeek", () => {
              _this.$emit("completeSeek", _this.instance);
            });
          } else {
            _this.instance.dispose();
            // 将播放器实例重置
            _this.instance = null;
            // 清空播放器 DOM 内容
            document.getElementById(_this.playerId).innerHTML = "";
            _this.initAliplayer();
          }
        });
      }
    },
    /**
     * 播放视频
     */
    play: function() {
      this.instance.play();
    },
    /**
     * 暂停视频
     */
    pause: function() {
      this.instance.pause();
    },
    /**
     * 重播视频
     */
    replay: function() {
      this.instance.replay();
    },
    /**
     * 跳转到某个时刻进行播放
     * @argument time 的单位为秒
     */
    seek: function(time) {
      this.instance.seek(time);
    },
    /**
     * 获取当前时间 单位秒
     */
    getCurrentTime: function() {
      return this.instance.getCurrentTime();
    },
    /**
     *获取视频总时长，返回的单位为秒
     * @returns 返回的单位为秒
     */
    getDuration: function() {
      return this.instance.getDuration();
    },
    /**
             获取当前的音量，返回值为0-1的实数ios和部分android会失效
            */
    getVolume: function() {
      return this.instance.getVolume();
    },
    /**
             设置音量，vol为0-1的实数，ios和部分android会失效
            */
    setVolume: function(vol) {
      this.instance.setVolume(vol);
    },
    /**
     *直接播放视频url，time为可选值（单位秒）目前只支持同种格式（mp4/flv/m3u8）之间切换暂不支持直播rtmp流切换
     *@argument url 视频地址
     *@argument time 跳转到多少秒
     */
    loadByUrl: function(url, time) {
      this.instance.loadByUrl(url, time);
    },
    /**
     * 设置播放速度
     *@argument speed 速度
     */
    // setSpeed: function(speed) {
    //   this.instance.setSpeed(speed);
    // },
    /**
     * 设置播放器大小w,h可分别为400px像素或60%百分比chrome浏览器下flash播放器分别不能小于397x297
     *@argument w 播放器宽度
     *@argument h 播放器高度
     */
    setPlayerSize: function(w, h) {
      this.instance.setPlayerSize(w, h);
    },
    /**
     * 目前只支持HTML5界面上的重载功能,暂不支持直播rtmp流切换m3u8）之间切换,暂不支持直播rtmp流切换
     *@argument vid 视频id
     *@argument playauth 播放凭证
     */
    reloaduserPlayInfoAndVidRequestMts: function(vid, playauth) {
      this.instance.reloaduserPlayInfoAndVidRequestMts(vid, playauth);
    },
    reloadPlayer: function() {
      this.isReload = true;
      this.initAliplayer();
      this.isReload = false;
    },
    dispose: function() {
      this.instance.dispose();
    },
    ended: function(url) {
      this.instance.loadByUrl(url);
    }
  },
  watch: {
    playauth(newVal, oldVal) {
        this.playauth == "" ? (this.videoTab = false) : (this.videoTab = true);
      if (newVal != oldVal && newVal != "") {

        this.instance.dispose();
        // 将播放器实例重置
        this.instance = null;
        // 清空播放器 DOM 内容
        document.getElementById(this.playerId).innerHTML = "";
        this.initAliplayer();
      }
    },
    bookContent(newVal, oldVal){

    }
  },
  beforeDestroy() {}
};
</script>

<style lang="postcss" scoped>
@import "https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css";
</style>
<style scoped lang="scss" >
.realize {
  width: 900px;
  height: 544px;
  margin: 0 auto;

  background: #282828;
  position: relative;
  z-index: 99;
  // text-align: center;
}
.realize-link {
  width: 900px;
  min-height: 40px;
  margin: 40px auto 0;
  position: relative;
  .realize-link-btn {
    float: left;
    width: 120px;

    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    text-align: center;
    color: #0067e4;
    font-size: 16px;
    border: 1px solid #0067e4;
    cursor: pointer;
    margin: 0 15px;
  }
  .realize-link-btn:hover,
  .act {
    background: url(../../assets/images/button.png);
    background-size: 100% 100%;
    color: $colorfff;
    border: none;
    line-height: 40px;
  }
}
.bookContent {
  width: 900px;
  height: 100%;
  margin: 0 auto;
  padding: 25px;
  background: #fff;
  overflow-y: scroll;
}
.prism-player {
  margin: 0 auto;
}
.prism-player .prism-liveshift-progress .prism-progress-played,
.prism-player .prism-progress .prism-progress-played {
  background: url(../../assets/images/Filled.png);
}
</style>
<style  >
  .prism-setting-cc,
  .prism-setting-audio {
    display: none !important;
  }
  .prism-player .prism-play-animation,.prism-player .prism-pause-animation{
    display: none;
  }
</style>
