"use client"

import Link from "next/link"
import { CalendarIcon, CheckCircle2, Circle, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

interface Project {
  id: string
  name: string
  description: string
  status: string
  tasks: number
  completedTasks: number
  dueDate: string
  team: {
    id: string
    name: string
    avatar: string
  }[]
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = Math.round((project.completedTasks / project.tasks) * 100)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription className="mt-1">{project.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={`/projects/${project.id}`} className="w-full">
                  View Project
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Edit Project</DropdownMenuItem>
              <DropdownMenuItem>Archive Project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <CalendarIcon className="h-4 w-4" />
          <span>Due {format(new Date(project.dueDate), "MMM d, yyyy")}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Tasks:</span>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
              <span>{project.completedTasks}</span>
            </div>
            <div className="flex items-center">
              <Circle className="h-4 w-4 text-muted-foreground mr-1" />
              <span>{project.tasks - project.completedTasks}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div className="flex -space-x-2">
            {project.team.map((member) => (
              <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
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
      </CardFooter>
    </Card>
  )
}
