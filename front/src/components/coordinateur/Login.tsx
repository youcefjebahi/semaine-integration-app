import { useEffect, useState } from "react";

import Cookies from "js-cookie";

import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  useEffect(() => {
    localStorage.clear();
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: any) => {
    e.preventDefault();

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          Cookies.set("token", data.token);

          if (email === "admin")
            window.location.href =
              "http://localhost:5173/firstUpdate/" + window.btoa(email);
          else window.location.href = "http://localhost:5173/dashboard/";
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion:", error);
      });
  };

  return (
    <main id="main" className="main">
      <div
        className="container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
          backgroundColor: "#f0f0f0",
          borderRadius: "10px",
          height: "620px",
        }}
      >
        <div className="row">
          <div className="login-page">
            <div className="login-form">
              <h2>Connexion</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Mot de passe:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="login-button">
                  Se connecter
                </button>
              </form>
              <Link to="/requestResetPassword">Mot de passe oublié?</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
