import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronRight } from "@medusajs/icons"
import { RotateCcw, Shield, ShoppingCart, Star, Truck } from "lucide-react"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="container pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <LocalizedClientLink
            href="/"
            className="hover:text-primary transition-colors"
          >
            Home
          </LocalizedClientLink>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate">
            {product.title}
          </span>
        </nav>
      </div>

      {/* ── Main Grid ──────────────────────────── */}
      <section className="container pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="relative rounded-xl bg-muted border border-border">
            <ImageGallery images={images} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {product.subtitle}
              </p>
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                {product.title}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                SKU: {product.variants ? product.variants[0].sku : ""}
              </p>
            </div>

            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 text-center border-y py-6">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Over €99" },
                {
                  icon: Shield,
                  label: "Lifetime Warranty",
                  sub: "Hassle-free",
                },
                { icon: RotateCcw, label: "Easy Returns", sub: "30 days" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 p-2"
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-[10px] text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>
            <ProductTabs product={product} />
          </div>
        </div>
      </section>

      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </main>
  )
}

export default ProductTemplate
