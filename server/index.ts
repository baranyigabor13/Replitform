import express, { type Request, type Response, type NextFunction } from "express";
import { createServer } from "http";
// Must reference the transpiled .js extension when running under ESM on Vercel
import { setupVite, serveStatic, log } from "./vite.js";

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Global error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status =
    (err as { status?: number; statusCode?: number }).status ||
    (err as { status?: number; statusCode?: number }).statusCode ||
    500;
  const message = (err as { message?: string }).message ?? "Internal Server Error";

  res.status(status).json({ message });
  // Re-throw so it also appears in logs
  throw err;
});

(async () => {
  // Create HTTP server for Express + Vite HMR
  const server = createServer(app);

  if (process.env.NODE_ENV === "development") {
    // Dev: use Vite middleware
    await setupVite(app, server);
  } else {
    // Prod: serve pre-built static assets
    serveStatic(app);
  }

  // Listen on 0.0.0.0:PORT
  const PORT = Number(process.env.PORT ?? 5000);
  server.listen(PORT, "0.0.0.0", () => {
    log(`Server listening on port ${PORT}`);
  });
})();
