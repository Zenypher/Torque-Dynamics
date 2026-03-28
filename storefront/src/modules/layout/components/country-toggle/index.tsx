"use client"

import { clx, useToggleState } from "@medusajs/ui"
import CountrySelect from "../country-select"
import { ArrowRightMini } from "@medusajs/icons"
import { StoreRegion } from "@medusajs/types"

type CountryToggleProps = {
  regions: StoreRegion[] | null
}

export default function CountryToggle({ regions }: CountryToggleProps) {
  const countryToggleState = useToggleState()

  return (
    <div
      className="flex justify-between items-center"
      onMouseEnter={countryToggleState.open}
      onMouseLeave={countryToggleState.close}
    >
      {regions && (
        <CountrySelect toggleState={countryToggleState} regions={regions} />
      )}
      <ArrowRightMini
        className={clx(
          "transition-transform duration-150",
          countryToggleState.state ? "-rotate-90" : ""
        )}
      />
    </div>
  )
}
