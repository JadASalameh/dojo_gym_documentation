"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye } from "lucide-react"

// Mock data
const enrollments = [
  {
    id: 1,
    member: "John Doe",
    category: "Kickboxing Beginners",
    startDate: "2024-01-15",
    status: "Active",
    notes: "Regular attendance, good progress",
  },
  {
    id: 2,
    member: "Jane Smith",
    category: "Women's Self Defense",
    startDate: "2024-02-01",
    status: "Active",
    notes: "Excellent technique development",
  },
  {
    id: 3,
    member: "Mike Johnson",
    category: "MMA Advanced",
    startDate: "2023-12-10",
    status: "Inactive",
    notes: "Temporary break due to injury",
  },
]

const members = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"]
const categories = ["Kickboxing Beginners", "MMA Advanced", "Youth Martial Arts", "Women's Self Defense"]

export default function EnrollmentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    member: "",
    category: "",
    startDate: "",
    status: "Active",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New enrollment:", formData)
    setIsDialogOpen(false)
    setFormData({
      member: "",
      category: "",
      startDate: "",
      status: "Active",
      notes: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Enrollments</h2>
          <p className="text-gray-400">Track member enrollments in different training categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="accent-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Enrollment
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Add New Enrollment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="member">Member</Label>
                <Select value={formData.member} onValueChange={(value) => handleInputChange("member", value)}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    {members.map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Additional notes about the enrollment..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button type="submit" className="accent-button">
                  Add Enrollment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enrollments Table */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Enrollments List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-gray-300">Enrollment ID</TableHead>
                <TableHead className="text-gray-300">Member</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300">Start Date</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Notes</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment, index) => (
                <TableRow
                  key={enrollment.id}
                  className={`border-white/10 hover:bg-red-500/10 ${index % 2 === 0 ? "bg-white/5" : ""}`}
                >
                  <TableCell className="text-white">{enrollment.id}</TableCell>
                  <TableCell className="text-white font-medium">{enrollment.member}</TableCell>
                  <TableCell className="text-gray-300">{enrollment.category}</TableCell>
                  <TableCell className="text-gray-300">{enrollment.startDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={enrollment.status === "Active" ? "default" : "secondary"}
                      className={
                        enrollment.status === "Active"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      }
                    >
                      {enrollment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300 max-w-xs truncate">{enrollment.notes}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-blue-500/20 bg-transparent"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-green-500/20 bg-transparent"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
