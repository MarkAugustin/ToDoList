<template>
  <div ref="SucModal" class="success-modal">
    <div class="modal-content">
      <img
        style="position: absolute; top: 8px; left: 60px"
        src="@/assets/list/Success.svg"
      />
      <span class="success-text">Success!</span>
    </div>
  </div>
  <div>
    <form @submit.prevent="handleSubmit" ref="form" class="form-container">
      <label class="form-label" for="name">Name:</label>
      <input
        class="form-a"
        type="text"
        id="name"
        placeholder="Write the title"
        v-model="formData.name"
        required
      />

      <label class="form-label" for="desc">Description:</label>
      <textarea
        class="form-a"
        style="height: 75px; resize: none; padding-top: 15px;"
        rows="2"
        type="text"
        id="desc"
        placeholder="Write the description or your important note "
        v-model="formData.desc"
      ></textarea>

      <label class="form-label" for="date">Date:</label>
      <input
        class="form-a"
        id="date"
        type="date"
        v-model="formData.date"
        required
        :min="getToday()"
        @input="checkDateValidity()"
      />
      <div class="time-area">
        <div class="time-form">
          <label class="form-label" for="time-start">Start:</label>
          <input
            class="form-b"
            type="time"
            id="time-start"
            v-model="formData.timeStart"
            required
          />
        </div>
        <div class="time-form" style="padding-left: 60px">
          <label class="form-label" for="time-finish">Finish:</label>
          <input
            class="form-b"
            type="time"
            id="time-finish"
            v-model="formData.timeEnd"
            @input="checkTimeValidity"
          />
        </div>
      </div>
      <button type="submit" class="save-btn" @click="AddTask()">SAVE</button>
    </form>
  </div>
</template>

<script>
import { addDoc, getDoc, setDoc, doc } from "firebase/firestore";
import { tasksCollection } from "@/firebase";
export default {
  data() {
    return {
      formData: {
        receivedTaskId: null,
        name: "",
        desc: "",
        date: null,
        timeStart: null,
        timeEnd: null,
        isActive: true,
        isDone: false,
        isDeleted: false,
      },
    };
  },
  methods: {
    checkTimeValidity() {
      const startTime = new Date(`1970-01-01T${this.formData.timeStart}`);
      const endTime = new Date(`1970-01-01T${this.formData.timeEnd}`);
      if (startTime >= endTime) {
        this.formData.timeEnd = this.formData.timeStart;
      }
    },
    checkDateValidity() {
      const today = new Date();
      const selectedDate = new Date(this.formData.date);
      if (selectedDate < today) {
        this.formData.date = today.toISOString().split("T")[0];
      }
    },
    CheckFormValidity() {
      if (
        this.formData.name != null &&
        this.formData.date !== null &&
        this.formData.date >= this.getToday() &&
        this.formData.timeStart !== null
      ) {
        return true;
      }
      return false;
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
    async AddTask() {
      if (this.CheckFormValidity()) {
        try {
          let data = {
            name: this.formData.name,
            desc: this.formData.desc,
            date: this.formData.date,
            timeStart: this.formData.timeStart,
            timeEnd: this.formData.timeEnd,
            isActive: this.formData.isActive,
            isDone: this.formData.isDone,
            isDeleted: this.formData.isDeleted,
          };

          if (!this.receivedTaskId) {
            const taskRef = await addDoc(tasksCollection, data);
            await setDoc(taskRef, data);
          } else {
            const taskRef = doc(tasksCollection, this.receivedTaskId);
            await setDoc(taskRef, data);
          }

          this.receivedTaskId = null;
          this.$refs.form.reset();
          const element = this.$refs.SucModal;
          element.style.display = "block";
          setTimeout(async function () {
            element.style.opacity = 1;
          }, 10);
          setTimeout(async () => {
            element.style.opacity = 0;
            this.$router.push("/ToDoList/All");
          }, 1000);
        } catch (e) {
          console.log(e);
        }
      }
    },
  },
  created() {
    this.receivedTaskId = this.$route.params.idTask;
  },
  mounted() {
    if (this.receivedTaskId) {
      const taskRef = doc(tasksCollection, this.receivedTaskId);
      getDoc(taskRef).then((response) => {
        this.formData.name = response.data().name;
        this.formData.desc = response.data().desc;
        this.formData.date = response.data().date;
        this.formData.timeStart = response.data().timeStart;
        this.formData.timeEnd = response.data().timeEnd;
        this.formData.isActive = response.data().isActive;
        this.formData.isDone = response.data().isDone;
        this.formData.isDeleted = response.data().isDeleted;
      });
    }
  },
};
</script>

<style>
.success-modal {
  width: 200px;
  height: 150px;
  border-radius: 15px;
  position: absolute;
  top: 66%;
  left: 45.2%;
  display: none;
  opacity: 0;
  background-color: #47bccb;
  z-index: 2;
  transition: opacity 1s ease;
}
.success-text {
  color: #fff;
  font-family: "B612-Bold";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 1.92px;
  position: absolute;
  bottom: 25px;
  left: 46px;
}
.form-container {
  padding-left: 68px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  height: 680px;
}
.form-label {
  color: #095761;
  text-align: center;
  font-family: "B612-Bold";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding-top: 30px;
}
.form-a {
  width: 460px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 15px;
  background: var(--7, #cce7eb);
  border-color: #00000000;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  color: rgba(9, 87, 97, 0.5);
  font-family: "B612-Regular";
  font-size: 25px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.form-a::placeholder {
  text-justify: center;
  padding-left: 5px;
  padding-top: 0px;
  color: rgba(9, 87, 97, 0.5);
  font-family: "B612-Regular";
  font-size: 25px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.time-area {
  width: 460px;
  display: flex;
}
.form-b {
  width: 200px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 15px;
  background: var(--7, #cce7eb);
  border-color: #00000000;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  color: rgba(9, 87, 97, 0.5);
  font-family: "B612-Regular";
  font-size: 25px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.time-form {
  width: 460px;
  display: flex;
  flex-direction: column;
  align-items: start;
}
.save-btn {
  width: 110px;
  height: 90px;
  color: #fff;
  text-align: center;
  font-family: "B612-Bold";
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border-radius: 20px;
  border-color: #00000000;
  background: var(--6, #eb55a6);
  position: absolute;
  bottom: -50px;
  left: 235px;
}
.save-btn:hover {
  cursor: pointer;
  background-color: #f1bfe2;
}
.save-btn:not(:disabled):not(.disabled):active,
.show > .save-btn.dropdown-toggle {
  background: #ffc1e2;
  border-color: #00000000;
  color: #c82f82;
}
</style>
