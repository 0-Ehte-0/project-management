import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/project-card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function DashboardPage() {
  // This would typically come from a database
  const projects = [
    {
      id: "1",
      name: "Website Redesign",
      description: "Redesign the company website with new branding",
      status: "In Progress",
      tasks: 12,
      completedTasks: 5,
      dueDate: "2025-05-15",
      team: [
        { id: "1", name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "2", name: "Sarah Miller", avatar: "/placeholder.svg?height=32&width=32" },
      ],
    },
    {
      id: "2",
      name: "Mobile App Development",
      description: "Create a new mobile app for customer engagement",
      status: "Planning",
      tasks: 24,
      completedTasks: 2,
      dueDate: "2025-07-30",
      team: [
        { id: "1", name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "3", name: "David Chen", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "4", name: "Emily Wong", avatar: "/placeholder.svg?height=32&width=32" },
      ],
    },
    {
      id: "3",
      name: "Marketing Campaign",
      description: "Q2 marketing campaign for product launch",
      status: "Completed",
      tasks: 18,
      completedTasks: 18,
      dueDate: "2025-04-01",
      team: [
        { id: "2", name: "Sarah Miller", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "5", name: "Michael Brown", avatar: "/placeholder.svg?height=32&width=32" },
      ],
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" text="Create and manage your projects.">
        <Link href="/projects/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </DashboardShell>
  )
}
