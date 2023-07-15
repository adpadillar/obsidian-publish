/* eslint-disable @typescript-eslint/require-await */
import type { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import MarkdownViewer from "~/components/MarkdownViewer";
import useFileContent from "~/components/hooks/useFileContent";
import { api } from "~/utils/api";
import { findPath } from "~/utils/findPath";
import { useFileStore } from "../_app";

interface FileViewerProps {
  children?: React.ReactNode;
  fname: string;
}

const FileViewer: NextPage<FileViewerProps> = ({ fname }) => {
  const { setFile, file } = useFileStore();
  const [content, loading] = useFileContent(file);
  const { data, isLoading } = api.githubRouter.getContent.useQuery({
    path: "",
    recursive: true,
  });

  useEffect(() => {
    if (isLoading || !data) return;

    const fileOrDir = findPath(data, fname);

    if (fileOrDir && fileOrDir.type === "file") {
      setFile(fileOrDir);
    }
  }, [data, fname, isLoading, setFile]);

  return <>{content && <MarkdownViewer>{content}</MarkdownViewer>}</>;
};

export const getServerSideProps: GetServerSideProps<FileViewerProps> = async ({
  query,
}) => {
  const { slug } = query;
  const fname: string[] = [];

  if (!slug) {
    fname.push("");
  }

  if (Array.isArray(slug)) {
    fname.push(...slug);
  }

  if (typeof slug === "string") {
    fname.push(slug);
  }

  return {
    props: {
      fname: fname.join("/"),
    },
  };
};

export default FileViewer;
