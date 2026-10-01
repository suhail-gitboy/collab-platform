
export class CreateCreatorProfileDto {
    display_name: string;

    bio?: string;

    profile_photo_url?: string;

    cover_photo_url?: string;

    city?: string;

    state?: string;

    country?: string;

    latitude: number;

    longitude: number;

    pricing_min?: number;

    pricing_max?: number;

    currency?: string;

    accepts_paid?: boolean;

    accepts_barter?: boolean;

    accepts_affiliate?: boolean;

    accepts_events?: boolean;
}