interface TeamPortraitProps {
  id: string;
  name: string;
  kind: "chef" | "assistant";
  palette: {
    auraFrom: string;
    auraTo: string;
    robe: string;
    robeTrim: string;
    hair: string;
    skin: string;
    ornament: string;
  };
}

export function TeamPortrait({ id, name, kind, palette }: TeamPortraitProps) {
  const gradientId = `${id}-gradient`;
  const haloId = `${id}-halo`;
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <svg
      viewBox="0 0 320 380"
      role="img"
      aria-label={name}
      className="h-full w-full"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.auraFrom} />
          <stop offset="100%" stopColor={palette.auraTo} />
        </linearGradient>
        <radialGradient id={haloId} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor={palette.ornament} stopOpacity="0.95" />
          <stop offset="100%" stopColor={palette.ornament} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="10" y="10" width="300" height="360" rx="38" fill={`url(#${gradientId})`} />
      <rect x="18" y="18" width="284" height="344" rx="32" fill="#0f0a0b" fillOpacity="0.42" />
      <circle cx="160" cy="122" r="104" fill={`url(#${haloId})`} opacity="0.72" />
      <circle cx="58" cy="54" r="24" fill="#160f10" fillOpacity="0.28" />
      <text
        x="58"
        y="61"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill={palette.ornament}
        letterSpacing="2"
      >
        {initials}
      </text>

      {kind === "chef" ? (
        <>
          <circle cx="122" cy="76" r="24" fill="#fff8ef" />
          <circle cx="160" cy="66" r="32" fill="#fff8ef" />
          <circle cx="198" cy="76" r="24" fill="#fff8ef" />
          <rect x="108" y="84" width="104" height="34" rx="16" fill="#f8ede0" />
          <rect x="126" y="108" width="68" height="16" rx="8" fill="#ead9c5" />
        </>
      ) : (
        <>
          <path d="M110 92c18-20 82-20 100 0v24H110z" fill="#f1dfc8" />
          <rect x="118" y="114" width="84" height="18" rx="9" fill="#e6d0b7" />
        </>
      )}

      <ellipse cx="160" cy="156" rx="64" ry="78" fill={palette.skin} />
      <path
        d="M102 150c3-39 28-68 58-68 31 0 56 29 58 68-12-24-33-39-58-39-25 0-46 15-58 39Z"
        fill={palette.hair}
      />
      <ellipse cx="136" cy="160" rx="5" ry="6" fill="#241a17" />
      <ellipse cx="184" cy="160" rx="5" ry="6" fill="#241a17" />
      <path
        d="M144 190c10 10 22 10 32 0"
        stroke="#744f43"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="140" y="210" width="40" height="30" rx="16" fill={palette.skin} />
      <path d="M74 338c8-64 40-100 86-100 46 0 78 36 86 100H74Z" fill={palette.robe} />
      <path
        d="M122 240h76l18 98h-30l-22-64-22 64h-30l10-98Z"
        fill={palette.robeTrim}
        opacity="0.86"
      />
      <circle cx="160" cy="248" r="8" fill={palette.ornament} />
      <rect x="98" y="292" width="124" height="52" rx="26" fill="#0c0909" fillOpacity="0.28" />
    </svg>
  );
}
