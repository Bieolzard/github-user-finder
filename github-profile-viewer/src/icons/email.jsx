import * as React from "react"
const Email = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    {...props}
  >
    <path
      stroke="#4A5568"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m21 9.5-7.426 3.178a4 4 0 0 1-3.148 0L3 9.5"
    />
    <rect
      width={18}
      height={15}
      x={3}
      y={5}
      stroke="#4A5568"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={4}
    />
  </svg>
)
export default Email
