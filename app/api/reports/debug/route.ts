import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import connectDB from "@/app/lib/mongodb";
import Report from "@/app/models/Report";
import { prisma } from "@/lib/prisma";
import mongoose from "mongoose";


interface MongoDocument {
  _id: any;
  [key: string]: any;
}

export async function GET(request: Request) {
  try {
    
    // Verificação de admin removida - usar middleware
    if (false) { // Auth check disabled
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    await connectDB();

   
    const mongoDbReports = await Report.find({}).lean();
    
    
    const formattedMongoReports = mongoDbReports.map(report => {
      const typedReport = report as MongoDocument;
      const id = typedReport._id ? typedReport._id.toString() : "Sem ID";
      return {
        ...report,
        _id: id,
        idInfo: {
          originalId: typedReport._id,
          idType: typeof typedReport._id,
          stringValue: typedReport._id ? typedReport._id.toString() : null,
          isObjectId: typedReport._id instanceof mongoose.Types.ObjectId,
          validObjectId: mongoose.Types.ObjectId.isValid(typedReport._id as any)
        }
      };
    });
    
    
    const prismaReports = await prisma.report.findMany();
    
    return NextResponse.json({
      mongoCount: mongoDbReports.length,
      prismaCount: prismaReports.length,
      mongoDbReports: formattedMongoReports,
      prismaReports,
      match: prismaReports.map(prismaReport => {
        const mongoMatch = mongoDbReports.find(mongoReport => {
          const typedMongoReport = mongoReport as MongoDocument;
          return typedMongoReport._id.toString() === prismaReport.id;
        });
        
        return {
          prismaId: prismaReport.id,
          foundInMongo: !!mongoMatch,
          mongoId: mongoMatch ? (mongoMatch as MongoDocument)._id.toString() : null
        };
      })
    });
  } catch (error) {
    console.error("Erro no debug:", error);
    return NextResponse.json(
      { message: "Erro ao buscar informações de debug", error },
      { status: 500 }
    );
  }
} 
