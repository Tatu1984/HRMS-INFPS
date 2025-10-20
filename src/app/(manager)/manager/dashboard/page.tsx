import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FolderKanban, Calendar, CheckSquare } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function ManagerDashboard() {
  const session = await getSession();
  const employee = db.getEmployeeById(session!.employeeId);
  const projects = db.getProjects().filter(p => p.managerId === session!.employeeId);
  const allEmployees = db.getEmployees();
  const teamMembers = allEmployees.filter(e => e.reportingHeadId === session!.employeeId);
  const leaves = db.getLeaves().filter(l => 
    teamMembers.some(tm => tm.id === l.employeeId) && l.status === 'PENDING'
  );

  return (
    <div className="p-6 space-y-6">
      {/* Personal Stats */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Your Details</h3>
              <p className="text-sm text-purple-100">{employee?.designation}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-100">Monthly Salary</p>
              <p className="text-3xl font-bold">{formatCurrency(employee?.salary || 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Stats */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Team Members</p>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FolderKanban className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Leaves</p>
                <p className="text-2xl font-bold">{leaves.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CheckSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tasks Assigned</p>
                <p className="text-2xl font-bold">
                  {db.getTasks().filter(t => teamMembers.some(tm => tm.id === t.assignedTo)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-gray-500">No projects assigned yet.</p>
            ) : (
              projects.map(project => (
                <div key={project.id} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                    <Badge>{project.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Your Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Designation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teamMembers.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{member.name}</td>
                    <td className="px-4 py-3 text-sm">{member.designation}</td>
                    <td className="px-4 py-3 text-sm">{member.department}</td>
                    <td className="px-4 py-3 text-sm">{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}