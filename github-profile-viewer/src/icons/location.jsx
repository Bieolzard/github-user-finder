import * as React from "react"
const Loc = (props) => (
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
      d="M12 13v0a3 3 0 0 1-3-3v0a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3Z"
      clipRule="evenodd"
    />
    <path
      stroke="#4A5568"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 21s-7-5.75-7-11a7 7 0 1 1 14 0c0 5.25-7 11-7 11Z"
      clipRule="evenodd"
    />
  </svg>
)
export default Loc
