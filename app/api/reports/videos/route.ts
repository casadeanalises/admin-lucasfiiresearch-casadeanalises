import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import connectDB from "@/app/lib/mongodb";
import ReportVideo from "@/app/models/ReportVideo";
import { checkAdminAuth, unauthorized } from "@/lib/auth-admin";

export async function GET() {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    await connectDB();
    const mongoDbVideos = await ReportVideo.find({}).lean();
    
    const formattedVideos = mongoDbVideos.map(video => {
      const videoObject = { ...video };
      
      if (video._id) {
        videoObject.id = video._id.toString();
      }
      
      return videoObject;
    });

    console.log(`${formattedVideos.length} vídeos encontrados`);
    return NextResponse.json(formattedVideos);
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return NextResponse.json({ error: "Erro ao buscar vídeos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    const data = await request.json();
    
    await connectDB();
    const newVideo = new ReportVideo({
      title: data.title,
      description: data.description,
      author: data.author,
      date: data.date,
      time: data.time,
      code: data.code,
      thumbnail: data.thumbnail || "",
      premium: data.premium || false,
      tags: Array.isArray(data.tags) ? data.tags : [],
      month: data.month,
      year: data.year,
      url: data.url,
      videoId: data.videoId
    });
    
    await newVideo.save();
    
    const response = {
      ...newVideo.toObject(),
      id: newVideo._id.toString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao criar vídeo:", error);
    return NextResponse.json({ error: "Erro ao criar vídeo" }, { status: 500 });
  }
}