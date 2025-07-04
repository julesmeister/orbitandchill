'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export interface DropdownItem {
  type: 'link' | 'button' | 'divider' | 'header'
  label?: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
  variant?: 'default' | 'danger' | 'success'
  description?: string
}

interface DropdownProps {
  trigger: React.ReactNode | ((isOpen: boolean) => React.ReactNode)
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export default function Dropdown({ 
  trigger, 
  items, 
  align = 'right', 
  className = '',
  width = 'md'
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    // Add event listeners when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    } else {
      // Clean up event listeners when dropdown is closed
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }

    // Cleanup on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen])


  const toggleDropdown = () => setIsOpen(!isOpen)

  const getWidthClass = () => {
    switch (width) {
      case 'sm': return 'w-48'
      case 'md': return 'w-64'
      case 'lg': return 'w-80'
      case 'xl': return 'w-96'
      case 'full': return 'w-full'
      default: return 'w-64'
    }
  }

  const getVariantClasses = (variant?: string) => {
    switch (variant) {
      case 'danger':
        return 'text-black hover:bg-black hover:text-white'
      case 'success':
        return 'text-black hover:bg-black hover:text-white'
      default:
        return 'text-black hover:bg-black hover:text-white'
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className="flex items-center focus:outline-none w-full"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {typeof trigger === 'function' ? trigger(isOpen) : trigger}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          aria-hidden="true" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1 bg-white border border-black z-[9999] overflow-hidden transform transition-all duration-200 ease-out ${
            width === 'full' 
              ? 'left-0 right-0 w-full' 
              : `${getWidthClass()} ${align === 'right' ? 'right-0' : 'left-0'}`
          }`}
          style={{
            animation: 'dropdownSlideIn 0.2s ease-out',
            ...(width === 'full' && triggerRef.current ? { 
              width: triggerRef.current.offsetWidth 
            } : {})
          }}
        >
          
          <div className="relative py-2">
            {items.map((item, index) => {
              if (item.type === 'divider') {
                return (
                  <div 
                    key={index} 
                    className="mx-0 my-0 border-t border-black" 
                  />
                )
              }

              if (item.type === 'header') {
                return (
                  <div
                    key={index}
                    className="px-4 py-2 text-xs font-semibold text-black uppercase tracking-wider font-inter"
                  >
                    {item.label}
                  </div>
                )
              }

              if (item.type === 'link') {
                return (
                  <Link
                    key={index}
                    href={item.href || '#'}
                    className={`group relative flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 font-inter overflow-hidden hover:pl-6 ${getVariantClasses(item.variant)}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {/* Animated accent bar */}
                    <div className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
                    
                    {item.icon && (
                      <span className="mr-3 group-hover:text-current transition-colors duration-200 flex-shrink-0">
                        {item.icon}
                      </span>
                    )}
                    <div className="flex-1 relative">
                      <div>{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-black/60 mt-0.5 leading-relaxed">
                          {item.description}
                        </div>
                      )}
                    </div>
                    {/* Arrow indicator */}
                    <svg 
                      className="w-4 h-4 transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )
              }

              if (item.type === 'button') {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick?.()
                      setIsOpen(false)
                    }}
                    className={`group relative flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 text-left font-inter overflow-hidden hover:pl-6 ${getVariantClasses(item.variant)}`}
                  >
                    {/* Animated accent bar */}
                    <div className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
                    
                    {item.icon && (
                      <span className="mr-3 group-hover:text-current transition-colors duration-200 flex-shrink-0">
                        {item.icon}
                      </span>
                    )}
                    <div className="flex-1 relative">
                      <div>{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-black/60 mt-0.5 leading-relaxed">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </button>
                )
              }

              return null
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes dropdownSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}