import styles from "./Login.module.scss";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../Components/Spinner/Spinner";
import NotificationMessage from "../../Components/NotificationMessage/NotificationMessage";
import PasswordInput from "./PasswordInput";
import EmailInput from "./EmailInput";

export default function Login() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({
    text: "",
    type: "",
    fading: false,
  });

  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  function showMessage(text, type = "error") {
    setNotification({ text, type, fading: false });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, fading: true }));
    }, 4500);

    setTimeout(() => {
      setNotification({ text: "", type: "", fading: false });
    }, 5000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ text: "", type: "", fading: false });
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        { email, password },
        { withCredentials: true }
      );

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
        withCredentials: true,
      });

      setTimeout(() => {
        setLoading(false);
        setCurrentUser(res.data.user);
        showMessage("Login successful! Redirecting...", "success");
        navigate("/");
      }, 1000);
    } catch (err) {
      setLoading(false);
      const errorMsg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      showMessage(errorMsg, "error");
    }
  };

  return (
    <main className={`main-wrapper ${styles.loginContainer}`}>
      {notification.text && (
        <div className="notificationWrapper">
          <NotificationMessage
            message={notification.text}
            type={notification.type}
            fading={notification.fading}
          />
        </div>
      )}

      <section className={styles.loginBox}>
        <h1>Login</h1>

        {loading ? (
          <Spinner />
        ) : (
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <EmailInput
              email={email}
              setEmail={setEmail}
              error={emailError}
              setError={(val) => setEmailError(val)}
              styles={styles}
            />

            <PasswordInput
              password={password}
              setPassword={setPassword}
              styles={styles}
            />

            <button type="submit" className="btn-primary">
              LOGIN
            </button>

            <Link to="/" className="btn-secondary link-reset">
              Return
            </Link>
          </form>
        )}
      </section>
    </main>
  );
}
