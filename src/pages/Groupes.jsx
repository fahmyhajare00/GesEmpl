import React from 'react';
import '../Layout.css';
import { Link } from 'react-router-dom';

export default function Groupes() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Groupes / Filières</h1>
        <Link to="/" className="btn-back">
          ⬅ Emploi du temps
        </Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Groupe</th>
            <th>Filière</th>
            <th>Niveau</th>
            <th>Effectif</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>G1</td>
            <td>Développement Digital</td>
            <td>1ère année</td>
            <td>28</td>
          </tr>

          <tr>
            <td>G2</td>
            <td>Développement Digital</td>
            <td>2ème année</td>
            <td>25</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}