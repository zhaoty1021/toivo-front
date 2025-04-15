<template>
    <div class="hot-category">
      <el-tabs 
        :model-value="activeName" 
        class="category-tabs" 
        @update:modelValue="$emit('update:activeName', $event)"
        @tab-click="$emit('tab-click', $event)"
      >
        <el-tab-pane v-for="(item, index) in categoryList" :key="index" :name="index + ''">
          <template #label>
            <span class="custom-tabs-label">
              <span>{{ item.name }}</span>
              <el-icon style="margin-left: 5px">
                <svg-icon :name="item.icon"/>
              </el-icon>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
  <script setup>
  defineProps({
    categoryList: Array,
    activeName: String
  });
  
  defineEmits(['update:activeName', 'tab-click']);
  </script>
  
  <style lang="scss" scoped>
::v-deep(.el-tabs__nav-wrap::after) {
          background-color: unset !important;
        }

  .hot-category {
    margin-top: 20px;
  
    .category-tabs {
      ::v-deep(.el-tabs__item) {
        background-color: transparent;
        border-radius: 10px;
        padding-left: 10px;
        padding-right: 10px;
        margin-right: 5px;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        
        &:hover {
          background-color: var(--theme-color);
          color: white;
          transition: background-color 0.3s ease;
        }
  
        &.is-active {
          background-color: var(--theme-color);
          color: white;
          transition: background-color 0.3s ease;
        }
  
        &.is-top:last-child {
          padding-right: 20px;
        }
  
        &.is-top:nth-child(2) {
          padding-left: 20px;
        }
      }
  
      ::v-deep(.el-tabs__active-bar) {
        background-color: transparent;
        height: 2px;
        transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
  
      ::v-deep(.el-tabs__nav-scroll) {
        border: 2px solid var(--card-border);
        background-color: var(--card-bg);
        border-radius: 10px;
        padding: 5px;
        display: flex;
        justify-content: center;
      }
    }
  
    .custom-tabs-label {
      display: flex;
      align-items: center;
  
      .el-icon {
        font-size: 24px;
        height: 20px;
        width: 20px;
  
        .svg-icon {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
  </style>