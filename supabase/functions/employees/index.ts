import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req: Request) => {
  const headers = { "Content-Type": "application/json" };

  try {
    // Handle GET request for single employee
    if (req.method === "GET") {
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      const employeeId = pathParts[pathParts.length - 1];

      // If employeeId exists in the path, fetch single employee
      if (employeeId && employeeId !== "employees") {
        const { data, error } = await supabase
          .from("employees")
          .select(`
            *,
            teams:team_id (
              id,
              team_name
            )
          `)
          .eq("id", employeeId)
          .single();

        if (error) throw error;
        if (!data) {
          return new Response(
            JSON.stringify({ error: "Employee not found" }),
            { status: 404, headers }
          );
        }

        const formattedData = {
          ...data,
          team_name: data.teams ? data.teams.team_name : null,
        };
        delete formattedData.teams;

        return new Response(JSON.stringify(formattedData), { headers });
      }

      const { data, error } = await supabase
        .from("employees")
        .select(`
          *,
          teams:team_id (
            id,
            team_name
          )
        `)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Transform all employee records
      const formattedData = data.map(employee => {
        const formattedEmployee = {
          ...employee,
          team_name: employee.teams ? employee.teams.team_name : null
        };
        delete formattedEmployee.teams;
        return formattedEmployee;
      });

      return new Response(JSON.stringify(formattedData), { headers });
    }

    // Handle POST request - add employees
    if (req.method === "POST") {
      const { first_name, last_name, job_title, email, team_id } = await req.json();
      const { error } = await supabase.from("employees").insert([{ first_name, last_name, job_title, email, team_id }]);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, message: "Employee added" }), { headers });
    }

    // New PUT method for updates
    if (req.method === "PUT") {
      const { id, first_name, last_name, job_title, email, team_id } = await req.json();

      if (!id) {
        return new Response(
          JSON.stringify({ error: "Employee ID is required" }), 
          { status: 400, headers }
        );
      }

      const { error } = await supabase
        .from("employees")
        .update({ first_name, last_name, job_title, email, team_id })
        .eq("id", id);

      if (error) throw error;
      return new Response(
        JSON.stringify({ success: true, message: "Employee updated" }), 
        { headers }
      );
    }
    // Handle DELETE request
    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      const employeeId = pathParts[pathParts.length - 1];

      if (!employeeId || employeeId === "employees") {
        return new Response(
          JSON.stringify({ error: "Employee ID is required" }),
          { status: 400, headers }
        );
      }

      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", employeeId);

      if (error) throw error;
      return new Response(
        JSON.stringify({ success: true, message: "Employee deleted" }),
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
  }});