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
  content: fetchGithubPathReturn | null;
  download_url: string | null;
  type: "dir";
};

export type file = {
  name: string;
  path: string;
  sha: string;
  download_url: string | null;
  type: "file";
};

export type fetchGithubPathReturn = {
  directories: directory[];
  files: file[];
};

export const fetchGithubPath = async (
  path: string,
  recursive: boolean
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
          type: "dir",
          content: recursive
            ? await fetchGithubPath(directory.path, recursive)
            : null,
        }))
    ),
    files: res.data
      .filter((file) => file.type === "file")
      .map((file) => ({
        name: file.name,
        path: file.path,
        sha: file.sha,
        download_url: file.download_url,
        type: "file",
      })),
  };
};

export const githubRouter = createTRPCRouter({
  getContent: publicProcedure
    .input(
      z.object({
        path: z.string(),
        recursive: z.boolean().optional().default(true),
      })
    )
    .query(async ({ input }) => {
      const res = await fetchGithubPath(input.path, input.recursive);

      return res;
    }),
  mutateContent: publicProcedure
    .input(
      z.object({
        path: z.string(),
        recursive: z.boolean().optional().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const res = await fetchGithubPath(input.path, input.recursive);

      return res;
    }),
});
