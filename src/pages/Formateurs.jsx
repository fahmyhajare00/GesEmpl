import React from 'react';
import '../Layout.css';
import { Link } from 'react-router-dom';
export default function Formateurs() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Formateurs</h1>
         <Link to="/" className="btn-back">
          ⬅ Emploi du temps
        </Link>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Spécialité</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>A. Karim</td>
            <td>React / Frontend</td>
            <td>karim@mail.com</td>
          </tr>

          <tr>
            <td>S. Rami</td>
            <td>UI/UX Design</td>
            <td>rami@mail.com</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}