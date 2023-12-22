<template>
    <v-navigation-drawer color="primary" expand-on-hover rail>

        <!-- <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height"> -->

        <template v-slot:prepend>
            <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" title="Sandra Adams"
                subtitle="sandra_a88@gmailcom" nav>
                <template v-slot:append>
                </template>
            </v-list-item>
            <v-divider></v-divider>
        </template>

        <v-container class="fill-height pa-0 ma-0">
            <v-responsive class="align-center fill-height pa-0 ma-0">


                <v-list density="compact" nav>
                    <v-list-item prepend-icon="mdi-package-variant-closed" title="Shipments" :to="{ name: 'carrier:shipment:index' }"
                        value="myfiles"></v-list-item>
                    <v-list-item prepend-icon="mdi-storefront" title="Channels" :to="{ name: 'carrier:channel:index' }"
                        value="shared"></v-list-item>
                    <!-- <v-list-subheader>
                Orders
            </v-list-subheader> -->
                 
                </v-list>
            </v-responsive>
        </v-container>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>

</script>