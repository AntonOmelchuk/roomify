import puter from "@heyputer/puter.js";

import {
  getOrCreateHostingConfig,
  uploadImageToHosting,
} from "./puter.hosting";
import { isHostedUrl } from "./utils";

export const signIn = async () => await puter.auth.signIn();

export const signOut = () => puter.auth.signOut();

export const getCurrentUser = async () => {
  try {
    return await puter.auth.getUser();
  } catch (error) {
    throw new Error("Something went wrong", { cause: error });
  }
};

export const createProject = async ({
  item,
}: CreateProjectParams): Promise<DesignItem | null | undefined> => {
  const projectId = item.id;

  const hosting = await getOrCreateHostingConfig();

  const hostedSource = projectId
    ? await uploadImageToHosting({
      hosting,
      url: item.sourceImage,
      projectId,
      label: "source",
    })
    : null;

  const hostedRender =
    projectId && item.renderedImage
      ? await uploadImageToHosting({
        hosting,
        url: item.renderedImage,
        projectId,
        label: "rendered",
      })
      : null;

  const resolveSource =
    hostedSource?.url ||
    (isHostedUrl(item.sourceImage) ? item.sourceImage : "");

  if (!resolveSource) {
    throw new Error("Failed to host source image, skipping save");
  }

  const resolvedRender = hostedRender?.url
    ? hostedRender.url
    : item.renderedImage && isHostedUrl(item.renderedImage)
      ? item.renderedImage
      : undefined;

  const payload = {
    ...item,
    sourceImage: resolveSource,
    renderedImage: resolvedRender,
  };

  try {
    return payload;
  } catch (error) {
    throw new Error("Failed to save project", { cause: error });
  }
};
