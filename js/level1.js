// 游戏状态
const level1State = {
    score: 0,
    timeLeft: 60,
    isGameRunning: false,
    trafficLights: {
        northSouth: false,
        eastWest: false
    },
    vehicles: [],
    passedVehicles: 0,
    timer: null,
    vehicleGenerationInterval: null
};

// 车辆类型
const VEHICLE_TYPES = {
    CAR: 'car',
    TRUCK: 'truck'
};

// 方向
const DIRECTIONS = {
    NORTH: 'north',
    SOUTH: 'south',
    EAST: 'east',
    WEST: 'west'
};

// DOM元素
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const waitingVehiclesElement = document.getElementById('waiting-vehicles');
const passedVehiclesElement = document.getElementById('passed-vehicles');
const vehiclesContainer = document.getElementById('vehicles-container');
const toggleNSButton = document.getElementById('toggleNS');
const toggleEWButton = document.getElementById('toggleEW');

// 音效系统
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 生成点击音效
function generateClickSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// 生成成功音效
function generateSuccessSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
}

// 生成失败音效
function generateFailureSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
}

// 显示游戏说明
function showTutorial() {
    const tutorial = document.createElement('div');
    tutorial.className = 'tutorial-modal';
    tutorial.innerHTML = `
        <div class="tutorial-content">
            <h2>紧急情况！</h2>
            <div class="story-container">
                <p class="story">新纪元城市的主要交通路口发生了系统故障！核心运算中枢（CCH）暂时失去了对该路口的控制。</p>
                
                <p class="story-detail">情况说明：<br>
                在新纪元城市，所有的无人驾驶汽车都通过量子网络接入城市的核心运算中枢（CCH）。CCH为每辆车提供实时的路径规划和行驶决策支持，这种中央化的运算模式使得城市的交通效率达到了前所未有的高度。</p>
                
                <p class="story-detail">然而今天，由于城市中心商务区举办大型展会，大量车辆涌入，导致CCH面临前所未有的运算压力。在这个繁忙的交通路口，过载的运算负荷导致CCH对该区域的车辆失去了控制能力。</p>
                
                <p class="story-detail">作为新晋的交通系统操作员，你需要立即启动应急预案，手动接管这个路口的交通管理工作。在CCH恢复正常运转之前，这里的每一辆车都需要你的指挥！</p>
            </div>
            
            <h3>任务目标</h3>
            <ul>
                <li>在60秒内尽可能多地疏导车辆通过路口</li>
                <li>避免交通堵塞和车辆碰撞</li>
                <li>小轿车通过得10分，大卡车通过得20分</li>
            </ul>
            
            <h3>操作说明</h3>
            <ul>
                <li>点击"南北方向"按钮控制南北向红绿灯</li>
                <li>点击"东西方向"按钮控制东西向红绿灯</li>
                <li>注意：南北和东西方向不能同时为绿灯！</li>
                <li>绿灯方向的车辆会自动通行</li>
                <li>红灯方向的车辆会自动停止</li>
            </ul>
            
            <h3>评分标准</h3>
            <ul>
                <li>优秀：200分以上 - CCH恢复运转前完美地维持了交通秩序</li>
                <li>良好：150-199分 - 基本保证了交通的正常运转</li>
                <li>及格：100-149分 - 勉强维持了路口的基本秩序</li>
                <li>失败：100分以下 - 造成了严重的交通堵塞</li>
            </ul>
            
            <button class="start-btn" onclick="startActualGame(this.parentElement.parentElement)">
                <span class="btn-text">立即接管</span>
                <span class="btn-icon">→</span>
            </button>
        </div>
    `;
    document.body.appendChild(tutorial);
}

// 实际开始游戏
function startActualGame(tutorialModal) {
    tutorialModal.remove();
    level1State.isGameRunning = true;
    startVehicleGeneration();
    startTimer();
}

// 初始化第一关
function initLevel1() {
    // 重置游戏状态
    level1State.score = 0;
    level1State.timeLeft = 60;
    level1State.isGameRunning = false;
    level1State.vehicles = [];
    level1State.passedVehicles = 0;
    level1State.trafficLights.northSouth = false;
    level1State.trafficLights.eastWest = false;
    
    // 清除所有定时器
    if (level1State.timer) clearInterval(level1State.timer);
    if (level1State.vehicleGenerationInterval) clearInterval(level1State.vehicleGenerationInterval);
    
    // 清空车辆容器
    vehiclesContainer.innerHTML = '';
    
    // 重置红绿灯显示
    updateTrafficLights();
    
    // 更新显示
    updateDisplay();
    
    // 添加事件监听器
    addEventListeners();
    
    // 显示游戏说明
    showTutorial();
}

// 添加事件监听器
function addEventListeners() {
    toggleNSButton.addEventListener('click', () => toggleTrafficLight('northSouth'));
    toggleEWButton.addEventListener('click', () => toggleTrafficLight('eastWest'));
}

// 切换红绿灯
function toggleTrafficLight(direction) {
    if (!level1State.isGameRunning) return;
    
    generateClickSound();
    
    if (direction === 'northSouth') {
        level1State.trafficLights.northSouth = !level1State.trafficLights.northSouth;
        if (level1State.trafficLights.northSouth) {
            level1State.trafficLights.eastWest = false;
        }
    } else {
        level1State.trafficLights.eastWest = !level1State.trafficLights.eastWest;
        if (level1State.trafficLights.eastWest) {
            level1State.trafficLights.northSouth = false;
        }
    }
    
    updateTrafficLights();
    updateVehiclesMovement();
}

// 更新红绿灯显示
function updateTrafficLights() {
    const northLight = document.querySelector('.traffic-light.north');
    const southLight = document.querySelector('.traffic-light.south');
    const eastLight = document.querySelector('.traffic-light.east');
    const westLight = document.querySelector('.traffic-light.west');
    
    // 更新南北方向
    northLight.classList.toggle('green', level1State.trafficLights.northSouth);
    southLight.classList.toggle('green', level1State.trafficLights.northSouth);
    toggleNSButton.classList.toggle('active', level1State.trafficLights.northSouth);
    
    // 更新东西方向
    eastLight.classList.toggle('green', level1State.trafficLights.eastWest);
    westLight.classList.toggle('green', level1State.trafficLights.eastWest);
    toggleEWButton.classList.toggle('active', level1State.trafficLights.eastWest);
}

// 生成车辆
function generateVehicle() {
    if (!level1State.isGameRunning) return;
    
    const direction = getRandomDirection();
    const type = Math.random() > 0.7 ? VEHICLE_TYPES.TRUCK : VEHICLE_TYPES.CAR;
    
    const vehicle = {
        id: Date.now(),
        type: type,
        direction: direction,
        position: getStartPosition(direction),
        element: createVehicleElement(type, direction)
    };
    
    level1State.vehicles.push(vehicle);
    vehiclesContainer.appendChild(vehicle.element);
    updateDisplay();
}

// 获取随机方向
function getRandomDirection() {
    const directions = Object.values(DIRECTIONS);
    return directions[Math.floor(Math.random() * directions.length)];
}

// 获取起始位置
function getStartPosition(direction) {
    const positions = {
        [DIRECTIONS.NORTH]: { x: 42, y: 100 }, // 调整起始位置
        [DIRECTIONS.SOUTH]: { x: 58, y: -10 },
        [DIRECTIONS.EAST]: { x: -10, y: 42 },
        [DIRECTIONS.WEST]: { x: 100, y: 58 }
    };
    return positions[direction];
}

// 创建车辆元素
function createVehicleElement(type, direction) {
    const vehicle = document.createElement('div');
    vehicle.className = `vehicle ${type}`;
    
    // 设置初始位置和旋转
    const position = getStartPosition(direction);
    vehicle.style.left = `${position.x}%`;
    vehicle.style.top = `${position.y}%`;
    
    // 设置旋转
    switch (direction) {
        case DIRECTIONS.NORTH:
            vehicle.style.transform = 'rotate(270deg)';
            break;
        case DIRECTIONS.SOUTH:
            vehicle.style.transform = 'rotate(90deg)';
            break;
        case DIRECTIONS.EAST:
            vehicle.style.transform = 'rotate(0deg)';
            break;
        case DIRECTIONS.WEST:
            vehicle.style.transform = 'rotate(180deg)';
            break;
    }
    
    // 添加出现动画
    addVehicleAppearanceAnimation(vehicle);
    
    return vehicle;
}

// 更新车辆移动
function updateVehiclesMovement() {
    level1State.vehicles.forEach(vehicle => {
        const canMove = (
            (vehicle.direction === DIRECTIONS.NORTH || vehicle.direction === DIRECTIONS.SOUTH) && level1State.trafficLights.northSouth ||
            (vehicle.direction === DIRECTIONS.EAST || vehicle.direction === DIRECTIONS.WEST) && level1State.trafficLights.eastWest
        );
        
        if (canMove) {
            moveVehicle(vehicle);
        }
    });
}

// 移动车辆
function moveVehicle(vehicle) {
    const speed = vehicle.type === VEHICLE_TYPES.TRUCK ? 0.8 : 1.2; // 调整速度
    let newPosition;
    
    switch (vehicle.direction) {
        case DIRECTIONS.NORTH:
            newPosition = { x: vehicle.position.x, y: vehicle.position.y - speed };
            break;
        case DIRECTIONS.SOUTH:
            newPosition = { x: vehicle.position.x, y: vehicle.position.y + speed };
            break;
        case DIRECTIONS.EAST:
            newPosition = { x: vehicle.position.x + speed, y: vehicle.position.y };
            break;
        case DIRECTIONS.WEST:
            newPosition = { x: vehicle.position.x - speed, y: vehicle.position.y };
            break;
    }
    
    // 更新位置
    vehicle.position = newPosition;
    vehicle.element.style.left = `${newPosition.x}%`;
    vehicle.element.style.top = `${newPosition.y}%`;
    
    // 检查是否通过路口
    checkVehiclePassed(vehicle);
}

// 检查车辆是否通过路口
function checkVehiclePassed(vehicle) {
    let hasPassed = false;
    
    switch (vehicle.direction) {
        case DIRECTIONS.NORTH:
            hasPassed = vehicle.position.y < -10;
            break;
        case DIRECTIONS.SOUTH:
            hasPassed = vehicle.position.y > 100;
            break;
        case DIRECTIONS.EAST:
            hasPassed = vehicle.position.x > 100;
            break;
        case DIRECTIONS.WEST:
            hasPassed = vehicle.position.x < -10;
            break;
    }
    
    if (hasPassed) {
        // 移除车辆
        vehicle.element.remove();
        level1State.vehicles = level1State.vehicles.filter(v => v.id !== vehicle.id);
        
        // 更新分数和通过车辆数
        level1State.score += vehicle.type === VEHICLE_TYPES.TRUCK ? 20 : 10;
        level1State.passedVehicles++;
        
        // 更新显示
        updateDisplay();
        
        generateSuccessSound();
    }
}

// 开始生成车辆
function startVehicleGeneration() {
    if (level1State.vehicleGenerationInterval) {
        clearInterval(level1State.vehicleGenerationInterval);
    }
    
    level1State.vehicleGenerationInterval = setInterval(() => {
        if (level1State.isGameRunning && level1State.vehicles.length < 8) {
            generateVehicle();
        }
    }, 2000);
}

// 开始计时器
function startTimer() {
    if (level1State.timer) {
        clearInterval(level1State.timer);
    }
    
    level1State.timer = setInterval(() => {
        if (level1State.timeLeft > 0) {
            level1State.timeLeft--;
            timerElement.textContent = level1State.timeLeft;
        } else {
            endGame();
        }
    }, 1000);
}

// 更新显示
function updateDisplay() {
    scoreElement.textContent = level1State.score;
    waitingVehiclesElement.textContent = level1State.vehicles.length;
    passedVehiclesElement.textContent = level1State.passedVehicles;
    timerElement.textContent = level1State.timeLeft;
}

// 结束游戏
function endGame() {
    level1State.isGameRunning = false;
    clearInterval(level1State.timer);
    clearInterval(level1State.vehicleGenerationInterval);
    
    generateFailureSound();
    
    // 更新最终分数
    const finalScoreElement = document.getElementById('final-score');
    finalScoreElement.textContent = level1State.score;
    
    // 显示游戏结束模态框
    showGameOverModal();
    
    if (typeof completeLevel === 'function') {
        completeLevel('level1', level1State.score);
    }
}

// 重新开始关卡
function restartLevel() {
    hideGameOverModal();
    setTimeout(initLevel1, 300);
}

// 返回主菜单
function returnToMenu() {
    if (typeof window.returnToMenu === 'function') {
        window.returnToMenu();
    } else {
        window.location.href = '../index.html';
    }
}

// 游戏循环
function gameLoop() {
    if (level1State.isGameRunning) {
        updateVehiclesMovement();
    }
    requestAnimationFrame(gameLoop);
}

// 启动游戏循环
gameLoop();

// 显示游戏结束模态框
function showGameOverModal() {
    const modal = document.getElementById('game-over');
    modal.style.display = 'flex';
    // 添加show类触发动画
    setTimeout(() => modal.classList.add('show'), 10);
}

// 隐藏游戏结束模态框
function hideGameOverModal() {
    const modal = document.getElementById('game-over');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

// 更新分数显示时添加动画效果
function updateScore(newScore) {
    const scoreElement = document.getElementById('score');
    const scoreDiff = newScore - level1State.score;
    
    if (scoreDiff > 0) {
        // 创建飘动的分数提示
        const scorePopup = document.createElement('div');
        scorePopup.className = 'score-popup';
        scorePopup.textContent = `+${scoreDiff}`;
        scoreElement.parentElement.appendChild(scorePopup);
        
        // 触发动画后移除元素
        setTimeout(() => scorePopup.remove(), 1000);
    }
    
    level1State.score = newScore;
    scoreElement.textContent = newScore;
}

// 添加车辆出现的动画效果
function addVehicleAppearanceAnimation(vehicleElement) {
    vehicleElement.style.opacity = '0';
    vehicleElement.style.transform = 'scale(0.8)';
    
    requestAnimationFrame(() => {
        vehicleElement.style.transition = 'all 0.3s ease';
        vehicleElement.style.opacity = '1';
        vehicleElement.style.transform = 'scale(1)';
    });
}

// 添加车辆消失的动画效果
function addVehicleDisappearanceAnimation(vehicleElement) {
    return new Promise(resolve => {
        vehicleElement.style.transition = 'all 0.3s ease';
        vehicleElement.style.opacity = '0';
        vehicleElement.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            vehicleElement.remove();
            resolve();
        }, 300);
    });
}

// 添加CSS样式
const style = document.createElement('style');
style.textContent = `
    .score-popup {
        position: absolute;
        color: #1a2a6c;
        font-weight: bold;
        font-size: 1.2rem;
        pointer-events: none;
        animation: score-popup 1s ease-out forwards;
    }
    
    @keyframes score-popup {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 