import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterProps {
  onFilterChange: (filter: string) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  return (
    <div className="flex justify-end mb-4">
      <Select onValueChange={onFilterChange} defaultValue="all">
        <SelectTrigger>
          <SelectValue placeholder="Chọn bộ lọc" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="price-asc">Giá tăng dần</SelectItem>
          <SelectItem value="price-desc">Giá giảm dần</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
