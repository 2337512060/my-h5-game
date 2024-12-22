// 游戏主逻辑

// 游戏状态
const gameState = {
    currentLevel: 0,
    levelsUnlocked: [true, true], // 两个关卡都解锁
    levelScores: [0, 0] // 每关分数
};

// 初始化游戏
function initGame() {
    setMobileViewport();
    loadGameProgress();
    updateLevelButtons();
    attachEventListeners();
}

// 加载游戏进度
function loadGameProgress() {
    const savedProgress = localStorage.getItem('gameProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        gameState.levelsUnlocked = progress.levelsUnlocked;
        gameState.levelScores = progress.levelScores;
    }
}

// 保存游戏进度
function saveGameProgress() {
    const progress = {
        levelsUnlocked: gameState.levelsUnlocked,
        levelScores: gameState.levelScores
    };
    localStorage.setItem('gameProgress', JSON.stringify(progress));
}

// 更新关卡按钮状态
function updateLevelButtons() {
    const level1Btn = document.getElementById('level1');
    const level2Btn = document.getElementById('level2');

    // 只显示最高分信息
    if (gameState.levelScores[0] > 0) {
        level1Btn.title = `最高分：${gameState.levelScores[0]}`;
    }
    if (gameState.levelScores[1] > 0) {
        level2Btn.title = `最高分：${gameState.levelScores[1]}`;
    }
}

// 开始游戏
function startGame(level) {
    gameState.currentLevel = level;
    hideAllLevelContainers();
    
    // 显示对应关卡
    document.querySelector(`.level${level}-container`).style.display = 'block';
    document.querySelector('.start-screen').style.display = 'none';

    // 初始化关卡
    if (level === 1) {
        initLevel1();
    } else if (level === 2) {
        initLevel2();
    }
}

// 隐藏所有关卡容器
function hideAllLevelContainers() {
    document.querySelectorAll('[class^="level"]').forEach(container => {
        if (container.classList.contains('level-btn')) return;
        container.style.display = 'none';
    });
}

// 完成关卡
function completeLevel(level, score) {
    // 更新最高分
    if (score > gameState.levelScores[level - 1]) {
        gameState.levelScores[level - 1] = score;
    }

    saveGameProgress();
    updateLevelButtons();
}

// 返回主菜单
function returnToMenu() {
    hideAllLevelContainers();
    document.querySelector('.start-screen').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
}

// 重新开始当前关卡
function restartLevel() {
    if (gameState.currentLevel === 1) {
        initLevel1();
    } else if (gameState.currentLevel === 2) {
        initLevel2();
    }
    document.getElementById('game-over').style.display = 'none';
}

// 添加事件监听器
function attachEventListeners() {
    // 关卡选择按钮
    const level1Btn = document.getElementById('level1');
    const level2Btn = document.getElementById('level2');
    const startGameBtn = document.getElementById('startGame');

    // 添加点击和触摸事件
    addTouchSupport(level1Btn, () => startGame(1));
    addTouchSupport(level2Btn, () => window.location.href = 'level2.html');
    addTouchSupport(startGameBtn, () => {
        document.querySelector('.start-screen').style.display = 'block';
        document.querySelector('.level-selection').style.display = 'block';
    });
}

// 添加触摸支持
function addTouchSupport(element, callback) {
    if (!element) return;

    // 处理点击事件
    element.addEventListener('click', (e) => {
        e.preventDefault();
        callback();
    });

    // 处理触摸事件
    let touchStartTime;
    let touchStartX;
    let touchStartY;

    element.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        element.classList.add('active');
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
        const touchEndTime = Date.now();
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        // 检查是否为有效的点击（时间短且移动距离小）
        const touchDuration = touchEndTime - touchStartTime;
        const touchDistance = Math.sqrt(
            Math.pow(touchEndX - touchStartX, 2) +
            Math.pow(touchEndY - touchStartY, 2)
        );

        element.classList.remove('active');

        if (touchDuration < 300 && touchDistance < 20) {
            e.preventDefault();
            callback();
        }
    });

    element.addEventListener('touchcancel', () => {
        element.classList.remove('active');
    });
}

// 检测设备类型
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") 
        || (navigator.userAgent.indexOf('IEMobile') !== -1)
        || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 设置移动端视口
function setMobileViewport() {
    if (isMobileDevice()) {
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
    }
}

// 当文档加载完成时初始化游戏
document.addEventListener('DOMContentLoaded', initGame); 