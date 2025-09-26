import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL;
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const userId = new URL(request.url).searchParams.get("userId");
    if (!userId) throw new Error("userId required");
    
    const response = await fetch(`${baseUrl}/users/${userId}`, {
      headers: token ? { Authorization: `Token ${token}` } : {},
    });
    
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    
    return NextResponse.json(await response.json(), { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const userId = new URL(request.url).searchParams.get("userId");
    if (!userId) throw new Error("userId required");
    
    const contentType = request.headers.get("content-type") || "";
    const bodyData = contentType.includes("multipart/form-data") 
      ? await request.formData() 
      : await request.json();
    
    const response = await fetch(`${baseUrl}/users/${userId}/`, {
      method: "PATCH",
      headers: {
        ...(token ? { Authorization: `Token ${token}` } : {}),
        ...(contentType.includes("multipart/form-data") ? {} : { "Content-Type": contentType }),
      },
      body: bodyData instanceof FormData ? bodyData : JSON.stringify(bodyData),
    });
    
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    
    return NextResponse.json(await response.json(), { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
