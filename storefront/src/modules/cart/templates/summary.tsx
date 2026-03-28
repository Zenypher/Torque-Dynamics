"use client"

import { Button } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="lg:col-span-1">
      <div className="rounded-xl border border-border bg-card p-6 space-y-5 sticky top-32">
        <h2 className="font-display font-bold text-lg">Order Summary</h2>

        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Promo Code
          </label>
          <div className="flex gap-2 mt-1.5">
            <div className="relative flex-1">
              <DiscountCode cart={cart} />
            </div>
          </div>
        </div>

        <Divider />

        <CartTotals totals={cart} />

        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
        >
          <Button className="w-full ferrari-gradient text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 font-semibold tracking-wide h-12 rounded-md px-8 text-base">
            Proceed to Checkout
          </Button>
        </LocalizedClientLink>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>🔒 Secure Checkout</span>
          <span>•</span>
          <span>30-Day Returns</span>
        </div>
      </div>
    </div>
  )
}

export default Summary
