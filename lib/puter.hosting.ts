import puter from "@heyputer/puter.js";

import { HOSTING_CONFIG_KEY } from "./constants";
import {
  fetchBlobFromUrl,
  getHostedUrl,
  getImageExtension,
  imageUrlToPngBlob,
  isHostedUrl,
} from "./utils";

type HostingConfig = { subdomain: string };
type HostedAsset = { url: string };

export const getOrCreateHostingConfig =
  async (): Promise<HostingConfig | null> => {
    const existing = (await puter.kv.get(
      HOSTING_CONFIG_KEY,
    )) as HostingConfig | null;

    if (existing?.subdomain) return { subdomain: existing.subdomain };

    const subdomain = window.crypto.randomUUID();

    try {
      const created = await puter.hosting.create(subdomain, ".");

      return { subdomain: created.subdomain };
    } catch (error) {
      throw new Error("Could not find subdomain", { cause: error });
    }
  };

export const uploadImageToHosting = async ({
  hosting,
  url,
  projectId,
  label,
}: StoreHostedImageParams): Promise<HostedAsset | null> => {
  if (!hosting || !url) return null;
  if (isHostedUrl(url)) return { url };

  try {
    const resolved =
      label === "rendered"
        ? await imageUrlToPngBlob(url).then((blob) =>
          blob ? { blob, contentType: "image/png" } : null,
        )
        : await fetchBlobFromUrl(url);

    if (!resolved) return null;

    const contentType = resolved.contentType || resolved.blob.type || "";
    const ext = getImageExtension(contentType, url);
    const fileName = `${label}.${ext}`;
    const dir = `project/${projectId}`;
    const filePath = `${dir}/${fileName}`;

    const uploadFile = new File([resolved.blob], fileName, {
      type: contentType,
    });

    await puter.fs.mkdir(dir, { createMissingParents: true });
    await puter.fs.write(filePath, uploadFile);

    const hostedUrl = getHostedUrl({ subdomain: hosting.subdomain }, filePath);

    return hostedUrl ? { url: hostedUrl } : null;
  } catch (error) {
    throw new Error("Could not find hosting url", { cause: error });
  }
};
