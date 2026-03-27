import { Button } from "@headlessui/react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import User4 from "./icons/user-icon"

const AccountButton = () => {
  return (
    <Button
      className="h-10 w-10 hover:bg-accent hover:text-accent-foreground transition-bg duration-200 ease-in rounded-md flex items-center justify-center
      text-foreground"
      title="Account"
    >
      <LocalizedClientLink href="/account">
        <User4 />
      </LocalizedClientLink>
    </Button>
  )
}

export default AccountButton
