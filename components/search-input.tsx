"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchInputProps {
  placeholder: string
  onChange?: (value: string) => void
}

export default function SearchInput({ placeholder, onChange }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder={placeholder}
        className="pl-10 bg-white border-gray-200"
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  )
}
