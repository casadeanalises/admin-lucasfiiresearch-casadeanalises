"use client";

import Image from "next/image";
import Link from "next/link";
import {
  YoutubeIcon,
  MessageCircleIcon,
  FacebookIcon,
  InstagramIcon,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1C1F26] text-white px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" width={64} height={64} alt="Lucas FII" className="h-16 w-16" />
            <span className="text-2xl font-semibold">Research</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-300 max-w-4xl mx-auto mb-8">
        A única casa de análises 100% isenta e focada em você! Depois de 4 anos trazendo conteúdo para o YouTube, chegou o momento de atender o público de forma completa. Aqui você encontra análises completas sobre FIIs e tendências do mercado.
        </p>

        <div className="flex justify-center gap-8 mb-8">
          {/* <Link
            href="https://www.facebook.com/"
            className="text-gray-300 hover:text-primary transition-colors"
            target="_blank"
          >
            <FacebookIcon size={24} />
          </Link> */}

          <Link
            href="https://www.youtube.com/channel/UClmrZELCfAbZNzpl6rAT0gw"
            className="text-gray-300 hover:text-primary transition-colors"
            target="_blank"
          >
            <YoutubeIcon size={24} />
          </Link>

          <Link
            href="https://t.me/lucasfiis"
            className="text-gray-300 hover:text-primary transition-colors"
            target="_blank"
          >
            <MessageCircleIcon size={24} />
          </Link>

          <Link
            href="https://www.instagram.com/lucasfiis/"
            className="text-gray-300 hover:text-primary transition-colors"
            target="_blank"
          >
            <InstagramIcon size={24} />
          </Link>
          
        </div>

        <div className="flex justify-center gap-4 text-gray-300 mb-8">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacidade
          </Link>
          <span className="text-gray-600">/</span>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Termos
          </Link>
       
          <span className="text-gray-600">/</span>
          <Link href="/contact" className="hover:text-primary transition-colors">
            Suporte
          </Link>
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>© 2025 Lucas FII Research L&L Consultoria/Educação Financeira LTDA, CNPJ: 60.481.320/0001-32</p>
        </div>

        <div className="flex justify-center items-center gap-4 mt-4 text-[10px] text-gray-500">
          <span>Site: v1.10.6</span>
          <span>•</span>
          <span>
            Desenvolvido por{" "}
            <a
              href="https://devrocha.com.br"
              className="text-primary hover:text-primary/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              DevRocha
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
