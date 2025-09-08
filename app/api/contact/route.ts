import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const attachment = formData.get('attachment') as File | null;

    // Preparar dados do email
    const emailData: any = {
      from: "Lucas FII Research <contato@lucasfiiresearch.com.br>",
      to: ["lucasfiiresearch@gmail.com"],
      subject: subject,
      html: `<p>Nova mensagem de: ${name}</p>
             <p>Email: ${email}</p>
             <p>Telefone/WhatsApp: ${phone}</p>
             <p><b>Assunto:</b> ${subject}</p>
             <p>Mensagem: ${message}</p>
             ${attachment ? `<p><b>Anexo:</b> ${attachment.name}</p>` : ''}`
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
