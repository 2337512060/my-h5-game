// 创建音频上下文
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 生成失败音效
function generateFailureSound() {
    // 创建振荡器
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // 设置音频参数
    oscillator.type = 'sine';
    
    // 下降音调
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
    
    // 设置音量
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    // 连接节点
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 播放音效
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
}

// 导出函数
export { generateFailureSound }; 