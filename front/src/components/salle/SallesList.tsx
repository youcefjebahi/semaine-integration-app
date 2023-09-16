import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";

interface SallesListProps {
  searchTerm: string;
}

const SallesList: React.FC<SallesListProps> = ({ searchTerm }) => {
  const [salles, setSalles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const token = Cookies.get("token");
  const itemsPerPage = 6;

  useEffect(() => {
    axios
      .get("http://localhost:3000/salles", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setSalles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching salles data:", error);
      });
  }, []);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  let filteredSalles;
  if (searchTerm != "")
    filteredSalles = salles.filter((salle) => salle.numero === searchTerm);
  else filteredSalles = salles;

  const slicedSalles = filteredSalles.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <main id="main" className="main">
            {salles.length > 0 ? (

      <div className="container">
        <h2 className="my-4">Liste des salles:</h2>
        <div className="row">
          {slicedSalles.map((salle) => (
            <div key={salle._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <b>Numero:</b>
                    {salle.numero}
                  </h5>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
        <ReactPaginate
          pageCount={Math.ceil(filteredSalles.length / itemsPerPage)}
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
        <b>Pas des salles trouvés!</b>
      )}
    </main>
  );
};

export default SallesList;
