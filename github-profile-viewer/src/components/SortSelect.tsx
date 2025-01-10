import React from "react";

interface SortSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => {
  return (
    <select value={value} onChange={onChange}>
      <option value="created">Created</option>
      <option value="updated">Updated</option>
      <option value="pushed">Pushed</option>
      <option value="full_name">Full Name</option>
    </select>
  );
};

export default SortSelect;
