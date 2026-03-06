// This page renders when the user navigates to /login
// It wraps the existing AuthScreen component (Login mode)
// The actual auth logic lives in src/components/auth/AuthScreen.jsx

import AuthScreen from "../components/auth/AuthScreen";

const Login = () => {
  return <AuthScreen />;
};

export default Login;
