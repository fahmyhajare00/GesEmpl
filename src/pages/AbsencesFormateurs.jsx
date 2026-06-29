import React from "react";
import { useSelector } from "react-redux";
import "../index.css";

const AbsencesFormateurs = () => {
  const { config } = useSelector((state) => state.schedule);

  // Temporary data.
  // Later this will come from Laravel.
  const absences = [
    {
      id: 1,
      formateur: "S. Rami",
      date: "2026-06-30",
      motif: "Congé annuel",
      statut: "Validée",
    },
    {
      id: 2,
      formateur: "A. Karim",
      date: "2026-07-02",
      motif: "Maladie",
      statut: "En attente",
    },
    {
      id: 3,
      formateur: "M. Hassan",
      date: "2026-07-05",
      motif: "Mission OFPPT",
      statut: "Validée",
    },
  ];

  return (
    <div className="app-container">
      <h2 style={{ marginBottom: "20px" }}>
        Absences des formateurs
      </h2>

      <table className="schedule-table">
        <thead>
          <tr>
            <th>Formateur</th>
            <th>Date</th>
            <th>Motif</th>
            <th>Statut</th>
          </tr>
        </thead>

        <tbody>
          {absences.map((absence) => (
            <tr key={absence.id}>
              <td>{absence.formateur}</td>
              <td>{absence.date}</td>
              <td>{absence.motif}</td>
              <td>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    background:
                      absence.statut === "Validée"
                        ? "#dcfce7"
                        : "#fef3c7",
                    color:
                      absence.statut === "Validée"
                        ? "#166534"
                        : "#92400e",
                    fontWeight: "bold",
                  }}
                >
                  {absence.statut}
                </span>
              </td>
            </tr>
          ))}

          {absences.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Aucune absence.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AbsencesFormateurs;