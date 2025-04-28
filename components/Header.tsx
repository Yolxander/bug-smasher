import { Laptop } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  title?: string
  description?: string
  showBadge?: boolean
  badgeText?: string
}

export function Header({ 
  title = "Bug Smasher", 
  description = "Report issues with websites, microsites, or media content.",
  showBadge = true,
  badgeText = "Internal Tool"
}: HeaderProps) {
  return (
    <CardHeader className="space-y-1">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Laptop className="h-5 w-5" />
          {title}
        </CardTitle>
        {showBadge && (
          <Badge variant="outline" className="text-xs font-normal">
            {badgeText}
          </Badge>
        )}
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  )
} 