import { useEffect, useState } from "react";
import { loadConfig } from "../config";

const GATEWAY_VERSION = "v1";

export function useStorageUrl(hash: string | undefined | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!hash) {
      setUrl(null);
      return;
    }
    loadConfig().then((config) => {
      const imageUrl = `${config.storage_gateway_url}/${GATEWAY_VERSION}/blob/?blob_hash=${encodeURIComponent(hash)}&owner_id=${encodeURIComponent(config.backend_canister_id)}&project_id=${encodeURIComponent(config.project_id)}`;
      setUrl(imageUrl);
    });
  }, [hash]);

  return url;
}
