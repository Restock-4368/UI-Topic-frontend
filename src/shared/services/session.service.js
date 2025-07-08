import { ref, readonly } from "vue";

export const sessionService = {

    getUserId() {
        return Number(localStorage.getItem('userId'));
    },
    clearUserId() {
        localStorage.removeItem('userId');
    }
};