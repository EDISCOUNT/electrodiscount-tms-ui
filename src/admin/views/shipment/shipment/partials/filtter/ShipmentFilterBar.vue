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
            <ShipmentFilterBarForm v-model:filter="filter" v-model:rsql="rsql"  :code="code" :status="status" :update-url-query="updateUrlQuery" :no-carrier="noCarrier"/>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { reactive, watch, ref } from 'vue';
import ShipmentFilterBarForm from './ShipmentFilterBarForm.vue';
import { useDisplay } from 'vuetify';

const emit = defineEmits<{
    (e: 'update:rsql', value?: string): void;
    (e: 'update:filter', value?: {[i:string]: any}): void;
}>();

const props = defineProps<{
    code?: string;
    status?: string| string[];
    filter?: {[i:string]: any};
    updateUrlQuery?: boolean;
    noCarrier?: boolean;
}>();

const open = ref(false);
const rsql = ref<string>();
const filter = ref<{[i:string]: any}>();

const { xs, sm, lg } = useDisplay();

watch(rsql, (rsql) => emit('update:rsql', rsql));
watch(filter, (filter) => emit('update:filter', filter));


</script>