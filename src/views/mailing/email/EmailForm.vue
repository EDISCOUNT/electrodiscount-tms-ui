<style>
.ck-editor__editable {
    /* min-height: 400px;
    max-height: 450px; */
    height: 400px;
}
</style>
<template>
    <v-card flat>
        <CKEditorComponent :editor="ClassicEditor" v-model="data"/>
    </v-card>
</template>
<script lang="ts" setup>
import { Plugin } from '@ckeditor/ckeditor5-core';
// import { Base64UploadAdapter, SimpleUploadAdapter  } from '@ckeditor/ckeditor5-upload';
// import * as H from '@ckeditor/ckeditor5-upload';

// import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ref, watch, onMounted } from 'vue';
const CKEditorComponent = CKEditor.component;

const props = defineProps<{
    modelValue?: string;
}>();

const emit = defineEmits<{
    (e: 'update:model-value', value?: string): void;
}>();



const data = ref<string>();

watch(() => props.modelValue, (value) => data.value = value);
watch(data, (value) => emit('update:model-value', value));

onMounted(() => data.value = props.modelValue);





// class Base64UploadAdapter extends Plugin {
//     constructor( loader ) {
//         // The file loader instance to use during the upload.
//         this.loader = loader;
//     }

//     // Starts the upload process.
//     upload() {
//         return this.loader.file
//             .then( file => new Promise( ( resolve, reject ) => {
//                 const reader = new FileReader();

//                 reader.onload = () => {
//                     resolve( { default: reader.result } );
//                 };

//                 reader.onerror = reject;

//                 reader.readAsDataURL( file );
//             } ) );
//     }

//     // Aborts the upload process.
//     abort() {
//         // The Base64UploadAdapter does not support aborting uploads. 
//     }
// }

</script>