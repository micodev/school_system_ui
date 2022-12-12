<template>
  <v-container>
    <v-card>
      <v-data-table
        :headers="semesters"
        :items="certificate"
        loading-text="جاري التحميل يرجى الأنتظار"
        hide-default-header
        hide-default-footer
      >
        <template v-slot:header="{ props }">
          <th>الفصول</th>
          <th v-for="header in props.headers" :key="header.id">
            {{ header.name }}
          </th>
        </template>
        <template v-slot:item="{ item, index }">
          <tr>
            <td class="text-center">{{ materials[index].name }}</td>
            <td v-for="(i, inde) in item" :key="inde" class="text-center">
              <!-- {{ i }} -->
              <v-text-field
                label="الدرجة"
                placeholder="0"
                v-model="certificate[index][inde]"
                hide-details="auto"
                clearable
              ></v-text-field>
            </td>
          </tr>
        </template>
        <template v-slot:footer="{}">
          <v-btn
            depressed
            @click="submitDegree"
            class="mt-5 mb-2 mr-5"
            color="secondary"
          >
            حفظ</v-btn
          >
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import Vue from "vue";
export default {
  computed: {
    semesters() {
      return this.$store.state.SemesterModule.semesters;
    },
    materials() {
      return this.$store.state.MaterialModule.materials;
    },
    currentUser() {
      return this.$store.state.CertificateModule.user_id;
    },
    certificates() {
      return this.$store.state.CertificateModule.certificate;
    },
    certificate: {
      set(value) {
        this.$store.state.CertificateModule.local_certificate = value;
      },
      get() {
        return this.$store.state.CertificateModule.local_certificate;
      },
    },
  },
  methods: {
    submitDegree() {
      let data = {};
      data["user_id"] = this.currentUser;
      data["certificate"] = this.certificate;
      // console.log(data);
      this.$store.dispatch("CertificateModule/addCertificate", data);
    },
    getSemesters() {
      this.$store.dispatch("SemesterModule/getSemesters");
    },
    getMaterials() {
      this.$store.dispatch("MaterialModule/getMaterials");
    },
  },

  watch: {
    currentUser: async function (value) {
      console.log("I AM AT CURRENT USER");
      //currentUser
      if (value == null) return;
      var class_id = this.$store.state.CertificateModule.class_id;
      this.$store.state.SemesterModule.filter = {
        name: "class_id",
        value: [class_id],
      };
      this.$store.state.MaterialModule.filter = {
        name: "class_id",
        value: [class_id],
      };
      await this.getSemesters();
      await this.getMaterials();

      await this.$store.dispatch("CertificateModule/getCertificate");
    },
    certificates: function (_) {
      // this.semesters.unshift("الفصول");
      this.certificate.splice(0, this.certificate.length);
      for (var i = 0; i <= this.materials.length - 1; i++) {
        let material = this.materials[i];
        Vue.set(this.certificate, i, Array());
        // this.certificate[i] = Array();
        for (var j = 0; j <= this.semesters.length - 1; j++) {
          let semester = this.semesters[j];
          if (j == 0) Vue.set(this.certificate[i], j, Array());
          // // console.log(i, j);
          let degree = this.$store.state.CertificateModule.certificate
            .filter(
              (e) =>
                e.semester.id == semester.id && e.material.id == material.id
            )
            .map(
              // (e) => (e.material_id = material.id && e.semester_id == semester.id)
              (e) => {
                // console.log(typeof e.degree);
                return e.degree ?? null;
              }
            )[0];

          this.certificate[i][j] = degree;

          // console.log(this.certificate[i][j]);
        }
      }
    },
  },
  beforeDestroy() {
    this.$store.dispatch("SemesterModule/resetFields");
    this.$store.dispatch("MaterialModule/resetFields");
    this.$store.dispatch("StageModule/resetFields");
    this.$store.dispatch("CertificateModule/resetFields");
  },
};
</script>
