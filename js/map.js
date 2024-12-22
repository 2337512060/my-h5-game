class GameMap {
    constructor(containerId) {
        this.map = L.map(containerId).setView([39.9042, 116.4074], 13);
        this.markers = new Map();
        this.routes = new Map();
        this.heatmap = null;
        
        // 添加地图图层
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        // 初始化图标
        this.initIcons();
        
        // 初始化路线
        this.initRoutes();
    }
    
    // 初始化车辆图标
    initIcons() {
        this.icons = {
            traditional: L.icon({
                iconUrl: 'assets/traditional-bus.png',
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            }),
            hybrid: L.icon({
                iconUrl: 'assets/hybrid-bus.png',
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            }),
            electric: L.icon({
                iconUrl: 'assets/electric-bus.png',
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            }),
            autonomous: L.icon({
                iconUrl: 'assets/autonomous-bus.png',
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            })
        };
    }
    
    // 初始化路线
    initRoutes() {
        const routes = [
            {
                id: 'route1',
                name: '1号线',
                coordinates: [
                    [39.9042, 116.4074],
                    [39.9142, 116.4174],
                    [39.9242, 116.4274],
                    [39.9342, 116.4374]
                ],
                color: '#4CAF50'
            },
            {
                id: 'route2',
                name: '2号线',
                coordinates: [
                    [39.9142, 116.4074],
                    [39.9242, 116.4174],
                    [39.9342, 116.4274]
                ],
                color: '#2196F3'
            }
        ];
        
        routes.forEach(route => {
            const polyline = L.polyline(route.coordinates, {
                color: route.color,
                weight: 5,
                opacity: 0.8
            }).addTo(this.map);
            
            // 添加站点标记
            route.coordinates.forEach((coord, index) => {
                L.circleMarker(coord, {
                    radius: 8,
                    fillColor: route.color,
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(this.map).bindPopup(`${route.name} - 站点${index + 1}`);
            });
            
            this.routes.set(route.id, {
                polyline,
                data: route
            });
        });
    }
    
    // 添加车辆标记
    addVehicle(vehicle) {
        const marker = L.marker([39.9042, 116.4074], {
            icon: this.icons[vehicle.type]
        }).addTo(this.map);
        
        this.markers.set(vehicle.id, marker);
    }
    
    // 更新车辆位置
    updateVehiclePosition(vehicleId, position) {
        const marker = this.markers.get(vehicleId);
        if (marker) {
            marker.setLatLng(position);
        }
    }
    
    // 移除车辆标记
    removeVehicle(vehicleId) {
        const marker = this.markers.get(vehicleId);
        if (marker) {
            marker.remove();
            this.markers.delete(vehicleId);
        }
    }
    
    // 显示拥堵情况
    showCongestion(data) {
        data.forEach(item => {
            const route = this.routes.get(item.routeId);
            if (route) {
                route.polyline.setStyle({
                    color: this.getCongestionColor(item.level)
                });
            }
        });
    }
    
    // 获取拥堵颜色
    getCongestionColor(level) {
        switch (level) {
            case 'high':
                return '#f44336';
            case 'medium':
                return '#ff9800';
            case 'low':
                return '#4caf50';
            default:
                return '#4caf50';
        }
    }
    
    // 显示热力图
    showHeatmap(data) {
        if (this.heatmap) {
            this.map.removeLayer(this.heatmap);
        }
        
        this.heatmap = L.heatLayer(data, {
            radius: 25,
            blur: 15,
            maxZoom: 10,
            max: 1.0,
            gradient: {
                0.4: '#4caf50',
                0.6: '#ff9800',
                0.8: '#f44336'
            }
        }).addTo(this.map);
    }
    
    // 切换地图视图
    switchView(view) {
        switch (view) {
            case 'traffic':
                this.showTrafficView();
                break;
            case 'congestion':
                this.showCongestionView();
                break;
            case 'satisfaction':
                this.showSatisfactionView();
                break;
        }
    }
    
    // 显示交通流量视图
    showTrafficView() {
        // 显示所有车辆和路线
        this.markers.forEach(marker => marker.setOpacity(1));
        this.routes.forEach(route => route.polyline.setStyle({ opacity: 0.8 }));
        
        // 隐藏热力图
        if (this.heatmap) {
            this.map.removeLayer(this.heatmap);
        }
    }
    
    // 显示拥堵视图
    showCongestionView() {
        // 半透明显示车辆
        this.markers.forEach(marker => marker.setOpacity(0.5));
        
        // 根据拥堵程度显示路线颜色
        this.updateCongestion();
    }
    
    // 显示满意度视图
    showSatisfactionView() {
        // 隐藏车辆
        this.markers.forEach(marker => marker.setOpacity(0));
        
        // 显示满意度热力图
        const satisfactionData = this.generateSatisfactionData();
        this.showHeatmap(satisfactionData);
    }
    
    // 更新拥堵情况
    updateCongestion() {
        // 获取当前拥堵数据
        const congestionData = this.calculateCongestion();
        this.showCongestion(congestionData);
    }
    
    // 计算拥堵情况
    calculateCongestion() {
        return Array.from(this.routes.entries()).map(([routeId, route]) => {
            // 计算路线上的车辆数量
            const vehicleCount = Array.from(this.markers.values()).filter(marker => {
                const pos = marker.getLatLng();
                return this.isPointOnRoute(pos, route.data.coordinates);
            }).length;
            
            // 根据车辆数量计算拥堵等级
            const level = this.calculateCongestionLevel(vehicleCount);
            
            return {
                routeId,
                level
            };
        });
    }
    
    // 计算拥堵等级
    calculateCongestionLevel(vehicleCount) {
        if (vehicleCount > 5) return 'high';
        if (vehicleCount > 3) return 'medium';
        return 'low';
    }
    
    // 判断点是否在路线上
    isPointOnRoute(point, coordinates) {
        for (let i = 0; i < coordinates.length - 1; i++) {
            const start = L.latLng(coordinates[i]);
            const end = L.latLng(coordinates[i + 1]);
            
            if (this.isPointOnSegment(point, start, end)) {
                return true;
            }
        }
        return false;
    }
    
    // 判断点是否在线段上
    isPointOnSegment(point, start, end) {
        const distance = point.distanceTo(start) + point.distanceTo(end);
        const segmentLength = start.distanceTo(end);
        return Math.abs(distance - segmentLength) < 0.1; // 允许0.1公里的误差
    }
    
    // 生成满意度数据
    generateSatisfactionData() {
        const data = [];
        
        // 为每个站点生成满意度数据
        this.routes.forEach(route => {
            route.data.coordinates.forEach(coord => {
                data.push([
                    coord[0],
                    coord[1],
                    Math.random() // 满意度值，范围0-1
                ]);
            });
        });
        
        return data;
    }
}

// 导出地图类
window.GameMap = GameMap; 