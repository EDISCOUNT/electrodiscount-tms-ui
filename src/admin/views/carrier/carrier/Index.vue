<template>
    <v-card height="100vh" color="secondary-bg" flat>
        <v-card-text>
            <v-card class="" flat>
                <template v-slot:title>
                    <span> Carriers</span>
                </template>

                <template v-slot:append>
                   <create-carrier-button/>
                </template>
            </v-card>

            <v-card class="mt-4 fill-height" flat>
                <v-card-text>
                    <carrier-table />
                </v-card-text>
            </v-card>

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import CarrierTable from './partials/CarrierTable.vue';
import CreateCarrierButton from './partials/CreateCarrierButton.vue';

</script>