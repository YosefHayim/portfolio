import type React from "react";

const TechnologyBubble: React.FC<{ techName: string }> = ({ techName }) => {
  return <span className="rounded-full bg-gray-600 px-3 py-1">{techName}</span>;
};

export default TechnologyBubble;
