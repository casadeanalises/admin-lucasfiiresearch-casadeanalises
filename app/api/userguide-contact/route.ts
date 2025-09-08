import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const guideType = formData.get('guideType') as string;
    const specificGuide = formData.get('specificGuide') as string;
    const attachment = formData.get('attachment') as File | null;

    // Preparar dados do email
    const emailData: any = {
      from: "Lucas FII Research <contato@lucasfiiresearch.com.br>",
      to: ["lucasfiiresearch@gmail.com"],
      subject: `[GUIA DO USUÁRIO] ${subject}`,
      html: `<h2>Nova Solicitação do Guia do Usuário</h2>
             <p><strong>Nome:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Assunto:</strong> ${subject}</p>
             <p><strong>Tipo de Guia:</strong> ${guideType}</p>
             <p><strong>Funcionalidade Específica:</strong> ${specificGuide || 'Não especificado'}</p>
             <p><strong>Mensagem:</strong></p>
             <p>${message}</p>
             ${attachment ? `<p><strong>Anexo:</strong> ${attachment.name}</p>` : ''}
             <hr>
             <p><em>Esta solicitação foi enviada através do formulário do Guia do Usuário da plataforma.</em></p>`
    };

    // Adicionar anexo se existir
    if (attachment) {
      const bytes = await attachment.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      emailData.attachments = [{
        filename: attachment.name,
        content: buffer
      }];
    }

    await resend.emails.send(emailData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar solicitação:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
