import {mapGetters, mapActions} from "vuex";
import {addCss, removeAllCss, themeList} from "./book";


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
        }
    }
};
