#!/bin/bash

echo "🚀 GitHub Codespaces 简化启动脚本"
echo "=================================="

# 检查并创建必要的文件
echo "📋 检查配置文件..."

# 创建.env文件
if [ ! -f .env ]; then
    echo "❌ 缺少.env文件，正在创建..."
    cat > .env << EOF
# Supabase数据库配置
SUPABASE_DB_URL=postgresql://test:test@localhost:5432/test

# Gmail API配置
GMAIL_CREDENTIALS_FILE=credentials.json
GMAIL_TOKEN_FILE=token.json

# 应用配置
DEBUG=true
ENVIRONMENT=development

# 端口配置
BACKEND_PORT=8000
FRONTEND_PORT=3000
EOF
    echo "✅ 创建.env文件"
fi

# 创建示例credentials.json
if [ ! -f credentials.json ]; then
    echo "❌ 缺少credentials.json文件，正在创建示例文件..."
    cat > credentials.json << EOF
{
  "type": "service_account",
  "project_id": "demo-project",
  "private_key_id": "demo-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nDEMO_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "demo@demo-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/demo%40demo-project.iam.gserviceaccount.com"
}
EOF
    echo "✅ 创建示例credentials.json文件"
fi

# 创建空的token.json
if [ ! -f token.json ]; then
    echo "❌ 缺少token.json文件，正在创建..."
    echo '{}' > token.json
    echo "✅ 创建token.json文件"
fi

# 确保app目录存在
echo "📁 确保app目录存在..."
mkdir -p app

# 复制文件到app目录
echo "📁 复制配置文件到app目录..."
if [ -f credentials.json ]; then
    cp credentials.json app/ 2>/dev/null && echo "✅ credentials.json复制成功" || echo "⚠️ credentials.json复制失败"
fi

if [ -f token.json ]; then
    cp token.json app/ 2>/dev/null && echo "✅ token.json复制成功" || echo "⚠️ token.json复制失败"
fi

# 设置文件权限
echo "🔐 设置文件权限..."
chmod 644 credentials.json 2>/dev/null || echo "⚠️ 设置credentials.json权限失败"
chmod 644 token.json 2>/dev/null || echo "⚠️ 设置token.json权限失败"
chmod 644 .env 2>/dev/null || echo "⚠️ 设置.env权限失败"

echo ""
echo "🎯 使用本地环境启动（无需Docker）"
echo "=================================="

# 检查Python环境
echo "🐍 检查Python环境..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装"
    exit 1
fi

# 安装Python依赖
echo "📦 安装Python依赖..."
if [ -f requirements.txt ]; then
    pip3 install -r requirements.txt
else
    echo "⚠️ requirements.txt不存在，安装基本依赖..."
    pip3 install fastapi uvicorn python-dotenv google-auth google-auth-oauthlib google-api-python-client
fi

# 检查Node.js环境
echo "📦 检查Node.js环境..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi

# 安装前端依赖
echo "📦 安装前端依赖..."
cd frontend
if [ -f package.json ]; then
    npm install
else
    echo "❌ frontend/package.json不存在"
    exit 1
fi
cd ..

echo ""
echo "🚀 启动服务..."
echo "=================================="

# 启动后端
echo "🔧 启动后端服务器..."
cd app && python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
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
cd frontend && npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!

# 等待前端启动
echo "⏳ 等待前端启动..."
sleep 5

echo ""
echo "✅ 启动完成！"
echo "📱 前端访问地址：http://localhost:3000"
echo "🔧 后端API地址：http://localhost:8000"
echo "📚 API文档地址：http://localhost:8000/docs"
echo "🏥 健康检查：http://localhost:8000/health"
echo ""
echo "💡 提示："
echo "- 按 Ctrl+C 停止所有服务"
echo "- 后端支持热重载"
echo "- 前端支持热重载"
echo "- 邮件发送功能需要Gmail API认证"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait 