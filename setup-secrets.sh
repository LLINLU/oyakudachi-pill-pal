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
        echo "$GMAIL_CREDENTIALS_JSON" > /tmp/credentials.json
        echo "✅ 创建credentials.json文件"
    else
        echo "⚠️  GMAIL_CREDENTIALS_JSON未设置"
    fi
    
    if [ -n "$GMAIL_TOKEN_JSON" ]; then
        echo "✅ 获取到GMAIL_TOKEN_JSON"
        # 创建token.json文件
        echo "$GMAIL_TOKEN_JSON" > /tmp/token.json
        echo "✅ 创建token.json文件"
    else
        echo "⚠️  GMAIL_TOKEN_JSON未设置 - 程序首次运行时会自动生成"
        # 创建空的token.json文件
        echo "{}" > /tmp/token.json
        echo "✅ 创建空的token.json文件"
    fi
    
    # 创建.env文件
    cat > .env << EOF
SUPABASE_DB_URL=$SUPABASE_DB_URL
GMAIL_CREDENTIALS_FILE=/app/credentials.json
GMAIL_TOKEN_FILE=/app/token.json
DEBUG=true
ENVIRONMENT=development
BACKEND_PORT=8000
FRONTEND_PORT=3000
EOF
    
    echo "✅ 创建.env文件"
    echo "🚀 现在可以运行: docker-compose -f docker-compose.secrets.yml up --build"
    echo "📧 首次运行时会自动生成Gmail访问令牌"
    
else
    echo "❌ 不在Codespaces环境中"
    echo "请使用标准配置方法"
fi 