"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { mockSections } from "@/mocks/sections"
import { SectionNav } from "./section-nav"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleLoginClick = () => {
    router.push("/login")
  }

  const handleRegisterClick = () => {
    router.push("/register")
  }

  const handleSearchClick = () => {
    router.push("/search")
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary tracking-tight">Reuters</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <SectionNav sections={mockSections} gridCols={2} />
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex"
              onClick={handleSearchClick}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* 🔹 Sign In / Sign Up (Desktop) */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={handleLoginClick}
              >
                Login
              </Button>
              <Button variant="default" size="sm" onClick={handleRegisterClick}>
                Register
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              {mockSections.map((section) => (
                <div key={section.label}>
                  <a
                    href={section.href || "#"}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {section.label}
                  </a>
                  {section.childSection && (
                    <div className="ml-4 mt-2 grid grid-cols-2 gap-2">
                      {section.childSection.map((child) => (
                        <a
                          key={child.label}
                          href={child.href || "#"}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* 🔹 Sign In / Sign Up (Mobile) */}
              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={handleLoginClick}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={handleRegisterClick}
                >
                  Register
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
