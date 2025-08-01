import React, { useState, useRef } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

export function FamilyInviteQuickButton({ ownerUserId }: { ownerUserId: number }) {
  const [inviteCode, setInviteCode] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    try {
      console.log("开始生成邀请码，ownerUserId:", ownerUserId);
      setIsLoading(true);
      setError("");
      
      const res = await axios.post("/api/invite/generate", { 
        owner_user_id: ownerUserId 
      });
      
      console.log("API响应:", res.data);
      const code = res.data.code;
      const url = `${window.location.origin}/invite/${code}`;
      
      console.log("生成的邀请码:", code);
      console.log("生成的URL:", url);
      
      setInviteCode(code);
      setInviteUrl(url);
      setShow(true);
      setCopied(false);
    } catch (error: any) {
      console.error("生成邀请码失败:", error);
      console.error("错误详情:", error.response?.data || error.message);
      setError(`生成邀请码失败: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (inviteUrl) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(inviteUrl).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
    }
  };

  const fallbackCopy = () => {
    if (inputRef.current) {
      inputRef.current.value = inviteUrl;
      inputRef.current.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        setError("复制失败，请手动复制链接");
      }
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <button
        style={{
          width: "100%",
          padding: "12px 0",
          background: isLoading ? "#ccc" : "#06c755",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 18,
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s"
        }}
        onClick={handleGenerate}
        disabled={isLoading}
      >
        {isLoading ? "生成中..." : "邀请家人"}
      </button>
      
      {error && (
        <div style={{ 
          marginTop: 8, 
          padding: "8px 12px", 
          background: "#f8d7da", 
          color: "#721c24", 
          borderRadius: 4,
          fontSize: "14px"
        }}>
          {error}
        </div>
      )}
      
      {show && inviteCode && (
        <div style={{ 
          marginTop: 16, 
          background: "#f8f9fa", 
          padding: 16, 
          borderRadius: 8, 
          border: "1px solid #e9ecef"
        }}>
          <h3 style={{ 
            margin: "0 0 12px 0", 
            fontSize: "16px", 
            fontWeight: "bold",
            color: "#333"
          }}>
            邀请家人
          </h3>
          
          <div style={{ marginBottom: 12 }}>
            <label style={{ 
              display: "block", 
              marginBottom: 4, 
              fontSize: "14px", 
              fontWeight: "bold",
              color: "#555"
            }}>
              邀请码
            </label>
            <div style={{ 
              display: "flex", 
              alignItems: "center",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 4,
              padding: "8px 12px"
            }}>
              <span style={{ 
                flex: 1, 
                fontFamily: "monospace",
                fontSize: "16px",
                color: "#333"
              }}>
                {inviteCode}
              </span>
              <button 
                onClick={() => {
                  navigator.clipboard?.writeText(inviteCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{ 
                  marginLeft: 8, 
                  padding: "4px 8px", 
                  borderRadius: 4, 
                  border: "1px solid #06c755", 
                  color: "#06c755", 
                  background: "#fff", 
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                复制
              </button>
            </div>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ 
              display: "block", 
              marginBottom: 4, 
              fontSize: "14px", 
              fontWeight: "bold",
              color: "#555"
            }}>
              邀请链接
            </label>
            <div style={{ 
              display: "flex", 
              alignItems: "center",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 4,
              padding: "8px 12px"
            }}>
              <input
                ref={inputRef}
                type="text"
                value={inviteUrl}
                readOnly
                style={{ 
                  flex: 1, 
                  border: "none", 
                  outline: "none",
                  fontSize: "14px",
                  color: "#333"
                }}
              />
              <button 
                onClick={handleCopy}
                style={{ 
                  marginLeft: 8, 
                  padding: "4px 8px", 
                  borderRadius: 4, 
                  border: "1px solid #06c755", 
                  color: copied ? "#fff" : "#06c755", 
                  background: copied ? "#06c755" : "#fff", 
                  cursor: "pointer",
                  fontSize: "12px",
                  transition: "all 0.3s"
                }}
              >
                {copied ? "已复制" : "复制"}
              </button>
            </div>
          </div>
          
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ 
              marginBottom: 8, 
              fontSize: "14px", 
              fontWeight: "bold",
              color: "#555"
            }}>
              或扫描二维码
            </div>
            <div style={{ 
              display: "inline-block", 
              background: "#fff", 
              padding: 12, 
              borderRadius: 8,
              border: "1px solid #ddd"
            }}>
              <QRCodeSVG value={inviteUrl} size={120} />
            </div>
          </div>
          
          <div style={{ 
            fontSize: "12px", 
            color: "#666",
            lineHeight: "1.5",
            background: "#fff",
            padding: "12px",
            borderRadius: 4,
            border: "1px solid #e9ecef"
          }}>
            <p style={{ margin: "0 0 4px 0" }}>• 将邀请链接或二维码发送给家人</p>
            <p style={{ margin: "0 0 4px 0" }}>• 家人点击链接后会自动登录 LINE 并绑定</p>
            <p style={{ margin: 0 }}>• 绑定成功后即可接收服药提醒</p>
          </div>
        </div>
      )}
    </div>
  );
} 