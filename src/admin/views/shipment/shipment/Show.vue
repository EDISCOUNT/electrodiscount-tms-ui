<template>
  <v-card :color="secondaryBg" height="100vh" style="overflow: auto;" flat>

    <!-- {{ { shipment } }} -->
    <v-row justify="center" align="center" v-if="isLoading" class="fill-height">
      <v-card width="400px" flat>
        <v-card-subtitle>
          Please wait...
        </v-card-subtitle>
        <v-card-text>
          <v-progress-linear indeterminate />
        </v-card-text>
      </v-card>
    </v-row>

    <v-card color="transparent" flat v-else-if="shipment">
      <v-card-text v-if="error">
        <v-alert type="error">
          {{ error }}
        </v-alert>
      </v-card-text>
      <v-card-text class="pa-0 pa-sm-5">
        <v-row>
          <v-col :cols="12" :md="12">
            <v-card flat>
              <v-toolbar color="transparent" flat>
                <template v-slot:title>
                  <span>
                    <!-- <span>Order:</span> -->
                    <strong class="text-black">#{{ shipment.code }}</strong>
                    <span class="mx-2"></span>
                    <v-chip :color="getStatusColor(shipment.status)">
                      {{ shipment.status }}
                    </v-chip>
                  </span>
                </template>
                <template v-slot:append>
                  <PrintShipmentManifestButton :shipments="[(shipment.id as any)!]" />
                  <ShipmentEmailDrawer :shipment="shipment"/>
                </template>
                <!-- <template v-slot:extension>
                  <v-btn icon @click="router.back()">
                    <v-icon>mdi-arrow-left</v-icon>
                  </v-btn>
                </template> -->
              </v-toolbar>
            </v-card>
          </v-col>
          <v-col :cols="12" :md="12">
            <v-card flat>
              <ShipmentStatusStepBar :shipment="shipment" />
            </v-card>
          </v-col>

          <v-col :cols="12" :md="8">
            <v-card flat>
              <template v-slot:prepend>
                <v-icon>mdi-book</v-icon>
              </template>
              <template v-slot:title>
                Fulfilment
              </template>
              <v-divider />
              <v-card-text>
                <ShipmentFulfilmentCard :fulfilment="shipment?.fulfilment" />
              </v-card-text>
            </v-card>
            <v-card class="mt-4" flat>
              <template v-slot:prepend>
                <v-icon>mdi-package</v-icon>
              </template>
              <template v-slot:title>
                Basic Information
              </template>
              <v-divider />
              <v-card-text>
                <ShipmentBasicInformationCard :shipment="shipment" />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col :cols="12" :md="4">
            <v-card class="fill-height" flat>
              <template v-slot:prepend>
                <v-icon>mdi-open</v-icon>
              </template>
              <template v-slot:title>
                Shipment Status
              </template>
              <v-divider />
              <v-card-text>
                <ShipmentActionCard :shipment="shipment" @updated="(shipment) => onUpdateShipment(shipment)" />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col :cols="12" :md="4">
            <v-card class="fill-height" flat>
              <template v-slot:prepend>
                <v-icon>mdi-map-marker</v-icon>
              </template>
              <template v-slot:title>
                Stops
              </template>
              <v-divider />
              <v-card-text>
                <ShipmentStops :shipment="shipment" />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col :cols="12" :md="8">
            <v-card flat>
              <template v-slot:prepend>
                <v-icon>mdi-map</v-icon>
              </template>
              <template v-slot:title>
                Shipment Map
              </template>
              <v-divider />
              <v-card-text class="pa-2">
                <v-card height="300px" :color="inlineBg" flat />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col :cols="12" :md="8">
            <v-card class="fill-height" flat>
              <template v-slot:prepend>
                <v-icon>mdi-package</v-icon>
              </template>
              <template v-slot:title>
                Shipment Lines
              </template>
              <v-divider />
              <v-card-text>
                <ShipmentItemList :shipment="shipment" />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col :cols="12" :md="4">
            <v-card class="fill-height" flat>
              <template v-slot:prepend>
                <v-icon>mdi-history</v-icon>
              </template>
              <template v-slot:title>
                Shipment Events
              </template>
              <v-divider />
              <v-card-text>
                <ShipmentEventTimeline :shipment="shipment" />
              </v-card-text>
            </v-card>
          </v-col>

        </v-row>

        <v-btn color="primary" position="fixed" bottom="24px" right="24px" size="large" style="z-index: 5;" icon >
          <v-icon>mdi-email</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>

    <v-row justify="center" align="center" class="fill-height" v-else>
      <v-card flat>
        <v-card-title>
          Seems and error occurred
        </v-card-title>
        <v-card-subtitle v-if="error">
          {{ error }}
        </v-card-subtitle>
      </v-card>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import ShipmentForm from './ShipmentForm.vue';
import { onMounted, ref } from 'vue';
import { getShipment, updateShipment, } from '@/admin/repository/shipment/shipment_repository';
import Shipment, { ShipmentFormData } from '@/model/shipment/shipment';
import { useRouter } from 'vue-router';
import { useNotifier } from 'vuetify-notifier';
import { getStatusColor, useColorScheme } from '@/utils/color';
import ShipmentFulfilmentCard from '@/views/shipment/ShipmentFulfilmentCard.vue';
import ShipmentStatusStepBar from '@/views/shipment/ShipmentStatusStepBar.vue';
import ShipmentActionCard from '@/views/shipment/ShipmentActionCard.vue';
import ShipmentBasicInformationCard from '@/views/shipment/ShipmentBasicInformationCard.vue';
import ShipmentItemList from '@/views/shipment/ShipmentItemList.vue';
import ShipmentEventTimeline from '@/views/shipment/ShipmentEventTimeline.vue';
import ShipmentStops from '@/views/shipment/ShipmentStops.vue';
import PrintShipmentManifestButton from './partials/PrintShipmentManifestButton.vue';
import ShipmentEmailDrawer from './email/ShipmentEmailDrawer.vue';

const props = defineProps<{
  id: string,
}>()

const shipment = ref<Shipment | null>(null);
const error = ref<string | null>(null);
const isSaving = ref(false);
const isLoading = ref(false);

const router = useRouter();
const notifier = useNotifier();
const { secondaryBg, inlineBg } = useColorScheme();



onMounted(async () => {
  await loadShipment();
});



function onUpdateShipment(rshipment: Shipment) {
  if (rshipment) {
    shipment.value = rshipment;
  }
}

async function save(data: ShipmentFormData) {
  try {
    error.value = null;
    isSaving.value = true;
    const result = await updateShipment(props.id, data);
    notifier.toastSuccess('Shipment updated successfully');
    router.back();

  }
  catch (err) {
    const message = (err as any).message as string;
    error.value = message;
  }
  finally {
    isSaving.value = false;
  }
}


async function loadShipment() {
  try {
    isLoading.value = true;
    error.value = null;
    const result = await getShipment(props.id);
    shipment.value = result;
  }
  catch (err) {
    const message = (err as any).message as string;
    error.value = message;
  }
  finally {
    isLoading.value = false;
  }
}


</script>