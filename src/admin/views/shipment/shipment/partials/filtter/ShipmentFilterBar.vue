<template>
    <div>
        <template v-if="xs">
            <v-bottom-sheet v-model="open">
                <v-card flat>
                    <v-card-text>
                        <ShipmentFilterBarForm v-model:rsql="rsql" :code="code" :status="status"  :update-url-query="updateUrlQuery" :no-carrier="noCarrier"/>
                    </v-card-text>
                </v-card>
            </v-bottom-sheet>
            <v-btn @click="() => open = !open" color="primary" :elevation="0" variant="text">
                <v-icon>mdi-filter</v-icon>
                Open Filter
            </v-btn>
        </template>
        <template v-else>
            <ShipmentFilterBarForm v-model:rsql="rsql"  :code="code" :status="status" :update-url-query="updateUrlQuery" :no-carrier="noCarrier"/>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { reactive, watch, ref } from 'vue';
import ShipmentFilterBarForm from './ShipmentFilterBarForm.vue';
import { useDisplay } from 'vuetify';

const emit = defineEmits<{
    (e: 'update:rsql', value?: string): void;
}>();

const props = defineProps<{
    code?: string;
    status?: string| string[];
    updateUrlQuery?: boolean;
    noCarrier?: boolean;
}>();

const open = ref(false);
const rsql = ref<string>();

const { xs, sm, lg } = useDisplay();

watch(rsql, (rsql) => emit('update:rsql', rsql));


</script>