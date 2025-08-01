# GitHub Codespaces Docker测试指南

## 🎯 测试目标
确保原作者在GitHub Codespaces中能正常运行项目，验证功能变更。

## 🚀 快速测试步骤

### 1. 在GitHub Codespaces中启动项目
```bash
# 在Codespaces终端中运行
./start-codespaces.sh
```

### 2. 验证服务状态
```bash
# 检查后端API
curl http://localhost:8000/health

# 检查前端服务
curl http://localhost:3000

# 检查Gmail API状态
curl http://localhost:8000/api/gmail/status
```

### 3. 测试邮件发送功能
```bash
# 测试邮件发送
curl -X POST http://localhost:8000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com", "subject": "测试邮件", "body": "这是一封测试邮件"}'
```

### 4. 访问前端应用
- 前端地址：http://localhost:3000
- 后端API文档：http://localhost:8000/docs

## 🔍 预期结果

### ✅ 成功指标
- 后端API正常运行（端口8000）
- 前端应用正常访问（端口3000）
- 邮件发送功能正常工作
- 没有ARM64兼容性错误

### ❌ 失败指标
- 前端启动失败
- 端口冲突
- 依赖安装错误

## 📝 测试记录

请在测试时记录以下信息：
- [ ] 后端启动成功
- [ ] 前端启动成功
- [ ] 邮件发送功能正常
- [ ] 页面访问正常
- [ ] 功能变更可见

## 🛠️ 故障排除

### 如果前端启动失败
```bash
# 清理并重新安装依赖
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 如果端口被占用
```bash
# 检查端口占用
lsof -i :3000 -i :8000

# 停止占用进程
docker-compose down
```

## 📋 给原作者的说明

原作者在Codespaces中测试时：
1. 使用 `./start-codespaces.sh` 一键启动
2. 访问 http://localhost:3000 查看前端
3. 测试邮件发送功能
4. 验证你的功能变更

这样确保环境一致性，避免本地ARM64问题影响测试。 