<style>
.text-break {
    word-break: break-all !important;
}
</style>
<template>
    <!-- <VueSignaturePad r-width="500px" height="350px" ref="signaturePad" /> -->

    <v-bottom-sheet v-model="signatureDialog" r-location="bottom" r-style="border-radius: 30px 30px 0px 0px;" r-:width="400"
        temporary inset>
        <!-- <template v-slot:prepend>
            <v-card-title>
                <v-row justify="center">
                    <v-card width="100px" class="pt-1" flat>
                        <v-card v-for="i in 3" style="margin-top: 1px;" height="3px" color="grey-lighten-2" flat />
                    </v-card>
                </v-row>
            </v-card-title>
        </template> -->

        <v-card flat v-model="tab" direction="vertical" min-height="500px" touchless>

            <v-slide-x-transition v-if="tab === 'signer-info'">
                <v-card class="fill-height" flat>
                    <v-row class="fill-height" justify="center" align="center">
                        <v-card min-width="350px" flat>
                            <v-card-title class="mt-5">
                                Signer's Details
                            </v-card-title>
                            <v-card-text>
                                <v-form ref="signerForm" class="mt-5">
                                    <v-text-field v-model="signerInfo.name" :rules="[
                                        (v: string | null) => (!!v && v.length > 0) || `This field is required`
                                    ]" label="Signer's name" placeholder="Enter name here" variant="outlined"
                                        density="compact" />
                                    <v-text-field v-model="signerInfo.email" label="Email(Optional)"
                                        placeholder="Enter email here" variant="outlined" density="compact" />
                                    <v-text-field v-model="signerInfo.phone" label="Phone(Optional)"
                                        placeholder="Enter phone here" variant="outlined" density="compact" />
                                </v-form>
                            </v-card-text>
                            <v-card-text>
                                <v-btn @click="validateSignerInfo()" color="primary" :disabled="!signerInfo.name?.length"
                                    :elevation="0" block rounded>
                                    Next
                                </v-btn>
                                <v-btn @click="cancel()" class="mt-2" color="secondary" :elevation="0" block rounded>
                                    Cancel
                                </v-btn>
                            </v-card-text>
                        </v-card>
                    </v-row>

                </v-card>
            </v-slide-x-transition>

            <v-slide-x-transition v-if="tab === 'signature-pad'">
                <v-card flat>
                    <v-card-title class="ma-2">
                        <v-layout justify="space-between">
                            <!-- <v-btn @click="tab = 'signer-info'" :elevation="0" class="mx-3" r-size="small">
                                                                Cancel
                                                            </v-btn> -->
                            <small><strong>
                                    {{ signerInfo.name }}</strong></small>
                            <small class="ml-1">signing</small>
                            <v-spacer />
                            <v-btn @click="signatureDialog = !signatureDialog" icon="mdi-close" size="small"
                                :elevation="0" />
                        </v-layout>
                    </v-card-title>
                    <!-- <v-card-subtitle>
                        <v-layout justify="center">
                                                            {{ signerInfo.name }}
                                                        </v-layout>
                                                    </v-card-subtitle> -->
                    <v-card-text>
                        <v-sheet color="grey-lighten-4">
                            <VueSignaturePad r-width="500px" height="500px" r-height="calc(100vh - 150px)"
                                ref="signaturePad" :options="{ onBegin, onEnd, penColor }" />
                        </v-sheet>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="cancel" color="primary">
                            <v-icon>mdi-close</v-icon>
                            Cancel
                        </v-btn>

                        <v-btn @click="signaturePad?.clearSignature()" color="primary">
                            <v-icon>mdi-cancel</v-icon>
                            Clear
                        </v-btn>

                        <v-btn @click="signaturePad?.undoSignature()" color="primary">
                            <v-icon>mdi-undo</v-icon>
                            Undo
                        </v-btn>

                        <v-btn @click="saveSignature()" color="primary">
                            <v-icon>mdi-content-save</v-icon>
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-slide-x-transition>
        </v-card>
    </v-bottom-sheet>
</template>


<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { VueSignaturePad } from 'vue-signature-pad';
import { useTheme } from 'vuetify';
import { dataUriToFile } from '@/utils/blob';
const props = defineProps({
    // task: {
    //     type: Object,
    //     required: true,
    // },
    open: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['update:open', 'save'],);

const theme = useTheme();
const isDark = computed(() => theme.current.value.dark);
const penColor = computed(() => undefined /*isDark.value ? 'white' : undefined*/);

const tab = ref('signer-info');

const signerForm = ref((null as any) as { [i: string]: any })
const signerInfo = ref({ name: null as string | null, email: null as string | null, phone: null as string | null });
async function validateSignerInfo() {
    try {

        const result = await signerForm.value?.validate() as any;
        // console.log('valid: ', valid);
        if (result.valid) {
            tab.value = 'signature-pad';
        }

    }
    catch (error) {

    }

}


const signaturePad = ref((null as any) as { [i: string]: any });

async function saveSignature() {
    try {
        const { isEmpty, data } = signaturePad.value.saveSignature('image/png');

        if (isEmpty) {
            showSignHereInstruction.value = true;
            throw new Error('Please sign here');
        }

        const src = dataUriToFile(data, 'signature');

        // const url = URL.createObjectURL(data);
        const signer = { ...signerInfo.value };
        const caption = `${signer.name} Signed`;
        const attachment = { src, caption, meta: { signer } };//clearSignature

        emit('save', attachment);

        tab.value = 'signer-info';
        signaturePad.value.clearSignature();
        signatureDialog.value = false;
        signerInfo.value = { name: null, email: null, phone: null };
    }
    catch (error) {
        console.error(error);
    }
}

function cancel() {
    tab.value = 'signer-info';
    signaturePad.value?.clearSignature();
    signerInfo.value = { name: null, email: null, phone: null };
    signatureDialog.value = false;
}

const showSignHereInstruction = ref(false);


const openInput = computed(() => props.open);
const signatureDialog = ref(false);

let mayUpdate = true;

watch(openInput, (open) => {
    mayUpdate = false;
    signatureDialog.value = open;
    setTimeout(() => mayUpdate = true, 100);
});

watch(signatureDialog, (open) => {
    if (!mayUpdate)
        return;
    emit('update:open', open);

});




function onBegin() {
    // console.log('=== Begin ===');
}


function onEnd() {
    // console.log('=== End ===');
}



</script>