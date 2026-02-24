export default function HomeLoading() {
  return (
    <div className="pb-20 md:pb-0">
      {/* Hero skeleton */}
      <div className="relative w-full h-[75vh] md:h-[85vh] skeleton" />

      {/* Rows skeleton */}
      <div className="space-y-10 -mt-16 relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-7 w-48 rounded skeleton mb-4" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} className="w-[150px] sm:w-[180px] shrink-0">
                  <div className="aspect-[2/3] rounded-xl skeleton" />
                  <div className="mt-2.5 space-y-1.5">
                    <div className="h-3.5 w-3/4 rounded skeleton" />
                    <div className="h-3 w-1/3 rounded skeleton" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
