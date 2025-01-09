import * as React from "react"
const Company = (props) => (
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
      d="M12 6.5V9M9.5 12v-2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M7 20.9V13a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v7.9"
    />
    <rect
      width={18}
      height={18}
      x={3}
      y={3}
      stroke="#4A5568"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={5}
    />
    <path
      stroke="#4A5568"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.5 15h5M9.5 18h5"
    />
  </svg>
)
export default Company
