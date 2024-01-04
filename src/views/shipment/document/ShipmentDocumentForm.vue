<template>
    <!-- {{ { attachments } }} -->
    <SignaturePadDialog v-model:open="isSignatureDIalogOpen" @save="(attachment) => addSignature(attachment)" />


    <input ref="fileInput" accept="image/*" type="file" style="display:none;" @change="(evt) => onFileInput(evt)"
        multiple />
    <v-card flat>
        <v-card-title>
            Proof of Delivery
        </v-card-title>
        <v-card-subtitle>
            File Attachments
        </v-card-subtitle>
        <v-card-text class="px-0">
            <v-sheet height="500px" style="overflow-y: auto;" class="pa-4" color="secondary-bg">
                <v-row justify="start">
                    <v-col v-for="(attachment, i) in attachments" :key="i" :cols="12" :sm="4">
                        <v-card flat>
                            <ShipmentDocumentAttachmentForm @remove="() => removeAttachment(i)" :attachment="attachment"
                                type="" />
                        </v-card>
                    </v-col>

                    <v-col :cols="12" :sm="4">
                        <v-card class="pa-2" flat>
                            <v-container class="fill-height">
                                <v-responsive class="align-center text-center fill-height">
                                    <v-card-title class="text-center">
                                        Add new File
                                    </v-card-title>
                                    <v-card-text class="text-center my-1">
                                        Add a new file attachment
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-menu r-attach="newAttachmentButtonRef" v-model="isAttachmentDialogOpen">
                                            <template v-slot:activator="{ props }">
                                                <v-btn v-bind="props" @r-click="() => openAttachmentDialog()"
                                                    ref="newAttachmentButtonRef" color="primary" block>
                                                    Add
                                                    <v-icon>mdi-plus-circle</v-icon>
                                                </v-btn>
                                            </template>
                                            <v-card flat>
                                                <v-list>
                                                    <v-list-item @click="() => selectFile()">
                                                        <template v-slot:title>
                                                            Image
                                                        </template>
                                                        <template v-slot:subtitle>
                                                            Add an Image
                                                        </template>
                                                    </v-list-item>
                                                    <v-divider />
                                                    <v-list-item @click="() => openSignatureDialog()">
                                                        <template v-slot:title>
                                                            Signature
                                                        </template>
                                                        <template v-slot:subtitle>
                                                            Get Signature from collector/shipper
                                                        </template>
                                                    </v-list-item>
                                                </v-list>
                                            </v-card>
                                        </v-menu>


                                    </v-card-actions>
                                </v-responsive>
                            </v-container>
                        </v-card>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-card-text>
        <!-- <v-card-actions>
            <v-spacer />
            <v-btn @click="() => cancel()" color="primary" variant="outlined">
                Cancel
            </v-btn>
            <v-btn @click="() => submit()" color="primary" :loading="submitting" variant="flat">
                Save
            </v-btn>
        </v-card-actions> -->
    </v-card>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import { ShipmentDocumentFileAttachmentFormData } from '@/model/shipment/shipment_document_attachment';
import ShipmentDocumentType from '@/model/shipment/shipment_document_type';
import ShipmentDocumentAttachmentType from '@/model/shipment/shipment_document_attachment_type';
import ShipmentDocumentAttachmentForm from './ShipmentDocumentAttachmentForm.vue';
import SignaturePadDialog from './SignaturePadDialog.vue';
import { ref, watch, onMounted } from 'vue';
import { useNotifier } from 'vuetify-notifier';

const props = defineProps<{
    shipment: Shipment;
    type?: ShipmentDocumentType;
    submitting?: boolean;
    attachments?: ShipmentDocumentFileAttachmentFormData[];
}>();

const emit = defineEmits<{
    (e: 'submit', data: any): void;
    (e: 'cancel'): void;
    (e: 'update:attachments', attachments: ShipmentDocumentFileAttachmentFormData[]): void;
}>();


const notifier = useNotifier();

const attachments = ref<ShipmentDocumentFileAttachmentFormData[]>([]);

const fileInput = ref<HTMLInputElement>();



let updatingAttachments = false;
watch(
    () => props.attachments,
    (input) => {
        updatingAttachments = true;
        attachments.value = input;
        setTimeout(() => {
            updatingAttachments = false;
        }, 10);
    },
    { deep: true }
);
watch(attachments, (attachments) => {
    // console.log("ATTACHMENTS: ", { attachments: [...attachments] });
    if (updatingAttachments) {
        return;
    }
    emit('update:attachments', [...attachments]);
}, { deep: true });

onMounted(() => {
    attachments.value = props.attachments?? [];
});

function submit() {
    try {
        if (!attachments.value.length) {
            throw new Error("You need to select at least one attachment to fulfil this data");
        }


        const document = { attachments: attachments.value }
        emit('submit', { document });
    }
    catch (err) {
        const text = (err as any).message;
        createSnackbar({ text });
    }
    finally {

    }
}


function selectFile() {
    fileInput.value?.click();
}

const isAttachmentDialogOpen = ref(false);
const isSignatureDIalogOpen = ref(false);

const newAttachmentButtonRef = ref();

function openAttachmentDialog() {
    isAttachmentDialogOpen.value = !isAttachmentDialogOpen.value;
}

function openSignatureDialog() {
    isSignatureDIalogOpen.value = !isSignatureDIalogOpen.value;
}

function cancel() {
    emit('cancel');
}

function removeAttachment(index: number) {
    attachments.value.splice(index, 1);
}


function onFileInput(evt: Event) {
    evt.preventDefault();
    const files = (evt.target as HTMLInputElement).files;
    // console.log('EVENT: ', evt);
    console.log('files: ', files);

    if (!files)
        return;

    for (const file of Array.from(files)) {
        attachments.value.push({
            type: ShipmentDocumentAttachmentType.IMAGE,
            src: file,
            meta: {},
        })
    }
    (fileInput.value as any).value = '';
}




function addSignature(signature: ShipmentDocumentFileAttachmentFormData) {
    attachments.value.push({ ...signature, type: ShipmentDocumentAttachmentType.SIGNATURE });
}

</script>