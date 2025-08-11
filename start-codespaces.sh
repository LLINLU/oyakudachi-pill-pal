#!/bin/bash

echo "🚀 GitHub Codespaces 一键启动脚本"
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

# 创建requirements.txt（如果不存在）
if [ ! -f requirements.txt ]; then
    echo "❌ 缺少requirements.txt文件，正在创建..."
    cat > requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
python-dotenv==1.0.0
google-auth==2.23.4
google-auth-oauthlib==1.1.0
google-auth-httplib2==0.1.1
google-api-python-client==2.108.0
psycopg2-binary==2.9.9
sqlmodel==0.0.14
pydantic==2.5.0
pydantic-settings==2.1.0
httpx==0.25.2
EOF
    echo "✅ 创建requirements.txt文件"
else
    echo "✅ requirements.txt文件已存在"
fi

# 确保app目录存在
echo "📁 确保app目录存在..."
mkdir -p app

# 复制文件到app目录（修复路径问题）
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

# 确保start.sh有执行权限
chmod +x start.sh 2>/dev/null || echo "⚠️ 设置start.sh权限失败"

echo ""
echo "🎯 使用开发模式启动（支持热重载）"
echo "=================================="

# 启动Docker Compose
echo "🐳 启动Docker服务..."
docker-compose up --build

echo ""
echo "✅ 启动完成！"
echo "📱 前端访问地址：http://localhost:3000"
echo "🔧 后端API地址：http://localhost:8000"
echo "📚 API文档地址：http://localhost:8000/docs"
echo ""
echo "💡 提示："
echo "- 按 Ctrl+C 停止所有服务"
echo "- 后端支持热重载"
echo "- 前端支持热重载"
echo "- 邮件发送功能需要Gmail API认证" 