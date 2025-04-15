<template>
    <el-card class="box-card follow-me">
      <div class="card-header">
        <span class="card-title">关注我</span>
      </div>
      <ul class="contact-list">
        <li v-show="isShow(2)">
          <ContactItem 
            type="qq"
            :value="webInfo.qqNumber"
            label="QQ号"
            :link="`//wpa.qq.com/msgrd?v=3&amp;uin=${webInfo.qqNumber}&amp;site=qq&amp;menu=yes`"
            @copy="copy"
          />
        </li>
        <!-- 其他联系项 -->
      </ul>
    </el-card>
  </template>
  
  <script setup>
  import ContactItem from './ContactItem.vue';
  
  const props = defineProps({
    webInfo: {
      type: Object,
      required: true
    }
  });
  
  const isShow = (type) => {
    return props.webInfo.showList.indexOf(type) != -1;
  };
  
  const copy = (value) => {
    // 复制逻辑
  };
  </script>
  
  <style lang="scss">
  .follow-me {
    .card-header {
      position: relative;
      margin-bottom: 20px;
  
      &::before,
      &::after {
        position: absolute;
        width: 12px;
        height: 12px;
        transform: none;
        background: #fc625d;
        border-radius: 50%;
        top: 4px;
        left: 20px;
        content: "";
      }
  
      &::after {
        left: 5px;
        background-color: #fdbc40;
      }
    }
  
    .contact-list {
      padding: 15px;
      list-style: none;
    }
  }
  </style>