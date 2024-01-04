<template>
    <v-hover>
        <template v-slot="{ isHovering, props }">
            <v-card v-bind="props" flat>

                <!-- <v-card-text> -->
                <v-card flat>
                    <v-overlay :model-value="isHovering" class="align-center justify-center" contained>
                        <v-container class="fill-height">
                            <v-responsive class="align-center text-center fill-height">
                                <v-btn @click="() => update()" variant="plain">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn @click="() => remove()" variant="plain">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-responsive>
                        </v-container>
                    </v-overlay>

                    <v-img :src="createFileURL(attachment.src)" height="150px" class="" />
                </v-card>
                <!-- </v-card-text> -->
                <v-card-text r-v-show="isHovering" class="py-0 my-0">
                    <v-text-field v-model="attachment.caption" placeholder="Enter Caption(optional)" density="compact" variant="plain" :counter="64" clearable/>
                </v-card-text>
            </v-card>
        </template>
    </v-hover>
</template>

<script lang="ts" setup>
import Shipment from '@/model/shipment/shipment';
import ShipmentDocumentAttachmentType from '@/model/shipment/shipment_document_attachment_type';

const props = defineProps({
    // order: {
    //     type: Shipment,
    //     required: true,
    // },
    type: {
        type: String,
        required: true,
    },
    attachment: {
        type: Object,
        required: true,
    }
});
// ShipmentDocumentAttachmentType

const emit = defineEmits({
    remove: () => undefined,
    update: () => undefined,
})

function createFileURL(file: File) {
    return URL.createObjectURL(file);
};

function update() {
    emit('update',);
}

function remove() {
    emit('remove',);
}
</script>