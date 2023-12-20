<template>
    <v-navigation-drawer color="primary" expand-on-hover rail>

        <!-- <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height"> -->
        <v-list>
            <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" title="Sandra Adams"
                subtitle="sandra_a88@gmailcom"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-truck" title="Shipments" :to="{ name: 'admin:shipment:index' }"
                value="myfiles"></v-list-item>
            <v-list-item prepend-icon="mdi-home" title="Channels" :to="{ name: 'admin:channel:index' }"
                value="shared"></v-list-item>
            <!-- <v-list-subheader>
                Orders
            </v-list-subheader> -->
            <v-divider/>
            <v-list-item prepend-icon="mdi-label" title="Orders" :to="{ name: 'admin:order:index' }"
                value="orders"></v-list-item>
            <v-list-item prepend-icon="mdi-tools" title="Additional Services"
                :to="{ name: 'admin:order:additional_service:index' }" value="additional_service"></v-list-item>
        </v-list>
        <!-- </v-responsive>
</v-container> -->
    </v-navigation-drawer>
</template>

<script lang="ts" setup>

</script>