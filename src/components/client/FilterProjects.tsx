"use client";

import { ProjectCard } from "@/components/client/ProjectCard";
import type { projectConfig } from "@/lib/types";
import { FilterControls, useFilter } from "@/hooks/useFilter";

export default function FilterProjects({ items }: { items: projectConfig[] }) {
  const filter = useFilter(items, "projects");
  const { filteredAndSortedItems } = filter;

  return (
    <div className="flex flex-col gap-3 animation">
      <FilterControls filter={filter} />

      {filteredAndSortedItems.length === 0 ? (
        <div className="flex items-center justify-center border border-border p-6">
          <p className="paragraph">프로젝트가 존재하지 않습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border border-border p-6">
          {filteredAndSortedItems.map((item) => (
            <ProjectCard key={item.id} item={item as projectConfig} />
          ))}
        </div>
      )}
    </div>
  );
}
