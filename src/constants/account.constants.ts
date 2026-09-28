export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // link valid for 1 hour
export const PASSWORD_RESET_RESEND_MS = 60 * 1000; // at most one email per minute per account

export const SITE_LANGUAGES = ['hy', 'en', 'ru'] as const;
export type SiteLanguage = (typeof SITE_LANGUAGES)[number];

export const PASSWORD_RESET_EMAIL: Record<SiteLanguage, { subject: string; text: (link: string) => string }> = {
  hy: {
    subject: 'Գաղտնաբառի վերականգնում — Arev Travel',
    text: (link) =>
      `Գաղտնաբառը փոխելու համար անցեք հղումով (գործում է 1 ժամ).\n\n${link}\n\nԵթե դուք չեք պահանջել վերականգնում, անտեսեք այս նամակը։`,
  },
  en: {
    subject: 'Reset your password — Arev Travel',
    text: (link) =>
      `Use this link to set a new password (valid for 1 hour):\n\n${link}\n\nIf you didn't ask for a reset, you can ignore this email.`,
  },
  ru: {
    subject: 'Восстановление пароля — Arev Travel',
    text: (link) =>
      `Чтобы задать новый пароль, перейдите по ссылке (действует 1 час):\n\n${link}\n\nЕсли вы не запрашивали восстановление, просто проигнорируйте это письмо.`,
  },
};
