#!/bin/bash

echo "🔐 GitHub Secrets 配置测试"
echo "=========================="

# 检查是否在Codespaces环境中
if [ -n "$CODESPACES" ]; then
    echo "✅ 检测到Codespaces环境"
else
    echo "❌ 不在Codespaces环境中，无法测试GitHub Secrets"
    exit 1
fi

# 测试1：检查环境变量
echo ""
echo "📋 测试1：检查GitHub Secrets环境变量..."
if [ -n "$SUPABASE_DB_URL" ]; then
    echo "✅ SUPABASE_DB_URL 已设置"
    echo "   长度: ${#SUPABASE_DB_URL} 字符"
else
    echo "❌ SUPABASE_DB_URL 未设置"
fi

if [ -n "$GMAIL_CREDENTIALS_JSON" ]; then
    echo "✅ GMAIL_CREDENTIALS_JSON 已设置"
    echo "   长度: ${#GMAIL_CREDENTIALS_JSON} 字符"
    
    # 检查JSON格式
    if echo "$GMAIL_CREDENTIALS_JSON" | python3 -m json.tool > /dev/null 2>&1; then
        echo "✅ GMAIL_CREDENTIALS_JSON 是有效的JSON格式"
    else
        echo "❌ GMAIL_CREDENTIALS_JSON 不是有效的JSON格式"
    fi
else
    echo "❌ GMAIL_CREDENTIALS_JSON 未设置"
fi

if [ -n "$GMAIL_TOKEN_JSON" ]; then
    echo "✅ GMAIL_TOKEN_JSON 已设置"
    echo "   长度: ${#GMAIL_TOKEN_JSON} 字符"
    
    # 检查JSON格式
    if echo "$GMAIL_TOKEN_JSON" | python3 -m json.tool > /dev/null 2>&1; then
        echo "✅ GMAIL_TOKEN_JSON 是有效的JSON格式"
    else
        echo "❌ GMAIL_TOKEN_JSON 不是有效的JSON格式"
    fi
else
    echo "⚠️  GMAIL_TOKEN_JSON 未设置（首次运行时会自动生成）"
fi

# 测试2：运行setup-secrets.sh
echo ""
echo "📋 测试2：运行setup-secrets.sh..."
if [ -f "setup-secrets.sh" ]; then
    chmod +x setup-secrets.sh
    ./setup-secrets.sh
    
    # 检查生成的文件
    if [ -f "credentials.json" ]; then
        echo "✅ credentials.json 文件已创建"
        echo "   大小: $(wc -c < credentials.json) 字节"
    else
        echo "❌ credentials.json 文件未创建"
    fi
    
    if [ -f "token.json" ]; then
        echo "✅ token.json 文件已创建"
        echo "   大小: $(wc -c < token.json) 字节"
    else
        echo "❌ token.json 文件未创建"
    fi
    
    if [ -f ".env" ]; then
        echo "✅ .env 文件已创建"
        echo "   内容预览:"
        head -5 .env
    else
        echo "❌ .env 文件未创建"
    fi
else
    echo "❌ setup-secrets.sh 文件不存在"
fi

# 测试3：检查文件权限
echo ""
echo "📋 测试3：检查文件权限..."
if [ -f "credentials.json" ]; then
    ls -la credentials.json
fi

if [ -f "token.json" ]; then
    ls -la token.json
fi

if [ -f ".env" ]; then
    ls -la .env
fi

# 测试4：验证Gmail API配置
echo ""
echo "📋 测试4：验证Gmail API配置..."
if [ -f "credentials.json" ]; then
    # 检查credentials.json中的关键字段
    if python3 -c "
import json
try:
    with open('credentials.json', 'r') as f:
        creds = json.load(f)
    required_fields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email']
    missing_fields = [field for field in required_fields if field not in creds]
    if missing_fields:
        print(f'❌ 缺少必要字段: {missing_fields}')
    else:
        print('✅ credentials.json 包含所有必要字段')
        print(f'   项目ID: {creds.get(\"project_id\", \"N/A\")}')
        print(f'   客户端邮箱: {creds.get(\"client_email\", \"N/A\")}')
except Exception as e:
    print(f'❌ 解析credentials.json失败: {e}')
" 2>/dev/null; then
        echo "✅ credentials.json 验证通过"
    else
        echo "❌ credentials.json 验证失败"
    fi
else
    echo "❌ credentials.json 文件不存在"
fi

if [ -f "token.json" ]; then
    # 检查token.json是否为空
    if [ "$(cat token.json)" = "{}" ]; then
        echo "⚠️  token.json 为空（首次运行时会自动生成）"
    else
        echo "✅ token.json 包含数据"
    fi
else
    echo "❌ token.json 文件不存在"
fi

echo ""
echo "🎯 测试完成！"
echo "=========================="
echo "如果所有测试都通过，您可以运行："
echo "  ./start-with-secrets.sh  # 使用GitHub Secrets启动"
echo "  docker-compose up --build # 标准Docker启动"
echo ""
echo "如果发现问题，请检查GitHub Repository Secrets设置" 