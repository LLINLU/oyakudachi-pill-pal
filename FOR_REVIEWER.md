# 给原作者的测试指南

## 🎯 快速测试功能

### 方法1：GitHub Codespaces（推荐）

1. **在Pull Request页面点击"Code"按钮**
2. **选择"Codespaces"标签**
3. **点击"Create codespace on feature/gmail-api-integration-v2"**
4. **等待环境自动设置完成（约1-2分钟）**
5. **在终端运行：`./start-codespaces.sh`**
6. **访问：http://localhost:3000**

### 方法2：本地Docker

```bash
# 克隆项目
git clone https://github.com/yansuu/oyakudachi-pill-pal.git
cd oyakudachi-pill-pal
git checkout feature/gmail-api-integration-v2

# 配置环境
cp env.example .env

# 启动服务
docker-compose up --build
```

## 🧪 功能测试清单

### 基础功能测试
- [ ] 前端页面正常加载 (http://localhost:3000)
- [ ] 后端API正常响应 (http://localhost:8000/health)
- [ ] API文档可访问 (http://localhost:8000/docs)

### 邮件功能测试
- [ ] 邮件发送API测试
- [ ] 美观的HTML邮件模板
- [ ] Gmail API认证流程

### 测试邮件发送

```bash
# 测试基础邮件发送
curl -X POST http://localhost:8000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@example.com", "subject": "Test Email", "body": "Hello World"}'

# 测试美观的服药通知邮件
curl -X POST http://localhost:8000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@example.com", "subject": "お薬服用のお知らせ", "medication_name": "アスピリン 100mg", "scheduled_time": "09:00", "status": "服用済み"}'
```

## 🔧 主要功能变更

### 1. 邮件发送功能
- ✅ 集成Gmail API
- ✅ 美观的HTML邮件模板
- ✅ 自动检测HTML内容格式
- ✅ 支持动态药品信息

### 2. 启动脚本优化
- ✅ 简化启动脚本解决ARM64兼容性
- ✅ Codespaces一键启动
- ✅ 自动配置文件创建

### 3. 开发体验改进
- ✅ 热重载支持
- ✅ 详细的错误日志
- ✅ 测试脚本和工具

## 📧 邮件模板特点

新的邮件模板包含：
- 🎨 美观的渐变设计
- 📱 响应式布局
- 💊 完整的药品信息展示
- ⏰ 时间信息高亮显示
- 🏷️ 状态标签
- 💡 健康管理提示

## 🚨 注意事项

1. **Gmail API认证**：首次使用需要OAuth认证
2. **敏感信息**：credentials.json和token.json已加入.gitignore
3. **环境变量**：使用env.example作为配置模板
4. **兼容性**：ARM64 Mac用户建议使用Codespaces测试

## 📞 联系方式

如有问题，请通过GitHub Issues或Pull Request评论联系。 