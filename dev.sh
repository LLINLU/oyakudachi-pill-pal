#!/bin/bash

echo "🚀 启动开发环境..."

# 检查虚拟环境是否存在
if [ ! -d "venv" ]; then
    echo "❌ 虚拟环境不存在，请先运行 ./setup.sh"
    exit 1
fi

# 激活虚拟环境
echo "🔧 激活虚拟环境..."
source venv/bin/activate

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "❌ .env 文件不存在，请先运行 ./setup.sh"
    exit 1
fi

# 启动后端
echo "🔧 启动后端服务器..."
cd app
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 启动前端
echo "🎨 启动前端开发服务器..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ 开发环境已启动！"
echo "📱 前端: http://localhost:3000"
echo "🔧 后端API: http://localhost:8000"
echo "📚 API文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 