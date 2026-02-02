import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { publicRoutes } from './routes/publicRoutes'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <Routes>
      {publicRoutes.map(({ path, element }, idx) => {
        // If login is required, redirect to "/" if not logged in
        const protectedElement =
          loggedIn || path === '/' ? (
            // Pass onLogin prop to Login dynamically
            path === '/' ? React.cloneElement(element, { onLogin: () => setLoggedIn(true) }) : (
              element
            )
          ) : (
            <Navigate to="/" />
          )

        return <Route key={idx} path={path} element={protectedElement} />
      })}

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
