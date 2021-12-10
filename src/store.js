import { configureStore } from "@reduxjs/toolkit"

import program from "./features/program/program"

export default configureStore({
    reducer: {
        program: program,
    },
})
