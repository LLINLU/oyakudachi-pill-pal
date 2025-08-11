#!/bin/bash

echo "🚀 开始设置开发环境..."

# 检查Python版本
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装，请先安装Python 3.11+"
    exit 1
fi

# 检查Node.js版本
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装Node.js 18+"
    exit 1
fi

# 创建虚拟环境
echo "📦 创建Python虚拟环境..."
python3 -m venv venv

# 激活虚拟环境
echo "🔧 激活虚拟环境..."
source venv/bin/activate

# 安装Python依赖
echo "📥 安装Python依赖..."
pip install --upgrade pip
pip install -r requirements.txt

# 安装前端依赖
echo "📥 安装前端依赖..."
cd frontend
npm install
cd ..

# 创建环境变量文件模板
if [ ! -f .env ]; then
    echo "📝 创建环境变量文件模板..."
    cat > .env << EOF
# Supabase配置
SUPABASE_DB_URL=your_supabase_db_url_here

# Gmail API配置
GMAIL_CREDENTIALS_FILE=credentials.json
GMAIL_TOKEN_FILE=token.json

# 其他配置
DEBUG=true
EOF
    echo "⚠️  请编辑 .env 文件，填入正确的配置信息"
fi

echo "✅ 环境设置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 编辑 .env 文件，填入正确的配置"
echo "2. 将Gmail API凭证文件放到项目根目录"
echo "3. 运行 'source venv/bin/activate' 激活虚拟环境"
echo "4. 运行 'docker-compose up' 或手动启动前后端" 