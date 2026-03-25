import { Button } from "@headlessui/react"
import Image from "next/image"

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-surface-dark min-h-[520px] flex items-center">
      <div className="absolute inset-0">
        <img
          src="/hero-bg.png"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-dark via-surface-dark/80 to-transparent" />
      </div>

      <div className="container relative z-10 py-16 md:py-24 ">
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
            <Button
              className="ferrari-gradient text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 font-semibold tracking-wide
          h-14 rounded-lg px-10 text-lg"
            >
              Shop All Parts
            </Button>
            <Button className="h-14 rounded-lg px-10 text-lg border text-surface-dark-text bg-surface-dark-text/10 hover:bg-surface-dark-text/20 hover:text-surface-dark-text">
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
      </div>
    </section>
  )
}

export default Hero
