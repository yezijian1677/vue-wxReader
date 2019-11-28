import {mapGetters, mapActions} from "vuex";
import {addCss, removeAllCss, themeList, getReadTimeByMinute} from "./book";
import {saveLocation} from "./localStorage";


export const ebookMinx = {
    computed: {
        ...mapGetters([
            'fileName',
            'menuVisible',
            'settingVisible',
            'defaultFontSize',
            'defaultFontFamily',
            'fontFamilyVisible',
            'defaultTheme',
            'bookAvailable',
            'progress',
            'section',
            'isPaginating',
            'currentBook',
            'navigation',
            'cover',
            'metadata',
            'paginate',
            'pagelist',
            'offsetY',
            'isBookmark'
        ]),
        themeList(){
            return themeList(this);
        }
    },
    methods:{
        ...mapActions([
            'setFileName',
            'setMenuVisible',
            'setSettingVisible',
            'setDefaultFontSize',
            'setDefaultFontFamily',
            'setFontFamilyVisible',
            'setDefaultTheme',
            'setBookAvailable',
            'setProgress',
            'setSection',
            'setIsPaginating',
            'setCurrentBook',
            'setNavigation',
            'setCover',
            'setMetadata',
            'setPaginate',
            'setPagelist',
            'setOffsetY',
            'setIsBookmark'
        ]),
        //全局主题
        initGlobalStyle() {
            //首先先清除所有css
            removeAllCss();
            //再添加选择的css
            switch (this.defaultTheme) {
                case "Default":
                    addCss(`${process.env.VUE_APP_THEME_URL}/theme_default.css`);
                    break;
                case "Eye":
                    addCss(`${process.env.VUE_APP_THEME_URL}/theme_eye.css`);
                    break;
                case "Gold":
                    addCss(`${process.env.VUE_APP_THEME_URL}/theme_gold.css`);
                    break;
                case "Night":
                    addCss(`${process.env.VUE_APP_THEME_URL}/theme_night.css`);
                    break;
                default:
                    addCss(`${process.env.VUE_APP_THEME_URL}/theme_default.css`);
                    break;
            }
        },
        //刷新进度
        refreshLocation() {
            //获取此书的当前位置
            const currentLocation = this.currentBook.rendition.currentLocation();
            const startCfi = currentLocation.start.cfi;
            //使用当前位置的cfi计算百分比
            const progress = this.currentBook.locations.percentageFromCfi(startCfi);
            this.setProgress(Math.floor(progress * 100));
            this.setSection(currentLocation.start.index);
            saveLocation(this.fileName, startCfi);
        },

        display(target, cb){
            if (target) {
                this.currentBook.rendition.display(target).then(()=>{
                    this.refreshLocation();
                    if (cb) cb();
                });
            }else {
                this.currentBook.rendition.display().then(()=>{
                    this.refreshLocation();
                    if (cb) cb();
                });
            }
        },
        //隐藏
        hideTitleAndMenu() {
            this.setMenuVisible(false);
            this.setSettingVisible(-1);
            this.setFontFamilyVisible(false);
        },
        //获取读书时间
        getReadTimeText() {
            return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName));
        },

    }
};
