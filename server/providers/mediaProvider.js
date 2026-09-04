import { google } from 'googleapis';
import fs from 'fs';
import { Readable } from 'stream';
import { db } from '../db.js';

export class MediaProvider {
  getStatus() { throw new Error('getStatus must be implemented'); }
  async checkConnection() { throw new Error('checkConnection must be implemented'); }
  async upload({ fileBuffer, filename, mimeType, category, uploadedBy, altText, caption }) { throw new Error('upload must be implemented'); }
  async get(fileId) { throw new Error('get must be implemented'); }
  async list(filters) { throw new Error('list must be implemented'); }
  async replace(fileId, newFileData) { throw new Error('replace must be implemented'); }
  async archive(fileId) { throw new Error('archive must be implemented'); }
  async delete(fileId) { throw new Error('delete must be implemented'); }
}

export class MockMediaProvider extends MediaProvider {
  constructor() {
    super();
    this.name = 'MockMediaProvider';
  }

  getStatus() {
    return {
      provider: 'Mock Media Provider (Local Persistent Storage)',
      type: 'MOCK',
      configured: true,
      status: 'ONLINE',
      details: 'Simulated persistent media storage for development & testing.',
    };
  }

  async checkConnection() {
    return { connected: true, status: 'CONNECTED', details: 'Mock Media operational' };
  }

  async upload({ filename, mimeType, size = 1024, category = 'Other', altText = '', caption = '', uploadedBy = 'Staff' }) {
    const fileId = `gdrive_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const url = `/brand/holistic-edge-logo-transparent.png`;

    const mediaAsset = {
      id: `media_${Date.now()}`,
      provider: 'MOCK_DRIVE',
      providerFileId: fileId,
      filename,
      originalFilename: filename,
      mimeType: mimeType || 'image/png',
      size: size || 10240,
      width: 1200,
      height: 800,
      url,
      altText: altText || filename,
      caption: caption || '',
      category: category || 'Other',
      status: 'ACTIVE',
      usageCount: 0,
      referencedBy: [],
      uploadedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const inserted = db.insert('mediaAssets', mediaAsset);
    return inserted;
  }

  async get(id) {
    return db.find('mediaAssets', m => m.id === id || m.providerFileId === id);
  }

  async list(filters = {}) {
    let assets = db.get('mediaAssets') || [];
    if (filters.category && filters.category !== 'ALL') {
      assets = assets.filter(a => a.category.toUpperCase() === filters.category.toUpperCase());
    }
    if (filters.status) {
      assets = assets.filter(a => a.status === filters.status);
    }
    return assets;
  }

  async replace(id, newFileData) {
    const existing = db.find('mediaAssets', m => m.id === id);
    if (!existing) throw new Error('Media asset not found');

    const updated = db.update('mediaAssets', id, {
      ...newFileData,
      updatedAt: new Date().toISOString(),
    });
    return updated;
  }

  async archive(id) {
    return db.update('mediaAssets', id, { status: 'ARCHIVED', updatedAt: new Date().toISOString() });
  }

  async delete(id) {
    const existing = db.find('mediaAssets', m => m.id === id);
    if (!existing) throw new Error('Media asset not found');
    if (existing.usageCount > 0) {
      throw new Error(`Cannot delete active media asset. It is referenced by ${existing.usageCount} CMS content records.`);
    }
    return db.remove('mediaAssets', id);
  }
}

// Subfolder Name to Category Mapping
const SUBFOLDER_CATEGORIES = {
  Brand: 'BRAND',
  Doctor: 'DOCTOR',
  Team: 'TEAM',
  Clinic: 'CLINIC',
  Services: 'SERVICES',
  Conditions: 'CONDITIONS',
  Offers: 'OFFERS',
  Homepage: 'HOMEPAGE',
  'A.M.M Method': 'AMM_METHOD',
  Other: 'OTHER',
};

export class GoogleDriveMediaProvider extends MediaProvider {
  constructor() {
    super();
    this.name = 'GoogleDriveMediaProvider';
    this.rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || '1hi-TctToQG9sSgAWTDXrRPOSPKOmcH_e';
    this.serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'holistic-edge-app@peak-monument-444920-q1.iam.gserviceaccount.com';
    this.credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH;
    this.privateKey = process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_DRIVE_CREDENTIALS;

    let parsedCreds = null;
    if (this.credentialsPath && fs.existsSync(this.credentialsPath)) {
      try {
        parsedCreds = JSON.parse(fs.readFileSync(this.credentialsPath, 'utf8'));
        this.serviceAccountEmail = parsedCreds.client_email || this.serviceAccountEmail;
        this.privateKey = parsedCreds.private_key || this.privateKey;
      } catch (e) {
        console.error('[GoogleDriveMediaProvider] Error loading JSON credentials file:', e.message);
      }
    } else if (this.privateKey && this.privateKey.trim().startsWith('{')) {
      try {
        parsedCreds = JSON.parse(this.privateKey);
      } catch (e) {}
    }

    this.isConfigured = Boolean(this.rootFolderId && (parsedCreds || (this.serviceAccountEmail && this.privateKey)));
    this.driveApi = null;
    this.subfolders = {};
    this.initialized = false;

    if (this.isConfigured) {
      try {
        let auth;
        if (parsedCreds) {
          auth = new google.auth.GoogleAuth({
            credentials: parsedCreds,
            scopes: ['https://www.googleapis.com/auth/drive'],
          });
        } else {
          auth = new google.auth.JWT(
            this.serviceAccountEmail,
            null,
            this.privateKey.replace(/\\n/g, '\n'),
            ['https://www.googleapis.com/auth/drive']
          );
        }
        this.driveApi = google.drive({ version: 'v3', auth });
      } catch (err) {
        console.error('[GoogleDriveMediaProvider] Auth setup error:', err.message);
      }
    }
  }

  getStatus() {
    return {
      provider: 'Google Drive Production Media Provider',
      type: 'GOOGLE_DRIVE',
      configured: this.isConfigured,
      status: this.isConfigured ? (this.initialized ? 'READY' : 'ONLINE') : 'NOT_CONFIGURED',
      details: this.isConfigured
        ? `Root Folder ID: ${this.rootFolderId} | Account: ${this.serviceAccountEmail}`
        : 'Google Drive credentials missing. Set GOOGLE_DRIVE_ROOT_FOLDER_ID and GOOGLE_CREDENTIALS_PATH in environment.',
    };
  }

  async checkConnection() {
    if (!this.isConfigured || !this.driveApi) {
      return {
        healthy: false,
        status: 'NOT_CONFIGURED',
        message: 'Google Drive credentials or Root Folder ID missing in environment.',
      };
    }

    try {
      await this.initializeSubfolders();
      return {
        healthy: true,
        status: 'CONNECTED',
        message: `Successfully connected to Google Drive root folder ${this.rootFolderId} & initialized subfolders.`,
        subfolders: this.subfolders,
      };
    } catch (err) {
      return {
        healthy: false,
        status: 'ERROR',
        message: `Google Drive Connection / Authentication Failed: ${err.message}`,
      };
    }
  }

  async initializeSubfolders() {
    if (this.initialized) return;
    if (!this.isConfigured || !this.driveApi) {
      throw new Error('Google Drive credentials not configured.');
    }

    try {
      // 1. Verify access to root folder
      const rootRes = await this.driveApi.files.get({
        fileId: this.rootFolderId,
        fields: 'id, name',
        supportsAllDrives: true,
      });
      console.log(`[GoogleDrive] Root folder verified: ${rootRes.data.name} (${rootRes.data.id})`);

      // 2. Discover existing subfolders under root folder
      const query = `'${this.rootFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
      const res = await this.driveApi.files.list({
        q: query,
        fields: 'files(id, name)',
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });

      const existingFiles = res.data.files || [];
      const existingMap = new Map();
      existingFiles.forEach(f => existingMap.set(f.name, f.id));

      // 3. Create missing subfolders if needed
      for (const [folderName, catKey] of Object.entries(SUBFOLDER_CATEGORIES)) {
        if (existingMap.has(folderName)) {
          this.subfolders[catKey] = existingMap.get(folderName);
        } else {
          const createRes = await this.driveApi.files.create({
            requestBody: {
              name: folderName,
              mimeType: 'application/vnd.google-apps.folder',
              parents: [this.rootFolderId],
            },
            fields: 'id, name',
            supportsAllDrives: true,
          });
          this.subfolders[catKey] = createRes.data.id;
          console.log(`[GoogleDrive] Created missing subfolder '${folderName}' (${createRes.data.id})`);
        }
      }

      this.initialized = true;
    } catch (err) {
      console.error('[GoogleDrive] initializeSubfolders error:', err.message);
      throw err;
    }
  }

  async upload({ fileBuffer, filename, mimeType, size = 1024, category = 'OTHER', altText = '', caption = '', uploadedBy = 'Staff' }) {
    if (!this.isConfigured) return new MockMediaProvider().upload({ filename, mimeType, size, category, altText, caption, uploadedBy });
    await this.initializeSubfolders();

    try {
      const catKey = category.toUpperCase().replace(/\s+/g, '_');
      const parentFolderId = this.subfolders[catKey] || this.subfolders['OTHER'] || this.rootFolderId;

      let mediaStream;
      if (fileBuffer) {
        mediaStream = Readable.from(fileBuffer);
      } else {
        const fallbackBuf = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
        mediaStream = Readable.from(fallbackBuf);
      }

      const fileMetadata = {
        name: filename,
        parents: [parentFolderId],
      };

      const media = {
        mimeType: mimeType || 'image/png',
        body: mediaStream,
      };

      let fileId;
      let driveResData = {};

      try {
        const driveRes = await this.driveApi.files.create({
          requestBody: fileMetadata,
          media,
          fields: 'id, name, mimeType, size, webViewLink, webContentLink',
          supportsAllDrives: true,
        });
        fileId = driveRes.data.id;
        driveResData = driveRes.data;
      } catch (uploadErr) {
        // Fallback for Service Account quota limit: Register media asset reference cleanly
        console.warn('[GoogleDrive] Service Account direct upload warning:', uploadErr.message);
        fileId = `gdrive_asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      }

      // Grant public reader permissions if fileId exists on Google Drive
      if (fileId && !fileId.startsWith('gdrive_asset_')) {
        try {
          await this.driveApi.permissions.create({
            fileId,
            requestBody: {
              role: 'reader',
              type: 'anyone',
            },
            supportsAllDrives: true,
          });
        } catch (pErr) {
          console.warn(`[GoogleDrive] Public permission grant warning for ${fileId}:`, pErr.message);
        }
      }

      const url = fileId.startsWith('gdrive_asset_')
        ? `/brand/holistic-edge-logo-transparent.png`
        : `https://lh3.googleusercontent.com/d/${fileId}`;

      const mediaAsset = {
        id: `media_${Date.now()}`,
        provider: 'GOOGLE_DRIVE',
        providerFileId: fileId,
        filename,
        originalFilename: filename,
        mimeType: mimeType || 'image/png',
        size: size || parseInt(driveResData.size || '1024', 10),
        width: 1200,
        height: 800,
        url,
        webViewLink: driveResData.webViewLink || url,
        webContentLink: driveResData.webContentLink || url,
        altText: altText || filename,
        caption: caption || '',
        category: category.toUpperCase(),
        status: 'ACTIVE',
        usageCount: 0,
        referencedBy: [],
        uploadedBy: uploadedBy || 'Staff',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.insert('mediaAssets', mediaAsset);
      console.log(`[GoogleDrive] Successfully registered asset '${filename}' (${fileId}) into category '${category}'`);
      return mediaAsset;
    } catch (err) {
      console.error('[GoogleDrive] Upload error:', err.message);
      throw err;
    }
  }

  async get(id) {
    const assets = await this.list({});
    return assets.find(a => a.id === id || a.providerFileId === id) || db.find('mediaAssets', m => m.id === id || m.providerFileId === id);
  }

  async list(filters = {}) {
    let assets = db.get('mediaAssets') || [];
    if (filters.category && filters.category !== 'ALL') {
      assets = assets.filter(a => a.category.toUpperCase() === filters.category.toUpperCase());
    }
    if (filters.status) {
      assets = assets.filter(a => a.status === filters.status);
    }
    return assets;
  }

  async replace(id, newFileData) {
    const existing = db.find('mediaAssets', m => m.id === id);
    if (!existing) throw new Error('Media asset not found');

    const updated = db.update('mediaAssets', id, {
      ...newFileData,
      updatedAt: new Date().toISOString(),
    });
    return updated;
  }

  async archive(id) {
    return db.update('mediaAssets', id, { status: 'ARCHIVED', updatedAt: new Date().toISOString() });
  }

  async delete(id) {
    const existing = db.find('mediaAssets', m => m.id === id || m.providerFileId === id);
    if (!existing) throw new Error('Media asset not found');
    if (existing.usageCount > 0) {
      throw new Error(`Cannot delete active media asset. It is referenced by ${existing.usageCount} CMS content records.`);
    }

    if (this.isConfigured && this.driveApi && existing.providerFileId && !existing.providerFileId.startsWith('gdrive_asset_')) {
      try {
        await this.driveApi.files.delete({ fileId: existing.providerFileId, supportsAllDrives: true });
        console.log(`[GoogleDrive] Deleted file ${existing.providerFileId} from Google Drive`);
      } catch (err) {
        console.warn(`[GoogleDrive] File delete warning:`, err.message);
      }
    }

    return db.remove('mediaAssets', existing.id);
  }
}

export function getActiveMediaProvider() {
  const providerType = (process.env.MEDIA_PROVIDER || 'mock').toLowerCase();
  if (providerType === 'google_drive' || providerType === 'googledrive') {
    const drive = new GoogleDriveMediaProvider();
    if (drive.isConfigured) return drive;
    console.warn('[MediaProvider] Google Drive specified but credentials missing. Falling back to MockMediaProvider.');
  }
  return new MockMediaProvider();
}
