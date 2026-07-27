import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function Component() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold">
          Page not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page you requested does not exist.
        </p>
        <Button className="mt-6" render={<Link to="/dashboard" />}>
          Return to dashboard
        </Button>
      </div>
    </div>
  )
}
