import dotenv from "dotenv";
dotenv.config();

export const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;

  console.log("****************DATABASE_URL*****************", url);

  if (!url) {
    // In production, log the error but provide a fallback to prevent crashes
    if (process.env.NODE_ENV === "production") {
      console.error(
        "DATABASE_URL environment variable is not set. Using fallback connection string."
      );
      // Return a placeholder that will cause a visible but non-fatal error
      return "database-url-not-configured";
    }
    // In development, fail fast
    throw new Error("DATABASE_URL environment variable is not set");
  }

  return url;
};
