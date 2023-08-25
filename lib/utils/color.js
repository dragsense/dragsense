export function rgbToHex(color) {
  const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/; // Regex to match hexadecimal color format
  const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/; // Regex to match RGB color format

  // Check if color is already in hexadecimal format
  if (hexRegex.test(color)) {
    return color;
  }

  // Check if color is in RGB format
  const rgbMatch = rgbRegex.exec(color);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    const hexValue = ((r << 16) | (g << 8) | b).toString(16);
    return '#' + ('000000' + hexValue).slice(-6);
  }

  // If color is not in either format, return null
  return null;
  }