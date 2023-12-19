<template>
    <v-card height="100vh" color="secondary-bg" flat>
        <v-card-text>
            <v-card class="" flat>
                <template v-slot:title>
                    <span> Additional Services Index</span>
                </template>

                <template v-slot:append>
                   <create-additional-service-button/>
                </template>
            </v-card>

            <v-card class="mt-4 fill-height" flat>
                <v-card-text>
                    <additional-service-table />
                </v-card-text>
            </v-card>

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import AdditionalServiceTable from './partials/AdditionalServiceTable.vue';
import CreateAdditionalServiceButton from './partials/CreateAdditionalServiceButton.vue';

</script>