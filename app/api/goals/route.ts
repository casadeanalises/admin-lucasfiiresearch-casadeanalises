import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import connectDB from "@/app/lib/mongodb";
import { Portfolio } from "@/app/_models/Portfolio";

// Função para calcular o valor atual baseado no tipo da meta
async function calculateCurrentValue(userId: string, type: string): Promise<number> {
  const { db } = await connectToDatabase();
  
  switch (type) {
    case 'patrimonio':
      // Calcular patrimônio total (valor atual dos ativos + valorização)
      try {
        await connectDB();
        const portfolio = await Portfolio.findOne({ userId });
        if (!portfolio || !portfolio.items || portfolio.items.length === 0) {
          return 0;
        }
        
        // Calcular valor total atual do portfólio
        const totalCurrent = portfolio.items.reduce((sum: number, item: any) => {
          return sum + (item.quantidade * item.fii.preco);
        }, 0);
        
        return totalCurrent;
      } catch (error) {
        console.error("Erro ao calcular patrimônio:", error);
        return 0;
      }
      
    case 'dividendos':
      // Calcular dividendos do mês atual
      try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const dividends = await db.collection("dividends").find({
          userId,
          date: {
            $gte: startOfMonth.toISOString(),
            $lte: endOfMonth.toISOString()
          }
        }).toArray();
        
        const totalDividends = dividends.reduce((sum, dividend) => sum + dividend.amount, 0);
        return totalDividends;
      } catch (error) {
        console.error("Erro ao calcular dividendos:", error);
        return 0;
      }
      
    case 'ativos':
      // Calcular número de ativos únicos no portfólio
      try {
        await connectDB();
        const portfolio = await Portfolio.findOne({ userId });
        if (!portfolio || !portfolio.items || portfolio.items.length === 0) {
          return 0;
        }
        
        // Contar ativos únicos (por código do FII)
        const uniqueAssets = new Set(portfolio.items.map((item: any) => item.fii.codigo));
        return uniqueAssets.size;
      } catch (error) {
        console.error("Erro ao calcular número de ativos:", error);
        return 0;
      }
      
    default:
      return 0;
  }
}

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const goals = await db.collection("goals").find({ userId }).toArray();
    
    // Calcular valores atuais para cada meta
    const updatedGoals = await Promise.all(
      goals.map(async (goal) => {
        const currentValue = await calculateCurrentValue(userId, goal.type);
        return {
          ...goal,
          current: currentValue
        };
      })
    );
    
    return NextResponse.json({ goals: updatedGoals });
  } catch (error) {
    console.error("Erro ao carregar metas:", error);
    return NextResponse.json(
      { error: "Erro ao carregar metas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const body = await request.json();
    
    const { title, target, type, unit } = body;
    
    if (!title || !target || !type || !unit) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }
    
    // Calcular valor atual baseado no tipo da meta
    const currentValue = await calculateCurrentValue(userId, type);
    
    const newGoal = {
      userId,
      title,
      target: Number(target),
      current: currentValue,
      type,
      unit,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection("goals").insertOne(newGoal);
    
    return NextResponse.json({
      success: true,
      goal: { ...newGoal, _id: result.insertedId }
    });
  } catch (error) {
    console.error("Erro ao criar meta:", error);
    return NextResponse.json(
      { error: "Erro ao criar meta" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const body = await request.json();
    
    const { id, ...updateData } = body;
    
    // Se o tipo da meta foi alterado, recalcular o valor atual
    if (updateData.type) {
      const currentValue = await calculateCurrentValue(userId, updateData.type);
      updateData.current = currentValue;
    }
    
    const result = await db.collection("goals").updateOne(
      { _id: new ObjectId(id), userId },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Meta não encontrada" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar meta:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar meta" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID da meta não fornecido" },
        { status: 400 }
      );
    }
    
    const result = await db.collection("goals").deleteOne({ _id: new ObjectId(id), userId: userId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Meta não encontrada" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar meta:", error);
    return NextResponse.json(
      { error: "Erro ao deletar meta" },
      { status: 500 }
    );
  }
}
