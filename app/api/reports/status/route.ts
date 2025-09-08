import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/app/lib/mongodb";
import mongoose from "mongoose";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const results: any = {
    mongodb: { status: "unknown", error: null, collections: [], models: [], uri: null },
    prisma: { status: "unknown", error: null, count: 0 },
    environment: { node_env: process.env.NODE_ENV }
  };
  

  const mongoUri = process.env.MONGODB_URI || "não definido";
  results.mongodb.uri = mongoUri 
    ? `${mongoUri.split("@")[0].slice(0, 10)}...` 
    : "não definido";
  
  try {
    
    const mongoConnection = await connectDB();
    results.mongodb.status = "connected";
    
 
    try {
      if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.listCollections().toArray();
        results.mongodb.collections = collections.map(c => c.name);
      } else {
        results.mongodb.collections = ["Conexão estabelecida, mas 'db' não está definido"];
      }
    } catch (e) {
      results.mongodb.collections = [`Erro ao listar coleções: ${e instanceof Error ? e.message : String(e)}`];
    }
    
 
    results.mongodb.models = Object.keys(mongoose.models);
    
   
    results.mongodb.hasReportModel = !!mongoose.models.Report;
    

    if (mongoose.models.Report) {
      try {
        const modelName = mongoose.models.Report.collection.name;
        results.mongodb.reportCollection = modelName;
        
      
        const count = await mongoose.models.Report.countDocuments();
        results.mongodb.reportCount = count;
      } catch (e) {
        results.mongodb.reportError = e instanceof Error ? e.message : String(e);
      }
    }
    
  } catch (error) {
    results.mongodb.status = "error";
    results.mongodb.error = error instanceof Error ? error.message : String(error);
  }
  
  try {
   
    const reportsCount = await prisma.report.count();
    results.prisma.status = "connected";
    results.prisma.count = reportsCount;
    
  
    const reports = await prisma.report.findMany({ 
      take: 5,
      select: {
        id: true,
        title: true,
        type: true
      }
    });
    
    results.prisma.reports = reports;
    
  } catch (error) {
    results.prisma.status = "error";
    results.prisma.error = error instanceof Error ? error.message : String(error);
  }
  
  return NextResponse.json(results);
} 
