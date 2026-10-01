export interface EnvironmentVariable {
    DATABASE_HOST: string;
    DATABASE_PORT: string;
    DATABASE_NAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_USER: string;

}

export enum AuthProvider {
    OTP = "OTP",
    APPLE = "APPLE",
    GOOGLE = "GOOGLE"


}

// export enum Rollenum {
//     ADMIN = 'ADMIN',
//     USER = 'USER',
//     SELLER = 'SELLER',
// }
export enum userRole {
    CREATOR = "creator",
    ADMIN = "admin",
    BUSINESS = "business",
    COLLABORATOR = "collaborator"
}

export enum SocialPlatform {
    INSTAGRAM = "INSTAGRAM",
    YOUTUBE = "YOUTUBE",
    FACEBOOK = "FACEBOOK",
    X = "X",
    TIKTOK = "TIKTOK",
    LINKEDIN = "LINKEDIN",
    SNAPCHAT = "SNAPCHAT",
    PINTEREST = "PINTEREST",
    THREADS = "THREADS",
}

export enum CollaborationType {
    BARTER = 'barter',
    PAID = 'paid',
    AFFILIATE = 'affiliate',
}

export enum CampaignStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    PAUSED = 'paused',
    CLOSED = 'closed',
    ARCHIVED = 'archived',
}
export enum InitiatorType {
    CREATOR = 'creator',
    BUSINESS = 'business',
}

export enum RequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    WITHDRAWN = 'withdrawn',
    EXPIRED = 'expired',
}
