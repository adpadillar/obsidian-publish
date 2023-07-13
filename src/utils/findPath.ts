import {
  type file,
  type fetchGithubPathReturn,
  type directory,
} from "~/server/api/routers/github";

const findPath = (
  content: fetchGithubPathReturn | null,
  path: string
): file | directory | null => {
  if (!content) return null;

  const pathArray = path.split("/").filter((s) => s !== "");

  if (pathArray.length === 0) return null;

  const seg = pathArray.shift();

  // We check 0 again because we just removed the first element
  if (pathArray.length === 0) {
    const maybeFile = content.files.find((file) => file.name === seg);
    const maybeDirectory = content.directories.find((dir) => dir.name === seg);

    return maybeFile ?? maybeDirectory ?? null;
  }

  const directory = content.directories.find((dir) => dir.name === seg);
  if (!directory) return null;

  return findPath(directory.content, pathArray.join("/"));
};

export { findPath };
