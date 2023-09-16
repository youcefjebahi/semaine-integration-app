import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");

interface Coordinateur {
  nom: string;
  email: string;
  prenom: string;
  image: {
    data: string;
    contentType: string;
  };
}

function ConsulterCoordinateur() {
  const { email } = useParams<{ email: string }>();
  const [coordinateur, setCoordinateur] = useState<Coordinateur | null>(null);

  useEffect(() => {
    fetchCoordinateur();
  }, []);

  const fetchCoordinateur = async () => {
    if (email)
      try {
        const response = await axios.get(
          `http://localhost:3000/coordinateurs/${window.atob(email)}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        const coordinateurData = response.data;
        setCoordinateur(coordinateurData);
      } catch (error) {
        console.error("Failed to fetch coordinateur:", error);
      }
  };
  const deleteCoordinateur = async () => {
    try {
      if (email)
        await axios.delete(
          `http://localhost:3000/coordinateurs/${window.atob(email)}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
      Cookies.remove("token");
      window.location.href = "http://localhost:5173/";
    } catch (error) {
      console.error("Failed to delete coordinateur:", error);
    }
  };

  if (!coordinateur) {
    return <div>Loading...</div>;
  }

  return (
    <main id="main" className="main">
      <div className="container">
        <div className="row">
          <div style={{ backgroundColor: "#f2f2f2", height: "515px" }}>
            <h4>Coordinateur information:</h4>
            <br />
            <p>
              <strong>nom:</strong> {coordinateur.nom}
            </p>
            <p>
              <strong>prénom:</strong> {coordinateur.prenom}
            </p>
            <p>
              <strong>email:</strong> {coordinateur.email}
            </p>

            {coordinateur.image && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <label style={{ marginRight: "10px" }}>
                  <strong>image:</strong>
                </label>
                <img
                  src={`data:${coordinateur.image.contentType};base64,${coordinateur.image.data}`}
                  alt="Coordinateur"
                  style={{ width: "155px", height: "auto" }}
                />
              </div>
            )}

            <button
              className="btn btn-outline-secondary btn-sm"
              style={{ marginRight: "65px" }}
            >
              <Link
                to={`/modifierCoordinateur/${window.btoa(coordinateur.email)}`}
                style={{ color: "inherit" }}
              >
                Modifier
              </Link>
            </button>

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => deleteCoordinateur()}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ConsulterCoordinateur;
