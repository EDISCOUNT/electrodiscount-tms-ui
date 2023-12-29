<template>
    <input type="file" ref="fileInput" style="display:none;" @change="onFileInput" multiple />
    <v-card flat>
        <!-- <template v-slot:title>
            <span>Message the Client</span>
        </template> -->
        <!-- {{ { addresses, data, } }} -->
        <!-- {{ { data, } }} -->
        <v-card-text>
            <v-combobox v-model="data.recipients" label="Recipients" placeholder="Enter the email address" r-variant="plain"
                r-density="compact" multiple>

                <template v-slot:chip="{ item: { raw }, index }">
                    <template v-if="typeof (raw) === 'string'">
                        <v-chip class="px-1" close>
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
                        <v-menu width="400px" open-on-hover>
                            <template v-slot:activator="{ props }">
                                <v-chip class="px-1" v-bind="props" close>
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
            <!-- <v-divider class="mb-4" /> -->
            <v-text-field v-model="data.subject" label="Subject" variant="outlined" density="compact" />
            <v-textarea v-model="data.message" :rows="5" label="Messages" variant="outlined" />
        </v-card-text>
        <v-card-text v-if="data.attachments?.length">
            <v-card max-height="200px" style="overflow-y: auto" flat>
                <v-list lines="one" density="compact">
                    <v-list-item v-for="(attachment, i) in data.attachments" :key="i" density="compact" class="py-0 my-0">
                        <template v-slot:title>
                            <span>{{ attachment.file?.name }}</span>
                        </template>
                        <template v-slot:append>
                            <v-btn @click="() => data.attachments?.splice(i, 1)" :elevation="0">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="() => selectFile()" color="primary">
                <v-icon>mdi-attachment-plus</v-icon>
            </v-btn>
            <v-spacer />
            <v-btn @click="() => send()" color="primary" :loading="isSending" :elevation="0">
                Send<v-icon>mdi-send</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import Address from '@/model/addressing/address';
import EmailMessage, { EmailMessageFormData } from '@/model/mailing/message';
import { createEmailMessage } from '@/repository/mailing/message_repository';
import { ref, reactive, watch, computed } from 'vue';

const props = defineProps<{
    shipment?: Shipment,
    addresses?: (Address | string)[],
}>();

const emit = defineEmits<{
}>();

const fileInput = ref<HTMLInputElement>();
const isSending = ref(false);



const addresses = computed(() => {
    const addresses: (Address | string)[] = [];

    if (props.shipment) {
        const shipment = props.shipment;
        if (shipment.billingAddress) {
            addresses.push(shipment.billingAddress);
        }
        if (shipment.originAddress) {
            addresses.push(shipment.originAddress);
        }
        if (shipment.destinationAddress) {
            addresses.push(shipment.destinationAddress);
        }

    }
    if (props.addresses) {
        addresses.push(...props.addresses.filter(e => !!e));
    }
    return addresses;
});


const data = reactive<EmailMessageFormData>({
    recipients: addresses.value,
    ccRecipients: [] as (string | Address)[],
    bccRecipients: [] as (string | Address)[],
    subject: (undefined as any) as string ,
    message: (undefined as any) as string,
    attachments: [] as FileEntry[],
});




async function send() {
    try {
        isSending.value = true;
        const message = await createEmailMessage(data);

    }
    catch (err) {

    }
    finally {
        isSending.value = false;
    }
}


function selectFile() {
    fileInput.value?.click();
}

function onFileInput(evt: any) {
    // console.log("evt: ", {evt});
    const files = evt.target.files;
    const attachments = [...(data.attachments?? []), ... Array.from<File>(files).map((file: File) => ({ file }))];
    data.attachments = attachments;
    fileInput.value!.value = '';
}


interface FileEntry {
    file: File;
    caption?: string;
}

</script>