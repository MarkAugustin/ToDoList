<template>
  <div class="calendar">
    <div class="calendar-header">
      <div class="header-container">
        <button
          class="calendar-header-btn"
          @click="prevMonth"
          @mouseenter="activeLeft()"
          @mouseleave="leftBack()"
          @mousedown="activeLeft()"
        >
          <img :src="leftArrow" />
        </button>
        <span class="calendar-header-text">{{ currentMonth }}</span>
        <button
          class="calendar-header-btn"
          @click="nextMonth"
          @mouseenter="activeRight()"
          @mouseleave="rightBack()"
          @mousedown="activeRight()"
        >
          <img :src="rightArrow" />
        </button>
      </div>
    </div>
    <div class="calendar-container">
      <div class="days">
        <div v-for="day in days" :key="day" class="day head">{{ day }}</div>
        <div v-for="blank in blanks" :key="blank" class="empty-day"></div>
        <div
          v-for="date in getDaysInMonth"
          :key="date"
          class="day dates"
          :class="{ selected: date === selectedDateDefault }"
          @click="selectDate(date)"
        >
          {{ date.getDate() }}
        </div>
      </div>
    </div>
  </div>
  <div>
    <calendar-list
      :date="this.selectedDate"
      :weekendStart="this.weekendStart"
      :februaryList="this.februaryList"
    ></calendar-list>
  </div>
</template>

<script>
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import LeftArrow from "@/assets/calendar/Left.svg";
import RightArrow from "@/assets/calendar/Right.svg";
import LeftArrowActive from "@/assets/calendar/Left_Active.svg";
import RightArrowActive from "@/assets/calendar/Right_Active.svg";
import CalendarList from "./elements/CalendarList.vue";

export default {
  components: {
    CalendarList,
  },
  data() {
    return {
      leftArrow: LeftArrow,
      rightArrow: RightArrow,
      currentDate: new Date(),
      days: ["M", "T", "W", "T", "F", "S", "S"],
      selectedDate: null,
      selectedDateDefault: null,
      weekendStart: false,
      februaryList: false,
    };
  },
  computed: {
    currentMonth() {
      return format(this.currentDate, "MMMM, yyyy");
    },
    getDaysInMonth() {
      const start = startOfMonth(this.currentDate);
      const end = endOfMonth(this.currentDate);
      const daysInMonth = eachDayOfInterval({ start, end });
      return daysInMonth;
    },
    blanks() {
      const firstDayOfMonth = this.getDaysInMonth[0].getDay();
      const currentDate = this.getDaysInMonth[0];
      const monthLength = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();
      if (
        (firstDayOfMonth === 0 && monthLength >= 29) ||
        (firstDayOfMonth === 6 && monthLength === 31)
      )
        this.weekendStart = true;
      else if (firstDayOfMonth === 1 && monthLength == 28) {
        this.februaryList = true;
      } else {
        this.weekendStart = false;
        this.februaryList = false;
      }
      return Array(firstDayOfMonth > 0 ? firstDayOfMonth - 1 : 6).fill(null);
    },
  },
  methods: {
    activeLeft() {
      this.leftArrow = LeftArrowActive;
    },
    leftBack() {
      this.leftArrow = LeftArrow;
    },
    activeRight() {
      this.rightArrow = RightArrowActive;
    },
    rightBack() {
      this.rightArrow = RightArrow;
    },
    prevMonth() {
      this.currentDate = subMonths(this.currentDate, 1);
    },
    nextMonth() {
      this.currentDate = addMonths(this.currentDate, 1);
    },
    selectDate(date) {
      this.selectedDateDefault = date;
      this.selectedDate = format(date, "yyyy-MM-dd");
    },
  },
};
</script>

<style>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  padding-bottom: 15px;
}
.calendar-container {
  width: 500px;
  padding-top: 24px;
}
.calendar-header {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #83d1db;
}
.header-container {
  width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.calendar-header-text {
  color: #fff;
  text-align: center;
  text-shadow: 0px 3px 5px rgba(0, 0, 0, 0.25);
  font-family: "B612-Bold";
  font-size: 38px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.calendar-header-btn {
  background-color: #00000000;
  border-color: #00000000;
  width: 60px;
  height: 60px;
}
.calendar-header-btn:hover {
  cursor: pointer;
}
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px 35px;
}
.head {
  color: rgba(9, 87, 97, 0.9);
  text-align: center;
  font-family: "B612-Bold";
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.day {
  text-align: center;
  padding: 5px;
}
.dates {
  color: rgba(9, 87, 97, 0.9);
  text-align: center;
  font-family: "B612-Regular";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.dates:hover {
  cursor: pointer;
  background-color: #49777e4d;
  border-radius: 150px;
}
.dates:not(:disabled):not(.disabled):active,
.show > .dates.dropdown-toggle,
.selected {
  background-color: #379fac;
  border-color: #00000000;
  color: #fff;
  border-radius: 150px;
}
</style>
