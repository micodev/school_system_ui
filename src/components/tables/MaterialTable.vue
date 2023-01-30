<template>
  <v-card class="elevation-1">
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="390">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              حذف المادة
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text"
              ><b> هل أنت متأكد من عملية الحذف </b></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="dialog = false"
              >
                غلق
              </v-btn>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="deleteMaterial()"
              >
                تأكيد الحذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <v-data-table
      :headers="headers"
      :items="materials"
      :search="search"
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-start">{{ item.name }}</td>
          <td class="text-start">
            <v-btn dark color="red" @click="getItem(item)">حذف </v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title class="white--darkgrey">جدول المواد</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="بحث"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
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
          text: "اسم المادة",
          value: "name",
          class: "secondary white--text title",
        },
        {
          text: "الحذف",
          class: "secondary white--text title",
        },
      ],
      item: {},
      dialog: false,
    };
  },
  computed: {
    materials() {
      return this.$store.state.MaterialModule.materials;
    },
    table_loading() {
      return this.$store.state.MaterialModule.table_loading;
    },
  },
  methods: {
    getItem(item) {
      this.dialog = true;
      this.item = item;
    },
    deleteMaterial() {
      this.$store.dispatch("MaterialModule/deleteMaterial", this.item);
      this.dialog = false;
      this.item = {};
    },
    getMaterials() {
      this.$store.dispatch("MaterialModule/getMaterials");
    },
  },
  created() {
    this.getMaterials();
  },
};
</script>
<style></style>
