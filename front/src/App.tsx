import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ModifierCoordinateur from "./components/coordinateur/ModifierCoordinateur";
import ConsulterCoordinateur from "./components/coordinateur/ConsulterCoordinateur";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/coordinateur/Login";
import ChangePassword from "./components/coordinateur/ChangePassword";
import FirstUpdate from "./components/coordinateur/FirstUpdate";
import ResetPassword from "./components/coordinateur/ResetPassword";
import RequestResetPassword from "./components/coordinateur/RequestResetPassword";

import TeamManagement from "./components/team/TeamManagement";
import Sidebar from "./components/Sidebar";
import TeamsList from "./components/team/TeamsList";
import EtudiantsList from "./components/etudiant/EtudiantsList";
import TuteursList from "./components/tuteur/TuteursList";
import MembresComiteList from "./components/membreComite/MembresComiteList";
import SallesList from "./components/salle/SallesList";
import { useState } from "react";
import Recherche from "./components/Recherche";
import Team from "./components/team/team";
import Tuteur from "./components/tuteur/tuteur";
import Dashboard from "./components/Dashboard";

function App() {
  const isLoginPage = window.location.pathname === "/";
  const isRequestResetPasswordPage =
    window.location.pathname === "/requestResetPassword";
  const isResetPasswordPage =
    window.location.pathname.includes("/resetPassword/");

  const shouldShowHeader =
    !isLoginPage && !isRequestResetPasswordPage && !isResetPasswordPage;
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <Router>
      <div>
        {shouldShowHeader && (
          <Header onSearch={(term) => setSearchTerm(term)} />
        )}
        {shouldShowHeader && <Sidebar />}

        <Routes>
          <Route path="" element={<Login />} />
          <Route
            path="modifierCoordinateur/:email"
            element={<ModifierCoordinateur />}
          />
          <Route
            path="consulterCoordinateur/:email"
            element={<ConsulterCoordinateur />}
          />
          <Route path="password" element={<ChangePassword />} />
          <Route path="firstUpdate/:email" element={<FirstUpdate />} />
          <Route path="resetPassword/:token" element={<ResetPassword />} />
          <Route
            path="requestResetPassword"
            element={<RequestResetPassword />}
          />

          <Route path="/teamManagement" element={<TeamManagement />} />
          <Route path="/recherche/:searchTerm" element={<Recherche />} />
          <Route
            path="/teamslist"
            element={<TeamsList searchTerm={searchTerm} />}
          />
          <Route path="/team/:nom" element={<Team />} />
          <Route path="/tuteurs/:email" element={<Tuteur />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/etudiantsList"
            element={<EtudiantsList searchTerm={searchTerm} />}
          />
          <Route
            path="/tuteursList"
            element={<TuteursList searchTerm={searchTerm} />}
          />
          <Route
            path="/membresComiteList"
            element={<MembresComiteList searchTerm={searchTerm} />}
          />
          <Route
            path="/sallesList"
            element={<SallesList searchTerm={searchTerm} />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
