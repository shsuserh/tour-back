import { IsString, IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginRequestDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  password!: string;
}

@Exclude()
export class RefreshAccessTokenRequestDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
