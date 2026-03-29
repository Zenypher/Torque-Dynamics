"use client"

import { HttpTypes } from "@medusajs/types"
import { Container, IconButton } from "@medusajs/ui"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState, useCallback } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }, [images.length])

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:m-4 gap-y-4">
        {/* Main Image Container */}
        <div className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle rounded-rounded">
          <div
            className="flex transition-transform duration-300 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div
                key={image.id}
                className="flex-shrink-0 w-full h-full relative"
              >
                {!!image.url && (
                  <Image
                    src={image.url}
                    priority={index <= 2 ? true : false}
                    className="absolute inset-0 rounded-rounded"
                    alt={`Product image ${index + 1}`}
                    fill
                    sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                    style={{
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <>
              <IconButton
                variant="transparent"
                size="large"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-foreground shadow-md text-white hover:text-neutral-900"
                onClick={goToPrevious}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                variant="transparent"
                size="large"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-foreground shadow-md text-white hover:text-neutral-900"
                onClick={goToNext}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                  index === currentIndex
                    ? "border-primary"
                    : "border-transparent hover:border-ui-border-base"
                }`}
              >
                {!!image.url && (
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-primary"
                    : "bg-ui-border-base hover:bg-ui-border-strong"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGallery
