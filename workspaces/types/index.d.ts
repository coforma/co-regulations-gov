export type Nullable<T> = T | null;

export interface Comment {
  address1: Nullable<string>;
  address2: Nullable<string>;
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
  category: Nullable<string>;
  city: string;
  comment: string;
  commentOn: Nullable<string>;
  commentOnDocumentId: Nullable<string>;
  country: string;
  displayProperties: Nullable<string>;
  docAbstract: Nullable<string>;
  docketId: string;
  documentType: string;
  duplicateComments: number;
  email: Nullable<string>;
  fax: Nullable<string>;
  field1: Nullable<string>;
  field2: Nullable<string>;
  fileFormats: Nullable<string>;
  firstName: Nullable<string>;
  govAgency: Nullable<string>;
  govAgencyType: Nullable<string>;
  id: string;
  lastName: string;
  legacyId: Nullable<number>;
  modifyDate: Nullable<string>;
  objectId: string;
  openForComment: boolean;
  organization: Nullable<string>;
  originalDocumentId: Nullable<string>;
  pageCount: number;
  phone: Nullable<string>;
  postedDate: Nullable<string>;
  postmarkDate: Nullable<string>;
  reasonWithdrawn: Nullable<string>;
  receiveDate: Nullable<string>;
  restrictReason: Nullable<string>;
  restrictReasonType: Nullable<string>;
  stateProvinceRegion: string;
  submitterRep: Nullable<string>;
  submitterRepAddress: Nullable<string>;
  submitterRepCityState: Nullable<string>;
  subtype: string;
  title: string;
  trackingNbr: string;
  withdrawn: boolean;
  zip: string;
}

export type CommentKeys = { [Property in keyof Comment]: string };
