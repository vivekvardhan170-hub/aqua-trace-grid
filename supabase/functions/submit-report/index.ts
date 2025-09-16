// Deno Edge Function: submit-report
// Inserts a report using the service role to bypass RLS safely
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...corsHeaders } });
  }

  try {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const payload = await req.json();

    // Minimal validation
    const required = [
      "user_id",
      "title",
      "project_name",
      "community_name",
      "activity_type",
      "area_covered",
      "location_coordinates",
      "estimated_credits",
    ];
    for (const key of required) {
      if (payload[key] === undefined || payload[key] === null || payload[key] === "") {
        return new Response(JSON.stringify({ error: `${key} is required` }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    const { data, error } = await supabase
      .from("reports")
      .insert({
        user_id: payload.user_id,
        title: payload.title,
        project_name: payload.project_name,
        community_name: payload.community_name,
        activity_type: payload.activity_type,
        area_covered: payload.area_covered,
        location_coordinates: payload.location_coordinates,
        estimated_credits: payload.estimated_credits,
        description: payload.description ?? null,
        proof_documents: payload.proof_documents ?? [],
        gps_data: payload.gps_data ?? null,
        status: payload.status ?? "Pending",
        verification_status: payload.verification_status ?? "pending",
      })
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});