import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, ArrowRight, Video } from "lucide-react";

export default async function UserProfilePage({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      eventTypes: {
        where: { isActive: true },
        orderBy: { duration: 'asc' }
      },
      routingForms: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] selection:bg-primary/10">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-16 md:py-24 space-y-12">
        {/* Profile Header */}
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110" />
            <Avatar className="h-28 w-28 mx-auto border-4 border-background shadow-2xl relative">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-3xl font-black bg-muted text-primary">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
              {user.bio || "Welcome to my professional scheduling page. Select an option below to get started."}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-10">
          {/* Routing Forms (High Priority) */}
          {user.routingForms.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Screening & Intake</h2>
              <div className="grid gap-3">
                {user.routingForms.map((form) => (
                  <Link key={form.id} href={`/${user.username}/${form.slug}`}>
                    <Card className="group hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer bg-card/50 backdrop-blur-sm border-muted shadow-sm hover:shadow-xl overflow-hidden rounded-2xl">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <ArrowRight className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{form.name}</CardTitle>
                            <CardDescription className="text-sm">Pre-qualify before booking</CardDescription>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                           <ArrowRight className="h-5 w-5 text-primary" />
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Event Types */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Direct Booking</h2>
            <div className="grid gap-3">
              {user.eventTypes.length === 0 && user.routingForms.length === 0 ? (
                <Card className="bg-background/50 border-dashed rounded-2xl">
                  <CardContent className="py-16 text-center text-muted-foreground italic">
                    No active scheduling links available at the moment.
                  </CardContent>
                </Card>
              ) : (
                user.eventTypes.map((type) => (
                  <Link key={type.id} href={`/${user.username}/${type.slug}`}>
                    <Card className="group hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer bg-card/50 backdrop-blur-sm border-muted shadow-sm hover:shadow-xl overflow-hidden rounded-2xl">
                      <CardHeader className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors leading-none">{type.title}</CardTitle>
                            <div className="flex items-center gap-3 mt-3">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                                <Clock className="h-3.5 w-3.5" />
                                {type.duration} MIN
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full">
                                <Video className="h-3.5 w-3.5" />
                                VIDEO CALL
                              </div>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                             <ArrowRight className="h-5 w-5" />
                          </div>
                        </div>
                        {type.description && (
                          <div className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {type.description}
                          </div>
                        )}
                      </CardHeader>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-12 border-t border-muted/50 flex flex-col items-center gap-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Powered by</p>
          <div className="flex items-center gap-2 group cursor-default">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xl font-black text-primary-foreground shadow-lg group-hover:scale-110 transition-transform">M</div>
             <span className="text-2xl font-black tracking-tighter">MeetMe</span>
          </div>
          <div className="flex gap-4">
             <div className="w-1 h-1 rounded-full bg-muted" />
             <div className="w-1 h-1 rounded-full bg-muted" />
             <div className="w-1 h-1 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
