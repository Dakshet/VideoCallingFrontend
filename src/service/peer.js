class PeerService {
    constructor() {
        if (!this.peer) {
            //Here creating the peer with build-in method i.e. RTCPeerConnection
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478",
                        ]
                    }
                ]
            });
        }
    }


    //Now we send call to second user now second user accept this call for that we are writing the method.
    async getAnswer(offer) {
        if (this.peer) {
            await this.peer.setRemoteDescription(offer);
            const ans = await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(ans))
            return ans;
        }
    }


    //When we call accepted that time we are storing information in local description.
    async setLocalDescription(ans) {
        if (this.peer) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans))
        }
    }



    //Now we are creating the offer
    async getOffer() {
        if (this.peer) {
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer))
            return offer;
        }
    }
}

const Peer = new PeerService();
export default Peer;
