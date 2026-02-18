interface DotsCardProps {
  width?: number;
  height?: number;
}

export function DotsCard({ width = 80, height = 120 }: DotsCardProps) {
  const dots = [];
  const cols = 5;
  const rows = 7;
  const gap = 14;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={c * gap + 8}
          cy={r * gap + 8}
          r="3.5"
          fill="#1a1a1a"
        />
      );
    }
  }
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${cols * gap + 2} ${rows * gap + 2}`}
      style={{ background: "#e8a84a", borderRadius: 4 }}
      aria-hidden
    >
      {dots}
    </svg>
  );
}
