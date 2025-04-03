import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    const response = await fetch("https://elt-server.uz/upload", {
      method: "POST",
      body: uploadFormData,
    });

    if (!response.ok)
      throw new Error("Failed to upload file to external API");

    const result = await response.json();

    return NextResponse.json({ success: true, url: `https://elt-server.uz${result.url}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
