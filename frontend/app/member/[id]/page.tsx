"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Phone, Mail, Calendar, Weight, User, FileText, AlertTriangle, StickyNote } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock member data with full details
const getMemberById = (id: string) => {
  const members = {
    "1": {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      dob: "1990-05-15",
      age: 34,
      phone: "+1234567890",
      email: "john.doe@email.com",
      weight: "75",
      height: "180",
      address: "123 Main Street, New York, NY 10001",
      emergencyContact: "Jane Doe - +1234567899",
      joinDate: "2024-01-15",
      membershipStatus: "Active",
      purpose:
        "Improve fitness and learn self-defense techniques. Looking to build strength and confidence through martial arts training.",
      healthIssues:
        "Minor knee injury from previous sports activity. Requires modified training for high-impact exercises.",
      specialNotes:
        "Prefers evening training sessions. Very dedicated and consistent with attendance. Shows excellent progress in technique development.",
      profileImage: "/placeholder.svg?height=200&width=200",
      enrollments: [
        { category: "Kickboxing Beginners", startDate: "2024-01-15", status: "Active" },
        { category: "Strength Training", startDate: "2024-02-01", status: "Active" },
      ],
      paymentStatus: "Paid",
      lastPayment: "2024-01-01",
      nextPayment: "2024-02-01",
    },
    "2": {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      gender: "Female",
      dob: "1985-08-22",
      age: 39,
      phone: "+1234567891",
      email: "jane.smith@email.com",
      weight: "62",
      height: "165",
      address: "456 Oak Avenue, Brooklyn, NY 11201",
      emergencyContact: "Mike Smith - +1234567892",
      joinDate: "2024-02-01",
      membershipStatus: "Active",
      purpose:
        "Self-defense training and fitness improvement. Interested in building confidence and learning practical martial arts skills.",
      healthIssues: "No known health issues. Excellent physical condition.",
      specialNotes:
        "Quick learner with natural athletic ability. Prefers morning sessions. Interested in competing in the future.",
      profileImage: "/placeholder.svg?height=200&width=200",
      enrollments: [{ category: "Women's Self Defense", startDate: "2024-02-01", status: "Active" }],
      paymentStatus: "Paid",
      lastPayment: "2024-02-01",
      nextPayment: "2024-03-01",
    },
    "3": {
      id: 3,
      firstName: "Mike",
      lastName: "Johnson",
      gender: "Male",
      dob: "1992-12-10",
      age: 32,
      phone: "+1234567892",
      email: "mike.johnson@email.com",
      weight: "82",
      height: "175",
      address: "789 Pine Street, Queens, NY 11375",
      emergencyContact: "Sarah Johnson - +1234567893",
      joinDate: "2023-12-10",
      membershipStatus: "Inactive",
      purpose:
        "Advanced MMA training and competition preparation. Looking to improve grappling and striking techniques.",
      healthIssues: "Temporary break due to shoulder injury. Expected to return in 2 weeks.",
      specialNotes: "Experienced fighter with amateur competition background. Requires advanced training programs.",
      profileImage: "/placeholder.svg?height=200&width=200",
      enrollments: [{ category: "MMA Advanced", startDate: "2023-12-10", status: "Inactive" }],
      paymentStatus: "Overdue",
      lastPayment: "2023-12-10",
      nextPayment: "2024-01-10",
    },
  }

  return members[id as keyof typeof members] || null
}

export default function MemberDetailPage() {
  const params = useParams()
  const id = params.id as string
  const member = getMemberById(id)

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Member Not Found</h2>
          <p className="text-gray-400 mb-6">The member you're looking for doesn't exist.</p>
          <Link href="/members">
            <Button className="accent-button">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Members
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/members">
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Members
          </Button>
        </Link>
        <Link href={`/edit-member?id=${member.id}`}>
          <Button className="accent-button">
            <Edit className="w-4 h-4 mr-2" />
            Edit Member
          </Button>
        </Link>
      </div>

      {/* Profile Header */}
      <Card className="glass-card border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Image
                src={member.profileImage || "/placeholder.svg"}
                alt={`${member.firstName} ${member.lastName}`}
                width={200}
                height={200}
                className="rounded-lg object-cover border-2 border-white/20"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {member.firstName} {member.lastName}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant={member.membershipStatus === "Active" ? "default" : "secondary"}
                    className={
                      member.membershipStatus === "Active"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    }
                  >
                    {member.membershipStatus}
                  </Badge>
                  <Badge
                    variant={member.paymentStatus === "Paid" ? "default" : "destructive"}
                    className={
                      member.paymentStatus === "Paid"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    Payment: {member.paymentStatus}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-4 h-4" />
                  <span>
                    {member.gender}, {member.age} years old
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>Joined: {member.joinDate}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>{member.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Date of Birth</label>
              <p className="text-white">{member.dob}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Address</label>
              <p className="text-white">{member.address}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Emergency Contact</label>
              <p className="text-white">{member.emergencyContact}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Weight</label>
                <p className="text-white flex items-center gap-1">
                  <Weight className="w-4 h-4" />
                  {member.weight} kg
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Height</label>
                <p className="text-white">{member.height} cm</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment Information */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Current Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {member.enrollments.map((enrollment, index) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-white">{enrollment.category}</h4>
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
                </div>
                <p className="text-sm text-gray-400">Started: {enrollment.startDate}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Purpose and Goals */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Purpose & Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 leading-relaxed">{member.purpose}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Issues */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Health Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">{member.healthIssues}</p>
          </CardContent>
        </Card>

        {/* Special Notes */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-blue-400" />
              Special Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">{member.specialNotes}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Information */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400">Last Payment</label>
              <p className="text-white">{member.lastPayment}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Next Payment Due</label>
              <p className="text-white">{member.nextPayment}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Status</label>
              <Badge
                variant={member.paymentStatus === "Paid" ? "default" : "destructive"}
                className={
                  member.paymentStatus === "Paid"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }
              >
                {member.paymentStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
