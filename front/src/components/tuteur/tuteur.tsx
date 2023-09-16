import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Tuteur: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const [tuteur, setTuteur] = useState<any | null>(null);
  const token = Cookies.get("token");

  if (email)
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/tuteurs/${window.atob(email)}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            }
          );
          setTuteur(response.data);
        } catch (error) {
          console.error("Error fetching tuteur data:", error);
        }
      };

      fetchData();
    }, [email]);

  return (
    <main id="main" className="main">
      <div className="container">
        <h2 className="my-4">Tuteur:</h2>
        <div className="row">
          {tuteur && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <b>
                    {tuteur.nom} {tuteur.prenom}
                  </b>
                </h5>
                <div className="card-text">
                  <b>Email:</b> {tuteur.email}
                  <br />
                  <b>Departement:</b> {tuteur.departement}
                  <br />
                  {tuteur.equipes.length > 0 ? (
                    <div>
                      <b>Equipes: </b>
                      {tuteur.equipes.map((equipe: any, index: number) => (
                        <React.Fragment key={equipe.nom}>
                          <a
                            href={`http://localhost:5173/team/${window.btoa(
                              equipe.nom
                            )}`}
                            className="team-link"
                          >
                            {equipe.nom}
                          </a>
                          {index < tuteur.equipes.length - 1 ? ", " : ""}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <b>Equipes: </b>N/A
                    </div>
                  )}
                  <br />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Tuteur;
