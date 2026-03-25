import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import DarkModeButton from "@modules/layout/components/dark-mode-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import SearchModal from "@modules/search/components/modal"
import AccountButton from "@modules/layout/components/account-button"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md flex flex-col items-center">
      <div className="ferrari-gradient py-1.5 w-full">
        <p className="text-center text-xs font-medium text-primary-foreground tracking-wide">
          FREE SHIPPING ON ORDERS OVER $99 — SAME DAY DISPATCH
        </p>
      </div>

      <div className="container flex justify-between items-center gap-4 py-3">
        <SideMenu
          regions={regions}
          locales={locales}
          currentLocale={currentLocale}
        />
        <LocalizedClientLink
          href="/"
          className="flex items-center gap-2 shrink-0"
        >
          <Image
            src="/td_logo.png"
            alt="Torque Dynamics Logo"
            width={128}
            height={128}
          />
          <span className="font-bold font-display text-2xl tracking-tight hidden sm:block dark:text-surface-dark-text">
            Torque <span className="text-primary">Dynamics</span>
          </span>
        </LocalizedClientLink>
        <SearchModal />
        <div className="flex items-center gap-4">
          <DarkModeButton />
          <AccountButton />
          <CartButton />
        </div>
      </div>
    </header>
  )
}
