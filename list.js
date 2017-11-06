var LAST = 0;
var INTERVAL = 1000;

function name(id) {
  return 'badge-' + id
    .split(':')
    .filter(f => f.length === 2)
    .slice(-2)
    .join('');
}

var STATE = {
  id: name(NRF.getAddress()),
  devices: []
};

// Scan for badges on Button A
setWatch(function(e) {
  scan();
}, BTNA, {
  repeat: true,
  edge: 'rising'
});

// Reset Bluetooth connections on BUtton B
setWatch(function(e) {
  NRF.sleep();
  NRF.wake();
}, BTNB, {
  repeat: true,
  edge: 'rising'
});


const width = g.getWidth();
const height = g.getHeight();

function render() {
  g.clear();
  g.drawString(STATE.id, 0, 0);

  STATE.devices.forEach((device, i) => {
    g.drawString(`${name(device.id)} ${device.rssi}`, 0, i * 6 + 2 * 6);
  });

  g.flip();
  setTimeout(render, 1000 / 60);
}

function scan() {
    STATE.scanning = true;
    NRF.findDevices(function(devices) {
      STATE.scanning = false;
      STATE.devices = devices;
    }, INTERVAL);
}

render();
