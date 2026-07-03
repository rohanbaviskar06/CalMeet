import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

console.log("notify-booking function started!")

serve(async (req) => {
  try {
    // 1. Parse the incoming request (Webhook payload from Supabase database event)
    const payload = await req.json()
    const { record, type, table } = payload

    console.log(`Received ${type} event on table ${table}:`, record)

    if (type === "INSERT") {
      const guestName = record.guestName || "A client"
      const guestEmail = record.guestEmail || "No email"
      const startTime = record.startTime ? new Date(record.startTime).toLocaleString() : "TBD"

      console.log(`[ALERT] New booking! Guest: ${guestName} (${guestEmail}) has scheduled a meeting for ${startTime}.`)
      
      // Here you can integrate custom actions like:
      // - Send email notifications (Resend, SendGrid)
      // - Send Slack/Discord channel alerts
      // - Ping internal CRM API endpoint
    }

    return new Response(
      JSON.stringify({ success: true, message: "Webhook processed successfully!" }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    )
  } catch (error: any) {
    console.error("Error processing booking webhook:", error.message || error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      }
    )
  }
})
