<template>
    <v-tooltip location="bottom">
        <template v-slot:activator="{ props }">
            <v-card v-bind="props" min-height="150px" r-color="grey-lighten-5" min-width="250px" flat>
                <!-- {{ {  attachment } }} -->
                <v-img :src="attachment.href">
                    <template v-slot:placeholder>
                        <v-sheet>
                            <!-- {{ { href: attachment.href } }} -->
                            <v-row justify="center" align="center" class="fill-height">
                                <v-icon>mdi-attachment</v-icon>
                            </v-row>
                        </v-sheet>
                    </template>
                </v-img>
                <v-card-subtitle>
                    {{ attachment.type }}
                </v-card-subtitle>
                <v-card-actions>
                    <v-dialog v-model="isDialogOpen" max-width="600px">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" color="primary">
                                <v-icon>mdi-open-in-new</v-icon>
                            </v-btn>
                        </template>
                        <v-card flat>
                            <template v-slot:prepend>
                                <v-chip>
                                    <template v-slot:prepend>
                                        <v-icon v-if="attachment.type == ShipmentDocumentAttachmentType.SIGNATURE">
                                            mdi-signature
                                        </v-icon>
                                        <v-icon v-else-if="attachment.type == ShipmentDocumentAttachmentType.IMAGE">
                                            mdi-image
                                        </v-icon>
                                        <v-icon v-else>
                                            mdi-file
                                        </v-icon>
                                    </template>
                                    {{ attachment.type }}
                                </v-chip>
                            </template>
                            <template v-slot:append>
                                <v-btn @click="() => toggle()" variant="plain" icon>
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </template>
                            <!-- <v-card-text> -->
                            <v-img :src="attachment.href" max-height="500px">
                                <template v-slot:placeholder>
                                    <v-sheet>
                                        <!-- {{ { href: attachment.href } }} -->
                                        <v-row justify="center" align="center" class="fill-height">
                                            <v-icon>mdi-attachment</v-icon>
                                        </v-row>
                                    </v-sheet>
                                </template>
                            </v-img>

                            <v-card-text class="text-center">
                                <span>
                                    {{ attachment.caption ?? '[No caption]' }}
                                </span>
                            </v-card-text>
                            <!-- </v-card-text> -->
                        </v-card>
                    </v-dialog>
                    <v-btn color="primary" :href="attachment.href" target="_blank">
                        Open file
                    </v-btn>
                </v-card-actions>
            </v-card>
        </template>
        <span>{{ attachment.caption ?? '[No Caption]' }}</span>
    </v-tooltip>
</template>

<script lang="ts" setup>
import ShipmentDocumentAttachment from '@/model/shipment/shipment_document_attachment';
import ShipmentDocumentAttachmentType from '@/model/shipment/shipment_document_attachment_type';
import { ref } from 'vue';


const props = defineProps<{
    attachment: ShipmentDocumentAttachment
}>();


const isDialogOpen = ref(false);

function toggle() {
    isDialogOpen.value = !isDialogOpen.value;
}

</script>