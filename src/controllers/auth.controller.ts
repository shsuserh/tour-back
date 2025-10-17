import { Request, Response } from 'express';
import authService from '../services/auth.service';
import serializeResponse from '../utils/serializeResponse';
import { validateDto } from '../utils/validationErrorHandler';
import { plainToInstance } from 'class-transformer';
import { LoginRequestDto, RefreshAccessTokenRequestDto } from '../datatypes/dtos/request/auth.request.dto';
import { RequestWithUser } from '../datatypes/internal/common';

export class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    const authRequestDto = plainToInstance(LoginRequestDto, req.body);
    await validateDto(authRequestDto);
    const session = req.headers['user-agent']!;
    const url = req.get('Referer') || '';
    const tokenResponse = await authService.authenticateUser(authRequestDto, session, url);
    return res.status(200).json(serializeResponse({ responseData: tokenResponse }));
  }

  async refreshAccessToken(req: Request, res: Response): Promise<Response> {
    const refreshAccessTokenDto = plainToInstance(RefreshAccessTokenRequestDto, req.body);
    await validateDto(refreshAccessTokenDto);

    const session = req.headers['user-agent']!;
    const { accessToken, refreshToken } = await authService.refreshAccessToken(
      refreshAccessTokenDto.refreshToken,
      session
    );
    return res.status(200).json(serializeResponse({ responseData: { accessToken, refreshToken } }));
  }


  async logout(req: RequestWithUser, res: Response): Promise<Response> {
    const session = req.headers['user-agent']!;
    await authService.logout(session, req.user.id);
    return res.status(200).json(serializeResponse({}));
  }
}

const authController = new AuthController();
export default authController;
