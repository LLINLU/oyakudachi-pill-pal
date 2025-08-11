#!/bin/bash

echo "🚨 紧急修复脚本 - 解决前端连接问题"
echo "=================================="

# 检查是否在Docker容器内
if [ -f /.dockerenv ]; then
    echo "✅ 检测到Docker容器环境"
    
    # 强制停止所有前端进程
    echo "🛑 停止前端服务..."
    pkill -f "npm run dev" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    sleep 3
    
    # 检查后端状态
    echo "🔍 检查后端状态..."
    if curl -f http://127.0.0.1:8000/health > /dev/null 2>&1; then
        echo "✅ 后端服务正常运行"
    else
        echo "❌ 后端服务未运行"
        exit 1
    fi
    
    # 强制修复Vite配置
    echo "🔧 强制修复Vite配置..."
    if [ -f "/app/frontend/vite.config.ts" ]; then
        # 备份原配置
        cp /app/frontend/vite.config.ts /app/frontend/vite.config.ts.backup.$(date +%s)
        
        # 强制替换代理配置
        sed -i 's/target: .*8000.*/target: "http:\/\/127.0.0.1:8000",/' /app/frontend/vite.config.ts
        
        echo "✅ Vite配置已修复"
    fi
    
    # 清理前端缓存
    echo "🧹 清理前端缓存..."
    cd /app/frontend
    rm -rf node_modules/.vite 2>/dev/null || true
    rm -rf dist 2>/dev/null || true
    
    # 重新启动前端
    echo "🚀 重新启动前端服务..."
    cd /app/frontend && npm run dev -- --host 0.0.0.0 --port 3000 &
    FRONTEND_PID=$!
    
    # 等待前端启动
    echo "⏳ 等待前端启动..."
    sleep 10
    
    # 检查前端是否启动成功
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ 前端服务启动成功"
    else
        echo "❌ 前端服务启动失败"
        exit 1
    fi
    
    echo ""
    echo "🎯 修复完成！"
    echo "现在前端应该能够正确连接到后端API"
    echo "访问地址: http://localhost:3000"
    
else
    echo "❌ 不在Docker容器环境中"
    echo "请在Docker容器内运行此脚本"
fi 