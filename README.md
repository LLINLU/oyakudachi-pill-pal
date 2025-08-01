# LINE Reminder Bot

一个集成了Gmail API的智能服药提醒系统，支持LINE通知和邮件通知。

## 🚀 快速开始（推荐使用Docker）

### 一键启动（最简单）

```bash
# 克隆项目
git clone https://github.com/yansuu/oyakudachi-pill-pal.git
cd oyakudachi-pill-pal

# 切换到功能分支
git checkout feature/gmail-api-integration-v2

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入正确的配置

# 一键启动所有服务
docker-compose up --build
```

### 访问应用

启动成功后，访问：
- **前端页面**: http://localhost:3000
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs

## 📋 环境要求

- **Docker** 和 **Docker Compose**（推荐）
- 或者 Python 3.11+ + Node.js 18+

## ⚙️ 配置说明

### 必需的环境变量

在 `.env` 文件中配置：

```env
# Supabase数据库
SUPABASE_DB_URL=postgresql://username:password@host:port/database

# Gmail API配置
GMAIL_CREDENTIALS_FILE=credentials.json
GMAIL_TOKEN_FILE=token.json
```

### Gmail API设置

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建项目并启用Gmail API
3. 创建OAuth 2.0凭证
4. 下载 `credentials.json` 文件到项目根目录
5. 首次运行时会自动生成 `token.json`

## 🛠️ 开发命令

### 使用Docker（推荐）

```bash
# 启动所有服务
docker-compose up --build

# 后台运行
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重新构建
docker-compose up --build --force-recreate
```

### 本地开发环境

```bash
# 1. 运行环境设置脚本
chmod +x setup.sh
./setup.sh

# 2. 配置环境变量
# 编辑 .env 文件，填入正确的配置

# 3. 启动开发环境
chmod +x dev.sh
./dev.sh
```

## 🔍 Pull Request 预览

### 对于代码审查者

当有新的Pull Request时，你可以通过以下方式预览更改：

#### 🚀 GitHub Codespaces（推荐，一键启动）

**最简单的代码审查方法：**

1. **在Pull Request页面点击"Code"按钮**
2. **选择"Codespaces"标签**
3. **点击"Create codespace on feature/gmail-api-integration-v2"**
4. **等待环境自动设置完成（约1-2分钟）**
5. **在终端运行：`./start-codespaces.sh`**
6. **访问：http://localhost:3000**

> 📖 **详细指南**：[CODESPACES_GUIDE.md](./CODESPACES_GUIDE.md)
> 🚀 **快速指南**：[QUICK_START.md](./QUICK_START.md)

#### 方法1：使用GitHub Secrets（推荐，安全）
```bash
# 在Codespaces中运行
chmod +x setup-secrets.sh
./setup-secrets.sh

# 使用Secrets配置启动
docker-compose -f docker-compose.secrets.yml up --build
```

#### 方法2：Docker一键启动
```bash
# 克隆PR分支
git clone https://github.com/yansuu/oyakudachi-pill-pal.git
cd oyakudachi-pill-pal
git checkout feature/gmail-api-integration-v2

# 配置环境变量
cp env.template .env
# 编辑 .env 文件，填入正确的配置

# 一键启动
docker-compose up --build
```



#### 方法4：本地测试
```bash
# 克隆PR分支
git clone https://github.com/yansuu/oyakudachi-pill-pal.git
cd oyakudachi-pill-pal
git checkout feature/gmail-api-integration-v2

# 快速启动（Docker）
docker-compose up --build

# 或本地启动
./setup.sh
./dev.sh
```

### 测试清单
- [ ] 前端页面正常加载
- [ ] 手动输入药物功能正常
- [ ] 药物状态更新正常
- [ ] 邮件通知功能正常
- [ ] 数据库连接正常

## 📁 项目结构

```
line-reminder-bot/
├── app/                    # 后端FastAPI应用
│   ├── main.py            # 主应用文件
│   └── Dockerfile         # 后端Docker配置
├── frontend/              # 前端React应用
│   ├── src/               # 源代码
│   ├── package.json       # 前端依赖
│   └── vite.config.ts     # Vite配置
├── docker-compose.yml     # Docker编排
├── Dockerfile            # 主Docker配置
├── setup.sh              # 环境设置脚本
├── dev.sh                # 开发启动脚本
├── requirements.txt      # Python依赖
└── .env                  # 环境变量
```

## 🔧 故障排除

### 常见问题

1. **Docker端口冲突**
   ```bash
   # 停止占用端口的容器
   docker stop $(docker ps -q)
   
   # 或者修改docker-compose.yml中的端口映射
   ```

2. **Gmail API认证失败**
   - 检查 `credentials.json` 文件是否存在
   - 确保在Google Cloud Console中添加了测试用户

3. **数据库连接失败**
   - 检查 `SUPABASE_DB_URL` 格式是否正确
   - 确认数据库服务是否正常运行

4. **Docker构建失败**
   ```bash
   # 清理Docker缓存
   docker system prune -a
   
   # 重新构建
   docker-compose up --build --force-recreate
   ```

## 📝 部署说明

### 生产环境部署

```bash
# 构建生产镜像
docker build -t line-reminder-bot .

# 运行生产容器
docker run -d \
  -p 8000:8000 \
  -p 3000:3000 \
  --env-file .env \
  line-reminder-bot
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
