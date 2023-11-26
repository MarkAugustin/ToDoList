<template>
  <div>
    <router-link to="/CreateNewTask" class="task-btn-area">
      <button
        class="task-btn"
        style="width: 100px; height: 100px"
        v-if="
          !$route.path.includes('/EditTask') && $route.path !== '/CreateNewTask'
        "
        @mousedown="changePlus()"
        @mouseup="restorePlus()"
      >
        <img :src="currentPlus" />
      </button>
    </router-link>
  </div>
</template>

<script>
import Plus from "@/assets/footer/Plus.svg";
import Plus_Selected from "@/assets/footer/Plus_Selected.svg";
export default {
  data() {
    return {
      currentPlus: Plus,
    };
  },
  methods: {
    changePlus() {
      this.currentPlus = Plus_Selected;
    },
    restorePlus() {
      this.currentPlus = Plus;
    },
  },
};
</script>

<style scoped>
.task-btn-area {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.task-btn {
  position: absolute;
  top: -50px;
  border-radius: 20px;
  border-color: #00000000;
  background-color: #eb55a6;
  color: white;
  font-family: "B612-Bold";
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  display: flex;
  align-items: center;
  justify-content: center;
}
.task-btn:hover {
  cursor: pointer;
  background-color: #f1bfe2;
}
.task-btn:not(:disabled):not(.disabled):active,
.show > .task-btn.dropdown-toggle {
  background: #ffc1e2;
  border-color: #00000000;
  color: #c82f82;
}
</style>
