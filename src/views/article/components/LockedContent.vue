<template>
    <div class="locked-content" :class="type">
        <div class="preview-content" v-html="previewContent"></div>
        <div class="content-locker">
            <div class="locker-icon">
                <i :class="iconClass"></i>
            </div>
            <h3>{{ title }}</h3>
            <p>{{ description }}</p>
            <el-button type="primary" @click="$emit('unlock')">{{
                buttonText
            }}</el-button>
        </div>
    </div>
</template>
  
  <script>
export default {
    name: 'LockedContent',
    props: {
        type: {
            type: String,
            required: true,
            validator: (value) => ['member', 'paid'].includes(value)
        },
        content: {
            type: String,
            default: ''
        }
    },
    computed: {
        iconClass() {
            return this.type === 'member' ? 'fas fa-crown' : 'fas fa-lock'
        },
        title() {
            return this.type === 'member' ? '会员专享内容' : '付费阅读'
        },
        description() {
            return this.type === 'member'
                ? '成为会员即可阅读全文'
                : '支付 1 元即可阅读全文'
        },
        buttonText() {
            return this.type === 'member' ? '立即开通会员' : '立即购买'
        },
        previewContent() {
            // 返回内容的前300个字符，并确保HTML标签完整
            const div = document.createElement('div')
            div.innerHTML = this.content
            const text = div.textContent || div.innerText
            return text.substring(0, 300) + '...'
        }
    }
}
</script>
  
  <style lang="scss" scoped>
.locked-content {
    position: relative;

    .preview-content {
        max-height: 300px;
        overflow: hidden;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 100px;
            background: linear-gradient(transparent, #fff);
            background: linear-gradient(transparent, var(--card-bg));
            pointer-events: none;
        }
    }

    .content-locker {
        position: relative;
        margin-top: -60px;
        padding: 32px;
        text-align: center;
        background: #fff;
        background: var(--card-bg);
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 1;

        .locker-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 24px;
            background: rgba(#007aff, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            i {
                font-size: 1.8em;
                color: #007aff;
            }
        }

        h3 {
            color: #000;
            color: var(--text-primary);
            font-size: 1.4em;
            margin-bottom: 12px;
        }

        p {
            color: #666;
            color: var(--text-secondary);
            margin-bottom: 24px;
        }

        .el-button {
            padding: 12px 32px;
            font-size: 1.1em;
        }
    }

    &.member .locker-icon {
        background: rgba(#ffd700, 0.1);

        i {
            color: #ffd700;
        }
    }

    &.paid .locker-icon {
        background: rgba(#e6162d, 0.1);

        i {
            color: #e6162d;
        }
    }
}
</style>