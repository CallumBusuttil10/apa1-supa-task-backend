import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req: Request) => {
  const headers = { "Content-Type": "application/json" };

  try {
    // Handle GET request - fetch employees
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return new Response(JSON.stringify(data), { headers });
    }

    // Handle POST request - add employees
    if (req.method === "POST") {
      const { first_name, last_name, job_title, email } = await req.json();
      const { error } = await supabase.from("employees").insert([{ first_name, last_name, job_title, email }]);
      
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, message: "Employee added" }), { headers });
    }

    // New PUT method for updates
    if (req.method === "PUT") {
      const { id, first_name, last_name, job_title, email } = await req.json();
      
      if (!id) {
        return new Response(
          JSON.stringify({ error: "Employee ID is required" }), 
          { status: 400, headers }
        );
      }

      const { error } = await supabase
        .from("employees")
        .update({ first_name, last_name, job_title, email })
        .eq("id", id);

      if (error) throw error;
      return new Response(
        JSON.stringify({ success: true, message: "Employee updated" }), 
        { headers }
      );
    }

    // Handle unsupported methods
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405, 
      headers 
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500, 
      headers 
    });
  }
});