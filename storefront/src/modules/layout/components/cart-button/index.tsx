import { retrieveCart } from "@lib/data/cart"
import CartSidemenu from "../cart-sidemenu"

export default async function CartButton() {
  const cart = await retrieveCart().catch(() => null)

  return <CartSidemenu cart={cart} />
}
