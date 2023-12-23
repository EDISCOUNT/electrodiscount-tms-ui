<template>
    <v-card height="100vh" color="secondary-bg" flat>
        <v-card-text>
            <v-card class="" flat>
                <template v-slot:title>
                    <span> Products</span>
                </template>

                <template v-slot:append>
                   <create-product-button/>
                </template>
            </v-card>

            <v-card class="mt-4 fill-height" flat>
                <v-card-text>
                    <product-table />
                </v-card-text>
            </v-card>

        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import ProductTable from './partials/ProductTable.vue';
import CreateProductButton from './partials/CreateProductButton.vue';

</script>