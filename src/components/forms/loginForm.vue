<template>
  <div>
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
      crossorigin="anonymous"
    />

    <div class="loginPage">
      <div class="form">
        <h2>تسجيل الدخول في منصة فرجال الالكترونية</h2>

        <v-alert v-if="alert" class="text-right" type="error">
          {{ alertText }}</v-alert
        >

        <form @submit.prevent="login">
          <div class="form-group text-right">
            <label for="exampleInputEmail1 ">اسم المستخدم</label>
            <input
              type="text"
              class="form-control"
              id="username"
              aria-describedby="emailHelp"
              v-model="user_name"
            />
          </div>
          <div class="form-group text-right">
            <label for="exampleInputEmail1">كلمة المرور</label>
            <input
              type="password"
              class="form-control"
              id="password"
              aria-describedby="emailHelp"
              v-model="password"
            />
          </div>
          <button type="submit" class="btn btn-primary btn-block">
            تسجيل دخول
          </button>
        </form>
      </div>
      <div class="lotte">
        <!-- <img src="/img/6534-education (1).gif" /> -->
        <!-- <lottie-player
          src="/public/img/6534-education.json"
          background="transparent"
          speed="1"
          style="width: 300px; height: 300px"
          loop
          controls
          autoplay
        ></lottie-player> -->
        <lottie-animation style="width: 60%" path="img/lottie-logo.json" />
      </div>
    </div>
  </div>
</template>
<script>
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue"; // import lottie-vuejs

export default {
  data: () => ({
    rules: [(value) => !!value || "هذا الحقل مطلوب."],
    password: "",
    user_name: "",
    alert: false,
    alertText: "",
  }),
  components: {
    LottieAnimation,
  },
  computed: {},

  methods: {
    login() {
      if (this.user_name == "" || this.password == "") {
        this.alert = true;
        this.alertText = "يجب ادخال المعلومات";
        // console.log(this.alertText);
        setTimeout(() => {
          this.alert = false;
          this.alertText = "";
        }, 3000);
      }
      this.$store
        .dispatch("login", {
          user_name: this.user_name,
          password: this.password,
        })
        .then((res) => {
          // console.log(res);
          let token = localStorage.token;
          let user_type = localStorage.user_type;
          if (token == undefined) {
            this.$router.replace("/login");
          } else {
            if (user_type == 1) {
              this.$router.replace("/");
            } else if (user_type == 0) {
              this.$router.replace("/school");
            }
          }
        })
        .catch((err) => {
          this.alert = true;
          this.alertText = "يرجى ادخال معلومات صالحة للتسجيل";
          setTimeout(() => {
            this.alert = false;
          }, 3000);
          // console.log(err);
        });
    },

    changeRTL() {
      this.$vuetify.rtl = true;
    },
  },
};
</script>
<style>
.loginPage {
  display: flex;
  direction: rtl;
  justify-content: space-around;
  margin: 10px;
  min-height: 700px;
  background-color: #fff !important;
}

.loginPage .form {
  margin-top: 100px;
  margin-right: 50px;
  width: 400px;
  height: 300px;
  padding: 20px;
}
.loginPage .form h2 {
  text-align: center;
  padding: 15px;
}

.loginPage .form .btn {
  margin-top: 50px;
}
.loginPage .lotte {
  width: 50%;
  padding: 15px;
}
.loginPage .lotte img {
  width: 100%;
}
</style>
