import { Card, CardContent } from "@/components/ui/card"

interface SidebarProps {
  children: React.ReactNode
  className?: string
}

export function Sidebar({ children, className = "" }: SidebarProps) {
  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  )
} 