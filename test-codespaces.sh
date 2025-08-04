#!/bin/bash

echo "🧪 GitHub Codespaces 环境测试脚本"
echo "=================================="

# 测试1：检查必要文件
echo "📋 测试1：检查必要文件..."
files_to_check=(".env" "credentials.json" "token.json" "requirements.txt" "frontend/package.json")
all_files_exist=true

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 不存在"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = true ]; then
    echo "✅ 所有必要文件检查通过"
else
    echo "❌ 缺少必要文件，请运行 ./start-codespaces-simple.sh"
    exit 1
fi

# 测试2：检查环境变量
echo ""
echo "🔧 测试2：检查环境变量..."
if [ -f .env ]; then
    echo "✅ .env 文件存在"
    source .env
    echo "   SUPABASE_DB_URL: ${SUPABASE_DB_URL:-未设置}"
    echo "   GMAIL_CREDENTIALS_FILE: ${GMAIL_CREDENTIALS_FILE:-未设置}"
    echo "   GMAIL_TOKEN_FILE: ${GMAIL_TOKEN_FILE:-未设置}"
else
    echo "❌ .env 文件不存在"
fi

# 测试3：检查Python环境
echo ""
echo "🐍 测试3：检查Python环境..."
if command -v python3 &> /dev/null; then
    echo "✅ Python3 已安装: $(python3 --version)"
    
    # 检查关键Python包
    python3 -c "import fastapi" 2>/dev/null && echo "✅ FastAPI 已安装" || echo "❌ FastAPI 未安装"
    python3 -c "import uvicorn" 2>/dev/null && echo "✅ Uvicorn 已安装" || echo "❌ Uvicorn 未安装"
    python3 -c "import google.auth" 2>/dev/null && echo "✅ Google Auth 已安装" || echo "❌ Google Auth 未安装"
else
    echo "❌ Python3 未安装"
fi

# 测试4：检查Node.js环境
echo ""
echo "📦 测试4：检查Node.js环境..."
if command -v node &> /dev/null; then
    echo "✅ Node.js 已安装: $(node --version)"
    if command -v npm &> /dev/null; then
        echo "✅ npm 已安装: $(npm --version)"
    else
        echo "❌ npm 未安装"
    fi
else
    echo "❌ Node.js 未安装"
fi

# 测试5：检查端口可用性
echo ""
echo "🔌 测试5：检查端口可用性..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  端口 3000 已被占用"
else
    echo "✅ 端口 3000 可用"
fi

if lsof -i :8000 > /dev/null 2>&1; then
    echo "⚠️  端口 8000 已被占用"
else
    echo "✅ 端口 8000 可用"
fi

# 测试6：检查Docker环境
echo ""
echo "🐳 测试6：检查Docker环境..."
if command -v docker &> /dev/null; then
    echo "✅ Docker 已安装: $(docker --version)"
    if docker info > /dev/null 2>&1; then
        echo "✅ Docker 服务运行正常"
    else
        echo "❌ Docker 服务未运行"
    fi
else
    echo "❌ Docker 未安装"
fi

# 测试7：检查Gmail API配置
echo ""
echo "📧 测试7：检查Gmail API配置..."
if [ -f credentials.json ]; then
    echo "✅ credentials.json 存在"
    if [ -s credentials.json ]; then
        echo "✅ credentials.json 不为空"
    else
        echo "❌ credentials.json 为空"
    fi
else
    echo "❌ credentials.json 不存在"
fi

if [ -f token.json ]; then
    echo "✅ token.json 存在"
    if [ -s token.json ] && [ "$(cat token.json)" != "{}" ]; then
        echo "✅ token.json 包含有效数据"
    else
        echo "⚠️  token.json 为空或无效"
    fi
else
    echo "❌ token.json 不存在"
fi

echo ""
echo "🎯 测试完成！"
echo "=================================="
echo "如果所有测试都通过，您可以运行："
echo "  ./start-codespaces-simple.sh  # 简化启动（推荐）"
echo "  ./start-codespaces.sh         # Docker启动"
echo ""
echo "如果发现问题，请参考 CODESPACES_GUIDE.md 中的故障排除部分" 