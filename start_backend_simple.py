#!/usr/bin/env python3
"""
简化的后端启动脚本
避免复杂的依赖问题，提供基本的API服务
"""

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from datetime import datetime

# Gmail API相关导入
try:
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    import base64
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    GMAIL_AVAILABLE = True
except ImportError:
    GMAIL_AVAILABLE = False
    print("⚠️  Gmail API依赖未安装，将使用模拟发送")

# Gmail API配置
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def get_gmail_service():
    """获取Gmail服务"""
    if not GMAIL_AVAILABLE:
        return None
        
    try:
        creds = None
        if os.path.exists('token.json'):
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
                with open('token.json', 'w') as token:
                    token.write(creds.to_json())
            else:
                print("❌ Gmail认证失败，需要重新认证")
                return None
        
        service = build('gmail', 'v1', credentials=creds)
        return service
        
    except Exception as e:
        print(f"❌ Gmail服务初始化失败: {e}")
        return None

def send_gmail(service, to_email, subject, message, contact_name):
    """使用Gmail API发送邮件"""
    try:
        # 创建邮件
        msg = MIMEMultipart()
        msg['to'] = to_email
        msg['subject'] = subject
        
        # 添加HTML内容
        html_content = f"""
        <html>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0;">{subject}</h1>
                </div>
                <div style="padding: 20px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
                    {message}
                    <hr style="margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        このメールは自動送信されています。<br>
                        送信者: {contact_name}
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html_content, 'html'))
        
        # 编码邮件
        raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode('utf-8')
        
        # 发送邮件
        service.users().messages().send(userId='me', body={'raw': raw_message}).execute()
        
        return True
        
    except Exception as e:
        print(f"❌ Gmail发送失败: {e}")
        return False

# 创建FastAPI应用
app = FastAPI(title="LINE Reminder Bot API", version="1.0.0")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 邮件请求模型
class EmailRequest(BaseModel):
    to_email: str
    subject: str
    message: str
    contact_name: str

@app.get("/")
async def root():
    return {"message": "LINE Reminder Bot API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend service is running"}

@app.get("/api/medications")
async def get_medications():
    """获取药物列表的示例API"""
    return {
        "medications": [
            {"id": 1, "name": "アスピリン", "dosage": "100mg", "frequency": "1日3回"},
            {"id": 2, "name": "ビタミンD", "dosage": "1000IU", "frequency": "1日1回"}
        ]
    }

@app.post("/api/medications")
async def create_medication(medication: dict):
    """创建新药物的示例API"""
    return {"message": "Medication created", "data": medication}

@app.post("/api/send-email")
async def send_email(request: EmailRequest):
    """发送邮件的API端点"""
    try:
        print(f"📧 开始发送邮件:")
        print(f"   收件人: {request.to_email}")
        print(f"   主题: {request.subject}")
        print(f"   联系人: {request.contact_name}")
        
        # 尝试使用Gmail API发送
        gmail_service = get_gmail_service()
        if gmail_service:
            print("✅ 使用Gmail API发送邮件...")
            success = send_gmail(
                gmail_service, 
                request.to_email, 
                request.subject, 
                request.message, 
                request.contact_name
            )
            
            if success:
                print("✅ Gmail API发送成功")
                email_status = "sent_via_gmail"
            else:
                print("❌ Gmail API发送失败，回退到模拟发送")
                email_status = "gmail_failed_fallback"
        else:
            print("⚠️  Gmail API不可用，使用模拟发送")
            email_status = "simulated"
        
        # 记录邮件发送日志
        email_log = {
            "timestamp": datetime.now().isoformat(),
            "to_email": request.to_email,
            "subject": request.subject,
            "contact_name": request.contact_name,
            "status": email_status,
            "method": "gmail_api" if gmail_service and email_status == "sent_via_gmail" else "simulated"
        }
        
        # 保存到本地文件
        try:
            with open("email_logs.json", "a") as f:
                f.write(json.dumps(email_log) + "\n")
        except:
            pass
        
        # 返回结果
        if email_status == "sent_via_gmail":
            return {
                "status": "success",
                "message": f"邮件已通过Gmail API发送到 {request.to_email}",
                "timestamp": email_log["timestamp"],
                "method": "gmail_api"
            }
        else:
            return {
                "status": "success",
                "message": f"邮件已模拟发送到 {request.to_email} (Gmail API不可用)",
                "timestamp": email_log["timestamp"],
                "method": "simulated"
            }
        
    except Exception as e:
        print(f"❌ 邮件发送失败: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"邮件发送失败: {str(e)}"
        )

if __name__ == "__main__":
    # 启动服务器
    port = int(os.getenv("BACKEND_PORT", 8000))
    host = os.getenv("BACKEND_HOST", "0.0.0.0")
    
    print(f"🚀 启动简化后端服务...")
    print(f"📍 地址: http://{host}:{port}")
    print(f"📚 API文档: http://{host}:{port}/docs")
    print(f"🏥 健康检查: http://{host}:{port}/health")
    print(f"📧 邮件API: POST http://{host}:{port}/api/send-email")
    
    if GMAIL_AVAILABLE:
        print(f"✅ Gmail API可用")
    else:
        print(f"⚠️  Gmail API不可用，将使用模拟发送")
    
    # 修复reload警告，使用正确的模块名
    uvicorn.run("start_backend_simple:app", host=host, port=port, reload=True)
