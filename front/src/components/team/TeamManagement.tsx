import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Dropzone from "react-dropzone";
import io, { Socket } from "socket.io-client";

const token = Cookies.get("token");

const TeamManagement: React.FC = () => {
  const [date, setDate] = useState<Date | string>("");
  const [existingDate, setExistingDate] = useState<boolean>(false);

  const handleCreateDate = async () => {
    axios
      .post("http://localhost:3000/date/create", {
        date,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        alert(response.data.message);
        window.location.href = "http://localhost:5173/teamManagement";
      })
      .catch((error) => {
        console.error("Erreur lors de la création de la date:", error);
        alert("Erreur lors de la création de la date. Veuillez réessayer.");
      });
  };
  const [dates, setDates] = useState<any[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/date", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    }).then((response) => {
      setDates(response.data);
      setExistingDate(response.data.length > 0);
    });
  }, []);
  const [existingTeams, setExistingTeams] = useState<boolean>(false);
  useEffect(() => {
    axios
      .get("http://localhost:3000/equipes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setExistingTeams(response.data.length > 0);
        setNumberOfTeams(response.data.length);
      });
  }, []);

  const [numberOfTeams, setNumberOfTeams] = useState<number>(0);
  const handleCreateTeams = () => {
    axios
      .post(
        "http://localhost:3000/equipes/createTeams",
        {
          numberOfTeams: numberOfTeams,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      )
      .then((response) => {
        alert(response.data.message);
        window.location.href = "http://localhost:5173/teamManagement";
      })
      .catch((error) => {
        console.error("Erreur lors de la création des équipes:", error);
        alert("Erreur lors de la création des équipes. Veuillez réessayer.");
      });
  };

  const [file, setFile] = useState<File | null>(null);
  const handleFileDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };
  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      } else {
        console.error("Aucun fichier sélectionné.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/etudiants/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        }
      );

      alert(response.data.message);
      window.location.href = "http://localhost:5173/teamManagement";
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier:", error);
      alert("Une erreur est survenue lors de l'enregistrement des étudiants");
    }
  };

  const [fileSalle, setFileSalle] = useState<File | null>(null);
  const handleFileSalleDrop = (acceptedFiles: File[]) => {
    setFileSalle(acceptedFiles[0]);
  };
  const handleFileSalleUpload = async () => {
    try {
      const formData = new FormData();
      if (fileSalle) {
        formData.append("file", fileSalle);
      } else {
        console.error("Aucun fichier sélectionné.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/salles/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        }
      );

      alert(response.data.message);
      window.location.href = "http://localhost:5173/teamManagement";
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier:", error);
      alert("Une erreur est survenue lors de l'enregistrement des salles");
    }
  };

  const [fileMembreComite, setFileMembreComite] = useState<File | null>(null);
  const handleFileMembreComiteDrop = (acceptedFiles: File[]) => {
    setFileMembreComite(acceptedFiles[0]);
  };
  const handleFileMembreComiteUpload = async () => {
    try {
      const formData = new FormData();
      if (fileMembreComite) {
        formData.append("file", fileMembreComite);
      } else {
        console.error("Aucun fichier sélectionné.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/membresComite/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        }
      );

      alert(response.data.message);
      window.location.href = "http://localhost:5173/teamManagement";
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier:", error);
      alert(
        "Une erreur est survenue lors de l'enregistrement des membres de comité"
      );
    }
  };

  const [fileTuteur, setFileTutuer] = useState<File | null>(null);
  const handleFileTuteurDrop = (acceptedFiles: File[]) => {
    setFileTutuer(acceptedFiles[0]);
  };
  const handleFileTuteurUpload = async () => {
    try {
      const formData = new FormData();
      if (fileTuteur) {
        formData.append("file", fileTuteur);
      } else {
        console.error("Aucun fichier sélectionné.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/tuteurs/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        }
      );

      alert(response.data.message);
      window.location.href = "http://localhost:5173/teamManagement";
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier:", error);
      alert("Une erreur est survenue lors de l'enregistrement des tuteurs");
    }
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInviteStudents, setLoadingInviteStudents] =
    useState<boolean>(false);

  const handleRepartitionEtudiants = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/equipes/repartitionEtudiants",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      alert(response.data.message);
      window.location.href = "http://localhost:5173/teamManagement";
    } catch (error) {
      alert("Erreur lors de la répartition des étudiants");
      console.error("Erreur lors de la répartition des étudiants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir réinitialiser tout ?"
    );

    if (confirmed) {
      try {
        const response = await axios.delete(
          "http://localhost:3000/equipes/deleteAll",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        alert(response.data.message);
        window.location.href = "http://localhost:5173/teamManagement";
      } catch (error) {
        alert("Erreur lors de la réinitialisation");
        console.error("Erreur lors de la réinitialisation:", error);
      }
    }
  };
  const [allStudentsCount, setAllStudentsCount] = useState<number>(0);
  const [studentsWithoutTeamCount, setStudentsWithoutTeamCount] =
    useState<number>(0);
  const [notInvitedStudentsCount, setNotInvitedStudentsCount] =
    useState<number>(0);
  useEffect(() => {
    axios
      .get("http://localhost:3000/etudiants/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        const allStudents = response.data;
        setAllStudentsCount(allStudents.length);
        const studentsWithoutTeam = response.data.filter(
          (etudiant: any) => !etudiant.equipe
        );
        setStudentsWithoutTeamCount(studentsWithoutTeam.length);
        const notInvitedStudents = response.data.filter(
          (etudiant: any) => !etudiant.invited && etudiant.equipe
        );
        setNotInvitedStudentsCount(notInvitedStudents.length);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des étudiants:", error);
      });
  }, []);

  const [roomCount, setRoomCount] = useState<number>(0);
  useEffect(() => {
    axios
      .get("http://localhost:3000/salles/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        const rooms = response.data;
        setRoomCount(rooms.length);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des salles:", error);
      });
  }, []);

  const [tuteurCount, setTuteurCount] = useState<number>(0);
  useEffect(() => {
    axios
      .get("http://localhost:3000/tuteurs/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        const tuteurs = response.data;
        setTuteurCount(tuteurs.length);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des tuteurs:", error);
      });
  }, []);

  const [membreComiteCount, setMembreComiteCount] = useState<number>(0);
  useEffect(() => {
    axios
      .get("http://localhost:3000/membresComite/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        const membreComites = response.data;
        setMembreComiteCount(membreComites.length);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des membres comité:",
          error
        );
      });
  }, []);

  const [successCount, setSuccessCount] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [indexInvitingStudent, setIndexInvitingStudent] = useState<number>(0);
  const [totalInvitingStudent, setTotalInvitingStudent] = useState<number>(0);

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("studentInvited", (invitedStudent: any) => {
        setSuccessCount(invitedStudent.studentEmailSucces);
        setErrorCount(invitedStudent.studentEmailError);
        setIndexInvitingStudent(invitedStudent.index);
        setTotalInvitingStudent(invitedStudent.totalCount);
      });
    }
  }, [socket]);

  const handleMailEtudiants = async () => {
    setLoadingInviteStudents(true);
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir inviter " +
        notInvitedStudentsCount +
        " étudiants?"
    );

    if (confirmed) {
      try {
        await axios.post("http://localhost:3000/etudiants/inviter",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
      } catch (error) {
        alert("Erreur lors de l'invitation des étudiants");
        console.error("Erreur lors de l'invitation des étudiants:", error);
      }
    }
  };

  const handleFinishSendigStudentsEmail = () => {
    window.location.href = "http://localhost:5173/teamManagement";
  };
  return (
    <main id="main" className="main">
      <div className="container">
        <div className="row">
          <div className="col-md-12" style={{ backgroundColor: "#f2f2f2" }}>
            <h2>Organiser une semaine d'intégration:</h2>

            <table
              style={{ borderCollapse: "separate", borderSpacing: "10px" }}
            >
              <tbody>
                <tr>
                  <td style={{ width: "200px", padding: "10px" }}>
                    Nombre d'équipes:
                  </td>
                  <td style={{ padding: "10px" }}>
                    {existingTeams ? (
                      <> {numberOfTeams}</>
                    ) : (
                      <input
                        type="number"
                        onChange={(e) =>
                          setNumberOfTeams(Number(e.target.value))
                        }
                      />
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {existingTeams ? (
                      <button type="button" onClick={handleReset}>
                        Réinitialiser
                      </button>
                    ) : (
                      <button type="button" onClick={handleCreateTeams}>
                        Créer
                      </button>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "200px", padding: "10px" }}>Date:</td>
                  <td style={{ padding: "10px" }}>
                    {existingDate ? (
                      <> {dates[0].date}</>
                    ) : (
                      <input
                        type="date"
                        onChange={(e) => setDate(e.target.value)}
                      />
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      type="button"
                      onClick={handleCreateDate}
                      disabled={date == ""}
                      hidden={existingDate}
                    >
                      confirmer
                    </button>
                  </td>
                </tr>

                <tr>
                  <td style={{ width: "200px", padding: "10px" }}>Salles:</td>
                  <td style={{ padding: "10px" }}>
                    {roomCount > 0 ? (
                      <>{roomCount}</>
                    ) : (
                      <Dropzone onDrop={handleFileSalleDrop}>
                        {({ getRootProps, getInputProps }) => (
                          <div
                            {...getRootProps()}
                            className="dropzone"
                            style={{
                              backgroundColor: "white",
                              padding: "10px",
                              width: "310px",
                              border: "1px dashed black",
                            }}
                          >
                            <input {...getInputProps()} />
                            Faites glisser et déposez le fichier Excel ici, ou
                            cliquez pour sélectionner un fichier
                            {fileSalle && (
                              <p>Fichier sélectionné : {fileSalle.name}</p>
                            )}
                          </div>
                        )}
                      </Dropzone>
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      type="button"
                      onClick={handleFileSalleUpload}
                      disabled={!fileSalle}
                      hidden={roomCount > 0}
                    >
                      Enregistrer
                    </button>
                  </td>
                </tr>

                <tr>
                  <td style={{ width: "200px", padding: "10px" }}>Tuteurs:</td>
                  <td style={{ padding: "10px" }}>
                    {tuteurCount > 0 ? (
                      <>{tuteurCount}</>
                    ) : (
                      <Dropzone onDrop={handleFileTuteurDrop}>
                        {({ getRootProps, getInputProps }) => (
                          <div
                            {...getRootProps()}
                            className="dropzone"
                            style={{
                              backgroundColor: "white",
                              padding: "10px",
                              width: "310px",
                              border: "1px dashed black",
                            }}
                          >
                            <input {...getInputProps()} />
                            Faites glisser et déposez le fichier Excel ici, ou
                            cliquez pour sélectionner un fichier
                            {fileTuteur && (
                              <p>Fichier sélectionné : {fileTuteur.name}</p>
                            )}
                          </div>
                        )}
                      </Dropzone>
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      type="button"
                      onClick={handleFileTuteurUpload}
                      disabled={!fileTuteur}
                      hidden={tuteurCount > 0}
                    >
                      Enregistrer
                    </button>
                  </td>
                </tr>

                <tr>
                  <td style={{ width: "200px", padding: "10px" }}>
                    Membres de comité:
                  </td>
                  <td style={{ padding: "10px" }}>
                    {membreComiteCount > 0 ? (
                      <>{membreComiteCount}</>
                    ) : (
                      <Dropzone onDrop={handleFileMembreComiteDrop}>
                        {({ getRootProps, getInputProps }) => (
                          <div
                            {...getRootProps()}
                            className="dropzone"
                            style={{
                              backgroundColor: "white",
                              padding: "10px",
                              width: "310px",
                              border: "1px dashed black",
                            }}
                          >
                            <input {...getInputProps()} />
                            Faites glisser et déposez le fichier Excel ici, ou
                            cliquez pour sélectionner un fichier
                            {fileMembreComite && (
                              <p>
                                Fichier sélectionné : {fileMembreComite.name}
                              </p>
                            )}
                          </div>
                        )}
                      </Dropzone>
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      type="button"
                      onClick={handleFileMembreComiteUpload}
                      disabled={!fileMembreComite}
                      hidden={membreComiteCount > 0}
                    >
                      Enregistrer
                    </button>
                  </td>
                </tr>

                <tr>
                  <td style={{ width: "200px", padding: "10px" }}>
                    Etudiants:
                  </td>
                  <td style={{ padding: "10px" }}>
                    <Dropzone onDrop={handleFileDrop}>
                      {({ getRootProps, getInputProps }) => (
                        <div
                          {...getRootProps()}
                          className="dropzone"
                          style={{
                            backgroundColor: "white",
                            padding: "10px",
                            width: "310px",
                            border: "1px dashed black",
                          }}
                        >
                          <input {...getInputProps()} />
                          Faites glisser et déposez le fichier Excel ici, ou
                          cliquez pour sélectionner un fichier
                          {file && <p>Fichier sélectionné : {file.name}</p>}
                        </div>
                      )}
                    </Dropzone>
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      type="button"
                      onClick={handleFileUpload}
                      disabled={!file}
                    >
                      Importer
                    </button>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "200px", padding: "10px" }}>
                    Etudiants à répartir:
                  </td>
                  <td style={{ padding: "10px" }}>
                    {allStudentsCount == 0 ? (
                      <> 0 étudiants</>
                    ) : studentsWithoutTeamCount > 0 ? (
                      <>{studentsWithoutTeamCount} étudiants sans équipes</>
                    ) : (
                      <>Pas d'étudiants sans équipes</>
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      type="button"
                      onClick={handleRepartitionEtudiants}
                      disabled={loading || studentsWithoutTeamCount === 0}
                    >
                      {loading ? "Chargement..." : "Répartir"}
                    </button>
                  </td>
                  <td style={{ padding: "10px", display: "inline-flex" }}>
                    <button
                      type="button"
                      onClick={handleMailEtudiants}
                      disabled={
                        loadingInviteStudents ||
                        notInvitedStudentsCount === 0 ||
                        totalInvitingStudent > 0
                      }
                    >
                      {loadingInviteStudents || totalInvitingStudent > 0
                        ? "inviting..."
                        : "inviter"}
                    </button>
                    <label
                      style={{ paddingLeft: "10px" }}
                      hidden={
                        loadingInviteStudents ||
                        notInvitedStudentsCount === 0 ||
                        totalInvitingStudent > 0
                      }
                    >
                      {notInvitedStudentsCount}
                    </label>
                    <label
                      style={{ paddingLeft: "10px" }}
                      hidden={totalInvitingStudent === 0}
                    >
                      {indexInvitingStudent + 1} sur {totalInvitingStudent} |
                      Succès: {successCount} | Échecs: {errorCount}
                    </label>
                    <p style={{ paddingLeft: "5px" }}></p>
                    <button
                      type="button"
                      onClick={handleFinishSendigStudentsEmail}
                      hidden={
                        successCount + errorCount != totalInvitingStudent ||
                        totalInvitingStudent === 0
                      }
                    >
                      ok{" "}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TeamManagement;
