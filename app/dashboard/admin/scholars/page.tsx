import { prisma } from "@/lib/db"
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
import ScholarSearch from "./scholar-search"
import FeatureToggle from "./feature-toggle"
import { Suspense } from "react"

export default async function AdminScholarsPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''

  // Fetch scholars using Prisma with correct relations
  const scholars = await prisma.scholars.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { 
          users: { 
            // In Prisma with JSON fields, searching inside raw_user_meta_data can be tricky
            // We search email as a fallback
            email: { contains: query, mode: 'insensitive' }
          }
        }
      ]
    },
    include: {
      users: {
        select: {
          email: true,
          raw_user_meta_data: true
        }
      }
    },
    orderBy: {
      is_featured: 'desc'
    } // Ordered by featured first to easily see who's on homepage
  })

  // We filter by name in JS if we couldn't easily do it in Prisma JSON filter
  const filteredScholars = scholars.filter(scholar => {
    if (!query) return true;
    const meta = scholar.users?.raw_user_meta_data as any
    const name = meta?.name || ''
    return (
      (scholar.username && scholar.username.toLowerCase().includes(query.toLowerCase())) ||
      (scholar.users?.email && scholar.users.email.toLowerCase().includes(query.toLowerCase())) ||
      (name && name.toLowerCase().includes(query.toLowerCase()))
    )
  })

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Scholars</h1>
          <p className="text-muted-foreground mt-1">
            Search, edit, and feature distinguished scholars on the homepage.
          </p>
        </div>
        <Link href="/dashboard/admin/scholars/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Scholar
          </Button>
        </Link>
      </div>
      <Suspense fallback={<div className="mb-4">Loading search...</div>}>
        <ScholarSearch />
      </Suspense>
      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scholar</TableHead>
              <TableHead>Username / Email</TableHead>
              <TableHead>Role & Specialization</TableHead>
              <TableHead>Feature on Homepage</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScholars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No scholars found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredScholars.map((scholar) => {
                const meta = scholar.users?.raw_user_meta_data as any
                const name = meta?.name || scholar.users?.email?.split('@')[0] || 'Unknown'
                const initials = name.substring(0, 2).toUpperCase()

                return (
                  <TableRow key={scholar.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {initials}
                        </div>
                        <div className="font-medium">{name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {scholar.username ? (
                        <div className="text-sm font-semibold text-(--color-gsp-text-inverse)">@{scholar.username}</div>
                      ) : (
                        <div className="text-sm italic text-(--color-gsp-text-secondary)">No username</div>
                      )}
                      <div className="text-xs text-muted-foreground">{scholar.users?.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{scholar.qualification || scholar.institution || 'Scholar'}</div>
                      <div className="text-xs text-muted-foreground">{scholar.specialization || 'General Research'}</div>
                    </TableCell>
                    <TableCell>
                      <FeatureToggle scholarId={scholar.id} isFeatured={scholar.is_featured || false} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/scholars/${scholar.username || scholar.id}`}>
                        <Button variant="ghost" size="sm">View Profile</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
