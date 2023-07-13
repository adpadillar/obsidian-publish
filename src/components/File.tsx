import { type file } from "~/server/api/routers/github";

interface FileProps {
  file: file;
  className?: string;
  onClick?: () => void;
}

const File: React.FC<FileProps> = ({ file, className, onClick }) => {
  const { name } = file;

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-gray-200 py-1 transition-all hover:bg-gray-300 ${
        className || ""
      }`}
    >
      <h2>{name}</h2>
    </div>
  );
};

export default File;
