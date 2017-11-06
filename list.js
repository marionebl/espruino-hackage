var LAST = 0;
var INTERVAL = 2500;

function name(id) {
  return 'badge-' + id
    .split(':')
    .filter(f => f.length === 2)
    .slice(-2)
    .join('');
}

var STATE = {
  id: name(NRF.getAddress()),
  devices: [],
  selected: 0
};

// Scan for badges on Button A
setWatch(function (e) {
  scan();
}, BTNA, {
    repeat: true,
    edge: 'rising'
  });

// Reset Bluetooth connections on BUtton B
setWatch(function (e) {
  NRF.sleep();
  NRF.wake();
}, BTNB, {
    repeat: true,
    edge: 'rising'
  });

setWatch(function (e) {
  STATE.selected = Math.max(0, STATE.selected - 1);
}, BTNU, {
    repeat: true,
    edge: 'rising'
  });
setWatch(function (e) {
  STATE.selected = Math.min(STATE.devices.length - 1, STATE.selected + 1);
}, BTND, {
    repeat: true,
    edge: 'rising'
  });


const width = g.getWidth();
const height = g.getHeight();

function render() {
  g.clear();
  g.setColor(1);
  g.drawString(STATE.id, 0, 0);

  STATE.devices.forEach((device, i) => {
    const y = i * 6 + 2 * 6;
    if (STATE.selected === i) {
      g.fillRect(0, y - 1, width, y + 6);
      g.setColor(0);
    } else {
      g.setColor(1);
    }
    g.drawString(`${name(device.id)} ${device.rssi}`, 1, y);
  });

  g.flip();
  setTimeout(render, 1000 / 60);
}

function scan() {
  STATE.scanning = true;
  NRF.findDevices(function (devices) {
    STATE.scanning = false;
    STATE.devices = devices;
    STATE.selected = 0;
  }, INTERVAL);
}

render();
scan();
