export default function ProfileView() {
  return (
    <section className="view-panel profile-view">
      <div className="view-header">
        <h2 className="view-title">Mon profil</h2>
      </div>

      <div className="profile-card">
        <div className="profile-side left-side">
          <div className="profile-avatar">
            <span>Y</span>
          </div>
          <div className="profile-details">
            <h3 className="profile-name">Youssef Tazi</h3>
            <span className="profile-role">Stagiaire</span>
            <p className="profile-group">Groupe A2 · Filière Comptabilité</p>
          </div>
        </div>

        <div className="profile-side right-side">
          <div className="profile-field">
            <label>National ID / CNE</label>
            <div className="profile-value">1234567890</div>
          </div>
          <div className="profile-field">
            <label>Email</label>
            <div className="profile-value">youssef.tazi@example.com</div>
          </div>
          <div className="profile-field">
            <label>Phone Number</label>
            <div className="profile-value">+212 6 12 34 56 78</div>
          </div>
          <div className="profile-field">
            <label>Academic Year</label>
            <div className="profile-value">Année 2</div>
          </div>
        </div>
      </div>
    </section>
  )
}
