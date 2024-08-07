export enum ErrorCode {
  Unauthorized = "unauthorized-access",
  BadRequest = "bad-reqest",
  RoomExists = "room-exists",
  UserExists = "user-exists",
  UserAlreadyTyped = "user-already-typed",
  TutorHasNoTime = "tutor-has-no-time",
  Unexpected = "unexpected",
  NotFound = "not-found",
  UserNotFound = "user-not-found",
  SlotNotFound = "slot-not-found",
  TutorNotFound = "tutor-not-found",
  LessonNotFound = "lesson-not-found",
  ratingNotFound = "rating-not-found",
  subscriptionNotFound = "subscription-not-found",
  AlreadyRated = "already-rated",
  AlreadySubscribed = "already-subscribed",
}

type CodedError = {
  message: string;
  code: ErrorCode;
};

export const errors = {
  fobidden: { message: "Unauthorized access", code: ErrorCode.Unauthorized },
  badRequest: { message: "Bad Request", code: ErrorCode.BadRequest },
  roomExists: { message: "Room already exist", code: ErrorCode.RoomExists },
  userExists: { message: "User already exist", code: ErrorCode.UserExists },
  userAlreadyTyped: {
    message: "User already typed",
    code: ErrorCode.UserAlreadyTyped,
  },
  tutorHasNotTime: {
    message: "Tutor doesn't have the time for this lesson",
    code: ErrorCode.TutorHasNoTime,
  },
  unexpected: {
    message: "Unexpected error occurred, please retry",
    code: ErrorCode.Unexpected,
  },
  notFound: { message: "Not found", code: ErrorCode.NotFound },
  userNotFound: { message: "User not found", code: ErrorCode.UserNotFound },
  slotNotFound: { message: "Slot not found", code: ErrorCode.SlotNotFound },
  tutorNotFound: { message: "Tutor not found", code: ErrorCode.TutorNotFound },
  lessonNotFound: {
    message: "Lesson not found",
    code: ErrorCode.LessonNotFound,
  },
  ratingNotFound: {
    message: "Rating not found",
    code: ErrorCode.ratingNotFound,
  },
  subscriptionNotFound: {
    message: "Subscription not found",
    code: ErrorCode.subscriptionNotFound,
  },
  alreadyRated: {
    message: "User already rated",
    code: ErrorCode.AlreadyRated,
  },
  alreadySubscribed: {
    message: "Student already subscribed",
    code: ErrorCode.AlreadySubscribed,
  },
} as const;

export default class ResponseError extends Error {
  statusCode: number;
  errorCode: ErrorCode;

  constructor(error: CodedError, statusCode: number) {
    super(error.message);
    this.statusCode = statusCode;
    this.errorCode = error.code;
  }
}

export const forbidden = () => new ResponseError(errors.fobidden, 401);
export const notfound = () => new ResponseError(errors.notFound, 404);
export const badRequest = () => new ResponseError(errors.badRequest, 400);
export const roomExists = () => new ResponseError(errors.roomExists, 400);
export const userExists = () => new ResponseError(errors.userExists, 400);
export const userAlreadyTyped = () =>
  new ResponseError(errors.userAlreadyTyped, 400);
export const tutorHasNoTime = () =>
  new ResponseError(errors.tutorHasNotTime, 400);
export const userNotFound = () => new ResponseError(errors.userNotFound, 404);
export const slotNotFound = () => new ResponseError(errors.slotNotFound, 404);
export const tutorNotFound = () => new ResponseError(errors.tutorNotFound, 404);
export const callNotFound = () => new ResponseError(errors.lessonNotFound, 404);
export const ratingNotFound = () =>
  new ResponseError(errors.ratingNotFound, 404);
export const alreadyRated = () => new ResponseError(errors.alreadyRated, 400);
export const alreadySubscribed = () =>
  new ResponseError(errors.alreadySubscribed, 400);
export const subscriptionNotFound = () =>
  new ResponseError(errors.subscriptionNotFound, 404);
