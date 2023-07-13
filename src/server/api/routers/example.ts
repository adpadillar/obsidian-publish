import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { Octokit } from "@octokit/rest";
import { env } from "~/env.mjs";

export const octokit = new Octokit({
  auth: env.GITHUB_ACCESS_TOKEN,
});

export type directory = {
  name: string;
  path: string;
  sha: string;
  content: fetchGithubPathReturn;
  download_url: string | null;
};

export type file = {
  name: string;
  path: string;
  sha: string;
  content: string | null;
  download_url: string | null;
};

export type fetchGithubPathReturn = {
  directories: directory[];
  files: file[];
};

export const fetchGithubPath = async (
  path: string
): Promise<fetchGithubPathReturn> => {
  const res = await octokit.repos.getContent({
    owner: env.NEXT_PUBLIC_REPO_OWNER,
    repo: env.NEXT_PUBLIC_REPO_NAME,
    path,
  });

  if (!Array.isArray(res.data)) throw new Error("Not an array");

  return {
    directories: await Promise.all(
      res.data
        .filter((file) => file.type === "dir")
        .map(async (directory) => ({
          name: directory.name,
          path: directory.path,
          sha: directory.sha,
          download_url: directory.download_url,
          content: await fetchGithubPath(directory.path),
        }))
    ),
    files: await Promise.all(
      res.data
        .filter((file) => file.type === "file")
        .map(async (file) => ({
          name: file.name,
          path: file.path,
          sha: file.sha,
          download_url: file.download_url,
          content:
            file.download_url && file.path.endsWith(".md")
              ? await (await fetch(file.download_url)).text()
              : null,
        }))
    ),
  };
};

export const exampleRouter = createTRPCRouter({
  github: publicProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ input }) => {
      const res = await fetchGithubPath(input.path);

      return res;
    }),
});
