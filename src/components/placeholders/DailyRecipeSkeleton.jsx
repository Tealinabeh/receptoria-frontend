export function DailyRecipeSkeleton() {
  return (
    <div className="relative h-96 w-full rounded-xl overflow-hidden bg-gray-300 animate-pulse">
      <div className="w-full h-full bg-gray-300" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-6 md:p-8">
        <div>
          <div className="h-10 md:h-12 bg-gray-400 bg-opacity-50 rounded-lg w-3/4 md:w-1/2 mb-3"></div>
          <div className="h-6 bg-gray-400 bg-opacity-50 rounded-md w-1/4 md:w-1/6"></div>
        </div>
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-7 bg-gray-400 bg-opacity-50 rounded-full w-20"></div>
            <div className="h-6 bg-gray-400 bg-opacity-50 rounded-md w-24"></div>
          </div>
          <div className="h-12 bg-red-500 bg-opacity-50 rounded-lg w-48"></div>
        </div>

      </div>
    </div>
  );
}