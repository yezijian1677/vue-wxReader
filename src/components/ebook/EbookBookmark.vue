<template>
    <div class="ebook-bookmark" ref="bookmark">
        <div class="ebook-bookmark-text-wrapper">
            <div class="ebook-bookmark-down-wrapper" ref="iconDown">
                <span class="icon-down"></span>
            </div>
            <div class="ebook-bookmark-text">{{text}}</div>
        </div>
        <div class="ebook-bookmark-icon-wrapper":style="isFixed ? fixedStyle : {}">
            <div class="icon"></div>
            <bookmark :color="color" :width="15" :height="35"/>
        </div>
    </div>
</template>

<script>
    import Bookmark from "../common/Bookmark";
    import { realPx } from '../../utils/utils'
    import { ebookMinx } from '../../utils/mixin'
    import { getBookmark, saveBookmark } from '../../utils/localStorage'

    const BLUE = '#346cbc';
    const WHITE = '#fff';
    export default {
        name: 'EbookBookmark',
        mixins: [ebookMinx],
        components:{
          Bookmark
        },
        computed:{
            height() {
                return realPx(35);
            },
            threshold() {
                return realPx(55);
            },
            fixedStyle() {
                return{
                    position: 'fixed',
                    top: 0,
                    right: `${(window, innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
                }
            }
        },
        watch: {
            offsetY(v){
                if (v >= this.height && v <= this.threshold) {
                    this.beforeThreshold(v);
                }else if (v >= this.threshold) {
                    this.afterThreshold(v);
                }else if (v > 0 && v < this.height) {

                }else if (v === 0) {
                    this.restore();
                }
            }
        },
        data() {
            return{
                text: '',
                color: WHITE,
                isFixed: false
            }
        },
        methods: {
            restore() {
                setTimeout(() => {
                    this.$refs.bookmark.style.top = `${-this.height}px`;
                    this.$refs.iconDown.style.transform = 'rotate(0deg)';
                }, 200);
                if (this.isFixed) {
                    this.setIsBookmark(true);
                }else {
                    this.setIsBookmark(false);
                }
            },
            beforeHeight() {
                if (this.isBookmark) {
                    this.text = this.$t('book.pulldownDeleteMark');
                    this.color = BLUE;
                    this.isFixed = true;
                } else {
                    this.text = this.$t('book.pulldownAddMark');
                    this.color = WHITE;
                    this.isFixed = false;
                }
                this.isFixed = false;
            },
            beforeThreshold(v) {
                this.$refs.bookmark.style.top = `${-v}px`;
                this.beforeHeight();
                const iconDown = this.$refs.iconDown;
                if (iconDown.style.transform === 'rotate(180deg)') {
                    iconDown.style.transform = 'rotate(0deg)';
                }
            },
            afterThreshold(v) {
                //超越临界状态
                this.$refs.bookmark.style.top = `${-v}px`;
                if (this.isBookmark) {
                    this.text = this.$t('book.releaseDeleteMark');
                    this.color = BLUE;
                    this.isFixed = false;
                } else {
                    this.text = this.$t('book.releaseAddMark');
                    this.color = BLUE;
                    this.isFixed = true;
                }
                const iconDown = this.$refs.iconDown;
                if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
                    iconDown.style.transform = 'rotate(180deg)';
                }
                this.isFixed = true;

            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../assets/styles/global";

    .ebook-bookmark {
        position: absolute;
        top: px2rem(-35);
        left: 0;
        z-index: 200;
        width: 100%;
        height: px2rem(35);
        .ebook-bookmark-text-wrapper {
            position: absolute;
            right: px2rem(45);
            bottom: 0;
            display: flex;
            .ebook-bookmark-down-wrapper {
                font-size: px2rem(14);
                color: white;
                transition: all .2s linear;
                @include center;
            }
            .ebook-bookmark-text {
                font-size: px2rem(14);
                color: white;
            }
        }
        .ebook-bookmark-icon-wrapper {
            position: absolute;
            right: 0;
            bottom: 0;
            margin-right: px2rem(10);
        }
    }
</style>

