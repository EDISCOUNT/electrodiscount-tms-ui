<template>
    <input type="file" ref="fileInput" style="display:none;" @change="onFileInput" multiple />
    <v-card flat>
        <!-- <template v-slot:title>
            <span>Message the Client</span>
        </template> -->
        <!-- {{ { addresses, data, } }} -->
        <!-- {{ { addresses, } }} -->
        <!-- {{ { data, } }} -->
        <!-- 
        <template v-slot:title>
            <v-tabs>
                <v-tab value="email">EMail</v-tab>
                <v-tab value="sms">SMS</v-tab>
            </v-tabs>
        </template> -->
        <v-card r-color="pink" max-height="calc(100vh - 80px)" style="overflow-y: auto;" flat>

            <v-card-text>
                <EmailRecipientField v-model="data.recipients">
                    <template v-slot:append-inner="{ addresses }">
                        <v-row v-if="addresses.length > 0" class="px-2">
                            <v-btn @click="() => toggleCc()" v-if="!showMap.cc" variant="text" class="pa-0" :elevation="0"
                                size="x-small">
                                CC
                            </v-btn>
                            <v-btn @click="() => toggleBcc()" v-if="!showMap.bcc" variant="text" class="pa-0" :elevation="0"
                                size="x-small">
                                BCC
                            </v-btn>
                        </v-row>
                    </template>

                </EmailRecipientField>
                <EmailRecipientField v-show="showMap.cc" v-model="data.ccRecipients" label="CC">
                    <template v-slot:append-inner="{ addresses }">
                        <v-row v-if="addresses.length > 0" class="px-5">
                            <v-btn @click="() => toggleBcc()" v-if="!showMap.bcc" variant="text" class="pa-0" :elevation="0"
                                size="x-small">
                                BCC
                            </v-btn>
                            <v-btn v-show="addresses.length == 0" @click="() => toggleCc()" variant="text" class="pa-0"
                                :elevation="0" size="x-small">
                                CLOSE
                            </v-btn>
                        </v-row>
                    </template>
                </EmailRecipientField>
                <EmailRecipientField v-show="showMap.bcc" v-model="data.bccRecipients" label="BCC">
                    <template v-slot:append-inner="{ addresses }">
                        <v-row v-if="addresses.length > 0" class="px-5">
                            <v-btn @click="() => toggleCc()" v-if="!showMap.bcc" variant="text" class="pa-0" :elevation="0"
                                size="x-small">
                                CC
                            </v-btn>
                            <v-btn v-show="addresses.length == 0" @click="() => toggleBcc()" variant="text" class="pa-0"
                                :elevation="0" size="x-small">
                                Close
                                <!-- <v-icon>mdi-close</v-icon> -->
                            </v-btn>
                        </v-row>
                    </template>
                </EmailRecipientField>
                <!-- <v-divider class="mb-4" /> -->
                <v-text-field v-model="data.subject" label="Subject" variant="outlined" density="compact">

                    <template v-slot:append-inner>

                        <v-menu :close-on-content-click="false" v-model="isTemplateDialogOpen" width="500px">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" :elevation="0" icon>
                                    <v-icon>mdi-history</v-icon>
                                </v-btn>
                            </template>
                            <v-card min-height="400px" flat>
                                <template v-slot:title>
                                    Select Email template to reuse
                                </template>
                                <template v-slot:append>
                                    <v-btn @click="() => closeTemplateDialog()" :elevation="0" icon>
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </template>
                                <v-card-text>
                                    <TemplateInput @input="(template) => onselectTemplate(template)"
                                        prepend-inner-icon="mdi-magnify"
                                        placeholder="Start typing to search for templates..." variant="outlined"
                                        density="compact" />
                                </v-card-text>
                            </v-card>
                        </v-menu>
                    </template>

                </v-text-field>
                <!-- <v-textarea v-model="data.message" :rows="5" label="Messages" variant="outlined" /> -->
                <EmailForm v-model="data.message" />
            </v-card-text>
            <v-card-text v-if="data.attachments?.length">
                <v-card max-height="200px" style="overflow-y: auto" flat>
                    <v-list lines="one" density="compact">
                        <v-list-item v-for="(attachment, i) in data.attachments" :key="i" density="compact"
                            class="py-0 my-0">
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
        </v-card>
        <v-card-actions>
            <v-btn @click="() => selectFile()" color="primary">
                <v-icon>mdi-attachment-plus</v-icon>
            </v-btn>
            <v-spacer />
            <v-switch v-model="data.saveAsTemplate" label="Save as template" inset density="compact" color="primary"
                class="my-0 py-0" />
            <v-spacer />
            <v-btn @click="() => send()" color="primary" :loading="isSending" :elevation="0">
                Send<v-icon>mdi-send</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import Order from '@/model/order/order';
import Address from '@/model/addressing/address';
import EmailMessage, { EmailMessageFormData } from '@/model/mailing/message';
import { createEmailMessage } from '@/repository/mailing/message_repository';
import { ref, reactive, watch, computed } from 'vue';
import EmailForm from './EmailForm.vue';
import EmailRecipientField from './EmailRecipientField.vue';
import TemplateInput from '../template/partials/TemplateInput.vue';
import EmailMessageTemplate from '@/model/mailing/message_template';
import { useNotifier } from 'vuetify-notifier';


const props = defineProps<{
    shipment?: Shipment,
    order?: Order,
    addresses?: (Address | string)[],
}>();

const emit = defineEmits<{
}>();
const notifier = useNotifier();

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
    if (props.order) {
        const order = props.order;
        if (order.billingAddress) {
            addresses.push(order.billingAddress);
        }
        if (order.shippingAddress) {
            addresses.push(order.shippingAddress);
        }
    }

    if (props.addresses) {
        addresses.push(...props.addresses.filter(e => !!e));
    }


    const _addresses: (Address | string)[] = [];

    for (const address of addresses) {
        if (_addresses.some(_address => {

        }));
    }

    return addresses;
});


const data = reactive<EmailMessageFormData>({
    recipients: addresses.value,
    ccRecipients: [] as (string | Address)[],
    bccRecipients: [] as (string | Address)[],
    subject: (undefined as any) as string,
    message: (undefined as any) as string,
    attachments: [] as FileEntry[],
});




const isTemplateDialogOpen = ref(false);
function closeTemplateDialog() {
    isTemplateDialogOpen.value = !isTemplateDialogOpen.value;
}


async function send() {
    try {

        if (data.saveAsTemplate) {
            const label = await notifier.prompt({ title: 'Enter Label', text: "Enter the Label to mark this template with.(Optional)" });
            data.label = label;
        }
        isSending.value = true;
        const message = await createEmailMessage(data);
        notifier.toastSuccess("Message sent succesfully!");
    }
    catch (err) {
        const message = (err as any).message as string;
        notifier.toastError(message);
    }
    finally {
        isSending.value = false;
    }
}



const showMap = reactive({
    cc: false,
    bcc: false
});


function toggleCc() {
    showMap.cc = !showMap.cc;
}

function toggleBcc() {
    showMap.bcc = !showMap.bcc;
}


function onselectTemplate(template?: EmailMessageTemplate) {
    // console.log("SELECTED TEMPLATE: ", { template });
    if (template) {
        data.subject = template.subject ?? data?.subject;
        data.message = template.message ?? data.message;
        closeTemplateDialog();
    }
}

function selectFile() {
    fileInput.value?.click();
}

function onFileInput(evt: any) {
    // console.log("evt: ", {evt});
    const files = evt.target.files;
    const attachments = [...(data.attachments ?? []), ...Array.from<File>(files).map((file: File) => ({ file }))];
    data.attachments = attachments;
    fileInput.value!.value = '';
}


interface FileEntry {
    file: File;
    caption?: string;
}

</script>