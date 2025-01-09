import * as React from "react"
const Heart = (props) => (
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
      d="m12.51 5.974-.51.517-.51-.517a4.938 4.938 0 0 0-7.038 0v0a5.124 5.124 0 0 0 0 7.147l5.392 5.476a3.025 3.025 0 0 0 4.312 0l5.392-5.475a5.124 5.124 0 0 0 0-7.148v0a4.939 4.939 0 0 0-7.039 0Z"
      clipRule="evenodd"
    />
  </svg>
)
export default Heart
