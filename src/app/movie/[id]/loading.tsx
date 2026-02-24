export default function MovieLoading() {
  return (
    <div className="pb-20 md:pb-0">
      {/* Backdrop skeleton */}
      <div className="relative w-full h-[50vh] md:h-[65vh] skeleton" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 md:-mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster skeleton */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="w-[200px] sm:w-[240px] md:w-[280px] aspect-[2/3] rounded-2xl skeleton" />
          </div>

          {/* Info skeleton */}
          <div className="flex-1 space-y-4 pt-2">
            <div className="h-10 w-3/4 rounded skeleton mx-auto md:mx-0" />
            <div className="h-4 w-1/2 rounded skeleton mx-auto md:mx-0" />
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-20 rounded-full skeleton" />
              ))}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 w-28 rounded-xl skeleton" />
              ))}
            </div>
            <div className="space-y-2 pt-4">
              <div className="h-4 w-full rounded skeleton" />
              <div className="h-4 w-full rounded skeleton" />
              <div className="h-4 w-2/3 rounded skeleton" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
