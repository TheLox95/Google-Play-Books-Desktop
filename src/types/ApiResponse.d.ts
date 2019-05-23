export interface ApiResponse {
    kind: string;
    totalItems: number;
    items?: (Book)[] | null;
  }
  export interface Book {
    kind: string;
    id: string;
    etag: string;
    selfLink: string;
    volumeInfo: VolumeInfo;
    userInfo: UserInfo;
    saleInfo: SaleInfo;
    accessInfo: AccessInfo;
  }
  export interface VolumeInfo {
    title: string;
    authors?: (string)[] | null;
    publisher?: string | null;
    description?: string | null;
    readingModes: ReadingModes;
    printType?: string | null;
    maturityRating: string;
    allowAnonLogging: boolean;
    contentVersion: string;
    imageLinks: ImageLinks;
    previewLink: string;
    infoLink?: string | null;
    canonicalVolumeLink?: string | null;
    publishedDate?: string | null;
  }
  export interface ReadingModes {
    text: boolean;
    image: boolean;
  }
  export interface ImageLinks {
    smallThumbnail: string;
    thumbnail: string;
  }
  export interface UserInfo {
    copy: Copy;
    isPurchased: boolean;
    isUploaded: boolean;
    isInMyBooks: boolean;
    updated: string;
    acquiredTime: string;
    userUploadedVolumeInfo: UserUploadedVolumeInfo;
    entitlementType: number;
  }
  export interface Copy {
    limitType: string;
  }
  export interface UserUploadedVolumeInfo {
    processingState: string;
  }
  export interface SaleInfo {
    country: string;
    saleability: string;
    isEbook: boolean;
    buyLink?: string | null;
  }
  export interface AccessInfo {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;
    epub?: DonwloadData | null;
    webReaderLink: string;
    accessViewStatus: string;
    quoteSharingAllowed: boolean;
    pdf?: DonwloadData | null;
  }
  export interface DonwloadData {
    isAvailable: boolean;
    downloadLink: string;
  }
  