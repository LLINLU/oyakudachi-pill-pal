#!/usr/bin/env python3
"""
测试邮件发送功能
"""

import requests
import json

def test_email_send():
    """测试邮件发送"""
    url = "http://localhost:8000/api/send-email"
    
    # 测试数据
    test_data = {
        "to": "your-email@gmail.com",  # 请替换为你的真实邮箱
        "subject": "测试邮件 - 药物提醒系统",
        "body": "这是一封来自药物提醒系统的测试邮件。\n\n如果您收到这封邮件，说明邮件发送功能正常工作！"
    }
    
    print("🚀 测试邮件发送功能...")
    print(f"📧 收件人: {test_data['to']}")
    print(f"📝 主题: {test_data['subject']}")
    print(f"📄 内容: {test_data['body']}")
    print("-" * 50)
    
    try:
        response = requests.post(url, json=test_data, headers={"Content-Type": "application/json"})
        
        print(f"📊 响应状态码: {response.status_code}")
        print(f"📋 响应内容: {response.text}")
        
        if response.status_code == 200:
            print("✅ 邮件发送成功！")
            result = response.json()
            print(f"📧 邮件ID: {result.get('data', {}).get('message_id')}")
        else:
            print("❌ 邮件发送失败！")
            
    except Exception as e:
        print(f"❌ 请求失败: {str(e)}")

if __name__ == "__main__":
    test_email_send() 