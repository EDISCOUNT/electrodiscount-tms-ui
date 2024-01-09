<template>
    <input ref="fileInput" accept="image/*" type="file" style="display:none;" @change="(evt) => onFileInput(evt)" />
    <v-hover>
        <template v-slot="{ props, isHovering }">
            <v-card @click="() => select()" v-bind="props" color="grey-lighten-2" :image="imageSrc" width="200px"
                height="200px" flat>
                <v-row justify="center" align="center" class="fill-height">
                    <v-progress-circular v-if="uploading" indeterminate>
                    </v-progress-circular>
                    <template v-else-if="file || reference">
                        <v-btn v-if="isHovering" :elevation="0" icon>
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                    </template>
                    <v-btn v-else :elevation="0" icon>
                        <v-icon>mdi-image-plus</v-icon>
                    </v-btn>
                </v-row>
            </v-card>
        </template>
    </v-hover>
</template>

<script lang="ts" setup>
import { CarrierLogoData } from '@/model/carrier/carrier';
import { useColorScheme } from '@/utils/color';
import { onMounted, ref, watch } from 'vue';
import { useNotifier } from 'vuetify-notifier';

type LogoInput = File | CarrierLogoData;

const props = defineProps<{
    modelValue?: LogoInput;
    uploading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:model-value', value?: File): void;
}>();

const notifier = useNotifier();
const { inlineBg } = useColorScheme();

const fileInput = ref<HTMLInputElement>();
const reference = ref<string>();
const file = ref<File>();
const imageSrc = ref<string>();


watch(file, (file) => {
    if (file) {
        imageSrc.value = createFileURL(file);
    } else {
        imageSrc.value = undefined;
    }
});

watch(file, (file) => {
    emit('update:model-value', file);
});

watch(
    () => props.modelValue,
    (input) => updateInput(input),
);

onMounted(() => updateInput(props.modelValue));

function createFileURL(file: File) {
    return URL.createObjectURL(file);
};



function updateInput(logo?: LogoInput) {
    if (logo instanceof File) {
        file.value = logo;
    }
    else if (logo && typeof (logo) === 'object') {
        imageSrc.value = logo.url;
        reference.value = logo.reference;
    }
    else {
        file.value = undefined;
    }
}

function select() {
    fileInput.value!.click();
}


function onFileInput(evt: Event) {
    evt.preventDefault();
    const files = (evt.target as HTMLInputElement).files;
    // console.log('EVENT: ', evt);
    // console.log('files: ', files);

    if (!files)
        return;

    const _file = files.item(0);
    file.value = _file ?? undefined;
    (fileInput.value as any).value = '';
}
</script>