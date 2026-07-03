import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, ArrowRight, Video, Calendar, Share2, Globe, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UserProfilePage({ 
  params,
  searchParams
}: { 
  params: Promise<{ username: string }>,
  searchParams: Promise<{ embed?: string }>
}) {
  const { username } = await params;
  const { embed } = await searchParams;
  const isEmbed = embed === "true";

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
    <div className="min-h-screen bg-zinc-50/40 dark:bg-[#08080a] selection:bg-primary/10 overflow-x-hidden">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-25%] left-[-15%] w-[80%] h-[80%] bg-primary/3 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-blue-500/3 blur-[150px] rounded-full" />
        <div className="absolute top-[25%] right-[5%] w-[40%] h-[40%] bg-indigo-500/2 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-28 space-y-16">
        {/* Profile Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/30 to-indigo-500/30 rounded-full blur-md opacity-40 group-hover:opacity-60 transition duration-700" />
            <Avatar className="h-28 w-28 mx-auto border-[4px] border-white dark:border-zinc-950 shadow-xl relative z-10">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-3xl font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 border-4 border-white dark:border-zinc-950 rounded-full flex items-center justify-center z-20 shadow-sm" title="Active">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
            </div>
          </div>

          <div className="space-y-3.5 max-w-2xl">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-0.5 bg-zinc-100/50 dark:bg-zinc-900/30 text-[10px] font-medium uppercase tracking-wider border-zinc-200/60 dark:border-zinc-800/80 text-zinc-500 dark:text-zinc-400">
                <Globe className="h-3 w-3 mr-1" />
                Public Profile
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {user.name}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed font-normal max-w-lg mx-auto">
              {user.bio || "Select an option below to schedule a meeting or start a workflow with me."}
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Main Content Area */}
          <div className="md:col-span-7 space-y-8">
            <div id="events-section" className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-zinc-200/50 dark:border-zinc-900/50">
                <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500">Select Event Type</h2>
                <Calendar className="h-4 w-4 text-zinc-300 dark:text-zinc-700" />
              </div>
              
              <div className="grid gap-3">
                {user.eventTypes.length === 0 ? (
                  <Card className="bg-zinc-50/50 dark:bg-zinc-950/20 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <CardContent className="py-16 text-center text-zinc-400 dark:text-zinc-600 italic text-sm">
                      No direct booking links available.
                    </CardContent>
                  </Card>
                ) : (
                  user.eventTypes.map((type) => (
                    <Link key={type.id} href={`/${user.username}/${type.slug}`}>
                      <Card className="group relative transition-all duration-300 cursor-pointer bg-white dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-850 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-800 rounded-xl overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 transition-transform duration-305">
                           <ArrowRight className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                        </div>
                        <CardHeader className="p-4.5">
                          <div className="flex items-center gap-3.5">
                            <div className="w-8.5 h-8.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors duration-300">
                              <Clock className="h-4 w-4 text-zinc-450 dark:text-zinc-500" />
                            </div>
                            <div className="space-y-0.5 pr-6 flex-1">
                              <CardTitle className="text-[14.5px] font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors duration-300 leading-snug">{type.title}</CardTitle>
                              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-450 font-normal font-sans">
                                <span>{type.duration} min</span>
                                <span className="text-zinc-350 dark:text-zinc-800">•</span>
                                <span className="flex items-center gap-1"><Video className="h-3 w-3" /> Video Call</span>
                                {type.requiresPayment && type.price && (
                                  <>
                                    <span className="text-zinc-350 dark:text-zinc-800">•</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                      {type.currency === "INR" ? "₹" : "$"}
                                      {type.price}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="md:col-span-5 space-y-6">
            {/* Routing Forms Sidebar */}
            {user.routingForms.length > 0 && (
              <div className="space-y-4 bg-zinc-100/40 dark:bg-zinc-900/20 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-900/50">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Workflows</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Need something specific? Start here.</p>
                </div>
                
                <div className="grid gap-2">
                  {user.routingForms.map((form) => (
                    <Link key={form.id} href={`/${user.username}/${form.slug}`}>
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-850 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-800 transition-all cursor-pointer group">
                        <span className="text-sm font-normal text-zinc-700 dark:text-zinc-350 group-hover:text-primary transition-colors">{form.name}</span>
                        <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Card */}
            <Card className="rounded-2xl bg-zinc-900 dark:bg-zinc-950 text-white overflow-hidden border border-zinc-800 dark:border-zinc-900 shadow-lg">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-1">
                  <p className="text-[10px] font-normal uppercase tracking-wider text-zinc-450">Quality Assured</p>
                  <h4 className="text-lg font-medium tracking-tight">Trusted scheduling</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                       <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
                    </div>
                    <p className="text-sm font-normal text-zinc-300">Verified & Secure</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                       <Clock className="h-4.5 w-4.5 text-blue-450" />
                    </div>
                    <p className="text-sm font-normal text-zinc-300">Instant Sync</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Brand Footer (Hidden if watermark is disabled by admin or if embedded) */}
      {!user.hideWatermark && !isEmbed && (
        <div className="pt-16 flex flex-col items-center gap-6 text-center border-t border-zinc-200/50 dark:border-zinc-900/50 relative z-10 max-w-5xl mx-auto px-6 pb-20">
          <div className="space-y-2">
            <p className="text-[10px] font-normal text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Powered by</p>
            <div className="flex items-center gap-2">
               <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-sm font-semibold text-white dark:text-zinc-900 shadow-sm">M</div>
               <span className="text-sm font-medium tracking-tight text-zinc-900 dark:text-zinc-100">CalMeet</span>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs text-zinc-500 dark:text-zinc-400">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/support" className="hover:text-primary transition-colors">Help</Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Add these helper components if they don't exist in scope
function Badge({ className, variant = "default", children }: any) {
  const variants: any = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-zinc-200 dark:border-zinc-800 text-muted-foreground"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

function CheckCircle2({ className }: any) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
