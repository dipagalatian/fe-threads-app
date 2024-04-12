import { createSlice } from "@reduxjs/toolkit";
import { IFollowing } from "../../interface/follow";

const data: IFollowing[] = [];
// {
//     id: 0,
//     created_at: "",
//     follower: {
//         id: 0,
//         full_name: "",
//         username: "",
//         image: "",
//     },
// };

export const followingSlice = createSlice({
    name: "following",
    initialState: { data },
    reducers: {
        GET_FOLLOWINGS: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { GET_FOLLOWINGS } = followingSlice.actions;
export default followingSlice.reducer;
