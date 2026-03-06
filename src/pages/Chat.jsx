// The Chat page is handled by the main App.jsx routing:
// - If logged in → shows ChatPage
// - If not logged in → shows AuthScreen
// This file acts as a route target that App.jsx handles via auth state

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This component just redirects to root; App.jsx handles auth routing
const Chat = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);
  return null;
};

export default Chat;
