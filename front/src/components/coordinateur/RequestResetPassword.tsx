import { useState } from "react";
import { Link } from "react-router-dom";

function RequestResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    fetch("http://localhost:3000/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la demande de réinitialisation du mot de passe:",
          error
        );
      });
  };

  return (
    <main id="main" className="main">
      <div className="container ">
        <div className="row ">
          <div 
            className="col-md-8 my-5"
            style={{ backgroundColor: "#f2f2f2" , marginLeft:"60px"}}
          >
            {" "}
            <h2>Demande de réinitialisation du mot de passe</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <br />
              <button type="submit">
                Demander la réinitialisation du mot de passe
              </button>
            </form>
            <p>{message}</p>
            <Link to="/">Retour à la page de connexion</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RequestResetPassword;
