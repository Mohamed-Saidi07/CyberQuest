import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center lg:px-8">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">CyberQuest</span>
        </div>
        <p className="text-xs text-muted-foreground max-w-md">
          An interactive cybersecurity education platform designed to help everyone build essential digital safety skills through gamified learning.
        </p>
        <p className="text-xs text-muted-foreground">
          Built for educational purposes. Stay safe online.
        </p>
      </div>
    </footer>
  )
}
