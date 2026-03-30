"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"
import { ShoppingCart } from "lucide-react"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [quantity, setQuantity] = useState<number>(1)
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant, pathname, router, searchParams])

  const maxQuantity = useMemo(() => {
    if (!selectedVariant) {
      return 10
    }

    if (!selectedVariant.manage_inventory) {
      return 100
    }

    return selectedVariant.inventory_quantity ?? 0
  }, [selectedVariant])

  useEffect(() => {
    if (!selectedVariant) {
      setQuantity(1)
      return
    }

    setQuantity((current) => {
      if (current < 1) {
        return 1
      }
      if (maxQuantity > 0 && current > maxQuantity) {
        return maxQuantity
      }
      return current
    })
  }, [selectedVariant, maxQuantity])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      })

      // after add to cart, you may optionally reset quantity to 1
      setQuantity(1)
    } catch (error) {
      console.error("Error adding to cart:", error)
      // Optionally show an error toast/notification here
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        <div className="grid grid-cols-1 gap-y-2">
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
            <div className="flex flex-1 justify-between items-center border border-border rounded-lg">
              <button
                type="button"
                onClick={() => setQuantity((curr) => Math.max(1, curr - 1))}
                disabled={isAdding || quantity <= 1}
                className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <input
                type="number"
                min={1}
                max={maxQuantity}
                value={quantity}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (Number.isNaN(value)) {
                    setQuantity(1)
                  } else {
                    setQuantity(Math.max(1, Math.min(maxQuantity, value)))
                  }
                }}
                className="w-10 h-10 text-center text-sm font-medium bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Quantity"
              />

              <button
                type="button"
                onClick={() =>
                  setQuantity((curr) => Math.min(maxQuantity, curr + 1))
                }
                disabled={
                  isAdding ||
                  (selectedVariant?.manage_inventory
                    ? quantity >= maxQuantity
                    : false)
                }
                className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={
                !inStock ||
                !selectedVariant ||
                !!disabled ||
                isAdding ||
                !isValidVariant ||
                quantity < 1 ||
                quantity > maxQuantity
              }
              variant="primary"
              className="w-full ferrari-gradient text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 font-semibold tracking-wide h-12 rounded-md px-8 text-base gap-2 disabled:bg-ui-bg-disabled"
              isLoading={isAdding}
              data-testid="add-product-button"
            >
              {!selectedVariant && !options ? (
                "Select variant"
              ) : !inStock || !isValidVariant ? (
                "Out of stock"
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>

          {selectedVariant?.manage_inventory && (
            <p className="text-xs text-muted-foreground">
              {maxQuantity > 0
                ? `Only ${maxQuantity} left in stock`
                : "Out of stock"}
            </p>
          )}
        </div>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          quantity={quantity}
          maxQuantity={maxQuantity}
          setQuantity={setQuantity}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
