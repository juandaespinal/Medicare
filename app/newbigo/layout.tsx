// Check if this file contains the pixel ID and update it if needed
import type React from "react"
import "../../app/globals.css"
import type { Metadata } from "next"
import NewBigoClient from "./NewBigoClient"

export const metadata: Metadata = {
  title: "Medicare Grocery Allowance Benefits",
  description: "Claim your Medicare Grocery Allowance benefits today",
}

export default function NewBigoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <NewBigoClient>{children}</NewBigoClient>
}
