const book = {
    state: {
        fileName: '',
        menuVisible: false
    },
    mutations: {
        setFileName(state, fileName){
           state.fileName = fileName;
        },
        setMenuVisible(state, menuVisible){
            state.menuVisible = menuVisible;
        }
    }
};

export default book;
