export const fetchDataFromApi = async () => {
  // Config statique
  const config = {
    poles: ['Digital', 'Gestion', 'Industrie', 'Commerce'],
    filieres: [
      { nom: 'Dev Web', pole: 'Digital' },
      { nom: 'Reseaux', pole: 'Digital' },
      { nom: 'Comptabilité', pole: 'Gestion' },
      { nom: 'Marketing', pole: 'Commerce' }
    ],
    groupes: [
      { nom: 'DEV101', pole: 'Digital' },
      { nom: 'DEV102', pole: 'Digital' },
      { nom: 'RES201', pole: 'Digital' },
      { nom: 'COMPTA1', pole: 'Gestion' }
    ],
    formateurs: [
      { nom: 'Ahmed Alaoui', pole: 'Digital' },
      { nom: 'Sara Bennani', pole: 'Digital' },
      { nom: 'Youssef Tazi', pole: 'Gestion' },
      { nom: 'Mouna Chraibi', pole: 'Commerce' }
    ],
    salles: [
      { nom: 'Salle 1', pole: 'Digital' },
      { nom: 'Salle 2', pole: 'Digital' },
      { nom: 'Amphi A', pole: 'Gestion' },
      { nom: 'Atelier B', pole: 'Industrie' }
    ],
    modules: [
      { nom: 'React JS', pole: 'Digital' },
      { nom: 'Laravel', pole: 'Digital' },
      { nom: 'Comptabilité Générale', pole: 'Gestion' },
      { nom: 'Marketing Digital', pole: 'Commerce' }
    ],
    timeSlots: [
      "8H30 - 11H",
      "11H - 13H30",
      "13H30 - 16H",
      "16H - 18H30"
    ],
    sessionDuration: 2.5,
    activeDays: ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'],
    annees: ['1A', '2A']
  };

  // Obtenir la date du lundi de la semaine courante
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));

  const generateDateForDay = (dayIndex) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + dayIndex);
    return d.toISOString().split('T')[0];
  };

  // Créer des séances factices pour la semaine en cours
  const sessions = [
    {
      id: 1,
      module: 'React JS',
      formateur: 'Ahmed Alaoui',
      salle: 'Salle 1',
      groupe: 'DEV101',
      filiere: 'Dev Web',
      annee: '1A',
      type: 'presentiel',
      day: 'LUNDI',
      slotIdx: 0,
      timeSlot: '8H30 - 11H',
      pole: 'Digital',
      status: 'validated',
      lien: '',
      date: generateDateForDay(0),
      weekKey: generateDateForDay(0)
    },
    {
      id: 2,
      module: 'Laravel',
      formateur: 'Sara Bennani',
      salle: 'Salle 2',
      groupe: 'DEV102',
      filiere: 'Dev Web',
      annee: '2A',
      type: 'presentiel',
      day: 'LUNDI',
      slotIdx: 1,
      timeSlot: '11H - 13H30',
      pole: 'Digital',
      status: 'validated',
      lien: '',
      date: generateDateForDay(0),
      weekKey: generateDateForDay(0)
    },
    {
      id: 3,
      module: 'Comptabilité Générale',
      formateur: 'Youssef Tazi',
      salle: 'Amphi A',
      groupe: 'COMPTA1',
      filiere: 'Comptabilité',
      annee: '1A',
      type: 'distanciel',
      day: 'MARDI',
      slotIdx: 2,
      timeSlot: '13H30 - 16H',
      pole: 'Gestion',
      status: 'validated',
      lien: 'https://meet.google.com/abc',
      date: generateDateForDay(1),
      weekKey: generateDateForDay(1)
    },
    {
      id: 4,
      module: 'Marketing Digital',
      formateur: 'Mouna Chraibi',
      salle: 'À DÉFINIR',
      groupe: 'DEV101',
      filiere: 'Marketing',
      annee: '2A',
      type: 'distanciel',
      day: 'MERCREDI',
      slotIdx: 0,
      timeSlot: '8H30 - 11H',
      pole: 'Commerce',
      status: 'validated',
      lien: 'https://zoom.us/j/123456',
      date: generateDateForDay(2),
      weekKey: generateDateForDay(2)
    },
    {
      id: 5,
      module: 'React JS',
      formateur: 'Ahmed Alaoui',
      salle: 'Salle 1',
      groupe: 'DEV102',
      filiere: 'Dev Web',
      annee: '2A',
      type: 'presentiel',
      day: 'JEUDI',
      slotIdx: 3,
      timeSlot: '16H - 18H30',
      pole: 'Digital',
      status: 'validated',
      lien: '',
      date: generateDateForDay(3),
      weekKey: generateDateForDay(3)
    }
  ];

  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    sessions,
    config
  };
};
