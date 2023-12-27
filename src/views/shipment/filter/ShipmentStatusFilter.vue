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
    <v-chip-group v-model="selected" r-multiple variant="flat" show-arrows>
        <!-- <template v-slot:prepend>
            
        </template> -->
        <v-chip r-class="mx-2" @click="() => selected = undefined" label
            :color="(!selected) ? 'primary' : undefined" :elevation="0">
            All
        </v-chip>
        <v-chip v-for="(status, i) in statuses" :key="status.value" r-class="mx-2" :value="status.value" label
            :color="rselected.includes(status.value) ? 'primary' : undefined" :elevation="0">
            {{ status.text }}
        </v-chip>
    </v-chip-group>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';

const props = defineProps<{
    modelValue?: string[] | string | number;
}>();

const emit = defineEmits<{
    (e: 'update:model-value', value: string[]): void;
}>();

const selected = ref<string[]>(props.modelValue ?? []);

const rselected = computed(() => Array.isArray(selected.value) ? selected.value : (selected.value ? [selected.value] : []));

watch(() => props.modelValue, (value) => {
    // if (value) {
    //     if (!Array.isArray(value)) {
    //         value = [value];
    //     }
    //     selected.value = value;
    // }
    selected.value = value;
});

watch(selected, (v) => {
    // if(Array.isArray(v)){
    //     v = v[0]?? null;
    // }
    emit('update:model-value', v);
});




const statuses = [
    { text: 'New', value: 'new' },
    { text: 'Assigned', value: 'assigned' },
    { text: 'Processing', value: 'processing' },
    { text: 'Ready', value: 'ready' },
    { text: 'In Transit', value: 'intransit' },
    { text: 'Delivered', value: 'delivered' },
    { text: 'Completed', value: 'completed' },
    { text: 'Cancelled', value: 'cancelled' },
];

</script>