"use client";

import React from "react";

const AVAILABLE_SIZES = [40, 64, 128] as const;

type AvatarSize = (typeof AVAILABLE_SIZES)[number];

type Props = {
  /** Base del asset, por ejemplo: "sigil-01" */
  avatarId: string;
  /** Tamaño visual del avatar en px */
  size?: number;
  /** Alt accesible */
  alt?: string;
  className?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
  decoding?: "sync" | "async" | "auto";
  /** Si true, agrega widths al srcset */
  withWidthDescriptors?: boolean;
};

function clampToClosestSize(size: number): AvatarSize {
  return AVAILABLE_SIZES.reduce((prev, curr) => (Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev));
}

function buildSrcSet(avatarId: string, ext: "avif" | "webp", withWidthDescriptors: boolean): string {
  return AVAILABLE_SIZES
    .map((s) => {
      const src = `/avatars/raster/${avatarId}_${s}.${ext}`;
      return withWidthDescriptors ? `${src} ${s}w` : src;
    })
    .join(", ");
}

export default function AvatarPicture({
  avatarId,
  size = 64,
  alt = "Avatar",
  className,
  imgClassName,
  loading = "lazy",
  decoding = "async",
  withWidthDescriptors = true,
}: Props) {
  const fallbackSize = clampToClosestSize(size);
  const fallbackPng = `/avatars/raster/${avatarId}_${fallbackSize}.png`;

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={buildSrcSet(avatarId, "avif", withWidthDescriptors)} />
      <source type="image/webp" srcSet={buildSrcSet(avatarId, "webp", withWidthDescriptors)} />
      <img
        src={fallbackPng}
        width={size}
        height={size}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={imgClassName}
      />
    </picture>
  );
}

