import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import liff from "@line/liff";
import axios from "axios";

const liffId = "2007738170-Ze0RA3X1"; // TODO: 替换为你的实际LIFF ID

function InviteBind() {
  const { code: routeCode } = useParams();
  const [searchParams] = useSearchParams();
  const urlCode = searchParams.get('code');
  
  // 检查是否是LIFF回调（包含liffClientId参数）
  const isLiffCallback = searchParams.has('liffClientId');
  
  // 获取邀请码：优先使用路由参数，如果没有则使用URL查询参数
  const inviteCode = routeCode || urlCode;
  
  // 为自动生成邀请码添加状态
  const [generatedInviteCode, setGeneratedInviteCode] = useState("");
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState("");
  
  const [nickname, setNickname] = useState("");
  const [lineUserId, setLineUserId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBinding, setIsBinding] = useState(false);

  // 生成邀请码的函数
  const generateInviteLink = async () => {
    try {
      const res = await axios.post("/api/invite/generate", { 
        owner_user_id: 1 // 使用默认用户ID
      });
      const newCode = res.data.code;
      const newUrl = `${window.location.origin}/invite/${newCode}`;
      setGeneratedInviteCode(newCode);
      setGeneratedInviteUrl(newUrl);
      return newCode;
    } catch (error: any) {
      console.error("生成邀请码失败:", error);
      setStatus("生成邀请码失败，请重试");
      return null;
    }
  };

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId });
        
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setLineUserId(profile.userId);
          setDisplayName(profile.displayName);
          // 自动设置昵称为 LINE 昵称
          setNickname(profile.displayName);
          
          // 如果没有邀请码，自动生成一个（无论是LIFF回调还是直接访问）
          if (!inviteCode) {
            await generateInviteLink();
          }
        } else {
          // 未登录，跳转到 LINE 登录
          liff.login();
        }
      } catch (error) {
        console.error("LIFF 初始化失败:", error);
        setStatus("LIFF 初始化失败，请刷新页面重试");
      } finally {
        setIsLoading(false);
      }
    };

    initLiff();
  }, []);

  const handleBind = async () => {
    const codeToUse = inviteCode || generatedInviteCode;
    
    if (!codeToUse) {
      setStatus("未找到邀请码，请使用正确的邀请链接");
      return;
    }
    
    if (!nickname.trim()) {
      setStatus("请输入昵称");
      return;
    }

    try {
      setIsBinding(true);
      setStatus("正在绑定...");
      
      const res = await axios.post("/api/invite/bind", {
        code: codeToUse,
        nickname: nickname.trim(),
        line_user_id: lineUserId,
      });
      
      if (res.data.status === "success") {
        setStatus("绑定成功！您现在可以接收家人的服药提醒了。");
      } else {
        setStatus("绑定失败：" + (res.data.detail || "未知错误"));
      }
    } catch (error: any) {
      console.error("绑定失败:", error);
      if (error.response?.data?.detail) {
        setStatus("绑定失败：" + error.response.data.detail);
      } else {
        setStatus("网络错误，请重试");
      }
    } finally {
      setIsBinding(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "16px",
        color: "#666"
      }}>
        正在加载...
      </div>
    );
  }

  if (!liff.isLoggedIn()) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "16px",
        color: "#666"
      }}>
        正在跳转到 LINE 登录...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "400px", 
      margin: "0 auto",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <h1 style={{ 
        textAlign: "center", 
        marginBottom: "30px",
        color: "#333"
      }}>
        绑定家人账号
      </h1>
      
      <div style={{ 
        background: inviteCode ? "#f8f9fa" : "#e7f3ff", 
        padding: "20px", 
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
          {inviteCode ? "邀请码信息" : "LINE登录成功"}
        </h3>
        <p style={{ margin: "0 0 10px 0", color: "#666" }}>
          {inviteCode ? 
            `邀请码: ${inviteCode}` : 
            "您已成功登录LINE，系统已为您生成邀请码。"
          }
        </p>
        {generatedInviteCode && !inviteCode && (
          <div style={{ marginTop: "15px" }}>
            <p style={{ margin: "0 0 8px 0", color: "#333" }}>
              <strong>邀请码:</strong> {generatedInviteCode}
            </p>
            <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
              邀请链接: {generatedInviteUrl}
            </p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ 
          display: "block", 
          marginBottom: "8px", 
          fontWeight: "bold",
          color: "#333"
        }}>
          LINE 昵称
        </label>
        <input
          type="text"
          value={displayName}
          readOnly
          style={{ 
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd", 
            borderRadius: "4px",
            fontSize: "16px",
            backgroundColor: "#f5f5f5"
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ 
          display: "block", 
          marginBottom: "8px", 
          fontWeight: "bold",
          color: "#333"
        }}>
          在家人中的昵称
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="例如：妈妈、爸爸、儿子"
          style={{ 
            width: "100%", 
            padding: "12px", 
            border: "1px solid #ddd", 
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
      </div>

      {status && (
        <div style={{ 
          padding: "12px", 
          marginBottom: "20px", 
          borderRadius: "4px",
          backgroundColor: status.includes("成功") ? "#d4edda" : "#f8d7da",
          color: status.includes("成功") ? "#155724" : "#721c24",
          border: `1px solid ${status.includes("成功") ? "#c3e6cb" : "#f5c6cb"}`
        }}>
          {status}
        </div>
      )}

      <button
        onClick={handleBind}
        disabled={isBinding || !nickname.trim() || (!inviteCode && !generatedInviteCode)}
        style={{ 
          width: "100%", 
          padding: "12px", 
          background: isBinding || !nickname.trim() || (!inviteCode && !generatedInviteCode) ? "#ccc" : "#06c755",
          color: "#fff", 
          border: "none", 
          borderRadius: "4px",
          fontSize: "16px",
          cursor: isBinding || !nickname.trim() || (!inviteCode && !generatedInviteCode) ? "not-allowed" : "pointer"
        }}
      >
        {!inviteCode && !generatedInviteCode ? "正在生成邀请码..." : (isBinding ? "绑定中..." : "确认绑定")}
      </button>

      <div style={{ 
        marginTop: "20px", 
        padding: "15px", 
        background: "#e7f3ff", 
        borderRadius: "4px",
        fontSize: "14px",
        color: "#0066cc"
      }}>
        <p style={{ margin: "0 0 8px 0" }}><strong>绑定说明：</strong></p>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          <li>绑定后您将接收家人的服药提醒</li>
          <li>您可以随时在家人设置中修改昵称</li>
          <li>一个邀请码只能使用一次</li>
        </ul>
      </div>
    </div>
  );
}

export default InviteBind; 