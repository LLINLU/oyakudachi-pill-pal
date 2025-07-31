import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import liff from "@line/liff";
import axios from "axios";

const liffId = "2007738170-Ze0RA3X1"; // TODO: 替换为你的实际LIFF ID

function InviteBind() {
  const { code } = useParams();
  const [nickname, setNickname] = useState("");
  const [lineUserId, setLineUserId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBinding, setIsBinding] = useState(false);

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
    if (!nickname.trim()) {
      setStatus("请输入昵称");
      return;
    }

    try {
      setIsBinding(true);
      setStatus("正在绑定...");
      
      const res = await axios.post("/api/invite/bind", {
        code,
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
      maxWidth: 400, 
      margin: "40px auto", 
      padding: 24, 
      background: "#fff", 
      borderRadius: 8, 
      boxShadow: "0 2px 8px #eee" 
    }}>
      <h2 style={{ marginBottom: 24, textAlign: "center", color: "#333" }}>
        绑定家人账号
      </h2>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold", color: "#333" }}>
          邀请码
        </label>
        <input 
          type="text" 
          value={code} 
          readOnly 
          style={{ 
            width: "100%", 
            padding: "8px 12px", 
            border: "1px solid #ddd", 
            borderRadius: 4,
            backgroundColor: "#f5f5f5",
            color: "#666"
          }} 
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold", color: "#333" }}>
          LINE 昵称
        </label>
        <input 
          type="text" 
          value={displayName} 
          readOnly 
          style={{ 
            width: "100%", 
            padding: "8px 12px", 
            border: "1px solid #ddd", 
            borderRadius: 4,
            backgroundColor: "#f5f5f5",
            color: "#666"
          }} 
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold", color: "#333" }}>
          在家人中的昵称 *
        </label>
        <input 
          type="text" 
          value={nickname} 
          onChange={e => setNickname(e.target.value)} 
          placeholder="如：妈妈、爸爸、女儿"
          style={{ 
            width: "100%", 
            padding: "8px 12px", 
            border: "1px solid #ddd", 
            borderRadius: 4,
            outline: "none"
          }} 
        />
      </div>

      <button 
        onClick={handleBind} 
        disabled={!nickname.trim() || isBinding}
        style={{ 
          width: "100%",
          padding: "12px 16px", 
          borderRadius: 4, 
          background: nickname.trim() && !isBinding ? "#06c755" : "#ccc", 
          color: "#fff", 
          border: "none",
          fontSize: "16px",
          cursor: nickname.trim() && !isBinding ? "pointer" : "not-allowed"
        }}
      >
        {isBinding ? "绑定中..." : "确认绑定"}
      </button>
      
      {status && (
        <div style={{ 
          marginTop: 16, 
          padding: "12px", 
          borderRadius: 4,
          backgroundColor: status.includes("成功") ? "#d4edda" : "#f8d7da",
          color: status.includes("成功") ? "#155724" : "#721c24",
          border: `1px solid ${status.includes("成功") ? "#c3e6cb" : "#f5c6cb"}`
        }}>
          {status}
        </div>
      )}
      
      <div style={{ 
        marginTop: 16, 
        fontSize: "12px", 
        color: "#666",
        lineHeight: "1.5"
      }}>
        <p>• 绑定成功后，您将收到家人的服药提醒</p>
        <p>• 您可以随时在家人端取消绑定</p>
      </div>
    </div>
  );
}

export default InviteBind; 