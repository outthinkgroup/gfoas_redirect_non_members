import React from "react";
export default function Skeleton() {
  const childrenSkeletons = [0, 1, 2, 3];
  return (
    <div className="skeleton">
      {childrenSkeletons.map((item, index) => {
        return (
          <div
            className="skeleton-child"
            key={index}
            style={{ "--skeleton-child-index": index }}
          ></div>
        );
      })}
    </div>
  );
}
