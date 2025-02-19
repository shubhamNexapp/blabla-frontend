// src/utils/fileUtils.js
import { toast } from "react-toastify";

/**
 * Format file size into a human-readable format.
 * @param {number} bytes - The size in bytes.
 * @param {number} decimals - Number of decimal places.
 * @returns {string} - Formatted file size.
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Handle file upload for PAN card or similar use cases.
 * @param {Array} files - Files to process.
 * @param {Function} setFieldValue - Formik's setFieldValue function.
 * @param {Function} setFilesState - State updater for the files.
 * @param {Array} allowedTypes - List of allowed file MIME types.
 */
export function handleFileUpload(
  files,
  setFieldValue,
  setFilesState,
  fieldName, // New parameter for dynamic field name
  allowedTypes = ["application/pdf", "image/jpeg", "image/png"]
) {
  const updatedFiles = files
    .map((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF and image files are allowed.");
        return null;
      }

      return Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      });
    })
    .filter(Boolean);

  // Dynamically set the Formik field
  setFieldValue(fieldName, files); // Use the dynamic fieldName parameter
  setFilesState(updatedFiles);
}

export function getUserDetails() {
  let ObjLoginData = JSON.parse(localStorage.getItem("authUser"));
  if (ObjLoginData && ObjLoginData != null) {
    return ObjLoginData;
  } else {
    return null;
  }
}
