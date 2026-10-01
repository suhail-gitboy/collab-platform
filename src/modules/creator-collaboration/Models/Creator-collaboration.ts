import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    PrimaryKey,
    Default,
    CreatedAt,
    BeforeValidate,
} from "sequelize-typescript";

import BusinessProfile from "src/modules/business-side/model/busines.modelmain";
import CollaborationPost from "./Creator-collaboration.request";
import CreatorProfile from "src/modules/creator_profile/model/model";

export enum ResponderType {
    CREATOR = "creator",
    BUSINESS = "business",
}

export enum ResponseStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
}

@Table({
    tableName: "creator_collaboration_responses",
    timestamps: true,
    updatedAt: false,
})
export class CollaborationResponse extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare id: string;


    // Collaboration Post
    @ForeignKey(() => CollaborationPost)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare collaboration_post_id: string;

    @BelongsTo(() => CollaborationPost)
    declare post?: CollaborationPost;


    // Who responded?
    @Column({
        type: DataType.ENUM(...Object.values(ResponderType)),
        allowNull: false,
    })
    declare responder_type: ResponderType;


    // Creator Profile
    @ForeignKey(() => CreatorProfile)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    declare responder_creator_id?: string;

    @BelongsTo(() => CreatorProfile)
    declare responding_creator?: CreatorProfile;


    // Business Profile
    @ForeignKey(() => BusinessProfile)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    declare responder_business_id?: string;

    @BelongsTo(() => BusinessProfile)
    declare responding_business?: BusinessProfile;


    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare message?: string;


    @Column({
        type: DataType.ENUM(...Object.values(ResponseStatus)),
        allowNull: false,
        defaultValue: ResponseStatus.PENDING,
    })
    declare status: ResponseStatus;


    @CreatedAt
    @Column({ field: "created_at" })
    declare created_at: Date;


    @BeforeValidate
    static assertResponderMatchesType(instance: CollaborationResponse) {

        if (instance.responder_type === ResponderType.CREATOR) {

            if (
                !instance.responder_creator_id ||
                instance.responder_business_id
            ) {
                throw new Error(
                    "Creator response requires responder_creator_id only"
                );
            }

        } else if (instance.responder_type === ResponderType.BUSINESS) {

            if (
                !instance.responder_business_id ||
                instance.responder_creator_id
            ) {
                throw new Error(
                    "Business response requires responder_business_id only"
                );
            }
        }
    }
}

export default CollaborationResponse;