#!/bin/bash

echo "🔐 设置GitHub Secrets..."

# 检查是否在Codespaces环境中
if [ -n "$CODESPACES" ]; then
    echo "✅ 检测到Codespaces环境"
    
    # 从GitHub Secrets获取环境变量
    if [ -n "$SUPABASE_DB_URL" ]; then
        echo "✅ 获取到SUPABASE_DB_URL"
    else
        echo "⚠️  SUPABASE_DB_URL未设置"
    fi
    
    if [ -n "$GMAIL_CREDENTIALS_JSON" ]; then
        echo "✅ 获取到GMAIL_CREDENTIALS_JSON"
        # 创建credentials.json文件
        echo "$GMAIL_CREDENTIALS_JSON" > credentials.json
        echo "✅ 创建credentials.json文件"
    else
        echo "⚠️  GMAIL_CREDENTIALS_JSON未设置"
        # 创建示例文件
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
    
    if [ -n "$GMAIL_TOKEN_JSON" ]; then
        echo "✅ 获取到GMAIL_TOKEN_JSON"
        # 创建token.json文件
        echo "$GMAIL_TOKEN_JSON" > token.json
        echo "✅ 创建token.json文件"
    else
        echo "⚠️  GMAIL_TOKEN_JSON未设置 - 程序首次运行时会自动生成"
        # 创建空的token.json文件
        echo "{}" > token.json
        echo "✅ 创建空的token.json文件"
    fi
    
    # 确保app目录存在
    mkdir -p app
    
    # 复制文件到app目录
    cp credentials.json app/ 2>/dev/null && echo "✅ credentials.json复制到app目录" || echo "⚠️ credentials.json复制失败"
    cp token.json app/ 2>/dev/null && echo "✅ token.json复制到app目录" || echo "⚠️ token.json复制失败"
    
    # 设置文件权限
    chmod 644 credentials.json token.json 2>/dev/null || echo "⚠️ 设置文件权限失败"
    
    # 创建.env文件
    cat > .env << EOF
SUPABASE_DB_URL=$SUPABASE_DB_URL
GMAIL_CREDENTIALS_FILE=credentials.json
GMAIL_TOKEN_FILE=token.json
DEBUG=true
ENVIRONMENT=development
BACKEND_PORT=8000
FRONTEND_PORT=3000
EOF
    
    echo "✅ 创建.env文件"
    echo "🚀 现在可以运行: docker-compose up --build"
    echo "📧 首次运行时会自动生成Gmail访问令牌"
    
else
    echo "❌ 不在Codespaces环境中"
    echo "请使用标准配置方法"
fi 