# 🚀 代码审查快速启动指南

## 最简单的方法（推荐）

### 1. 在Pull Request页面
- 点击绿色的 **"Code"** 按钮
- 选择 **"Codespaces"** 标签
- 点击 **"Create codespace on feature/gmail-api-integration-v2"**

### 2. 等待启动
- Codespace会自动设置环境（约1-2分钟）
- 安装所有依赖
- 创建配置文件

### 3. 启动应用
```bash
./start-codespaces.sh
```

### 4. 查看功能
- **前端**：http://localhost:3000
- **后端**：http://localhost:8000
- **API文档**：http://localhost:8000/docs

## 如果遇到问题

### 端口被占用
```bash
docker-compose down
./start-codespaces.sh
```

### 查看日志
```bash
docker-compose logs -f
```

### 重新构建
```bash
docker-compose up --build --force-recreate
```

## 功能变更预览

### 新增功能
- ✅ Gmail API邮件提醒
- ✅ 改进的用户界面
- ✅ 响应式设计
- ✅ 移动端优化

### 技术改进
- ✅ 升级依赖版本
- ✅ 优化性能
- ✅ 增强安全性

---

**注意**：这是演示环境，某些功能需要真实API密钥才能完全工作。 