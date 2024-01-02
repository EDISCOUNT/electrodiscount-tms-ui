<template>
    <v-card height="100vh" color="secondary-bg" flat>
        <v-card-text>
            <v-card class="" flat>
                <template v-slot:title>
                    <span> Templates</span>
                </template>

                <template v-slot:append>
                   <create-template-button/>
                </template>
            </v-card>

            <v-card class="mt-4 fill-height" flat>
                <v-card-text>
                    <template-table />
                </v-card-text>
            </v-card>

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import TemplateTable from './partials/TemplateTable.vue';
import CreateTemplateButton from './partials/CreateTemplateButton.vue';

</script>