export interface Comment {
  address1: string | null; 
  address2: string | null;
  agencyId: string; 
  attachments: {
    attributes: {
      fileFormats: {
        fileUrl: string;
        format: string;
      }[];
      title: string;
    };
  }[];
  category: string | null;
  city: string;
  comment: string;
  commentOn: string | null;
  commentOnDocumentId: string | null;
  country: string;
  displayProperties: string | null;
  docAbstract: string| null;
  docketId: string; 
  documentType: string;
  duplicateComments: number;
  email: string | null;
  fax: string | null;
  field1: string | null;
  field2: string | null;
  fileFormats: string | null;
  firstName: string | null;
  govAgency: string | null;
  govAgencyType: string | null;
  id: string;
  lastName: string;
  legacyId: number | null;
  modifyDate: string | null;
  objectId: string;
  openForComment: boolean;
  organization: string | null;
  originalDocumentId: string | null;
  pageCount: number;
  phone: string | null;
  postedDate: string | null;
  postmarkDate: string | null;
  reasonWithdrawn: string | null;
  receiveDate: string | null;
  restrictReason: string | null;
  restrictReasonType: string | null;
  stateProvinceRegion: string;
  submitterRep: string | null;
  submitterRepAddress: string | null;
  submitterRepCityState: string | null;
  subtype: string;
  title: string;
  trackingNbr: string; 
  withdrawn: boolean; 
  zip: string;
}

export type StringObject = {[Property in keyof Comment]:string}
