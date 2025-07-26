import { ReactNode } from "react"

interface PrivateLayoutProps {
  children: ReactNode
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* You can add navigation, sidebar, or other layout elements here */}
      <main>
        {children}
      </main>
    </div>
  )
}
