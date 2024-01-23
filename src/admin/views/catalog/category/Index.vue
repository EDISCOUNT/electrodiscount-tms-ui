<template>
    <v-card height="100vh" color="secondary-bg" flat>
        <v-card-text>
            <v-card class="" flat>
                <template v-slot:title>
                    <span> Categories</span>
                </template>

                <template v-slot:append>
                   <create-category-button/>
                </template>
            </v-card>

            <v-card class="mt-4 fill-height" flat>
                <v-card-text>
                    <category-table />
                </v-card-text>
            </v-card>

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import CategoryTable from './partials/CategoryTable.vue';
import CreateCategoryButton from './partials/CreateCategoryButton.vue';

</script>