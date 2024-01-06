<template>
    <slot name="activator" v-bind:attachments="attachments" v-bind:toggle="toggle">
        <v-btn @click="() => toggle()" :elevation="0" variant="plain">
            Attachments {{ attachments.length }}
        </v-btn>
    </slot>
    <!-- {{ {attachments: attachments?.length} }} -->

    <v-dialog v-model="isOpen" max-width="800px" inset>
        <v-card flat>

            <v-card-text>
                <ShipmentDocumentForm v-model:attachments="attachments" :shipment="shipment"
                    :type="ShipmentDocumentType.POD" :submitting="submitting">
                    <template v-slot:append>
                        <v-btn @click="() => toggle()" :elevation="0" variant="text">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>

                </ShipmentDocumentForm>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script  lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import { ShipmentDocumentFileAttachmentFormData } from '@/model/shipment/shipment_document_attachment';
import ShipmentDocumentForm from './ShipmentDocumentForm.vue';
import { ref, watch, } from 'vue';
import ShipmentDocumentType from '@/model/shipment/shipment_document_type';

const props = defineProps<{
    shipment: Shipment;
    type?: String;
    submitting?: boolean;
    attachments?:ShipmentDocumentFileAttachmentFormData[];
}>();

const emit = defineEmits<{
    (e: 'update:attachments', attachments: ShipmentDocumentFileAttachmentFormData[]): void;
}>();


let is_updating_attachment = false;
const attachments = ref<ShipmentDocumentFileAttachmentFormData[]>([]);
watch(attachments, (attachments) => emit('update:attachments', attachments), { deep: true });
watch(() => props.attachments, (input) => {
    if (is_updating_attachment) return;
    is_updating_attachment = true;
    attachments.value = input?? [];
    is_updating_attachment = false;
}, { deep: true });

const isOpen = ref(false);
function toggle() {
    isOpen.value = !isOpen.value;
}
</script>