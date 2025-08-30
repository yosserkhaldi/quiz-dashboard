export function ErrorBanner({ label = "Failed to load" }: { label?: string }) {
  return <div className="p-4 rounded-md bg-red-50 text-red-700 text-sm">{label}</div>;
}
export function ErrorSmall() {
  return <div className="h-full w-full flex items-center justify-center text-sm text-red-600">Failed to load.</div>;
}
