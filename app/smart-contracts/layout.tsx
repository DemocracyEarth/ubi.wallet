import type { ReactNode } from "react"

interface SmartContractsLayoutProps {
  children: ReactNode
}

export default function SmartContractsLayout({ children }: SmartContractsLayoutProps) {
  return <div className="container mx-auto px-4 py-6">{children}</div>
}
