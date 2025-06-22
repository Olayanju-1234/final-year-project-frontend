"use client"

import { useState } from "react"
import LandingPage from "../pages/LandingPage"
import AuthPages from "../pages/AuthPages"
import TenantDashboard from "../pages/TenantDashboard"

export default function Page() {
  const [currentPage, setCurrentPage] = useState("landing")

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage />
      case "auth":
        return <AuthPages />
      case "tenant-dashboard":
        return <TenantDashboard />
      default:
        return <LandingPage />
    }
  }

  return (
    <div>
      {/* Demo Navigation - Remove in production */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-2 space-y-1">
        <div className="text-xs text-gray-500 px-2 py-1">Demo Navigation</div>
        <button
          onClick={() => setCurrentPage("landing")}
          className={`block w-full text-left px-3 py-1 text-sm rounded ${
            currentPage === "landing" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
          }`}
        >
          Landing Page
        </button>
        <button
          onClick={() => setCurrentPage("auth")}
          className={`block w-full text-left px-3 py-1 text-sm rounded ${
            currentPage === "auth" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
          }`}
        >
          Auth Pages
        </button>
        <button
          onClick={() => setCurrentPage("tenant-dashboard")}
          className={`block w-full text-left px-3 py-1 text-sm rounded ${
            currentPage === "tenant-dashboard" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
          }`}
        >
          Tenant Dashboard
        </button>
      </div>
      {renderPage()}
    </div>
  )
}
