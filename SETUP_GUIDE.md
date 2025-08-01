# 安全配置指南

## 🔐 敏感信息处理

**重要：不要将敏感信息提交到Git仓库！**

### 1. 环境变量配置

复制 `env.template` 为 `.env`：
```bash
cp env.template .env
```

编辑 `.env` 文件，填入你的实际配置：
```env
# 替换为你的Supabase数据库URL
SUPABASE_DB_URL=postgresql://your_username:your_password@your_host:5432/your_database

# 替换为你的Gmail API凭证文件路径
GMAIL_CREDENTIALS_FILE=credentials.json
GMAIL_TOKEN_FILE=token.json
```

### 2. Gmail API凭证

#### 获取凭证文件：
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建项目并启用Gmail API
3. 创建OAuth 2.0凭证
4. 下载 `credentials.json` 文件到项目根目录

#### 首次运行：
- 程序会自动生成 `token.json` 文件
- 需要授权访问Gmail账户

### 3. 安全注意事项

- ✅ `.env` 文件已添加到 `.gitignore`
- ✅ `credentials.json` 和 `token.json` 已添加到 `.gitignore`
- ✅ 敏感信息不会提交到Git仓库
- ✅ 每个开发者需要自己的配置

### 4. 测试环境

原作者可以：
1. 使用自己的Supabase数据库
2. 创建自己的Gmail API项目
3. 或者联系开发者获取测试配置

## 🚀 启动应用

配置完成后：
```bash
docker-compose up --build
```

访问：
- 前端：http://localhost:3000
- 后端API：http://localhost:8000
- API文档：http://localhost:8000/docs 