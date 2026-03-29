import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="dark:bg-surface-dark dark:text-surface-dark-muted pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded ferrari-gradient flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">
                  TD
                </span>
              </div>
              <span className="font-display font-bold text-lg dark:text-surface-dark-text">
                Torque<span className="text-primary">Dynamics</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Premium auto parts for every make and model. Quality you can
              trust, prices you&apos;ll love.
            </p>
          </div>

          {[
            {
              title: "Shop",
              links: ["All Parts", "Brakes", "Engine", "Suspension", "Deals"],
            },
            {
              title: "Support",
              links: [
                "Contact Us",
                "Shipping Info",
                "Returns",
                "Fitment Help",
                "FAQ",
              ],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Blog", "Affiliate Program"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-sm dark:text-surface-dark-text mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <LocalizedClientLink
                      href="#"
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {link}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-surface-dark-text/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © 2026 Torque Dynamics. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <LocalizedClientLink
              href="#"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </LocalizedClientLink>
            <LocalizedClientLink
              href="#"
              className="hover:text-primary transition-colors"
            >
              Terms
            </LocalizedClientLink>
            <LocalizedClientLink
              href="#"
              className="hover:text-primary transition-colors"
            >
              Accessibility
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
