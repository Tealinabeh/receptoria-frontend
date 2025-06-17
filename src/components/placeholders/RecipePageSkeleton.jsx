// src/components/placeholders/RecipePageSkeleton.jsx

export function RecipePageSkeleton() {
  const SkeletonBlock = ({ className }) => <div className={`bg-gray-300 rounded-md ${className}`}></div>;
  const SkeletonCircle = ({ className }) => <div className={`bg-gray-300 rounded-full ${className}`}></div>;

  return (
    <div className="bg-gray-100 min-h-screen pt-20 pb-10 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <SkeletonBlock className="h-10 w-3/4" />
        </div>

        <div className="flex flex-col md:flex-row justify-around items-center text-center bg-white p-6 rounded-lg shadow-sm mb-8 gap-6 md:gap-4">
          <div className="flex flex-col items-center">
            <SkeletonBlock className="h-5 w-24 mb-2" />
            <SkeletonBlock className="h-8 w-32" />
          </div>
          <div className="flex flex-row justify-around w-full items-center">
            <div className="flex flex-col items-center">
              <SkeletonBlock className="h-5 w-32 mb-2" />
              <SkeletonBlock className="h-7 w-20" />
            </div>
            <div className="flex flex-col items-center">
              <SkeletonBlock className="h-5 w-24 mb-2" />
              <SkeletonBlock className="h-8 w-24" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-0 mb-8 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-300 w-full aspect-w-1 aspect-h-1"></div>
          <div className="bg-white p-6 flex flex-col">
            <SkeletonBlock className="h-8 w-1/2 mx-auto mb-4" />
            <div className="space-y-3 flex-grow mb-4">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-5/6" />
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200">
              <SkeletonBlock className="h-6 w-1/3 mx-auto mb-3" />
              <div className="flex flex-wrap gap-2 justify-center">
                <div className="h-6 w-20 rounded-full bg-orange-300" />
                <div className="h-6 w-24 rounded-full bg-orange-300" />
                <div className="h-6 w-16 rounded-full bg-orange-300" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <SkeletonBlock className="h-10 w-40 rounded-lg" />
          <div className="flex items-center space-x-2">
            <SkeletonBlock className="h-5 w-24" />
            <SkeletonBlock className="h-5 w-28" />
          </div>
          <div className="flex items-center space-x-2">
            <SkeletonCircle className="h-10 w-10" />
            <SkeletonBlock className="h-5 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          <aside className="lg:sticky top-24 self-start">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <SkeletonBlock className="h-8 w-3/4 mx-auto mb-4" />
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => <SkeletonBlock key={i} className="h-4 w-full" />)}
              </div>
            </div>
          </aside>
          <article className="bg-white p-6 rounded-lg shadow-md">
            <SkeletonBlock className="h-8 w-3/4 mx-auto mb-4" />
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl border-2 border-gray-200">
                  <div className="flex items-start gap-4 mb-4">
                    <SkeletonBlock className="h-8 w-8 rounded-lg flex-shrink-0" />
                    <div className="w-full space-y-2">
                      <SkeletonBlock className="h-4 w-full" />
                      <SkeletonBlock className="h-4 w-5/6" />
                    </div>
                  </div>
                  <SkeletonBlock className="h-40 w-full rounded-md" />
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}