<template>
  <div>
    <ul
      class="calendar-list"
      :class="{
        'standart-list': !weekendStart,
        'weekend-list': weekendStart,
        'february-list': februaryList,
      }"
    >
      <li v-for="(task, index) in tasks" :key="index">
        <list-item-min
          v-if="date === task.date && task.isActive && !task.isDeleted"
          :id="task.id"
          :name="task.name"
          :date="task.date"
          :time="task.timeStart"
          :isActive="task.isActive"
          :isDone="task.isDone"
          :isDeleted="task.isDeleted"
        ></list-item-min>
      </li>
    </ul>
  </div>
</template>

<script>
import ListItemMin from "./ListItemMin.vue";
import { getDocs, onSnapshot } from "firebase/firestore";
import { tasksCollection } from "../../firebase";
export default {
  data() {
    return {
      tasks: [],
    };
  },
  components: {
    ListItemMin,
  },
  created() {
    this.receivedTaskId = this.$route.params.date;
  },
  props: {
    date: {},
    weekendStart: {},
    februaryList: {},
  },
  methods: {
    async GetTasks() {
      try {
        const querySnapshot = await getDocs(tasksCollection);
        const promises = [];

        querySnapshot.forEach((doc) => {
          promises.push(this.processTask(doc));
        });

        await Promise.all(promises);
      } catch (e) {
        console.log(e);
      }
    },
    async processTask(doc) {
      this.tasks.push({
        id: doc.id,
        name: doc.data().name,
        date: doc.data().date,
        timeStart: doc.data().timeStart,
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
.calendar-list {
  width: 580px;
  list-style: none;
  padding-inline-start: 0px;
  overflow-x: hidden;
  overflow-y: auto;
  display: block;
  margin-block-start: 0;
  margin-block-end: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
.standart-list {
  height: calc(100vh - 722px);
}
.weekend-list {
  height: calc(100vh - 777px);
}
.february-list {
  height: calc(100vh - 665px);
}
.calendar-list::-webkit-scrollbar {
  width: 0;
}
</style>
