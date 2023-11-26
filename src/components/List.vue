<template>
  <div>
    <div class="list-head">
      <router-link
        to="/ToDoList/All"
        class="head-btn"
        v-if="$route.path !== '/ToDoList/All'"
        style="width: 140px"
      >
        <img src="@/assets/list-header/Menu.svg" />
        <span class="head-btn-text"> Active </span>
      </router-link>
      <router-link
        to="/ToDoList/All"
        class="head-btn-selected"
        v-if="$route.path === '/ToDoList/All'"
        style="width: 140px"
      >
        <img src="@/assets/list-header/Menu.svg" />
        <span class="head-btn-text"> Active </span>
      </router-link>
      <router-link
        to="/ToDoList/Done"
        v-if="$route.path !== '/ToDoList/Done'"
        class="head-btn"
        style="width: 138px"
      >
        <img src="@/assets/list-header/Check.svg" />
        <span class="head-btn-text"> Done </span>
      </router-link>
      <router-link
        to="/ToDoList/Done"
        v-else
        class="head-btn-selected"
        style="width: 138px"
      >
        <img src="@/assets/list-header/Check.svg" />
        <span class="head-btn-text"> Done </span>
      </router-link>
      <router-link
        to="/ToDoList/Deleted"
        v-if="$route.path !== '/ToDoList/Deleted'"
        class="head-btn"
        style="width: 165px"
      >
        <img src="@/assets/list-header/Trash.svg" />
        <span class="head-btn-text"> Deleted </span>
      </router-link>
      <router-link
        to="/ToDoList/Deleted"
        v-else
        class="head-btn-selected"
        style="width: 165px"
      >
        <img src="@/assets/list-header/Trash.svg" />
        <span class="head-btn-text"> Deleted </span>
      </router-link>
    </div>
    <div class="list-body">
      <ul class="task-list">
        <li v-for="(task, index) in tasks" :key="index">
          <list-item
            v-if="
              ($route.path === '/ToDoList/All' &&
                task.isActive &&
                !task.isDeleted) ||
              ($route.path === '/ToDoList/Done' &&
                task.isDone &&
                !task.isDeleted) ||
              ($route.path === '/ToDoList/Deleted' && task.isDeleted)
            "
            :id="task.id"
            :date="task.date"
            :name="task.name"
            :desc="task.desc"
            :timeStart="task.timeStart"
            :timeEnd="task.timeEnd"
            :isActive="task.isActive"
            :isDone="task.isDone"
            :isDeleted="task.isDeleted"
          ></list-item>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ListItem from "./elements/ListItem.vue";
import { onSnapshot } from "firebase/firestore";
import { tasksCollection } from "../firebase";
export default {
  components: {
    ListItem,
  },
  data() {
    return {
      tasks: [],
    };
  },
  methods: {
    async processTask(doc) {
      this.tasks.push({
        id: doc.id,
        name: doc.data().name,
        desc: doc.data().desc,
        date: doc.data().date,
        timeStart: doc.data().timeStart,
        timeEnd: doc.data().timeEnd,
        isActive: doc.data().isActive,
        isDone: doc.data().isDone,
        isDeleted: doc.data().isDeleted,
      });
    },
  },

  async mounted() {
    onSnapshot(tasksCollection, (snapshot) => {
      this.tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    });
  },
};
</script>

<style>
.list-head {
  background-color: #83d1db;
  width: 100%;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.head-btn {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
.head-btn:hover {
  background-color: #f1bfe280;
  border-radius: 30px;
}
.head-btn:not(:disabled):not(.disabled):active,
.show > .head-btn.dropdown-toggle {
  background-color: #f1bfe2;
}
.head-btn-selected {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background-color: #f1bfe2;
  border-radius: 30px;
}
.head-btn-text {
  color: #fff;
  text-align: center;
  font-family: "B612-Regular";
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding-left: 5px;
}
.task-list {
  list-style: none;
  padding-top: 10px;
  padding-inline-start: 0px;
  height: calc(100vh - 351px);
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-block-start: 0;
  margin-block-end: 0;
}
.task-list::-webkit-scrollbar {
  width: 0;
}
</style>
