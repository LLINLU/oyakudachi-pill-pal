from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import json
from datetime import datetime
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = FastAPI(title="LINE Reminder Bot API", version="1.0.0")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gmail API配置
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def generate_medication_email_html(medication_name="薬", scheduled_time="09:00", taken_time=None, status="服用済み"):
    """生成美观的服药通知邮件HTML"""
    if taken_time is None:
        taken_time = datetime.now().strftime("%Y/%m/%d %H:%M")
    
    html_template = f"""
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>お薬服用のお知らせ</title>
        <style>
            body {{
                font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }}
            .header .subtitle {{
                margin-top: 8px;
                font-size: 14px;
                opacity: 0.9;
            }}
            .content {{
                padding: 30px 20px;
            }}
            .medication-card {{
                background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                border-radius: 12px;
                padding: 25px;
                margin: 20px 0;
                border-left: 4px solid #2196f3;
            }}
            .medication-header {{
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }}
            .pill-icon {{
                width: 24px;
                height: 24px;
                background-color: #2196f3;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                color: white;
                font-size: 12px;
            }}
            .medication-title {{
                font-size: 18px;
                font-weight: 600;
                color: #1976d2;
                margin: 0;
            }}
            .medication-info {{
                background-color: white;
                border-radius: 8px;
                padding: 15px;
                margin: 15px 0;
            }}
            .info-row {{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #e0e0e0;
            }}
            .info-row:last-child {{
                border-bottom: none;
            }}
            .info-label {{
                font-weight: 500;
                color: #666;
            }}
            .info-value {{
                font-weight: 600;
                color: #333;
            }}
            .time-highlight {{
                background-color: #fff3e0;
                color: #e65100;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 600;
            }}
            .status-badge {{
                display: inline-block;
                background-color: #4caf50;
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
            }}
            .footer {{
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }}
            .footer-text {{
                color: #6c757d;
                font-size: 12px;
                margin: 0;
            }}
            .action-buttons {{
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }}
            .btn {{
                display: inline-block;
                padding: 10px 20px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 500;
                font-size: 14px;
                text-align: center;
                flex: 1;
            }}
            .btn-primary {{
                background-color: #2196f3;
                color: white;
            }}
            .btn-secondary {{
                background-color: #f8f9fa;
                color: #495057;
                border: 1px solid #dee2e6;
            }}
            .health-tip {{
                background-color: #e8f5e8;
                border-left: 4px solid #4caf50;
                padding: 15px;
                margin: 20px 0;
                border-radius: 0 8px 8px 0;
            }}
            .health-tip h3 {{
                margin: 0 0 8px 0;
                color: #2e7d32;
                font-size: 16px;
            }}
            .health-tip p {{
                margin: 0;
                color: #388e3c;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>お薬服用のお知らせ</h1>
                <div class="subtitle">Medication Intake Notification</div>
            </div>
            
            <div class="content">
                <div class="medication-card">
                    <div class="medication-header">
                        <div class="pill-icon">💊</div>
                        <h2 class="medication-title">次のお薬</h2>
                    </div>
                    
                    <div class="medication-info">
                        <div class="info-row">
                            <span class="info-label">薬品名</span>
                            <span class="info-value">{medication_name}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">スケジュール時間</span>
                            <span class="info-value time-highlight">{scheduled_time}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">服用状態</span>
                            <span class="status-badge">{status}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">服用時刻</span>
                            <span class="info-value">{taken_time}</span>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <a href="#" class="btn btn-primary">お薬の確認</a>
                        <a href="#" class="btn btn-secondary">服薬記録を確認</a>
                    </div>
                </div>
                
                <div class="health-tip">
                    <h3>💡 健康管理のヒント</h3>
                    <p>定期的な服薬は健康維持の基本です。時間を守って服用することで、より効果的な治療が期待できます。</p>
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">本人より自動送信 | Auto-sent by the user</p>
                <p class="footer-text">LINE Reminder Bot - 健康管理をサポート</p>
            </div>
        </div>
    </body>
    </html>
    """
    return html_template

def get_gmail_service():
    """获取Gmail服务实例"""
    creds = None
    credentials_file = os.getenv("GMAIL_CREDENTIALS_FILE", "credentials.json")
    token_file = os.getenv("GMAIL_TOKEN_FILE", "token.json")
    
    # 检查凭证文件是否存在
    if not os.path.exists(credentials_file):
        raise HTTPException(status_code=500, detail="Gmail credentials file not found")
    
    # 加载已保存的token
    if os.path.exists(token_file):
        try:
            with open(token_file, 'r') as f:
                token_data = f.read().strip()
                if token_data and token_data != '{}':
                    creds = Credentials.from_authorized_user_file(token_file, SCOPES)
                    print("✅ 成功加载token文件")
                else:
                    print("⚠️ token文件为空，需要重新认证")
        except Exception as e:
            print(f"❌ 加载token失败: {e}")
    
    # 如果没有有效的凭证，尝试刷新或重新认证
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
                print("✅ 成功刷新token")
                # 保存刷新后的token
                with open(token_file, 'w') as token:
                    token.write(creds.to_json())
            except Exception as e:
                print(f"❌ 刷新token失败: {e}")
                creds = None
        
        if not creds:
            print("❌ 需要重新进行OAuth认证")
            raise HTTPException(
                status_code=401, 
                detail="Gmail authentication required. Please visit /api/gmail/auth to authenticate."
            )
    
    try:
        service = build('gmail', 'v1', credentials=creds)
        return service
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to build Gmail service: {str(e)}")

def send_gmail_message(to_email, subject, body, is_html=False):
    """发送Gmail邮件"""
    try:
        print(f"🔧 开始发送邮件到: {to_email}")
        service = get_gmail_service()
        print("✅ Gmail服务获取成功")
        
        # 创建邮件
        message = MIMEMultipart()
        message['to'] = to_email
        message['subject'] = subject
        
        # 根据内容类型添加邮件正文
        if is_html or '<html>' in body or '<body>' in body:
            msg = MIMEText(body, 'html', 'utf-8')
            print("✅ 使用HTML格式发送邮件")
        else:
            msg = MIMEText(body, 'plain', 'utf-8')
            print("✅ 使用纯文本格式发送邮件")
        
        message.attach(msg)
        
        print("✅ 邮件内容创建成功")
        
        # 编码邮件
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
        print("✅ 邮件编码成功")
        
        # 发送邮件
        print("📤 正在发送邮件...")
        sent_message = service.users().messages().send(userId='me', body={'raw': raw_message}).execute()
        print(f"✅ 邮件发送成功，ID: {sent_message['id']}")
        
        return {
            "status": "success",
            "message_id": sent_message['id'],
            "thread_id": sent_message['threadId']
        }
    except HttpError as error:
        print(f"❌ Gmail API错误: {error}")
        raise HTTPException(status_code=500, detail=f"Gmail API error: {error}")
    except Exception as e:
        print(f"❌ 发送邮件失败: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

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
    
    # 检查token是否有效
    token_valid = False
    if os.path.exists(token_file):
        try:
            with open(token_file, 'r') as f:
                token_data = f.read().strip()
                token_valid = token_data and token_data != '{}'
        except:
            pass
    
    return {
        "credentials_file_exists": os.path.exists(credentials_file),
        "token_file_exists": os.path.exists(token_file),
        "token_valid": token_valid,
        "gmail_api_ready": os.path.exists(credentials_file) and token_valid,
        "auth_required": not token_valid
    }

@app.get("/api/gmail/auth")
async def gmail_auth():
    """启动Gmail OAuth认证流程"""
    try:
        credentials_file = os.getenv("GMAIL_CREDENTIALS_FILE", "credentials.json")
        token_file = os.getenv("GMAIL_TOKEN_FILE", "token.json")
        
        if not os.path.exists(credentials_file):
            raise HTTPException(status_code=500, detail="Gmail credentials file not found")
        
        # 创建OAuth流程，指定重定向URI
        flow = InstalledAppFlow.from_client_secrets_file(
            credentials_file, 
            SCOPES,
            redirect_uri='http://localhost:8000/api/gmail/auth/callback'
        )
        
        # 生成授权URL
        auth_url, _ = flow.authorization_url(
            prompt='consent',
            access_type='offline'
        )
        
        return {
            "status": "auth_required",
            "message": "请在浏览器中完成Gmail认证",
            "auth_url": auth_url,
            "instructions": [
                "1. 点击上面的auth_url链接",
                "2. 在Google页面登录并授权",
                "3. 授权成功后会自动重定向",
                "4. 检查认证状态"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start auth flow: {str(e)}")

@app.get("/api/gmail/auth/callback")
async def gmail_auth_callback(code: str = None, state: str = None):
    """处理OAuth回调"""
    try:
        if not code:
            raise HTTPException(status_code=400, detail="Authorization code is required")
        
        credentials_file = os.getenv("GMAIL_CREDENTIALS_FILE", "credentials.json")
        token_file = os.getenv("GMAIL_TOKEN_FILE", "token.json")
        
        # 创建OAuth流程，指定重定向URI
        flow = InstalledAppFlow.from_client_secrets_file(
            credentials_file, 
            SCOPES,
            redirect_uri='http://localhost:8000/api/gmail/auth/callback'
        )
        
        # 交换授权码获取token
        flow.fetch_token(code=code)
        
        # 保存token
        with open(token_file, 'w') as token:
            token.write(flow.credentials.to_json())
        
        # 返回HTML页面显示成功信息
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Gmail认证成功</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .success { color: green; font-size: 24px; }
                .info { color: #666; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="success">✅ Gmail认证成功！</div>
            <div class="info">现在可以发送邮件了。</div>
            <div class="info">
                <a href="http://localhost:3001" target="_blank">返回应用</a>
            </div>
        </body>
        </html>
        """
        
        from fastapi.responses import HTMLResponse
        return HTMLResponse(content=html_content)
        
    except Exception as e:
        error_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>认证失败</title>
            <style>
                body {{ font-family: Arial, sans-serif; text-align: center; padding: 50px; }}
                .error {{ color: red; font-size: 24px; }}
            </style>
        </head>
        <body>
            <div class="error">❌ 认证失败</div>
            <div>{str(e)}</div>
        </body>
        </html>
        """
        from fastapi.responses import HTMLResponse
        return HTMLResponse(content=error_html, status_code=500)

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

@app.post("/api/send-email")
async def send_email(payload: dict):
    """发送邮件接口"""
    try:
        print(f"收到邮件发送请求: {payload}")
        
        # 从payload中提取邮件信息，支持多种格式
        to_email = payload.get('to') or payload.get('email') or payload.get('recipient')
        subject = payload.get('subject', '药物提醒')
        body = payload.get('body') or payload.get('message') or payload.get('content', '这是一封药物提醒邮件')
        
        # 如果没有指定收件人，使用默认邮箱（你需要替换为你的邮箱）
        if not to_email:
            to_email = "your-email@gmail.com"  # 请替换为你的真实邮箱
            print(f"使用默认邮箱: {to_email}")
        
        print(f"准备发送邮件到: {to_email}")
        print(f"主题: {subject}")
        print(f"内容: {body}")
        
        # 检测是否为HTML内容或使用默认模板
        is_html = '<html>' in body or '<body>' in body or '<h' in body or '<p>' in body
        
        # 如果没有提供HTML内容，使用默认的美观模板
        if not is_html and subject == "お薬服用のお知らせ":
            # 从payload中提取药品信息
            medication_name = payload.get('medication_name', '薬')
            scheduled_time = payload.get('scheduled_time', '09:00')
            status = payload.get('status', '服用済み')
            
            body = generate_medication_email_html(
                medication_name=medication_name,
                scheduled_time=scheduled_time,
                taken_time=datetime.now().strftime("%Y/%m/%d %H:%M"),
                status=status
            )
            is_html = True
            print("✅ 使用美观的邮件模板")
        
        # 发送邮件
        result = send_gmail_message(to_email, subject, body, is_html=is_html)
        
        return {
            "status": "success",
            "message": "邮件发送成功",
            "data": {
                "to": to_email,
                "subject": subject,
                "message_id": result.get("message_id"),
                "thread_id": result.get("thread_id")
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"发送邮件失败: {str(e)}")
        raise HTTPException(status_code=500, detail=f"发送邮件失败: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 