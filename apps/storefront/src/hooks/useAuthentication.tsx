'use client'

import { validateBoolean } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function useAuthenticated() {
   const [authenticated, setAuthenticated] = useState(null)

   useEffect(() => {
      try {
         if (typeof window !== 'undefined' && window.localStorage) {
            const cookies = document.cookie.split(';')
            const cookieString = cookies.find((cookie) =>
               cookie.trim().startsWith('logged-in')
            )
            const loggedInCookie = cookieString
               ? cookieString.split('=')[1] === 'true'
               : false

            setAuthenticated(loggedInCookie)
         }
      } catch (error) {
         console.error({ error })
      }
   }, [])

   return { authenticated: validateBoolean(authenticated, true) }
}
