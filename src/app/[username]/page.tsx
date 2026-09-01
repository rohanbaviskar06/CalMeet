import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Clock, ArrowRight, Video, GitMerge } from "lucide-react";

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

  const decodedUsername = decodeURIComponent(username).trim();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: { equals: decodedUsername, mode: "insensitive" } },
        { email: { equals: `${decodedUsername}@gmail.com`, mode: "insensitive" } },
        { email: { startsWith: `${decodedUsername}@`, mode: "insensitive" } },
        { id: decodedUsername },
      ],
    },
    include: {
      eventTypes: {
        where: { isActive: true },
        orderBy: { duration: "asc" }
      },
      routingForms: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    notFound();
  }

  const effectiveUsername = user.username || decodedUsername;

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-[#0c0c0e] py-12 px-4 selection:bg-primary/10">
      <main className="max-w-2xl mx-auto space-y-6">
        {/* Cal.com Style Profile Header Card */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-7 shadow-2xs">
          <div className="flex flex-col items-start">
            <Avatar className="h-16 w-16 rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-2xs">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback className="text-xl font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <h1 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-4 tracking-tight">
              {user.name || effectiveUsername}
            </h1>

            {user.bio ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed break-words whitespace-pre-wrap">
                {user.bio}
              </p>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Welcome to my scheduling page. Please select a time to book a meeting.
              </p>
            )}
          </div>
        </div>

        {/* Event Types List (Cal.com Unified Bordered Box) */}
        {user.eventTypes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 p-12 text-center">
            <Clock className="h-8 w-8 text-zinc-400 mx-auto mb-2 opacity-60" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No event types available</h3>
            <p className="text-xs text-zinc-500 mt-1">There are currently no active public booking links.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 divide-y divide-zinc-200/80 dark:divide-zinc-800 overflow-hidden shadow-2xs">
            {user.eventTypes.map((type) => (
              <Link 
                key={type.id} 
                href={`/${effectiveUsername}/${type.slug}`}
                className="group relative flex items-center justify-between p-5 sm:p-5.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <div className="space-y-2 min-w-0 pr-4 flex-1">
                  <h2 className="text-sm sm:text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                    {type.title}
                  </h2>

                  {type.description && (
                    <div 
                      className="text-xs text-zinc-500 line-clamp-1 prose prose-xs dark:prose-invert [&_*]:inline [&_*]:m-0"
                      dangerouslySetInnerHTML={{ __html: type.description }}
                    />
                  )}

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-medium inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 py-1 px-2 rounded-md text-xs leading-none border border-zinc-200/60 dark:border-zinc-800">
                      <Clock className="h-3 w-3 text-zinc-500" />
                      {type.duration}m
                    </span>

                    <span className="font-medium inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 py-1 px-2 rounded-md text-xs leading-none border border-zinc-200/60 dark:border-zinc-800">
                      <Video className="h-3 w-3 text-zinc-500" />
                      Video Call
                    </span>

                    {type.requiresPayment && type.price && (
                      <span className="font-semibold inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-1 px-2 rounded-md text-xs leading-none border border-emerald-500/20">
                        {type.currency === "INR" ? "₹" : "$"}{type.price}
                      </span>
                    )}
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        )}

        {/* Routing Forms (if any) */}
        {user.routingForms.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-1">
              Routing & Screening
            </h3>
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 divide-y divide-zinc-200/80 dark:divide-zinc-800 overflow-hidden shadow-2xs">
              {user.routingForms.map((form) => (
                <Link 
                  key={form.id} 
                  href={`/${effectiveUsername}/${form.slug}`}
                  className="group relative flex items-center justify-between p-4 sm:p-4.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-800">
                      <GitMerge className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors block">
                        {form.name}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Answer qualification questions to find the best meeting slot
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Clean Powered By Footer */}
        {!(user.hideWatermark && user.plan !== "FREE") && !isEmbed && (
          <div className="pt-8 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <span>Powered by</span>
              <div className="flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
                <div className="w-4.5 h-4.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">
                  M
                </div>
                <span>CalMeet</span>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
