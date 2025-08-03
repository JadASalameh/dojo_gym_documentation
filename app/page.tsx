import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Grid3X3, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const features = [
    {
      title: "Members Management",
      description:
        "Add, edit, and manage gym members with detailed profiles including health information and enrollment purposes.",
      icon: Users,
      href: "/members",
      color: "text-blue-400",
    },
    {
      title: "Training Categories",
      description:
        "Organize different training programs like Kickboxing, MMA, and other martial arts with age and weight requirements.",
      icon: Grid3X3,
      href: "/categories",
      color: "text-green-400",
    },
    {
      title: "Enrollments",
      description:
        "Track member enrollments in different categories, manage active/inactive status, and monitor progress.",
      icon: BookOpen,
      href: "/enrollments",
      color: "text-purple-400",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold text-white mb-4">Welcome to Dojo Gym Admin</h2>
        <p className="text-gray-300 text-lg mb-6">
          Manage your gym operations efficiently with our comprehensive admin dashboard. Track members, organize
          training categories, and monitor enrollments all in one place.
        </p>
        <div className="flex gap-4">
          <Link href="/members">
            <Button className="accent-button">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="glass-card border-white/10 hover:border-red-500/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </div>
              <CardDescription className="text-gray-400">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={feature.href}>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/50 bg-transparent"
                >
                  Manage {feature.title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-red-400 mb-2">156</div>
          <div className="text-gray-400">Total Members</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">8</div>
          <div className="text-gray-400">Categories</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">234</div>
          <div className="text-gray-400">Active Enrollments</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">12</div>
          <div className="text-gray-400">New This Month</div>
        </div>
      </div>
    </div>
  )
}
