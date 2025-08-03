"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Filter, Eye } from "lucide-react"
import Link from "next/link"
import Users from "@/components/ui/users" // Import the Users component

// Mock data
const members = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    gender: "Male",
    dob: "1990-05-15",
    phone: "+1234567890",
    email: "john.doe@email.com",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    gender: "Female",
    dob: "1985-08-22",
    phone: "+1234567891",
    email: "jane.smith@email.com",
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Johnson",
    gender: "Male",
    dob: "1992-12-10",
    phone: "+1234567892",
    email: "mike.johnson@email.com",
  },
]

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = members.filter((member) =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-white/10 hover:border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="font-semibold text-white">View All</h3>
                <p className="text-sm text-gray-400">Browse all members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 hover:border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Search className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="font-semibold text-white">Search</h3>
                <p className="text-sm text-gray-400">Find by name</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 hover:border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Filter className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="font-semibold text-white">Filter</h3>
                <p className="text-sm text-gray-400">By start date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Link href="/add-member">
          <Card className="glass-card border-white/10 hover:border-red-500/30 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Plus className="w-8 h-8 text-red-400" />
                <div>
                  <h3 className="font-semibold text-white">Add Members</h3>
                  <p className="text-sm text-gray-400">New member</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search members by full name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Members Table */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Members List</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No members found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first member"}
              </p>
              <Link href="/add-member">
                <Button className="accent-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Member
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">Full Name</TableHead>
                  <TableHead className="text-gray-300">Gender</TableHead>
                  <TableHead className="text-gray-300">Date of Birth</TableHead>
                  <TableHead className="text-gray-300">Phone</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member, index) => (
                  <TableRow
                    key={member.id}
                    className={`border-white/10 hover:bg-red-500/10 cursor-pointer transition-colors ${index % 2 === 0 ? "bg-white/5" : ""}`}
                    onClick={() => (window.location.href = `/member/${member.id}`)}
                  >
                    <TableCell className="text-white">{member.id}</TableCell>
                    <TableCell className="text-white font-medium">
                      {member.firstName} {member.lastName}
                    </TableCell>
                    <TableCell className="text-gray-300">{member.gender}</TableCell>
                    <TableCell className="text-gray-300">{member.dob}</TableCell>
                    <TableCell className="text-gray-300">{member.phone}</TableCell>
                    <TableCell className="text-gray-300">{member.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Note */}
      <p className="text-sm text-gray-400 mt-4 text-center">
        Click on any member row to view their full profile and details
      </p>
    </div>
  )
}
