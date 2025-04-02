import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import crypto from "crypto";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Foydalanuvchi rasm nomini buzmaslik uchun random ID yaratamiz
    const fileName = `${crypto.randomUUID()}-${file.name}`;

    // Cloudflare R2'ga yuklash
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read", // Faylga public ruxsat berish
      })
    );

    // To'g'ri public URL yasash
    const fileUrl = `https://pub-5e988c10ea9548079f2f0823b8675c2d.r2.dev/${fileName}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
