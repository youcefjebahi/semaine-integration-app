import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";

interface TuteursListProps {
  searchTerm: string;
}

const TuteursList: React.FC<TuteursListProps> = ({ searchTerm }) => {
  const [tuteurs, setTuteurs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const token = Cookies.get("token");
  const itemsPerPage = 6;

  useEffect(() => {
    axios
      .get("http://localhost:3000/tuteurs", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setTuteurs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tuteurs data:", error);
      });
  }, []);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  let filteredTuteurs;
  if (searchTerm != "")
    filteredTuteurs = tuteurs.filter((tuteur) => tuteur.email === searchTerm);
  else filteredTuteurs = tuteurs;

  const slicedTuteurs = filteredTuteurs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <main id="main" className="main">
            {tuteurs.length > 0 ? (

      <div className="container">
        <h2 className="my-4">Liste des Tuteurs:</h2>
        <div className="row">
          {slicedTuteurs.map((tuteur) => (
            <div key={tuteur._id} className="col-md-6 mb-4">
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
            </div>
          ))}
        </div>
        <ReactPaginate
          pageCount={Math.ceil(filteredTuteurs.length / itemsPerPage)}
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
        <b>Pas des tuteurs trouvés!</b>
      )}
    </main>
  );
};

export default TuteursList;
