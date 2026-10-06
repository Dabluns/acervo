export const dynamic = "force-dynamic"
import { getCurrentUser } from "@/lib/current-user"
import AcervoUI from "@/components/AcervoUI"

export default async function AcervoPage() {
  const user = await getCurrentUser()
  const member = { 
    name: user?.name ?? "Membro VIP", 
    email: user?.email ?? "vip@acervo.com", 
    expiringSoon: user?.expiringSoon ?? false 
  }
  
  return <AcervoUI member={member} />
}
