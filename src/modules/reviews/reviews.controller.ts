import { Body, Controller, Delete, Param, Post, Req, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post("create/:revieweeId")
  async Create(@Body() body, @Param("revieweeId") reviewid, @Req() req) {

    return await this.reviewsService.create(reviewid, req.user.id, body)
  }

  @Get("getall/:revieweeId")
  async Getall(@Param("revieweeId") reviewID) {

    return await this.reviewsService.findAllForReviewee(reviewID)

  }
  @Delete("delete/:id")
  async delete(@Param("id") id, @Req() req) {
    await this.reviewsService.delete(id, req.user.id)


  }
}
