// src/app/api/upload/route.ts
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Convertir a base64 para Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        // Subir el video a Cloudinary
        const upload = await cloudinary.uploader.upload(base64, {
            folder: "lyfted/ejercicios",
            resource_type: "video",
        });

        return NextResponse.json({ url: upload.secure_url });
    } catch (error) {
        console.error("Error al subir archivo:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
