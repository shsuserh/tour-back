export type CesTemplateGeneratePayload = {
  cesForm: CesTemplateGenerateTags[];
  yid?: string;
  uid?: string;
};

export type CesTemplateGenerateTags = {
  key: string;
  value: string | string[];
};

export type ParentPath = {
  id: string;
  name: string;
};

export type CesDocumentSubmitData = {
  yid?: string;
  uid?: string;
  details?: CesDocumentSubmitDetailsPayload;
};

export type CesDocumentSubmitDetailsPayload = {
  name?: string;
  lastname?: string;
  ssn?: string;
  email?: string;
  phone?: string;
  address?: string;
  tin?: string;
  company_name?: string;
  company_type?: string;
};

export type CesDocumentSubmitDetails = {
  name?: string;
  lastname?: string;
  ssn?: string;
  email?: string;
  phone?: string;
  address?: string;
  tin?: string;
  companyName?: string;
  companyType?: string;
};

export type CesDocumentSubmitUserDetailsPayload = {
  name: string;
  lastname: string;
  ssn: string;
  email: string;
  phone: string;
  address: string;
  cesName: string;
};

export type CesDocumentSubmitCompanyDetailsPayload = {
  tin: string;
  companyName: string;
  cesName: string;
  phone: string;
  email: string;
  address: string;
  companyType?: string;
  ssn?: string;
};
