<template>
    <v-btn @click="() => toggle()" :elevation="0" icon>
        <v-icon>mdi-barcode-scan</v-icon>
    </v-btn>


    <Teleport v-if="xs" to="body">
        <v-bottom-sheet v-model="isOpen" style="display: none;" >
        </v-bottom-sheet>
        <v-navigation-drawer v-model="isOpen" location="bottom" :width="344" inset>
            <v-card r-min-height="300px" flat>
                <template v-slot:title>
                    <v-row justify="center" align="center" class="py-3">
                        <v-card color="grey" height="15px" width="50px" class="my-1" style="border-radius: 20px;" flat />
                    </v-row>
                </template>
                <v-card-text class="pa-0">
                    <StreamBarcodeReader v-if="isOpen" @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader>
                </v-card-text>
            </v-card>
        </v-navigation-drawer>
    </Teleport>

    <v-dialog v-else v-model="isOpen" width="400px">
        <v-card min-height="250px" flat>
            <v-card-text class="pa-1">
                <StreamBarcodeReader v-if="isOpen" @decode="onDecode" @loaded="onLoaded" @result="() => null">
                </StreamBarcodeReader>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script lang="ts" setup>
import { StreamBarcodeReader } from "vue-barcode-reader";
import { ref, watch } from 'vue';
import { useDisplay } from "vuetify";



const props = defineProps<{
    autoclose?: boolean;
    open?: boolean;
}>();


const { xs } = useDisplay();

const emit = defineEmits<{
    (e: 'decode', value: string): void;
    (e:'update:result', value: string): void;
    (e:'update:open', value: boolean): void;
}>();

const isOpen = ref(false);
function toggle() {
    isOpen.value = !isOpen.value;
}



watch(
    () => props.open,
    (open) => isOpen.value = open?? false,
);
watch(isOpen, (open) => emit('update:open', open));

function onLoaded(result: any) {
    // console.log('onLoaded: ', { result })
}


function onDecode(result: string) {
    // console.log('ONDECODE: ', { result })
    emit('decode', result);
    emit('update:result', result);
    if(props.autoclose){
        isOpen.value = false;
    }
}

</script>