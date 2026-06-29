import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useData } from '../../context/DataContext';

/**
 * SessionModal - Formulaire modal de création de séance avec détection de conflits.
 */
const SessionModal = ({ isOpen, onClose, onSubmit, formateur, defaultJour, defaultCreneau }) => {
  const {
    groupes,
    modules,
    espaces,
    jours,
    creneaux,
    filieres,
    checkConflicts,
    seances,
    currentWeek
  } = useData();

  // États du formulaire
  const [selectedGroupes, setSelectedGroupes] = useState([]); // Array pour permettre la fusion
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedEspace, setSelectedEspace] = useState('');
  const [selectedJour, setSelectedJour] = useState('');
  const [selectedCreneau, setSelectedCreneau] = useState('');
  const [typeSeance, setTypeSeance] = useState('Présentiel');
  
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  // Filtrer les groupes appartenant au pôle du formateur
  const filteredGroupes = groupes.filter(g => {
    const filiere = filieres.find(f => f.id === g.filiere_id);
    return filiere && filiere.pole_id === formateur.pole_id;
  });

  // Trouver le créneau sélectionné
  const selectedCreneauObj = creneaux.find(c => c.id === Number(selectedCreneau));

  // Identifier les groupes et les espaces occupés sur ce créneau et ce jour
  const occupiedGroupes = [];
  const occupiedEspaces = [];
  
  if (selectedJour && selectedCreneauObj) {
    const overlappingSeances = seances.filter(s => 
      s.semaine === currentWeek &&
      s.jour.toLowerCase() === selectedJour.toLowerCase() &&
      s.heure_debut.toLowerCase() === selectedCreneauObj.heure_debut.toLowerCase()
    );
    
    overlappingSeances.forEach(s => {
      const gIds = s.groupes_ids || (s.groupe_id ? [s.groupe_id] : []);
      gIds.forEach(id => occupiedGroupes.push(id));
      occupiedEspaces.push(s.espace_id);
    });
  }

  // Filtrer les modules en fonction de la filière du/des groupe(s) sélectionné(s)
  const [filteredModules, setFilteredModules] = useState([]);
  useEffect(() => {
    if (selectedGroupes.length > 0) {
      // On prend la filière du premier groupe sélectionné
      const groupe = groupes.find(g => g.id === Number(selectedGroupes[0]));
      if (groupe) {
        const mods = modules.filter(m => m.filiere_id === groupe.filiere_id);
        setFilteredModules(mods);
      }
    } else {
      setFilteredModules([]);
    }
    setSelectedModule('');
  }, [selectedGroupes, groupes, modules]);

  // Réinitialiser les erreurs lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      setSelectedGroupes([]);
      setSelectedModule('');
      setSelectedEspace('');
      setSelectedJour(defaultJour || '');
      setSelectedCreneau(defaultCreneau ? String(defaultCreneau) : '');
      setTypeSeance('Présentiel');
      setErrors([]);
      setSuccess(false);
    }
  }, [isOpen, defaultJour, defaultCreneau]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    if (selectedGroupes.length === 0 || !selectedModule || !selectedEspace || !selectedJour || !selectedCreneau) {
      setErrors(['Veuillez remplir tous les champs obligatoires.']);
      return;
    }

    if (!selectedCreneauObj) return;

    // Préparation de la séance avec plusieurs groupes potentiels
    const newSeanceData = {
      groupe_id: Number(selectedGroupes[0]), // Pour compatibilité
      groupes_ids: selectedGroupes.map(Number), // Nouvelle gestion
      formateur_id: formateur.id,
      module_id: Number(selectedModule),
      espace_id: Number(selectedEspace),
      jour: selectedJour,
      heure_debut: selectedCreneauObj.heure_debut,
      heure_fin: selectedCreneauObj.heure_fin,
      type_seance: typeSeance
    };

    // Validation des conflits
    const conflicts = checkConflicts(newSeanceData);
    if (conflicts.length > 0) {
      setErrors(conflicts.map(c => c.message));
      return;
    }

    // Soumission si valide
    const result = onSubmit(newSeanceData);
    if (result && !result.success) {
      setErrors(result.errors || ['Une erreur est survenue lors de l\'enregistrement.']);
    } else {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleGroupeToggle = (groupeIdStr) => {
    if (selectedGroupes.includes(groupeIdStr)) {
      setSelectedGroupes(selectedGroupes.filter(id => id !== groupeIdStr));
    } else {
      setSelectedGroupes([...selectedGroupes, groupeIdStr]);
    }
  };

  // Liste des options de salles avec marquage "Occupé" et "Non autorisé"
  const espaceOptions = espaces.filter(e => e.actif).map(e => {
    const isOccupied = occupiedEspaces.includes(e.id);
    const isUnauthorized = e.pole_id !== formateur.pole_id;
    
    let label = e.nom_espace;
    let disabled = false;
    
    if (isOccupied) {
      label += " (Occupé)";
      disabled = true;
    } else if (isUnauthorized) {
      label += " (Non autorisé)";
      disabled = true;
    }
    
    return {
      value: String(e.id),
      label: `${label} (${e.type_space || e.type_espace})`,
      disabled
    };
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Proposer une nouvelle séance" size="md">
      {success ? (
        <div className="py-8 text-center">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Proposition enregistrée !</h3>
          <p className="text-sm text-gray-500 mt-1">La séance est en attente de validation par le chef de pôle.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Liste des erreurs */}
          {errors.length > 0 && (
            <div className="bg-rose-50 dark:bg-rose-900/30 border-l-4 border-rose-500 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-xs font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider">Conflits ou erreurs détectés :</h3>
                  <ul className="mt-1 list-disc list-inside text-xs text-rose-700 dark:text-rose-400 space-y-0.5">
                    {errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Sélection Jour */}
            <Select
              label="Jour *"
              value={selectedJour}
              onChange={(e) => setSelectedJour(e.target.value)}
              options={jours.map(j => ({ value: j, label: j }))}
              placeholder="Choisir le jour..."
            />

            {/* Sélection Créneau */}
            <Select
              label="Créneau Horaire *"
              value={selectedCreneau}
              onChange={(e) => setSelectedCreneau(e.target.value)}
              options={creneaux.map(c => ({ value: String(c.id), label: c.label }))}
              placeholder="Choisir l'heure..."
            />
          </div>

          {/* Sélection Multiple Groupes (Chips/Pills) */}
          <div className={`space-y-2 ${!selectedJour || !selectedCreneau ? 'opacity-60 pointer-events-none' : ''}`}>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Groupes d'apprenants * (Sélection multiple)
            </label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 min-h-[60px] max-h-[140px] overflow-y-auto">
              {!selectedJour || !selectedCreneau ? (
                <p className="text-sm text-gray-400 w-full text-center py-1">Veuillez d'abord choisir un jour et un créneau</p>
              ) : (
                filteredGroupes.map(g => {
                  const isOccupied = occupiedGroupes.includes(g.id);
                  const isSelected = selectedGroupes.includes(String(g.id));
                  return (
                    <button
                      key={g.id}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => handleGroupeToggle(String(g.id))}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        isOccupied 
                          ? 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700 cursor-not-allowed'
                          : isSelected
                            ? 'bg-sky-500 text-white border-sky-600 shadow-sm shadow-sky-200 dark:shadow-none'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700'
                      }`}
                    >
                      {g.nom_groupe}
                      {isOccupied && <span className="ml-1 opacity-70 font-normal">(Occupé)</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Sélection Module */}
          <Select
            label="Module d'enseignement *"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            options={filteredModules.map(m => ({ value: String(m.id), label: `${m.code_module} - ${m.nom_module}` }))}
            placeholder={selectedGroupes.length > 0 ? "Sélectionner le module..." : "Veuillez d'abord sélectionner un groupe"}
            className={selectedGroupes.length === 0 ? "opacity-60" : ""}
            disabled={selectedGroupes.length === 0}
          />

          {/* Sélection Espace */}
          <Select
            label="Salle / Espace d'apprentissage *"
            value={selectedEspace}
            onChange={(e) => setSelectedEspace(e.target.value)}
            options={espaceOptions}
            placeholder={selectedJour && selectedCreneau ? "Sélectionner la salle..." : "Veuillez d'abord choisir un jour et un créneau"}
            disabled={!selectedJour || !selectedCreneau}
            className={!selectedJour || !selectedCreneau ? "opacity-60" : ""}
          />

          {/* Type de Séance */}
          <Select
            label="Modalité pédagogique *"
            value={typeSeance}
            onChange={(e) => setTypeSeance(e.target.value)}
            options={[
              { value: 'Présentiel', label: 'Présentiel' },
              { value: 'Distanciel', label: 'Distanciel (À distance)' }
            ]}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <Button onClick={onClose} variant="secondary">
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              Proposer la séance
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
export default SessionModal;
