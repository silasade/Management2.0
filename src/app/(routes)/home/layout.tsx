import React from "react";
type PropType = {
  children: React.ReactNode;
  createevent: React.ReactNode;
  viewevent:React.ReactNode
};
function HomeLayout({ children, createevent,viewevent }: PropType) {
  return (
    <div>
      {children}
      {createevent}
      {viewevent}
    </div>
  );
}

export default HomeLayout;
