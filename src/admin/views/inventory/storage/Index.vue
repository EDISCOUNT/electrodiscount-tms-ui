<template>
    <v-card height="100vh" color="secondary-bg" flat>
        <v-card-text>
            <v-card class="" flat>
                <template v-slot:title>
                    <span> Storages</span>
                </template>

                <template v-slot:append>
                   <create-storage-button/>
                </template>
            </v-card>

            <v-card class="mt-4 fill-height" flat>
                <v-card-text>
                    <storage-table />
                </v-card-text>
            </v-card>

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import StorageTable from './partials/StorageTable.vue';
import CreateStorageButton from './partials/CreateStorageButton.vue';

</script>