import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('create-order')
  createOrder(@Req() req, @Body() dto) {
    console.log(dto);

    return this.paymentService.createOrder(req.user.id, dto);
  }

  @Post('verify')
  verifyPayment(@Req() req, @Body() dto) {
    return this.paymentService.verifyPayment(req.user.id, dto);
  }
  @Get('alltoken')
  getAllTokens(@Req() req) {
    return this.paymentService.Getalltoken(req.user.id);
  }

}
