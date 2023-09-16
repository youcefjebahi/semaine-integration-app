import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");

function FirstUpdate() {
  const { email } = useParams();
  const [newEmail, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleNewPasswordChange = (e: any) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setImage(file);
  };

  useEffect(() => {
    fetchCoordinateur();
  }, []);

  const fetchCoordinateur = async () => {
    if (email)
      try {
        const response = await axios.get(
          `http://localhost:3000/coordinateurs/${window.atob(email)}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        const coordinateur = response.data;
        setEmail(coordinateur.email);
        setNom(coordinateur.nom);
        setPrenom(coordinateur.prenom);
      } catch (error) {
        console.error("Failed to fetch coordinateur:", error);
      }
  };

  const handleModifierCoordinateur = async (event: any) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    if (email)
      try {
        if (image) {
          const reader = new FileReader();
          reader.readAsDataURL(image);

          reader.onloadend = async () => {
            const base64Image = reader.result as string;

            await axios.put(
              `http://localhost:3000/coordinateurs/${window.atob(
                email
              )}/firstUpdate`,
              {
                newEmail,
                nom,
                prenom,
                password: newPassword,
                image: {
                  data: base64Image.split(",")[1],
                  contentType: image.type,
                },
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `${token}`,
                },
              }
            );

            if (window.atob(email) === newEmail) {
              window.location.href =
                "http://localhost:5173/consulterCoordinateur/" + email;
            } else {
              Cookies.remove("token");
              window.location.href = "http://localhost:5173/";
            }
          };
        } else {
          await axios.put(
            `http://localhost:3000/coordinateurs/${window.atob(
              email
            )}/firstUpdate`,
            {
              newEmail,
              nom,
              prenom,
              password: newPassword,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            }
          );

          if (window.atob(email) === newEmail) {
            window.location.href =
              "http://localhost:5173/consulterCoordinateur/" + email;
          } else {
            Cookies.remove("token");
            window.location.href = "http://localhost:5173/";
          }
        }
      } catch (error) {
        console.error("Failed to modify coordinateur:", error);
      }
  };

  return (
    <main id="main" className="main">
      <div className="container ">
        <div className="row ">
          <div style={{ backgroundColor: "#f2f2f2", height: "515px" }}>
            <h2>Modifier Coordinateur</h2>
            <br />

            <form onSubmit={handleModifierCoordinateur}>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Email:</label>
                <div className="col-sm-10">
                  <input
                    type="email"
                    className="form-control"
                    value={newEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Nom:</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Prénom:</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  className="col-sm-2 col-form-label"
                  htmlFor="newPassword"
                >
                  Nouveau mot de passe:
                </label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label
                  className="col-sm-2 col-form-label"
                  htmlFor="confirmPassword"
                >
                  Confirmer le mot de passe:
                </label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Image</label>
                <div className="col-sm-10">
                  <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <br />

              <div className="row mb-3">
                <div className="col-sm-10">
                  <button type="submit" className="btn btn-primary">
                    Modifier
                  </button>
                </div>
              </div>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}

export default FirstUpdate;
