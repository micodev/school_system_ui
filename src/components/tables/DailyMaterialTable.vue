<template>
  <v-card class="elevation-1">
    <v-data-table
      :headers="headers"
      :items="dailyMaterials"
      :search="search"
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title class="white--darkgrey"
            >الجدول الاسبوعي <b>{{ class_name }}</b>
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item="{ index, item }">
        <tr @dblclick="rowClicked(item)">
          <td class="text-start">{{ item.day }}</td>
          <td class="text-start" v-if="!dailyMaterials_name[index][0]">
            <span style="color: red">لايوجد مادة</span>
          </td>
          <td v-else>
            {{ dailyMaterials_name[index][0] }}
          </td>
          <td class="text-start" v-if="!dailyMaterials_name[index][1]">
            <span style="color: red">لايوجد مادة</span>
          </td>
          <td v-else>
            {{ dailyMaterials_name[index][1] }}
          </td>
          <td class="text-start" v-if="!dailyMaterials_name[index][2]">
            <span style="color: red">لايوجد مادة</span>
          </td>
          <td v-else>
            {{ dailyMaterials_name[index][2] }}
          </td>
          <td class="text-start" v-if="!dailyMaterials_name[index][3]">
            <span style="color: red">لايوجد مادة</span>
          </td>
          <td v-else>
            {{ dailyMaterials_name[index][3] }}
          </td>
          <td class="text-start" v-if="!dailyMaterials_name[index][4]">
            <span style="color: red">لايوجد مادة</span>
          </td>
          <td v-else>
            {{ dailyMaterials_name[index][4] }}
          </td>
          <td class="text-start" v-if="!dailyMaterials_name[index][5]">
            <span style="color: red">لايوجد مادة</span>
          </td>
          <td v-else>
            {{ dailyMaterials_name[index][5] }}
          </td>
          <td class="text-start" v-if="!dailyMaterials_name[index][6]">
            <span style="color: red">لايوجد مادة</span>
          </td>
          <td v-else>
            {{ dailyMaterials_name[index][6] }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "اليوم ",
          value: "day",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "المحاضرة الاؤل",
          value: "materials",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "المحاضرة الثاني",
          value: "materials",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "المحاضرة الثالث",
          value: "materials",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "المحاضرة الرابع",
          value: "materials",
          class: "secondary white--text title",
          sortable: false,
        },

        {
          text: "المحاضرة الخامس",
          value: "materials",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "المحاضرة السادس",
          value: "materials",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "المحاضرة السابع",
          value: "materials",
          class: "secondary white--text title",
          sortable: false,
        },
      ],
      material_arr: [],
    };
  },
  computed: {
    dailyMaterials() {
      return this.$store.state.DailyMaterialModule.dailyMaterials;
    },
    dailyMaterials_name() {
      return this.$store.state.DailyMaterialModule.dailyMaterials_name;
    },
    materials() {
      return this.$store.state.MaterialModule.materials;
    },
    table_loading() {
      return this.$store.state.DailyMaterialModule.table_loading;
    },
    class_name() {
      return this.$store.state.DailyMaterialModule.class_name;
    },
  },
  methods: {
    getDailyMaterials() {
      this.$store.dispatch("DailyMaterialModule/getDailyMaterials");
    },
    getMaterials() {
      this.$store.dispatch("MaterialModule/getMaterials");
    },

    rowClicked(item) {
      this.$store.state.DailyMaterialModule.selected_object = {};
      Object.assign(
        this.$store.state.DailyMaterialModule.selected_object,
        item
      );
      this.$store.state.DailyMaterialModule.isEdit = true;
    },
  },
  created() {
    this.getDailyMaterials();
    this.getMaterials();
  },
};
</script>
<style></style>
