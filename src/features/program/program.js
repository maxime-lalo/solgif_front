import { createSlice } from "@reduxjs/toolkit"

import callProgram from "../../hooks/call.program"

const program = callProgram()
export const programSlice = createSlice({
    name: "program",
    initialState: {
        gifList: null,
    },
    reducers: {
        loadGifs: async (state) => {
            state.gifList = await program.getGifList()
        },
    },
})

// Action creators are generated for each case reducer function
export const { loadGifs } = programSlice.actions

export default programSlice.reducer
