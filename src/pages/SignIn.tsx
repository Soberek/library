import { Navigate } from "react-router-dom";
import Input from "../components/Input";
import { useUser } from "../providers/UserContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const SignIn = () => {
  const authContext = useUser();

  if (authContext.user?.uid) {
    return <Navigate to="/" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User signed in:", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in:", errorCode, errorMessage);
      });
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: "32px",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ marginBottom: 24, fontWeight: 600, color: "#333" }}>
        Zaloguj się
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <Input type="email" placeholder="Email" name="email" />
        <Input type="password" placeholder="Hasło" name="password" />
        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#1976d2",
            color: "#fff",
            fontWeight: 500,
            fontSize: "16px",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          Zaloguj
        </button>
      </form>
    </div>
  );
};

export default SignIn;
