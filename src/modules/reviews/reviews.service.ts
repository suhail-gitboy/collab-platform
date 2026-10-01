import { Injectable, InternalServerErrorException, ForbiddenException, NotFoundException } from '@nestjs/common';

import Review from './model/review.business';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ReviewsService {


    constructor(
        @InjectModel(Review)
        private reviewModel: typeof Review,
    ) { }

    async create(revieweeId: string, reviewerId: string, dto) {
        if (revieweeId === reviewerId) {
            throw new ForbiddenException("You can't review yourself");
        }

        try {
            return await this.reviewModel.create({
                reviewee_id: revieweeId,
                reviewer_id: reviewerId,
                collaboration_request_id: dto.collaboration_request_id,
                rating: dto.rating,
                comment: dto.comment,
            });
        } catch (err) {

            throw new InternalServerErrorException("err", err)

        }
    }
    async delete(id: string, requesterId: string) {
        const review = await this.reviewModel.findByPk(id);

        if (!review) {
            throw new NotFoundException("Review not found");
        }

        if (review.reviewer_id !== requesterId) {
            throw new ForbiddenException("You can only delete your own review");
        }

        await review.destroy();
        return { success: true };
    }
    async findAllForReviewee(revieweeId: string) {
        return this.reviewModel.findAll({
            where: { reviewee_id: revieweeId },
            order: [["created_at", "DESC"]],
        });
    }
}
