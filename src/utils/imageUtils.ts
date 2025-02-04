export const getPlaceholderImage = (width: number = 300, height: number = 300) => {
  return `https://placehold.co/${width}x${height}?text=Image+Loading...`;
};

export const getCloudinaryUrl = (url: string, fallbackPath?: string) => {
  if (!url && fallbackPath) {
    return fallbackPath;
  }
  if (!url) {
    return getPlaceholderImage();
  }
  return url;
};
