-- Partner integrations table
CREATE TABLE partner_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id),
  partner_name VARCHAR(255) NOT NULL,
  partner_type VARCHAR(50) NOT NULL CHECK (partner_type IN ('pharmacy', 'lab', 'imaging', 'hospital', 'insurance')),
  api_endpoint VARCHAR(500),
  api_key_encrypted TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EDI transactions table
CREATE TABLE edi_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id),
  transaction_type VARCHAR(50) NOT NULL, -- 270, 271, 837, etc.
  edi_content TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  response_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_edi_transactions_org_status ON edi_transactions(org_id, status);
CREATE INDEX idx_partner_integrations_org ON partner_integrations(org_id);