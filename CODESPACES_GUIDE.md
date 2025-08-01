# 🚀 GitHub Codespaces 快速启动指南

## 📋 原作者快速预览功能变更

这个指南帮助你在GitHub Codespaces中快速启动项目，查看功能变更。

## 🎯 一键启动步骤

### 方法1：GitHub Codespaces（推荐）

1. **打开Codespaces**
   - 在Pull Request页面点击"Code"按钮
   - 选择"Codespaces"标签
   - 点击"Create codespace on [分支名]"

2. **等待环境设置**
   - Codespaces会自动运行`.devcontainer/setup.sh`
   - 安装Python和Node.js依赖
   - 创建必要的配置文件

3. **启动应用**
   ```bash
   # 在Codespaces终端中运行
   docker-compose up --build
   ```

4. **访问应用**
   - 前端：http://localhost:3000
   - 后端API：http://localhost:8000
   - API文档：http://localhost:8000/docs

### 方法2：使用GitHub Secrets（更安全）

如果你有敏感配置信息：

1. **设置GitHub Secrets**
   - 在仓库设置中添加以下Secrets：
     - `SUPABASE_DB_URL`: 你的数据库连接字符串
     - `GMAIL_CREDENTIALS_JSON`: Gmail API凭证文件内容
     - `GMAIL_TOKEN_JSON`: Gmail访问令牌（可选）

2. **使用Secrets启动**
   ```bash
   docker-compose -f docker-compose.secrets.yml up --build
   ```

## 🔧 环境配置

### 自动创建的配置文件

Codespaces会自动创建以下文件：

- `.env` - 环境变量配置
- `credentials.json` - Gmail API凭证（示例）
- `token.json` - Gmail访问令牌（空文件，首次运行生成）

### 端口转发

- **3000** - 前端开发服务器
- **8000** - 后端API服务器

## 📝 功能变更说明

### 新增功能

1. **Gmail API集成**
   - 自动发送药物提醒邮件
   - OAuth认证流程
   - 邮件模板系统

2. **改进的用户界面**
   - 响应式设计
   - 移动端优化
   - 无障碍访问支持

3. **增强的数据管理**
   - 实时数据同步
   - 离线支持
   - 数据备份

### 技术改进

- 升级到最新依赖版本
- 优化构建性能
- 改进错误处理
- 增强安全性

## 🐛 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口使用情况
   lsof -i :3000
   lsof -i :8000
   ```

2. **Docker构建失败**
   ```bash
   # 清理Docker缓存
   docker system prune -a
   docker-compose up --build --force-recreate
   ```

3. **依赖安装失败**
   ```bash
   # 重新安装依赖
   pip install -r requirements.txt
   cd frontend && npm install
   ```

### 获取帮助

如果遇到问题：

1. 检查Codespaces日志
2. 查看Docker容器状态：`docker-compose ps`
3. 查看应用日志：`docker-compose logs -f`

## 📞 联系信息

如有问题，请通过以下方式联系：

- GitHub Issues: [创建Issue](https://github.com/yansuu/oyakudachi-pill-pal/issues)
- Email: [你的邮箱]
- 项目文档: [README.md](./README.md)

---

**注意**: 这是一个演示环境，某些功能可能需要真实的API密钥才能完全工作。 