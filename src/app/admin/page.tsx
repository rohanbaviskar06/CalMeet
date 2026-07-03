"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getAdminStats, updateUserPlan, deleteUser, toggleUserWatermark } from "@/app/actions/admin";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Search, 
  MoreHorizontal,
  Loader2,
  LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated" && session?.user?.email !== "rbgaming116@gmail.com") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchStats() {
      if (status !== "authenticated" || session?.user?.email !== "rbgaming116@gmail.com") return;
      
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [status, session]);

  const filteredUsers = stats?.recentUsers.filter((user: any) => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (status === "loading" || loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session?.user?.email !== "rbgaming116@gmail.com") {
    return null;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, bookings, and platform analytics.</p>
        </div>
        <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <Button>Platform Settings</Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Real-time database count</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total platform engagement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Types</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEventTypes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active scheduling types</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>A list of the most recently registered users.</CardDescription>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-9" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Watermark</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name || "Unnamed User"}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.plan === "ENTERPRISE" ? "default" : "secondary"}>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={user.hideWatermark ? "border-amber-500 text-amber-500 bg-amber-500/5" : "border-green-500 text-green-500 bg-green-500/5"}>
                        {user.hideWatermark ? "Hidden" : "Visible"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joined}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end" className="w-[180px]">
                          {user.plan === "PRO" ? (
                            <DropdownMenuItem 
                              onClick={async () => {
                                try {
                                  await updateUserPlan(user.id, "FREE");
                                  toast.success(`${user.name || 'User'} demoted to FREE plan.`);
                                  const data = await getAdminStats();
                                  setStats(data);
                                } catch {
                                  toast.error("Failed to update user plan.");
                                }
                              }}
                            >
                              Demote to FREE
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              className="font-medium text-blue-600 dark:text-blue-400"
                              onClick={async () => {
                                try {
                                  await updateUserPlan(user.id, "PRO");
                                  toast.success(`${user.name || 'User'} upgraded to PRO plan.`);
                                  const data = await getAdminStats();
                                  setStats(data);
                                } catch {
                                  toast.error("Failed to update user plan.");
                                }
                              }}
                            >
                              Upgrade to PRO
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={async () => {
                              try {
                                await toggleUserWatermark(user.id, !user.hideWatermark);
                                toast.success(`Watermark visibility updated.`);
                                const data = await getAdminStats();
                                setStats(data);
                              } catch {
                                toast.error("Failed to toggle watermark.");
                                }
                            }}
                          >
                            {user.hideWatermark ? "Show Watermark" : "Hide Watermark"}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-500/10"
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete ${user.name || 'this user'}?`)) {
                                try {
                                  await deleteUser(user.id);
                                  toast.success("User deleted successfully.");
                                  const data = await getAdminStats();
                                  setStats(data);
                                } catch {
                                  toast.error("Failed to delete user.");
                                }
                              }
                            }}
                          >
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
