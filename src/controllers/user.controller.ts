import { Response } from 'express';
import userService from '../services/user.service';
import serializeResponse from '../utils/serializeResponse';
import { RequestWithUser } from '../datatypes/internal/common';
import { validateAndExtractDto } from '../utils/validationErrorHandler';
import { CreateUserRequestDto } from '../datatypes/dtos/request/user.request.dto';
import { IdDto } from '../datatypes/dtos/request/common.dto';
import { USER_SUCCESS_MESSAGES } from '../constants/user.constants';

export class UserController {
  async addUser(req: RequestWithUser, res: Response): Promise<Response> {
    const userDto = await validateAndExtractDto(CreateUserRequestDto, req.body);

    await userService.createUser(userDto);
    return res
      .status(200)
      .json(
        serializeResponse({ responseData: { toaster: true, toasterSuccess: [USER_SUCCESS_MESSAGES.addUserSuccess] } })
      );
  }

  async removeUser(req: RequestWithUser, res: Response): Promise<Response> {
    await validateAndExtractDto(IdDto, req.params);
    return res.status(200).json(
      serializeResponse({
        responseData: { toaster: true, toasterSuccess: [USER_SUCCESS_MESSAGES.deleteUserSuccess] },
      })
    );
  }
}

const userController = new UserController();
export default userController;
