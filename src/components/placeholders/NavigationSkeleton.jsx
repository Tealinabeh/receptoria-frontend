export function NavigationSkeleton() {
  const SkeletonItem = ({ width = 'w-3/4' }) => (
    <div className={`h-6 bg-gray-300 rounded-md ${width}`}></div>
  );

  const SkeletonSection = ({ titleWidth = 'w-1/2', itemCount = 4, titleColor = "bg-gray-400" }) => (
    <li>
      <div className={`h-7 ${titleColor} rounded-md mb-4 ${titleWidth}`}></div>
      <ul className="space-y-3 pl-3">
        {[...Array(itemCount)].map((_, i) => (
          <li key={i}>
            <SkeletonItem width={['w-3/4', 'w-5/6', 'w-2/3', 'w-4/5'][i % 4]} />
          </li>
        ))}
      </ul>
    </li>
  );

  return (
    <div className="p-4 h-full animate-pulse md:border-dashed md:border-2 md:rounded-2xl">
      <ul className="space-y-8">
        <SkeletonSection titleWidth="w-1/3" itemCount={2} titleColor="bg-orange-300" />
        <SkeletonSection titleWidth="w-1/3" itemCount={5} />
        <SkeletonSection titleWidth="w-1/4" itemCount={6} />
        <SkeletonSection titleWidth="w-3/5" itemCount={3} />
        <SkeletonSection titleWidth="w-2/4" itemCount={7} />
        <SkeletonSection titleWidth="w-2/3" itemCount={5} />
        <SkeletonSection titleWidth="w-1/5" itemCount={2} />
      </ul>
    </div>
  );
}
