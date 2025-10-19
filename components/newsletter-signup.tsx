import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function NewsletterSignup() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Stay Informed</h2>
          </div>
          <p className="text-lg mb-6 text-primary-foreground/90">
            Get the latest breaking news and market updates delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-background text-foreground border-background"
            />
            <Button variant="secondary" className="bg-background text-primary hover:bg-background/90">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-primary-foreground/70 mt-4">
            Join over 2 million readers worldwide. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
