export function RecipePreviewCardSkeleton() {
  return (
    <div className="w-auto max-w-96 rounded-xl overflow-hidden border-2 shadow-lg bg-white animate-pulse">
      <div className="h-52 w-full bg-gray-300"></div>
      
      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <div className="h-5 bg-gray-400 rounded w-3/4"></div>
          <div className="h-5 bg-gray-400 rounded w-1/4"></div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="h-4 bg-gray-300 rounded-full w-16"></div>
          <div className="h-4 bg-gray-300 rounded-full w-20"></div>
          <div className="h-4 bg-gray-300 rounded-full w-12"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-400 rounded w-1/3"></div>
          <div className="h-5 bg-gray-300 rounded-full w-1/4"></div> 
        </div>

        <div className="h-9 bg-orange-300 rounded w-full mt-4"></div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-gray-300"></div> 
            <div className="h-4 bg-gray-400 rounded w-24"></div> 
          </div>
          <div className="h-5 bg-gray-400 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}
