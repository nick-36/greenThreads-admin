import BusinessStatsCard from "@/components/shared/Cards/BusinessStatsCard";

type BusinessStatsCardProps = {
  title: string;
  subTitle: string;
  icon: string;
};

const BusinessStatsCardList = ({
  statsData,
}: {
  statsData: BusinessStatsCardProps[];
}) => {
  return (
    <div className="grid items-center gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 p-4 cursor-pointer">
      {statsData?.map((item: BusinessStatsCard, idx) => (
        <BusinessStatsCard
          title={item?.title}
          subTitle={item?.subTitle}
          icon={item?.icon}
          key={idx}
        />
      ))}
    </div>
  );
};

export default BusinessStatsCardList;
