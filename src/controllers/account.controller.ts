import { Request, Response } from 'express';
import accountService from '../services/account.service';
import { validateAndExtractDto } from '../utils/validationErrorHandler';
import { RequestWithUser } from '../datatypes/internal/common';
import {
  AccountLoginRequestDto,
  AccountRegisterRequestDto,
  AccountUpdateRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
} from '../datatypes/dtos/request/account.request.dto';

export class AccountController {
  async register(req: Request, res: Response): Promise<Response> {
    const dto = await validateAndExtractDto(AccountRegisterRequestDto, req.body);
    return res.status(201).json(await accountService.register(dto, req.headers['user-agent']!));
  }

  async login(req: Request, res: Response): Promise<Response> {
    const dto = await validateAndExtractDto(AccountLoginRequestDto, req.body);
    return res.status(200).json(await accountService.login(dto, req.headers['user-agent']!));
  }

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    const dto = await validateAndExtractDto(ForgotPasswordRequestDto, req.body);
    await accountService.forgotPassword(dto);
    return res.status(204).end();
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    const dto = await validateAndExtractDto(ResetPasswordRequestDto, req.body);
    return res.status(200).json(await accountService.resetPassword(dto, req.headers['user-agent']!));
  }

  async getMe(req: RequestWithUser, res: Response): Promise<Response> {
    return res.status(200).json(await accountService.getMe(req.user.id));
  }

  async updateMe(req: RequestWithUser, res: Response): Promise<Response> {
    const dto = await validateAndExtractDto(AccountUpdateRequestDto, req.body);
    return res.status(200).json(await accountService.updateMe(req.user.id, dto));
  }
}

const accountController = new AccountController();
export default accountController;
