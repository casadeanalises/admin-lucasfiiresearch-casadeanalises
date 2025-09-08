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

export async function POST() {
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
    
    // Atualizar valores atuais para todas as metas
    const updatePromises = goals.map(async (goal) => {
      const currentValue = await calculateCurrentValue(userId, goal.type);
      
      return db.collection("goals").updateOne(
        { _id: goal._id },
        { 
          $set: { 
            current: currentValue,
            updatedAt: new Date() 
          } 
        }
      );
    });
    
    await Promise.all(updatePromises);
    
    return NextResponse.json({ 
      success: true, 
      message: "Valores das metas atualizados com sucesso" 
    });
  } catch (error) {
    console.error("Erro ao atualizar valores das metas:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar valores das metas" },
      { status: 500 }
    );
  }
}
