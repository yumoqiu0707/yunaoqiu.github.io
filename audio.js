const AudioMgr = {
  bgmEnable: true,
  bgmAudio: null,
  moveAudio: null,
  mergeAudio: null,
  init() {
    this.bgmAudio = document.getElementById('bgmAudio');
    this.moveAudio = document.getElementById('moveAudio');
    this.mergeAudio = document.getElementById('mergeAudio');
    
    // 打开自动放BGM
    this.bgmAudio.volume = 0.3;
    this.bgmAudio.play();

    const btn = document.getElementById('bgmBtn');
    // 初始播放状态，显示播放
    btn.innerText = "🔊 播放";

    btn.onclick = () => {
      this.bgmEnable = !this.bgmEnable;
      if(this.bgmEnable){
        this.bgmAudio.play();
        btn.innerText = "🔊 播放"; // 播放状态显示播放
      }else{
        this.bgmAudio.pause();
        btn.innerText = "🔇 静音"; // 静音状态显示静音
      }
    };
  },
  playMove() {
    if (!this.bgmEnable) return;
    this.moveAudio.currentTime = 0;
    this.moveAudio.play();
  },
  playMerge() {
    if (!this.bgmEnable) return;
    this.mergeAudio.currentTime = 0;
    this.mergeAudio.play();
  }
};
AudioMgr.init();