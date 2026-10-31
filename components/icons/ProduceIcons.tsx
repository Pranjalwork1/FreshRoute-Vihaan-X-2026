import React from "react";
import { PRODUCE_IMAGES } from "@/lib/produceImages";

export function ProduceSvgDefs() {
  return (
    <svg id="fr-produce-defs" width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="tomato" viewBox="0 0 100 100">
          <circle cx="50" cy="57" r="35" fill="#D9473A" />
          <ellipse cx="38" cy="44" rx="9" ry="6" fill="#fff" opacity=".28" transform="rotate(-30 38 44)" />
          <path d="M50 22l-15 9 11 2-7 9 11-5 11 5-7-9 11-2z" fill="#2F8F57" />
        </symbol>
        <symbol id="potato" viewBox="0 0 100 100">
          <ellipse cx="50" cy="55" rx="38" ry="27" fill="#C79A63" transform="rotate(-12 50 55)" />
          <circle cx="36" cy="52" r="3" fill="#9C7442" />
          <circle cx="58" cy="62" r="3" fill="#9C7442" />
          <circle cx="66" cy="46" r="2.5" fill="#9C7442" />
        </symbol>
        <symbol id="onion" viewBox="0 0 100 100">
          <path d="M50 14c4 14 6 16 20 26 14 12 12 40-20 46-32-6-34-34-20-46 14-10 16-12 20-26z" fill="#B65A7A" />
          <path d="M50 20c-14 22-16 46 0 66M50 20c14 22 16 46 0 66" fill="none" stroke="#E7B3C7" strokeWidth="2.5" />
        </symbol>
        <symbol id="chilli" viewBox="0 0 100 100">
          <path d="M22 28c26-4 56 6 60 40 2 14-6 20-10 20-4-24-20-34-50-36z" fill="#D2362C" />
          <path d="M18 26c-2-8 4-12 10-10l-2 8z" fill="#2F8F57" />
        </symbol>
        <symbol id="mango" viewBox="0 0 100 100">
          <ellipse cx="50" cy="56" rx="30" ry="36" fill="#F2A63A" transform="rotate(22 50 56)" />
          <ellipse cx="42" cy="44" rx="8" ry="14" fill="#fff" opacity=".25" transform="rotate(22 42 44)" />
          <path d="M52 20c8-8 20-6 24 0-8 4-18 4-24 0z" fill="#2F8F57" />
        </symbol>
        <symbol id="wheat" viewBox="0 0 100 100">
          <path d="M50 94V30" stroke="#B98B2E" strokeWidth="3" />
          <g fill="#E4B94B">
            <ellipse cx="50" cy="20" rx="6" ry="11" />
            <ellipse cx="40" cy="38" rx="6" ry="11" transform="rotate(-30 40 38)" />
            <ellipse cx="60" cy="38" rx="6" ry="11" transform="rotate(30 60 38)" />
            <ellipse cx="40" cy="58" rx="6" ry="11" transform="rotate(-30 40 58)" />
            <ellipse cx="60" cy="58" rx="6" ry="11" transform="rotate(30 60 58)" />
          </g>
        </symbol>
        <symbol id="pulses" viewBox="0 0 100 100">
          <ellipse cx="36" cy="46" rx="20" ry="13" fill="#B5683A" transform="rotate(-25 36 46)" />
          <ellipse cx="62" cy="40" rx="20" ry="13" fill="#D9923F" transform="rotate(20 62 40)" />
          <ellipse cx="52" cy="68" rx="20" ry="13" fill="#9E4F2C" transform="rotate(-8 52 68)" />
        </symbol>
        <symbol id="pumpkin" viewBox="0 0 100 100">
          <ellipse cx="36" cy="58" rx="22" ry="30" fill="#E8842B" />
          <ellipse cx="64" cy="58" rx="22" ry="30" fill="#E8842B" />
          <ellipse cx="50" cy="58" rx="19" ry="33" fill="#F29A43" />
          <path d="M50 26c0-8 4-12 8-12" stroke="#2F8F57" strokeWidth="5" fill="none" strokeLinecap="round" />
        </symbol>
        <symbol id="crate" viewBox="0 0 100 60">
          <rect x="1" y="2" width="98" height="56" rx="6" fill="#C9975B" />
          <path d="M1 20h98M1 38h98" stroke="#A97A42" strokeWidth="3" />
          <rect x="1" y="2" width="98" height="56" rx="6" fill="none" stroke="#A97A42" strokeWidth="2" />
        </symbol>
        <symbol id="i-l" viewBox="0 0 24 24">
          <rect x="5" y="3" width="14" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 8h6M9 12h6M9 16h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </symbol>
        <symbol id="i-m" viewBox="0 0 24 24">
          <circle cx="8" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="16" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </symbol>
        <symbol id="i-t" viewBox="0 0 24 24">
          <path d="M2 7h12v9H2zM14 10h4l3 3v3h-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </symbol>
        <symbol id="i-c" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m8 12 3 3 5-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-k" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </symbol>
        <symbol id="i-s" viewBox="0 0 24 24">
          <path d="M12 2v20M3.5 7l17 10M3.5 17l17-10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </symbol>
        <symbol id="i-b" viewBox="0 0 24 24">
          <path d="M5 20V10M12 20V4M19 20v-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </symbol>
        <symbol id="i-sh" viewBox="0 0 24 24">
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-lk" viewBox="0 0 24 24">
          <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </symbol>
        <symbol id="i-tg" viewBox="0 0 24 24">
          <path d="M20 12l-8 8-8-8V4h8z" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" />
        </symbol>
      </defs>
    </svg>
  );
}

export function ProducePhoto({
  name,
  alt = "",
  className = "",
  style,
}: {
  name: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const imgSrc = PRODUCE_IMAGES[name] || PRODUCE_IMAGES[name.toLowerCase()] || PRODUCE_IMAGES["tomato"];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt || name}
      className={className}
      style={style}
      loading="lazy"
    />
  );
}

export function ProduceSvg({
  name,
  className = "",
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const isCrate = name === "crate";
  return (
    <svg
      className={className}
      style={style}
      viewBox={isCrate ? "0 0 100 60" : "0 0 100 100"}
      aria-hidden="true"
    >
      <use href={`#${name}`} />
    </svg>
  );
}

export function FreshRouteLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" />
      <path
        d="M7 16c0-6 4-9 10-9 0 6-3 10-10 9zM7 16c2-3 4-5 7-6"
        fill="none"
        stroke="var(--bg)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

