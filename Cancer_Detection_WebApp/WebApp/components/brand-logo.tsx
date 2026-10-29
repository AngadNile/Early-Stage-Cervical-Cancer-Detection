"use client"

import React from "react"
import { Activity } from "lucide-react"
import { Link } from "react-router-dom"

interface BrandLogoProps {
  subtitle?: string
  href?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function BrandLogo({
  subtitle = "Early Detection · Early Protection",
  href,
  className = "",
  size = "md",
}: BrandLogoProps) {
  const iconSize = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-11 h-11" : "w-9 h-9"
  const svgSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"
  const titleSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg"
  const subSize = size === "sm" ? "text-[10px]" : size === "lg" ? "text-sm" : "text-xs"

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Unified Logo Icon Mark */}
      <div className={`${iconSize} bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/25 shrink-0 transition-transform duration-200 group-hover:scale-105`}>
        <Activity className={`${svgSize} text-white`} />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span className={`font-bold ${titleSize} tracking-tight text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors`}>
          Cervi<span className="text-teal-600 dark:text-teal-400">Care</span>
        </span>
        {subtitle && (
          <span className={`${subSize} text-gray-500 dark:text-gray-400 font-medium mt-0.5 tracking-normal`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link to={href} className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}

export default BrandLogo
