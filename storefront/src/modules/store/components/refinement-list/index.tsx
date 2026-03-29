"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import { XMark } from "@medusajs/icons"

type RefinementListProps = {
  sortBy: SortOptions
  priceMin?: string
  priceMax?: string
  inStock?: "true" | "false"
  search?: boolean
  "data-testid"?: string
}

const RefinementList = ({
  sortBy,
  priceMin,
  priceMax,
  inStock,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)

    if (value === "" || value === "undefined" || value === undefined) {
      params.delete(name)
    } else {
      params.set(name, value)
    }

    if (name !== "page") {
      params.delete("page")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("priceMin")
    params.delete("priceMax")
    params.delete("inStock")
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      <div className="flex flex-col gap-4">
        <SortProducts
          sortBy={sortBy}
          setQueryParams={setQueryParams}
          data-testid={dataTestId}
        />

        <div className="rounded-lg pr-4">
          <h3 className="text-sm mb-2 text-ui-fg-muted">Filters</h3>

          <div className="mb-3">
            <label className="text-xs font-medium text-muted-foreground">
              Price min
            </label>
            <input
              type="number"
              min={0}
              value={priceMin ?? ""}
              onChange={(event) =>
                setQueryParams("priceMin", event.target.value)
              }
              className="w-full rounded-md border border-ui-border-base bg-transparent p-2 text-sm"
              placeholder="0"
              aria-label="Minimum price"
            />
          </div>

          <div className="mb-3">
            <label className="text-xs font-medium text-muted-foreground">
              Price max
            </label>
            <input
              type="number"
              min={0}
              value={priceMax ?? ""}
              onChange={(event) =>
                setQueryParams("priceMax", event.target.value)
              }
              className="w-full rounded-md border border-ui-border-base bg-transparent p-2 text-sm"
              placeholder="1000"
              aria-label="Maximum price"
            />
          </div>

          <div className="flex justify-center items-center gap-2 mb-3">
            <input
              id="in-stock-checkbox"
              type="checkbox"
              className="rounded border-ui-border-base text-primary focus:ring-primary"
              checked={inStock === "true"}
              onChange={(event) =>
                setQueryParams(
                  "inStock",
                  event.target.checked ? "true" : "false"
                )
              }
            />
            <label htmlFor="in-stock-checkbox">In stock only</label>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-primary hover:text-foreground transition-colors flex gap-2"
          >
            <XMark />
            Clear filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default RefinementList
