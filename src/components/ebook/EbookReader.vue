<template>
    <div class="ebook-reader">
        <div id="read">

        </div>
    </div>
</template>

<script>
    import Epub from 'epubjs'
    import {ebookMinx} from "../../utils/mixin";

    global.ePub = Epub;

    export default {
        mixins: [ebookMinx],
        name: "EbookReader",
        methods: {
            prevPage() {
                if (this.rendition) {
                    this.rendition.prev();
                    this.hideTitleAndMenu();
                }
            },
            nextPage() {
                if (this.rendition) {
                    this.rendition.next();
                    this.hideTitleAndMenu();
                }
            },
            toggleTitleAndMenu() {
                this.setMenuVisible(!this.menuVisible);
            },
            hideTitleAndMenu() {
                this.setMenuVisible(false);
            },
            initEpub() {
                const url = 'http://localhost:8081/epub/' + this.fileName + '.epub';
                this.book = new Epub(url);
                this.rendition = this.book.renderTo('read', {
                    width: innerWidth,
                    height: innerHeight,
                    method: 'default'
                });

                //展示
                this.rendition.display();

                //触摸操作
                this.rendition.on('touchstart', event => {
                    this.touchStartX = event.changedTouches[0].clientX;
                    // console.log(this.touchStartX)
                    this.touchStartTime = event.timeStamp;
                });

                this.rendition.on('touchend', event => {
                    const offsetX = event.changedTouches[0].clientX - this.touchStartX;
                    const time = event.timeStamp - this.touchStartTime;

                    if (time < 500 && offsetX > 40) {
                        this.prevPage();
                    } else if (time < 500 && offsetX < -40) {
                        this.nextPage();
                    } else {
                        this.toggleTitleAndMenu();
                        event.preventDefault();
                        event.stopPropagation();
                    }

                })

            }
        },
        mounted() {
            const fileName = this.$route.params.fileName.split('|').join('/');
            console.log(fileName);
            this.setFileName(fileName).then(() => {
                this.initEpub()
            });


        },
    }
</script>


<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../assets/styles/global";

    .ebook-reader {
        width: 100%;
        height: 100%;
        overflow: hidden;
        .ebook-reader-mask {
            position: absolute;
            top: 0;
            left: 0;
            background: transparent;
            z-index: 150;
            width: 100%;
            height: 100%;
        }
    }
</style>
