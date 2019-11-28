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
        setFontFamily,
        getLocation
    } from "../../utils/localStorage";

    global.ePub = Epub;

    export default {
        mixins: [ebookMinx],
        name: "EbookReader",
        methods: {
            prevPage() {
                if (this.rendition) {
                    this.rendition.prev().then(()=>{
                        this.refreshLocation();
                    });
                    this.hideTitleAndMenu();
                }
            },
            nextPage() {
                if (this.rendition) {
                    this.rendition.next().then(()=>{
                        this.refreshLocation();
                    });
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
            initTheme(){
                //判断是否有默认主题
                let defaultTheme = getTheme(this.fileName);
                //如果没有则保存现在的主题为默认
                if (!defaultTheme) {
                    defaultTheme = this.themeList[0].name;
                    saveTheme(this.fileName, defaultTheme);
                }
                this.setDefaultTheme(defaultTheme);
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
            initRendition() {
                this.rendition = this.book.renderTo('read', {
                    width: innerWidth,
                    height: innerHeight,
                    method: 'default'
                });
                const location = getLocation(this.fileName);
                this.display(location, ()=>{
                    this.initTheme();
                    this.initFontSize();
                    this.initFontFamily();
                    this.initGlobalStyle();
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
            },
            initGesture() {
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
            },

            parseBook(){
                this.book.loaded.cover.then(cover=>{
                    this.book.archive.createUrl(cover).then(url => {
                        this.setCover(url);
                    })
                })
            },

            initEpub() {
                const url = `${process.env.VUE_APP_BOOK_URL}/`+ this.fileName + '.epub';
                this.book = new Epub(url);
                this.setCurrentBook(this.book);
                this.initRendition();
                this.initGesture();
                this.parseBook();
                this.book.ready.then(() => {
                    //默认显示的字数
                    return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName / 16)));
                }).then(locations => {
                    // console.log(locations)
                    this.setBookAvailable(true);
                    this.refreshLocation();
                });
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
