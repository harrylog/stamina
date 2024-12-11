import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../dto';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);

//pull the user off of the request, after the verifyUser , the user is loaded on the request obj
// just like in brad's masterclass
