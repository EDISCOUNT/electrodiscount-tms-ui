<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <slot name="activator" v-bind="{ props, to: { name: 'carrier:shipment:index' } }">
                <v-btn v-bind="props" color="primary" :elevation="0">
                    New <v-divider vertical />
                    <v-icon>mdi-menu-down</v-icon>
                </v-btn>
            </slot>
        </template>
        <v-card flat>
            <v-card-text>
                <v-card-actions>
                    <v-btn :to="{ name: 'carrier:shipment:create' }" color="primary" variant="flat" :elevation="0" block>
                        Create Shipment Manualy
                    </v-btn>
                </v-card-actions>
            </v-card-text>
        </v-card>
    </v-menu>
</template>

<script lang="ts" setup>
</script>