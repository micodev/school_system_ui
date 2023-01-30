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
        <h2>تسجيل الدخول في منصة ايجوكيشن الالكترونية</h2>
        <form @submit.prevent="login">
          <div class="form-group text-right">
            <label for="exampleInputEmail1 ">اسم المستخدم</label>
            <input
              type="text"
              class="form-control"
              id="UserName"
              aria-describedby="emailHelp"
              v-model="UserName"
            />
          </div>
          <div class="form-group text-right">
            <label for="exampleInputEmail1">كلمة المرور</label>
            <input
              type="password"
              class="form-control"
              id="UserName"
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
        <img src="/img/6534-education (1).gif" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      UserName: "",
      password: "",
    };
  },
  methods: {
    login: function () {
      let UserName = this.UserName;
      let password = this.password;
      this.$store.dispatch("login", { UserName, password }).then((response) => {
        // console.log(response);
        let status = localStorage.getItem("status");
        if (status == 1) {
          this.$router.push("/");
        } else {
          this.$router.push("/HomeManage");
        }
      });
      // .catch((err) => // console.log(err));
    },
    mounted() {},
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
