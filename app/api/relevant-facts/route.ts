import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import RelevantFact from "@/app/_models/RelevantFact";
import { checkAdminAuth, unauthorized } from "@/lib/auth-admin";

export async function GET() {
  try {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
      return unauthorized(error);
    }

    await connectDB();
    const relevantFacts = await RelevantFact.find({}).lean();
    
    const formattedFacts = relevantFacts.map(fact => {
      const factObject = { ...fact };
      
      if (fact._id) {
        factObject.id = fact._id.toString();
        delete (factObject as Record<string, any>)._id;
      }
      
      if ('__v' in factObject) {
        delete (factObject as Record<string, any>).__v;
      }
      
      return factObject;
    });

    console.log("Fatos relevantes encontrados:", formattedFacts.length);
    return NextResponse.json(formattedFacts);
  } catch (error) {
    console.error("Erro ao buscar fatos relevantes:", error);
    return NextResponse.json({ error: "Erro ao buscar fatos relevantes" }, { status: 500 });
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
    const newRelevantFact = new RelevantFact({
      title: data.title,
      description: data.description,
      pdfUrl: data.pdfUrl,
    });
    
    await newRelevantFact.save();
    
    const response = {
      ...newRelevantFact.toObject(),
      id: newRelevantFact._id.toString()
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar fato relevante:", error);
    return NextResponse.json(
      { error: "Erro ao criar fato relevante" },
      { status: 500 }
    );
  }
}