export const mapBackendErrors = (backendErrors) => {
  const mappedErrors = {};

  if (!backendErrors) return mappedErrors;

  Object.keys(backendErrors).forEach((key) => {
    mappedErrors[key] = backendErrors[key][0];
  });

  return mappedErrors;
};