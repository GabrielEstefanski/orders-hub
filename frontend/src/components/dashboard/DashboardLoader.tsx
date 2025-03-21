import SkeletonLoader from '../ui/SkeletonLoader';

const DashboardLoader = () => {
  return (
    <div className="flex justify-center my-4">
      <div className="relative w-full max-w-full sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
          {Array(5).fill(null).map((_, index) => (
            <SkeletonLoader key={index} type="kpi" />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <SkeletonLoader type="chart" />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <SkeletonLoader type="chart" />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <SkeletonLoader type="chart" />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <SkeletonLoader type="chart" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoader;
