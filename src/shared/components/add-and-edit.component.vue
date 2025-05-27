<script>
import {InputNumber as PvInputNumber, InputText as PvInputText} from "primevue";

export default {
  name: 'AddAndEditForm',
  components: {PvInputNumber, PvInputText},
  props: {
    schema: { type: Array, required: true }, // [{ name, label, type, placeholder }]
    initialData: { type: Object, default: () => ({}) },
  },
  emits: ['submit'],
  data() {
    return {
      form: { ...this.initialData },
    };
  },
  methods: {
    handleUpload(event, fieldName) {
      const file = event.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64 = e.target.result;
        this.form[fieldName] = base64;
      };

      reader.readAsDataURL(file);
    }
  }

};
</script>


<template>
  <form @submit.prevent="$emit('submit', form)">
    <div v-for="field in schema" :key="field.name" class="p-field mb-3">
      <label :for="field.name" class="block mb-1">{{ field.label }}</label>

      <pv-input-text
          v-if="field.type === 'text'"
          v-model="form[field.name]"
          :id="field.name"
          :placeholder="field.placeholder"
          class="w-full"
      />

      <pv-input-number
          v-else-if="field.type === 'number'"
          v-model="form[field.name]"
          :id="field.name"
          :placeholder="field.placeholder"
          class="w-full"
      />

      <pv-input-switch
          v-else-if="field.type === 'boolean'"
          v-model="form[field.name]"
          :id="field.name"
      />

      <FileUpload
          v-if="field.type === 'file'"
          mode="basic"
          customUpload
          accept="image/*"
          chooseLabel="Upload Image"
          @uploader="event => handleUpload(event, field.name)"
      />
      <!-- Add more if you need -->

    </div>
  </form>
</template>

