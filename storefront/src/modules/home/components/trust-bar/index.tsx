import { Truck, Shield, RotateCcw, Headphones } from "lucide-react"

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over €99" },
  { icon: Shield, title: "Fitment Guarantee", desc: "Or your money back" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day hassle-free" },
  { icon: Headphones, title: "Expert Support", desc: "ASE-certified team" },
]

export default function TrustBar() {
  return (
    <section className="py-12 border-y border-border bg-card">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={`flex items-center gap-3 stagger-${
                i + 1
              } dark:text-surface-dark-text`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <feat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm">
                  {feat.title}
                </p>
                <p className="text-xs text-muted-foreground">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
