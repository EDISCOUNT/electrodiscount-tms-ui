<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <v-col cols="9">
          <!-- {{ { startDate, endDate, month } }} -->
          <!-- {{ { month } }} -->
          <div ref="wrapper">
            <v-row v-if="split" no-gutters>
              <v-col cols="6">
                <v-date-picker v-model="startDate" v-model:month="month" v-model:year="year" :allowed-dates="allowedDates"
                  :min="minDate" :max="endDate" label="Start Date" @change="handleStartDateChange" />
              </v-col>
              <v-col cols="6">
                <v-date-picker v-model="endDate" :allowed-dates="allowedDates" :min="startDate" :max="maxDate"
                  label="End Date" @change="handleEndDateChange" />
              </v-col>
            </v-row>
            <v-date-picker v-else v-model:month="month" v-model:year="year" :model-value="selectedDate"
              @update:model-value="handleDateChange" :allowed-dates="allowedDates" :min="minDate" :max="maxDate"
              label="Select Date Range" @change="handleDateChange" show-adjacent-months multiple>
              <template v-slot:title>
                <slot name="title"></slot>
              </template>
              <template v-slot:header="{ }">
                <slot name="header"></slot>
                <!-- <template v-if="(startDate && endDate)">
            
          </template> -->
                <!-- <v-card class="px-5" flat>
          <v-card-text>
            <v-row justify="center">
              <v-col>
                <v-chip v-if="(startDate)">
                  {{ startDate.toLocaleDateString() }}
                </v-chip>
              </v-col>
              <v-col>
                <v-chip>
                  <span>-</span>
                  <span>To</span>
                  <span>-</span>
                </v-chip>
              </v-col>
              <v-col>
                <v-chip v-if="(endDate)">
                  {{ endDate.toLocaleDateString() }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card> -->
              </template>
              <!-- <template v-slot:title>
          Title
        </template> -->

            </v-date-picker>
          </div>
        </v-col>
        <v-divider vertical />
        <v-col cols="3">
          <v-card flat>
            <v-card-text :style="`max-height:450px; overflow-y:auto;`" class="pl-0">
              <v-slide-group v-model="week" direction="vertical">
                <v-slide-group-item v-for="item in 51" :key="item" v-slot="{ isSelected, toggle, selectedClass }">
                  <v-card :variant="isSelected ? undefined : 'outlined'"
                    :color="isSelected ? 'primary' : 'grey-lighten-1'" :class="['my-2 pa-1', selectedClass]"
                    r-height="200" r-width="100" @click="() => toggle()" flat>
                    {{ `week ${item}` }}
                  </v-card>
                </v-slide-group-item>
              </v-slide-group>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import { formatDate, formatMinDate } from '@/utils/format';
import { formatDateNamed } from '@/utils/format/date';
import { ref, onMounted, watch } from 'vue';
import { getMinDate, getMaxDate, dateArrayDifference, getFurthestDate } from './utils';
import { DateRangeInput } from './types';
import { endOfDay, startOfDay } from 'date-fns';
import { endOfWeek, startOfWeek, getMonth, startOfYear, addWeeks } from 'date-fns';
import { debounce } from 'lodash';
import * as _ from 'date-fns';

// _.getMonth


const props = defineProps<{
  modelValue?: DateRangeInput;
  minDate?: Date;
  maxDate?: Date;
  split?: boolean;
}>();



const emit = defineEmits<{
  (e: 'update:model-value', value?: DateRangeInput): void;
  (e: 'update:start', value?: Date): void;
  (e: 'update:end', value?: Date): void;
}>();




const startDate = ref<Date | null>(props.modelValue?.start ?? null);
const endDate = ref<Date | null>(props.modelValue?.end ?? null);
const month = ref<number>();
const week = ref<number>();
const year = ref<string>();
const wrapper = ref<HTMLDivElement | null>(null);



watch(
  week,
  (week) => {
    // console.log("WEEK: ", {week})
    if (typeof (week) == 'number') {
      // isUpdatingInput = true;
      const weekRange = getStartAndEndOfWeek(week + 1);
      const _month = getMonth(weekRange.start) + 1;
      month.value = _month;
      startDate.value = weekRange.start;
      endDate.value = weekRange.end;
      // setTimeout(() => isUpdatingInput = false);
    }
  }
);


let isUpdatingInput = false;

watch(
  () => props.modelValue,
  (value) => updateDateRange(value),
  { deep: true }
);

watch(
  () => [startDate.value, endDate.value],
  ([start, end]) => {
    if (start) {
      start = startOfDay(start);
    }
    if (end) {
      end = endOfDay(end);
    }
    if (isUpdatingInput) {
      return;
    }
    let output: DateRangeInput | undefined;
    if (!(start || end)) {
      output = undefined;
    } else {
      output = { start: start as Date, end: end as Date };
    }

    emit('update:model-value', output);
  }
)

onMounted(() => updateDateRange(props.modelValue));



function updateDateRange(value?: DateRangeInput) {

  // console.log("UPDATE DATE RANGE: ", { value, valueJSON: JSON.stringify(value), startDate: startDate.value, endDate: endDate.value })
  if (isUpdatingInput) {
    // console.log("RETURNING");
    return;
  }
  // console.log("CONTINUED");
  isUpdatingInput = true;
  if (value) {
    const newDates = [value.start, value.end].filter((date) => date) as Date[];
    const minDate = getMinDate(newDates);
    const maxDate = getMaxDate(newDates);
    // 
    startDate.value = minDate;
    endDate.value = maxDate;
    updateCellColors(startDate.value, endDate.value);
    // console.log("UPDATE DATE RANGE COLOR: ", { startDate: startDate.value, endDate: endDate.value })
  } else {
    selectedDate.value = [];
    startDate.value = null;
    endDate.value = null;
    updateCellColors();
  }

  setTimeout(() => {
    isUpdatingInput = false;
  }, 10);
}



const selectedDate = ref<Date[]>();
const isStartDate = ref(true);

function handleDateChange(newDates: Date[]) {

  // console.log("SELECTED: ", { newDates, selectedDate: selectedDate.value })

  if ((newDates?.length ?? 0) > 2) {
    // selectedDate.value = dates.slice(0, 1);
    // startDate.value = minDate;
    const diff = dateArrayDifference(newDates, selectedDate.value ?? [],);
    // console.log("DIFF: ", { diff });
    // endDate.value = maxDate;
    if (diff.length > 0) {
      const date = diff.find(() => true)!;
      const otherDate = getFurthestDate(date, newDates);
      const _newDates = [date];
      if (otherDate) {
        _newDates.push(otherDate);
      }

      const minDate = getMinDate(_newDates);
      const maxDate = getMaxDate(_newDates);


      if (minDate?.toLocaleDateString() === maxDate?.toLocaleDateString()) {
        startDate.value = minDate;
        endDate.value = null;
        selectedDate.value = [minDate!];
        updateCellColors(startDate.value, endDate.value);
        return;
      }

      startDate.value = minDate;
      endDate.value = maxDate;
      const dates = [minDate, maxDate].filter((date) => date != null) as Date[];
      selectedDate.value = dates;
      updateCellColors(startDate.value, endDate.value);
      return;
    }
  }


  const minDate = getMinDate(newDates);
  const maxDate = getMaxDate(newDates);
  const dates = [minDate, maxDate].filter((date) => date != null) as Date[];


  if (minDate?.toLocaleDateString() === maxDate?.toLocaleDateString()) {
    startDate.value = minDate;
    endDate.value = null;
    selectedDate.value = [minDate!];
    updateCellColors(startDate.value, endDate.value);
    return;
  }

  startDate.value = minDate;
  endDate.value = maxDate;
  selectedDate.value = dates;
  updateCellColors(startDate.value, endDate.value);

  // useEffect(() => {
  //   if (minDate) {
  //     startDate.value = minDate;
  //   }
  //   if (maxDate) {
  //     endDate.value = maxDate;
  //   }
  // }, [minDate, maxDate]);
  // console.log("SELECTED: ", { newDate, selectedDate: selectedDate.value})
  // if (isStartDate.value) {
  //   emit('range-change', [newDate, endDate.value]);
  //   isStartDate.value = false;
  // } else {
  //   emit('range-change', [startDate.value, newDate]);
  // }
};

const allowedDates = (val: Date | null): boolean => {
  if (!val)
    return false;
  const allowed = val && val.getTime() >= (props.minDate?.getTime() ?? 0) && val.getTime() <= (props.maxDate?.getTime() ?? Number.MAX_SAFE_INTEGER);
  // console.log("ALLOWED: ", { val, ...props, allowed });
  return allowed;
};

const handleStartDateChange = (newDate: Date | null) => {
  endDate.value = newDate ? new Date(Math.max(newDate.getTime(), endDate.value?.getTime() ?? 0)) : null;
  // emit('range-change', [newDate, endDate.value]);
};

const handleEndDateChange = (newDate: Date | null) => {
  startDate.value = newDate ? new Date(Math.min(newDate.getTime(), startDate.value?.getTime() ?? 0)) : null;
  // emit('range-change', [startDate.value, newDate]);
};


watch(
  () => [
    month.value, year.value,
  ],
  ([month]) => setTimeout(() => updateCellColors(startDate.value, endDate.value, month), 10)
);

watch(
  () => [
    startDate.value, endDate.value,
  ],
  ([startDate, endDate]) => setTimeout(() => updateCellColors(startDate, endDate), 10)
);




const doUpdateCellColors = (startDate?: Date | null, endDate?: Date | null, month?: any) => {
  // console.log("UPDATE CELL COLORS: ", { startDate, endDate, month });
  // console.log(new Error());
  const selectedDates = [startDate, endDate].filter((date) => date);
  const tables = wrapper.value?.querySelectorAll('.v-picker__body') ?? [];

  for (const table of ([...Array.from(tables)])) {
    if (table) {
      table.querySelectorAll<HTMLDivElement>('.v-date-picker-month__day').forEach((cell) => {

        const dateStr = cell.dataset.vDate as string;

        if (!dateStr) {
          return;
        }

        const date = new Date(dateStr);
        let isWithinRange: boolean;
        if (!(startDate && endDate)) {
          isWithinRange = false;
        } else {
          isWithinRange = date.getTime() >= (startDate?.getTime() ?? 0) && date.getTime() <= (endDate?.getTime() ?? Number.MAX_SAFE_INTEGER);
        }

        cell.style.backgroundColor = isWithinRange ? 'grey' : '';
        // if (isWithinRange) {
        //   cell.classList.add('bg-primary');
        // } else {
        //   cell.classList.remove('bg-primary');
        // }
      });
    }
  }
};

const updateCellColors = debounce(doUpdateCellColors, 100);

// export default defineComponent({
//   name: 'DateRangeSelector',
//   props: {
//     minDate: {
//       type: Date,
//       // default: new Date(0),
//       //   required: true,
//     },
//     maxDate: {
//       type: Date,
//       required: false,
//       // default: new Date(Number.MAX_SAFE_INTEGER),
//     },
//   },
//   setup(props, { emit }) {

//   },
// });




function getStartAndEndOfWeek(weekNumber: number, year?: number) {
  year = year || new Date().getFullYear();
  const startDateOfYear = startOfYear(new Date(year, 0, 1));
  const start = startOfWeek(addWeeks(startDateOfYear, weekNumber - 1), { weekStartsOn: 1 }); // week starts on Monday
  const end = endOfWeek(addWeeks(startDateOfYear, weekNumber - 1), { weekStartsOn: 1 }); // week starts on Monday

  return { start, end };
}
</script>
