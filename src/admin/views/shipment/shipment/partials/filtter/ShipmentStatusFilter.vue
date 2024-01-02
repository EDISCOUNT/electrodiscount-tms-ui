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
        <v-chip-group v-model="currentItem" :column="smAndDown">
            <v-chip v-for="item in chips" :key="item.value">
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
                    <v-list-item v-for="item in more" :key="item" @click="addItem(item)">
                        {{ item }}
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-chip-group>
    </v-card>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { useDisplay } from 'vuetify';



const { xs, smAndDown, sm, lg } = useDisplay();

const currentItem = ref<any>();


const items = ref<Entry[]>([
    {
        value: 'booked',
        text: 'Booked',
    },
    {
        value: 'assigned',
        text: 'Assigned',
    },
    {
        value: 'unplanned',
        text: 'Unplanned',
    },
    {
        value: 'completed',
        text: 'Completed',
    },
    {
        value: 'cancelled',
        text: 'Cancelled',
    },
    {
        value: 'returned',
        text: 'Returned',
    },


]);
const chips = ref<any[]>([]);
const more = ref<any[]>([]);

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



interface Entry {
    value: string;
    text: string;
}
</script>