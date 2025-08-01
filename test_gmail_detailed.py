#!/usr/bin/env python3
"""
详细的Gmail API测试脚本
用于诊断邮件发送问题
"""

import os
import json
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Gmail API配置
SCOPES = ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.compose']

def test_gmail_setup():
    """测试Gmail设置"""
    print("🔍 开始Gmail API诊断...")
    
    # 检查文件
    credentials_file = "credentials.json"
    token_file = "token.json"
    
    print(f"📁 检查凭证文件: {credentials_file}")
    if os.path.exists(credentials_file):
        print("✅ credentials.json 存在")
        try:
            with open(credentials_file, 'r') as f:
                creds_data = json.load(f)
                print(f"📋 项目ID: {creds_data.get('installed', {}).get('project_id', 'N/A')}")
        except Exception as e:
            print(f"❌ 读取credentials.json失败: {e}")
    else:
        print("❌ credentials.json 不存在")
        return False
    
    print(f"📁 检查token文件: {token_file}")
    if os.path.exists(token_file):
        print("✅ token.json 存在")
        try:
            with open(token_file, 'r') as f:
                token_data = json.load(f)
                print(f"📋 Token类型: {token_data.get('token_type', 'N/A')}")
                print(f"📋 过期时间: {token_data.get('expiry', 'N/A')}")
        except Exception as e:
            print(f"❌ 读取token.json失败: {e}")
    else:
        print("❌ token.json 不存在")
        return False
    
    return True

def test_gmail_service():
    """测试Gmail服务"""
    print("\n🔧 测试Gmail服务...")
    
    try:
        # 加载凭证
        creds = None
        if os.path.exists('token.json'):
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)
            print("✅ 成功加载token")
        
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                print("🔄 刷新token...")
                creds.refresh(Request())
                with open('token.json', 'w') as token:
                    token.write(creds.to_json())
                print("✅ token刷新成功")
            else:
                print("❌ 需要重新认证")
                return False
        
        # 构建服务
        service = build('gmail', 'v1', credentials=creds)
        print("✅ Gmail服务构建成功")
        
        # 测试获取用户信息
        profile = service.users().getProfile(userId='me').execute()
        print(f"✅ 用户信息: {profile.get('emailAddress', 'N/A')}")
        
        return service
        
    except Exception as e:
        print(f"❌ Gmail服务测试失败: {e}")
        return None

def test_send_email(service, to_email):
    """测试发送邮件"""
    print(f"\n📤 测试发送邮件到: {to_email}")
    
    try:
        # 创建邮件
        message = MIMEMultipart()
        message['to'] = to_email
        message['subject'] = 'Gmail API Test Email'
        
        body = "This is a test email sent via Gmail API to verify the integration is working correctly."
        msg = MIMEText(body, 'plain', 'utf-8')
        message.attach(msg)
        
        # 编码邮件
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
        print("✅ 邮件编码成功")
        
        # 发送邮件
        print("📤 正在发送邮件...")
        sent_message = service.users().messages().send(userId='me', body={'raw': raw_message}).execute()
        
        print(f"✅ 邮件发送成功!")
        print(f"📋 消息ID: {sent_message['id']}")
        print(f"📋 线程ID: {sent_message['threadId']}")
        
        return True
        
    except HttpError as error:
        print(f"❌ Gmail API错误: {error}")
        print(f"📋 错误详情: {error.resp.status} {error.content}")
        return False
    except Exception as e:
        print(f"❌ 发送邮件失败: {e}")
        return False

def main():
    """主函数"""
    print("🚀 Gmail API 详细诊断工具")
    print("=" * 50)
    
    # 测试设置
    if not test_gmail_setup():
        print("❌ Gmail设置检查失败")
        return
    
    # 测试服务
    service = test_gmail_service()
    if not service:
        print("❌ Gmail服务测试失败")
        return
    
    # 测试发送邮件
    test_email = "yansu9364@gmail.com"
    if test_send_email(service, test_email):
        print("\n🎉 所有测试通过!")
        print("📧 请检查你的邮箱收件箱和垃圾邮件文件夹")
    else:
        print("\n❌ 邮件发送测试失败")
        print("💡 建议检查:")
        print("   1. Google Cloud Console中的Gmail API设置")
        print("   2. OAuth 2.0凭证配置")
        print("   3. 应用是否已发布或添加了测试用户")

if __name__ == "__main__":
    main() 