import Link from "next/link"
import { ArrowLeft, CalendarIcon, CheckCircle2, Circle, PlusCircle } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function ProjectPage({ params }: { params: { id: string } }) {
  // This would typically come from a database lookup using params.id
  const project = {
    id: "1",
    name: "Website Redesign",
    description: "Redesign the company website with new branding",
    status: "In Progress",
    tasks: 12,
    completedTasks: 5,
    dueDate: "2025-05-15",
    team: [
      { id: "1", name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32", role: "Project Manager" },
      { id: "2", name: "Sarah Miller", avatar: "/placeholder.svg?height=32&width=32", role: "Designer" },
    ],
    tasks: [
      { id: "1", title: "Create wireframes", status: "completed", assignee: "Sarah Miller" },
      { id: "2", title: "Design homepage", status: "completed", assignee: "Sarah Miller" },
      { id: "3", title: "Design about page", status: "completed", assignee: "Sarah Miller" },
      { id: "4", title: "Design product pages", status: "in-progress", assignee: "Sarah Miller" },
      { id: "5", title: "Frontend development setup", status: "completed", assignee: "Alex Johnson" },
      { id: "6", title: "Implement homepage", status: "completed", assignee: "Alex Johnson" },
      { id: "7", title: "Implement about page", status: "in-progress", assignee: "Alex Johnson" },
      { id: "8", title: "Implement product pages", status: "not-started", assignee: "Alex Johnson" },
      { id: "9", title: "Backend API integration", status: "not-started", assignee: "Alex Johnson" },
      { id: "10", title: "Testing", status: "not-started", assignee: "Team" },
      { id: "11", title: "Content migration", status: "not-started", assignee: "Team" },
      { id: "12", title: "Launch", status: "not-started", assignee: "Team" },
    ],
  }

  const progress = Math.round((project.completedTasks / project.tasks.length) * 100)

  return (
    <DashboardShell>
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <DashboardHeader heading={project.name} text={project.description}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </DashboardHeader>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Manage your project tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="space-y-4">
                  {project.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : task.status === "in-progress" ? (
                          <Circle className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                        <div>
                          <p
                            className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                          >
                            {task.title}
                          </p>
                          <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                        </div>
                      </div>
                      <div
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : task.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.status === "completed"
                          ? "Completed"
                          : task.status === "in-progress"
                            ? "In Progress"
                            : "Not Started"}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="in-progress">
                <div className="space-y-4">
                  {project.tasks
                    .filter((t) => t.status === "in-progress")
                    .map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Circle className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                          </div>
                        </div>
                        <div className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          In Progress
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="completed">
                <div className="space-y-4">
                  {project.tasks
                    .filter((t) => t.status === "completed")
                    .map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium line-through text-muted-foreground">{task.title}</p>
                            <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                          </div>
                        </div>
                        <div className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                          Completed
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Due May 15, 2025</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                    <span>{project.completedTasks} completed</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="h-4 w-4 text-muted-foreground mr-1" />
                    <span>{project.tasks.length - project.completedTasks} remaining</span>
                  </div>
                </div>

                <div
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full inline-block ${
                    project.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : project.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {project.status}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.team.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
