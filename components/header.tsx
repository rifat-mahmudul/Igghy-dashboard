import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Header() {
  const session = useSession();
  const userName = session?.data?.user?.name;

  return (
    <header className="h-[72px] flex items-center justify-end px-4 bg-[#e6f5f0]">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#0ea06d] font-semibold">{userName}</span>
        <div className="w-10 h-10 rounded-full bg-[#0ea06d] flex items-center justify-center text-white">
          <User />
        </div>
      </div>
    </header>
  );
}
