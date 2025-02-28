import { Skeleton } from "../ui/skeleton";

const LoadingSkeleton = () => {
  return (
    <div className="mx-2 sm:mx-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col bg-gray-50 border rounded-lg shadow-md p-4"
        >
          <Skeleton className="w-full h-56 rounded-md" />
          <Skeleton className="h-6 w-3/4 mt-3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
