<template>
  <pv-drop-down class="w-full text-center px-4 text-1xl mt-7" v-model="selectedItem" :options="options" @change="handleClick">
    <template #option="slotProps">
      <div class="p-dropdown-car-option text-center  text-1xl">
        <span>{{ slotProps.option}}</span>
      </div>
    </template>
  </pv-drop-down>
</template>

<script>
export default {
  name: "customer-shipments-filter",
  data() {
    return {
      options: ['All', 'Pending', 'Finished', 'In progress'],
      selectedItem: null
    }
  },
  mounted() {
    this.selectedItem = this.options[0];
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
}
</script>
