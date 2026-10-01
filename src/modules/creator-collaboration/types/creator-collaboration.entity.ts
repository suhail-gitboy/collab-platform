import { ResponderType, ResponseStatus } from "../Models/Creator-collaboration";

// import { ResponderType, ResponseStatus } from "../model/collaboration-response.model";

export interface QueryCollaborationResponseParams {
    collaboration_post_id?: string;
    responder_type?: ResponderType;
    status?: ResponseStatus;
}
