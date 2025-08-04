#!/bin/bash

echo "🚀 启动LINE Reminder Bot..."

# 检查环境变量
if [ -z "$SUPABASE_DB_URL" ]; then
    echo "⚠️  警告: SUPABASE_DB_URL 未设置，使用默认值"
    export SUPABASE_DB_URL="postgresql://test:test@localhost:5432/test"
fi

# 检查GitHub Secrets
if [ -n "$GMAIL_CREDENTIALS_JSON" ]; then
    echo "✅ 检测到GitHub Secrets中的GMAIL_CREDENTIALS_JSON"
    echo "$GMAIL_CREDENTIALS_JSON" > /app/credentials.json
    echo "✅ 从GitHub Secrets创建credentials.json"
fi

if [ -n "$GMAIL_TOKEN_JSON" ]; then
    echo "✅ 检测到GitHub Secrets中的GMAIL_TOKEN_JSON"
    echo "$GMAIL_TOKEN_JSON" > /app/token.json
    echo "✅ 从GitHub Secrets创建token.json"
fi

# 检查必要文件
echo "📋 检查必要文件..."
if [ ! -f "credentials.json" ]; then
    echo "❌ 错误: credentials.json 文件不存在"
    exit 1
fi

if [ ! -f "token.json" ]; then
    echo "❌ 错误: token.json 文件不存在"
    exit 1
fi

echo "✅ 所有必要文件检查通过"

# 启动后端
echo "🔧 启动后端服务器..."
cd /app && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 10

# 检查后端是否启动成功
for i in {1..10}; do
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ 后端启动成功"
        break
    else
        echo "⏳ 等待后端启动... (尝试 $i/10)"
        sleep 5
    fi
    
    if [ $i -eq 10 ]; then
        echo "❌ 后端启动失败，请检查日志"
        exit 1
    fi
done

# 启动前端
echo "🎨 启动前端开发服务器..."
cd /app/frontend && npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!

# 等待前端启动
echo "⏳ 等待前端启动..."
sleep 5

echo "✅ 所有服务启动完成！"
echo "📱 前端: http://localhost:3000"
echo "🔧 后端API: http://localhost:8000"
echo "📚 API文档: http://localhost:8000/docs"
echo "🏥 健康检查: http://localhost:8000/health"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait 