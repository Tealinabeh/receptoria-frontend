export function DailyRecipeSkeleton() {
  return (
    <div className="relative h-1/6 w-full rounded-xl overflow-hidden shadow-lg bg-gray-200 animate-pulse">
      <div className="w-full h-[400px] bg-gray-300"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 to-10% flex flex-col justify-end p-4">
        <div className="mb-52">
          <div className="h-10 bg-gray-400 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-400 rounded w-1/4"></div>
        </div>
        <div className="h-6 bg-gray-400 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-400 rounded w-full mb-2"></div> 
        <div className="h-6 bg-gray-400 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-orange-300 rounded w-36"></div>
      </div>
    </div>
  );
}
