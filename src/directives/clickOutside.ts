export default {
    mounted(el, binding) {
      // 延迟注册，避免首次点击触发
      el._clickOutsideHandler = function(event) {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event);
        }
      };
  
      el._initClickOutside = setTimeout(() => {
        document.addEventListener('click', el._clickOutsideHandler);
      }, 0);
    },
  
    unmounted(el) {
      clearTimeout(el._initClickOutside);
      document.removeEventListener('click', el._clickOutsideHandler);
    }
  };
  