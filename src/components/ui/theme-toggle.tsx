'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  
  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' disabled>
        <SunIcon className='h-5 w-5' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className='hover:bg-gray-100 dark:hover:bg-gray-800'
    >
      {theme === 'light' ? (
        <MoonIcon className='h-5 w-5 text-gray-600' />
      ) : (
        <SunIcon className='h-5 w-5 text-gray-300' />
      )}
      <span className='sr-only'>
        {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      </span>
    </Button>
  )
}