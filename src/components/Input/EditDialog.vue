<template>
  <v-dialog v-model="dialogVisible" max-width="500px">
    <template v-slot:activator="{ props }">
      <slot name="default" v-bind:props="props">
        <v-btn v-bind="props" color="primary">
          {{ label ?? 'Edit' }}
        </v-btn>
      </slot>
    </template>
    <v-card>
      <!-- <v-card-title>Edit Value</v-card-title> -->
      <v-card-text>
        <slot name="input">
          <v-text-field v-model="editedValue" label="Value"></v-text-field>
        </slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialogVisible = false">Cancel</v-btn>
        <v-btn color="primary" @click="saveValue">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
<script lang="ts">
import { ref } from 'vue';
import { VDialog, VTextField } from 'vuetify/components';

export default {
  name: 'EditDialog',
  components: {
    VDialog,
    VTextField,
  },
  props: {
    initialValue: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    }
  },
  emits: ['save'],
  setup(props, { emit }) {
    const dialogVisible = ref(false);
    const editedValue = ref(props.initialValue);
    const originalValue = ref(props.initialValue);

    const openDialog = () => {
      dialogVisible.value = true;
      editedValue.value = props.initialValue;
      originalValue.value = props.initialValue;
    };

    const saveValue = () => {
      emit('save', editedValue.value);
      dialogVisible.value = false;
    };

    return {
      dialogVisible,
      editedValue,
      originalValue,
      openDialog,
      saveValue,
    };
  },
};
</script>
  