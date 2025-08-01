#!/bin/bash

echo "🚀 GitHub Codespaces 快速启动脚本"
echo "=================================="

# 检查是否在Codespaces环境中
if [ -n "$CODESPACES" ]; then
    echo "✅ 检测到GitHub Codespaces环境"
else
    echo "⚠️  不在Codespaces环境中，但可以继续运行"
fi

# 检查必要文件
echo "📋 检查配置文件..."
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

if [ ! -f token.json ]; then
    echo "❌ 缺少token.json文件，正在创建..."
    echo '{}' > token.json
    echo "✅ 创建token.json文件"
fi

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
fi

# 启动Docker服务
echo "🐳 启动Docker服务..."
docker-compose up --build

echo ""
echo "🎉 启动完成！"
echo "📱 前端访问地址：http://localhost:3000"
echo "🔧 后端API地址：http://localhost:8000"
echo "📚 API文档地址：http://localhost:8000/docs"
echo ""
echo "💡 提示："
echo "- 首次运行时会自动生成token.json"
echo "- 需要真实Gmail API凭证才能发送邮件"
echo "- 按 Ctrl+C 停止服务" 