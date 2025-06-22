import { ref, readonly } from "vue";

class SessionService {
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
        return this.profileId;
    }
}

export const sessionService = new SessionService(); // 👈 Instancia única exportada