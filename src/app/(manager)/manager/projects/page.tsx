import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export default async function ManagerProjectsPage() {
  const session = await getSession();

  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          employeeId: session!.employeeId!,
        },
      },
    },
    include: {
      members: {
        include: {
          employee: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      tasks: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Projects</h1>
        <p className="text-gray-600">Manage your assigned projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{project.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Start Date:</span>
                  <span className="font-medium">{formatDate(project.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Team Members:</span>
                  <span className="font-medium">{project.members.length}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">Manage Project</Button>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <Card className="col-span-2">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No projects assigned yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}