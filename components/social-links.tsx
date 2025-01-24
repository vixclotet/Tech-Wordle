import { Github, Instagram, Twitter } from "lucide-react"
import Link from "next/link"

export function SocialLinks() {
  return (
    <div className="flex justify-center gap-4 mt-8">
      <Link
        href="https://instagram.com/vixclotet"
        target="_blank"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Instagram className="w-6 h-6" />
        <span className="sr-only">Instagram</span>
      </Link>
      <Link
        href="https://x.com/vixclotet"
        target="_blank"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Twitter className="w-6 h-6" />
        <span className="sr-only">Twitter</span>
      </Link>
      <Link
        href="https://github.com/vixclotet"
        target="_blank"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Github className="w-6 h-6" />
        <span className="sr-only">GitHub</span>
      </Link>
    </div>
  )
}

