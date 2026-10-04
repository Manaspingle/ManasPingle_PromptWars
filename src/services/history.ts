import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { AnalysisResult } from '../types/analysis';

export interface SavedAuditItem {
  id: string;
  decision: string;
  timestamp: string;
  result: AnalysisResult;
}

const LOCAL_STORAGE_PREFIX = 'thinklens_history_';

/**
 * Saves a completed reasoning audit to Firestore with offline localStorage fallback.
 */
export async function saveAuditToHistory(
  userId: string,
  decision: string,
  result: AnalysisResult
): Promise<string> {
  const auditId = 'audit_' + Date.now();
  const timestampIso = new Date().toISOString();

  // 1. Always update local storage cache first
  try {
    const existing = getLocalHistory(userId);
    const updated = [
      { id: auditId, decision, timestamp: timestampIso, result },
      ...existing.slice(0, 19), // keep latest 20
    ];
    localStorage.setItem(LOCAL_STORAGE_PREFIX + userId, JSON.stringify(updated));
  } catch {
    // ignore local storage errors
  }

  // 2. Attempt Firestore sync if authenticated
  try {
    if (userId && !userId.startsWith('guest-')) {
      const auditsRef = collection(db, 'users', userId, 'audits');
      const docRef = await addDoc(auditsRef, {
        decision,
        result,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    }
  } catch (err) {
    console.warn('Firestore sync note (fallback to local session storage active):', err);
  }

  return auditId;
}

/**
 * Retrieves audit history for the authenticated user.
 */
export async function getAuditHistory(userId: string): Promise<SavedAuditItem[]> {
  const localList = getLocalHistory(userId);

  if (!userId || userId.startsWith('guest-')) {
    return localList;
  }

  try {
    const auditsRef = collection(db, 'users', userId, 'audits');
    const q = query(auditsRef, orderBy('createdAt', 'desc'), limit(10));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const firestoreItems: SavedAuditItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          decision: data.decision || 'Untitled Decision',
          timestamp: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          result: data.result as AnalysisResult,
        };
      });
      return firestoreItems;
    }
  } catch (err) {
    console.warn('Using local audit history fallback:', err);
  }

  return localList;
}

/**
 * Deletes a saved audit record.
 */
export async function deleteAuditFromHistory(userId: string, auditId: string): Promise<void> {
  // Update local storage
  try {
    const current = getLocalHistory(userId);
    const filtered = current.filter((item) => item.id !== auditId);
    localStorage.setItem(LOCAL_STORAGE_PREFIX + userId, JSON.stringify(filtered));
  } catch {
    // ignore
  }

  // Update Firestore
  try {
    if (userId && !userId.startsWith('guest-') && !auditId.startsWith('audit_')) {
      const auditDoc = doc(db, 'users', userId, 'audits', auditId);
      await deleteDoc(auditDoc);
    }
  } catch (err) {
    console.warn('Could not delete from Firestore:', err);
  }
}

function getLocalHistory(userId: string): SavedAuditItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + userId);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}
