import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const BUCKET_NAME = "make-274198ea-medical-docs";

// Initialize storage bucket
export async function initializeBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      });
      if (error) {
        console.error("Error creating bucket:", error);
      } else {
        console.log("Medical documents bucket created successfully");
      }
    }
  } catch (error) {
    console.error("Error initializing bucket:", error);
  }
}

// Upload medical document
export async function uploadDocument(
  userId: string,
  fileName: string,
  fileData: Uint8Array,
  mimeType: string
) {
  try {
    const filePath = `${userId}/${Date.now()}-${fileName}`;
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileData, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload error: ${error.message}`);
    }

    // Store metadata in KV store
    const documentId = `doc_${userId}_${Date.now()}`;
    const metadata = {
      id: documentId,
      userId,
      fileName,
      filePath,
      mimeType,
      uploadedAt: new Date().toISOString(),
      size: fileData.length,
    };

    await kv.set(documentId, metadata);

    return { success: true, document: metadata };
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
}

// Get all documents for a user
export async function getUserDocuments(userId: string) {
  try {
    const allDocs = await kv.getByPrefix(`doc_${userId}_`);
    return allDocs.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}

// Get signed URL for document download
export async function getDocumentUrl(filePath: string) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) {
      throw new Error(`Error creating signed URL: ${error.message}`);
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Error getting document URL:", error);
    throw error;
  }
}

// Delete document
export async function deleteDocument(documentId: string, filePath: string) {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (storageError) {
      throw new Error(`Storage delete error: ${storageError.message}`);
    }

    // Delete metadata from KV
    await kv.del(documentId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

// Doctor management functions
export async function saveDoctorContact(userId: string, doctorData: any) {
  try {
    const doctorId = `doctor_${userId}_${Date.now()}`;
    const doctor = {
      id: doctorId,
      userId,
      ...doctorData,
      createdAt: new Date().toISOString(),
    };

    await kv.set(doctorId, doctor);
    return { success: true, doctor };
  } catch (error) {
    console.error("Error saving doctor contact:", error);
    throw error;
  }
}

export async function getUserDoctors(userId: string) {
  try {
    const doctors = await kv.getByPrefix(`doctor_${userId}_`);
    return doctors.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
}

export async function updateDoctor(doctorId: string, updates: any) {
  try {
    const existing = await kv.get(doctorId);
    if (!existing) {
      throw new Error("Doctor not found");
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(doctorId, updated);
    return { success: true, doctor: updated };
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw error;
  }
}

export async function deleteDoctor(doctorId: string) {
  try {
    await kv.del(doctorId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting doctor:", error);
    throw error;
  }
}
