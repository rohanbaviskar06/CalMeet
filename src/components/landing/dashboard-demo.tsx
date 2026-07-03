"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  Mail, 
  MoreHorizontal, 
  Settings, 
  User, 
  Video 
} from "lucide-react";

export function DashboardDemo() {
  return (
    <section className="py-24 overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Manage everything in one place
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A powerful dashboard to track your meetings, manage your availability, and 
            configure your integrations with ease.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Main Dashboard Mockup */}
          <div className="relative rounded-[2.5rem] border bg-card shadow-2xl overflow-hidden aspect-[16/9] border-muted/50">
            {/* The User's Requested Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-background/50 pointer-events-none z-20" />
            
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-16 md:w-64 border-r bg-muted/30 p-4 flex flex-col gap-6">
                <div className="flex items-center gap-3 px-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">M</div>
                  <span className="hidden md:block font-bold">CalMeet</span>
                </div>
                
                <div className="space-y-1">
                  {[
                    { icon: Calendar, label: "Events", active: true },
                    { icon: Clock, label: "Availability" },
                    { icon: BarChart3, label: "Analytics" },
                    { icon: Video, label: "Workflows" },
                    { icon: Settings, label: "Settings" },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer ${item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
                      <item.icon className="h-5 w-5" />
                      <span className="hidden md:block font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-8 bg-card flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Event Types</h3>
                    <p className="text-sm text-muted-foreground">Manage your booking links and rules</p>
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg shadow-primary/20">
                    + Create New
                  </button>
                </div>

                {/* Grid of Event Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "15 Minute Meeting", duration: "15m", color: "bg-blue-500" },
                    { title: "Product Demo", duration: "30m", color: "bg-purple-500" },
                    { title: "Quick Sync", duration: "10m", color: "bg-emerald-500" },
                  ].map((event, i) => (
                    <div key={i} className="p-6 rounded-[2rem] border bg-background hover:border-primary/50 transition-all cursor-pointer group shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-2xl ${event.color}/10 border border-${event.color}/20 flex items-center justify-center`}>
                          <div className={`w-3 h-3 rounded-full ${event.color}`} />
                        </div>
                        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <h4 className="font-bold mb-1">{event.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{event.duration} • 1-on-1</span>
                      </div>
                      <div className="mt-6 pt-4 border-t flex items-center justify-between">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Copy Link</span>
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(u => (
                            <div key={u} className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold">U{u}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Section: Recent Activity */}
                <div className="mt-auto p-6 rounded-[2rem] bg-muted/30 border border-muted/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold">Recent Bookings</h4>
                    <span className="text-xs text-primary font-bold cursor-pointer">View All</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { user: "Alex Johnson", time: "10:00 AM Today", avatar: "AJ" },
                      { user: "Sarah Miller", time: "2:30 PM Tomorrow", avatar: "SM" },
                    ].map((booking, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">{booking.avatar}</div>
                          <div>
                            <p className="text-sm font-bold">{booking.user}</p>
                            <p className="text-[10px] text-muted-foreground">{booking.time}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="p-1.5 rounded-lg bg-background border hover:bg-muted cursor-pointer"><Video className="h-3 w-3" /></div>
                          <div className="p-1.5 rounded-lg bg-background border hover:bg-muted cursor-pointer"><Mail className="h-3 w-3" /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
