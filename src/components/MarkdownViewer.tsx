import React from "react";
import Markdown from "react-markdown";
import useFileContent from "./hooks/useFileContent";
import LoadingSpinner from "./LoadingSpinner";
import { useFileStore } from "~/pages/_app";
import { findPath } from "~/utils/findPath";
import { api } from "~/utils/api";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";

interface MarkdownViewerProps {
  children?: React.ReactNode;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = () => {
  const { file } = useFileStore();
  const { data } = api.githubRouter.getContent.useQuery({
    path: "",
    recursive: true,
  });
  const [fileContent, fileLoading] = useFileContent(file);

  return (
    <>
      {fileLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="prose">
          {file && file.name && <h1>{file.name.replace(".md", "")}</h1>}
          {data && fileContent ? (
            <Markdown
              remarkPlugins={[remarkFrontmatter, remarkGfm]}
              transformImageUri={(src) => {
                if (src.startsWith("http")) return src;

                const path = findPath(data, decodeURI(src.replace("../", "")));
                if (!path) return src;

                return path.download_url ?? src;
              }}
            >
              {fileContent}
            </Markdown>
          ) : (
            <p>Select a markdown file</p>
          )}
        </div>
      )}
    </>
  );
};

export default MarkdownViewer;
