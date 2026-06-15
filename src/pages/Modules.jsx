import React from 'react';
import '../Layout.css';
import { Link } from 'react-router-dom';

export default function Modules() {
  return (
    <div className="modules-page">
      <div className="page-header">
              <h1>Modules</h1>
               <Link to="/" className="btn-back">
                ⬅ Emploi du temps
              </Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Nom du module</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>React Avancé</td>
          </tr>

          <tr>
            <td>Laravel</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}