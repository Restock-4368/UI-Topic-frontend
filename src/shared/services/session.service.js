import httpInstance from "../../shared/services/http.instance.js";
import {readonly, ref} from "vue";

export class SessionService {
    constructor() {
        this._profileId = ref(null);
        this.profileId = readonly(this._profileId);
    }

    setProfileId(id) {
        this._profileId.value = id;
    }

    getProfileId() {
        return this._profileId.value;
    }

    getProfileIdRef() {
        return this.profileId
    }
}