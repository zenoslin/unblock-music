const { ipcRenderer } = require("electron");
const os = require("os");

const networkAddress = document.getElementById("network-address");
const localAddress = document.getElementById("local-address");
const btnStart = document.getElementById("btn-start");
const inputPort = document.getElementById("input-port");

let isStart = false;

function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}

function getPort() {
  let arr = inputPort.value.split(":");
  return arr[0];
}

btnStart.addEventListener("click", event => {
  if (isStart) {
    ipcRenderer.send("stop-unblock");
  } else {
    ipcRenderer.send("start-unblock", inputPort.value);
    btnStart.innerHTML = `开启中`;
  }
});

// 子进程启动
ipcRenderer.on("unblock-begin", (event, message) => {
  localAddress.innerHTML = `地址: 127.0.0.1 端口: ${getPort()} 规则: proxy.pac`;
  networkAddress.innerHTML = `地址: ${getIPAdress()}端口: ${getPort()} 规则: proxy.pac`;
  isStart = true;
  btnStart.innerHTML = `关闭`;
});

// 子进程报错
ipcRenderer.on("unblock-error", (event, message) => {
  isStart = false;
  localAddress.innerHTML = `未开启`;
  networkAddress.innerHTML = `未开启`;
  btnStart.innerHTML = `开启`;
  console.log(message);
  alert(message);
});
// 子进程退出
ipcRenderer.on("unblock-end", (event, message) => {
  console.log(message);
  localAddress.innerHTML = `未开启`;
  networkAddress.innerHTML = `未开启`;
  isStart = false;
  btnStart.innerHTML = `开启`;
});

//开发者工具
// const btnDev = document.getElementById("btn-dev");
// btnDev.addEventListener("click", event => {
//   ipcRenderer.send("open-dev-tool");
// });