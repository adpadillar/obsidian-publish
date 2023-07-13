import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import FileExplorer from "~/components/FileExplorer";
import { create } from "zustand";
import { type file } from "~/server/api/routers/github";

interface FileStore {
  file?: file;
  setFile: (file: file) => void;
}

export const useFileStore = create<FileStore>()((set) => ({
  setFile: (file) => set({ file }),
}));

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="flex p-4">
      <div className="min-h-screen w-full max-w-xs">
        <FileExplorer />
      </div>
      <div className="w-full p-4">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default api.withTRPC(MyApp);
