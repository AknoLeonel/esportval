"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Skeleton } from "./Skeleton";

type LazyImageProps = Omit<ImageProps, "onLoad" | "loading"> & {
  /** Imagens acima da dobra: carrega na hora. As demais carregam só perto da tela. */
  eager?: boolean;
  wrapperClassName?: string;
};

/** `next/image` com skeleton até carregar e fade-in (opacity + blur) ao terminar. */
export function LazyImage({
  eager = false,
  wrapperClassName,
  className,
  alt,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <Image
        {...props}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-[opacity,filter] duration-500 ease-out",
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm",
          className,
        )}
      />
    </div>
  );
}
