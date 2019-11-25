const book = {
    state: {
        fileName: ''
    },
    mutations: {
        setFileName(state, fileName){
           state.fileName = fileName;
        }
    },
    actions: {
        setFileName({commit}, fileName){
            return commit('setFileName', fileName);
        }
    }
} 

export default book;