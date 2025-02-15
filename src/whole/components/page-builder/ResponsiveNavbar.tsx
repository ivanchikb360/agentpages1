import React from "react"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "../../components/ui/button"

interface NavItem {
  label: string
  href: string
}

interface ResponsiveNavbarProps {
  items: NavItem[]
}

export const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          <div className="hidden md:flex md:flex-grow md:justify-center">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="relative w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={toggleMenu}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

