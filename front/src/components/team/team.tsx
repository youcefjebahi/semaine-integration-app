import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

interface TeamDetailsPageProps {}

const TeamDetailsPage: React.FC<TeamDetailsPageProps> = () => {
  const { nom } = useParams<{ nom: string }>();
  const [team, setTeam] = useState<any | null>(null);
  const token = Cookies.get("token");
  if (nom)
    useEffect(() => {
      axios
        .get(`http://localhost:3000/equipes/${window.atob(nom)}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          setTeam(response.data);
        })
        .catch((error) => {
          console.error("Error fetching team details:", error);
        });
    }, [nom]);

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
        {team && (
          <div className="row">
            <div className="col-md-4 mb-4">
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
          </div>
        )}
      </div>
    </main>
  );
};

export default TeamDetailsPage;
