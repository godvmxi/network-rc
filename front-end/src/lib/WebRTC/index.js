export default class WebRTC {
  constructor({ video, socket }) {
    this.video = video;
    this.socket = socket;

    // #0 请求 webrtc 连接
    this.socketSend({ type: "connect" })
    this.socket.addEventListener("message", this.onSocketMessage)
  }

  socketSend({ type, payload }) {
    this.socket.send(JSON.stringify({
      action: `webrtc ${type}`,
      payload
    }))
  }

  onSocketMessage = ({ data }) => {
    if (typeof data !== "string") return;
    data = JSON.parse(data);
    const { action, payload } = data;
    if (action.indexOf("webrtc") === -1) return;
    const type = action.split(" ")[1];
    switch (type) {
      case "offer":
        this.onOffer(payload)
        break;
      default:
        console.log(action)
        break;
    }
  }

  onOffer = async (offer) => {
    // # 4 创建客户端 rc
    const rc = new RTCPeerConnection({
      sdpSemantics: 'unified-plan',
      iceServers: [
        {
          urls: 'stun:global.stun.twilio.com:3478?transport=udp'
        },
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ],
    });

    this.rc = rc;

    rc.addEventListener("icecandidate", ({ candidate }) => {
      if (!candidate) return;
      this.socketSend({ type: "candidate", payload: candidate })
      console.log("local candidate", candidate);
    })

    // # 5 设置客户端远程 description
    await rc.setRemoteDescription(offer);

    // # 6 获取远程 stream
    console.log("receivers", rc.getReceivers());
    const remoteStream = new MediaStream(rc.getReceivers().map(receiver => receiver.track));
    this.video.srcObject = remoteStream;

    // # 7 设置客户端本地 description 传递本地回答详情
    const answer = await rc.createAnswer();
    await rc.setLocalDescription(answer);
    this.socketSend({ type: "answer", payload: answer })
  }

  close() {
    this.socket.removeEventListener("message", this.onSocketMessage)
    this.rc.close();
    this.rc = undefined;
    this.socketSend({ type: "close" });
  }
}

