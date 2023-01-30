<template>
  <v-container>
    <div id="root">
      <div class="container pt-5" v-if="statistics.length > 0">
        <div class="row align-items-stretch">
          <div class="c-dashboardInfo col-lg-3 col-md-6">
            <div class="wrap">
              <h4
                class="
                  heading
                  heading5
                  hind-font
                  medium-font-weight
                  c-dashboardInfo__title
                "
              >
                عدد الطلاب
              </h4>
              <span class="hind-font caption-12 c-dashboardInfo__count">{{
                statistics[0].students
              }}</span>
              <font-awesome-icon size="4x" :icon="['fas', 'users']" />
            </div>
          </div>
          <div class="c-dashboardInfo col-lg-3 col-md-6">
            <div class="wrap">
              <h4
                class="
                  heading
                  heading5
                  hind-font
                  medium-font-weight
                  c-dashboardInfo__title
                "
              >
                المحاضرين
              </h4>
              <span class="hind-font caption-12 c-dashboardInfo__count">{{
                statistics[0].teachers
              }}</span>
              <!-- <i class="fas fa-chalkboard-teacher"></i> -->

              <font-awesome-icon
                size="4x"
                :icon="['fas', 'chalkboard-teacher']"
              />
            </div>
          </div>
          <div class="c-dashboardInfo col-lg-3 col-md-6">
            <div class="wrap">
              <h4
                class="
                  heading
                  heading5
                  hind-font
                  medium-font-weight
                  c-dashboardInfo__title
                "
              >
                المراحل
              </h4>
              <span class="hind-font caption-12 c-dashboardInfo__count">{{
                statistics[0].stages
              }}</span>
              <!-- <font-awesome-icon icon="fa-solid fa-screen-users" /> -->
              <font-awesome-icon size="4x" :icon="['fa', 'school']" />
            </div>
          </div>
          <div class="c-dashboardInfo col-lg-3 col-md-6">
            <div class="wrap">
              <h4
                class="
                  heading
                  heading5
                  hind-font
                  medium-font-weight
                  c-dashboardInfo__title
                "
              >
                المواد
              </h4>
              <span class="hind-font caption-12 c-dashboardInfo__count">{{
                statistics[0].materials
              }}</span>
              <font-awesome-icon size="4x" :icon="['fa', 'book-open']" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-card style="margin-top: 50px">
      <ReportTable></ReportTable>
    </v-card>
  </v-container>
</template>

<script>
import ReportTable from "../components/tables/ReportTable.vue";
export default {
  components: {
    ReportTable,
  },

  computed: {
    statistics() {
      return this.$store.state.statistics;
    },
  },

  methods: {
    getStatistics() {
      this.$store.dispatch("getStatistics");
    },
  },
  created() {
    this.getStatistics();
  },
};
</script>

<style>
.c-dashboardInfo {
  margin-bottom: 15px;
}
.c-dashboardInfo .wrap {
  background: #ffffff;
  box-shadow: 2px 10px 20px rgba(0, 0, 0, 0.1);
  border-radius: 7px;
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: 40px 25px 20px;
  height: 100%;
}
.c-dashboardInfo__title,
.c-dashboardInfo__subInfo {
  color: #6c6c6c;
  font-size: 1.18em;
}
.c-dashboardInfo span {
  display: block;
}
.c-dashboardInfo__count {
  font-weight: 600;
  font-size: 2.5em;
  line-height: 64px;
  color: #323c43;
}
.c-dashboardInfo .wrap:after {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
  content: "";
}

.c-dashboardInfo:nth-child(1) .wrap:after {
  background: linear-gradient(82.59deg, #00c48c 0%, #00a173 100%);
}
.c-dashboardInfo:nth-child(2) .wrap:after {
  background: linear-gradient(81.67deg, #0084f4 0%, #1a4da2 100%);
}
.c-dashboardInfo:nth-child(3) .wrap:after {
  background: linear-gradient(69.83deg, #0084f4 0%, #00c48c 100%);
}
.c-dashboardInfo:nth-child(4) .wrap:after {
  background: linear-gradient(81.67deg, #ff647c 0%, #1f5dc5 100%);
}
.c-dashboardInfo__title svg {
  color: #d7d7d7;
  margin-left: 5px;
}
.MuiSvgIcon-root-19 {
  fill: currentColor;
  width: 1em;
  height: 1em;
  display: inline-block;
  font-size: 24px;
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  user-select: none;
  flex-shrink: 0;
}
</style>
