#!/bin/bash

echo "🔧 修复Docker容器内网络连接问题"
echo "================================"

# 检查是否在Docker容器内
if [ -f /.dockerenv ]; then
    echo "✅ 检测到Docker容器环境"
    
    # 检查后端是否在运行
    echo "🔍 检查后端服务状态..."
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ 后端服务正在运行"
    else
        echo "❌ 后端服务未运行"
        exit 1
    fi
    
    # 检查前端代理配置
    echo "🔍 检查前端代理配置..."
    if [ -f "/app/frontend/vite.config.ts" ]; then
        echo "✅ 找到Vite配置文件"
        
        # 备份原配置
        cp /app/frontend/vite.config.ts /app/frontend/vite.config.ts.backup
        
        # 修复代理配置
        sed -i 's/target: .*localhost:8000.*/target: "http:\/\/localhost:8000",/' /app/frontend/vite.config.ts
        
        echo "✅ 已修复Vite代理配置"
    else
        echo "❌ 未找到Vite配置文件"
    fi
    
    # 重启前端服务
    echo "🔄 重启前端服务..."
    pkill -f "npm run dev" 2>/dev/null || true
    sleep 2
    
    cd /app/frontend && npm run dev -- --host 0.0.0.0 --port 3000 &
    echo "✅ 前端服务已重启"
    
else
    echo "❌ 不在Docker容器环境中"
    echo "请确保在Docker容器内运行此脚本"
fi

echo ""
echo "🎯 修复完成！"
echo "现在前端应该能够正确连接到后端API" 