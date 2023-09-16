import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";

interface MembresComiteListProps {
  searchTerm: string;
}

const MembresComiteList: React.FC<MembresComiteListProps> = ({
  searchTerm,
}) => {
  const [membresComite, setMembresComite] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const token = Cookies.get("token");
  const itemsPerPage = 6;

  useEffect(() => {
    axios
      .get("http://localhost:3000/membresComite", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setMembresComite(response.data);
      })
      .catch((error) => {
        console.error("Error fetching membres comite data:", error);
      });
  }, []);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };
  let filteredMembresComite;
  if (searchTerm != "")
    filteredMembresComite = membresComite.filter(
      (membreComite) => membreComite.email === searchTerm
    );
  else filteredMembresComite = membresComite;

  const slicedMembresComite = filteredMembresComite.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <main id="main" className="main">
      {membresComite.length > 0 ? (

      <div className="container">
        <h2 className="my-4">Liste des membres du comité:</h2>
        <div className="row">
          {slicedMembresComite.map((membreComite) => (
            <div key={membreComite._id} className="col-md-6 mb-4">
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
          ))}
        </div>
        <ReactPaginate
          pageCount={Math.ceil(filteredMembresComite.length / itemsPerPage)}
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
        <b>Pas des membres du comité trouvés!</b>
      )}
    </main>
  );
};

export default MembresComiteList;
