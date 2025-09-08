import NextImage, { ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ImageProps extends NextImageProps {
  className?: string;
}

export function Image({ className, alt, ...props }: ImageProps) {
  return (
    <NextImage
      className={cn("duration-300 ease-in-out", className)}
      alt={alt}
      {...props}
    />
  );
}
