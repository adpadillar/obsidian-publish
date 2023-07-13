import { useState } from "react";
import { type directory } from "~/server/api/routers/github";
import { api } from "~/utils/api";
import File from "./File";

interface DirectoryProps {
  directory: directory;
  fetchInitialData?: boolean;
}

const Directory: React.FC<DirectoryProps> = ({ directory }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, mutate, isLoading } =
    api.githubRouter.mutateContent.useMutation();

  return (
    <>
      <div
        onClick={() => {
          if (data) {
            return setIsExpanded(!isExpanded);
          }

          mutate({
            path: directory.path,
            recursive: false,
          });

          setIsExpanded(!isExpanded);
        }}
        className="flex cursor-pointer space-x-2 bg-gray-200 px-4 py-1 transition-all hover:bg-gray-300"
      >
        <p>{directory.name}</p>
      </div>

      {isExpanded && (
        <div className="ml-4">
          {isLoading && <p className="animate-bounce">Loading...</p>}
          {data?.directories.map((dir) => (
            <Directory key={dir.sha} directory={dir} />
          ))}
          {data?.files.map((file) => (
            <File key={file.sha} file={file} />
          ))}
        </div>
      )}
    </>
  );
};

export default Directory;
