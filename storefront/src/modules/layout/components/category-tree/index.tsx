import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

interface CategoryTreeProps {
  categories: HttpTypes.StoreProductCategory[]
}

const CategoryTree = ({ categories }: CategoryTreeProps) => {
  if (!categories || categories.length === 0) return null

  return (
    <ul className="flex justify-center items-center gap-6">
      {categories.map((category) => (
        <li key={category.id} className="my-2">
          <LocalizedClientLink
            href={`/categories/${category.handle}`}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {category.name}
          </LocalizedClientLink>
        </li>
      ))}
    </ul>
  )
}

export default CategoryTree
