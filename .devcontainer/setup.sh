#!/bin/bash

echo "🚀 设置GitHub Codespaces环境..."

# 检查是否在Codespaces环境中
if [ -n "$CODESPACES" ]; then
    echo "✅ 检测到Codespaces环境"
    
    # 创建环境变量文件
    cat > .env << EOF
# Supabase数据库配置
# 使用环境变量或默认值
SUPABASE_DB_URL=\${SUPABASE_DB_URL:-postgresql://test:test@localhost:5432/test}

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
    
    # 创建示例凭证文件（用于演示）
    if [ ! -f credentials.json ]; then
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
    
    # 创建空的token文件
    if [ ! -f token.json ]; then
        echo '{}' > token.json
        echo "✅ 创建空的token.json文件"
    fi
    
    # 安装依赖
    echo "📦 安装Python依赖..."
    pip install --upgrade pip
    if [ -f requirements.txt ]; then
        pip install -r requirements.txt
    fi
    
    echo "📦 安装前端依赖..."
    if [ -d frontend ]; then
        cd frontend
        npm install
        cd ..
    fi
    
    echo "✅ 环境设置完成！"
    echo ""
    echo "🚀 启动命令："
    echo "1. 使用Docker: docker-compose up --build"
    echo "2. 或使用Secrets: docker-compose -f docker-compose.secrets.yml up --build"
    echo ""
    echo "📝 注意："
    echo "- 首次运行时会自动生成token.json"
    echo "- 需要配置真实的Gmail API凭证才能发送邮件"
    echo "- 前端访问地址：http://localhost:3000"
    echo "- 后端API地址：http://localhost:8000"
    
else
    echo "❌ 不在Codespaces环境中"
    echo "请使用标准配置方法"
fi 