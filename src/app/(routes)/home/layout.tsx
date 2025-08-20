import React from "react";
type PropType = {
  children: React.ReactNode;
  createevent: React.ReactNode;
};
function HomeLayout({ children, createevent }: PropType) {
  return (
    <div>
      {children}
      {createevent}
    </div>
  );
}

export default HomeLayout;
