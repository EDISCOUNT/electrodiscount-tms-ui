<template>
    <slot name="activator" v-bind:attachments="attachments">
        <v-btn @click="() => toggle()" :elevation="0" variant="plain">
            Attachments {{ attachments.length }}
        </v-btn>
    </slot>
    <!-- {{ {attachments: attachments?.length} }} -->

    <v-dialog v-model="isOpen" max-width="800px" inset>
        <v-card flat>

            <v-card-text>
                <ShipmentDocumentForm v-model:attachments="attachments" :attachments="attachments" :shipment="shipment"
                    :type="type" :submitting="submitting">
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

const props = defineProps({
    shipment: {
        type: Shipment,
        required: true,
    },
    type: {
        type: String,
        required: false,
    },
    submitting: {
        type: Boolean,
        default: false,
    }
});

const emit = defineEmits<{
    (e: 'update:attachments', attachments: ShipmentDocumentFileAttachmentFormData[]);
}>();


const attachments = ref<ShipmentDocumentFileAttachmentFormData[]>([]);
watch(attachments, (attachments) => emit('update:attachments', attachments), { deep: true });

const isOpen = ref(false);
function toggle() {
    isOpen.value = !isOpen.value;
}
</script>