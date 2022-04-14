import { useRouter } from "next/router"

export default function SiteIndexPage() {
  const router = useRouter()
  const domain = router.query.domain

  return <div>hi {domain}</div>
}
