import { atlas, backendUrl } from "@/lib/atlas";
import { IPlan, ISlot, ITutor, IUser, as } from "@litespace/types";
import { DataProvider, GetListParams } from "@refinedev/core";
import dayjs from "@/lib/dayjs";
import { Dayjs } from "dayjs";
import { selectUpdatedOrNone } from "@/lib/utils";

export enum Resource {
  UserTypes = "user-types",
  Users = "users",
  Tutors = "tutors",
  MySchedule = "my-schedule",
  MyInterviews = "my-interviews",
  Plans = "plans",
}

const empty = { data: null };

export const dataProvider: DataProvider = {
  async getOne({ resource, id }) {
    const resourceId = as.int(id);
    if (resource === Resource.Users) {
      const user = await atlas.user.findById(resourceId);
      return { data: as.casted(user) };
    }

    if (resource === Resource.Tutors) {
      const tutor = await atlas.tutor.findById(resourceId);
      return { data: as.casted(tutor) };
    }

    if (resource === Resource.MySchedule) {
      const slot = await atlas.slot.findById(resourceId);
      return { data: as.casted(slot) };
    }

    if (resource === Resource.MyInterviews) {
      const call = await atlas.call.findHostCallById(resourceId);
      return { data: as.casted(call) };
    }

    if (resource === Resource.Plans) {
      const plan = await atlas.plan.findById(resourceId);
      return { data: as.casted(plan) };
    }

    throw new Error("Not implemented");
  },
  async update({ id, resource, variables, meta }) {
    const resourceId = as.int(id);
    if (resource === Resource.Users && meta) {
      const prev = as.casted<IUser.Self>(meta.user);
      const updated = as.casted<
        Partial<{
          name: string;
          email: string;
          password: string;
          avatar: string;
          userBirthday: Dayjs;
          gender: IUser.Gender;
          type: IUser.Type;
        }>
      >(variables);
      await atlas.user.update({
        name: selectUpdatedOrNone(prev.name, updated.name),
        email: selectUpdatedOrNone(prev.email, updated.email),
        password: updated.password,
        avatar: selectUpdatedOrNone(prev.avatar, updated.avatar),
        birthday: updated.userBirthday
          ? selectUpdatedOrNone(
              prev.birthday,
              updated.userBirthday.format("YYYY-MM-DD")
            )
          : undefined,
        gender: selectUpdatedOrNone(prev.gender, updated.gender),
        type: selectUpdatedOrNone(prev.type, updated.type),
        id: resourceId,
      });
      return { data: as.casted(null) };
    }

    if (resource === Resource.Tutors && meta) {
      const prev = as.casted<ITutor.FullTutor>(meta.tutor);
      const updated = as.casted<
        Partial<{
          name: string;
          email: string;
          password: string;
          avatar: string;
          userBirthday: Dayjs;
          gender: IUser.Gender;
          bio: string;
          about: string;
          video: string;
          activated: boolean;
          passedInterview: boolean;
        }>
      >(variables);

      await atlas.tutor.update(resourceId, {
        name: selectUpdatedOrNone(prev.name, updated.name),
        email: selectUpdatedOrNone(prev.email, updated.email),
        password: updated.password,
        avatar: selectUpdatedOrNone(prev.avatar, updated.avatar),
        birthday: updated.userBirthday
          ? selectUpdatedOrNone(
              prev.birthday,
              updated.userBirthday.format("YYYY-MM-DD")
            )
          : undefined,
        gender: selectUpdatedOrNone(prev.gender, updated.gender),
        bio: selectUpdatedOrNone(prev.bio, updated.bio),
        about: selectUpdatedOrNone(prev.about, updated.about),
        video: selectUpdatedOrNone(prev.video, updated.video),
        activated: selectUpdatedOrNone(prev.activated, updated.activated),
        passedInterview: selectUpdatedOrNone(
          prev.passedInterview,
          updated.passedInterview
        ),
      });

      return as.casted(empty);
    }

    if (resource === Resource.Plans && meta && meta.plan) {
      const prev = as.casted<IPlan.Attributed>(meta.tutor);
      const updated = as.casted<
        Partial<{
          weeklyMinutes: number;
          fullMonthPrice: number;
          fullQuarterPrice: number;
          halfYearPrice: number;
          fullYearPrice: number;
          fullMonthDiscount: number;
          fullQuarterDiscount: number;
          halfYearDiscount: number;
          fullYearDiscount: number;
          forInvitesOnly: boolean;
          active: boolean;
        }>
      >(variables);

      await atlas.plan.update(resourceId, {
        weeklyMinutes: selectUpdatedOrNone(
          prev.weeklyMinutes,
          updated.weeklyMinutes
        ),
        fullMonthPrice: selectUpdatedOrNone(
          prev.fullMonthPrice,
          updated.fullMonthPrice
        ),
        fullQuarterPrice: selectUpdatedOrNone(
          prev.fullQuarterPrice,
          updated.fullQuarterPrice
        ),
        halfYearPrice: selectUpdatedOrNone(
          prev.halfYearPrice,
          updated.halfYearPrice
        ),
        fullYearPrice: selectUpdatedOrNone(
          prev.fullYearPrice,
          updated.fullYearPrice
        ),
        fullMonthDiscount: selectUpdatedOrNone(
          prev.fullMonthDiscount,
          updated.fullMonthDiscount
        ),
        fullQuarterDiscount: selectUpdatedOrNone(
          prev.fullQuarterDiscount,
          updated.fullQuarterDiscount
        ),
        halfYearDiscount: selectUpdatedOrNone(
          prev.halfYearDiscount,
          updated.halfYearDiscount
        ),
        fullYearDiscount: selectUpdatedOrNone(
          prev.fullYearDiscount,
          updated.fullYearDiscount
        ),
        forInvitesOnly: selectUpdatedOrNone(
          prev.forInvitesOnly,
          updated.forInvitesOnly
        ),
        active: selectUpdatedOrNone(prev.active, updated.active),
      });

      return as.casted(empty);
    }

    throw new Error("Not implemented");
  },
  create: async ({ resource, variables, meta }) => {
    if (resource === Resource.Users) {
      await atlas.user.create(as.casted(variables));
      return as.casted(empty);
    }

    if (resource === Resource.MySchedule) {
      const {
        date: [startDate, endDate],
        endTime,
        startTime,
        repeat,
        title,
        weekday,
      } = as.casted<{
        date: [Dayjs, Dayjs?];
        endTime: Dayjs;
        startTime: Dayjs;
        repeat: ISlot.Repeat;
        title: string;
        weekday: number;
      }>(variables);

      await atlas.slot.create({
        title,
        time: {
          start: dayjs(startTime, "Africa/Cairo").utc().format("HH:mm:00"),
          end: dayjs(endTime, "Africa/Cairo").utc().format("HH:mm:00"),
        },
        date: {
          start: startDate.tz("Africa/Cairo").format("YYYY-MM-DD"),
          end: endDate?.tz("Africa/Cairo").format("YYYY-MM-DD"),
        },
        repeat,
        weekday,
      });
      return as.casted(empty);
    }

    if (resource === Resource.Tutors) {
      const payload = as.casted<ITutor.CreateApiPayload>(variables);
      const response = await atlas.tutor.create(payload);
      return { data: as.casted(response) };
    }

    if (resource === Resource.Plans) {
      console.log({ variables, resource });
    }

    throw new Error("Not implemented");
  },
  deleteOne: async ({ resource, id }) => {
    const resourceId = as.int(id);

    if (resource === Resource.MySchedule) {
      await atlas.slot.delete(resourceId);
      return as.casted(empty);
    }

    if (resource === Resource.Tutors) {
      await atlas.tutor.delete(resourceId);
      return as.casted(empty);
    }

    if (resource === Resource.Plans) {
      await atlas.plan.delete(resourceId);
      return as.casted(empty);
    }

    throw new Error("Not implemented");
  },
  getList: async ({ resource, meta }: GetListParams) => {
    if (resource === Resource.MySchedule) {
      const slots = await atlas.slot.findMySlots();
      const calls = await atlas.call.findMyCalls();

      return {
        data: as.casted([{ slots, calls }]),
        total: 0,
      };
    }

    if (resource === Resource.Users) {
      const list = await atlas.user.list();
      return { data: as.any(list), total: list.length };
    }

    if (resource === Resource.Tutors) {
      const list = await atlas.tutor.findAll();
      return { data: as.casted(list), total: list.length };
    }

    if (resource === Resource.MyInterviews) {
      const id = meta?.id;
      if (!id) return { data: as.casted([]), total: 0 };

      const hostId = as.int(id);
      const list = await atlas.call.findHostCalls(hostId);
      return { data: as.casted(list), total: list.length };
    }

    if (resource === Resource.Plans) {
      const list = await atlas.plan.findAll();
      return { data: as.casted(list), total: list.length };
    }

    throw new Error("Not implemented");
  },
  getApiUrl: () => backendUrl,
};
