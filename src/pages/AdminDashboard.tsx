import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/Alert';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  PlusCircle,
  BookOpen,
  Users,
  Settings,
  BarChart,
  AlertCircle,
  DollarSign,
  MessageSquare,
  Shield,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  totalRevenue: number;
  pendingSupport: number;
  systemHealth: 'good' | 'warning' | 'error';
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure only admin access
  if (user?.role !== 'admin') {
    return <navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to load dashboard stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user.name}
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button onClick={() => navigate('/admin/courses/new')}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Course
              </Button>
            </div>
          </div>

          {error && <Alert type="error" message={error} className="mb-8" />}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-info" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats?.totalUsers}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <BookOpen className="h-8 w-8 text-info" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                  <p className="text-2xl font-bold">{stats?.totalCourses}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <DollarSign className="h-8 w-8 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${stats?.totalRevenue}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Activity className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <p className="text-2xl font-bold capitalize">{stats?.systemHealth}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <BookOpen className="h-8 w-8 text-info mb-4" />
              <h3 className="text-xl font-bold mb-2">Course Management</h3>
              <p className="text-muted-foreground mb-4">
                Create and manage courses, modules, and content
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/courses')}
                >
                  View All Courses
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/courses/new')}
                >
                  Create New Course
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/courses/analytics')}
                >
                  Course Analytics
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <Users className="h-8 w-8 text-info mb-4" />
              <h3 className="text-xl font-bold mb-2">User Management</h3>
              <p className="text-muted-foreground mb-4">
                Manage user accounts, roles, and permissions
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/users')}
                >
                  View All Users
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/users/roles')}
                >
                  Manage Roles
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/users/permissions')}
                >
                  User Permissions
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <Shield className="h-8 w-8 text-info mb-4" />
              <h3 className="text-xl font-bold mb-2">Security & Compliance</h3>
              <p className="text-muted-foreground mb-4">
                Monitor security and ensure compliance
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/security/logs')}
                >
                  Security Logs
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/security/audit')}
                >
                  Audit Trail
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/security/compliance')}
                >
                  Compliance Reports
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <MessageSquare className="h-8 w-8 text-info mb-4" />
              <h3 className="text-xl font-bold mb-2">Support Management</h3>
              <p className="text-muted-foreground mb-4">
                Handle user support and inquiries
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/support/tickets')}
                >
                  Support Tickets
                  {stats?.pendingSupport > 0 && (
                    <span className="ml-2 bg-error text-error-foreground px-2 py-1 rounded-full text-xs">
                      {stats.pendingSupport}
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/support/feedback')}
                >
                  User Feedback
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/support/faq')}
                >
                  Manage FAQ
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <BarChart className="h-8 w-8 text-info mb-4" />
              <h3 className="text-xl font-bold mb-2">Analytics & Reports</h3>
              <p className="text-muted-foreground mb-4">
                View detailed analytics and generate reports
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/analytics/overview')}
                >
                  Analytics Overview
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/analytics/revenue')}
                >
                  Revenue Reports
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/analytics/engagement')}
                >
                  User Engagement
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <AlertCircle className="h-8 w-8 text-info mb-4" />
              <h3 className="text-xl font-bold mb-2">System Health</h3>
              <p className="text-muted-foreground mb-4">
                Monitor system performance and health
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/system/status')}
                >
                  System Status
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/system/logs')}
                >
                  System Logs
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/system/maintenance')}
                >
                  Maintenance
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}