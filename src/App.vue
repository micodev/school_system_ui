<template>
  <v-app id="app">
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
      integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf"
      crossorigin="anonymous"
    />

    <v-app-bar
      app
      color="background"
      elevation="4"
      v-if="!$route.path.includes('login')"
    >
      <v-app-bar-nav-icon
        color="dark"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <!-- <v-btn color="dark" dark @click.stop="drawer = !drawer"> Toggle </v-btn> -->
      <v-spacer></v-spacer>
      <v-toolbar-title>منصة ايجوكيشن الالكترونية</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      app
      right
      dark
      class="secondary"
      v-if="!$route.path.includes('login')"
    >
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="/img/logo.jpg" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ full_name }}</v-list-item-title>
            <v-list-item-subtitle style="white-space: pre-line">{{
              school_name
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-divider></v-divider>
      <v-list shaped v-if="user_type == 0">
        <v-list-item to="/School">
          <v-list-item-icon>
            <v-icon>mdi-home-city</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>المدارس </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/addUser">
          <v-list-item-icon>
            <v-icon>mdi-account-group-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>اضافة مستخدم</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="signOut">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>تسجيل خروج</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list shaped v-else-if="user_type == 1">
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>mdi-home-city</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>الصفحة الرئيسية</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group
          color="white"
          :value="false"
          prepend-icon="mdi-account-circle"
        >
          <template v-slot:activator>
            <v-list-item-title>المستخدمين</v-list-item-title>
          </template>

          <v-list-item to="/teachers">
            <v-list-item-icon>
              <font-awesome-icon :icon="['fas', 'chalkboard-teacher']" />
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>المحاضرين</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            :class="
              $route.name == 'Student' &&
              $store.state.UserModule.active_side_bar
                ? 'v-list-item--active'
                : ''
            "
            @click="toStudents"
          >
            <v-list-item-icon>
              <v-icon>mdi-account-group-outline</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>الطلاب</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group color="white" :value="false" prepend-icon="mdi-table">
          <template v-slot:activator>
            <v-list-item-title>الجداول</v-list-item-title>
          </template>
          <v-list-item to="/daily_materal">
            <v-list-item-icon>
              <v-icon>mdi-table</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>الجدول الاسبوعي</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/exam">
            <v-list-item-icon>
              <font-awesome-icon :icon="['fa', 'pen']" />
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>جدول الامتحانات</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group color="white" :value="false" prepend-icon="mdi-school">
          <template v-slot:activator>
            <v-list-item-title>الكلية</v-list-item-title>
          </template>
          <v-list-item to="/stage">
            <v-list-item-icon>
              <font-awesome-icon :icon="['fa', 'school']" />
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>المراحل</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/semester">
            <v-list-item-icon>
              <font-awesome-icon :icon="['fa', 'building']" />
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>الفصول الدراسية</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/material">
            <v-list-item-icon>
              <font-awesome-icon :icon="['fa', 'book-open']" />
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>المواد الدراسية</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item to="/StageMaterialTeacher">
          <v-list-item-icon>
            <font-awesome-icon :icon="['fa', 'table']" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>توزيع المحاضرات </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/payment">
          <v-list-item-icon>
            <font-awesome-icon :icon="['fa', 'money-bill-alt']" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>المدفوعات</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/feedback">
          <v-list-item-icon>
            <font-awesome-icon :icon="['fa', 'comment-alt']" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>مشاركات اولياء الامور </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/report">
          <v-list-item-icon>
            <font-awesome-icon :icon="['fa', 'flag']" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>التبليغات</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/comment">
          <v-list-item-icon>
            <font-awesome-icon :icon="['fa', 'comment-dots']" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>التعليقات</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item to="/certificate">
          <v-list-item-icon>
            <font-awesome-icon :icon="['fa', 'graduation-cap']" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>الشهادة</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
        <v-list-item @click="signOut">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>تسجيل خروج</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-snackbar v-model="snackbar" shaped :multi-line="true">
        <div v-for="(text, index) in textSnackbar.split('\n')" :key="index">
          {{ index == 0 ? "" : index + "-" }} {{ text }}
        </div>

        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            أغلاق
          </v-btn>
        </template>
      </v-snackbar>
      <router-view />
    </v-main>
    <v-divider></v-divider>
    <!-- <footer class="mt-5" id="contact">
      <ul class="mr-5">
        <div id="icon-container">
          <a href="https://www.instagram.com/startt__up/">
            <div id="icon">
              <li><i class="fab fa-instagram"></i></li>
            </div>
          </a>
          <a href="mailto:ststartt.up.company@gmail.com">
            <div id="icon">
              <li><i class="fas fa-envelope"></i></li>
            </div>
          </a>
          <a href="https://web.facebook.com/startt__up-108291684751507">
            <div id="icon">
              <li><i class="fab fa-facebook-f"></i></li>
            </div>
          </a>
        </div>
      </ul>
      <p>جميع الحقوق محفوظة لدى <b> &copy ستارت اب كروب</b></p>
    </footer> -->
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    drawer: true,
    clipped: false,
  }),
  computed: {
    user_type: {
      set(value) {
        this.$store.state.user_type = value;
      },
      get() {
        return this.$store.state.user_type;
      },
    },
    full_name: {
      set(value) {
        this.$store.state.full_name = value;
      },
      get() {
        return this.$store.state.full_name;
      },
    },
    school_name: {
      set(value) {
        this.$store.state.school_name = value;
      },
      get() {
        return this.$store.state.school_name;
      },
    },
    // user_name() {
    //   return localStorage.getItem("user_name");
    // },
    // school_name() {
    //   return localStorage.getItem("school_name");
    // },
    snackbar: {
      set: function () {
        this.$store.dispatch("snackbarToggle", { toggle: false });
      },
      get: function () {
        return this.$store.state.snackbar;
      },
    },
    textSnackbar: function () {
      return this.$store.state.textSnackbar;
    },
  },

  methods: {
    toStudents() {
      //v-list-item--active
      var filter = {};
      this.$store.state.UserModule.filter = filter;
      this.$store.dispatch("UserModule/getUsers");
      if (this.$route.name != "Student") this.$router.push("Student");
      this.$store.state.UserModule.active_side_bar = true;
      // else this.$router.go();
    },
    changeRTL() {
      this.$vuetify.rtl = true;
    },
    signOut: function () {
      this.$store.dispatch("resetFields");
      this.user_type = -1;
      console.log("in log out ");
      localStorage.removeItem("token");
      localStorage.removeItem("user_type");

      localStorage.removeItem("user_name");
      this.$store.dispatch("logout").then(() => {
        this.$router.replace("/login");
      });
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Cairo&display=swap");
* {
  font-family: Cairo;
}
#app {
  background-color: #f4f9f9;
  /* background-color: #fff; */
}

ul {
  margin: 0;
  padding: 0;
}

ul li {
  list-style: none;
}

#contact a {
  color: #a683e3;
  margin: 10px;
}

#contact {
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100px;
  background-color: #fcfeff;
}

#icon {
  background-color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 1s, box-shadow 0.5s;
  box-shadow: 0 2px 3px rgb(0 0 0 / 12%), 0 2px 2px rgb(0 0 0 / 24%);
}

#icon-container {
  display: flex;
  justify-content: center;
}

#icon:hover {
  transform: translateY(-3px);
  box-shadow: 0 3px 5px 5px rgb(0 0 0 / 12%), 0 3px 5px rgb(0 0 0 / 24%);
}

#contact p {
  font-size: 14px;
  color: #384c81;
}

@media screen and (max-width: 426px) {
  #icon {
    width: 30px;
    height: 30px;
  }

  ul li {
    font-size: 12px;
  }

  #contact p {
    font-size: 10px;
  }
}

@media screen and (min-width: 2560px) {
  #icon {
    width: 50px;
    height: 50px;
  }

  ul li {
    font-size: 20px;
  }

  #contact p {
    font-size: 16px;
  }
}
</style>
