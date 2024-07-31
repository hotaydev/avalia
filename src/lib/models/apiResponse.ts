export interface AvaliaApiResponse {
  status: "success" | "error"; // Handle HTTP status codes into the route handler, here we only defined "status" for frontend
  data?: object | [] | string | number | boolean;
  message?: string;
}
