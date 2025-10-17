import { UserRole } from '../datatypes/enums/enums';

export const USER_SUCCESS_MESSAGES = {
  deleteUserSuccess: 'Օգտատերի հեռացումը հաջողությամբ կատարվել է',
  addUserSuccess: 'Օգտատերը հաջողությամբ ավելացված է',
};

export const USER_ERROR_MESSAGES = {
  notFoundErrorMessage: 'Օգտատերը չի գտնվել',
  requesterAndTheUserToDeleteAreTheSameErrorMessage: 'Ենթակա չէ հեռացման',
  userAlreadyExistsErrorMessage: 'Օգտատերն արդեն ավելացված է',
};

export const CreateUserRole = UserRole.admin;
