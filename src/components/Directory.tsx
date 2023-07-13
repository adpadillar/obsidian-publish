import { useState } from "react";
import { type directory } from "~/server/api/routers/github";
import { api } from "~/utils/api";
import File from "./File";
import LoadingSpinner from "./LoadingSpinner";

interface DirectoryProps {
  directory: directory;
  fetchInitialData?: boolean;
  className?: string;
}

const Directory: React.FC<DirectoryProps> = ({ directory, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, mutate, isLoading } =
    api.githubRouter.mutateContent.useMutation();

  return (
    <div className={`cursor-pointer bg-zinc-100 transition-all ${className}`}>
      <div
        onClick={() => {
          mutate({
            path: directory.path,
            recursive: false,
          });

          if (data) {
            return setIsExpanded(!isExpanded);
          }

          setIsExpanded(!isExpanded);
        }}
        className="flex items-center space-x-1 py-1"
      >
        <svg
          className={`opacity-40 transition-all ${
            isExpanded ? "rotate-90" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          viewBox="0 -960 960 960"
          width="20"
        >
          <path d="M530-481 332-679l43-43 241 241-241 241-43-43 198-198Z" />
        </svg>
        <p className="opacity-70">{directory.name}</p>
      </div>

      <div className={isExpanded ? "block" : "hidden"}>
        <LoadingSpinner loading={isLoading} />
        {data?.directories.map((dir) => (
          <Directory className="pl-4" key={dir.sha} directory={dir} />
        ))}
        {data?.files.map((file) => (
          <File className="pl-2.5" key={file.sha} file={file} />
        ))}
      </div>
    </div>
  );
};

export default Directory;
