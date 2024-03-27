export const generateProfilePictureUrl = (objectKey?: string) => {
  if (objectKey) {
    return `http://localhost:4566/profile-picture/${objectKey}`;
  } else {
    return `/images/user-circle.svg`;
  }
};
