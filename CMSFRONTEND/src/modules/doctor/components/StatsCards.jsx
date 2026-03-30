import React from "react";
import StatCard from "./StatCard";

const StatsCards = ({
  total = 0,
  completed = 0,
  remaining = 0,
}) => {
  return (
    <div className="
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
      gap-4 md:gap-5
      mb-4 md:mb-5
    ">

      <StatCard
        title="Total Patients"
        value={total}
        color="blue"
        icon="👥"
      />

      <StatCard
        title="Completed"
        value={completed}
        color="green"
        icon="✅"
      />

      <StatCard
        title="Remaining"
        value={remaining}
        color="red"
        icon="⏳"
      />

    </div>
  );
};

export default StatsCards;