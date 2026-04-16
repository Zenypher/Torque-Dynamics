"use client"

import React, { useEffect, useState } from "react"
import { Hits, InstantSearch, SearchBox } from "react-instantsearch"
import { searchClient } from "@lib/config"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Hit = {
  id: string
  title: string
  description: string
  handle: string
  thumbnail?: string | null
  categories: {
    id: string
    name: string
    handle: string
  }[]
  tags: { id: string; value: string }[]
}

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsFocused(false)
  }, [pathname])

  return (
    <div className="hidden small:flex items-center gap-x-6 h-full relative">
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME}
      >
        <div
          className={`flex-1 max-w-xl relative transition-all duration-300 ${
            isFocused ? "scale-[1.02]" : ""
          }`}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <SearchBox
            className="[&_input]:w-full [&_input]:h-10 [&_input]:pl-10 [&_input]:pr-4 [&_input]:rounded-lg [&_input]:border [&_input]:border-input [&_input]:bg-muted/50 [&_input]:text-sm [&_input]:placeholder:text-muted-foreground [&_input]:focus:outline-none [&_input]:focus:ring-2 [&_input]:focus:ring-primary/30 [&_input]:focus:border-primary [&_input]:transition-all [&_button]:hidden"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow clicking on results
            placeholder="Search parts, brands, or part numbers..."
          />
          {isFocused && (
            <div className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto mt-1">
              <Hits
                hitComponent={Hit}
                transformItems={(items) =>
                  items.map((item) => ({ ...item, objectID: (item as any).id }))
                }
              />
            </div>
          )}
        </div>
      </InstantSearch>
    </div>
  )
}

const Hit = ({ hit }: { hit: Hit }) => {
  return (
    <LocalizedClientLink
      href={`/products/${hit.handle}`}
      className="flex flex-row gap-x-3 p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 border-b border-neutral-200 last:border-b-0 bg-background"
    >
      {hit.thumbnail ? (
        <Image
          src={hit.thumbnail}
          alt={hit.title}
          width={48}
          height={48}
          className="aspect-square object-cover rounded"
        />
      ) : (
        <div className="w-12 h-12 flex items-center justify-center rounded bg-neutral-100 text-neutral-500">
          <PlaceholderImage size={20} />
        </div>
      )}
      <div className="flex flex-col gap-y-1 flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground truncate">
          {hit.title}
        </h3>
        <p className="text-xs text-neutral-500 line-clamp-2">
          {hit.description}
        </p>
      </div>
    </LocalizedClientLink>
  )
}
