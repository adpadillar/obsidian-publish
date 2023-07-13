import { useFileStore } from "~/pages/_app";
import { type file } from "~/server/api/routers/github";

interface FileProps {
  file: file;
  className?: string;
}

const File: React.FC<FileProps> = ({ file, className = "" }) => {
  const { setFile } = useFileStore();
  const { name } = file;

  return (
    <div
      onClick={() => setFile(file)}
      className={`cursor-pointer bg-zinc-100 py-1 pr-2 transition-all ${className}`}
    >
      <div className="h-full border border-y-transparent border-l-zinc-300 border-r-transparent pl-4 opacity-70">
        <p>{name}</p>
      </div>
    </div>
  );
};

export default File;
