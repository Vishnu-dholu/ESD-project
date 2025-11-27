export default function Loading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-green-400 animate-spin-slow shadow-lg" />
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
