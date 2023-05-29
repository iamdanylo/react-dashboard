export const validFileExtensions = {
  image: ['jpg', 'png', 'jpeg', 'webp'],
};

export const isValidFileType = (fileName: string, fileType: 'image') => {
  if (!fileName || !fileType) return false;
  const fileExt = fileName.split('.').pop();
  if (!fileExt) return false;
  return validFileExtensions[fileType].includes(fileExt);
};
