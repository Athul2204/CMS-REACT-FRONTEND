import React from "react";
import StatCard from "./StatCard";

const StatsCards = ({
  total = 0,
  completed = 0,
  remaining = 0,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

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