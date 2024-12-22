// 第二关：社会政策制定

// 游戏状态
const gameState = {
    currentDate: new Date(2050, 0), // 2050年1月
    endDate: new Date(2055, 0), // 2055年1月
    gameSpeed: 1,
    isPaused: false,
    budget: {
        monthly: 100, // 月度预算（万元）
        total: 1000, // 总预算（万元）
        used: 0 // 已使用预算
    },
    indicators: {
        economy: {
            value: 70,
            trend: 0,
            history: [70],
            target: 90
        },
        employment: {
            value: 80,
            trend: 0,
            history: [80],
            target: 95
        },
        satisfaction: {
            value: 75,
            trend: 0,
            history: [75],
            target: 90
        }
    },
    selectedPolicies: [], // 当月选择的政策
    implementedPolicies: [], // 已实施的政策历史
    activeEvents: [], // 当前活跃的事件
    eventHistory: [], // 历史事件记录
    score: 0,
    isGameOver: false,
    delayedEvents: [] // 延迟触发的事件
};

// 随机事件配置
const events = {
    unemploymentCrisis: {
        id: 'unemploymentCrisis',
        name: '失业危机',
        description: '由于自动驾驶技术的快速发展，传统运输行业工人失业率激增。',
        probability: 0.25, // 提高概率
        duration: 3,
        requirements: {
            economy: {min: 60, max: 100},
            employment: {min: 0, max: 70}
        },
        effects: {
            immediate: {
                employment: -10,
                satisfaction: -15
            },
            monthly: {
                economy: -2,
                employment: -1,
                satisfaction: -2
            }
        },
        policies: ['training', 'subsidy']
    },
    techBreakthrough: {
        id: 'techBreakthrough',
        name: '技术突破',
        description: '自动驾驶技术取得重大突破，提高了运营效率。',
        probability: 0.2, // 提高概率
        duration: 4,
        requirements: {
            economy: {min: 75, max: 100}
        },
        effects: {
            immediate: {
                economy: 8,
                employment: -5,
                satisfaction: 5
            },
            monthly: {
                economy: 3,
                employment: -1,
                satisfaction: 1
            }
        },
        policies: ['training', 'innovation']
    },
    publicProtest: {
        id: 'publicProtest',
        name: '公众抗议',
        description: '市民对自动驾驶替代人工的趋势表示担忧，发起抗议活动。',
        probability: 0.3, // 提高概率
        duration: 2,
        requirements: {
            satisfaction: {min: 0, max: 60}
        },
        effects: {
            immediate: {
                economy: -5,
                satisfaction: -10
            },
            monthly: {
                economy: -1,
                satisfaction: -3
            }
        },
        policies: ['subsidy', 'publicTransport']
    },
    infrastructureFailure: {
        id: 'infrastructureFailure',
        name: '基础设施故障',
        description: '自动驾驶系统的基础设施出现故障，影响城市运转。',
        probability: 0.35, // 提高概率
        duration: 2,
        requirements: {
            economy: {min: 0, max: 100}
        },
        effects: {
            immediate: {
                economy: -7,
                satisfaction: -8
            },
            monthly: {
                economy: -2,
                satisfaction: -2
            }
        },
        policies: ['infrastructure']
    },
    foreignInvestment: {
        id: 'foreignInvestment',
        name: '外商投资',
        description: '外国投资者对城市的自动驾驶发展前景看好，增加投资。',
        probability: 0.25, // 提高概率
        duration: 3,
        requirements: {
            economy: {min: 80, max: 100},
            satisfaction: {min: 70, max: 100}
        },
        effects: {
            immediate: {
                economy: 10,
                employment: 5
            },
            monthly: {
                economy: 2,
                employment: 1
            }
        },
        policies: ['innovation', 'infrastructure']
    },
    // 新增事件
    trafficAccident: {
        id: 'trafficAccident',
        name: '交通事故',
        description: '自动驾驶车辆发生交通事故，引发公众对安全性的担忧。',
        probability: 0.3,
        duration: 2,
        requirements: {
            satisfaction: {min: 0, max: 100}
        },
        effects: {
            immediate: {
                satisfaction: -12,
                economy: -3
            },
            monthly: {
                satisfaction: -2,
                economy: -1
            }
        },
        policies: ['infrastructure', 'innovation']
    },
    marketCompetition: {
        id: 'marketCompetition',
        name: '市场竞争加剧',
        description: '新的自动驾驶企业进入市场，加剧了行业竞争。',
        probability: 0.28,
        duration: 3,
        requirements: {
            economy: {min: 50, max: 100}
        },
        effects: {
            immediate: {
                economy: -5,
                employment: 3
            },
            monthly: {
                economy: -1,
                employment: 1
            }
        },
        policies: ['innovation', 'training']
    },
    environmentalChallenge: {
        id: 'environmentalChallenge',
        name: '环境挑战',
        description: '城市空气质量下降，市民呼吁发展更环保的交通系统。',
        probability: 0.32,
        duration: 4,
        requirements: {
            satisfaction: {min: 0, max: 80}
        },
        effects: {
            immediate: {
                satisfaction: -8,
                economy: -4
            },
            monthly: {
                satisfaction: -2,
                economy: -1
            }
        },
        policies: ['publicTransport', 'infrastructure']
    },
    techTalentShortage: {
        id: 'techTalentShortage',
        name: '技术人才短缺',
        description: '自动驾驶行业面临技术人才短缺问题，影响发展速度。',
        probability: 0.27,
        duration: 3,
        requirements: {
            economy: {min: 70, max: 100},
            employment: {min: 60, max: 100}
        },
        effects: {
            immediate: {
                economy: -6,
                employment: -4
            },
            monthly: {
                economy: -2,
                employment: -1
            }
        },
        policies: ['training', 'innovation']
    }
};

// 政策数据
const policies = {
    // 基础政策
    training: {
        id: 'training',
        name: '职业培训计划',
        description: '为传统交通从业者提供新技能培训，帮助他们适应新时代的需求。',
        category: 'employment',
        type: 'basic', // 基础政策
        cost: 200,
        duration: 3,
        effects: {
            immediate: {
                economy: -2,
                employment: 5,
                satisfaction: 2
            },
            monthly: {
                economy: 2,
                employment: 3,
                satisfaction: 1
            }
        }
    },
    subsidy: {
        id: 'subsidy',
        name: '失业补贴',
        description: '为受无人驾驶影响的从业者提供临时性经济援助。',
        category: 'social',
        type: 'basic',
        cost: 150,
        duration: 2,
        effects: {
            immediate: {
                economy: -1,
                employment: 0,
                satisfaction: 8
            },
            monthly: {
                economy: 0,
                employment: 2,
                satisfaction: 3
            }
        }
    },
    publicTransport: {
        id: 'publicTransport',
        name: '公共交通补贴',
        description: '提供公共交通补贴，降低市民出行成本。',
        category: 'social',
        cost: 100,
        duration: 4,
        effects: {
            immediate: {
                economy: 1,
                employment: 2,
                satisfaction: 5
            },
            monthly: {
                economy: 1,
                employment: 1,
                satisfaction: 2
            }
        }
    },
    innovation: {
        id: 'innovation',
        name: '创新研发基金',
        description: '投资未来交通技术研发，提升城市竞争力。',
        category: 'economy',
        cost: 250,
        duration: 6,
        effects: {
            immediate: {
                economy: 5,
                employment: -5,
                satisfaction: 0
            },
            monthly: {
                economy: 3,
                employment: 1,
                satisfaction: 1
            }
        }
    },
    infrastructure: {
        id: 'infrastructure',
        name: '基础设施升级',
        description: '升级城市交通基础设施，提高运营效率。',
        category: 'economy',
        cost: 300,
        duration: 4,
        effects: {
            immediate: {
                economy: -3,
                employment: 8,
                satisfaction: -2
            },
            monthly: {
                economy: 4,
                employment: 2,
                satisfaction: 3
            }
        }
    },
    // 随机政策（每月随机出现）
    aiPartnership: {
        id: 'aiPartnership',
        name: 'AI企业合作计划',
        description: '与领先的AI企业建立合作伙伴关系，共同开发智能交通系统。',
        category: 'economy',
        type: 'random',
        cost: 280,
        duration: 4,
        effects: {
            immediate: {
                economy: 8,
                employment: -3,
                satisfaction: 2
            },
            monthly: {
                economy: 4,
                employment: 1,
                satisfaction: 1
            }
        },
        probability: 0.3
    },
    greenTransport: {
        id: 'greenTransport',
        name: '绿色交通计划',
        description: '推广新能源自动驾驶车辆，减少碳排放。',
        category: 'social',
        type: 'random',
        cost: 220,
        duration: 3,
        effects: {
            immediate: {
                economy: -3,
                employment: 2,
                satisfaction: 7
            },
            monthly: {
                economy: 2,
                employment: 1,
                satisfaction: 3
            }
        },
        probability: 0.25
    },
    smartGrid: {
        id: 'smartGrid',
        name: '智能电网升级',
        description: '升级城市电网，支持大规模电动自动驾驶车队。',
        category: 'economy',
        type: 'random',
        cost: 350,
        duration: 5,
        effects: {
            immediate: {
                economy: -5,
                employment: 6,
                satisfaction: -2
            },
            monthly: {
                economy: 5,
                employment: 2,
                satisfaction: 2
            }
        },
        probability: 0.2
    },

    // 限时政策（特定条件触发，限时可用）
    emergencyResponse: {
        id: 'emergencyResponse',
        name: '交通应急响应系统',
        description: '建立专门的交通应急响应系统，提高事故处理效率。',
        category: 'social',
        type: 'limited',
        cost: 180,
        duration: 2,
        effects: {
            immediate: {
                economy: -2,
                employment: 3,
                satisfaction: 10
            },
            monthly: {
                economy: 1,
                employment: 1,
                satisfaction: 4
            }
        },
        trigger: {
            type: 'event',
            eventId: 'trafficAccident'
        },
        availableDuration: 2 // 可用月数
    },
    marketStabilization: {
        id: 'marketStabilization',
        name: '市场稳定计划',
        description: '实施市场调控措施，平衡供需关系。',
        category: 'economy',
        type: 'limited',
        cost: 250,
        duration: 3,
        effects: {
            immediate: {
                economy: 6,
                employment: 4,
                satisfaction: 3
            },
            monthly: {
                economy: 3,
                employment: 2,
                satisfaction: 1
            }
        },
        trigger: {
            type: 'indicator',
            condition: {
                economy: {max: 60}
            }
        },
        availableDuration: 3
    },
    talentAttraction: {
        id: 'talentAttraction',
        name: '人才吸引计划',
        description: '提供优惠政策吸引高技能人才。',
        category: 'employment',
        type: 'limited',
        cost: 200,
        duration: 4,
        effects: {
            immediate: {
                economy: 3,
                employment: 8,
                satisfaction: 4
            },
            monthly: {
                economy: 2,
                employment: 3,
                satisfaction: 1
            }
        },
        trigger: {
            type: 'event',
            eventId: 'techTalentShortage'
        },
        availableDuration: 2
    }
};

// 政策系统配置
const policySystem = {
    maxRandomPolicies: 3, // 每月最多出现的随机政策数
    randomPolicyRefreshInterval: 1, // 随机政策刷新间隔（月）
    limitedPolicyDuration: 2, // 限时政策默认持续月数
    currentRandomPolicies: [], // 当前可用的随机政策
    currentLimitedPolicies: [], // 当前可用的限时政策
    lastRefreshDate: null // 上次刷新随机政策的日期
};

// 刷新随机政策
function refreshRandomPolicies() {
    console.log('刷新随机政策...');
    policySystem.currentRandomPolicies = [];
    
    // 获取所有随机政策
    const randomPolicies = Object.values(policies).filter(p => p.type === 'random');
    
    // 随机选择政策
    for (let i = 0; i < policySystem.maxRandomPolicies; i++) {
        randomPolicies.forEach(policy => {
            if (Math.random() < policy.probability && 
                !policySystem.currentRandomPolicies.includes(policy.id)) {
                policySystem.currentRandomPolicies.push(policy.id);
            }
        });
        
        // 确保不超过最大数量
        if (policySystem.currentRandomPolicies.length >= policySystem.maxRandomPolicies) {
            break;
        }
    }
    
    policySystem.lastRefreshDate = new Date(gameState.currentDate);
    console.log('当前随机政策:', policySystem.currentRandomPolicies);
}

// 检查限时政策触发条件
function checkLimitedPolicies() {
    console.log('检查限时政策触发条件...');
    
    Object.values(policies).forEach(policy => {
        if (policy.type === 'limited') {
            let shouldTrigger = false;
            
            // 检查触发条件
            if (policy.trigger.type === 'event') {
                // 事件触发
                shouldTrigger = gameState.activeEvents.some(e => 
                    e.id === policy.trigger.eventId);
            } else if (policy.trigger.type === 'indicator') {
                // 指标触发
                shouldTrigger = Object.entries(policy.trigger.condition).every(([indicator, condition]) => {
                    const value = gameState.indicators[indicator].value;
                    return (!condition.min || value >= condition.min) && 
                           (!condition.max || value <= condition.max);
                });
            }
            
            // 如果满足触发条件且政策未激活
            if (shouldTrigger && !policySystem.currentLimitedPolicies.includes(policy.id)) {
                policySystem.currentLimitedPolicies.push(policy.id);
                console.log(`限时政策触发: ${policy.name}`);
                
                // 设置过期时间
                setTimeout(() => {
                    const index = policySystem.currentLimitedPolicies.indexOf(policy.id);
                    if (index !== -1) {
                        policySystem.currentLimitedPolicies.splice(index, 1);
                        console.log(`限时政策过期: ${policy.name}`);
                        updatePolicyDisplay();
                    }
                }, policy.availableDuration * 30 * 1000); // 模拟月份时间
            }
        }
    });
}

// 更新政策显示
function updatePolicyDisplay() {
    const policyList = document.getElementById('policy-list');
    if (!policyList) return;
    
    policyList.innerHTML = '';
    
    // 显示基础政策
    Object.values(policies)
        .filter(policy => policy.type === 'basic')
        .forEach(policy => createPolicyCard(policy, policyList));
    
    // 显示当前可用的随机政策
    policySystem.currentRandomPolicies.forEach(policyId => {
        const policy = policies[policyId];
        if (policy) {
            createPolicyCard(policy, policyList, true);
        }
    });
    
    // 显示当前可用的限时政策
    policySystem.currentLimitedPolicies.forEach(policyId => {
        const policy = policies[policyId];
        if (policy) {
            createPolicyCard(policy, policyList, false, true);
        }
    });
}

// 创建政策卡片
function createPolicyCard(policy, container, isRandom = false, isLimited = false) {
    const card = document.createElement('div');
    card.className = `policy-card ${isRandom ? 'random-policy' : ''} ${isLimited ? 'limited-policy' : ''}`;
    card.dataset.policyId = policy.id;
    
    let specialTag = '';
    if (isRandom) {
        specialTag = '<span class="policy-tag random">随机</span>';
    } else if (isLimited) {
        specialTag = '<span class="policy-tag limited">限时</span>';
    }
    
    card.innerHTML = `
        <div class="policy-header">
            <h3>${policy.name} ${specialTag}</h3>
            <span class="policy-cost">${policy.cost}万</span>
        </div>
        <p class="policy-description">${policy.description}</p>
        <div class="policy-effects">
            <div class="effects-group">
                <h4>即时效果</h4>
                <div class="effects-list">
                    ${Object.entries(policy.effects.immediate)
                        .map(([key, value]) => `
                            <div class="effect ${value >= 0 ? 'positive' : 'negative'}">
                                ${getIndicatorName(key)}: ${value >= 0 ? '+' : ''}${value}%
                            </div>
                        `).join('')}
                </div>
            </div>
            <div class="effects-group">
                <h4>每月效果</h4>
                <div class="effects-list">
                    ${Object.entries(policy.effects.monthly)
                        .map(([key, value]) => `
                            <div class="effect ${value >= 0 ? 'positive' : 'negative'}">
                                ${getIndicatorName(key)}: ${value >= 0 ? '+' : ''}${value}%/月
                            </div>
                        `).join('')}
                </div>
            </div>
        </div>
        <div class="policy-footer">
            <span class="policy-duration">持续: ${policy.duration}个月</span>
            <span class="policy-category">${getCategoryName(policy.category)}</span>
            ${isLimited ? `<span class="policy-expiry">剩余可用时间: ${policy.availableDuration}个月</span>` : ''}
        </div>
    `;
    
    // 添加点击事件
    card.addEventListener('click', () => {
        if (!card.classList.contains('disabled')) {
            selectPolicy(policy.id);
        }
    });
    
    container.appendChild(card);
}

// 在nextMonth函数中添加政策刷新逻辑
const originalNextMonth = nextMonth;
nextMonth = function() {
    // 检查是否需要刷新随机政策
    if (!policySystem.lastRefreshDate || 
        getMonthsDifference(policySystem.lastRefreshDate, gameState.currentDate) >= policySystem.randomPolicyRefreshInterval) {
        refreshRandomPolicies();
    }
    
    // 检查限时政策触发条件
    checkLimitedPolicies();
    
    // 调用原始的nextMonth函数
    originalNextMonth.call(this);
    
    // 更新政策显示
    updatePolicyDisplay();
};

// 在initLevel2函数中初始化政策系统
const originalInitLevel2 = initLevel2;
initLevel2 = function() {
    originalInitLevel2.call(this);
    
    // 初始化政策系统
    refreshRandomPolicies();
    checkLimitedPolicies();
    updatePolicyDisplay();
};

// 目标值
const targets = {
    economy: 90,
    employment: 95,
    satisfaction: 90
};

// 游戏配置
const gameConfig = {
    maxPoliciesPerMonth: 3,
    gameDuration: 12, // 12个月
    monthProgress: 0,
    progressUpdateInterval: 100 // 每100ms更新一次进度
};
    
// 预算系统配置
const budgetSystem = {
    baseMonthlyBudget: 100, // 基础月度预算（万元）
    economyMultiplier: 0.01, // 经济指标对预算的影响系数
    satisfactionMultiplier: 0.005, // 满意度对预算的影响系数
    eventPenalty: 0.1, // 负面事件的预算惩罚系数
    bonusThreshold: 85, // 获得预算奖励的指标阈值
    bonusMultiplier: 0.2, // 预算奖励系数
};

// 月度结算系统配置
const settlementSystem = {
    // 基础收入配置
    baseIncome: {
        transportFee: 100, // 基础运输收入(万元/月)
        subsidy: 50, // 基础政府补贴(万元/月)
    },
    // 指标影响系数
    multipliers: {
        economy: 0.02, // 经济指标每1%带来2%的收入增长
        employment: 0.01, // 就业指标每1%带来1%的收入增长
        satisfaction: 0.015, // 满意度每1%带来1.5%的收入增长
    },
    // 特殊事件影响
    eventEffects: {
        positive: 0.2, // 正面事件增加20%收入
        negative: -0.3, // 负面事件减少30%收入
    },
    // 支出配置
    expenses: {
        maintenance: 30, // 基础维护费用(万元/月)
        salary: 40, // 基础人工费用(万元/月)
        operation: 20, // 基础运营费用(万元/月)
    },
    // 突发事件支出系数
    emergencyMultiplier: 1.5, // 突发事件可能导致50%的额外支出
};

// 城市视图控制
const cityView = {
    init() {
        this.initCityElements();
        this.initWeatherSystem();
        this.initDayNightCycle();
        this.initVehicles();
        this.initCitizens();
        this.initPolicyEffects();
    },

    initCityElements() {
        // 初始化建筑
        const buildings = document.querySelectorAll('.building');
        buildings.forEach(building => {
            building.style.animationDelay = `${Math.random() * 0.5}s`;
        });

        // 初始化云朵
        const clouds = document.querySelectorAll('.cloud');
        clouds.forEach(cloud => {
            cloud.style.left = `${Math.random() * 100}%`;
        });
    },

    initWeatherSystem() {
        this.currentWeather = 'clear';
        this.weatherEffects = {
            clear: () => this.setWeatherEffect('clear'),
            rain: () => this.setWeatherEffect('rain'),
            snow: () => this.setWeatherEffect('snow')
        };

        // 随机天气变化
        setInterval(() => {
            const weathers = Object.keys(this.weatherEffects);
            const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
            this.setWeather(newWeather);
        }, 30000);
    },

    setWeather(weather) {
        if (this.currentWeather === weather) return;
        this.currentWeather = weather;
        this.weatherEffects[weather]();
    },

    setWeatherEffect(type) {
        const weatherEffect = document.querySelector('.weather-effect');
        weatherEffect.className = `weather-effect ${type}`;
    },

    initDayNightCycle() {
        this.isNight = false;
        this.citySection = document.querySelector('.city-view-section');

        // 日夜循环
        setInterval(() => {
            this.toggleDayNight();
        }, 60000);
    },

    toggleDayNight() {
        this.isNight = !this.isNight;
        this.citySection.classList.toggle('night-mode', this.isNight);
    },

    initVehicles() {
        // 初始化自动驾驶汽车
        const cars = document.querySelectorAll('.autonomous-car');
        cars.forEach(car => {
            car.style.animationDelay = `${Math.random() * 5}s`;
        });

        // 初始化飞行汽车
        const flyingCars = document.querySelectorAll('.flying-car');
        flyingCars.forEach(car => {
            car.style.animationDelay = `${Math.random() * 10}s`;
        });
    },

    initCitizens() {
        const citizens = document.querySelectorAll('.citizen');
        citizens.forEach(citizen => {
            citizen.style.animationDelay = `${Math.random() * 2}s`;
        });
    },

    initPolicyEffects() {
        this.policyIndicators = document.querySelector('.policy-indicators');
    },

    // 更新城市状态
    updateCityStatus(gameState) {
        this.updateBuildingStatus(gameState);
        this.updateTransportSystem(gameState);
        this.updateCitizenSatisfaction(gameState);
        this.updatePolicyEffects(gameState);
    },

    updateBuildingStatus(gameState) {
        const buildings = document.querySelectorAll('.building-status');
        buildings.forEach(status => {
            const efficiency = Math.random(); // 这里应该使用实际的效率数据
            status.style.backgroundColor = this.getStatusColor(efficiency);
        });
    },

    updateTransportSystem(gameState) {
        const vehicles = document.querySelectorAll('.vehicle');
        const efficiency = gameState.transportEfficiency || 0.5;
        
        vehicles.forEach(vehicle => {
            // 根据效率调整速度
            const currentDuration = parseFloat(vehicle.style.animationDuration) || 10;
            const newDuration = 10 / (efficiency + 0.5);
            vehicle.style.animationDuration = `${newDuration}s`;
        });
    },

    updateCitizenSatisfaction(gameState) {
        const satisfaction = gameState.satisfaction || 0.5;
        const indicators = document.querySelectorAll('.satisfaction-indicator');
        
        indicators.forEach(indicator => {
            indicator.style.backgroundColor = this.getStatusColor(satisfaction);
        });
    },

    updatePolicyEffects(gameState) {
        // 清除现有指示器
        this.policyIndicators.innerHTML = '';

        // 添加新的政策效果指示器
        gameState.activePolicies.forEach((policy, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.style.animationDelay = `${index * 0.1}s`;
            indicator.innerHTML = `
                <span class="indicator-icon">📊</span>
                <span class="indicator-text">${policy.name}</span>
            `;
            this.policyIndicators.appendChild(indicator);
        });
    },

    // 辅助函数
    getStatusColor(value) {
        if (value >= 0.7) return '#4CAF50';
        if (value >= 0.4) return '#FFC107';
        return '#F44336';
    },

    // 添加事件效果
    showEventEffect(event) {
        const effect = document.createElement('div');
        effect.className = 'event-effect';
        effect.innerHTML = `
            <div class="event-icon">${event.icon || '📢'}</div>
            <div class="event-text">${event.description}</div>
        `;

        const citySection = document.querySelector('.city-view-section');
        citySection.appendChild(effect);

        // 设置随机位置
        const maxX = citySection.offsetWidth - effect.offsetWidth;
        const maxY = citySection.offsetHeight - effect.offsetHeight;
        effect.style.left = `${Math.random() * maxX}px`;
        effect.style.top = `${Math.random() * maxY}px`;

        // 移除效果
        setTimeout(() => {
            effect.remove();
        }, 3000);
    }
};

// 初始化游戏
function initLevel2() {
    console.log('初始化游戏...');
    resetGameState();
    initPanels();
    initCharts();
    createPolicyCards();
    attachEventListeners();
    updateUI();
    startGameLoop();
    cityView.init();
    
    // 显示剧情说明
    showStoryIntro();
    
    // 定期更新城市状态
    setInterval(() => {
        cityView.updateCityStatus(gameState);
    }, 1000);
}

// 重置游戏状态
function resetGameState() {
    gameState.currentDate = new Date(2050, 0);
    gameState.budget = {
        monthly: 100,
        total: 1000,
        used: 0
    };
    gameState.indicators = {
        economy: {
            value: 70,
            trend: 0,
            history: [70],
            target: 90
        },
        employment: {
            value: 80,
            trend: 0,
            history: [80],
            target: 95
        },
        satisfaction: {
            value: 75,
            trend: 0,
            history: [75],
            target: 90
        }
    };
    gameState.selectedPolicies = [];
    gameState.implementedPolicies = [];
    gameState.activeEvents = [];
    gameState.eventHistory = [];
    gameState.score = 0;
    gameState.isGameOver = false;
    gameState.gameSpeed = 1;
    gameState.isPaused = false;
}

// 初始化面板
function initPanels() {
    console.log('初始化面板...');
    // 默认显示主面板，隐藏其他面板
    document.querySelectorAll('.panel').forEach(panel => {
        panel.style.display = 'none';
    });
    document.getElementById('main-panel').style.display = 'block';

    // 添加面板切换事件
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPanel = btn.getAttribute('data-panel');
            console.log('切换到面板:', targetPanel);
            switchPanel(targetPanel);
        });
    });
}

// 切换面板
function switchPanel(panelId) {
    console.log('切换面板:', panelId);
    
    // 更新导航按钮状态
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-panel') === panelId) {
            btn.classList.add('active');
        }
    });
    
    // 更新面板显示
    document.querySelectorAll('.panel').forEach(panel => {
        panel.style.display = 'none';
    });
    
    const targetPanel = document.getElementById(`${panelId}-panel`);
    if (targetPanel) {
        targetPanel.style.display = 'block';
        
        // 如果切换到政策面板，重新初始化政策卡片和滚动条
        if (panelId === 'policy') {
            setTimeout(() => {
                createPolicyCards();
            }, 0);
    }
    
    // 如果切换到数据分析面板，更新图表
    if (panelId === 'stats') {
            setTimeout(() => {
        updateCharts();
            }, 0);
        }
    }
}

// 初始化图表
function initCharts() {
    console.log('初始化图���...');
    
    // 确保Canvas元素存在
    const indicatorsCanvas = document.getElementById('indicators-chart');
    const budgetCanvas = document.getElementById('budget-chart');
    const policyEffectCanvas = document.getElementById('policy-effect-chart');
    
    if (!indicatorsCanvas || !budgetCanvas || !policyEffectCanvas) {
        console.error('找不到图表Canvas元素');
        return;
    }
    
    try {
    // 指标趋势图
        const indicatorsCtx = indicatorsCanvas.getContext('2d');
    window.indicatorsChart = new Chart(indicatorsCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: '经济增长率',
                    data: [],
                    borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.4,
                        fill: true
                },
                {
                    label: '就业率',
                    data: [],
                    borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        tension: 0.4,
                        fill: true
                },
                {
                    label: '社会满意度',
                    data: [],
                    borderColor: '#FFC107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        tension: 0.4,
                        fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#fff',
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        displayColors: true
                    }
                },
            scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#fff'
                        }
                    },
                y: {
                    beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#fff',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                }
            }
        }
    });
    
    // 预算使用图
        const budgetCtx = budgetCanvas.getContext('2d');
    window.budgetChart = new Chart(budgetCtx, {
        type: 'bar',
        data: {
            labels: [],
                datasets: [{
                    label: '预算使用',
                    data: [],
                    backgroundColor: 'rgba(76, 175, 80, 0.6)',
                    borderColor: '#4CAF50',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#fff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#fff'
                        }
                    }
                }
            }
        });
        
        // 政策效果图
        const policyEffectCtx = policyEffectCanvas.getContext('2d');
        window.policyEffectChart = new Chart(policyEffectCtx, {
            type: 'radar',
            data: {
                labels: ['经济', '就业', '满意度'],
            datasets: [
                {
                        label: '当前效果',
                        data: [0, 0, 0],
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                        borderColor: '#2196F3'
                    },
                    {
                        label: '目标值',
                        data: [90, 95, 90],
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        borderColor: '#4CAF50'
                }
            ]
        },
        options: {
            responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#fff'
                        }
                    }
                }
            }
        });
        
        console.log('图表初始化完成');
    } catch (error) {
        console.error('图表初始化失败:', error);
    }
}

// 更新图表数据
function updateCharts() {
    console.log('更新图表数据...');
    
    if (!window.indicatorsChart || !window.budgetChart || !window.policyEffectChart) {
        console.error('图表未初始化');
        return;
    }
    
    try {
    // 更新指标趋势图
    const labels = gameState.indicators.economy.history.map((_, index) => {
        const date = new Date(gameState.currentDate);
        date.setMonth(date.getMonth() - (gameState.indicators.economy.history.length - 1 - index));
        return `${date.getFullYear()}/${date.getMonth() + 1}`;
    });
    
    window.indicatorsChart.data.labels = labels;
    window.indicatorsChart.data.datasets[0].data = gameState.indicators.economy.history;
    window.indicatorsChart.data.datasets[1].data = gameState.indicators.employment.history;
    window.indicatorsChart.data.datasets[2].data = gameState.indicators.satisfaction.history;
    window.indicatorsChart.update();
    
    // 更新预算使用图
    window.budgetChart.data.labels = labels;
        window.budgetChart.data.datasets[0].data = gameState.implementedPolicies.map(imp => 
            imp.policies.reduce((sum, policyId) => sum + policies[policyId].cost, 0)
    );
    window.budgetChart.update();
    
        // 更新政策效果图
        window.policyEffectChart.data.datasets[0].data = [
            gameState.indicators.economy.value,
            gameState.indicators.employment.value,
            gameState.indicators.satisfaction.value
        ];
        window.policyEffectChart.update();
        
        console.log('图表更新完成');
    } catch (error) {
        console.error('图表更新失败:', error);
    }
}

// 更新统计摘要
function updateStatsSummary() {
    // 更新政策统计
    const policyStats = document.getElementById('policy-stats');
    const policyCount = {};
    const policyEffects = {
        economy: 0,
        employment: 0,
        satisfaction: 0
    };
    
    gameState.implementedPolicies.forEach(implementation => {
        implementation.policies.forEach(policyId => {
            // 更新政策使用次数
            policyCount[policyId] = (policyCount[policyId] || 0) + 1;
            
            // 累计政策效果
            const policy = policies[policyId];
            Object.entries(policy.effects.immediate).forEach(([key, value]) => {
                policyEffects[key] += value;
            });
            Object.entries(policy.effects.monthly).forEach(([key, value]) => {
                policyEffects[key] += value * policy.duration;
            });
        });
    });
    
    // 生成政策统计HTML
    policyStats.innerHTML = `
        <div class="stats-section">
            <h3>政策使用统计</h3>
            ${Object.entries(policyCount).map(([policyId, count]) => `
            <div class="stat-item">
                <span class="stat-label">${policies[policyId].name}</span>
                <span class="stat-value">${count}次</span>
            </div>
            `).join('')}
        </div>
        <div class="stats-section">
            <h3>政策累计效果</h3>
            ${Object.entries(policyEffects).map(([key, value]) => `
                <div class="stat-item">
                    <span class="stat-label">${getIndicatorName(key)}</span>
                    <span class="stat-value ${value >= 0 ? 'positive' : 'negative'}">
                        ${value >= 0 ? '+' : ''}${value.toFixed(1)}%
                    </span>
                </div>
            `).join('')}
        </div>
    `;
    
    // 更新事件统计
    const eventStats = document.getElementById('event-stats');
    const eventCount = {};
    const eventEffects = {
        economy: 0,
        employment: 0,
        satisfaction: 0
    };
    
    gameState.eventHistory.forEach(event => {
        // 更新事件发生次数
        eventCount[event.id] = (eventCount[event.id] || 0) + 1;
        
        // 累计事件效果
        const eventConfig = events[event.id];
        if (eventConfig.effects) {
            Object.entries(eventConfig.effects).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    eventEffects[key] = (eventEffects[key] || 0) + value;
                }
            });
        }
    });
    
    // 生成事件统计HTML
    eventStats.innerHTML = `
        <div class="stats-section">
            <h3>事件发生统计</h3>
            ${Object.entries(eventCount).map(([eventId, count]) => `
            <div class="stat-item">
                <span class="stat-label">${events[eventId].name}</span>
                <span class="stat-value">${count}次</span>
            </div>
            `).join('')}
        </div>
        <div class="stats-section">
            <h3>事件累计影响</h3>
            ${Object.entries(eventEffects).map(([key, value]) => `
                <div class="stat-item">
                    <span class="stat-label">${getIndicatorName(key)}</span>
                    <span class="stat-value ${value >= 0 ? 'positive' : 'negative'}">
                        ${value >= 0 ? '+' : ''}${value.toFixed(1)}%
                    </span>
                </div>
            `).join('')}
        </div>
    `;
}

// 更新统计周期
function updateStatsPeriod(period) {
    // 更新图表数据
    const labels = [];
    const economyData = [];
    const employmentData = [];
    const satisfactionData = [];
    const budgetData = [];
    
    let interval = 1;
    switch (period) {
        case 'quarter':
            interval = 3;
            break;
        case 'year':
            interval = 12;
            break;
    }
    
    for (let i = 0; i < gameState.indicators.economy.history.length; i += interval) {
        const date = new Date(gameState.currentDate);
        date.setMonth(date.getMonth() - (gameState.indicators.economy.history.length - 1 - i));
        labels.push(`${date.getFullYear()}/${date.getMonth() + 1}`);
        
        // 计算区间平均值
        const getAverage = (arr, start) => {
            const end = Math.min(start + interval, arr.length);
            const sum = arr.slice(start, end).reduce((a, b) => a + b, 0);
            return sum / (end - start);
        };
        
        economyData.push(getAverage(gameState.indicators.economy.history, i));
        employmentData.push(getAverage(gameState.indicators.employment.history, i));
        satisfactionData.push(getAverage(gameState.indicators.satisfaction.history, i));
        
        // 计算区间预算使用
        const budgetSum = gameState.implementedPolicies
            .filter(imp => {
                const monthDiff = getMonthsDifference(imp.date, date);
                return monthDiff >= 0 && monthDiff < interval;
            })
            .reduce((sum, imp) => 
                sum + imp.policies.reduce((s, pid) => s + policies[pid].cost, 0)
            , 0);
        budgetData.push(budgetSum);
    }
    
    // 更新图表
    window.indicatorsChart.data.labels = labels;
    window.indicatorsChart.data.datasets[0].data = economyData;
    window.indicatorsChart.data.datasets[1].data = employmentData;
    window.indicatorsChart.data.datasets[2].data = satisfactionData;
    window.indicatorsChart.update();
    
    window.budgetChart.data.labels = labels;
    window.budgetChart.data.datasets[0].data = budgetData;
    window.budgetChart.update();
}

// 游戏主循环
function startGameLoop() {
    let lastTick = Date.now();
    const gameLoop = () => {
        if (!gameState.isPaused) {
            const currentTick = Date.now();
            const delta = currentTick - lastTick;
            
            // 根据游戏速度更新月进度
            gameConfig.monthProgress += (delta / 1000) * gameState.gameSpeed;
            
            if (gameConfig.monthProgress >= 100) {
                gameConfig.monthProgress = 0;
                nextMonth();
            }
            
            updateProgressBar();
            lastTick = currentTick;
        }
        
        requestAnimationFrame(gameLoop);
    };
    
    gameLoop();
}

// 检查和触发随机事件
function checkRandomEvents() {
    console.log('检查随机事件...');
    try {
        // 增加每月触发多个事件的可能性
    Object.entries(events).forEach(([eventId, event]) => {
            // 检查事件是否已经激活
            if (gameState.activeEvents.some(e => e.id === eventId)) {
                return; // 跳过已激活的事件
            }

            // 基础概率检查，增加随机性
            const randomFactor = Math.random() * 0.2; // 添加最多20%的随机波动
            const adjustedProbability = event.probability + randomFactor;

            if (Math.random() < adjustedProbability) {
                // 检查触发条件
                if (checkEventRequirements(event)) {
                    console.log(`触发事件: ${event.name}`);
                triggerEvent(eventId);
            }
        }
        });
    } catch (error) {
        console.error('检查随机事件时出错:', error);
    }
}

// 检查事件触发条件
function checkEventRequirements(event) {
    if (!event.requirements) return true;
    
    return Object.entries(event.requirements).every(([indicator, range]) => {
        const value = gameState.indicators[indicator].value;
        return value >= range.min && value <= range.max;
    });
}

// 触发事件
function triggerEvent(eventId) {
    try {
    const event = events[eventId];
        if (!event) {
            console.error('未找到事件配置:', eventId);
            return;
        }

        // 创建新的事件实例
    const newEvent = {
        id: eventId,
        startDate: new Date(gameState.currentDate),
        remainingMonths: event.duration
    };
    
        // 添加到活跃事件
    gameState.activeEvents.push(newEvent);

        // 添加到历史记录
    gameState.eventHistory.push({
        id: eventId,
        date: new Date(gameState.currentDate),
        resolved: false
    });
    
    // 应用即时效果
        if (event.effects && event.effects.immediate) {
    applyEventEffects(event.effects.immediate);
        }
    
    // 显示事件通知
    showEventNotification(event);
    
        // 更新UI
    updateUI();
        
        console.log('事件触发成功:', eventId);
        cityView.showEventEffect(event);
    } catch (error) {
        console.error('触发事件时出错:', error);
    }
}

// 更新事件状态
function updateEvents() {
    try {
        console.log('更新事件状态...');
        
        // 更新活跃事件
    gameState.activeEvents = gameState.activeEvents.filter(event => {
        const eventConfig = events[event.id];
            if (!eventConfig) {
                console.error('未找到事件配置:', event.id);
                return false;
            }
        
        // 应用每月效果
            if (eventConfig.effects && eventConfig.effects.monthly) {
        applyEventEffects(eventConfig.effects.monthly);
            }
        
        event.remainingMonths--;
        
            // 检查事件是否结束
        if (event.remainingMonths <= 0) {
                // 更新历史记录
            const historyEvent = gameState.eventHistory.find(e => 
                e.id === event.id && e.date.getTime() === event.startDate.getTime()
            );
            if (historyEvent) {
                historyEvent.resolved = true;
                    historyEvent.endDate = new Date(gameState.currentDate);
            }
            return false;
        }
        
        return true;
    });

        // 检查新事件
        checkRandomEvents();
        
        console.log('事件状态更新完成');
    } catch (error) {
        console.error('更新事件状态时���错:', error);
    }
}

// 应用事件效果
function applyEventEffects(effects) {
    try {
    Object.entries(effects).forEach(([indicator, value]) => {
            if (gameState.indicators[indicator]) {
                const currentValue = gameState.indicators[indicator].value;
                const newValue = Math.max(0, Math.min(100, currentValue + value));
                gameState.indicators[indicator].value = newValue;
                
                console.log(`应用事件效果: ${indicator} ${value >= 0 ? '+' : ''}${value}% => ${newValue}%`);
            }
        });
    } catch (error) {
        console.error('应用事件效果时出错:', error);
    }
}

// 月度结算
function monthlySettlement() {
    try {
        console.log('执行月度结算...');
        
        // 计算收支
        const income = calculateMonthlyIncome();
        const expenses = calculateMonthlyExpenses();
        const profit = income - expenses;
        
        // 初始化或更新财务状态
        if (!gameState.finance) {
            gameState.finance = {
                history: [],
                currentIncome: 0,
                currentExpenses: 0,
                currentProfit: 0,
                totalProfit: 0
            };
        }
        
        // 更新当前财务状态
        gameState.finance.currentIncome = income;
        gameState.finance.currentExpenses = expenses;
        gameState.finance.currentProfit = profit;
        gameState.finance.totalProfit += profit;
        
        // 记录历史数据
        gameState.finance.history.push({
            date: new Date(gameState.currentDate),
            income: income,
            expenses: expenses,
            profit: profit,
            indicators: {
                economy: gameState.indicators.economy.value,
                employment: gameState.indicators.employment.value,
                satisfaction: gameState.indicators.satisfaction.value
            }
        });
        
        // 显示结算报告
        showSettlementReport(income, expenses, profit);
        
        // 更新图表
        updateFinanceCharts();
        
        console.log('月度结算完成', {
            income,
            expenses,
            profit,
            totalProfit: gameState.finance.totalProfit
        });
        
    } catch (error) {
        console.error('月度结算出错:', error);
        showMessage('月度结算处理出错', 'error');
    }
}

// 计算月度收入
function calculateMonthlyIncome() {
    try {
        let income = 0;
        
        // 基础收入
        income += settlementSystem.baseIncome.transportFee;
        income += settlementSystem.baseIncome.subsidy;
        
        // 指标影响
        const economyBonus = income * (gameState.indicators.economy.value / 100) * settlementSystem.multipliers.economy;
        const employmentBonus = income * (gameState.indicators.employment.value / 100) * settlementSystem.multipliers.employment;
        const satisfactionBonus = income * (gameState.indicators.satisfaction.value / 100) * settlementSystem.multipliers.satisfaction;
        
        income += economyBonus + employmentBonus + satisfactionBonus;
        
        // 事件影响
        gameState.activeEvents.forEach(event => {
            const eventConfig = events[event.id];
            if (eventConfig && eventConfig.effects && eventConfig.effects.monthly && eventConfig.effects.monthly.economy) {
                const eventEffect = eventConfig.effects.monthly.economy / 100;
                income *= (1 + (eventEffect > 0 ? settlementSystem.eventEffects.positive : settlementSystem.eventEffects.negative));
            }
        });
        
        return Math.round(income);
    } catch (error) {
        console.error('计算月度收入时出错:', error);
        return 0;
    }
}

// 计算月度支出
function calculateMonthlyExpenses() {
    try {
        let expenses = 0;
        
        // 基础支出
        expenses += settlementSystem.expenses.maintenance;
        expenses += settlementSystem.expenses.salary;
        expenses += settlementSystem.expenses.operation;
        
        // 政策支出
        gameState.implementedPolicies.forEach(implementation => {
            const monthsPassed = getMonthsDifference(implementation.date, gameState.currentDate);
            implementation.policies.forEach(policyId => {
                const policy = policies[policyId];
                if (monthsPassed < policy.duration) {
                    expenses += Math.round(policy.cost * 0.1);
                }
            });
        });
        
        // 事件额外支出
        let emergencyExpenses = 0;
        gameState.activeEvents.forEach(event => {
            const eventConfig = events[event.id];
            if (eventConfig && (eventConfig.type === 'accident' || eventConfig.type === 'weather')) {
                emergencyExpenses += expenses * (settlementSystem.emergencyMultiplier - 1);
            }
        });
        
        expenses += emergencyExpenses;
        
        return Math.round(expenses);
    } catch (error) {
        console.error('计算月度支出时出错:', error);
        return 0;
    }
}

// 更新进度条
function updateProgressBar() {
    const progressBar = document.getElementById('month-progress');
    progressBar.style.width = `${gameConfig.monthProgress}%`;
}

// 更新游戏速度
function updateGameSpeed(speed) {
    gameState.gameSpeed = speed;
    
    // 更新速度按钮状态
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.speed) === speed);
    });
}

// 暂停/继续游戏
function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    document.getElementById('pause-btn').textContent = gameState.isPaused ? '继续' : '暂停';
}

// 添加事件监听器
function attachEventListeners() {
    console.log('添加事件监听器...');
    
    // 实施和下个月按钮
    const implementBtn = document.getElementById('implement-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    
    if (implementBtn) {
        implementBtn.addEventListener('click', () => {
            console.log('实施按钮被点击');
            implementPolicies();
        });
    } else {
        console.error('找不到实施按钮');
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            console.log('下个月按钮被点击');
            nextMonth();
        });
    } else {
        console.error('找不到下个月按钮');
    }
    
    // 速度控制
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            updateGameSpeed(parseInt(btn.dataset.speed));
        });
    });
    
    // 面板切换按钮
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPanel = btn.getAttribute('data-panel');
            switchPanel(targetPanel);
        });
    });
    
    // 政策分类按钮
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            filterPolicies(category);
            
            document.querySelectorAll('.category-btn').forEach(b => 
                b.classList.toggle('active', b === btn)
            );
        });
    });
    
    // 政策排序
    document.getElementById('policy-sort').addEventListener('change', (e) => {
        sortPolicies(e.target.value);
    });
    
    // 时间线筛选
    document.querySelectorAll('.timeline-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterTimeline(filter);
            
            document.querySelectorAll('.timeline-filters .filter-btn').forEach(b => 
                b.classList.toggle('active', b === btn)
            );
        });
    });
    
    // 事件筛选
    document.querySelectorAll('.events-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterEvents(filter);
            
            document.querySelectorAll('.events-filters .filter-btn').forEach(b => 
                b.classList.toggle('active', b === btn)
            );
        });
    });
    
    // 统计周期切换
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const period = btn.dataset.period;
            updateStatsPeriod(period);
            
            document.querySelectorAll('.period-btn').forEach(b => 
                b.classList.toggle('active', b === btn)
            );
        });
    });
}

// 筛选政策
function filterPolicies(category) {
    document.querySelectorAll('.policy-card').forEach(card => {
        const policy = policies[card.dataset.policyId];
        if (category === 'all' || policy.category === category) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
            }
        });
    }
    
// 排序政策
function sortPolicies(criterion) {
    const policyList = document.getElementById('policy-list');
    const cards = Array.from(policyList.children);
    
    cards.sort((a, b) => {
        const policyA = policies[a.dataset.policyId];
        const policyB = policies[b.dataset.policyId];
        
        switch (criterion) {
            case 'cost':
                return policyA.cost - policyB.cost;
            case 'duration':
                return policyA.duration - policyB.duration;
            case 'effect':
                return getTotalEffect(policyB) - getTotalEffect(policyA);
            default:
                return 0;
        }
    });
    
    cards.forEach(card => policyList.appendChild(card));
}

// 获取政策总效果
function getTotalEffect(policy) {
    let total = 0;
    
    // 计算即时效果
    Object.values(policy.effects.immediate).forEach(value => {
        total += Math.abs(value);
    });
    
    // 计算持续效果
    Object.values(policy.effects.monthly).forEach(value => {
        total += Math.abs(value) * policy.duration;
    });
    
    return total;
}

// 筛选时间线
function filterTimeline(filter) {
    document.querySelectorAll('.timeline-policy').forEach(item => {
        const isActive = item.classList.contains('active');
        
        switch (filter) {
            case 'active':
                item.style.display = isActive ? '' : 'none';
                break;
            case 'completed':
                item.style.display = !isActive ? '' : 'none';
                break;
            default:
                item.style.display = '';
        }
    });
}

// 筛选事件
function filterEvents(filter) {
    document.querySelectorAll('.event-card').forEach(card => {
        const isActive = card.classList.contains('active');
        
        switch (filter) {
            case 'active':
                card.style.display = isActive ? '' : 'none';
                break;
            case 'historical':
                card.style.display = !isActive ? '' : 'none';
                break;
            default:
                card.style.display = '';
        }
    });
}

// 实施政策
function implementPolicies() {
    console.log('实施政策被调用');
    if (gameState.selectedPolicies.length === 0) {
        showMessage('请至少选择一项政策！', 'warning');
        return;
    }
    
    // 检查预算
    const totalCost = gameState.selectedPolicies.reduce((sum, policyId) => 
        sum + policies[policyId].cost, 0);
    if (totalCost > gameState.budget.total - gameState.budget.used) {
        showMessage('预算不足！', 'error');
        return;
    }
    
    // 记录实施的政策
    gameState.implementedPolicies.push({
        date: new Date(gameState.currentDate),
        policies: [...gameState.selectedPolicies]
    });
    
    // 更新预算使用
    gameState.budget.used += totalCost;
    
    // 应用即时效果
    gameState.selectedPolicies.forEach(policyId => {
        const policy = policies[policyId];
        if (policy.effects.immediate) {
            Object.entries(policy.effects.immediate).forEach(([key, value]) => {
                gameState.indicators[key].value = Math.max(0, 
                    Math.min(100, gameState.indicators[key].value + value));
            });
        }
    });
    
    // 禁用实施按钮，启用下个月按钮
    document.getElementById('implement-btn').disabled = true;
    document.getElementById('next-month-btn').disabled = false;
    
    // 更新UI
    updateUI();
    showMessage('政策已实施！', 'success');
}

// 进入下个月
function nextMonth() {
    console.log('进入下个月函数');
    try {
    // 应用每月效果
    gameState.implementedPolicies.forEach(implementation => {
        const monthsPassed = getMonthsDifference(implementation.date, gameState.currentDate);
        implementation.policies.forEach(policyId => {
            const policy = policies[policyId];
                if (monthsPassed < policy.duration && policy.effects.monthly) {
                    Object.entries(policy.effects.monthly).forEach(([key, value]) => {
                        if (gameState.indicators[key]) {
                            gameState.indicators[key].value = Math.max(0, 
                                Math.min(100, gameState.indicators[key].value + value));
                        }
                    });
            }
        });
    });
    
    // 更新事件状态
    updateEvents();
    
    // 更新日期
    gameState.currentDate.setMonth(gameState.currentDate.getMonth() + 1);
    
    // 记录历史数据
        Object.keys(gameState.indicators).forEach(key => {
            const indicator = gameState.indicators[key];
            indicator.history.push(indicator.value);
            indicator.trend = indicator.history.length > 1 ? 
                indicator.value - indicator.history[indicator.history.length - 2] : 0;
        });
        
        // 更新月度预算
        gameState.budget.monthly = calculateMonthlyBudget();
        gameState.budget.total += gameState.budget.monthly;
        
        // 执行月度结算
        monthlySettlement();
    
    // 重置月度状态
    gameState.selectedPolicies = [];
    gameConfig.monthProgress = 0;
    
    // 检查游戏是否结束
    if (gameState.currentDate >= gameState.endDate) {
        endGame();
        return;
    }
    
    // 重置按钮状态
        const implementBtn = document.getElementById('implement-btn');
        const nextMonthBtn = document.getElementById('next-month-btn');
        
        if (implementBtn) implementBtn.disabled = false;
        if (nextMonthBtn) nextMonthBtn.disabled = true;
    
    // 更新界面
    updateUI();
    showMessage(`进入${gameState.currentDate.getFullYear()}年${gameState.currentDate.getMonth() + 1}月`);
        
        console.log('下个月函数执行完成');
    } catch (error) {
        console.error('下个月函数执行出错:', error);
        showMessage('处理月度更新时出现错误', 'error');
    }
}

// 应用政策效果
function applyPolicyEffects(effects) {
    Object.entries(effects).forEach(([indicator, value]) => {
        gameState.indicators[indicator].value = 
            Math.max(0, Math.min(100, gameState.indicators[indicator].value + value));
    });
    
    // 更新得分
    updateScore();
}

// 更新得分
function updateScore() {
    const weights = {
        economy: 0.35,
        employment: 0.35,
        satisfaction: 0.3
    };
    
    let totalScore = 0;
    Object.entries(weights).forEach(([indicator, weight]) => {
        const data = gameState.indicators[indicator];
        // 计算当前值相对于目标值的百分比
        const progress = Math.min(100, (data.value / data.target) * 100);
        totalScore += progress * weight;
    });
    
    // 根据预算使用效率调整得分
    const budgetEfficiency = (gameState.budget.used / gameState.budget.total) * 100;
    let budgetMultiplier = 1;
    if (budgetEfficiency < 60) {
        budgetMultiplier = 0.8; // 预算使用不足
    } else if (budgetEfficiency > 90) {
        budgetMultiplier = 0.9; // 预算使用过多
    }
    
    // 更新游戏状态中的得分
    gameState.score = Math.round(totalScore * budgetMultiplier);
    
    // 更新显示
    const scoreDisplay = document.getElementById('current-score');
    if (scoreDisplay) {
        scoreDisplay.textContent = gameState.score || 0;
    }
}

// 结束游戏
function endGame() {
    gameState.isGameOver = true;
    
    const modal = document.getElementById('modal');
    const content = modal.querySelector('.modal-content');
    
    let result = '';
    let message = '';
    
    if (gameState.score >= 95) {
        result = '优秀';
        message = '你的政策制定非常出色！城市各项指标均达到理想水平，市民们对未来充满信心。';
    } else if (gameState.score >= 80) {
        result = '良好';
        message = '你的政策整体表现不错，城市发展稳定，但仍有提升空间。';
    } else if (gameState.score >= 60) {
        result = '及格';
        message = '你的政策基本满足了城市发展需求，但部分指标仍需改进。';
    } else {
        result = '失败';
        message = '政策效果不理想，建议重新规划预算分配和政策选择。';
    }
    
    content.innerHTML = `
        <h2>游戏结束</h2>
        <div class="final-score">${gameState.score}分</div>
        <p class="result-grade">评价：${result}</p>
        <p class="result-message">${message}</p>
        <div class="final-indicators">
            ${Object.entries(gameState.indicators).map(([key, data]) => `
                <div class="indicator-item">
                    <span>${getIndicatorName(key)}</span>
                    <span class="value ${data.value >= data.target ? 'success' : 'warning'}">
                        ${Math.round(data.value)}% / ${data.target}%
                    </span>
                </div>
            `).join('')}
        </div>
        <div class="modal-buttons">
            <button onclick="restartLevel()" class="btn-restart">重新开始</button>
            <button onclick="returnToMenu()" class="btn-menu">返回主菜单</button>
        </div>
    `;
    
    modal.classList.add('show');
}

// 重新开始关卡
function restartLevel() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
    
    resetGameState();
    updateUI();
    createPolicyCards();
}

// 返回主菜单
function returnToMenu() {
    window.location.href = 'index.html';
}

// 更新界面显示
function updateUI() {
    updateDateDisplay();
    updateScoreDisplay();
    updateIndicators();
    updateBudgetDisplay();
    updateSelectedPolicies();
    updateTimeline();
    updateEventsList();
    updateActiveEvents();
    updateFinanceDisplay();
    // 确保更新得分
    updateScore();
}

// 更新日期显示
function updateDateDisplay() {
    const dateStr = `${gameState.currentDate.getFullYear()}年${gameState.currentDate.getMonth() + 1}月`;
    document.getElementById('current-date').textContent = dateStr;
}

// 更新得分显示
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('current-score');
    if (scoreDisplay) {
        scoreDisplay.textContent = gameState.score || 0;
    }
}

// 更新指标显示
function updateIndicators() {
    ['economy', 'employment', 'satisfaction'].forEach(indicator => {
        const data = gameState.indicators[indicator];
        const element = document.getElementById(`${indicator}-value`);
        const progress = document.getElementById(`${indicator}-progress`);
        const trend = document.getElementById(`${indicator}-trend`);
        
        // 更新数值
        element.textContent = `${Math.round(data.value)}%`;
        
        // 更新进度条
        progress.style.width = `${data.value}%`;
        
        // 设置进度条颜色
        if (data.value >= data.target) {
            progress.style.background = '#4CAF50';
        } else if (data.value >= data.target * 0.8) {
            progress.style.background = '#FFC107';
        } else {
            progress.style.background = '#F44336';
        }
        
        // 更新趋势箭头
        if (data.trend > 0) {
            trend.innerHTML = '<span style="color: #4CAF50">↑</span>';
        } else if (data.trend < 0) {
            trend.innerHTML = '<span style="color: #F44336">↓</span>';
        } else {
            trend.innerHTML = '<span style="color: #FFC107">→</span>';
        }
    });
}

// 更新预算显示
function updateBudgetDisplay() {
    document.getElementById('monthly-budget').textContent = `${gameState.budget.monthly}万`;
    document.getElementById('total-budget').textContent = `${gameState.budget.total}万`;
    document.getElementById('remaining-budget').textContent = 
        `${gameState.budget.total - gameState.budget.used}万`;
    
    const progress = (gameState.budget.used / gameState.budget.total) * 100;
    const progressBar = document.getElementById('budget-progress');
    progressBar.style.width = `${progress}%`;
    
    if (progress >= 90) {
        progressBar.style.background = '#F44336';
    } else if (progress >= 70) {
        progressBar.style.background = '#FFC107';
    } else {
        progressBar.style.background = '#4CAF50';
    }
}

// 创建政策卡片
function createPolicyCards() {
    console.log('创建政策卡片...');
    const policyList = document.getElementById('policy-list');
    if (!policyList) {
        console.error('找不到政策列表容器');
        return;
    }
    
    // 清空现有内容
    policyList.innerHTML = '';
    
    // 创建并添加政策卡片
    Object.entries(policies).forEach(([id, policy]) => {
        const card = document.createElement('div');
        card.className = 'policy-card';
        card.dataset.policyId = id;
        
        card.innerHTML = `
            <div class="policy-header">
                <h3>${policy.name}</h3>
                <span class="policy-cost">${policy.cost}万</span>
            </div>
            <p class="policy-description">${policy.description}</p>
            <div class="policy-effects">
                <div class="effects-group">
                    <h4>即时效果</h4>
                    <div class="effects-list">
                        ${Object.entries(policy.effects.immediate)
                            .map(([key, value]) => `
                                <div class="effect ${value >= 0 ? 'positive' : 'negative'}">
                                    ${getIndicatorName(key)}: ${value >= 0 ? '+' : ''}${value}%
                                </div>
                            `).join('')}
                    </div>
                </div>
                <div class="effects-group">
                    <h4>每月效果</h4>
                    <div class="effects-list">
                        ${Object.entries(policy.effects.monthly)
                            .map(([key, value]) => `
                                <div class="effect ${value >= 0 ? 'positive' : 'negative'}">
                                    ${getIndicatorName(key)}: ${value >= 0 ? '+' : ''}${value}%/月
                                </div>
                            `).join('')}
                    </div>
                </div>
            </div>
            <div class="policy-footer">
                <span class="policy-duration">持续: ${policy.duration}个月</span>
                <span class="policy-category">${getCategoryName(policy.category)}</span>
            </div>
        `;
        
        // 添加点击事件
        card.addEventListener('click', () => {
            if (!card.classList.contains('disabled')) {
            selectPolicy(id);
            }
        });
        
        policyList.appendChild(card);
    });
    
    // 更新政策卡片样式
    updatePolicyCardStyles();
}

// 选择政策函数改进
function selectPolicy(policyId) {
    console.log('选择政策函数被调用:', policyId);
    
    if (gameState.isGameOver) return;
    
    const policy = policies[policyId];
    if (!policy) {
        console.error('未找到政策:', policyId);
        return;
    }
    
    const index = gameState.selectedPolicies.indexOf(policyId);
    if (index !== -1) {
        // 取消选择政策
        gameState.selectedPolicies.splice(index, 1);
        gameState.budget.used -= policy.cost;
        showMessage(`已取消 ${policy.name}`);
    } else {
        // 检查政策数量限制
        if (gameState.selectedPolicies.length >= gameConfig.maxPoliciesPerMonth) {
            showMessage('已达到本月政策数量上限！', 'warning');
            return;
        }
        
        // 检查预算是否足够
        if (gameState.budget.used + policy.cost > gameState.budget.total) {
            showMessage('预算不足！', 'error');
            return;
        }
        
        // 选择新政策
        gameState.selectedPolicies.push(policyId);
        gameState.budget.used += policy.cost;
        showMessage(`已选择 ${policy.name}`);
    }
    
    console.log('当前已选政策:', gameState.selectedPolicies);
    
    // 更新UI和样式
    requestAnimationFrame(() => {
    updateUI();
    updatePolicyCardStyles();
    });
}

// 更新政策卡片样式
function updatePolicyCardStyles() {
    document.querySelectorAll('.policy-card').forEach(card => {
        const policyId = card.dataset.policyId;
        const policy = policies[policyId];
        
        // 检查是否已选择
        const isSelected = gameState.selectedPolicies.includes(policyId);
        // 检查是否可选（预算和数量限制）
        const canSelect = !isSelected && 
            gameState.selectedPolicies.length < gameConfig.maxPoliciesPerMonth &&
            gameState.budget.used + policy.cost <= gameState.budget.total;
        
        card.classList.toggle('selected', isSelected);
        card.classList.toggle('disabled', !canSelect && !isSelected);
    });
}

// 更新已选政策列表
function updateSelectedPolicies() {
    const selectedList = document.getElementById('selected-policies-list');
    selectedList.innerHTML = '';
    
    gameState.selectedPolicies.forEach(policyId => {
        const policy = policies[policyId];
        const item = document.createElement('div');
        item.className = 'selected-policy-item fade-in';
        item.innerHTML = `
            <div class="selected-policy-header">
                <span class="policy-name">${policy.name}</span>
                <span class="policy-cost">-${policy.cost}万</span>
            </div>
            <div class="policy-duration">持续${policy.duration}个月</div>
        `;
        
        // 添加取消选择按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-policy-btn';
        cancelBtn.innerHTML = '×';
        cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectPolicy(policyId); // 再次点击取消选择
        });
        item.appendChild(cancelBtn);
        
        selectedList.appendChild(item);
    });
    
    // 更新政策限制显示
    document.getElementById('policy-count').textContent = 
        `${gameState.selectedPolicies.length}/${gameConfig.maxPoliciesPerMonth}`;
}

// 更新时间线
function updateTimeline() {
    const timelineList = document.getElementById('timeline-list');
    timelineList.innerHTML = '';
    
    // 按时间倒序排列
    const sortedPolicies = [...gameState.implementedPolicies].reverse();
    
    sortedPolicies.forEach(implementation => {
        const date = new Date(implementation.date);
        const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月`;
        
        const item = document.createElement('div');
        item.className = 'timeline-item fade-in';
        
        const policiesHtml = implementation.policies.map(policyId => {
            const policy = policies[policyId];
            const isActive = isPolicyActive(implementation, policy);
            return `
                <div class="timeline-policy ${isActive ? 'active' : 'completed'}">
                    <div class="timeline-policy-header">
                        <span class="policy-name">${policy.name}</span>
                        <span class="policy-status">${isActive ? '进行中' : '已完成'}</span>
                    </div>
                    <div class="policy-duration">
                        ${isActive ? `剩余${getRemainingMonths(implementation, policy)}个月` : '已结束'}
                    </div>
                </div>
            `;
        }).join('');
        
        item.innerHTML = `
            <div class="timeline-date">${dateStr}</div>
            <div class="timeline-content">
                ${policiesHtml}
            </div>
        `;
        
        timelineList.appendChild(item);
    });
}

// 更新事件列表
function updateEventsList() {
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '';
    
    // 按时间倒序排列
    const sortedEvents = [...gameState.eventHistory].reverse();
    
    sortedEvents.forEach(event => {
        const eventConfig = events[event.id];
        const isActive = gameState.activeEvents.some(e => e.id === event.id);
        
        const item = document.createElement('div');
        item.className = `event-card fade-in ${isActive ? 'active' : 'completed'}`;
        
        item.innerHTML = `
            <div class="event-header">
                <h3>${eventConfig.name}</h3>
                <span class="event-status">${isActive ? '进行中' : '已结束'}</span>
            </div>
            <p class="event-description">${eventConfig.description}</p>
            <div class="event-effects">
                ${Object.entries(eventConfig.effects.immediate)
                    .map(([indicator, value]) => `
                        <div class="effect ${value >= 0 ? 'positive' : 'negative'}">
                            ${getIndicatorName(indicator)}: ${value >= 0 ? '+' : ''}${value}%
                        </div>
                    `).join('')}
            </div>
            <div class="event-footer">
                <span class="event-date">
                    ${event.date.getFullYear()}年${event.date.getMonth() + 1}月
                </span>
                ${isActive ? `<span class="event-duration">剩余${
                    gameState.activeEvents.find(e => e.id === event.id).remainingMonths
                }个月</span>` : ''}
            </div>
        `;
        
        eventsList.appendChild(item);
    });
}

// 更新活跃事件显示
function updateActiveEvents() {
    const activeEventsList = document.getElementById('active-events');
    activeEventsList.innerHTML = '';
    
    if (gameState.activeEvents.length === 0) {
        activeEventsList.innerHTML = '<div class="no-events">当前没有活跃事件</div>';
            return;
        }
        
    gameState.activeEvents.forEach(event => {
        const eventConfig = events[event.id];
        const item = document.createElement('div');
        item.className = 'active-event-item fade-in';
        
        item.innerHTML = `
            <div class="event-header">
                <span class="event-name">${eventConfig.name}</span>
                <span class="event-duration">剩余${event.remainingMonths}个月</span>
            </div>
            <div class="event-effects">
                ${Object.entries(eventConfig.effects.monthly)
                    .map(([indicator, value]) => `
                        <div class="effect ${value >= 0 ? 'positive' : 'negative'}">
                            ${getIndicatorName(indicator)}: ${value >= 0 ? '+' : ''}${value}%/月
                        </div>
                    `).join('')}
            </div>
        `;
        
        activeEventsList.appendChild(item);
    });
}

// 辅助函数
function getIndicatorName(key) {
    const names = {
        economy: '经济',
        employment: '就业',
        satisfaction: '满意度'
    };
    return names[key] || key;
}

function getCategoryName(category) {
    const names = {
        economy: '经济',
        employment: '就业',
        social: '民生'
    };
    return names[category] || category;
}

function isPolicyActive(implementation, policy) {
    const monthsPassed = getMonthsDifference(implementation.date, gameState.currentDate);
    return monthsPassed < policy.duration;
}

function getRemainingMonths(implementation, policy) {
    const monthsPassed = getMonthsDifference(implementation.date, gameState.currentDate);
    return policy.duration - monthsPassed;
}

function getMonthsDifference(date1, date2) {
    return (date2.getFullYear() - date1.getFullYear()) * 12 + 
        (date2.getMonth() - date1.getMonth());
}

// 显示消息
function showMessage(message, type = 'info') {
    const modal = document.getElementById('modal');
    const content = modal.querySelector('.modal-content');
    
    content.className = `modal-content ${type}`;
    content.innerHTML = `<p>${message}</p>`;
    
    modal.classList.add('show');
    setTimeout(() => {
        modal.classList.remove('show');
    }, 2000);
}

// 更新预算计算
function calculateMonthlyBudget() {
    let monthlyBudget = budgetSystem.baseMonthlyBudget;
    
    // 根据经济指标调整预算
    const economyBonus = gameState.indicators.economy.value * budgetSystem.economyMultiplier;
    monthlyBudget += economyBonus;
    
    // 根据满意度调整预算
    const satisfactionBonus = gameState.indicators.satisfaction.value * budgetSystem.satisfactionMultiplier;
    monthlyBudget += satisfactionBonus;
    
    // 负面事件惩罚
    const eventPenalty = gameState.activeEvents.length * budgetSystem.eventPenalty * monthlyBudget;
    monthlyBudget -= eventPenalty;
    
    // 高指标奖励
    if (gameState.indicators.economy.value > budgetSystem.bonusThreshold) {
        monthlyBudget *= (1 + budgetSystem.bonusMultiplier);
    }
    
    // 确保最低预算
    monthlyBudget = Math.max(50, Math.round(monthlyBudget));
    
    return monthlyBudget;
}

// 更新游戏状态
function updateGameState() {
    // 计算新的月度预算
    gameState.budget.monthly = calculateMonthlyBudget();
    
    // 更新总预算
    gameState.budget.total += gameState.budget.monthly;
    
    // 更新各项指标
    updateIndicators();
    
    // 检查随机事件
    checkRandomEvents();
    
    // 更新得分
    updateScore();
}

// 更新指标
function updateIndicators() {
    Object.keys(gameState.indicators).forEach(key => {
        const indicator = gameState.indicators[key];
        
        // 基础变化
        let change = 0;
        
        // 政策效果
        gameState.implementedPolicies.forEach(implementation => {
            const monthsPassed = getMonthsDifference(implementation.date, gameState.currentDate);
            implementation.policies.forEach(policyId => {
                const policy = policies[policyId];
                if (monthsPassed < policy.duration) {
                    change += policy.effects.monthly[key] || 0;
                }
            });
        });
        
        // 事件效果
        gameState.activeEvents.forEach(event => {
            const eventConfig = events[event.id];
            change += eventConfig.effects.monthly[key] || 0;
        });
        
        // 随机波动
        change += (Math.random() - 0.5) * 2;
        
        // 更新值
        indicator.value = Math.max(0, Math.min(100, indicator.value + change));
        
        // 记录历史
        indicator.history.push(indicator.value);
        
        // 计算趋势
        indicator.trend = indicator.history.length > 1 ? 
            indicator.value - indicator.history[indicator.history.length - 2] : 0;
    });
}

// 显示结算报告
function showSettlementReport(income, expenses, profit) {
    const report = `
        <div class="settlement-report">
            <h2>月度结算报告</h2>
            <div class="report-date">${gameState.currentDate.getFullYear()}年${gameState.currentDate.getMonth() + 1}月</div>
            
            <div class="report-section">
                <h3>收入明细</h3>
                <div class="report-item">
                    <span>基础运输收入</span>
                    <span>+${settlementSystem.baseIncome.transportFee}万</span>
                </div>
                <div class="report-item">
                    <span>政府补贴</span>
                    <span>+${settlementSystem.baseIncome.subsidy}万</span>
                </div>
                <div class="report-item highlight">
                    <span>总收入</span>
                    <span class="income">+${income}万</span>
                </div>
            </div>
            
            <div class="report-section">
                <h3>支出明细</h3>
                <div class="report-item">
                    <span>维护费用</span>
                    <span>-${settlementSystem.expenses.maintenance}万</span>
                </div>
                <div class="report-item">
                    <span>人工费用</span>
                    <span>-${settlementSystem.expenses.salary}万</span>
                </div>
                <div class="report-item">
                    <span>运营费用</span>
                    <span>-${settlementSystem.expenses.operation}万</span>
                </div>
                <div class="report-item highlight">
                    <span>总支出</span>
                    <span class="expenses">-${expenses}万</span>
                </div>
            </div>
            
            <div class="report-section">
                <div class="report-item total">
                    <span>月度利润</span>
                    <span class="${profit >= 0 ? 'profit' : 'loss'}">
                        ${profit >= 0 ? '+' : ''}${profit}万
                    </span>
                </div>
            </div>
            
            <div class="report-section">
                <h3>影响因素</h3>
                <div class="report-item">
                    <span>经济指标(${Math.round(gameState.indicators.economy.value)}%)</span>
                    <span>${(gameState.indicators.economy.value * settlementSystem.multipliers.economy * 100).toFixed(1)}%</span>
                </div>
                <div class="report-item">
                    <span>就业指标(${Math.round(gameState.indicators.employment.value)}%)</span>
                    <span>${(gameState.indicators.employment.value * settlementSystem.multipliers.employment * 100).toFixed(1)}%</span>
                </div>
                <div class="report-item">
                    <span>满意度(${Math.round(gameState.indicators.satisfaction.value)}%)</span>
                    <span>${(gameState.indicators.satisfaction.value * settlementSystem.multipliers.satisfaction * 100).toFixed(1)}%</span>
                </div>
            </div>
        </div>
    `;
    
    showModal(report, '月度结算');
}

// 显示模态框
function showModal(content, title = '') {
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    
    if (title) {
        content = `<h2>${title}</h2>${content}`;
    }
    
    modalContent.innerHTML = content;
    modal.classList.add('show');
    
    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => modal.classList.remove('show');
    modalContent.appendChild(closeButton);
}

// 更新财务图表
function updateFinanceCharts() {
    // 在原有图表基础上添加财务数据
    const financeCtx = document.getElementById('finance-chart').getContext('2d');
    window.financeChart = new Chart(financeCtx, {
        type: 'line',
        data: {
            labels: gameState.finance.history.map(record => 
                `${record.date.getFullYear()}/${record.date.getMonth() + 1}`
            ),
            datasets: [
                {
                    label: '收入',
                    data: gameState.finance.history.map(record => record.income),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: '支出',
                    data: gameState.finance.history.map(record => record.expenses),
                    borderColor: '#F44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: '利润',
                    data: gameState.finance.history.map(record => record.profit),
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#fff',
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}万`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#fff',
                        callback: function(value) {
                            return value + '万';
                        }
                    }
                }
            }
        }
    });
}

// 显示剧情说明
function showStoryIntro() {
    const storyContent = `
        <div class="story-intro">
            <h2>新纪元城市的挑战</h2>
            <div class="story-content">
                <p>欢迎来到2050年的"新纪元城市"！</p>
                <p>作为城市的交通管理者，你将面临一个重要的任务：在自动驾驶技术全面普及的背景下，平衡经济发展、就业率和社会满意度三个关键指标。</p>
                <p>你需要：</p>
                <ul>
                    <li>制定合理的交通政策</li>
                    <li>应对各种突发事件</li>
                    <li>管理城市预算</li>
                    <li>确保市民满意度</li>
                </ul>
                <p>记住：每个决策都会影响城市的未来！</p>
                <div class="story-targets">
                    <h3>目标指标：</h3>
                    <div class="target-item">
                        <span>经济增长率</span>
                        <span class="target-value">≥90%</span>
                    </div>
                    <div class="target-item">
                        <span>就业率</span>
                        <span class="target-value">≥95%</span>
                    </div>
                    <div class="target-item">
                        <span>社会满意度</span>
                        <span class="target-value">≥90%</span>
                    </div>
                </div>
            </div>
            <button onclick="closeStoryIntro()" class="btn-primary">开始游戏</button>
        </div>
    `;
    
    showModal(storyContent);
}

// 关闭剧情说明
function closeStoryIntro() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
}

// 更新财务数据显示
function updateFinanceDisplay() {
    if (!gameState.finance) {
        gameState.finance = {
            currentIncome: 0,
            currentExpenses: 0,
            currentProfit: 0,
            history: []
        };
    }

    const financeStats = document.getElementById('finance-stats');
    if (financeStats) {
        financeStats.innerHTML = `
            <div class="finance-summary">
                <div class="finance-item">
                    <span class="finance-label">当月收入</span>
                    <span class="finance-value income">+${gameState.finance.currentIncome}万</span>
                </div>
                <div class="finance-item">
                    <span class="finance-label">当月支出</span>
                    <span class="finance-value expenses">-${gameState.finance.currentExpenses}万</span>
                </div>
                <div class="finance-item">
                    <span class="finance-label">当月利润</span>
                    <span class="finance-value ${gameState.finance.currentProfit >= 0 ? 'profit' : 'loss'}">
                        ${gameState.finance.currentProfit >= 0 ? '+' : ''}${gameState.finance.currentProfit}万
                    </span>
                </div>
            </div>
        `;
    }

    // 更新财务图表
    if (window.financeChart) {
        const labels = gameState.finance.history.map(record => 
            `${record.date.getFullYear()}/${record.date.getMonth() + 1}`
        );
        
        window.financeChart.data.labels = labels;
        window.financeChart.data.datasets[0].data = gameState.finance.history.map(record => record.income);
        window.financeChart.data.datasets[1].data = gameState.finance.history.map(record => record.expenses);
        window.financeChart.data.datasets[2].data = gameState.finance.history.map(record => record.profit);
        window.financeChart.update();
    }
}

// 当文档加载完成时初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded'); // 添加调试日志
    initLevel2();
    
    // 默认显示主面板
    switchPanel('main');
}); 

// 更新分析面板
function updateAnalysisPanel() {
    updatePolicyAnalysis();
    updateEventAnalysis();
    updateComprehensiveAnalysis();
}

// 更新政策分析
function updatePolicyAnalysis() {
    // 政策使用统计
    const policyUsageStats = document.getElementById('policy-usage-stats');
    const policyUsage = calculatePolicyUsage();
    policyUsageStats.innerHTML = generatePolicyUsageHTML(policyUsage);

    // 政策效果评估
    const policyEffectStats = document.getElementById('policy-effect-stats');
    const policyEffects = calculatePolicyEffects();
    policyEffectStats.innerHTML = generatePolicyEffectsHTML(policyEffects);

    // 预算使用效率
    const budgetEfficiencyStats = document.getElementById('budget-efficiency-stats');
    const budgetEfficiency = calculateBudgetEfficiency();
    budgetEfficiencyStats.innerHTML = generateBudgetEfficiencyHTML(budgetEfficiency);
}

// 更新事件分析
function updateEventAnalysis() {
    // 事件发生统计
    const eventFrequencyStats = document.getElementById('event-frequency-stats');
    const eventFrequency = calculateEventFrequency();
    eventFrequencyStats.innerHTML = generateEventFrequencyHTML(eventFrequency);

    // 事件影响评估
    const eventImpactStats = document.getElementById('event-impact-stats');
    const eventImpacts = calculateEventImpacts();
    eventImpactStats.innerHTML = generateEventImpactsHTML(eventImpacts);

    // 应对措施效果
    const responseEffectStats = document.getElementById('response-effect-stats');
    const responseEffects = calculateResponseEffects();
    responseEffectStats.innerHTML = generateResponseEffectsHTML(responseEffects);
}

// 更新综合分析
function updateComprehensiveAnalysis() {
    // 发展趋势
    const developmentTrend = document.getElementById('development-trend');
    const trends = calculateDevelopmentTrends();
    developmentTrend.innerHTML = generateDevelopmentTrendsHTML(trends);

    // 关键指标
    const keyIndicators = document.getElementById('key-indicators');
    const indicators = calculateKeyIndicators();
    keyIndicators.innerHTML = generateKeyIndicatorsHTML(indicators);

    // 建议措施
    const suggestedActions = document.getElementById('suggested-actions');
    const suggestions = generateSuggestions();
    suggestedActions.innerHTML = generateSuggestionsHTML(suggestions);
}

// 计算政策使用情况
function calculatePolicyUsage() {
    const usage = {};
    gameState.implementedPolicies.forEach(implementation => {
        implementation.policies.forEach(policyId => {
            usage[policyId] = (usage[policyId] || 0) + 1;
        });
    });
    return usage;
}

// 生成政策使用HTML
function generatePolicyUsageHTML(usage) {
    const sortedPolicies = Object.entries(usage)
        .sort((a, b) => b[1] - a[1])
        .map(([policyId, count]) => {
            const policy = policies[policyId];
            return `
                <div class="stat-item">
                    <span class="stat-label">${policy.name}</span>
                    <span class="stat-value">${count}次</span>
                </div>
            `;
        }).join('');
    
    return sortedPolicies || '<div class="no-data">暂无政策使用数据</div>';
}

// 计算政策效果
function calculatePolicyEffects() {
    const effects = {
        economy: 0,
        employment: 0,
        satisfaction: 0
    };

    gameState.implementedPolicies.forEach(implementation => {
        implementation.policies.forEach(policyId => {
            const policy = policies[policyId];
            Object.entries(policy.effects.immediate).forEach(([key, value]) => {
                effects[key] += value;
            });
            Object.entries(policy.effects.monthly).forEach(([key, value]) => {
                effects[key] += value * policy.duration;
            });
        });
    });

    return effects;
}

// 生成政策效果HTML
function generatePolicyEffectsHTML(effects) {
    return Object.entries(effects).map(([key, value]) => `
        <div class="stat-item">
            <span class="stat-label">${getIndicatorName(key)}</span>
            <span class="stat-value ${value >= 0 ? 'positive' : 'negative'}">
                ${value >= 0 ? '+' : ''}${value.toFixed(1)}%
            </span>
        </div>
    `).join('');
}

// 计算预算使用效率
function calculateBudgetEfficiency() {
    const totalBudget = gameState.budget.total;
    const usedBudget = gameState.budget.used;
    const efficiency = (usedBudget / totalBudget) * 100;
    
    const monthlyEfficiency = gameState.implementedPolicies.map(imp => {
        const cost = imp.policies.reduce((sum, policyId) => sum + policies[policyId].cost, 0);
        const effects = imp.policies.reduce((sum, policyId) => {
            const policy = policies[policyId];
            return sum + Object.values(policy.effects.immediate).reduce((a, b) => a + Math.abs(b), 0);
        }, 0);
        return {
            date: imp.date,
            efficiency: effects / cost
        };
    });

    return {
        overall: efficiency,
        monthly: monthlyEfficiency
    };
}

// 生成预算效率HTML
function generateBudgetEfficiencyHTML(efficiency) {
    return `
        <div class="stat-item">
            <span class="stat-label">总体使用率</span>
            <span class="stat-value ${efficiency.overall >= 70 ? 'positive' : 'negative'}">
                ${efficiency.overall.toFixed(1)}%
            </span>
        </div>
        <div class="stat-item">
            <span class="stat-label">平均效益比</span>
            <span class="stat-value ${efficiency.monthly.length > 0 ? 'positive' : ''}">
                ${efficiency.monthly.reduce((sum, item) => sum + item.efficiency, 0) / 
                  Math.max(1, efficiency.monthly.length)}
            </span>
        </div>
    `;
}

// 计算事件频率
function calculateEventFrequency() {
    const frequency = {};
    gameState.eventHistory.forEach(event => {
        frequency[event.id] = (frequency[event.id] || 0) + 1;
    });
    return frequency;
}

// 生成事件频率HTML
function generateEventFrequencyHTML(frequency) {
    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .map(([eventId, count]) => `
            <div class="stat-item">
                <span class="stat-label">${events[eventId].name}</span>
                <span class="stat-value">${count}次</span>
            </div>
        `).join('') || '<div class="no-data">暂无事件记录</div>';
}

// 计算事件影响
function calculateEventImpacts() {
    const impacts = {
        economy: 0,
        employment: 0,
        satisfaction: 0
    };

    gameState.eventHistory.forEach(event => {
        const eventConfig = events[event.id];
        if (eventConfig.effects) {
            Object.entries(eventConfig.effects.immediate).forEach(([key, value]) => {
                impacts[key] += value;
            });
        }
    });

    return impacts;
}

// 生成事件影响HTML
function generateEventImpactsHTML(impacts) {
    return Object.entries(impacts).map(([key, value]) => `
        <div class="stat-item">
            <span class="stat-label">${getIndicatorName(key)}</span>
            <span class="stat-value ${value >= 0 ? 'positive' : 'negative'}">
                ${value >= 0 ? '+' : ''}${value.toFixed(1)}%
            </span>
        </div>
    `).join('');
}

// 计算应对措施效果
function calculateResponseEffects() {
    const effects = {};
    gameState.eventHistory.forEach(event => {
        const eventConfig = events[event.id];
        if (eventConfig.policies) {
            eventConfig.policies.forEach(policyId => {
                const policy = policies[policyId];
                effects[policyId] = (effects[policyId] || 0) + 1;
            });
        }
    });
    return effects;
}

// 生成应对措施效果HTML
function generateResponseEffectsHTML(effects) {
    return Object.entries(effects).map(([policyId, count]) => `
        <div class="stat-item">
            <span class="stat-label">${policies[policyId].name}</span>
            <span class="stat-value">使用${count}次</span>
        </div>
    `).join('') || '<div class="no-data">暂无应对措施数据</div>';
}

// 计算发展趋势
function calculateDevelopmentTrends() {
    const trends = {};
    ['economy', 'employment', 'satisfaction'].forEach(key => {
        const history = gameState.indicators[key].history;
        if (history.length >= 2) {
            const recent = history.slice(-6); // 最近6个月
            const trend = recent[recent.length - 1] - recent[0];
            trends[key] = {
                current: history[history.length - 1],
                change: trend,
                direction: trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral'
            };
        }
    });
    return trends;
}

// 生成发展趋势HTML
function generateDevelopmentTrendsHTML(trends) {
    return Object.entries(trends).map(([key, data]) => `
        <div class="stat-item">
            <span class="stat-label">${getIndicatorName(key)}</span>
            <div class="trend-indicator ${data.direction === 'up' ? 'trend-up' : 
                                       data.direction === 'down' ? 'trend-down' : 'trend-neutral'}">
                ${data.current.toFixed(1)}% 
                (${data.change >= 0 ? '+' : ''}${data.change.toFixed(1)}%)
            </div>
        </div>
    `).join('');
}

// 计算关键指标
function calculateKeyIndicators() {
    return {
        economy: {
            value: gameState.indicators.economy.value,
            target: targets.economy,
            progress: (gameState.indicators.economy.value / targets.economy) * 100
        },
        employment: {
            value: gameState.indicators.employment.value,
            target: targets.employment,
            progress: (gameState.indicators.employment.value / targets.employment) * 100
        },
        satisfaction: {
            value: gameState.indicators.satisfaction.value,
            target: targets.satisfaction,
            progress: (gameState.indicators.satisfaction.value / targets.satisfaction) * 100
        }
    };
}

// 生成关键指标HTML
function generateKeyIndicatorsHTML(indicators) {
    return Object.entries(indicators).map(([key, data]) => `
        <div class="key-indicator">
            <div class="key-indicator-header">
                <span>${getIndicatorName(key)}</span>
                <span class="key-indicator-value">
                    ${data.value.toFixed(1)}% / ${data.target}%
                </span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="
                    width: ${data.progress}%;
                    background-color: ${data.progress >= 100 ? '#4CAF50' : 
                                     data.progress >= 80 ? '#FFC107' : '#F44336'};">
                </div>
            </div>
        </div>
    `).join('');
}

// 生成建议措施
function generateSuggestions() {
    const suggestions = [];
    const indicators = gameState.indicators;

    // 根据各项指标的状态生成建议
    if (indicators.economy.value < targets.economy) {
        suggestions.push({
            type: 'economy',
            content: '建议加大创新研发投入，提升经济效益'
        });
    }
    if (indicators.employment.value < targets.employment) {
        suggestions.push({
            type: 'employment',
            content: '建议实施职业培训计划，提高就业率'
        });
    }
    if (indicators.satisfaction.value < targets.satisfaction) {
        suggestions.push({
            type: 'satisfaction',
            content: '建议优化公共服务，提升市民满意度'
        });
    }

    // 根据预算使用情况生成建议
    const budgetEfficiency = (gameState.budget.used / gameState.budget.total) * 100;
    if (budgetEfficiency < 60) {
        suggestions.push({
            type: 'budget',
            content: '建议适度增加政策投入，提高预算使用效率'
        });
    } else if (budgetEfficiency > 90) {
        suggestions.push({
            type: 'budget',
            content: '建议控制政策支出，保持合理预算储备'
        });
    }

    return suggestions;
}

// 生成建议措施HTML
function generateSuggestionsHTML(suggestions) {
    return suggestions.map(suggestion => `
        <div class="suggestion-item">
            ${suggestion.content}
        </div>
    `).join('') || '<div class="no-data">暂无建议措施</div>';
}

// 在updateUI函数中添加对分析面板的更新
const originalUpdateUI = updateUI;
updateUI = function() {
    originalUpdateUI.call(this);
    updateAnalysisPanel();
}; 