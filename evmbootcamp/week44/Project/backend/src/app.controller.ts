import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokenDto } from './dtos/mintToken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('contract-address')
  getContractAddress(){
    return {result: this.appService.getContractAddress()};
  }

  @Get('token-name')
  async getTokenName() {
    return {result: await this.appService.getTokenName()};
  }
  @Get('total-supply')
  async getTotalSupply() {
    return {result: await this.appService.getTotalSupply()};
  }

  @Get('token-balance/:address')
  async getTokenBalance(@Param('address') address: string) {
    return {result: await this.appService.getTokenBalance(address)};
  }

  @Get('transaction-receipt')
  async getTransactionReceipt(@Query('hash') hash: string) {
    return {result: await this.appService.getTransactionReceipt(hash)};
  }
  @Get('server-wallet-address')
  getServerWalletAddress() {
    return {result: this.appService.getServerWalletAddress()};
  }

  @Get('check-minter-role')
  async checkMinterRole(@Query('address') address: string) {
    return {result: await this.appService.checkMinterRole(address)};
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body: MintTokenDto) {
    try {
      console.log('Minting tokens:', body);
      const result = await this.appService.mintTokens(body);
      return result;
    } catch (error) {
      console.error('Error in mintTokens:', error);
      return {
        result: false,
        message: 'Internal server error',
        error: error.message,
      };
    }
  }

  @Get('winner-proposal')
  async getWinningProposal() {
    return {result: await this.appService.Getwinner()};
  }

  @Get('list-proposal/:proposal')
  async getTokegetProposalsnBalance(@Param('proposal') proposal: string) {
    return {result: await this.appService.getProposals(proposal)};
  }
}