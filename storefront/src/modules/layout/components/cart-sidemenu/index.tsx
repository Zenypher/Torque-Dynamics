"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { ShoppingCart } from "lucide-react"
import { Fragment } from "react"

const CartSidemenu = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => {
            // Handle body overflow directly
            if (typeof document !== "undefined") {
              document.body.style.overflow = open ? "hidden" : ""
            }

            return (
              <>
                <div className="relative flex h-full">
                  <PopoverButton
                    data-testid="nav-menu-button"
                    className="h-10 w-10 hover:bg-accent hover:text-accent-foreground relative flex items-center justify-center rounded-md"
                  >
                    <ShoppingCart />
                    {totalItems > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </PopoverButton>
                </div>

                {open && (
                  <div
                    className="fixed h-screen inset-0 z-[60] bg-black/50 pointer-events-auto "
                    onClick={close}
                    data-testid="side-menu-backdrop"
                  />
                )}

                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="opacity-0 translate-x-full"
                  enterTo="opacity-100 translate-x-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-x-0"
                  leaveTo="opacity-0 translate-x-full"
                >
                  <PopoverPanel className="fixed right-0 top-0 bottom-0 h-screen w-full sm:w-1/3 2xl:w-1/4 z-[70] bg-background pointer-events-auto overflow-hidden">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center px-6 pt-6 pb-6 border-b justify-between">
                        <div className="flex gap-4">
                          <ShoppingCart className="w-5 h-5 text-primary" />
                          <h3>Your Cart ({totalItems})</h3>
                        </div>
                        <button
                          data-testid="close-menu-button"
                          onClick={close}
                          className="hover:text-primary transition-colors"
                        >
                          <XMark />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto pt-6">
                        {cartState && cartState.items?.length ? (
                          <>
                            <div className="px-4 flex flex-col gap-y-8 no-scrollbar p-px ">
                              {cartState.items
                                .sort((a, b) => {
                                  return (a.created_at ?? "") >
                                    (b.created_at ?? "")
                                    ? -1
                                    : 1
                                })
                                .map((item) => (
                                  <div
                                    className="grid grid-cols-[122px_1fr] gap-x-4"
                                    key={item.id}
                                    data-testid="cart-item"
                                  >
                                    <LocalizedClientLink
                                      href={`/products/${item.product_handle}`}
                                      className="w-24"
                                    >
                                      <Thumbnail
                                        thumbnail={item.thumbnail}
                                        images={item.variant?.product?.images}
                                        size="square"
                                      />
                                    </LocalizedClientLink>
                                    <div className="flex flex-col justify-between ">
                                      <div className="flex flex-col">
                                        <div className="flex items-start justify-between">
                                          <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                            <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                              <LocalizedClientLink
                                                href={`/products/${item.product_handle}`}
                                                data-testid="product-link"
                                              >
                                                {item.title}
                                              </LocalizedClientLink>
                                            </h3>
                                            <LineItemOptions
                                              variant={item.variant}
                                              data-testid="cart-item-variant"
                                              data-value={item.variant}
                                            />
                                          </div>
                                          <div className="flex justify-end">
                                            <LineItemPrice
                                              item={item}
                                              style="tight"
                                              currencyCode={
                                                cartState.currency_code
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between mt-1">
                                        <span
                                          data-testid="cart-item-quantity"
                                          data-value={item.quantity}
                                        >
                                          Quantity: {item.quantity}
                                        </span>
                                        <DeleteButton
                                          id={item.id}
                                          className=""
                                          data-testid="cart-item-remove-button"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                            <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                              <div className="flex items-center justify-between">
                                <span className="text-ui-fg-base font-semibold">
                                  Subtotal{" "}
                                  <span className="font-normal">
                                    (excl. taxes)
                                  </span>
                                </span>
                                <span
                                  className="text-large-semi"
                                  data-testid="cart-subtotal"
                                  data-value={cartState.subtotal}
                                >
                                  {convertToLocale({
                                    amount: cartState.subtotal || 0,
                                    currency_code: cartState.currency_code,
                                  })}
                                </span>
                              </div>
                              <div className="px-6 pb-6 flex flex-row items-center justify-between gap-2">
                                <LocalizedClientLink
                                  href="/checkout?step=address"
                                  passHref
                                  onClick={close}
                                >
                                  <Button
                                    className="w-full ferrari-gradient text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 font-semibold tracking-wide h-12 rounded-md px-8 text-base"
                                    data-testid="go-to-cart-button"
                                  >
                                    Proceed to checkout
                                  </Button>
                                </LocalizedClientLink>
                                <LocalizedClientLink
                                  href="/cart"
                                  passHref
                                  onClick={close}
                                >
                                  <Button className="w-full border border-input text-foreground bg-background hover:bg-accent hover:text-accent-foreground">
                                    View full cart
                                  </Button>
                                </LocalizedClientLink>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-sm">
                              Your cart is empty
                            </p>
                            <LocalizedClientLink href="/store" onClick={close}>
                              <Button variant="transparent" className="border">
                                Start Shopping
                              </Button>
                            </LocalizedClientLink>
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverPanel>
                </Transition>
              </>
            )
          }}
        </Popover>
      </div>
    </div>
  )
}

export default CartSidemenu
