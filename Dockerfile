# 多阶段构建：开发阶段
FROM python:3.11-slim as development

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 复制Python依赖文件（如果存在）
COPY requirements.txt* ./

# 安装Python依赖（如果requirements.txt存在）
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; else echo "No requirements.txt found, skipping Python dependencies"; fi

# 复制前端依赖文件
COPY frontend/package*.json ./frontend/

# 安装前端依赖
WORKDIR /app/frontend
RUN npm install

# 回到应用根目录
WORKDIR /app

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 8000 3000

# 启动脚本
COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]

# 多阶段构建：生产阶段
FROM python:3.11-slim as production

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 复制Python依赖文件（如果存在）
COPY requirements.txt* ./

# 安装Python依赖（如果requirements.txt存在）
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; else echo "No requirements.txt found, skipping Python dependencies"; fi

# 复制前端依赖文件
COPY frontend/package*.json ./frontend/

# 安装前端依赖
WORKDIR /app/frontend
RUN npm install

# 回到应用根目录
WORKDIR /app

# 复制应用代码
COPY . .

# 构建前端（生产版本）
WORKDIR /app/frontend
RUN npm run build || (rm -rf node_modules package-lock.json && npm install && npm run build)

# 回到根目录
WORKDIR /app

# 暴露端口
EXPOSE 8000 3000

# 启动脚本
COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"] 