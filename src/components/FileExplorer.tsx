import { api } from "~/utils/api";
import Directory from "./Directory";
import File from "./File";

interface FileExplorer {
  path?: string;
}

const FileExplorer: React.FC<FileExplorer> = ({ path = "" }) => {
  const { data, isLoading } = api.githubRouter.getContent.useQuery({
    path,
    recursive: false,
  });

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {data && (
        <>
          {data.directories.map((dir) => (
            <Directory key={dir.sha} directory={dir} />
          ))}
          {data.files.map((file) => (
            <File key={file.sha} file={file} />
          ))}
        </>
      )}
    </>
  );
};

export default FileExplorer;
