import { InfiniteSlider } from "@/components/ui/infinite-slider";

const badges: string[] = [
  "Secured by Firebase",
  "Powered by Google Gemini",
  "Receipt OCR by Mindee",
  "Voice ready with Picovoice",
  "Hosted on Vercel",
  "QR labels powered by Smooth Moves",
];

function AsSeenOn() {
  return (
    <InfiniteSlider gap={48} reverse>
      {badges.map((badge) => (
        <div
          key={badge}
          className="flex h-[70px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-sm font-semibold text-slate-700 shadow-sm"
        >
          {badge}
        </div>
      ))}
    </InfiniteSlider>
  );
}

export default AsSeenOn;
