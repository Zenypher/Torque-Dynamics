"use client"

import React, { useEffect, useState } from "react"
import { Hits, InstantSearch, SearchBox } from "react-instantsearch"
import { searchClient } from "@lib/config"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Hit = {
  id: string
  title: string
  description: string
  handle: string
  thumbnail: string
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
        <div className="relative w-80">
          <SearchBox
            className="w-full [&_input]:w-full [&_input]:outline-none [&_input]:border [&_input]:border-foreground [&_input]:bg-transparent [&_input]:rounded-md [&_input]:px-3 [&_input]:py-2 [&_input]:text-foreground [&_button]:hidden"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow clicking on results
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
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
      <Image
        src={hit.thumbnail}
        alt={hit.title}
        width={48}
        height={48}
        className="aspect-square object-cover rounded"
      />
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
