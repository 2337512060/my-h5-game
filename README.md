# 未来无人交通 - HTML5游戏

一个基于HTML5的交通管理模拟游戏，玩家需要管理未来城市的无人交通系统。

## 游戏特色

- 两个独特的关卡，每个关卡都有不同的挑战和玩法
- 完全基于HTML5技术，无需安装任何插件
- 响应式设计，支持各种设备
- 保存游戏进度
- 精美的视觉效果和音效

## 关卡说明

### 第一关：交通路口调度
- 控制红绿灯系统
- 管理车辆通行
- 避免交通堵塞
- 在限定时间内获得最高分数

### 第二关：社会政策制定
- 制定交通相关政策
- 处理社会问题
- 平衡各方利益
- 确保城市稳定发展

## 安装说明

1. 克隆仓库：
```bash
git clone https://github.com/yourusername/future-autonomous-transport.git
```

2. 进入项目目录：
```bash
cd future-autonomous-transport
```

3. 使用本地服务器运行游戏（可以使用任何静态文件服务器）：

使用Python：
```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

使用Node.js：
```bash
# 安装http-server
npm install -g http-server

# 运行服务器
http-server
```

4. 在浏览器中访问：
```
http://localhost:8000
```

## 游戏控制

### 第一关
- 点击"南北方向"按钮控制南北向红绿灯
- 点击"东西方向"按钮控制东西向红绿灯
- 观察等待车辆数量和通过车辆数量
- 在60秒内尽可能多地让车辆安全通过

### 第二关
- 选择合适的政策
- 观察政策效果
- 平衡各方利益

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- Web Audio API（音效）
- LocalStorage（存档）

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 开发说明

### 文件结构
```
future-autonomous-transport/
├── index.html              # 游戏主入口
├── css/                    # 样式文件
│   ├── style.css          # 全局样式
│   └── level1.css         # 第一关样式
├── js/                    # JavaScript文件
│   ├── main.js           # 主逻辑
│   ├── level1.js         # 第一关逻辑
│   └── level3.js         # 第二关逻辑
├── assets/               # 资源文件
│   ├── images/          # 图片资源
│   ├── sounds/          # 音效资源
│   └── backgrounds/     # 背景图片
└── README.md            # 说明文档
```

### 开发环境设置

1. 安装开发依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm start
```

3. 构建生产版本：
```bash
npm run build
```

## 贡献指南

1. Fork 项目
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交改动：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目链接：[https://github.com/yourusername/future-autonomous-transport](https://github.com/yourusername/future-autonomous-transport)
- 作者邮箱：your.email@example.com

## 致谢

- 感谢所有为项目做出贡献的开发者
- 特别感谢提供反馈和建议的用户

## 更新日志

### 版本 1.0.0 (2024-01-20)
- 初始版本发布
- 实现第一关完整功能
- 基本的游戏框架搭建完成