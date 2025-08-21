"use client"

import React from "react";
import { CirclesWithBar } from "react-loader-spinner";

function Loading() {
  return (
    <div className="flex justify-center items-center m-auto bg-white h-screen w-screen">
      <CirclesWithBar
        height="100"
        width="100"
        color="#7a573a"
        outerCircleColor="#7a573a"
        innerCircleColor="#7a573a"
        barColor="#7a573a"
        ariaLabel="circles-with-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}

export default Loading;
