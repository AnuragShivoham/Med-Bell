import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as medical from "./medical.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-User-Id"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize medical documents bucket on startup
medical.initializeBucket();

// Health check endpoint
app.get("/make-server-274198ea/health", (c) => {
  return c.json({ status: "ok" });
});

// Medical Documents Routes
app.post("/make-server-274198ea/documents/upload", async (c) => {
  try {
    const userId = c.req.header("X-User-Id");
    if (!userId) {
      return c.json({ error: "User ID required" }, 401);
    }

    const body = await c.req.json();
    const { fileName, fileData, mimeType } = body;

    if (!fileName || !fileData || !mimeType) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Convert base64 to Uint8Array
    const binaryString = atob(fileData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const result = await medical.uploadDocument(userId, fileName, bytes, mimeType);
    return c.json(result);
  } catch (error) {
    console.error("Error in document upload route:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-274198ea/documents", async (c) => {
  try {
    const userId = c.req.header("X-User-Id");
    if (!userId) {
      return c.json({ error: "User ID required" }, 401);
    }

    const documents = await medical.getUserDocuments(userId);
    return c.json({ documents });
  } catch (error) {
    console.error("Error in get documents route:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-274198ea/documents/:id/url", async (c) => {
  try {
    const userId = c.req.header("X-User-Id");
    if (!userId) {
      return c.json({ error: "User ID required" }, 401);
    }

    const documentId = c.req.param("id");
    const doc = await kv.get(documentId);
    
    if (!doc || doc.userId !== userId) {
      return c.json({ error: "Document not found" }, 404);
    }

    const url = await medical.getDocumentUrl(doc.filePath);
    return c.json({ url });
  } catch (error) {
    console.error("Error in get document URL route:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/make-server-274198ea/documents/:id", async (c) => {
  try {
    const userId = c.req.header("X-User-Id");
    if (!userId) {
      return c.json({ error: "User ID required" }, 401);
    }

    const documentId = c.req.param("id");
    const doc = await kv.get(documentId);
    
    if (!doc || doc.userId !== userId) {
      return c.json({ error: "Document not found" }, 404);
    }

    await medical.deleteDocument(documentId, doc.filePath);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error in delete document route:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Doctor Contacts Routes
app.post("/make-server-274198ea/doctors", async (c) => {
  try {
    const userId = c.req.header("X-User-Id");
    if (!userId) {
      return c.json({ error: "User ID required" }, 401);
    }

    const doctorData = await c.req.json();
    const result = await medical.saveDoctorContact(userId, doctorData);
    return c.json(result);
  } catch (error) {
    console.error("Error in save doctor route:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-274198ea/doctors", async (c) => {
  try {
    const userId = c.req.header("X-User-Id");
    if (!userId) {
      return c.json({ error: "User ID required" }, 401);
    }

    const doctors = await medical.getUserDoctors(userId);
    return c.json({ doctors });
  } catch (error) {
    console.error("Error in get doctors route:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.put("/make-server-274198ea/doctors/:id", async (c) => {
  try {
    const userId = c.req.header("X-User-Id");
    if (!userId) {
      return c.json({ error: "User ID required" }, 401);
    }

    const doctorId = c.req.param("id");
    const updates = await c.req.json();
    
    const result = await medical.updateDoctor(doctorId, updates);
    return c.json(result);
  } catch (error) {
    console.error("Error in update doctor route:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/make-server-274198ea/doctors/:id", async (c) => {
  try {
    const userId = c.req.header("X-User-Id");
    if (!userId) {
      return c.json({ error: "User ID required" }, 401);
    }

    const doctorId = c.req.param("id");
    await medical.deleteDoctor(doctorId);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error in delete doctor route:", error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);