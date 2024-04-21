export const generateProfilePictureUrl = (objectKey?: string) => {
  if (objectKey) {
    return `https://ls-pickeeper.ngrok.app/profile-picture/${objectKey}`;
  } else {
    return `/images/user-circle.svg`;
  }
};
