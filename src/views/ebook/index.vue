<template>
    <div class="ebook" ref="ebook">
        <ebook-header/>
        <ebook-title/>
        <ebook-reader/>
        <ebook-menu/>
        <ebook-bookmark/>
        <ebook-footer/>
    </div>
</template>

<script>
    import EbookReader from '../../components/ebook/EbookReader'
    import EbookTitle from '../../components/ebook/EbookTitle'
    import EbookMenu from '../../components/ebook/EbookMenu'
    import EbookBookmark from '../../components/ebook/EbookBookmark'
    import EbookHeader from '../../components/ebook/EbookHeader'
    import EbookFooter from '../../components/ebook/EbookFooter'

    import {getReadTime, saveReadTime} from "../../utils/localStorage";
    import {ebookMinx} from "../../utils/mixin";

    export default {
        name: 'Ebook',
        mixins: [ebookMinx],
        components: {
            EbookReader,
            EbookTitle,
            EbookMenu,
            EbookBookmark,
            EbookHeader,
            EbookFooter
        },
        watch: {
            offsetY(v) {
                if (!this.menuVisible && this.bookAvailable) {
                    if (v > 0) {
                        this.move(v);
                    } else if (v === 0) {
                        this.restore();
                    }
                }
            }
        },
        methods: {
            restore() {
                this.$refs.ebook.style.top = 0;
                this.$refs.ebook.style.transistion = 'all .2s linear';
                setTimeout(() => {
                    this.$refs.ebook.style.transition = '';
                })
            },
            move(v) {
                this.$refs.ebook.style.top = v + 'px';
            },
            startLoopReadTime() {
                let readTime = getReadTime(this.fileName);
                if (!readTime) {
                    readTime = 0;
                }
                this.task = setInterval(() => {
                    readTime++;
                    if (readTime % 30 === 0) {
                        saveReadTime(this.fileName, readTime);
                    }
                }, 1000);
            }
        },
        mounted() {
            this.startLoopReadTime();
        },
        beforeDestroy() {
            if (this.task) {
                clearInterval(this.task);
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../assets/styles/global";

    .ebook {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
