#!/bin/bash

echo "🚀 生产环境启动脚本"
echo "=================="

# 检查必要文件
echo "📋 检查配置文件..."
if [ ! -f .env ]; then
    echo "❌ 缺少.env文件，请先配置环境变量"
    exit 1
fi

if [ ! -f credentials.json ]; then
    echo "❌ 缺少credentials.json文件，请配置Gmail API凭证"
    exit 1
fi

if [ ! -f token.json ]; then
    echo "❌ 缺少token.json文件，请先进行OAuth认证"
    exit 1
fi

# 启动生产环境Docker服务
echo "🐳 启动生产环境Docker服务..."
echo "🏗️ 使用生产模式启动（优化性能）"
docker-compose -f docker-compose.prod.yml up --build -d

echo ""
echo "🎉 生产环境启动完成！"
echo "📱 前端访问地址：http://localhost:3000"
echo "🔧 后端API地址：http://localhost:8000"
echo "📚 API文档地址：http://localhost:8000/docs"
echo ""
echo "💡 提示："
echo "- 生产模式已优化性能和安全性"
echo "- 使用 docker-compose -f docker-compose.prod.yml logs -f 查看日志"
echo "- 使用 docker-compose -f docker-compose.prod.yml down 停止服务" 