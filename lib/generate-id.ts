export function generateDisplayId(role: string): string {
  // Generate a random 5-character alphanumeric string
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  let prefix = "UR";
  
  const roleLower = role?.toLowerCase() || "";
  
  if (roleLower === "scholar") prefix = "SHC";
  else if (roleLower === "admin") prefix = "AD";
  else if (roleLower === "superadmin") prefix = "SM";
  
  return `${prefix}-${randomStr}`;
}
