import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

let email: string | undefined;

const token = Cookies.get("token");
if (token) {
  const decodedToken: { email: string } = jwtDecode(token);
  email = decodedToken.email;
}
interface Coordinateur {
  nom: string;
  email: string;
  prenom: string;
  image: {
    data: string;
    contentType: string;
  };
}

interface HeaderProps {
  onSearch: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  let handleSearch = (term: string) => {
    onSearch(term);
  };
  const [searchTerm, setSearchTerm] = useState<string>("");
  const pathname = location.pathname;
  let placeholderText = "";
  switch (pathname) {
    case "/etudiantsList":
      placeholderText = "Rechercher etudiant par id";

      break;
    case "/teamsList":
      placeholderText = "Rechercher equipes par nom";
      break;
    case "/tuteursList":
      placeholderText = "Rechercher tuteur par email";
      break;
    case "/membresComiteList":
      placeholderText = "Rechercher membre par email";
      break;
    case "/sallesList":
      placeholderText = "Rechercher salle par numero";
      break;
    default:
      placeholderText = "Rechercher";
      handleSearch = (term: string) => {
        window.location.href = `/recherche/${window.btoa(term)}`;
      };
      break;
  }
  const [coordinateur, setCoordinateur] = useState<Coordinateur | null>(null);

  useEffect(() => {
    fetchCoordinateur();
  }, []);

  const fetchCoordinateur = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/coordinateurs/${email}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      const coordinateurData = response.data;
      setCoordinateur(coordinateurData);
    } catch (error) {
      console.error("Failed to fetch coordinateur:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/logout",
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      Cookies.remove("token");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-between">
        <a
          href="http://localhost:5173/dashboard"
          className="logo d-flex align-items-center"
        >
          <span className="d-none d-lg-block">Accueil</span>
        </a>
      </div>

      <div className="search-bar">
        <form
          className="search-form d-flex align-items-center"
          method="POST"
          action="#"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            className="search-input"
            placeholder={placeholderText}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value == "") handleSearch("");
            }}
          />

          <button
            type="submit"
            title="Search"
            onClick={() => handleSearch(searchTerm)}
          >
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>

      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
          <li className="nav-item d-block d-lg-none">
            <a className="nav-link nav-icon search-bar-toggle " href="#">
              <i className="bi bi-search"></i>
            </a>
          </li>

          <li className="nav-item dropdown pe-3">
            <a
              className="nav-link nav-profile d-flex align-items-center pe-0"
              href="#"
              data-bs-toggle="dropdown"
            >
              {coordinateur &&
              coordinateur.image?.data &&
              coordinateur.image?.contentType ? (
                <img
                  src={`data:${coordinateur.image.contentType};base64,${coordinateur.image.data}`}
                  alt="Profile"
                  className="rounded-circle"
                />
              ) : (
                <img
                  src="/src/assets/man.jpg"
                  alt="Profile"
                  className="rounded-circle"
                />
              )}

              {coordinateur && (
                <span
                  className="d-none d-md-block dropdown-toggle ps-2"
                  style={{ color: "white" }}
                >
                  {coordinateur.nom}
                </span>
              )}
            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
              <li className="dropdown-header">
                {coordinateur && (
                  <h6>
                    {coordinateur.prenom} {coordinateur.nom}
                  </h6>
                )}
                <span>Coordianteur</span>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                {email && (
                  <Link
                    to={`http://localhost:5173/consulterCoordinateur/${window.btoa(
                      email
                    )}`}
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="bi bi-person"></i>
                    <span>Profil</span>
                  </Link>
                )}
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                {email && (
                  <Link
                    to={`http://localhost:5173/modifierCoordinateur/${window.btoa(
                      email
                    )}`}
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="bi bi-gear"></i>
                    <span>Paramètres de Compte</span>
                  </Link>
                )}
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link
                  to={`http://localhost:5173/password`}
                  className="dropdown-item d-flex align-items-center"
                >
                  <i className="bi bi-lock"></i>
                  <span>Changement de Mot de Passe</span>
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="http://localhost:5173/"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Déconnexion</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
