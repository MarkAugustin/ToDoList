<template>
  <div id="app">
    <div class="container">
      <div class="app-head">
        <span class="head-text" v-if="$route.path.includes('/ToDoList')">
          To Do List
        </span>
        <span class="head-text" v-if="$route.path.includes('/Calendar')">
          Calendar
        </span>
        <span class="head-text" v-if="$route.path === '/CreateNewTask'">
          Create New Task
        </span>
        <span class="head-text" v-if="$route.path.includes('/EditTask')">
          Edit Task
        </span>
      </div>
      <div class="app-body">
        <router-view></router-view>
      </div>
      <button-plus> </button-plus>
      <div class="app-footer">
        <div class="btn-area">
          <router-link
            v-if="$route.path.includes('/ToDoList')"
            to="/ToDoList/All"
          >
            <img class="footer-img" src="./assets/footer/List_Selected.svg" />
          </router-link>
          <router-link
            v-else
            to="/ToDoList/All"
            @mouseenter="hoverList()"
            @mouseleave="listBack()"
            @mousedown="changeList()"
            @mouseup="listBack()"
          >
            <img class="footer-img" :src="currentList" />
          </router-link>
          <router-link v-if="$route.path.includes('/Calendar')" to="/Calendar">
            <img
              class="footer-img"
              src="./assets/footer/Calendar_Selected.svg"
            />
          </router-link>
          <router-link
            v-else
            to="/Calendar"
            @mouseenter="hoverCalendar()"
            @mouseleave="calendarBack()"
            @mousedown="changeCalendar()"
            @mouseup="calendarBack()"
          >
            <img class="footer-img" :src="currentCalendar" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import List from "@/assets/footer/List.svg";
import List_Hover from "@/assets/footer/List_Hover.svg";
import List_Selected from "@/assets/footer/List_Selected.svg";
import Calendar from "@/assets/footer/Calendar.svg";
import Calendar_Hover from "@/assets/footer/Calendar_Hover.svg";
import Calendar_Selected from "@/assets/footer/Calendar_Selected.svg";
import ButtonPlus from "@/components/elements/ButtonPlus.vue";
export default {
  name: "App",
  data() {
    return {
      currentList: List,
      currentCalendar: Calendar,
    };
  },
  components: {
    ButtonPlus,
  },
  methods: {
    hoverList() {
      this.currentList = List_Hover;
    },
    listBack() {
      this.currentList = List;
    },
    changeList() {
      this.currentList = List_Selected;
    },
    hoverCalendar() {
      this.currentCalendar = Calendar_Hover;
    },
    calendarBack() {
      this.currentCalendar = Calendar;
    },
    changeCalendar() {
      this.currentCalendar = Calendar_Selected;
    },
  },
};
</script>

<style>
#app {
  display: flex;
  justify-content: center;
}
body {
  background-color: #2c3e50;
}
.container {
  text-align: center;
  background-color: white;
  margin-top: 60px;
  width: 580px;
  height: 844px;
  border-radius: 40px;
}
.app-head {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.head-text {
  color: #095761;
  text-align: center;
  font-family: "B612-Bold";
  font-size: 35px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.app-body {
  width: 100%;
  height: 680px;
  background-color: #e1f6f9;
}
.app-footer {
  height: 94px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-area {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0px 90px;
}
.footer-img {
  width: 60px;
  height: 60px;
}

@font-face {
  font-family: "B612-Regular";
  src: url("@/fonts/B612-Regular.woff") format("woff");
  font-style: normal;
}
@font-face {
  font-family: "B612-Bold";
  src: url("@/fonts/B612-Bold.woff") format("woff");
  font-style: normal;
}
@font-face {
  font-family: "B612-Italic";
  src: url("@/fonts/B612-Italic.woff") format("woff");
  font-style: normal;
}
</style>
