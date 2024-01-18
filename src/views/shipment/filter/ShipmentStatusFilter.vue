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
            <template v-slot:append>
                <span v-if="pagination">
                    <v-chip class="mx-1" color="grey" :size="18" variant="flat" label>
                        {{ pagination.count }}
                    </v-chip>
                </span>
                <span v-else-if="count">
                    <v-chip class="mx-1" color="grey" :size="18" variant="flat" label>
                        {{ count }}
                    </v-chip>
                </span>
                <v-progress-circular indeterminate :size="15" v-else />
            </template>
        </v-btn>
        <!-- <v-chip v-for="(status, i) in statuses" :key="status.value" r-class="mx-2" :value="status.value" label
            :color="rselected.includes(status.value) ? 'primary' : undefined" :elevation="0">
            {{ status.text }}
        </v-chip> -->
        <StatusFilterChip v-for="(status, i) in statuses" :key="status.value" r-class="mx-2" :value="status.value"
            :filter="filter" label :is-selected="rselected.includes(status.value)" size="small" :elevation="0"
            :counter="counter" :count="count" :url="url">
            {{ status.text }}
        </StatusFilterChip>
    </v-chip-group>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import StatusFilterChip from './StatusFilterChip.vue';
import useSWRV from 'swrv';

const props = defineProps<{
    modelValue?: string[] | string | number;
    filter?: string;
    updateUrlQuery?: boolean;
    // 

    counter: (input: { status?: string, filter?: string }) => Promise<{ count: number }>;
    count?: number;
    url: string;
}>();

const emit = defineEmits<{
    (e: 'update:model-value', value: string | number | string[] | undefined): void;
    (e: 'cleared',): void;
}>();


const { data: pagination, isValidating: loading, error } = useSWRV(
    () => (!props.counter) ? null : `${props.url}?filter=${props.filter}`,
    () => props.counter!({ filter: props.filter }),
    {
        refreshInterval: 0,
        revalidateOnFocus: false,
        revalidateDebounce: 100,
    }
);


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

let isUpdating = false;
watch(selected, (v) => {
    // if(Array.isArray(v)){
    //     v = v[0]?? null;
    // }
    if (isUpdating) {
        return;
    }
    isUpdating = true;
    let _selected = v;
    if (!Array.isArray(_selected)) {
        _selected = [_selected as any];
    }

    const _removedIndex: (number)[] = [];
    for (const index in _selected) {
        const v = _selected[index];
        if (Number.isSafeInteger(v)) {
            _removedIndex.push(index as any);
        }
    }
    if (_removedIndex.length > 0) {
        for (const index of _removedIndex) {
            _selected.splice(index, 1);
        }
        selected.value = _selected;
    }
    emit('update:model-value', _selected);

    setTimeout(() => isUpdating = false, 10);
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
            }, 1000);
        } catch (e) {

        }
    };
});


function clear() {
    selected.value = [];
    emit('cleared');
    // console.log("CLEARED!!!");
}


const statuses = [
    { text: 'New', value: 'new' },
    { text: 'Assigned', value: 'assigned' },
    // { text: 'Processing', value: 'processing' },
    // { text: 'Ready', value: 'ready' },
    { text: 'On Hold', value: 'onhold' },
    { text: 'In Transit', value: 'intransit' },
    { text: 'Delivered', value: 'delivered' },
    { text: 'Exchanged', value: 'exchanged' },
    { text: 'Returned', value: 'returned' },
    // { text: 'Completed', value: 'completed' },
    { text: 'Cancelled', value: 'cancelled' },
];

</script>