import { useState } from "react";
import { useParams } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    fetch(`http://localhost:3000/reset/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        window.location.href = "http://localhost:5173/";
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la réinitialisation du mot de passe:",
          error
        );
      });
  };

  return (
    <div className="container ">
      <div className="row ">
        <div
          className="col-md-6 mx-auto my-5"
          style={{ backgroundColor: "#f2f2f2" }}
        >
          {" "}
          <h2>Réinitialiser le mot de passe</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password">Nouveau mot de passe:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">
                Confirmer le mot de passe:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <br></br>
            <button type="submit">Réinitialiser le mot de passe</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
