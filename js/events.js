// 事件类型定义
const EVENT_TYPES = {
    MARKET: 'market',      // 市场事件
    WEATHER: 'weather',    // 天气事件
    ACCIDENT: 'accident',  // 事故事件
    SOCIAL: 'social',      // 社会事件
    TECH: 'tech',         // 技术事件
    POLICY: 'policy',     // 政策事件
    EMERGENCY: 'emergency', // 突发事件
    ENVIRONMENT: 'environment', // 环境事件
    INFRASTRUCTURE: 'infrastructure', // 基础设施事件
    INTERNATIONAL: 'international' // 国际事件
};

// 事件库
const EVENT_LIBRARY = {
    // 市场事件
    market: [
        {
            id: 'fuel_price_rise',
            type: EVENT_TYPES.MARKET,
            title: '燃油价格上涨',
            description: '国际油价上涨导致运营成本增加',
            severity: 'warning',
            probability: 0.15,
            effects: {
                immediate: {
                    economy: -2,
                    satisfaction: -3
                },
                monthly: {
                    economy: -1
                }
            },
            duration: 3,
            requirements: {
                economy: {min: 0, max: 100}
            }
        },
        {
            id: 'electric_subsidy',
            type: EVENT_TYPES.MARKET,
            title: '新能源补贴',
            description: '政府推出新能源汽车补贴政策',
            severity: 'success',
            probability: 0.1,
            effects: {
                immediate: {
                    economy: 5,
                    satisfaction: 3
                },
                monthly: {
                    economy: 2,
                    employment: 1
                }
            },
            duration: 6,
            requirements: {
                economy: {min: 60, max: 100}
            }
        },
        {
            id: 'market_competition',
            type: EVENT_TYPES.MARKET,
            title: '市场竞争加剧',
            description: '新的交通服务提供商进入市场',
            severity: 'warning',
            probability: 0.12,
                    effects: {
                immediate: {
                    economy: -4,
                    satisfaction: -2
                },
                monthly: {
                    economy: -1,
                    employment: -1
                }
            },
            duration: 4,
            requirements: {
                economy: {min: 70, max: 100}
            }
        },
        {
            id: 'investment_boom',
            type: EVENT_TYPES.MARKET,
            title: '投资热潮',
            description: '智能交通领域迎来投资热潮',
            severity: 'success',
            probability: 0.1,
            effects: {
                immediate: {
                    economy: 8,
                    employment: 5
                },
                monthly: {
                    economy: 2,
                    employment: 1
                }
            },
            duration: 4,
            requirements: {
                economy: {min: 70, max: 100},
                satisfaction: {min: 60, max: 100}
            }
        },
        {
            id: 'economic_recession',
            type: EVENT_TYPES.MARKET,
            title: '经济衰退',
            description: '全球经济衰退影响交通行业发展',
            severity: 'error',
            probability: 0.05,
            effects: {
                immediate: {
                    economy: -10,
                    employment: -8,
                    satisfaction: -5
                },
                monthly: {
                    economy: -3,
                    employment: -2
                }
            },
            duration: 6,
            requirements: {
                economy: {min: 0, max: 100}
            }
        }
    ],
    
    // 天气事件
    weather: [
        {
            id: 'heavy_rain',
            type: EVENT_TYPES.WEATHER,
            title: '暴雨天气',
            description: '持续暴雨导致部分线路积水',
            severity: 'warning',
            probability: 0.2,
            effects: {
                immediate: {
                    economy: -3,
                satisfaction: -5
                },
                monthly: {
                    economy: -1
                }
            },
            duration: 1,
            requirements: {
                economy: {min: 0, max: 100}
            }
        },
        {
            id: 'extreme_heat',
            type: EVENT_TYPES.WEATHER,
            title: '极端高温',
            description: '持续高温天气增加了车辆故障率',
            severity: 'warning',
            probability: 0.15,
            effects: {
                immediate: {
                    economy: -2,
                satisfaction: -3
                },
                monthly: {
                    economy: -1,
                    satisfaction: -1
                }
            },
            duration: 2,
            requirements: {
                economy: {min: 0, max: 100}
            }
        },
        {
            id: 'heavy_snow',
            type: EVENT_TYPES.WEATHER,
            title: '暴雪天气',
            description: '暴雪导致交通受阻',
            severity: 'error',
            probability: 0.1,
                    effects: {
                immediate: {
                    economy: -5,
                    satisfaction: -7
                },
                monthly: {
                    economy: -2,
                    satisfaction: -2
                }
            },
            duration: 1,
            requirements: {
                economy: {min: 0, max: 100}
            }
        }
    ],
    
    // 事故事件
    accident: [
        {
            id: 'minor_collision',
            type: EVENT_TYPES.ACCIDENT,
            title: '轻微碰撞',
            description: '一辆车发生轻微碰撞事故',
            severity: 'warning',
            probability: 0.15,
            effects: {
                immediate: {
                    economy: -2,
                    satisfaction: -5
                },
                monthly: {
                    satisfaction: -1
                }
            },
            duration: 1,
            requirements: {
                economy: {min: 0, max: 100}
            }
        },
        {
            id: 'system_failure',
            type: EVENT_TYPES.ACCIDENT,
            title: '系统故障',
            description: '自动驾驶系统出现临时性故障',
            severity: 'error',
            probability: 0.08,
            effects: {
                immediate: {
                    economy: -4,
                    satisfaction: -8
                },
                monthly: {
                    economy: -2,
                    satisfaction: -2
                }
            },
            duration: 2,
            requirements: {
                economy: {min: 0, max: 100}
            }
        }
    ],
    
    // 社会事件
    social: [
        {
            id: 'public_protest',
            type: EVENT_TYPES.SOCIAL,
            title: '公众抗议',
            description: '部分市民对自动驾驶安全性表示担忧',
            severity: 'error',
            probability: 0.1,
            effects: {
                immediate: {
                    satisfaction: -10,
                    economy: -3
                },
                monthly: {
                    satisfaction: -2
                }
            },
            duration: 3,
            requirements: {
                satisfaction: {min: 0, max: 70}
            }
        },
        {
            id: 'media_praise',
            type: EVENT_TYPES.SOCIAL,
            title: '媒体好评',
            description: '主流媒体对智能交通系统给予高度评价',
            severity: 'success',
            probability: 0.12,
            effects: {
                immediate: {
                    satisfaction: 8,
                    economy: 2
                },
                monthly: {
                    satisfaction: 1,
                    economy: 1
                }
            },
            duration: 2,
            requirements: {
                satisfaction: {min: 75, max: 100}
            }
        }
    ],
    
    // 技术事件
    tech: [
        {
            id: 'ai_breakthrough',
            type: EVENT_TYPES.TECH,
            title: 'AI技术突破',
            description: '自动驾驶AI系统获得重大突破',
            severity: 'success',
            probability: 0.05,
                    effects: {
                immediate: {
                    economy: 5,
                    satisfaction: 5
                },
                monthly: {
                    economy: 2,
                    employment: 1
                }
            },
            duration: 6,
            requirements: {
                economy: {min: 80, max: 100}
            }
        },
        {
            id: 'security_vulnerability',
            type: EVENT_TYPES.TECH,
            title: '安全漏洞',
            description: '系统发现潜在安全漏洞',
            severity: 'error',
            probability: 0.08,
            effects: {
                immediate: {
                    satisfaction: -8,
                    economy: -3
                },
                monthly: {
                    satisfaction: -2
                }
            },
            duration: 2,
            requirements: {
                economy: {min: 0, max: 100}
            }
        }
    ],
    
    // 政策事件
    policy: [
        {
            id: 'government_support',
            type: EVENT_TYPES.POLICY,
            title: '政府支持',
            description: '地方政府出台支持政策',
            severity: 'success',
            probability: 0.1,
            effects: {
                immediate: {
                    economy: 6,
                    satisfaction: 4
                },
                monthly: {
                    economy: 2,
                    employment: 1
                }
            },
            duration: 6,
            requirements: {
                economy: {min: 70, max: 100},
                satisfaction: {min: 70, max: 100}
            }
        },
        {
            id: 'regulation_change',
            type: EVENT_TYPES.POLICY,
            title: '法规变更',
            description: '交通管理法规发生重大调整',
            severity: 'warning',
            probability: 0.1,
                    effects: {
                immediate: {
                    economy: -3,
                    satisfaction: -2
                },
                monthly: {
                    economy: -1
                }
            },
            duration: 4,
            requirements: {
                economy: {min: 0, max: 100}
            }
        }
    ],
    
    // 突发事件
    emergency: [
        {
            id: 'cyber_attack',
            type: EVENT_TYPES.EMERGENCY,
            title: '网络攻击',
            description: '系统遭受黑客攻击',
            severity: 'error',
            probability: 0.05,
            effects: {
                immediate: {
                    economy: -8,
                    satisfaction: -10
                },
                monthly: {
                    economy: -3,
                    satisfaction: -2
                }
            },
            duration: 2,
            requirements: {
                economy: {min: 0, max: 100}
            }
        },
        {
            id: 'natural_disaster',
            type: EVENT_TYPES.EMERGENCY,
            title: '自然灾害',
            description: '突发自然灾害影响交通系统运行',
            severity: 'error',
            probability: 0.03,
            effects: {
                immediate: {
                    economy: -10,
                    satisfaction: -8
                },
                monthly: {
                    economy: -4,
                    satisfaction: -2
                }
            },
            duration: 3,
            requirements: {
                economy: {min: 0, max: 100}
            }
        }
    ],
    
    // 环境事件
    environment: [
        {
            id: 'air_quality_improvement',
            type: EVENT_TYPES.ENVIRONMENT,
            title: '空气质量改善',
            description: '智能交通系统帮助改善城市空气质量',
            severity: 'success',
            probability: 0.15,
            effects: {
                immediate: {
                    satisfaction: 8,
                    economy: 3
                },
                monthly: {
                    satisfaction: 2
                }
            },
            duration: 3,
            requirements: {
                economy: {min: 70, max: 100}
            }
        },
        {
            id: 'environmental_protest',
            type: EVENT_TYPES.ENVIRONMENT,
            title: '环保抗议',
            description: '环保组织对交通系统的环境影响表示担忧',
            severity: 'warning',
            probability: 0.1,
            effects: {
                immediate: {
                    satisfaction: -6,
                    economy: -2
                },
                monthly: {
                    satisfaction: -1
                }
            },
            duration: 2,
            requirements: {
                satisfaction: {min: 0, max: 70}
            }
        }
    ],
    
    // 基础设施事件
    infrastructure: [
        {
            id: 'smart_grid_upgrade',
            type: EVENT_TYPES.INFRASTRUCTURE,
            title: '智能电网升级',
            description: '城市智能电网升级完成,提升充电效率',
            severity: 'success',
            probability: 0.08,
            effects: {
                immediate: {
                    economy: 5,
                    satisfaction: 4
                },
                monthly: {
                    economy: 2
                }
            },
            duration: 4,
            requirements: {
                economy: {min: 60, max: 100}
            }
        },
        {
            id: 'infrastructure_aging',
            type: EVENT_TYPES.INFRASTRUCTURE,
            title: '基础设施老化',
            description: '部分交通基础设施出现老化问题',
            severity: 'warning',
            probability: 0.12,
            effects: {
                immediate: {
                    economy: -4,
                    satisfaction: -3
                },
                monthly: {
                    economy: -1,
                    satisfaction: -1
                }
            },
            duration: 3,
            requirements: {
                economy: {min: 0, max: 100}
            }
        }
    ],
    
    // 国际事件
    international: [
        {
            id: 'international_cooperation',
            type: EVENT_TYPES.INTERNATIONAL,
            title: '国际合作',
            description: '与国际智能交通联盟达成合作',
            severity: 'success',
            probability: 0.06,
            effects: {
                immediate: {
                    economy: 7,
                    satisfaction: 5
                },
                monthly: {
                    economy: 2,
                    employment: 1
                }
            },
            duration: 5,
            requirements: {
                economy: {min: 75, max: 100},
                satisfaction: {min: 70, max: 100}
            }
        },
        {
            id: 'global_supply_crisis',
            type: EVENT_TYPES.INTERNATIONAL,
            title: '全球供应链危机',
            description: '全球供应链中断影响设备更新',
            severity: 'error',
            probability: 0.07,
            effects: {
                immediate: {
                    economy: -6,
                    satisfaction: -4
                },
                monthly: {
                    economy: -2
                }
            },
            duration: 4,
            requirements: {
                economy: {min: 0, max: 100}
            }
        }
    ]
};

// 事件动态影响系统
const EVENT_IMPACT_SYSTEM = {
    // 连锁反应配置
    chainReactions: {
        'fuel_price_rise': {
            triggers: ['market_competition'],
            probability: 0.3,
            delay: 2 // 2个月后可能触发
        },
        'public_protest': {
            triggers: ['media_praise', 'government_support'],
            probability: 0.4,
            delay: 1
        },
        'system_failure': {
            triggers: ['security_vulnerability', 'public_protest'],
            probability: 0.35,
            delay: 1
        },
        'economic_recession': {
            triggers: ['market_competition', 'infrastructure_aging'],
            probability: 0.4,
            delay: 2
        },
        'environmental_protest': {
            triggers: ['public_protest', 'media_praise'],
            probability: 0.3,
            delay: 1
        },
        'infrastructure_aging': {
            triggers: ['system_failure', 'public_protest'],
            probability: 0.35,
            delay: 2
        },
        'global_supply_crisis': {
            triggers: ['economic_recession', 'market_competition'],
            probability: 0.45,
            delay: 3
        }
    },
    
    // 事件组合效果
    combinedEffects: {
        'market_competition+fuel_price_rise': {
            economy: -3,
            satisfaction: -4
        },
        'public_protest+system_failure': {
            economy: -5,
            satisfaction: -8,
            employment: -3
        },
        'economic_recession+market_competition': {
            economy: -8,
            employment: -6,
            satisfaction: -5
        },
        'environmental_protest+public_protest': {
            satisfaction: -10,
            economy: -5
        },
        'infrastructure_aging+system_failure': {
            economy: -7,
            satisfaction: -8,
            employment: -3
        },
        'global_supply_crisis+economic_recession': {
            economy: -12,
            employment: -8,
            satisfaction: -6
        }
    },
    
    // 恢复系统
    recovery: {
        'economy': {
            baseRate: 0.12,
            threshold: 45,
            accelerator: 1.6
        },
        'satisfaction': {
            baseRate: 0.18,
            threshold: 55,
            accelerator: 1.4
        },
        'employment': {
            baseRate: 0.1,
            threshold: 65,
            accelerator: 1.3
        }
    },
    
    // 季节性影响
    seasonalEffects: {
        spring: {
            'weather': { probability: 1.2, severity: 0.9 },
            'market': { probability: 1.1, severity: 1.0 },
            'environment': { probability: 1.3, severity: 1.1 },
            'infrastructure': { probability: 1.2, severity: 1.0 }
        },
        summer: {
            'weather': { probability: 1.3, severity: 1.2 },
            'tech': { probability: 0.9, severity: 1.0 },
            'environment': { probability: 1.2, severity: 1.2 },
            'infrastructure': { probability: 1.1, severity: 1.1 }
        },
        fall: {
            'market': { probability: 1.2, severity: 1.1 },
            'social': { probability: 1.1, severity: 1.0 },
            'international': { probability: 1.2, severity: 1.1 },
            'environment': { probability: 1.1, severity: 1.0 }
        },
        winter: {
            'weather': { probability: 1.4, severity: 1.3 },
            'accident': { probability: 1.2, severity: 1.1 },
            'infrastructure': { probability: 1.3, severity: 1.2 },
            'international': { probability: 1.1, severity: 1.1 }
        }
    }
};

// 获取当前季节
function getCurrentSeason(date) {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
}

// 检查连锁反应
function checkChainReactions(event, gameState) {
    const chainConfig = EVENT_IMPACT_SYSTEM.chainReactions[event.id];
    if (!chainConfig) return [];
    
    const chainEvents = [];
    chainConfig.triggers.forEach(triggerId => {
        if (Math.random() < chainConfig.probability) {
            const triggerEvent = Object.values(EVENT_LIBRARY)
                .flat()
                .find(e => e.id === triggerId);
            
            if (triggerEvent && checkEventTrigger(triggerEvent, gameState)) {
                chainEvents.push({
                    event: triggerEvent,
                    delay: chainConfig.delay
                });
            }
        }
    });
    
    return chainEvents;
}

// 计算组合效果
function calculateCombinedEffects(activeEvents) {
    let combinedEffect = {
        economy: 0,
        employment: 0,
        satisfaction: 0
    };
    
    // 检查所有可能的事件组合
    activeEvents.forEach((event1, i) => {
        activeEvents.slice(i + 1).forEach(event2 => {
            const combinationKey = `${event1.id}+${event2.id}`;
            const effect = EVENT_IMPACT_SYSTEM.combinedEffects[combinationKey];
            
            if (effect) {
                Object.entries(effect).forEach(([key, value]) => {
                    combinedEffect[key] += value;
                });
            }
        });
    });
    
    return combinedEffect;
}

// 计算恢复效果
function calculateRecovery(gameState) {
    const recovery = {
        economy: 0,
        employment: 0,
        satisfaction: 0
    };
    
    Object.entries(EVENT_IMPACT_SYSTEM.recovery).forEach(([indicator, config]) => {
        const currentValue = gameState.indicators[indicator].value;
        if (currentValue < config.threshold) {
            recovery[indicator] = config.baseRate * config.accelerator;
        } else {
            recovery[indicator] = config.baseRate;
        }
    });
    
    return recovery;
}

// 应用季节性影响
function applySeasonalEffects(event, gameState) {
    const season = getCurrentSeason(gameState.currentDate);
    const seasonalEffect = EVENT_IMPACT_SYSTEM.seasonalEffects[season][event.type];
    
    if (!seasonalEffect) return event;
    
    // 创建事件的深拷贝
    const modifiedEvent = JSON.parse(JSON.stringify(event));
    
    // 修改概率和效果
    modifiedEvent.probability *= seasonalEffect.probability;
    
    ['immediate', 'monthly'].forEach(effectType => {
        if (modifiedEvent.effects[effectType]) {
            Object.keys(modifiedEvent.effects[effectType]).forEach(key => {
                modifiedEvent.effects[effectType][key] *= seasonalEffect.severity;
            });
        }
    });
    
    return modifiedEvent;
}

// 更新事件计算函数
function calculateEventEffect(event, gameState) {
    let effect = {
        economy: 0,
        employment: 0,
        satisfaction: 0
    };
    
    // 应用季节性修正
    const seasonalEvent = applySeasonalEffects(event, gameState);
    
    // 计算即时效果
    if (seasonalEvent.effects.immediate) {
        Object.entries(seasonalEvent.effects.immediate).forEach(([key, value]) => {
            effect[key] += value;
        });
    }
    
    // 计算持续效果
    if (seasonalEvent.effects.monthly) {
        Object.entries(seasonalEvent.effects.monthly).forEach(([key, value]) => {
            effect[key] += value * seasonalEvent.duration;
        });
    }
    
    // 计算组合效果
    const combinedEffect = calculateCombinedEffects(gameState.activeEvents);
    Object.entries(combinedEffect).forEach(([key, value]) => {
        effect[key] += value;
    });
    
    // 应用恢复效果
    const recovery = calculateRecovery(gameState);
    Object.entries(recovery).forEach(([key, value]) => {
        effect[key] += value;
    });
    
    // 根据当前游戏状态动态调整效果
    Object.keys(effect).forEach(key => {
        const currentValue = gameState.indicators[key].value;
        
        // 当指标较低时,负面效果更显著
        if (effect[key] < 0) {
            if (currentValue < 50) {
                effect[key] *= 1.3;
            } else if (currentValue < 30) {
                effect[key] *= 1.5;
            }
        }
        
        // 当指标较高时,正面效果更显著
        if (effect[key] > 0) {
            if (currentValue > 80) {
                effect[key] *= 1.2;
            } else if (currentValue > 90) {
                effect[key] *= 1.4;
            }
        }
        
        // 考虑其他指标的交叉影响
        Object.keys(gameState.indicators).forEach(otherKey => {
            if (otherKey !== key) {
                const otherValue = gameState.indicators[otherKey].value;
                if (otherValue < 40) {
                    effect[key] *= 0.9; // 其他指标较低时,当前效果减弱
                } else if (otherValue > 80) {
                    effect[key] *= 1.1; // 其他指标较高时,当前效果增强
                }
            }
        });
    });
    
    return effect;
}

// 检查事件触发条件
function checkEventTrigger(event, gameState) {
    if (!event.requirements) return true;
    
    // 基础条件检查
    const baseCheck = Object.entries(event.requirements).every(([indicator, range]) => {
        const value = gameState.indicators[indicator].value;
        return value >= range.min && value <= range.max;
    });
    
    if (!baseCheck) return false;
    
    // 检查是否有相同类型的事件正在进行
    const hasSameTypeEvent = gameState.activeEvents.some(
        activeEvent => activeEvent.type === event.type
    );
    
    // 如果已有相同类型事件,降低触发概率
    if (hasSameTypeEvent) {
        return Math.random() > 0.7; // 30%的概率仍然触发
    }
    
    // 检查是否有互斥事件
    const hasConflictingEvent = gameState.activeEvents.some(activeEvent => {
        const combination = `${activeEvent.id}+${event.id}`;
        return EVENT_IMPACT_SYSTEM.combinedEffects[combination]?.conflicting;
    });
    
    return !hasConflictingEvent;
}

// 获取事件描述
function getEventDescription(event, effect) {
    let description = event.description + '\n\n影响：\n';
    
    Object.entries(effect).forEach(([key, value]) => {
        if (value !== 0) {
            const indicator = {
                economy: '经济',
                employment: '就业',
                satisfaction: '满意度'
            }[key];
            
            description += `${indicator}: ${value >= 0 ? '+' : ''}${value}%\n`;
        }
    });
    
    if (event.duration > 1) {
        description += `\n持续时间：${event.duration}个月`;
    }
    
    return description;
}

// 导出
window.EVENT_TYPES = EVENT_TYPES;
window.EVENT_LIBRARY = EVENT_LIBRARY; 
window.calculateEventEffect = calculateEventEffect;
window.checkEventTrigger = checkEventTrigger;
window.getEventDescription = getEventDescription;
window.EVENT_IMPACT_SYSTEM = EVENT_IMPACT_SYSTEM;
window.checkChainReactions = checkChainReactions;
window.calculateCombinedEffects = calculateCombinedEffects;
window.calculateRecovery = calculateRecovery;
window.applySeasonalEffects = applySeasonalEffects; 