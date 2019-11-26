import {mapGetters, mapActions} from "vuex";


export const ebookMinx = {
    computed: {
        ...mapGetters([
            'fileName',
            'menuVisible'
        ])
    },
    methods:{
        ...mapActions([
            'setMenuVisible',
            'setFileName'
        ])
    }
};
