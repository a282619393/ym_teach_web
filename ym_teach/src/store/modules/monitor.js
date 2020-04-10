const mouitor = {
  state: {
    call_count: "s"
  },
  mutations: {
    CALLCOUNT:(state, newcount)=>{
      state.call_count = newcount
    }
  },
  actions: {
    callCount: (context,callCount) => {
      context.commit('CALLCOUNT', callCount)
    }
  }
}
export default mouitor
