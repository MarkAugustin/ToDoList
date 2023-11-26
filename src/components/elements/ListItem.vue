<template>
  <div ref="delModal" class="delete-modal">
    <div class="modal-content">
      <img
        class="close-modal"
        src="@/assets/list/Close.svg"
        @click="closeDelModal()"
      />
      <img
        style="position: absolute; top: 25px; left: 165px"
        src="@/assets/list/Delete_Icon.svg"
      />
      <span class="text-modal">Confirm deletion of this task?</span>
      <div class="modal-btn-area">
        <button class="modal-buttons delete-btn" @click="Delete(id)">
          Delete
        </button>
        <button class="modal-buttons cancel-btn" @click="closeDelModal()">
          Cancel
        </button>
      </div>
    </div>
  </div>
  <div ref="resModal" class="delete-modal">
    <div class="modal-content">
      <img
        class="close-modal"
        src="@/assets/list/Close.svg"
        @click="closeRestModal()"
      />
      <img
        style="position: absolute; top: 25px; left: 165px"
        src="@/assets/list/Restore_Icon.svg"
      />
      <span class="text-modal">Confirm restoring of this task?</span>
      <div class="modal-btn-area">
        <button class="modal-buttons restore-btn" @click="Restore(id)">
          Restore
        </button>
        <button class="modal-buttons cancel-btn" @click="closeRestModal()">
          Cancel
        </button>
      </div>
    </div>
  </div>
  <div
    ref="taskListElement"
    class="task-list-element"
    :class="{
      'element-default': isDone && !isDeleted,
      'element-done': isDone && !isDeleted,
      'element-deleted': isDeleted,
    }"
  >
    <div class="card-left-part">
      <img
        :src="checkboxDoneActive"
        class="checkbox"
        @click="setActive(id)"
        v-if="isDone && !isDeleted"
      />
      <img
        :src="restoreIcon"
        class="checkbox restore"
        v-else-if="isDeleted"
        alt="Restore"
        @click="showRestModal()"
        @mouseenter="activeRestore()"
        @mouseleave="restoreBack()"
        @mousedown="activeRestore()"
      />
      <img
        :src="checkboxActiveDone"
        class="checkbox"
        @click="setDone(id)"
        v-else
      />
    </div>
    <div class="card-center-part">
      <span
        class="task-date"
        :class="{ overdued: date < getToday() && isActive && !isDeleted }"
      >
        {{ formattedDate }}
      </span>
      <span class="task-name">
        {{ name }}
      </span>
      <span class="task-desc">
        {{ desc }}
      </span>
      <div class="task-time">
        <img src="@/assets/list/Time.svg" />
        <span
          style="padding-left: 5px"
          :class="{
            overdued:
              ((date == getToday() && timeStart < getTime()) ||
                date < getToday()) &&
              isActive &&
              !isDeleted,
          }"
        >
          {{ timeStart }}
        </span>
        <span
          v-if="timeStart !== timeEnd && timeEnd !== null"
          :class="{
            overdued:
              ((date == getToday() && timeEnd < getTime()) ||
                date < getToday()) &&
              isActive &&
              !isDeleted,
          }"
        >
          -{{ timeEnd }}
        </span>
      </div>
    </div>
    <div class="card-right-part">
      <img
        v-if="isActive && !isDeleted"
        class="edit-icon"
        :src="editIcon"
        @mouseenter="activeEdit()"
        @mouseleave="editBack()"
        @mousedown="activeEdit()"
        @click="GoToEdit(id)"
      />
      <img
        v-if="!isDeleted"
        class="trash-icon"
        :src="trashIcon"
        @mouseenter="activeTrash()"
        @mouseleave="trashBack()"
        @mousedown="activeTrash()"
        @click="setDeleted(id)"
      />
      <img
        v-if="isDeleted"
        class="trash-icon"
        :src="trashIcon"
        @mouseenter="activeTrash()"
        @mouseleave="trashBack()"
        @mousedown="activeTrash()"
        @click="showDelModal()"
      />
      <img
        v-else
        class="trash-icon"
        :src="trashIcon"
        @mouseenter="activeTrash()"
        @mouseleave="trashBack()"
        @mousedown="activeTrash()"
        @click="setDeleted(id)"
      />
    </div>
  </div>
</template>

<script>
import Edit from "@/assets/list/Edit.svg";
import EditActive from "@/assets/list/Edit_Active.svg";
import Trash from "@/assets/list/Trash.svg";
import TrashActive from "@/assets/list/Trash_Active.svg";
import Restore from "@/assets/list/Checkbox_Restore.svg";
import RestoreActive from "@/assets/list/Checkbox_Restore_Active.svg";
import { tasksCollection } from "../../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import CheckboxEmpty from "@/assets/list/Checkbox_Empty.svg";
import Checkbox from "@/assets/list/Checkbox.svg";
import moment from "moment";
export default {
  data() {
    return {
      editIcon: Edit,
      trashIcon: Trash,
      restoreIcon: Restore,
      formattedDate: "",
      checkboxActiveDone: CheckboxEmpty,
      checkboxDoneActive: Checkbox,
      today: null,
    };
  },
  methods: {
    showDelModal() {
      const element = this.$refs.delModal;
      element.style.display = "block";
      setTimeout(async function () {
        element.style.opacity = 1;
      }, 10);
    },
    closeDelModal() {
      const element = this.$refs.delModal;
      element.style.opacity = 0;
      setTimeout(async function () {
        element.style.display = "none";
      }, 1000);
    },
    showRestModal() {
      this.restoreModalShown = true;
      const element = this.$refs.resModal;
      element.style.display = "block";
      setTimeout(async function () {
        element.style.opacity = 1;
      }, 10);
    },
    closeRestModal() {
      const element = this.$refs.resModal;
      element.style.opacity = 0;
      setTimeout(async function () {
        element.style.display = "none";
      }, 1000);
    },
    activeEdit() {
      this.editIcon = EditActive;
    },
    editBack() {
      this.editIcon = Edit;
    },
    activeTrash() {
      this.trashIcon = TrashActive;
    },
    trashBack() {
      this.trashIcon = Trash;
    },
    activeRestore() {
      this.restoreIcon = RestoreActive;
    },
    restoreBack() {
      this.restoreIcon = Restore;
    },
    documentUpdate(taskRef, data) {
      const element = this.$refs.taskListElement;
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
    async setActive(id) {
      const taskRef = doc(tasksCollection, id);
      const data = {
        isActive: true,
        isDone: false,
      };
      this.checkboxDoneActive = CheckboxEmpty;
      this.documentUpdate(taskRef, data);
    },
    async setDeleted(id) {
      const taskRef = doc(tasksCollection, id);
      const data = {
        isDeleted: true,
      };
      this.documentUpdate(taskRef, data);
    },
    async Delete(id) {
      const taskRef = doc(tasksCollection, id);
      this.closeDelModal();
      const element = this.$refs.taskListElement;
      element.style.opacity = 0;
      element.style.height = 0;
      element.style.margin = 0;
      setTimeout(async function () {
        await deleteDoc(taskRef);
      }, 1000);
    },
    async Restore(id) {
      const taskRef = doc(tasksCollection, id);
      const data = {
        isDeleted: false,
      };
      this.closeRestModal();
      this.documentUpdate(taskRef, data);
    },
    GoToEdit(id) {
      this.$router.push({
        name: "EditTask",
        params: { idTask: id },
      });
    },
    formatDate() {
      const momentDate = moment(this.date);

      const dayOfWeek = momentDate.format("dddd");
      const dayOfMonth = momentDate.format("D");
      const month = momentDate.format("MMMM");
      const year = momentDate.format("YYYY");

      this.formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}, ${year}`;
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
  },
  props: {
    id: {},
    date: {},
    name: {},
    desc: {},
    timeStart: {},
    timeEnd: {},
    isActive: {},
    isDone: {},
    isDeleted: {},
  },
  mounted() {
    this.formatDate();
  },
};
</script>

<style>
/* Common Styles */
.delete-modal {
  width: 400px;
  height: 250px;
  border-radius: 30px;
  background: rgba(226, 226, 226);
  box-shadow: 4px 4px 5px 0px rgba(0, 0, 0, 0.25);
  position: absolute;
  top: 35%;
  left: 40.5%;
  z-index: 2;
  opacity: 0;
  display: none;
  transition: opacity 1s ease;
}
.close-modal {
  position: absolute;
  top: 20px;
  right: 20px;
}
.close-modal:hover {
  cursor: pointer;
}
.text-modal {
  position: absolute;
  left: 56px;
  top: 113px;
  color: var(--1, #095761);
  font-family: "B612-Regular";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.modal-btn-area {
  position: absolute;
  top: 172px;
  left: 56px;
  width: 288px;
  display: flex;
  justify-content: space-between;
}
.modal-buttons {
  width: 124px;
  height: 48px;
  border-radius: 15px;
  color: #fff;
  font-family: "B612-Bold";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 1.6px;
  border-color: #00000000;
}
.modal-buttons:hover {
  cursor: pointer;
}
.delete-btn {
  background-color: #ff1a1a80;
}
.delete-btn:hover {
  background-color: #ff1a1ae5;
}
.delete-btn:not(:disabled):not(.disabled):active,
.show > .delete-btn.dropdown-toggle {
  background-color: #ff1a1ab2;
  color: #660707;
}
.cancel-btn {
  background-color: #7e7c7c80;
}
.cancel-btn:hover {
  background-color: #7e7c7c;
}
.cancel-btn:not(:disabled):not(.disabled):active,
.show > .cancel-btn.dropdown-toggle {
  background-color: #7e7c7c80;
  color: #ffffff;
}
.restore-btn {
  background-color: #379fac;
}
.restore-btn:hover {
  background-color: #379fac8c;
}
.restore-btn:not(:disabled):not(.disabled):active,
.show > .restore-btn.dropdown-toggle {
  background-color: #026e7d;
}
.restore {
  scale: 1;
  transition: transform 0.3 ease;
}
.restore:hover {
  animation: rotate 2s infinite linear;
}
@keyframes rotate {
  0% {
    transform: scale(1);
    transform: rotateZ(0deg);
  }
  100% {
    transform: scale(1.3);
    transform: rotateZ(360deg);
  }
}
.task-list-element {
  width: 520px;
  height: 150px;
  margin-top: 12px;
  margin-bottom: 12px;
  border-radius: 20px;
  display: flex;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  opacity: 1;
  transition: opacity 0.5s ease, height 0.9s ease, margin 0.9s ease;
}
.element-default {
  background-color: #f1fdff;
}
.element-done {
  background-color: #c3e1e5b5;
}
.element-deleted {
  background-color: #f77c8b69;
}
/* Left Part */
.card-left-part {
  width: 80px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.checkbox:hover {
  cursor: pointer;
}
/* Center Part */
.card-center-part {
  width: 330px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: start;
}
.task-date {
  margin-top: 15px;
  color: #379fac;
  text-align: center;
  font-family: "B612-Italic";
  font-size: 14px;
  font-style: italic;
  font-weight: 400;
  line-height: normal;
}
.task-name {
  margin-top: 5px;
  color: #095761;
  text-align: center;
  font-family: "B612-Bold";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.task-desc {
  margin-top: 7px;
  color: #379fac;
  font-family: "B612-Regular";
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: start;
  word-wrap: break-word;
  overflow-wrap: break-word;
  width: 315px;
  height: 32px;
  max-height: 32px;
  overflow: hidden;
}
.task-time {
  margin-top: 10px;
  color: #095761;
  font-family: "B612-Regular";
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  display: flex;
  align-items: center;
}
/* Right Part */
.card-right-part {
  width: 110px;
  height: 150px;
  display: flex;
  position: relative;
}
.edit-icon {
  width: 45px;
  height: 45px;
  position: absolute;
  bottom: 7px;
  right: 65px;
}
.edit-icon:hover {
  cursor: pointer;
}
.trash-icon {
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 10px;
  right: 20px;
}
.trash-icon {
  cursor: pointer;
}
</style>
