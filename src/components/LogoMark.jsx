import React from "react";

export default function LogoMark({ size = 32, primaryColor = "#1D4ED8", secondaryColor = "#0284C7" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="group">
      <defs>
        <linearGradient id="llLensGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor={primaryColor} />
          <stop offset="1" stopColor={secondaryColor} />
        </linearGradient>
        <linearGradient id="llInnerGrad" x1="64" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>
        <filter id="glow-logo" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <style>
          {`
            .lens-spin { animation: lensSpin 8s linear infinite; transform-origin: 32px 32px; }
            @keyframes lensSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .ll-bounce { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-origin: center; }
            svg:hover .ll-bounce { transform: scale(1.08) translateY(-2px); }
          `}
        </style>
      </defs>

      <g className="ll-bounce" filter="url(#glow-logo)">
        {/* Outer Tech Hexagon / Lens casing */}
        <path d="M32 4L56 18v28L32 60 8 46V18z" fill="url(#llLensGrad)" />

        {/* Inner Glass Lens */}
        <circle cx="32" cy="32" r="16" fill="url(#llInnerGrad)" stroke="white" strokeWidth="1.5" strokeOpacity="0.8" />

        {/* Abstract "L" shapes framing the lens */}
        <path className="lens-spin" d="M32 12 A 20 20 0 0 1 52 32" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <path className="lens-spin" d="M32 52 A 20 20 0 0 1 12 32" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />

        {/* Center Scanner Beam (Diamond) */}
        <path d="M32 24l6 8-6 8-6-8z" fill="white" />
      </g>
    </svg>
  );
}
