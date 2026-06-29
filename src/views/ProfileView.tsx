export default function ProfileView() {
  return (
    <section className="mt-[18px] p-[18px] rounded-[22px] border border-border-color bg-bg-card [box-shadow:0_24px_60px_rgba(15,23,42,0.12)] transition-all duration-250 dark:[box-shadow:0_30px_80px_rgba(0,0,0,0.25)]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-[18px]">
        <h2 className="m-0 text-[20px] font-bold text-text-main">Mon profil</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-4 bg-bg-card border border-border-color rounded-[22px] p-5">
        <div className="grid gap-[18px] items-start">
          <div className="w-[84px] h-[84px] rounded-[28px] bg-gradient-to-br from-[#2563eb] to-[#9333ea] grid place-items-center text-white text-[28px] font-bold">
            <span>Y</span>
          </div>
          <div className="grid gap-1">
            <h3 className="m-0 text-[22px] font-bold text-text-main">Youssef Tazi</h3>
            <span className="text-[14px] text-text-secondary">Stagiaire</span>
            <p className="m-0 text-[14px] text-text-secondary">Groupe A2 · Filière Comptabilité</p>
          </div>
        </div>

        <div className="grid gap-[18px]">
          <div className="grid gap-1.5">
            <label className="text-[12px] uppercase tracking-[0.08em] text-text-muted">National ID / CNE</label>
            <div className="p-[14px_16px] rounded-[18px] bg-border-light dark:bg-white/6 text-text-main text-[14px]">1234567890</div>
          </div>
          <div className="grid gap-1.5">
            <label className="text-[12px] uppercase tracking-[0.08em] text-text-muted">Email</label>
            <div className="p-[14px_16px] rounded-[18px] bg-border-light dark:bg-white/6 text-text-main text-[14px]">youssef.tazi@example.com</div>
          </div>
          <div className="grid gap-1.5">
            <label className="text-[12px] uppercase tracking-[0.08em] text-text-muted">Phone Number</label>
            <div className="p-[14px_16px] rounded-[18px] bg-border-light dark:bg-white/6 text-text-main text-[14px]">+212 6 12 34 56 78</div>
          </div>
          <div className="grid gap-1.5">
            <label className="text-[12px] uppercase tracking-[0.08em] text-text-muted">Academic Year</label>
            <div className="p-[14px_16px] rounded-[18px] bg-border-light dark:bg-white/6 text-text-main text-[14px]">Année 2</div>
          </div>
        </div>
      </div>
    </section>
  )
}