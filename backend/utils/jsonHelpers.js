// // utils/jsonHelpers.js
// const parseJsonField = (jsonString, defaultValue = []) => {
//   try {
//     return JSON.parse(jsonString || JSON.stringify(defaultValue));
//   } catch (error) {
//     console.error("Error parsing JSON field:", error);
//     return defaultValue;
//   }
// };

// const stringifyJsonField = (data) => {
//   return JSON.stringify(data || []);
// };

// module.exports = { parseJsonField, stringifyJsonField };

// utils/jsonHelpers.js
const parseJsonField = (jsonString, defaultValue = []) => {
  // If it's already an array (shouldn't happen but safe guard)
  if (Array.isArray(jsonString)) {
    return jsonString;
  }
  
  // If it's undefined, null, or empty string, return default
  if (!jsonString || jsonString === 'null' || jsonString === 'undefined') {
    return defaultValue;
  }
  
  // If it's a string that looks empty
  if (typeof jsonString === 'string' && jsonString.trim() === '') {
    return defaultValue;
  }
  
  try {
    // Try to parse the JSON
    const parsed = JSON.parse(jsonString);
    // Ensure we return an array
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch (error) {
    console.error("Error parsing JSON field:", error, "Value:", jsonString);
    return defaultValue;
  }
};

const stringifyJsonField = (data) => {
  // Ensure we're stringifying an array
  const dataToStringify = Array.isArray(data) ? data : [];
  return JSON.stringify(dataToStringify);
};

module.exports = { parseJsonField, stringifyJsonField };