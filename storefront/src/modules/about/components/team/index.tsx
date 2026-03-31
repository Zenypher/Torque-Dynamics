const team = [
  { name: "Marcus Rivera", role: "Founder & CEO", initials: "MR" },
  { name: "Sarah Chen", role: "Head of Operations", initials: "SC" },
  { name: "Jake Thompson", role: "Lead Technician", initials: "JT" },
  { name: "Aisha Patel", role: "Customer Experience", initials: "AP" },
]

export default function AboutTeam() {
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="font-display text-2xl font-bold text-center mb-10">
          Meet the Team
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {team.map((m) => (
            <div key={m.name} className="text-center">
              <div className="w-20 h-20 rounded-full ferrari-gradient flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-foreground font-display font-bold text-lg">
                  {m.initials}
                </span>
              </div>
              <h3 className="font-display font-semibold text-sm">{m.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
