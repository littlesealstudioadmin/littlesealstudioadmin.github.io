import { generateOGImage } from "@/lib/og";
import projectsConfig from "@/projects-config.json";
import { parse, format } from "date-fns";
import type { APIRoute } from "astro";

export function getStaticPaths() {
  return projectsConfig
    .filter((item) => item.id !== "project-id-template")
    .map((item) => ({
      params: { id: item.id },
      props: { item },
    }));
}

export const GET: APIRoute = async ({ props }) => {
  const { item } = props as any;
  const { title, description, category, date } = item.data;
  const formattedDate = format(
    parse(date, "dd-MM-yyyy", new Date()),
    "yyyy. MM. dd",
  );

  const png = await generateOGImage({
    title,
    description,
    category,
    date: formattedDate,
  });
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
