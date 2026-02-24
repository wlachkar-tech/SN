import { getServerSession } from "next-auth";
import { handler as auth } from "../auth/[...nextauth]/route";

/**
 * GET /api/enrollments
 * Fetch enrollments
 */
export async function GET(request) {
  try {
    const session = await getServerSession(auth);
    
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    const response = await fetch(`${backendUrl}/enrollments${url.search}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("GET /api/enrollments error:", error);
    return Response.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/enrollments
 * Enroll student in a course
 */
export async function POST(request) {
  try {
    const session = await getServerSession(auth);
    
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    const response = await fetch(`${backendUrl}/enrollments`, {
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
    console.error("POST /api/enrollments error:", error);
    return Response.json(
      { error: "Failed to create enrollment" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/enrollments
 * Update enrollment (e.g., grade)
 */
export async function PUT(request) {
  try {
    const session = await getServerSession(auth);
    
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    const response = await fetch(`${backendUrl}/enrollments`, {
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
    console.error("PUT /api/enrollments error:", error);
    return Response.json(
      { error: "Failed to update enrollment" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/enrollments?id=<id>
 * Unenroll student from a course
 */
export async function DELETE(request) {
  try {
    const session = await getServerSession(auth);
    
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    const response = await fetch(`${backendUrl}/enrollments${url.search}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("DELETE /api/enrollments error:", error);
    return Response.json(
      { error: "Failed to delete enrollment" },
      { status: 500 }
    );
  }
}
