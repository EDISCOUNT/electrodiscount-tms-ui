<template>
    <!-- <v-slide-group v-model="selected" multiple show-arrows>
        <v-slide-group-item v-for="(status, i) in statuses" :key="status.value" v-slot="{ isSelected, toggle }">
            <v-btn class="mx-2" variant="tonal" rounded :color="isSelected ? 'primary' : undefined" @click="toggle" :elevation="0">
                {{ status.text }}
            </v-btn>
        </v-slide-group-item>
    </v-slide-group> -->
    <!-- <v-chip r-class="mx-2" @click="() => selected = undefined" :value="0" label
        :color="rselected.includes(0) ? 'primary' : undefined" :elevation="0">
        All
    </v-chip> -->
    <!-- {{ {filter} }} -->
    <v-chip-group v-model="selected" multiple r-variant="text" r-class="mt-5" r-mandatory show-arrows clearable>
        <!-- <template v-slot:prepend>
                <span>Here I AM!</span>
        </template> -->
        <!-- {{ {selected, rselected} }} -->
        <v-btn @click.stop="() => clear()" class="mt-1 mx-1" variant="tonal" size="small">
            <!-- <v-chip r-class="mx-2" @click.stop="() => clear()" :value="0" label
                :color="(selected == 0) ? 'primary' : undefined" :elevation="0"> -->
            All
            <!-- </v-chip> -->
        </v-btn>
        <!-- <v-chip v-for="(status, i) in statuses" :key="status.value" r-class="mx-2" :value="status.value" label
            :color="rselected.includes(status.value) ? 'primary' : undefined" :elevation="0">
            {{ status.text }}
        </v-chip> -->
        <StatusFilterChip v-for="(status, i) in statuses" :key="status.value" r-class="mx-2" :value="status.value" :filter="filter" label
            :is-selected="rselected.includes(status.value)" size="small" :elevation="0">
            {{ status.text }}
        </StatusFilterChip>
    </v-chip-group>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import StatusFilterChip from './StatusFilterChip.vue';

const props = defineProps<{
    modelValue?: string[] | string | number;
    filter?: string;
    updateUrlQuery?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:model-value', value: string | number | string[] | undefined): void;
}>();

const router = useRouter();

const selected = ref<number | string | string[] | undefined>(props.modelValue ?? []);

const rselected = computed(() => Array.isArray(selected.value) ? selected.value : (selected.value ? [selected.value] : []));

watch(() => props.modelValue, (value) => {
    // if (value) {
    //     if (!Array.isArray(value)) {
    //         value = [value];
    //     }
    //     selected.value = value;
    // }
    selected.value = value ?? [];
});

watch(selected, (v) => {
    // if(Array.isArray(v)){
    //     v = v[0]?? null;
    // }
    emit('update:model-value', v);
});



watch(selected, (selected) => {
    if (props.updateUrlQuery) {
        router.replace({
            query: {
                ...router.currentRoute.value.query,
                // [props.urlQueryNamespace ?? 'filter']: 
                status: selected
            }
        })
    }
});


onMounted(() => {
    // if (props.updateUrlQuery) {
    const query = router.currentRoute.value.query;
    if (query) {
        try {
            setTimeout(() => {
                selected.value = (query.status as any) ?? [];
            }, 10);
        } catch (e) {

        }
    };
});


function clear() {
    selected.value = [];
    console.log("CLEARED!!!");
}


const statuses = [
    { text: 'New', value: 'new' },
    { text: 'Assigned', value: 'assigned' },
    { text: 'Processing', value: 'processing' },
    { text: 'Ready', value: 'ready' },
    { text: 'On Hold', value: 'onhold' },
    { text: 'In Transit', value: 'intransit' },
    { text: 'Delivered', value: 'delivered' },
    { text: 'Completed', value: 'completed' },
    { text: 'Cancelled', value: 'cancelled' },
];

</script>