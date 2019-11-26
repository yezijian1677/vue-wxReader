const actions = {
    setFileName({commit}, fileName) {
        return commit('setFileName', fileName);
    },
    setMenuVisible({commit}, menuVisible) {
        return commit('setMenuVisible', menuVisible);
    }
};

export default actions;
