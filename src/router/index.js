import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import login from "../views/login.vue";
import Student from "../views/Student.vue"
import teachers from "../views/teacher.vue"
import AddUser from "../views/AddUser.vue"
import Stage from "../views/Stage.vue";
import Semester from "../views/Semester.vue";
import Material from "../views/Material.vue";
import Payment from "../views/Payment.vue";
import Feedback from "../views/Feedback.vue"
import DailyMateral from "../views/DailyMaterial.vue"
import Exam from "../views/Exam.vue"
import Report from "../views/Report.vue"
import Comment from "../views/Comment.vue"
import StageMaterialTeacher from "../views/StageMaterialTeacher.vue"
import certificate from "../views/Certificate.vue"
import School from "../views/School.vue"
import About from "../views/About.vue"
import store from "../store/index";




Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: login,
    meta: {
      requireNotLogin: true,
    },
  },
  {
    path: "/Student",
    name: "Student",
    component: Student
  },
  {
    path: "/teachers",
    name: "Teachers",
    component: teachers
  },
  {
    path: "/AddUser",
    name: "AddUser",
    component: AddUser
  },
  {
    path: "/Stage",
    name: "Stage",
    component: Stage
  },
  {
    path: "/semester",
    name: "Semester",
    component: Semester
  },
  {
    path: "/material",
    name: "Material",
    component: Material
  },
  {
    path: "/payment",
    name: "Payment",
    component: Payment
  },
  {
    path: "/feedback",
    name: "Feedback",
    component: Feedback
  },
  {
    path: "/daily_materal",
    name: "DailyMateral",
    component: DailyMateral
  },
  {
    path: "/exam",
    name: "Exam",
    component: Exam
  },
  {
    path: "/report",
    name: "Report",
    component: Report
  },
  {
    path: "/comment",
    name: "Comment",
    component: Comment
  },
  {
    path: "/StageMaterialTeacher",
    name: "StageMaterialTeacher",
    component: StageMaterialTeacher
  },
  {
    path: "/certificate",
    name: "certificate",
    component: certificate
  },
  {
    path: "/School",
    name: "School",
    component: School
  },
  {
    path: "/About",
    name: "About",
    component: About
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireNotLogin)) {
    if (store.getters.isLoggedIn) {
      next("/");
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});
export default router;
