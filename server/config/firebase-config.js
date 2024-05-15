import admin from 'firebase-admin'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serviceAccountKey = JSON.parse(fs.readFileSync(path.join(__dirname, './serviceAccountKey.json'), 'utf8'))

const { privateKey } = JSON.parse(process.env.PRIVATE_KEY)

serviceAccountKey.type = process.env.TYPE
serviceAccountKey.project_id = process.env.PROJECT_ID
serviceAccountKey.private_key_id = process.env.PRIVATE_KEY_ID
serviceAccountKey.private_key = privateKey
serviceAccountKey.client_email = process.env.CLIENT_EMAIL
serviceAccountKey.client_id = process.env.CLIENT_ID
serviceAccountKey.auth_uri = process.env.AUTH_URI
serviceAccountKey.token_uri = process.env.TOKEN_URI
serviceAccountKey.auth_provider_x509_cert_url = process.env.AUTH_PROVIDER_X509_CERT_URL
serviceAccountKey.client_x509_cert_url = process.env.CLIENT_X509_CERT_URL
serviceAccountKey.universe_domain = process.env.UNIVERSE_DOMAIN

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  storageBucket: process.env.STORAGE_BUCKED
});

export default admin