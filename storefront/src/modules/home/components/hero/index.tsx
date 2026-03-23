import { Button } from "@medusajs/ui"
import heroImage from "@/assets/hero-bg.png"
import Image from "next/image"

const Hero = () => {
  return (
    <section className="px-10 py-6 bg-surface-dark">
      <div className="max-w-xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">
            Spring Sale — Up to 40% Off
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-surface-dark-text leading-[1.05] tracking-tight">
          Performance Parts.
          <br />
          <span className="text-primary">Zero Compromise.</span>
        </h1>

        <p className="text-base md:text-lg text-surface-dark-muted max-w-md leading-relaxed">
          Premium auto parts from trusted brands. Find the exact fit for your
          vehicle with our intelligent search.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="xlarge">
            Shop All Parts
          </Button>
          <Button
            variant="transparent"
            size="xlarge"
            className="border-surface-dark-text/30 text-surface-dark-text bg-surface-dark-text/10 hover:bg-surface-dark-text/20 hover:text-surface-dark-text"
          >
            Find My Fit
          </Button>
        </div>

        <div className="flex items-center gap-6 pt-2">
          {[
            { value: "50K+", label: "Parts in Stock" },
            { value: "4.8★", label: "Customer Rating" },
            { value: "24hr", label: "Fast Shipping" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-lg font-bold text-surface-dark-text">
                {stat.value}
              </p>
              <p className="text-xs text-surface-dark-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
