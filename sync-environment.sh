#!/bin/bash

echo "🔄 同步环境设置到GitHub..."
echo "=================================="

# 检查Git状态
echo "📋 检查Git状态..."
git status

# 添加所有必要的文件
echo "📁 添加配置文件..."
git add .devcontainer/devcontainer.json
git add .devcontainer/setup.sh
git add frontend/package.json
git add frontend/package-lock.json
git add requirements.txt
git add env.example
git add .gitignore
git add start-codespaces.sh
git add start-simple.sh
git add FOR_REVIEWER.md
git add CODESPACES_TEST_GUIDE.md
git add email_template.html
git add test_email.py
git add test_gmail_detailed.py

# 检查是否有未提交的更改
if git diff --staged --quiet; then
    echo "✅ 没有新的更改需要提交"
else
    echo "📝 提交环境设置更新..."
    git commit -m "chore: 同步环境设置和依赖配置

- 更新.devcontainer配置确保Codespaces环境一致
- 确保所有必要的依赖包都已包含
- 更新启动脚本和测试工具
- 完善文档和指南
- 确保原作者可以在Codespaces中顺利运行和测试"
    
    echo "🚀 推送到GitHub..."
    git push origin feature/gmail-api-integration-v2
    
    echo "✅ 环境设置已同步到GitHub！"
fi

echo ""
echo "🎯 原作者现在可以："
echo "1. 在Pull Request页面点击'Code'按钮"
echo "2. 选择'Codespaces'标签"
echo "3. 创建新的Codespaces环境"
echo "4. 运行: ./start-codespaces.sh"
echo "5. 访问: http://localhost:3000"
echo ""
echo "📋 包含的更新："
echo "- ✅ 完整的.devcontainer配置"
echo "- ✅ 所有必要的依赖包"
echo "- ✅ 自动环境设置脚本"
echo "- ✅ 启动脚本和测试工具"
echo "- ✅ 详细的文档和指南" 