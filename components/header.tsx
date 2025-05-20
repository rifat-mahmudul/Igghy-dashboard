import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  return (
    <header className="h-16 flex items-center justify-end px-4 border-b bg-white">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Mr. Admin</span>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/diverse-group.png" alt="User" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
