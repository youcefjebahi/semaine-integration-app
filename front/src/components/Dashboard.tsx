import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

type DepartmentData = {
  [department: string]: number;
};
type SectionData = {
  [section: string]: number;
};
const Dashboard: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [tuteurs, setTuteurs] = useState<any[]>([]);
  const [etudiants, setEtudiants] = useState<any[]>([]);
  const [etudiantsCount, setEtudiantsCount] = useState<number>(0);
  const token = Cookies.get("token");
  const [tuteursDepartmentsData, setTuteursDepartmentsData] = useState<any>({});
  const [departmentColors, setDepartmentColors] = useState<string[]>([]);
  const [sectionColors, setSectionColors] = useState<string[]>([]);
  const [teamInternationalData, setTeamInternationalData] = useState<any>({});
  const [teamInternationalColors, setTeamInternationalColors] = useState<
    string[]
  >([]);

  const [etudiantsSectionsData, setEtudiantsSectionsData] =
    useState<SectionData>({});

  const backendEndpoints = [
    "http://localhost:3000/tuteurs",
    "http://localhost:3000/equipes",
    "http://localhost:3000/etudiants",
  ];

  useEffect(() => {
    fetchData();
    setEtudiantsCount(etudiants.length);
    console.log("etudiantCount: ", etudiantsCount);
  }, []);

  const fetchData = async () => {
    try {
      const responses = await Promise.all(
        backendEndpoints.map((endpoint) =>
          axios.get(endpoint, {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          })
        )
      );

      const [tuteursResponse, teamsResponse, etudiantsResponse] = responses;

      if (tuteursResponse.data) {
        setTuteurs(tuteursResponse.data);
      }
      if (teamsResponse.data) {
        setTeams(teamsResponse.data);
      }
      if (etudiantsResponse.data) {
        setEtudiants(etudiantsResponse.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (tuteurs.length > 0) {
      const departmentCounts: DepartmentData = {};

      tuteurs.forEach((tuteur) => {
        const department = tuteur.departement;
        if (departmentCounts[department]) {
          departmentCounts[department]++;
        } else {
          departmentCounts[department] = 1;
        }
      });

      setTuteursDepartmentsData(departmentCounts);
    }
  }, [tuteurs]);
  useEffect(() => {
    if (Object.keys(tuteursDepartmentsData).length > 0) {
      const uniqueColors: string[] = [];

      Object.keys(tuteursDepartmentsData).forEach((_department) => {
        const color = `rgb(${Math.random() * 255},${Math.random() * 255},${
          Math.random() * 255
        })`;
        uniqueColors.push(color);
      });

      setDepartmentColors(uniqueColors);
    }
  }, [tuteursDepartmentsData]);

  useEffect(() => {
    if (etudiants.length > 0) {
      const sectionCounts: SectionData = {};

      etudiants.forEach((etudiant) => {
        const section = etudiant.section;
        if (sectionCounts[section]) {
          sectionCounts[section]++;
        } else {
          sectionCounts[section] = 1;
        }
      });

      setEtudiantsSectionsData(sectionCounts);
    }
  }, [etudiants]);
  useEffect(() => {
    if (Object.keys(etudiantsSectionsData).length > 0) {
      const uniqueColors: string[] = [];

      Object.keys(etudiantsSectionsData).forEach((_section) => {
        const color = `rgb(${Math.random() * 255},${Math.random() * 255},${
          Math.random() * 255
        })`;
        uniqueColors.push(color);
      });

      setSectionColors(uniqueColors);
    }
  }, [etudiantsSectionsData]);
  useEffect(() => {
    if (teams.length > 0) {
      const teamInternationalCounts: DepartmentData = {};

      teams.forEach((team) => {
        const international = team.international
          ? "Internationales"
          : "Non internationales";
        if (teamInternationalCounts[international]) {
          teamInternationalCounts[international]++;
        } else {
          teamInternationalCounts[international] = 1;
        }
      });

      setTeamInternationalData(teamInternationalCounts);
    }
  }, [teams]);
  useEffect(() => {
    if (Object.keys(teamInternationalData).length > 0) {
      const uniqueColors: string[] = [];

      Object.keys(teamInternationalData).forEach((_category) => {
        const color = `rgb(${Math.random() * 255},${Math.random() * 255},${
          Math.random() * 255
        })`;
        uniqueColors.push(color);
      });

      setTeamInternationalColors(uniqueColors);
    }
  }, [teamInternationalData]);

  return (
    <main id="main" className="main">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <b>Étudiants: {etudiants.length}</b>
                </h5>
                <h3 className="card-title">Etudiants par section:</h3>
                <Doughnut
                  data={{
                    labels: Object.keys(etudiantsSectionsData),
                    datasets: [
                      {
                        data: Object.values(etudiantsSectionsData),
                        backgroundColor: sectionColors,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: true,
                        position: "right",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <b>Tuteurs: {tuteurs.length}</b>
                </h5>
                <h3 className="card-title">Tuteurs par departement:</h3>

                <Bar
                  data={{
                    labels: Object.keys(tuteursDepartmentsData),
                    datasets: [
                      {
                        data: Object.values(tuteursDepartmentsData),
                        backgroundColor: departmentColors,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                        position: "right",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <b>Équipes:{teams.length}</b>
                </h5>
                <h3 className="card-title">
                  Équipes Internationales vs Non internationales:
                </h3>
                <Pie
                  data={{
                    labels: Object.keys(teamInternationalData),
                    datasets: [
                      {
                        data: Object.values(teamInternationalData),
                        backgroundColor: teamInternationalColors,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: true,
                        position: "right",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          {etudiantsCount == 0 && (
            <a href={`http://localhost:5173/teamManagement/`}>
              ajouter des étudiants?
            </a>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
