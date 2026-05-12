"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Globe, 
  Lock, 
  MousePointer2, 
  Zap 
} from "lucide-react";

const features = [
  {
    title: "Instant Booking",
    description: "Share your link and let others book a time that works for both of you.",
    icon: Calendar,
  },
  {
    title: "Timezone Smart",
    description: "Automatically detects and converts timezones for all participants.",
    icon: Globe,
  },
  {
    title: "Workflow Automation",
    description: "Connect with Zoom, Google Meet, or Slack to automate your meetings.",
    icon: Zap,
  },
  {
    title: "Availability Rules",
    description: "Set complex availability rules and buffer times between meetings.",
    icon: Clock,
  },
  {
    title: "Custom Branding",
    description: "Make the booking page yours with custom colors, logos, and domains.",
    icon: MousePointer2,
  },
  {
    title: "Secure & Private",
    description: "Enterprise-grade security to keep your calendar data safe.",
    icon: Lock,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything you need to schedule better</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help you manage your time and connect with your team more effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
