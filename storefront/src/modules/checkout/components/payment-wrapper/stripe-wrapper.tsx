"use client"

import { Stripe, StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { HttpTypes } from "@medusajs/types"
import { createContext } from "react"

type StripeWrapperProps = {
  paymentSession: HttpTypes.StorePaymentSession | undefined
  stripeKey?: string
  stripePromise: Promise<Stripe | null> | null
  children: React.ReactNode
}

export const StripeContext = createContext<{
  isReady: boolean
  hasElements: boolean
}>({
  isReady: false,
  hasElements: false,
})

const StripeWrapper: React.FC<StripeWrapperProps> = ({
  paymentSession,
  stripeKey,
  stripePromise,
  children,
}) => {
  if (!stripeKey) {
    throw new Error(
      "Stripe key is missing. Set NEXT_PUBLIC_STRIPE_KEY environment variable."
    )
  }

  if (!stripePromise) {
    throw new Error(
      "Stripe promise is missing. Make sure you have provided a valid Stripe key."
    )
  }

  // If no payment session or no client secret, provide context but no Elements
  if (!paymentSession?.data?.client_secret) {
    return (
      <StripeContext.Provider value={{ isReady: true, hasElements: false }}>
        {children}
      </StripeContext.Provider>
    )
  }

  const options: StripeElementsOptions = {
    clientSecret: paymentSession.data.client_secret as string,
  }

  return (
    <StripeContext.Provider value={{ isReady: true, hasElements: true }}>
      <Elements options={options} stripe={stripePromise}>
        {children}
      </Elements>
    </StripeContext.Provider>
  )
}

export default StripeWrapper
