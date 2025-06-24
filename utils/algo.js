import RoomCombination from "@/models/roomCombination";
import Course from "@/models/Course";

async function main(dept_table, userId) {
  try {
    let courses = await Course.find({ department: dept_table, userId });
    let roomSlots = await RoomCombination.find({
      userId,
      $or: [{ roomtype: "Central" }, { roomtype: dept_table }],
      isUsed: false,
    });
    if (!courses?.length) {
      console.error("No courses available");
      return [];
    }
    if (!roomSlots?.length) {
      console.error("No room slots available");
      return [];
    }
    const scheduleConstraints = {
      departmentTimeSlots: {},
      courseDaySchedule: {},
      usedSlots: new Set(),
    };
    const timetable = [];
    const sortedCourses = courses.sort((a, b) => b.number_cred - a.number_cred);
    for (const course of sortedCourses) {
      let creditsAssigned = 0;
      const requiredCredits = course.number_cred;
      const availableSlots = roomSlots
        .filter(
          (slot) =>
            !scheduleConstraints.usedSlots.has(
              `${slot.name}-${slot.day}-${slot.period}`
            ) && slot.capacity >= course.number_stud
        )
        .sort((a, b) => {
          const diffA = a.capacity - course.number_stud;
          const diffB = b.capacity - course.number_stud;
          if (diffA >= 0 && diffB >= 0) {
            return diffA - diffB;
          }
          if (diffA < 0 && diffB < 0) {
            return diffB - diffA;
          }
          return diffA >= 0 ? -1 : 1;
        })
        .sort(() => 0.5 - Math.random());
      for (const slot of availableSlots) {
        if (creditsAssigned >= requiredCredits) break;
        if (!checkScheduleConstraints(scheduleConstraints, course, slot))
          continue;
        const timetableEntry = {
          courseId: course.course_id,
          courseName: course.course_name,
          department: course.department,
          roomName: slot.name,
          roomCapacity: slot.capacity,
          studentsEnrolled: course.number_stud,
          day: slot.day,
          period: slot.period,
          instructor: course.prof_name,
        };
        updateScheduleConstraints(scheduleConstraints, course, slot);
        timetable.push(timetableEntry);
        creditsAssigned++;
        await RoomCombination.findOneAndUpdate(
          {
            name: slot.name,
            day: slot.day,
            period: slot.period,
            userId: userId,
          },
          { isUsed: true },
          { new: true }
        );
      }
      if (creditsAssigned < requiredCredits) {
        console.warn(
          `Incomplete credit assignment for course ${course.course_id}`
        );
      }
    }
    return timetable;
  } catch (error) {
    console.error("Timetable generation error:", error);
    return [];
  }
}

function checkScheduleConstraints(scheduleConstraints, course, slot) {
  const { departmentTimeSlots, courseDaySchedule, usedSlots } =
    scheduleConstraints;
  const slotKey = `${slot.name}-${slot.day}-${slot.period}`;
  if (usedSlots.has(slotKey)) return false;
  const departmentDaySlots =
    departmentTimeSlots[course.department]?.[slot.day] || {};
  if (departmentDaySlots[slot.period]) return false;
  const courseDaySlots = courseDaySchedule[course.course_id]?.[slot.day] || [];
  if (courseDaySlots.length >= 2) return false;
  if (courseDaySlots.length === 1) {
    const previousPeriod = courseDaySlots[0].period;
    if (Math.abs(slot.period - previousPeriod) !== 1) return false;
  }
  return true;
}

function updateScheduleConstraints(scheduleConstraints, course, slot) {
  const { departmentTimeSlots, courseDaySchedule, usedSlots } =
    scheduleConstraints;
  const slotKey = `${slot.name}-${slot.day}-${slot.period}`;
  usedSlots.add(slotKey);
  departmentTimeSlots[course.department] =
    departmentTimeSlots[course.department] || {};
  departmentTimeSlots[course.department][slot.day] =
    departmentTimeSlots[course.department][slot.day] || {};
  departmentTimeSlots[course.department][slot.day][slot.period] =
    course.course_id;
  courseDaySchedule[course.course_id] =
    courseDaySchedule[course.course_id] || {};
  courseDaySchedule[course.course_id][slot.day] =
    courseDaySchedule[course.course_id][slot.day] || [];
  courseDaySchedule[course.course_id][slot.day].push({
    period: slot.period,
    room: slot.name,
  });
}

export { main };
