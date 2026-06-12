import { supabase } from "@/lib/superbaseconfig"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function AdminScholarsPage() {
  // Fetch all scholars. We use the default client since RLS allows SELECT.
  // In a real production app, we would use server-side auth here, but 
  // the page is protected by dashboard layout / next-auth middleware.
  const { data: scholars, error } = await supabase
    .from("scholars")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Scholars</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage distinguished scholars.
          </p>
        </div>
        <Link href="/dashboard/admin/scholars/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Scholar
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scholar</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Badges</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-500 py-8">
                  Failed to load scholars: {error.message}
                </TableCell>
              </TableRow>
            ) : scholars?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No scholars found. Click "Add Scholar" to create one.
                </TableCell>
              </TableRow>
            ) : (
              scholars?.map((scholar) => (
                <TableRow key={scholar.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {scholar.initials}
                      </div>
                      <div className="font-medium">{scholar.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{scholar.professional_role}</div>
                    <div className="text-xs text-muted-foreground">{scholar.domain}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{scholar.flag_emoji} {scholar.country_code}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {scholar.is_honorary && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Honorary</span>}
                      {scholar.is_verified && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Verified</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/scholars/${scholar.id}`}>
                      <Button variant="ghost" size="sm">View Profile</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
