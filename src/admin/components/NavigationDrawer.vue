<template>
    <v-navigation-drawer color="primary" :expand-on-hover="!sm" :rail="!xs">

        <!-- <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height"> -->

        <template v-slot:prepend>
            <v-list-item v-if="user" prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" :title="user.fullName"
                :subtitle="user.username" nav>
                <template v-slot:append>
                </template>
            </v-list-item>
            <v-divider></v-divider>
        </template>

        <v-container class="fill-height pa-0 ma-0">
            <v-responsive class="align-center fill-height pa-0 ma-0">


                <v-list density="compact" nav>

                    <!-- <v-list-item prepend-icon="mdi-package-variant-closed" title="Shipments"
                        :to="{ name: 'admin:shipment:index' }" value="myfiles"></v-list-item> -->

                    <!-- <v-list-group>
                        <template v-slot:activator="{ props, }">
                            <v-list-item v-bind="props" prepend-icon="mdi-package-variant-closed"
                                title="Shipments"></v-list-item>
                        </template>

                        <create-shipment-button>
                            <template v-slot:activator="{ props }">
                                <v-list-item v-bind="props" prepend-icon="mdi-truck" title="Create Shipment">
                                    <template v-slot:append>
                                        <v-icon>mdi-menu-down</v-icon>
                                    </template>
                                </v-list-item>
                            </template>
                        </create-shipment-button>
                        <v-list-item prepend-icon="mdi-package-variant-closed" title="Shipments"
                            :to="{ name: 'admin:shipment:index' }" value="myfiles"></v-list-item>
                    </v-list-group> -->

                    <create-shipment-button>
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" prepend-icon="mdi-truck" title="Create Shipment">
                                <!-- <template v-slot:append>
                                    <v-icon>mdi-menu-down</v-icon>
                                </template> -->
                            </v-list-item>
                        </template>
                    </create-shipment-button>
                    <v-list-item prepend-icon="mdi-package-variant-closed" title="Shipments"
                        :to="{ name: 'admin:shipment:index' }" value="myfiles"></v-list-item>

                    <v-list-item prepend-icon="mdi-storefront" title="Channels" :to="{ name: 'admin:channel:index' }"
                        value="shared"></v-list-item>
                    <!-- <v-list-subheader>
                Orders
            </v-list-subheader> -->
                    <v-divider />
                    <v-list-item prepend-icon="mdi-shopping" title="Orders" :to="{ name: 'admin:order:index' }"
                        value="orders"></v-list-item>
                    <v-list-item prepend-icon="mdi-tools" title="Additional Services"
                        :to="{ name: 'admin:order:additional_service:index' }" value="additional_service"></v-list-item>
                    <!--  -->
                    <v-list-item prepend-icon="mdi-truck-delivery" title="Carriers" :to="{ name: 'admin:carrier:index' }"
                        value="carrier"></v-list-item>
                    <!--  -->
                    <v-list-item prepend-icon="mdi-cart" title="Products" :to="{ name: 'admin:catalog:product:index' }"
                        value="products"></v-list-item>
                    <v-divider />
                    <v-list-item prepend-icon="mdi-account" title="Users" :to="{ name: 'admin:account:user:index' }"
                        value="users"></v-list-item>
                </v-list>
            </v-responsive>
        </v-container>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useUser } from '@/store/app';
import { useDisplay } from 'vuetify';
import CreateShipmentButton from '../views/shipment/shipment/partials/CreateShipmentButton.vue';


const { user, loading, error } = useUser();
const { xs, sm } = useDisplay();

</script>