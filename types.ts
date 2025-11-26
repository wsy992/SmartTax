export enum Role {
  ENTERPRISE = 'ENTERPRISE',
  TAX_OFFICIAL = 'TAX_OFFICIAL',
}

export enum DeclarationStatus {
  DRAFT = 'Draft',
  PROCESSING = 'Processing', // OCR/Parsing
  VALIDATING = 'Validating', // Rule Engine
  RISK_CHECK = 'Risk Check', // Risk Model
  AUDIT_REQUIRED = 'Audit Required',
  CLEARED = 'Cleared',
}

export type Page = 'dashboard' | 'list' | 'tracking' | 'audit' | 'risk' | 'anomalies' | 'settings';
export type Language = 'en' | 'cn';

export interface Declaration {
  id: string;
  companyName: string;
  submitDate: string;
  amount: number;
  currency: string;
  status: DeclarationStatus;
  riskScore: number; // 0-100
  anomalies: string[];
  documents: string[]; // e.g., "Invoice.pdf"
  goodsType: string;
  hsCode: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface PolicyAlert {
  id: string;
  title: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}