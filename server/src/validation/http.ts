import zod from "zod";
import {
  optionalString,
  rating,
  id,
  password,
  email,
  name,
  weekday,
  time,
  date,
  repeat,
  url,
  datetime,
  string,
  subscriptionPeriod,
  gender,
  identityObject,
  callType,
  callSize,
} from "@/validation/utils";
import { IUser } from "@litespace/types";

const avatar = zod.union([zod.null(), zod.string().trim()], {
  message: "Invalid avatar",
});

const user = {
  create: zod.object(
    {
      email,
      password,
      name,
      type: zod.enum([
        IUser.Type.SuperAdmin,
        IUser.Type.RegularAdmin,
        IUser.Type.Examiner,
      ]),
    },
    { message: "Empty request body" }
  ),
  update: {
    body: zod.object({
      id,
      email: zod.optional(email),
      password: zod.optional(password),
      name: zod.optional(name),
      avatar: zod.optional(zod.string()),
      gender: zod.optional(gender),
      birthday: zod.optional(date),
      type: zod.optional(zod.enum([IUser.Type.Tutor, IUser.Type.Student])),
    }),
  },
  delete: { query: zod.object({ id }) },
  findById: { params: zod.object({ id }) },
  login: { body: zod.object({ email, password }) },
} as const;

const auth = {
  header: zod.object({
    authorization: zod
      .string({ message: "Invalid authorization header" })
      .startsWith("Bearer", "Invalid bearer token")
      .trim(),
  }),
  localAuthorization: zod.object({ email, password }),
} as const;

const slot = {
  create: zod.object({
    title: zod.string().trim(),
    weekday,
    time: zod.object({ start: time, end: time }),
    date: zod.object({ start: date, end: zod.optional(date) }),
    repeat,
  }),
  update: {
    params: zod.object({ id }),
    body: zod.object({
      title: optionalString,
      description: optionalString,
      weekday: zod.optional(weekday),
      time: zod.optional(
        zod.object({ start: zod.optional(time), end: zod.optional(time) })
      ),
      date: zod.optional(
        zod.object({ start: zod.optional(date), end: zod.optional(date) })
      ),
    }),
  },
  get: { params: zod.object({ id }) },
  delete: { params: zod.object({ id }) },
  getDiscreteTimeSlots: { query: zod.object({ tutorId: id }) },
} as const;

const student = {
  create: zod.object(
    { email, password, name },
    { message: "Empty request body" }
  ),
} as const;

const tutor = {
  create: { body: student.create },
  update: {
    body: zod.object({
      email: zod.optional(email),
      password: zod.optional(password),
      name: zod.optional(name),
      avatar: zod.optional(url),
      bio: zod.optional(string),
      about: zod.optional(string),
      video: zod.optional(url),
      activated: zod.optional(zod.boolean()),
      activatedBy: zod.optional(id),
      passedInterview: zod.optional(zod.boolean()),
      privateFeedback: zod.optional(string),
      publicFeedback: zod.optional(string),
      interviewUrl: zod.optional(url),
    }),
    params: identityObject,
  },
  get: { params: identityObject },
  delete: { params: identityObject },
} as const;

const zoom = {
  setRefreshToken: {
    body: zod.object({ code: zod.string({ message: "Invalid zoom code" }) }),
  },
};

const call = {
  create: {
    body: zod.object({
      slotId: id,
      start: datetime,
      type: callType,
      size: callSize,
    }),
  },
  get: { params: identityObject },
  delete: { params: identityObject },
};

const ratings = {
  create: {
    body: zod.object({
      tutorId: id,
      value: rating,
      note: zod.optional(string),
    }),
  },
  update: {
    body: zod.object({
      id,
      value: zod.optional(rating),
      note: zod.optional(string),
    }),
  },
  get: { query: zod.object({ tutorId: id }) },
  delete: { query: zod.object({ id }) },
} as const;

const subscription = {
  create: {
    body: zod.object({
      monthlyMinutes: zod.coerce.number().positive().int(),
      period: subscriptionPeriod,
      autoRenewal: zod.boolean(),
    }),
  },
  update: {
    body: zod.object({
      period: zod.optional(subscriptionPeriod),
      autoRenewal: zod.optional(zod.boolean()),
    }),
  },
} as const;

const chat = {
  create: {
    body: zod.object({ tutorId: id }),
  },
} as const;

const zoomAccount = {
  create: {
    body: zod.object({
      email,
      accountId: string,
      clientId: string,
      clientSecret: string,
    }),
  },
  update: {
    params: zod.object({ id }),
    body: zod.object({
      accountId: zod.optional(string),
      clientId: zod.optional(string),
      clientSecret: zod.optional(string),
    }),
  },
  delete: {
    params: zod.object({ id }),
  },
  findById: {
    params: zod.object({ id }),
  },
} as const;

export default {
  user,
  auth,
  slot,
  student,
  tutor,
  zoom,
  call,
  rating: ratings,
  subscription,
  chat,
  zoomAccount,
};
