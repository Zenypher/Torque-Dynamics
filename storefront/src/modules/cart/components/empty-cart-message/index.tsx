import { Button, Heading, Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ShoppingCart } from "lucide-react"

const EmptyCartMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
        <ShoppingCart className="w-10 h-10 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold">Your cart is empty</p>
        <p className="text-sm text-muted-foreground mt-1">
          Looks like you haven&apos;t added any parts yet.
        </p>
      </div>
      <LocalizedClientLink href="/">
        <Button className="ferrari-gradient text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 font-semibold tracking-wide h-12 rounded-md px-8 text-base">
          Continue Shopping
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
