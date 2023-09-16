import axios, { AxiosError } from "axios";
import { useState } from "react";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

let email: string | undefined;
const token = Cookies.get("token");
if (token) {
  const decodedToken: { email: string } = jwtDecode(token);
  email = decodedToken.email;
}

interface ApiResponse {
  message: string;
}

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleCurrentPasswordChange = (e: any) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: any) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.put<ApiResponse>(
        `http://localhost:3000/coordinateurs/${email}/changePassword`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response) {
          setMessage(axiosError.response.data.message);
        } else {
          setMessage(
            "Une erreur s'est produite lors de la modification du mot de passe."
          );
        }
      } else {
        setMessage(
          "Une erreur s'est produite lors de la modification du mot de passe."
        );
      }
    }
  };

  return (
    <main id="main" className="main">
      <div className="container">
        <div className="row">
          <div style={{ backgroundColor: "#f2f2f2", height: "515px" }}>
            <h2>Changer le mot de passe</h2>
            <br />

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label
                  className="col-sm-2 col-form-label"
                  htmlFor="currentPassword"
                >
                  Mot de passe actuel:
                </label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
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
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-10">
                  <button type="submit" className="btn btn-primary">
                    Changer le mot de passe
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
};

export default ChangePassword;
