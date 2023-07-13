import { useEffect, useState } from "react";
import { type file } from "~/server/api/routers/github";

const useFileContent = (file?: file) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string | null>(null);

  const fetchFileContent = async (download_url: string) => {
    try {
      const res = await fetch(download_url);
      const text = await res.text();
      return text;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    setLoading(true);

    if (file && file.download_url) {
      fetchFileContent(file.download_url)
        .then((content) => {
          setContent(content);
          setLoading(false);
        })
        .catch(() => {
          setContent(null);
          setLoading(false);
        });
    } else {
      setContent(null);
      setLoading(false);
    }
  }, [file]);

  return [content, loading] as const;
};

export default useFileContent;
