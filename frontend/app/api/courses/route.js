import { getServerSession } from "next-auth";
import { handler as auth } from "../auth/[...nextauth]/route";

/**
 * GET /api/courses
 * Fetch all courses
 */
export async function GET(request) {
  try {
    const session = await getServerSession(auth);
    
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    const response = await fetch(`${backendUrl}/courses${url.search}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("GET /api/courses error:", error);
    return Response.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses
 * Create a new course (admin only)
 */
export async function POST(request) {
  try {
    const session = await getServerSession(auth);
    
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    const response = await fetch(`${backendUrl}/courses`, {
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
    console.error("POST /api/courses error:", error);
    return Response.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/courses
 * Update course
 */
export async function PUT(request) {
  try {
    const session = await getServerSession(auth);
    
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    const response = await fetch(`${backendUrl}/courses`, {
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
    console.error("PUT /api/courses error:", error);
    return Response.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/courses?id=<id>
 * Delete a course (admin only)
 */
export async function DELETE(request) {
  try {
    const session = await getServerSession(auth);
    
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    const response = await fetch(`${backendUrl}/courses${url.search}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("DELETE /api/courses error:", error);
    return Response.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
