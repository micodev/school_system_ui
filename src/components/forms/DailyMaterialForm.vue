<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col class="d-flex" cols="12" sm="6">
            <v-autocomplete
              :disabled="isUpdate"
              clearable
              :items="stages"
              v-model="selected_object.class_id"
              item-text="name"
              item-value="id"
              label="الصف"
              @change="onChange"
            ></v-autocomplete>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6">
            <v-autocomplete
              :disabled="isUpdate"
              clearable
              :items="days"
              v-model="selected_object.day"
              item-text="day"
              item-value="day"
              label="اليوم"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12">
            <v-combobox
              :items="materials"
              label="المواد"
              multiple
              small-chips
              deletable-chips
              :value="arr"
            >
              <template v-slot:item="{ item }">
                <v-list-item-content @click.stop="multipleSelection(item)">{{
                  item.name
                }}</v-list-item-content>
              </template>
              <template v-slot:selection="{ item, index }">
                <v-chip
                  close
                  secondary
                  color="info"
                  @click:close="deleteChip(index)"
                  >{{ item.name }}</v-chip
                >
              </template>
            </v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" align-self="center" class="text-center">
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="validateField">
                  {{ isUpdate ? "تعديل القيد" : "أضافة قيد" }}
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="reset">
                  تصفير الحقول
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-form>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      rules: [(value) => !!value || "هذا الحقل مطلوب."],
      class_id: "",
      material: null,
      arr: [],
      materials_id: [],
      day: "",
      days: [
        { day: "السبت" },
        { day: "الاحد" },
        { day: "الاثنين" },
        { day: "الثلاثاء" },
        { day: "الاربعاء" },
        { day: "الخميس" },
      ],
      isUpdate: false,
    };
  },
  computed: {
    stages() {
      return this.$store.state.StageModule.stages;
    },
    materials() {
      return this.$store.state.MaterialModule.materials;
    },
    selected_object() {
      return this.$store.state.DailyMaterialModule.selected_object;
    },
    isEdit() {
      return this.$store.state.DailyMaterialModule.isEdit;
    },
  },

  methods: {
    onChange() {
      this.arr = [];
      this.materials_id = [];
      this.selected_object.day = "";
      this.$store.state.DailyMaterialModule.class_name = null;
      let class_name = this.stages.filter(
        (stage) => stage.id === this.selected_object.class_id
      )[0].name;
      this.$store.state.DailyMaterialModule.class_name = class_name;
      this.$store.state.DailyMaterialModule.class_id =
        this.selected_object.class_id;
      this.$store.dispatch("DailyMaterialModule/getDailyMaterials");
    },
    multipleSelection(item) {
      this.arr.push({ ...item });
      this.materials_id.push(item.id);
    },
    deleteChip(index) {
      // this.arr = this.arr.filter((x) => x !== item);
      // this.materials_id = this.materials_id.filter((x) => x !== item.id);
      // console.log(index);
      this.arr.splice(index, 1);
      this.materials_id.splice(index, 1);
      // console.log(this.arr);
    },

    getStages() {
      this.$store.dispatch("StageModule/getStages");
    },
    getMaterials() {
      this.$store.dispatch("MaterialModule/getMaterials");
    },
    addDailyMaterial(data) {
      this.$store.dispatch("DailyMaterialModule/addDailyMaterial", data);
    },
    editDailyMaterial(data) {
      this.$store.dispatch("DailyMaterialModule/editDailyMaterial", data);
      // // console.log(data);
    },
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["class_id"] = this.selected_object.class_id;
        data["day"] = this.selected_object.day;
        data["materials"] = this.materials_id;
        if (this.isUpdate) {
          data["daily_material_id"] = this.selected_object.id;
          this.editDailyMaterial(data);
          // this.reset();
        } else {
          this.addDailyMaterial(data);
        }
      }
    },
    reset() {
      this.$refs.form.reset();
      this.arr = [];
      this.materials_id = [];
      this.$store.state.DailyMaterialModule.isEdit = false;
      this.isUpdate = false;
    },
  },
  created() {
    this.getStages();
    this.getMaterials();
  },

  watch: {
    stages(value) {
      // console.log(value);
      this.$store.state.DailyMaterialModule.class_name = this.stages[0].name;
      this.$store.state.DailyMaterialModule.defaultClass_id = this.stages[0].id;
      this.selected_object.class_id = this.stages[0].id;
      this.$store.dispatch("DailyMaterialModule/getDailyMaterials");
    },
    isEdit(value) {
      // console.log(value);
      if (this.isEdit) {
        this.arr = [];
        this.selected_object.materials.forEach((element) => {
          let index = this.materials.findIndex((e) => e.id === element);
          this.arr.push(this.materials[index]);
          this.materials_id.push(this.materials[index].id);
        });
        this.$store.state.DailyMaterialModule.isEdit = false;
        this.isUpdate = true;
      }
    },
  },
};
</script>
