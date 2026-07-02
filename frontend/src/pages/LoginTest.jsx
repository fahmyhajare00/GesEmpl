import React from 'react';

export default function LoginTest({ onLogin }) {
  const roles = [
    { id: 'chef_de_pole', label: 'Chef de Pôle' },
    { id: 'gestionnaire_stagiaire', label: 'Gestionnaire Stagiaire' },
    { id: 'directeur_pedagogique', label: 'Directeur Pédagogique' },
    { id: 'formateur_user', label: 'Formateur' },
    { id: 'stagiaire', label: 'Stagiaire' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background decoration matching CMC colors (Cyan & Grey) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-400/10 blur-[100px] pointer-events-none"></div>

      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 w-full max-w-[420px] text-center z-10">
        <img src="/cmc-logo.png" alt="CMC Logo" className="h-20 object-contain drop-shadow-sm mx-auto mb-6" />
        <h1 className="text-2xl font-extrabold mb-2 text-slate-800 tracking-tight">Bienvenue sur <span className="text-cyan-600">GESEMPL</span></h1>
        <p className="text-sm text-slate-500 mb-8 font-medium">Sélectionnez un profil pour vous connecter</p>
        
        <div className="flex flex-col gap-3">
          {roles.map((role) => (
            <button 
              key={role.id}
              onClick={() => onLogin(role.id)}
              className="group w-full py-3.5 px-5 bg-white border-[1.5px] border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:border-cyan-500 hover:text-cyan-700 hover:bg-cyan-50/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
