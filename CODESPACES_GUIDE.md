# 🚀 GitHub Codespaces 快速启动指南

## 📋 原作者快速预览功能变更

这个指南帮助你在GitHub Codespaces中快速启动项目，查看功能变更。

## 🎯 一键启动步骤

### 方法1：简化启动（推荐，无需Docker）

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
   # 在Codespaces终端中运行（推荐）
   ./start-codespaces-simple.sh
   
   # 或者使用Docker方式
   ./start-codespaces.sh
   ```

4. **访问应用**
   - 前端：http://localhost:3000
   - 后端API：http://localhost:8000
   - API文档：http://localhost:8000/docs
   - 健康检查：http://localhost:8000/health

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
   
   # 停止占用端口的进程
   pkill -f "uvicorn\|npm\|node"
   ```

2. **Docker构建失败**
   ```bash
   # 清理Docker缓存
   docker system prune -a
   docker-compose up --build --force-recreate
   
   # 或者使用简化启动（推荐）
   ./start-codespaces-simple.sh
   ```

3. **依赖安装失败**
   ```bash
   # 重新安装Python依赖
   pip3 install -r requirements.txt
   
   # 重新安装前端依赖
   cd frontend && npm install
   ```

4. **文件权限问题**
   ```bash
   # 设置文件权限
   chmod +x start-codespaces-simple.sh
   chmod +x start-codespaces.sh
   chmod 644 credentials.json token.json .env
   ```

5. **Gmail API认证问题**
   ```bash
   # 检查认证状态
   curl http://localhost:8000/api/gmail/status
   
   # 如果需要重新认证
   curl http://localhost:8000/api/gmail/auth
   ```

### 启动方式对比

| 启动方式 | 优点 | 缺点 | 适用场景 |
|---------|------|------|----------|
| `./start-codespaces-simple.sh` | 快速、简单、无需Docker | 需要本地Python/Node.js | 快速预览、开发测试 |
| `./start-codespaces.sh` | 完整Docker环境 | 构建时间长、资源占用大 | 完整功能测试 |
| `docker-compose up` | 标准Docker方式 | 需要Docker环境 | 生产环境模拟 |

### 获取帮助

如果遇到问题：

1. **检查服务状态**
   ```bash
   # 检查后端健康状态
   curl http://localhost:8000/health
   
   # 检查Gmail API状态
   curl http://localhost:8000/api/gmail/status
   ```

2. **查看日志**
   ```bash
   # 查看Docker容器状态
   docker-compose ps
   
   # 查看应用日志
   docker-compose logs -f
   ```

3. **重置环境**
   ```bash
   # 清理并重新开始
   docker-compose down
   rm -f token.json
   ./start-codespaces-simple.sh
   ```

## 📞 联系信息

如有问题，请通过以下方式联系：

- GitHub Issues: [创建Issue](https://github.com/yansuu/oyakudachi-pill-pal/issues)
- Email: [你的邮箱]
- 项目文档: [README.md](./README.md)

---

**注意**: 这是一个演示环境，某些功能可能需要真实的API密钥才能完全工作。 