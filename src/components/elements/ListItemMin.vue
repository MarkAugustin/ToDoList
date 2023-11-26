<template>
  <div ref="taskListMin" class="min-task-card">
    <img class="min-checkbox" :src="checkboxActiveDone" @click="setDone(id)" />
    <span
      class="min-task-time"
      :class="{
        overdued:
          (date == getToday() && timeStart < getTime()) || date < getToday(),
      }"
      >{{ time }}</span
    >
    <span class="min-task-name"> {{ name }}</span>
    <img
      class="min-edit"
      :src="editIcon"
      @mouseenter="editActive()"
      @mouseleave="editBack()"
      @mousedown="editActive()"
      @click="Edit(id)"
    />
    <img
      class="min-trash"
      :src="trashIcon"
      @mouseenter="trashActive()"
      @mouseleave="trashBack()"
      @mousedown="trashActive()"
      @click="setDeleted(id)"
    />
  </div>
</template>

<script>
import Edit from "@/assets/list/Edit.svg";
import EditActive from "@/assets/list/Edit_Active.svg";
import Trash from "@/assets/list/Trash.svg";
import TrashActive from "@/assets/list/Trash_Active.svg";
import { doc, updateDoc } from "firebase/firestore";
import { tasksCollection } from "../../firebase";
import CheckboxEmpty from "@/assets/list/Checkbox_Empty.svg";
import Checkbox from "@/assets/list/Checkbox.svg";
export default {
  data() {
    return {
      editIcon: Edit,
      trashIcon: Trash,
      checkboxActiveDone: CheckboxEmpty,
      checkboxDoneActive: Checkbox,
    };
  },
  methods: {
    editActive() {
      this.editIcon = EditActive;
    },
    editBack() {
      this.editIcon = Edit;
    },
    trashActive() {
      this.trashIcon = TrashActive;
    },
    trashBack() {
      this.trashIcon = Trash;
    },
    getToday() {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      return `${year}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
      }`;
    },
    getTime() {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var formattedTime =
        (hours < 10 ? "0" : "") +
        hours +
        ":" +
        (minutes < 10 ? "0" : "") +
        minutes;
      return formattedTime;
    },
    documentUpdate(taskRef, data) {
      const element = this.$refs.taskListMin;
      element.style.opacity = 0;
      element.style.height = 0;
      element.style.margin = 0;
      setTimeout(async function () {
        await updateDoc(taskRef, data);
      }, 1000);
    },
    async setDone(id) {
      const taskRef = doc(tasksCollection, id);
      const data = {
        isActive: false,
        isDone: true,
      };
      this.checkboxActiveDone = Checkbox;
      this.documentUpdate(taskRef, data);
    },
    async setDeleted(id) {
      const taskRef = doc(tasksCollection, id);
      const data = {
        isDeleted: true,
      };
      this.documentUpdate(taskRef, data);
    },
    Edit(id) {
      this.$router.push({
        name: "EditTask",
        params: { idTask: id },
      });
    },
  },
  props: {
    id: {},
    name: {},
    date: {},
    time: {},
    isActive: {},
    isDone: {},
    isDeleted: {},
  },
};
</script>

<style>
.min-task-card {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 500px;
  height: 60px;
  border-radius: 20px;
  background: #f1fdff;
  box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  opacity: 1;
  transition: opacity 0.7s ease, height 0.7s ease, margin 0.7s ease;
}
.overdued {
  color: #ee1867 !important;
}
.min-trash {
  padding-right: 15px;
}
.min-trash:hover,
.min-edit:hover {
  cursor: pointer;
}
.min-checkbox {
  padding: 0px 15px;
}
.min-checkbox:hover {
  cursor: pointer;
}
.min-task-time {
  color: var(--1, #095761);
  text-align: center;
  font-family: "B612-Bold";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding-right: 19px;
}
.min-task-name {
  color: var(--1, #095761);
  font-family: "B612-Regular";
  text-align: start;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  overflow-wrap: break-word;
  width: 292px;
  height: 24px;
}
</style>
