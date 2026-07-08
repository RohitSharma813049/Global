import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AdminScholarsLoading() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-pulse">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="h-9 w-48 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-5 w-72 bg-gray-200 rounded-md mt-1"></div>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" /> Add Scholar
        </Button>
      </div>
      
      {/* Search Bar Skeleton */}
      <div className="mb-4">
        <div className="h-10 w-full max-w-sm bg-gray-200 rounded-md"></div>
      </div>
      
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
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 w-32 bg-gray-100 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 w-40 bg-gray-100 rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 w-10 bg-gray-200 rounded-full"></div>
                </TableCell>
                <TableCell className="text-right">
                   <div className="h-8 w-20 bg-gray-200 rounded inline-block"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
