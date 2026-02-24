export default function MovieCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[150px] sm:w-[180px] shrink-0">
          <div className="aspect-[2/3] rounded-xl skeleton" />
          <div className="mt-2.5 space-y-1.5">
            <div className="h-3.5 w-3/4 rounded skeleton" />
            <div className="h-3 w-1/3 rounded skeleton" />
          </div>
        </div>
      ))}
    </>
  );
}
