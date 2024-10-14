export const getErrorMessage = function (err, message = '') {
  return err.error && err.error.error && err.error.error.message ? err.error.error.message : message;
};

export const buildFormData = function(data = {}) {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] instanceof Date) {
      formData.append(key, data[key].toISOString());
    } else if (data[key] instanceof Object) {
      formData.append(key, JSON.stringify(data[key]));
    } else if (data[key]) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};
