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

      <v-overlay :value="isSaving">
        <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
      </v-overlay>
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
                    <strong class="">#{{ shipment.code }}</strong>
                    <span class="mx-2"></span>
                    <v-chip v-if="shipment.status" :color="getStatusColor(shipment.status)">
                      {{ shipment.status }}
                    </v-chip>
                  </span>
                </template>
                <template v-slot:append>

                  <PrintShipmentManifestButton :shipments="[(shipment.id as any)!]" />
                  <EmailDrawer :shipment="shipment" />
                  <span class="mx-1" />
                  <SmsDrawer :shipment="shipment" />

                  <v-btn :to="{ name: 'admin:shipment:edit', params: { id: shipment.id } }" color="primary" :elevation="0"
                    class="mx-2" variant="plain">
                    Edit
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
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
            <v-card min-height="300px" flat>
              <template v-slot:prepend>
                <v-icon>mdi-book</v-icon>
              </template>
              <template v-slot:title>
                Fulfilment
              </template>
              <v-divider />
              <!-- <v-card-titlte>
               
              </v-card-titlte> -->
              <v-card-text class="pb-0">
                <ShipmentTimeRangeInput :shipment="shipment"
                  @update:shipment="(shipment) => onUpdateShipment(shipment)" />
              </v-card-text>
              <v-divider/>
              <v-card-text>
                <ShipmentFulfilmentCard :shipment="shipment" :fulfilment="shipment?.fulfilment" />
              </v-card-text>
            </v-card>
            <v-card class="fill-height" color="transparent" flat>
              <v-card class="mt-4" min-height="300px" flat>
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
                <ShipmentActionCard :shipment="shipment" @updated="(shipment) => onUpdateShipment(shipment)"
                  :apply-transition="applyTransition" />
              </v-card-text>
            </v-card>

          </v-col>

          <v-col :cols="12" :md="4">
            <v-card class="mt-0 fill-height" flat>
              <template v-slot:prepend>
                <v-icon>mdi-tools</v-icon>
              </template>
              <template v-slot:title>
                Addtional Services
              </template>
              <v-divider />
              <v-card-text>
                <v-list>
                  <div v-for="(service, i) in shipment.additionalServices" :key="service.id">
                    <v-list-item lines="one">
                      <template v-slot:append>
                        <v-avatar color="green">
                          <v-icon size="x-large">mdi-check</v-icon>
                        </v-avatar>
                      </template>
                      <template v-slot:title>
                        {{ service.title }}
                      </template>
                      <template v-slot:subtitle>
                        {{ service.shortDescription ?? service.code }}
                      </template>
                    </v-list-item>
                    <v-divider v-if="(i + 1) != shipment.additionalServices?.length" class="my-2" />
                  </div>
                </v-list>
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
            <v-card class="fill-height" flat>
              <template v-slot:prepend>
                <v-icon>mdi-map</v-icon>
              </template>
              <template v-slot:title>
                Shipment Map
              </template>
              <v-divider />
              <v-card-text class="pa-2">
                <ShipmentMapView :shipment="shipment" height="480px" />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col :cols="12" :md="6">
            <v-card class="fill-height" flat>
              <template v-slot:prepend>
                <v-icon>mdi-tools</v-icon>
              </template>
              <template v-slot:title>
                Shipment Setiings
              </template>
              <v-divider />
              <v-card-text>
                <CarrierInput :model-value="shipment.carrier?.id"
                  @update:model-value="(carrier) => save({ carrier: carrier as any })" r-:disabled="true"
                  label="Carrier" />
                <!-- {{  }} -->
                <ChannelInput :model-value="shipment.channel?.id"
                  @update:model-value="(channel) => save({ channel: channel as any })" r-:disabled="true"
                  label="Channel" />

                <StorageInput :model-value="shipment.storage?.id"
                  @update:model-value="(storage) => save({ storage: storage as any })" r-:disabled="true"
                  label="Storage/Warehouse" />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col :cols="12" :md="6">
            <v-card class="fill-height" flat>
              <template v-slot:prepend>
                <v-icon>mdi-history</v-icon>
              </template>
              <template v-slot:title>
                Shipment Events
              </template>
              <v-divider />
              <v-card-text>

                <ShipmentEventTimeline ref="eventTimeline" :get-paginated-shipment-events="getPaginatedShipmentEvents" :shipment="shipment" />
              </v-card-text>
            </v-card>
          </v-col>

        </v-row>

        <v-btn color="primary" position="fixed" bottom="24px" right="24px" size="large" style="z-index: 5;" icon>
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
import { applyTransition, getShipment, updateShipment, } from '@/admin/repository/shipment/shipment_repository';
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
import EmailDrawer from '@/views/mailing/email/EmailDrawer.vue';
import SmsDrawer from '@/views/texting/sms/SmsDrawer.vue';
import { getPaginatedShipmentEvents } from '@/admin/repository/shipment/shipment_event_repository';
import ShipmentMapView from '@/views/shipment/ShipmentMapView.vue';
import CarrierInput from './partials/CarrierInput.vue';
import ChannelInput from './partials/ChannelInput.vue';
import StorageInput from './partials/StorageInput.vue';
import ShipmentTimeRangeInput from '@/views/shipment/ShipmentTimeRangeInput.vue';
// import ShipmentTimeRangeInput from './partials/ShipmentTimeRangeInput.vue';

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


// const isSaving = ref(false);

// async function updateShipmentData({  ...data }: ShipmentFormData) {
//   try{
//   const result = await  save(data);
//   }catch(err){
//     const message = (err as any).message as string;
//     error.value = message;
//   }
//   finally{
//     isSaving.value = false;

//   }
// }


const eventTimeline = ref<typeof ShipmentEventTimeline>();


function onUpdateShipment(rshipment: Shipment) {
  if (rshipment) {
    shipment.value = rshipment;
    eventTimeline.value!.refresh();
  }
}

async function save(data: ShipmentFormData) {
  try {
    error.value = null;
    isSaving.value = true;
    const result = await updateShipment(props.id, data);
    notifier.toastSuccess('Shipment updated successfully');
    // router.back();
    onUpdateShipment(result);

  }
  catch (err) {
    const message = (err as any).message as string;
    error.value = message;
    notifier.toastError(message);
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