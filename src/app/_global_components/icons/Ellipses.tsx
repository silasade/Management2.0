import { SVGProps } from "react";

export default function Ellipses(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 8 8"
      width="1em"
      height="1em"
      {...props}
    >
      <path fill="currentColor" d="M0 3v2h2V3zm3 0v2h2V3zm3 0v2h2V3z"></path>
    </svg>
  )
}
