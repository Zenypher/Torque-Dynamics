import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreProductCategory, StoreRegion } from "@medusajs/types"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import DarkModeButton from "@modules/layout/components/dark-mode-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import SearchBar from "@modules/search/components/searchbar"
import AccountButton from "@modules/layout/components/account-button"
import { listCategories } from "@lib/data/categories"
import CategoryTree from "@modules/layout/components/category-tree"

export default async function Nav() {
  const [regions, locales, currentLocale, product_categories] =
    await Promise.all([
      listRegions().then((regions: StoreRegion[]) => regions),
      listLocales(),
      getLocale(),
      listCategories({
        parent_category_id: "null",
        include_descendants_tree: true,
      }).then(
        (product_categories: StoreProductCategory[]) => product_categories
      ),
    ])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="ferrari-gradient py-1.5 w-full">
        <p className="text-center text-xs font-medium text-primary-foreground tracking-wide">
          FREE SHIPPING ON ORDERS OVER $99 — SAME DAY DISPATCH
        </p>
      </div>

      <div className="container flex items-center gap-4 py-3">
        <LocalizedClientLink
          href="/"
          className="flex items-center gap-2 shrink-0"
        >
          <Image
            src="/td_logo.png"
            alt="Torque Dynamics Logo"
            width={64}
            height={64}
          />
          <span className="font-bold font-display text-2xl tracking-tight hidden sm:block dark:text-surface-dark-text">
            Torque <span className="text-primary">Dynamics</span>
          </span>
        </LocalizedClientLink>
        <div className="flex items-center gap-4 ml-auto">
          <SearchBar />
          <DarkModeButton />
          <AccountButton />
          <CartButton />
        </div>
      </div>

      <nav className="hidden sm:block border-t border-border w-full">
        <div className="container flex items-center justify-center gap-6 py-2">
          <LocalizedClientLink
            href="/store"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Shop All
          </LocalizedClientLink>
          <CategoryTree categories={product_categories} />
        </div>
      </nav>

      <nav className="sm:hidden animate-slide-up">
        <SideMenu
          regions={regions}
          locales={locales}
          currentLocale={currentLocale}
        />
      </nav>
    </header>
  )
}
