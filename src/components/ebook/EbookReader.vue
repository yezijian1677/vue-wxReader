<template>
    <div class="ebook-reader">
        <div id="read">

        </div>
    </div>
</template>

<script>
    import Epub from 'epubjs'
    import {ebookMinx} from "../../utils/mixin";
    import {
        getFontFamily,
        getFontSize,
        getTheme,
        saveFontSize,
        saveTheme,
        setFontFamily
    } from "../../utils/localStorage";

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
                if (this.menuVisible) {
                    this.setSettingVisible(-1);
                    this.setFontFamilyVisible(false);
                }
                this.setMenuVisible(!this.menuVisible);
            },
            hideTitleAndMenu() {
                this.setMenuVisible(false);
                this.setSettingVisible(-1);
                this.setFontFamilyVisible(false);
            },
            initTheme(){
                //判断是否有默认主题
                let defaultTheme = getTheme(this.fileName);
                //如果没有则保存现在的主题为默认
                if (!defaultTheme) {
                    defaultTheme = this.themeList[0].name;
                    this.setDefaultTheme(defaultTheme);
                    saveTheme(this.fileName, defaultTheme);
                }
                this.themeList.forEach(theme => {
                    this.rendition.themes.register(theme.name, theme.style);
                });
                this.rendition.themes.select(defaultTheme);
            },
            initFontSize(){
                //  设置字体大小
                let fontSize = getFontSize(this.fileName);
                if (!fontSize) {
                    saveFontSize(this.fileName, this.defaultFontSize);
                }else {
                    this.rendition.themes.fontSize(fontSize);
                    this.setDefaultFontSize(fontSize);
                }
            },
            initFontFamily() {
                //设置字体
                let font = getFontFamily(this.fileName);
                if (!font) {
                    setFontFamily(this.fileName, this.defaultFontFamily);
                }else {
                    this.rendition.themes.font(font);
                    this.setDefaultFontFamily(font);
                }
            },
            initEpub() {
                const url = 'http://localhost:8081/epub/' + this.fileName + '.epub';
                this.book = new Epub(url);
                this.setCurrentBook(this.book);
                this.rendition = this.book.renderTo('read', {
                    width: innerWidth,
                    height: innerHeight,
                    method: 'default'
                });

                //展示
                this.rendition.display().then(()=>{
                    this.initTheme();
                    this.initFontSize();
                    this.initFontFamily();
                });


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

                });
                //修改字体文件
                this.rendition.hooks.content.register(contents => {
                    Promise.all(
                        [
                            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
                            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
                            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
                            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
                        ]
                    ).then(()=>{})

                })
            }
        },
        mounted() {
            const fileName = this.$route.params.fileName.split('|').join('/');
            // console.log(fileName);
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
