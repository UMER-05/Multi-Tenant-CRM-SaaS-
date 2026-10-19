import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function OAuthSuccess() {
  const {getMe} = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    // create an async function inside useEffect
    const handleOAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          navigate("/login");
          return;
        }

        // store token in localStorage
        localStorage.setItem("token", token);

        // call getMe after storing token
        await getMe();

        // optionally clean the URL
        window.history.replaceState({}, document.title, "/oauth-success");

        // redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.log("error", error);
        navigate("/login"); // fallback if something fails
      }
    };

    handleOAuth();
  }, [navigate]);

  return (
    <p className="flex justify-center items-center h-screen">
      Logging you in...
    </p>
  );
}
