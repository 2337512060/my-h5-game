// 创建音频上下文
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 生成点击音效
function generateClickSound() {
    // 创建振荡器
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // 设置音频参数
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    // 设置音量
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    // 连接节点
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 播放音效
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// 导出函数
export { generateClickSound }; 