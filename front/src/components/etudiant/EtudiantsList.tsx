import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";

interface EtudiantsListProps {
  searchTerm: string;
}

const EtudiantsList: React.FC<EtudiantsListProps> = ({ searchTerm }) => {
  const [etudiants, setEtudiants] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const token = Cookies.get("token");

  const itemsPerPage = 6;

  useEffect(() => {
    axios
      .get("http://localhost:3000/etudiants", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setEtudiants(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students data:", error);
      });
  }, []);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  let filteredEtudiants;
  if (searchTerm != "")
    filteredEtudiants = etudiants.filter(
      (etudiant) => etudiant.id === searchTerm
    );
  else filteredEtudiants = etudiants;

  const slicedEtudiants = filteredEtudiants.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <main id="main" className="main">
            {etudiants.length > 0 ? (

      <div className="container">
        <h2 className="my-4">Liste des étudiants:</h2>
        <div className="row">
          {slicedEtudiants.map((etudiant) => (
            <div key={etudiant._id} className="col-md-6 mb-4">
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
                    <b>Email Esprit:</b> {etudiant.emailEsprit}
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
                    )}
                    <br />
                    <b>Invité</b>: {etudiant.invited ? "oui" : "non"}
                    <br />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ReactPaginate
          pageCount={Math.ceil(filteredEtudiants.length / itemsPerPage)}
          marginPagesDisplayed={1}
          pageRangeDisplayed={1}
          previousLabel={"Précédent"}
          nextLabel={"Suivant"}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          pageLinkClassName={"page"}
        />
      </div>
      ) : (
        <b>Pas d'étudiants trouvés!</b>
      )}
    </main>
  );
};

export default EtudiantsList;
