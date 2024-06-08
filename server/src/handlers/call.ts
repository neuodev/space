import { calls, slots, tutors } from "@/models";
import { ICall, IUser } from "@litespace/types";
import { createZoomMeeting } from "@/integrations/zoom";
import { isAdmin } from "@/lib/common";
import {
  forbidden,
  lessonNotFound,
  slotNotFound,
  tutorHasNoTime,
  tutorNotFound,
} from "@/lib/error";
import { hasEnoughTime } from "@/lib/lessons";
import { Request, Response } from "@/types/http";
import { schema } from "@/validation";
import { NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { asZoomStartTime } from "@/integrations/zoom/utils";
import zod from "zod";

async function create(req: Request.Default, res: Response, next: NextFunction) {
  const { slotId, start, size, type } = schema.http.call.create.body.parse(
    req.body
  );
  // validation
  // - validate empty slot
  // - validate start and duration
  // - validate user subscription
  // - update user remaining minutes
  // - no lessons at this time.

  if (req.user.type !== IUser.Type.Student) return next(forbidden);

  const slot = await slots.findById(slotId);
  if (!slot) return next(slotNotFound);

  const host = await tutors.findById(slot.userId);
  if (!host) return next(tutorNotFound);

  const bookedCalls = await calls.findBySlotId(slotId);
  const duration = zod.coerce.number().parse(size);
  const enough = hasEnoughTime({
    call: { start, duration },
    calls: bookedCalls,
    slot,
  });
  if (!enough) return next(tutorHasNoTime);

  const meetting = await createZoomMeeting({
    participants: [{ email: host.email }, { email: req.user.email }],
    start: asZoomStartTime(start),
    duration,
  });

  const call = await calls.create({
    type,
    hostId: host.id,
    attendeeId: req.user.id,
    slotId,
    start,
    duration,
    zoomMeetingId: meetting.id,
    meetingUrl: meetting.joinUrl,
    systemZoomAccountId: meetting.systemZoomAccountId,
  });

  res.status(200).json(call);
}

async function delete_(
  req: Request.Default,
  res: Response,
  next: NextFunction
) {
  const { id } = schema.http.call.delete.params.parse(req.params);
  const call = await calls.findById(id);
  if (!call) return next(lessonNotFound);

  const userId = req.user.id;
  const owner = userId === call.hostId || userId === call.attendeeId;
  const eligible = owner || isAdmin(req.user.type);
  if (!eligible) return next(forbidden);

  // todo: delete zoom meeting

  await calls.delete(id);
  res.status(200).send();
}

async function getCalls(user: IUser.Self): Promise<ICall.Self[]> {
  const id = user.id;
  const type = user.type;
  const studnet = type === IUser.Type.Student;
  const tutor = type === IUser.Type.Tutor;
  const examiner = type === IUser.Type.Examiner;

  if (studnet) return await calls.findByAttendeeId(id);
  if (tutor || examiner) return await calls.findByHostId(id);
  return await calls.findAll(); // admin
}

async function getMany(
  req: Request.Default,
  res: Response,
  next: NextFunction
) {
  const calls = await getCalls(req.user);
  res.status(200).json(calls);
}

async function getOne(req: Request.Default, res: Response, next: NextFunction) {
  const { id } = schema.http.call.get.params.parse(req.query);
  const call = await calls.findById(id);
  if (!call) return next(lessonNotFound);
  res.status(200).json(call);
}

export default {
  create: asyncHandler(create),
  delete: asyncHandler(delete_),
  get: asyncHandler(getOne),
  list: asyncHandler(getMany),
};