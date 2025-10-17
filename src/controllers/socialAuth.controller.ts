import { Request, Response } from 'express';
import { RequestWithUser } from '../datatypes/internal/common';
import socialAuthService from '../services/socialAuth.service';
import serializeResponse from '../utils/serializeResponse';
import { SocialProvider } from '../datatypes/enums/enums';

export class SocialAuthController {
  async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      const profile = req.user as {
        id: string;
        emails?: Array<{ value: string }>;
        displayName?: string;
        name?: { givenName?: string; familyName?: string };
        photos?: Array<{ value: string }>;
      };
      const session = req.headers['user-agent']!;

      const socialProfile = {
        provider: SocialProvider.GOOGLE,
        providerId: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        picture: profile.photos?.[0]?.value,
        rawData: profile,
      };

      const tokenResponse = await socialAuthService.findOrCreateUser(socialProfile, session);

      // Redirect to frontend with tokens
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?accessToken=${tokenResponse.accessToken}&refreshToken=${tokenResponse.refreshToken}`;
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google auth error:', error);
      const errorUrl = `${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('Authentication failed')}`;
      return res.redirect(errorUrl);
    }
  }

  // Facebook callback - Removed due to review requirements

  // Instagram callback - Removed due to Facebook platform requirements

  async getUserSocialAuths(req: RequestWithUser, res: Response): Promise<Response> {
    const socialAuths = await socialAuthService.getUserSocialAuths(req.user.id);
    return res.status(200).json(serializeResponse({ responseData: socialAuths }));
  }

  async unlinkSocialAuth(req: RequestWithUser, res: Response): Promise<Response> {
    const { provider } = req.params;
    await socialAuthService.unlinkSocialAuth(req.user.id, provider as SocialProvider);
    return res.status(200).json(
      serializeResponse({
        responseData: { message: 'Social authentication unlinked successfully' },
      })
    );
  }
}

const socialAuthController = new SocialAuthController();
export default socialAuthController;
