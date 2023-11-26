import { createRouter, createWebHistory } from "vue-router";

import List from "./components/List.vue";
import CreateEdit from "./components/CreateEdit.vue";
import Calendar from "./components/Calendar.vue";
import CalendarList from "./components/elements/CalendarList.vue";

const routes = [
  {
    path: "/",
    children: [
      {
        path: "ToDoList",
        component: List,
        name: "ToDoList",
        children: [
          { path: "All", component: List, name: "ToDoList/All" },
          { path: "Done", component: List, name: "ToDoList/Done" },
          { path: "Deleted", component: List, name: "ToDoList/Deleted" },
        ],
      },
      { path: "CreateNewTask", component: CreateEdit, name: "CreateNewTask" },
      { path: "EditTask/:idTask", component: CreateEdit, name: "EditTask" },
      {
        path: "Calendar",
        component: Calendar,
        name: "Calendar",
        children: [
          {
            path: "List/:date",
            component: CalendarList,
            name: "Calendar/List",
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
