#!/bin/bash

echo "🚀 启动LINE Reminder Bot..."

# 检查环境变量
if [ -z "$SUPABASE_DB_URL" ]; then
    echo "⚠️  警告: SUPABASE_DB_URL 未设置"
fi

# 启动后端
echo "🔧 启动后端服务器..."
cd /app && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 5

# 检查后端是否启动成功
if ! curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "❌ 后端启动失败"
    exit 1
fi

echo "✅ 后端启动成功"

# 启动前端
echo "🎨 启动前端开发服务器..."
cd /app/frontend && npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!

echo "✅ 所有服务启动完成！"
echo "📱 前端: http://localhost:3000"
echo "🔧 后端API: http://localhost:8000"
echo "📚 API文档: http://localhost:8000/docs"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 