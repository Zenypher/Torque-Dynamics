import { Award, Clock, Shield, Truck, Users, Wrench } from "lucide-react"
import { Card, CardContent } from "../card"

const values = [
  {
    icon: Shield,
    title: "Quality Guaranteed",
    desc: "Every part meets or exceeds OEM specifications.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    desc: "Same-day dispatch on orders placed before 3 PM.",
  },
  {
    icon: Wrench,
    title: "Expert Support",
    desc: "ASE-certified techs ready to help with fitment.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "Over 500K enthusiasts trust TorqueDynamics.",
  },
  {
    icon: Award,
    title: "Top Brands",
    desc: "Authorized dealer for 200+ premium brands.",
  },
  {
    icon: Clock,
    title: "Since 2012",
    desc: "Over a decade of passion for performance parts.",
  },
]

export default function AboutValues() {
  return (
    <>
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-center mb-10">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <Card key={v.title} className="border-border bg-card">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg ferrari-gradient flex items-center justify-center shrink-0">
                    <v.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm mb-1">
                      {v.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
