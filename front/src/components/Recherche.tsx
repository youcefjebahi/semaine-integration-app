import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const Recherche: React.FC = () => {
  const [salle, setSalle] = useState<any | null>(null);
  const [tuteur, setTuteur] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [team, setTeam] = useState<any | null>(null);
  const [membreComite, setMembresComite] = useState<any | null>(null);
  const [etudiant, setEtudiant] = useState<any | null>(null);

  const token = Cookies.get("token");
  const { searchTerm } = useParams<{ searchTerm: string }>();
  if (searchTerm) {
    const backendEndpoints = [
      `http://localhost:3000/salles/${window.atob(searchTerm)}`,
      `http://localhost:3000/tuteurs/${window.atob(searchTerm)}`,
      `http://localhost:3000/membresComite/${window.atob(searchTerm)}`,
      `http://localhost:3000/equipes/${window.atob(searchTerm)}`,
      `http://localhost:3000/etudiants/${window.atob(searchTerm)}`,
    ];

    useEffect(() => {
      fetchData();
    }, []);

    const fetchData = async () => {
      for (const endpoint of backendEndpoints) {
        try {
          const response = await axios.get(endpoint, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          });
          if (response.data) {
            if (endpoint.includes("salles")) {
              setSalle(response.data);
            } else if (endpoint.includes("tuteurs")) {
              setTuteur(response.data);
            } else if (endpoint.includes("etudiants")) {
              setEtudiant(response.data);
            } else if (endpoint.includes("equipes")) {
              setTeam(response.data);
            } else if (endpoint.includes("membres")) {
              setMembresComite(response.data);
            }
            setError("ok");
            break;
          }
        } catch (error) {
          setError("Pas de résultats trouvés!");
        }
      }
    };
  }
  const getSectionCounts = (team: any) => {
    const sectionCounts: { [key: string]: number } = {};

    team.etudiants.forEach((student: any) => {
      const section = student.section;
      if (sectionCounts[section]) {
        sectionCounts[section]++;
      } else {
        sectionCounts[section] = 1;
      }
    });

    const sortedSectionCounts: { [key: string]: number } = {};

    Object.entries(sectionCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([section, count]) => {
        sortedSectionCounts[section] = count;
      });

    return sortedSectionCounts;
  };
  return (
    <main id="main" className="main">
      <div className="container">
        <div className="row">
          {error == "Pas de résultats trouvés!" && (
            <div>
              {" "}
              <p>{error}</p>
            </div>
          )}
          {salle && (
            <div className="col-md-4 mb-4">
              <h4>Salle trouvée:</h4>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <b>Numero:</b>
                    {salle.numero}
                  </h5>
                </div>
              </div>
            </div>
          )}
          {tuteur && (
            <div className="col-md-4 mb-4">
              <h4>tuteur trouvé:</h4>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <b>
                      {tuteur.nom} {tuteur.prenom}
                    </b>
                  </h5>
                  <p className="card-text">
                    <b>Email:</b> {tuteur.email}
                    <br />
                    <b>Departement:</b> {tuteur.departement}
                    <br />
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
                    <br />
                  </p>
                </div>
              </div>
            </div>
          )}
          {etudiant && (
            <div className="col-md-4 mb-4">
              <h4>Etudiant trouvé:</h4>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <b>
                      {etudiant.nom} {etudiant.prenom}
                    </b>
                  </h5>
                  <p className="card-text">
                    <b>Identifiant:</b> {etudiant.id}
                    <br />
                    <b>Section:</b> {etudiant.section}
                    <br />
                    <b>Email:</b> {etudiant.email}
                    <br />
                    <b>CI</b>: {etudiant.international ? "oui" : "non"}
                    <br />
                    <b>Equipe:</b>
                    {etudiant.equipe && (
                      <React.Fragment key={etudiant.equipe.nom}>
                        <a
                          href={`http://localhost:5173/team/${window.btoa(
                            etudiant.equipe.nom
                          )}`}
                          className="team-link"
                        >
                          {etudiant.equipe.nom}
                        </a>
                      </React.Fragment>
                    )}{" "}
                    <br />
                  </p>
                </div>
              </div>
            </div>
          )}
          {membreComite && (
            <div className="col-md-4 mb-4">
              <h4>Membre de comité trouvé:</h4>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <b>
                      {membreComite.nom} {membreComite.prenom}
                    </b>
                  </h5>
                  <p className="card-text">
                    <b>Email:</b> {membreComite.email}
                    <br />
                    <b>Tuteurs:</b>{" "}
                    {membreComite.tuteurs.map((tuteur: any, index: number) => (
                      <React.Fragment key={tuteur.email}>
                        <a
                          href={`http://localhost:5173/tuteurs/${window.btoa(
                            tuteur.email
                          )}`}
                          className="team-link"
                        >
                          {tuteur.prenom} {tuteur.nom}
                        </a>
                        {index < membreComite.tuteurs.length - 1 ? ", " : ""}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          )}
          {team && (
            <div className="col-md-4 mb-4">
              <h4>Equipe trouvée:</h4>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <b>{team.nom}</b>
                  </h5>
                  <p className="card-text">
                    <b>CI</b>: {team.international ? "oui" : "non"}
                    <br />
                    <b>Tuteur:</b>{" "}
                    {team.tuteur && (
                      <React.Fragment key={team.tuteur.email}>
                        <a
                          href={`http://localhost:5173/tuteurs/${window.btoa(
                            team.tuteur.email
                          )}`}
                          className="team-link"
                        >
                          {team.tuteur.prenom} {team.tuteur.nom}
                        </a>
                      </React.Fragment>
                    )}
                    <br />
                    <b>Salles</b>:{" "}
                    {team.salles.length > 0
                      ? team.salles
                          .map((salle: any) => `${salle.numero}`)
                          .join(", ")
                      : "N/A"}
                    <br />
                    <b>N° Etudiants:</b> {team.etudiants.length}:{" "}
                    {Object.entries(getSectionCounts(team)).map(
                      ([section, count], index, array) => (
                        <span key={section}>
                          {count} {section}
                          {index !== array.length - 1 ? ", " : ""}
                        </span>
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Recherche;
