"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"

// Mock data
const categories = [
  {
    id: 1,
    name: "Kickboxing Beginners",
    minAge: 16,
    maxAge: 65,
    minWeight: 45,
    maxWeight: 120,
  },
  {
    id: 2,
    name: "MMA Advanced",
    minAge: 18,
    maxAge: 45,
    minWeight: 60,
    maxWeight: 100,
  },
  {
    id: 3,
    name: "Youth Martial Arts",
    minAge: 8,
    maxAge: 17,
    minWeight: 25,
    maxWeight: 80,
  },
  {
    id: 4,
    name: "Women's Self Defense",
    minAge: 16,
    maxAge: 60,
    minWeight: 40,
    maxWeight: 90,
  },
]

export default function CategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    minAge: "",
    maxAge: "",
    minWeight: "",
    maxWeight: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New category:", formData)
    setIsDialogOpen(false)
    setFormData({
      name: "",
      minAge: "",
      maxAge: "",
      minWeight: "",
      maxWeight: "",
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
          <h2 className="text-2xl font-bold text-white mb-2">Training Categories</h2>
          <p className="text-gray-400">Manage different training programs and their requirements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="accent-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="e.g., Kickboxing Beginners"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minAge">Min Age</Label>
                  <Input
                    id="minAge"
                    type="number"
                    value={formData.minAge}
                    onChange={(e) => handleInputChange("minAge", e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="16"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAge">Max Age</Label>
                  <Input
                    id="maxAge"
                    type="number"
                    value={formData.maxAge}
                    onChange={(e) => handleInputChange("maxAge", e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="65"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minWeight">Min Weight (kg)</Label>
                  <Input
                    id="minWeight"
                    type="number"
                    value={formData.minWeight}
                    onChange={(e) => handleInputChange("minWeight", e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="45"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxWeight">Max Weight (kg)</Label>
                  <Input
                    id="maxWeight"
                    type="number"
                    value={formData.maxWeight}
                    onChange={(e) => handleInputChange("maxWeight", e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="120"
                    required
                  />
                </div>
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
                  Add Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Categories List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-gray-300">ID</TableHead>
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Min Age</TableHead>
                <TableHead className="text-gray-300">Max Age</TableHead>
                <TableHead className="text-gray-300">Min Weight (kg)</TableHead>
                <TableHead className="text-gray-300">Max Weight (kg)</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow
                  key={category.id}
                  className={`border-white/10 hover:bg-red-500/10 ${index % 2 === 0 ? "bg-white/5" : ""}`}
                >
                  <TableCell className="text-white">{category.id}</TableCell>
                  <TableCell className="text-white font-medium">{category.name}</TableCell>
                  <TableCell className="text-gray-300">{category.minAge}</TableCell>
                  <TableCell className="text-gray-300">{category.maxAge}</TableCell>
                  <TableCell className="text-gray-300">{category.minWeight}</TableCell>
                  <TableCell className="text-gray-300">{category.maxWeight}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-blue-500/20 bg-transparent"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20 bg-transparent"
                      >
                        <Trash2 className="w-3 h-3" />
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
