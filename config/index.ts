import devConfiguration from "./config.development";
import prodConfiguration from "./config.production";

const NODE_ENV = process.env.NODE_ENV || "development";
export default NODE_ENV === "production" ? prodConfiguration : devConfiguration;
