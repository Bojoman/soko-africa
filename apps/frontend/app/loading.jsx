export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-gray-50">
      <div
        className="h-10 w-10 rounded-full border-2 border-soko-cream border-t-soko-orange animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
