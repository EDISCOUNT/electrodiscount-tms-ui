<template>
    <v-combobox v-model="addresses" label="Recipients" placeholder="Enter the email address" r-variant="plain"
        r-density="compact" multiple>


        <template v-slot:append>
            <slot name="append" v-bind:addresses="addresses">
            </slot>
        </template>
        <template v-slot:append-inner>
            <slot name="append-inner" v-bind:addresses="addresses">
            </slot>
        </template>

        <template v-slot:chip="{ item: { raw }, index }">
            <template v-if="typeof (raw) === 'string'">
                <v-chip class="pl-1" @click:close="() => remove(index)" closable>
                    <template v-if="raw.length > 0" v-slot:prepend>
                        <v-avatar color="primary">
                            <span class="text-h6">
                                {{ raw.slice(0, 1).toUpperCase() }}
                            </span>
                        </v-avatar>
                    </template>
                    <span class="mx-1">{{ raw }}</span>
                </v-chip>
            </template>

            <template v-if="(raw instanceof Address)">
                <v-menu width="400px" :close-on-content-click="false" open-on-hover>
                    <template v-slot:activator="{ props }">
                        <v-chip class="pl-1" v-bind="props" @click:close="() => remove(index)" closable>
                            <template v-slot:prepend>
                                <v-avatar color="primary">
                                    <span class="text-h6">
                                        {{ raw.fullName.slice(0, 1).toUpperCase() }}
                                    </span>
                                </v-avatar>
                            </template>
                            <span class="mx-1">{{ raw.fullName }}</span>
                        </v-chip>
                    </template>
                    <v-card flat>
                        <v-card-text>
                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-avatar color="primary" :size="50">
                                        <span class="text-h5">
                                            {{ raw.fullName.slice(0, 1).toUpperCase() }}
                                        </span>
                                    </v-avatar>
                                </template>
                                <template v-slot:title>
                                    <span class="text-h5">{{ raw.fullName }}</span>
                                </template>
                                <template v-slot:subtitle>
                                    <span>{{ raw.emailAddress }}</span>
                                </template>
                            </v-list-item>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-btn color="primary" r-:elevation="0">
                                Open Detail View
                            </v-btn>
                            <v-spacer />

                            <template v-if="raw.phoneNumber">

                                <v-tooltip>
                                    <template v-slot:activator="{ props }" position="bottom">
                                        <v-btn v-bind="props" :href="`tel:${raw.phoneNumber}`" color="primary"
                                            :elevation="0" icon>
                                            <v-icon>mdi-phone</v-icon>
                                        </v-btn>
                                    </template>
                                    <small>Call: {{ raw.phoneNumber }}</small>
                                </v-tooltip>
                                <v-tooltip>
                                    <template v-slot:activator="{ props }" position="bottom">
                                        <v-btn v-bind="props" color="primary" :elevation="0" icon>
                                            <v-icon>mdi-message</v-icon>
                                        </v-btn>
                                    </template>
                                    <small>Send SMS</small>
                                </v-tooltip>
                            </template>
                            <v-tooltip>
                                <template v-slot:activator="{ props }" location="bottom">
                                    <v-btn v-bind="props" :href="`mailto:${raw.emailAddress}`" color="primary"
                                        :elevation="0" icon>
                                        <v-icon>mdi-email</v-icon>
                                    </v-btn>
                                </template>
                                <small>Email: {{ raw.emailAddress }}</small>
                            </v-tooltip>
                        </v-card-actions>
                    </v-card>
                </v-menu>

            </template>
        </template>

    </v-combobox>
</template>

<script lang="ts" setup>
import Address from '@/model/addressing/address';
import EmailAddress from '@/model/mailing/email_address';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
    modelValue?: (Address | EmailAddress | string)[],
}>();


const emit = defineEmits<{
    (e: 'update:model-value', addresses: (Address | EmailAddress | string)[]): void;
}>();


const addresses = ref<(Address | EmailAddress | string)[]>([]);


let isUpdating = false;

watch(addresses, (addresses) => {
    if (isUpdating) {
        return;
    }
    console.log(">>>>>>>>>>>>>>>>>OUTPUTTING")
    emit('update:model-value', addresses);
    console.log("OUTPUTTED.........")
}, { deep: true });
watch(() => props.modelValue, updateAddresses);
onMounted(() => updateAddresses(props.modelValue));

function updateAddresses(value?: (Address | EmailAddress | string)[]) {
    isUpdating = true;
    console.log("INPUTTING<<<<<<<<<<<<<<<<<<<<")
    addresses.value = value ?? [];
    console.log(".........PUTINTED")
    setTimeout(() => {
        isUpdating = false;
    }, 10);
}



function remove(index: number) {
    addresses.value.splice(index, 1);
}

</script>