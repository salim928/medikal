-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Create organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  tax_id VARCHAR(20) UNIQUE,
  address JSONB,
  settings JSONB,
  stripe_customer_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'provider', 'admin', 'clinic_staff')),
  auth_provider VARCHAR(50) NOT NULL,
  web3_address VARCHAR(42) UNIQUE,
  encrypted_private_key TEXT,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  profile_picture_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_web3_address ON users(web3_address);

-- ... (continue with all other tables from schema.ts)

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY users_own_data ON medical_records
  USING (patient_id = auth.uid())
  WITH CHECK (patient_id = auth.uid());