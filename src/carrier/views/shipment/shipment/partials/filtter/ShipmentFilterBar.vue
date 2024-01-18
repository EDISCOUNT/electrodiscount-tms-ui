<template>
    <div>
        <!-- {{ { updateUrlQuery, filter, input: props.filter, seen: true } }} -->
        <template v-if="xs">
            <v-bottom-sheet v-model="open">
                <v-card flat>
                    <v-card-text>
                        <ShipmentFilterBarForm v-model:rsql="rsql" v-model:filter="filter" :code="code" :status="status"
                            :update-url-query="updateUrlQuery" :no-carrier="noCarrier" />
                    </v-card-text>
                </v-card>
            </v-bottom-sheet>
            <v-btn @click="() => open = !open" color="primary" :elevation="0" variant="text">
                <v-icon>mdi-filter</v-icon>
                Open Filter
            </v-btn>
        </template>
        <template v-else>
            <ShipmentFilterBarForm v-model:filter="filter" v-model:rsql="rsql" :code="code" :status="status"
                :update-url-query="updateUrlQuery" :no-carrier="noCarrier" />
        </template>
    </div>
</template>

<script lang="ts" setup>
import { reactive, watch, ref } from 'vue';
import ShipmentFilterBarForm from './ShipmentFilterBarForm.vue';
import { useDisplay } from 'vuetify';

const emit = defineEmits<{
    (e: 'update:rsql', value?: string): void;
    (e: 'update:filter', value?: { [i: string]: any }): void;
}>();

const props = defineProps<{
    code?: string;
    status?: string | string[];
    filter?: { [i: string]: any };
    updateUrlQuery?: boolean;
    noCarrier?: boolean;
}>();

const open = ref(false);
const rsql = ref<string>();
const filter = ref<{ [i: string]: any }>();

const { xs, sm, lg } = useDisplay();


watch(rsql, (rsql) => emit('update:rsql', rsql));
// 
let is_taking_input = false;
watch(filter, (filter) => emit('update:filter', filter));
// 

watch(
    () => props.filter,
    (input) => {
        if (is_taking_input) {
            return;
        }
        is_taking_input = true;
        filter.value = input
        setTimeout(() => is_taking_input = false, 100);
    }
);


</script>