const spawn = require("child_process").spawn;
const { uuid}  = require("uuidv4");
const QRCode = require('qrcode')

console.info("启用网络穿透");
console.info(`  穿透服务器:${process.env.FRP_SERVER}:${process.env.FRP_SERVER_PORT}`);
console.info(`  远程端口: ${process.env.FRP_REMOTE_PORT}`);
process.env.FRP_ID = uuid();
const frp = spawn("./lib/frpc/frpc",["-c","./lib/frpc/frpc.ini"])
frp.stdout.pipe(process.stdout);


const url = `http://${process.env.FRP_SERVER}:${process.env.FRP_REMOTE_PORT}`;
console.info(`如果穿透成功，可以使用 ${url}  访问遥控车控制界面`)
QRCode.toString(url ,{type:'terminal'}, function (err, url) {
  console.info(url)
});
console.info(`如果如果延迟过高，请想办法找一个较近的 frp 服务器来进行网络穿透`);
console.info(`如果你愿意免费为网友提供 frp 服务器内置到 network-rc 里，请联系我 itiwll@gmail.com`);

//setInterval(() => {
//  const check = spawn("./lib/frpc/frpc",["status", "-c","./lib/frpc/frpc.ini"])
//  check.stdout.pipe(process.stdout);
//}, 5000)