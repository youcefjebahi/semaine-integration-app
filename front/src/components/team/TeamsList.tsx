import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

interface teamslistProps {
  searchTerm: string;
}

const TeamsList: React.FC<teamslistProps> = ({ searchTerm }) => {
  const [teams, setTeams] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const token = Cookies.get("token");
  const itemsPerPage = 6;
  useEffect(() => {
    axios
      .get("http://localhost:3000/equipes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teams data:", error);
      });
  }, []);
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

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };
  let filteredteams;
  if (searchTerm != "")
    filteredteams = teams.filter((team) => team.nom === searchTerm);
  else filteredteams = teams;

  const slicedTeams = filteredteams.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const generateExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Equipes");
  
    const headerRow = worksheet.addRow([
      "Nom",
      "CI",
      "Tuteur",
      "Salles",
      "N° Etudiants",
      "Etudiants", 
    ]);
  
    headerRow.font = { bold: true };
  
    teams.forEach((team) => {
      const sectionCounts = Object.entries(getSectionCounts(team))
        .map(([section, count]) => `${count} ${section}`)
        .join(", ");
  
      const studentNames = team.etudiants
        .map((student: any) => `${student.prenom} ${student.nom}`)
        .join(", ");
  
      worksheet.addRow([
        team.nom,
        team.international ? "oui" : "non",
        team.tuteur ? `${team.tuteur.prenom} ${team.tuteur.nom}` : "",
        team.salles.length > 0
          ? team.salles.map((salle: any) => `${salle.numero}`).join(", ")
          : "",
        `${team.etudiants.length}: ${sectionCounts}`,
        studentNames, 
      ]);
    });
  
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "equipes.xlsx");
    });
  };
  

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 10;
    const teamsPerPage = 4;
  
    teams.forEach((team, index) => {
      if (index > 0 && index % teamsPerPage === 0) {
        doc.addPage();
        y = 10;
      }
      const sectionCounts = Object.entries(getSectionCounts(team))
        .map(([section, count]) => `${count} ${section}`)
        .join(", ");
  
      const studentNames = team.etudiants
        .map((student: any) => `${student.prenom} ${student.nom}`)
        .join(" , ");
  
      doc.setFontSize(18);
      doc.setFont("bold");
  
      doc.text(team.nom, 20, y+5);
      y += 15;
  
      doc.setFontSize(12);
      doc.text("CI: ", 20, y);
      doc.text(`${team.international ? "oui" : "non"}`, 30, y);
      y += 10;
      doc.text("Tuteur:", 20, y);
      doc.text(
        `${
          team.tuteur ? `${team.tuteur.prenom} ${team.tuteur.nom}` : "N/A"
        }`,
        36,
        y
      );
      y += 10;
      doc.text("Salles:", 20, y);
      doc.text(
        `${
          team.salles.length > 0
            ? team.salles.map((salle: any) => `${salle.numero}`).join(", ")
            : ""
        }`,
        35,
        y
      );
      y += 10;
      doc.text("N° Etudiants: ", 20, y);
      doc.text(`${team.etudiants.length} ( ${sectionCounts} )`, 45, y);
      y += 10;
      doc.text("Etudiants: ", 20, y);
      const lines = doc.splitTextToSize(`${studentNames}`, 160);
      doc.text(lines, 40, y);
      y += 10;
  
      doc.setDrawColor(200);
      doc.setLineWidth(0.2);
      doc.line(20, y, 200, y);
      y += 5;
    });
  
    doc.save("equipes.pdf");
  };
  
  

  return (
    <main id="main" className="main">
      {teams.length > 0 ? (
        <div className="container">
          <h2 className="my-4">Liste des équipes:</h2>
          <div className="row">
            {slicedTeams.map((team) => (
              <div key={team._id} className="col-md-4 mb-4">
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
                            .map(
                              (salle: any) => `${salle.numero}`
                            )
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
            ))}
            <div className="button-container" style={{ paddingBottom: "20px" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={generateExcel}
                style={{ marginRight: "20px" }}
              >
                Générer Excel
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={generatePDF}
              >
                Générer PDF
              </button>
            </div>
          </div>
          <ReactPaginate
            pageCount={Math.ceil(filteredteams.length / itemsPerPage)}
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
        <b>Pas d'équipes trouvés!</b>
      )}
    </main>
  );
};

export default TeamsList;
