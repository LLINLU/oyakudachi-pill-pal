#!/usr/bin/env python3
"""
Gmail OAuth 2.0认证脚本
用于获取访问令牌
"""

import os
import json
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# Gmail API权限范围 - 添加读取权限用于测试连接
SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly'
]

def authenticate_gmail():
    """进行Gmail OAuth 2.0认证"""
    creds = None
    
    # 检查是否已有有效的token
    if os.path.exists('token.json'):
        try:
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)
            print("✅ 找到现有token文件")
        except Exception as e:
            print(f"❌ 读取token文件失败: {e}")
            creds = None
    
    # 如果没有有效的凭证，进行OAuth认证
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("🔄 刷新访问令牌...")
            try:
                creds.refresh(Request())
                print("✅ 令牌刷新成功")
            except Exception as e:
                print(f"❌ 令牌刷新失败: {e}")
                creds = None
        
        if not creds:
            print("🔐 开始OAuth 2.0认证流程...")
            try:
                # 创建OAuth流程
                flow = InstalledAppFlow.from_client_secrets_file(
                    'credentials.json', SCOPES)
                
                # 运行本地服务器进行认证
                creds = flow.run_local_server(port=0)
                print("✅ OAuth认证成功")
                
                # 保存凭证
                with open('token.json', 'w') as token:
                    token.write(creds.to_json())
                print("✅ 访问令牌已保存到token.json")
                
            except Exception as e:
                print(f"❌ OAuth认证失败: {e}")
                return None
    
    return creds

def test_gmail_connection(creds):
    """测试Gmail连接"""
    try:
        from googleapiclient.discovery import build
        
        # 构建Gmail服务
        service = build('gmail', 'v1', credentials=creds)
        
        # 获取用户信息
        profile = service.users().getProfile(userId='me').execute()
        email = profile.get('emailAddress', 'Unknown')
        print(f"✅ Gmail连接成功")
        print(f"📧 认证邮箱: {email}")
        
        return service
        
    except Exception as e:
        print(f"❌ Gmail连接测试失败: {e}")
        return None

def test_send_email(service, to_email):
    """测试发送邮件"""
    try:
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        import base64
        
        # 创建测试邮件
        msg = MIMEMultipart()
        msg['to'] = to_email
        msg['subject'] = 'Gmail API测试邮件'
        
        # 添加HTML内容
        html_content = """
        <html>
        <body>
            <h2>Gmail API测试邮件</h2>
            <p>这是一封通过Gmail API发送的测试邮件。</p>
            <p>如果收到这封邮件，说明Gmail API配置成功！</p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html_content, 'html'))
        
        # 编码邮件
        raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode('utf-8')
        
        # 发送邮件
        service.users().messages().send(userId='me', body={'raw': raw_message}).execute()
        
        print(f"✅ 测试邮件发送成功到: {to_email}")
        return True
        
    except Exception as e:
        print(f"❌ 测试邮件发送失败: {e}")
        return False

def main():
    """主函数"""
    print("🚀 Gmail OAuth 2.0认证工具")
    print("=" * 40)
    
    # 检查凭证文件
    if not os.path.exists('credentials.json'):
        print("❌ credentials.json文件不存在")
        print("请确保已下载OAuth 2.0客户端ID文件")
        return
    
    # 进行认证
    creds = authenticate_gmail()
    if not creds:
        print("❌ 认证失败")
        return
    
    # 测试连接
    service = test_gmail_connection(creds)
    if service:
        print("\n🎉 Gmail API设置完成！")
        
        # 测试发送邮件
        test_email = input("\n📧 请输入测试邮件地址 (或按回车跳过): ").strip()
        if test_email:
            test_send_email(service, test_email)
        else:
            print("⏭️  跳过邮件发送测试")
            
        print("\n✅ 现在可以发送邮件了")
    else:
        print("\n❌ Gmail API设置失败")

if __name__ == "__main__":
    main()
