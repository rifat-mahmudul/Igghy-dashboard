import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  return (
    <header className="h-[72px] flex items-center justify-end px-4 bg-[#e6f5f0]">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#0ea06d] font-semibold">Mr. Admin</span>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/diverse-group.png" alt="User" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
