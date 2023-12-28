<template>
<v-card flat>
    <v-card-text>
        <v-fom ref="form">
            <v-text-field label="Subject" variant="outlined" density="compact"/> 
            <v-textarea label="Subject" variant="outlined" density="compact"/> 
        </v-fom>
    </v-card-text>
</v-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { VForm } from 'vuetify/lib/components/index.mjs';


const props = defineProps<{
    
}>();

const form = ref<VForm>();
</script>