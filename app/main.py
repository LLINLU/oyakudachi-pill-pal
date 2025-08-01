from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="LINE Reminder Bot API", version="1.0.0")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 健康检查端点
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "LINE Reminder Bot API is running"}

# 根端点
@app.get("/")
async def root():
    return {
        "message": "LINE Reminder Bot API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

# Gmail API相关端点
@app.get("/api/gmail/status")
async def gmail_status():
    """检查Gmail API状态"""
    credentials_file = os.getenv("GMAIL_CREDENTIALS_FILE", "credentials.json")
    token_file = os.getenv("GMAIL_TOKEN_FILE", "token.json")
    
    return {
        "credentials_file_exists": os.path.exists(credentials_file),
        "token_file_exists": os.path.exists(token_file),
        "gmail_api_ready": os.path.exists(credentials_file) and os.path.exists(token_file)
    }

@app.post("/api/gmail/send-reminder")
async def send_reminder(medication_data: dict):
    """发送药物提醒邮件"""
    return {
        "status": "success",
        "message": "药物提醒邮件发送成功（演示模式）",
        "data": medication_data
    }

# 药物管理端点
@app.get("/api/medications")
async def get_medications():
    """获取药物列表"""
    return {
        "medications": [
            {
                "id": 1,
                "name": "阿司匹林",
                "dosage": "100mg",
                "frequency": "每日一次",
                "time": "08:00"
            }
        ]
    }

@app.post("/api/medications")
async def add_medication(medication: dict):
    """添加新药物"""
    return {
        "status": "success",
        "message": "药物添加成功",
        "medication": medication
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 