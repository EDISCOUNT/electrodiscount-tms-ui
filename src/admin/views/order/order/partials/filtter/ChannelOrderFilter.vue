<template>
    <v-card v-resize="onResize" flat>
        <!-- <v-chip-group>
            <v-chip color="primary" size="small" label>
                All
            </v-chip>

            <v-chip color="primary" size="small" label>
                Assigned
            </v-chip>

            <v-chip color="primary" size="small" label>
                Unplanned
            </v-chip>

            <v-chip color="primary" size="small" label>
                Completed
            </v-chip>
        </v-chip-group> -->
        <!-- {{ { currentItem } }} -->
        <v-chip-group v-model="currentItem" mandatory>
            <v-chip v-for="item in chips" :key="item.value" :value="item.value" size="small"
                :color="currentItem == item.value ? 'primary' : undefined" label>
                {{ item.text }}
            </v-chip>

            <v-menu v-if="more.length" bottom left>
                <template v-slot:activator="{ props }">
                    <v-btn class="align-self-center mr-4" v-bind="props">
                        more
                        <v-icon right>mdi-menu-down</v-icon>
                    </v-btn>
                </template>

                <v-list class="grey-lighten-3">
                    <v-list-item v-for="item in more" :key="item.value" @click="addItem(item)">
                        {{ item }}
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-chip-group>
    </v-card>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeMount } from 'vue';
import { watch } from 'vue';
import { ref, nextTick } from 'vue';

type Item = {
    value: string;
    text: string;
}

const props = defineProps<{
    modelValue?: string;
}>();


const emit = defineEmits<{
    (e: 'update:model-value', value?: string): void;
}>();


const currentItem = ref<any>('open');


watch(
    () => props.modelValue,
    (value) => currentItem.value = value,
);

watch(currentItem, (value) => emit('update:model-value', value));
// onBeforeMount(() => emit('update:model-value', currentItem.value));
emit('update:model-value', currentItem.value);


const items = ref([
    {
        value: 'open',
        text: 'Open',
    },
    {
        value: 'shipped',
        text: 'Shipped',
    },
    {
        value: 'all',
        text: 'All',
    },
]);
const chips = ref<Item[]>([]);
const more = ref<Item[]>([]);

function onResize() {
    const temp = items.value.slice()
    chips.value = temp.splice(0, (window.innerWidth / 100) - 1)
    more.value = temp.splice(0)
}


function addItem(item: any) {
    const removed = chips.value.splice(chips.value.length - 1, 1)
    chips.value.push(
        ...more.value.splice(more.value.indexOf(item), 1)
    )
    more.value.push(...removed)
    nextTick(() => { currentItem.value = 'tab-' + item })
}
</script>