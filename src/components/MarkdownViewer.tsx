import React from "react";
import Markdown from "react-markdown";
import useFileContent from "./hooks/useFileContent";
import LoadingSpinner from "./LoadingSpinner";
import { useFileStore } from "~/pages/_app";
import { findPath } from "~/utils/findPath";
import { api } from "~/utils/api";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import { remarkWikiLinks } from "remark-wikirefs";

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
      <div className="prose prose-img:w-full">
        {file && file.name && <h1>{file.name.replace(".md", "")}</h1>}
        <LoadingSpinner loading={fileLoading} />
        {data && fileContent && !fileLoading && (
          <Markdown
            components={{
              input: ({ ...props }) => (
                <span className="not-prose pr-1">
                  <input {...props} />
                </span>
              ),
            }}
            remarkPlugins={[remarkFrontmatter, remarkGfm, remarkWikiLinks]}
            transformImageUri={(src) => {
              const path = findPath(data, decodeURI(src.replaceAll("../", "")));

              if (src.startsWith("http")) return src;

              if (!path) return src;

              return path.download_url ?? src;
            }}
          >
            {fileContent}
          </Markdown>
        )}
      </div>
    </>
  );
};

export default MarkdownViewer;
