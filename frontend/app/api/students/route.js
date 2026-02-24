import { getServerSession } from "next-auth";
import { handler as auth } from "../auth/[...nextauth]/route";

/**
 * GET /api/students
 * Fetch all enrolled students (admin) or current student profile
 */
export async function GET(request) {
  try {
    const session = await getServerSession(auth);
    
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    
    // This is a proxy endpoint; student data should be fetched from backend
    // For now, return placeholder or fetch from external backend if configured
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const response = await fetch(`${backendUrl}/students${url.search}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("GET /api/students error:", error);
    return Response.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/students
 * Create a new student record
 */
export async function POST(request) {
  try {
    const session = await getServerSession(auth);
    
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    const response = await fetch(`${backendUrl}/students`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("POST /api/students error:", error);
    return Response.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/students
 * Update student record
 */
export async function PUT(request) {
  try {
    const session = await getServerSession(auth);
    
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    const response = await fetch(`${backendUrl}/students`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("PUT /api/students error:", error);
    return Response.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/students?id=<id>
 * Delete a student
 */
export async function DELETE(request) {
  try {
    const session = await getServerSession(auth);
    
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    const response = await fetch(`${backendUrl}/students${url.search}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("DELETE /api/students error:", error);
    return Response.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
