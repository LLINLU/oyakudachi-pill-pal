#!/bin/bash

echo "🔐 GitHub Secrets 启动脚本"
echo "=========================="

# 检查是否在Codespaces环境中
if [ -n "$CODESPACES" ]; then
    echo "✅ 检测到Codespaces环境"
    
    # 运行secrets设置脚本
    echo "📋 设置GitHub Secrets..."
    ./setup-secrets.sh
    
    # 检查必要文件
    echo ""
    echo "🔍 检查必要文件..."
    if [ -f "credentials.json" ]; then
        echo "✅ credentials.json 存在"
    else
        echo "❌ credentials.json 不存在"
        exit 1
    fi
    
    if [ -f "token.json" ]; then
        echo "✅ token.json 存在"
    else
        echo "❌ token.json 不存在"
        exit 1
    fi
    
    if [ -f ".env" ]; then
        echo "✅ .env 文件存在"
    else
        echo "❌ .env 文件不存在"
        exit 1
    fi
    
    # 检查环境变量
    echo ""
    echo "🔧 检查环境变量..."
    source .env
    if [ -n "$SUPABASE_DB_URL" ]; then
        echo "✅ SUPABASE_DB_URL 已设置"
    else
        echo "⚠️  SUPABASE_DB_URL 未设置"
    fi
    
    if [ -n "$GMAIL_CREDENTIALS_FILE" ]; then
        echo "✅ GMAIL_CREDENTIALS_FILE 已设置: $GMAIL_CREDENTIALS_FILE"
    else
        echo "⚠️  GMAIL_CREDENTIALS_FILE 未设置"
    fi
    
    if [ -n "$GMAIL_TOKEN_FILE" ]; then
        echo "✅ GMAIL_TOKEN_FILE 已设置: $GMAIL_TOKEN_FILE"
    else
        echo "⚠️  GMAIL_TOKEN_FILE 未设置"
    fi
    
    echo ""
    echo "🚀 启动应用程序..."
    echo "=========================="
    
    # 启动Docker Compose
    docker-compose up --build
    
else
    echo "❌ 不在Codespaces环境中"
    echo "请使用标准启动方法:"
    echo "  ./start-codespaces-simple.sh  # 简化启动"
    echo "  ./start-codespaces.sh         # Docker启动"
    exit 1
fi 