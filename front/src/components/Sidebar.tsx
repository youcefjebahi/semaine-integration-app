const Sidebar = () => {
  return (
    <div>
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="http://localhost:5173/dashboard"
            >
              <i className="bi bi-pie-chart-fill"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <hr />
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="http://localhost:5173/teamManagement"
            >
              <i className="bi bi-gear"></i>
              <span>Gestion</span>
            </a>
          </li>
          <hr />

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="http://localhost:5173/teamsList"
            >
              <i className="bi bi-people"></i>
              <span>Equipes</span>
            </a>
          </li>
          <hr />

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="http://localhost:5173/etudiantsList"
            >
              <i className="bi bi-person"></i>
              <span>Etudiants</span>
            </a>
          </li>
          <hr />

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="http://localhost:5173/tuteursList"
            >
              <i className="bi bi-person"></i>
              <span>Tuteurs</span>
            </a>
          </li>
          <hr />

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="http://localhost:5173/membresComiteList"
            >
              <i className="bi bi-briefcase"></i>
              <span>Membres de comité</span>
            </a>
          </li>
          <hr />

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="http://localhost:5173/sallesList"
            >
              <i className="bi bi-house-door"></i>
              <span>Salles</span>
            </a>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
