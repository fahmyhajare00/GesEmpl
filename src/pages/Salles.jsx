import React from 'react';
import '../Layout.css';
import { Link } from 'react-router-dom';
export default function Salles() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Salles</h1>
       <Link to="/" className="btn-back">
          ⬅ Emploi du temps
        </Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Capacité</th>
            <th>Type</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Salle 1</td>
            <td>30</td>
            <td><span className="badge presentiel">Présentiel</span></td>
          </tr>

          <tr>
            <td>Salle 2</td>
            <td>25</td>
            <td><span className="badge distanciel">Distanciel</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}