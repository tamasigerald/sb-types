import { DatasourceResponse } from "@/types";

export const parseDatasourceResponse = (
  response: DatasourceResponse,
  key: string
) => {
  return `\nexport type ${
    // string is like "global-translations" => "GlobalTranslations"
    key
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")
  } = '${response.datasource_entries
    .map(({ name }: { name: string }) => name)
    .sort()
    .join("' | '")}';`;
};

type Options = {
  datasource: string;
  per_page?: number;
  page?: number;
};

export const fetchStoryblokDatasource = async (
  endpoint: string,
  token: string,
  options: Options
) => {
  const params = new URLSearchParams();
  params.append("token", token);
  params.append("datasource", options.datasource);

  params.append("per_page", options?.per_page?.toString() || "250");

  params.append("cv", "0"); // disable cache

  if (options.page) {
    params.append("page", options.page.toString());
  }

  const request = await fetch(
    `${endpoint}/datasource_entries?${params.toString()}`
  );
  const response = await request.json();
  return response;
};
