#!/bin/bash

set -e

echo "🛠️ 一键重启并热更新开发环境"
echo "==============================="

# 1. 停止所有相关容器
if docker ps -a | grep line-reminder-bot-app; then
    echo "🛑 停止旧的Docker容器..."
    docker-compose down
fi

# 2. 清理旧镜像（可选）
if docker images | grep line-reminder-bot-app; then
    echo "🧹 清理旧的Docker镜像..."
    docker image prune -f
fi

# 3. 重新构建镜像
echo "🏗️ 重新构建Docker镜像..."
docker-compose build

# 4. 启动所有服务（开发模式，支持热重载）
echo "🚀 启动所有服务（开发模式，支持热重载）..."
docker-compose up -d

# 5. 打印访问地址和状态
echo ""
echo "🎉 启动完成！"
echo "📱 前端访问地址：http://localhost:3000"
echo "🔧 后端API地址：http://localhost:8000"
echo "📚 API文档地址：http://localhost:8000/docs"
echo ""
echo "💡 提示："
echo "- 代码变动会自动热更新（前后端）"
echo "- 查看日志：docker-compose logs -f"
echo "- 停止服务：docker-compose down"
echo "- 如遇端口冲突，先手动关闭占用端口的进程"