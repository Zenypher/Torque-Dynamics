"use client"

import { isManual, isStripeLike, paymentInfoMap } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState, useEffect, useContext } from "react"
import ErrorMessage from "../error-message"
import { useParams, usePathname, useRouter } from "next/navigation"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton
          cart={cart}
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const { countryCode } = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const stripeContext = useContext(StripeContext)
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (session) => session.provider_id === "pp_stripe"
  )
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Only use Stripe hooks when Elements is available
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const stripe = stripeContext.hasElements ? useStripe() : null
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const elements = stripeContext.hasElements ? useElements() : null
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled =
    !stripeContext.isReady ||
    (stripeContext.hasElements && (!stripe || !elements))
      ? true
      : false

  useEffect(() => {
    if (cart.payment_collection?.status === "authorized") {
      onPaymentCompleted()
    }
  }, [cart.payment_collection?.status])

  useEffect(() => {
    if (elements) {
      const paymentElement = elements.getElement("payment")
      paymentElement?.on("change", (e) => {
        if (!e.complete) {
          router.push(pathname + "?step=payment", { scroll: false })
        }
      })
      paymentElement?.on("loaderror", (e) => {
        console.error("PaymentElement load error", e)
        setErrorMessage(
          "Failed to load payment form. Please refresh and try again."
        )
      })
    }
  }, [elements, pathname, router])

  const onPaymentCompleted = async () => {
    try {
      const result = await placeOrder(cart.id)
      if (result?.type === "order" && result.order) {
        router.push(`/${result.countryCode}/order/${result.order.id}/confirmed`)
      } else {
        setErrorMessage("Failed to place order")
      }
    } catch (error) {
      setErrorMessage("Failed to place order")
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayment = async () => {
    if (!stripe || !elements || !cart) {
      return
    }
    setSubmitting(true)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setErrorMessage(submitError.message || null)
      setSubmitting(false)
      return
    }

    const clientSecret = paymentSession?.data?.client_secret as string

    await stripe
      .confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/api/capture-payment/${cart.id}?country_code=${countryCode}`,
          payment_method_data: {
            billing_details: {
              name:
                cart.billing_address?.first_name +
                " " +
                cart.billing_address?.last_name,
              address: {
                city: cart.billing_address?.city ?? undefined,
                country: cart.billing_address?.country_code ?? undefined,
                line1: cart.billing_address?.address_1 ?? undefined,
                line2: cart.billing_address?.address_2 ?? undefined,
                postal_code: cart.billing_address?.postal_code ?? undefined,
                state: cart.billing_address?.province ?? undefined,
              },
              email: cart.email,
              phone: cart.billing_address?.phone ?? undefined,
            },
          },
        },
        redirect: "if_required",
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
            return
          }

          setErrorMessage(error.message || null)
          setSubmitting(false)
          return
        }

        if (
          paymentIntent.status === "requires_capture" ||
          paymentIntent.status === "succeeded"
        ) {
          onPaymentCompleted()
        }
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({
  cart,
  notReady,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const onPaymentCompleted = async () => {
    try {
      const result = await placeOrder(cart.id)
      if (result?.type === "order" && result.order) {
        router.push(`/${result.countryCode}/order/${result.order.id}/confirmed`)
      } else {
        setErrorMessage("Failed to place order")
      }
    } catch (error) {
      setErrorMessage("Failed to place order")
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
