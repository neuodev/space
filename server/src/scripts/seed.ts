import {
  calls,
  coupons,
  invites,
  plans,
  reports,
  slots,
  reportReplies,
  tutors,
  users,
} from "@/models";
import { ICall, ISlot, IUser } from "@litespace/types";
import { hashPassword } from "@/lib/user";
import dayjs from "@/lib/dayjs";

async function main(): Promise<void> {
  const password = hashPassword("LiteSpace1###");
  const superAdmin = IUser.Type.SuperAdmin;

  const admin = await users.create({
    email: "admin@litespace.com",
    name: "LiteSpace Admin",
    type: superAdmin,
    password,
  });

  const examiner = await users.create({
    type: IUser.Type.Examiner,
    email: "examiner@litespace.com",
    name: "LiteSpace Examiner",
    password,
  });

  const student = await users.create({
    type: IUser.Type.Student,
    email: "student@litespace.com",
    name: "LiteSpace Student",
    password,
  });

  const tutor = await tutors.create({
    email: "tutor@litespace.com",
    name: "LiteSpace Tutor",
    password,
  });

  const startDate = dayjs().format("YYYY-MM-DD");
  const startTime = dayjs().utc().format("HH:mm:00");
  const endTime = dayjs().utc().add(4, "hours").format("HH:mm:00");
  const slot = await slots.create({
    userId: examiner.id,
    date: { start: startDate },
    time: { start: startTime, end: endTime },
    title: "Examiner slot",
    repeat: ISlot.Repeat.No,
    weekday: -1,
  });
  const start = dayjs().tz("Africa/Cairo").add(30, "minutes");

  const call = await calls.create({
    hostId: examiner.id,
    attendeeId: tutor.id,
    duration: 30,
    slotId: slot.id,
    start: start.toISOString(),
    type: ICall.Type.Interview,
  });

  const examinerCalls = await calls.findHostCalls(examiner.id);

  const plan = await plans.create({
    alias: "Basic",
    weeklyMinutes: 2.5 * 60,
    fullMonthPrice: 1000_00,
    fullQuarterPrice: 2000_00,
    halfYearPrice: 2000_00,
    fullYearPrice: 3000_00,
    fullMonthDiscount: 10_01,
    fullQuarterDiscount: 20_33,
    halfYearDiscount: 30_80,
    fullYearDiscount: 40_09,
    forInvitesOnly: false,
    active: true,
    createdBy: admin.id,
  });

  const coupon = await coupons.create({
    code: "LiteSpace2024",
    planId: plan.id,
    expiresAt: dayjs().add(1, "month").toISOString(),
    fullMonthDiscount: 10_00,
    fullQuarterDiscount: 20_00,
    halfYearDiscount: 30_00,
    fullYearDiscount: 40_00,
    createdBy: admin.id,
  });

  const invite = await invites.create({
    email: "atlas@litespace.com",
    expiresAt: dayjs().add(1, "week").toISOString(),
    createdBy: admin.id,
    planId: plan.id,
  });

  const report = await reports.create({
    createdBy: student.id,
    title: "Report title",
    description: "Report description",
    category: "Report Category",
  });

  const reply = await reportReplies.create({
    createdBy: 3,
    draft: false,
    message: "Thanks 2",
    reportId: 1,
  });
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
