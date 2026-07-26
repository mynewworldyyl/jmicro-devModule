# esprModules

A JavaScript module collection for embedded/IoT devices, providing H5 (browser) bindings for jmicro hardware modules — covering Arduino GPIO, I2C, SPI, sensors, BLE peripherals, and more.

## Project Structure

```
esprModules/
├── arduino/          # Arduino device-side modules
│   ├── jm_analog.js
│   ├── jm_bits.js
│   ├── jm_char.js
│   ├── jm_digital.js
│   ├── jm_i2c.js
│   ├── jm_interrupt.js
│   ├── jm_pulse.js
│   ├── jm_random.js
│   ├── jm_spi.js
│   └── jm_time.js
├── jmicro/           # jmicro core device-side modules
│   ├── jm.js
│   ├── jm_ctrl.js
│   ├── jm_data_channel.js
│   ├── jm_dev.js
│   ├── jm_eeprom.js
│   ├── jm_event.js
│   ├── jm_fs.js
│   ├── jm_ir_recv.js
│   ├── jm_ir_send.js
│   ├── jm_kv.js
│   ├── jm_light.js
│   ├── jm_log.js
│   ├── jm_ml.js
│   ├── jm_native.js
│   ├── jm_petdog.js
│   ├── jm_ps.js
│   ├── jm_pwm.js
│   ├── jm_rpc.js
│   ├── jm_switcher.js
│   └── jm_utils.js
├── sensor/           # Sensor & peripheral device-side modules
│   ├── jm_aht20.js
│   ├── jm_battery.js
│   ├── jm_bl0937.js
│   ├── jm_blegamepad.js
│   ├── jm_blekeyboard.js
│   ├── jm_blemouse.js
│   ├── jm_dht11.js
│   ├── jm_hcsr04.js
│   ├── jm_irdis.js
│   ├── jm_jm.js
│   ├── jm_localcmd.js
│   ├── jm_mq.js
│   ├── jm_neopixel.js
│   ├── jm_oled1306.js
│   ├── jm_pca9685.js
│   ├── jm_sensor.js
│   ├── jm_servo.js
│   ├── jm_stepper.js
│   ├── jm_tft_espi.js
│   ├── jm_ws2812fx.js
├── build_src/        # Build source (copy of the above, preprocessed for bundling)
├── dist/             # H5 browser bundle output (jmicro.h5.min.js)
├── index.js          # Main entry — browser-side aggregation & export
├── prebuild.js       # Pre-build script: copies source, transforms async methods
├── cleanbuild.js     # Cleans module.exports from source files
├── webpack.config.js # Webpack bundler configuration
├── package.json      # NPM project config
└── README.md         # This file
```

## Overview

**esprModules** bridges embedded device-side JavaScript modules with browser-based H5 (HTML5) applications. The project provides:

- **Device-side modules** (`arduino/`, `jmicro/`, `sensor/`): run directly on hardware devices, handling GPIO, I2C, SPI, serial communication, sensors, BLE peripherals, PWM, and more.
- **Browser-side bundle** (`dist/jmicro.h5.min.js`): built via `npm run build`, this UMD bundle exposes all jmicro modules as a global `jm` object and module exports, consumable in any browser or H5 web app.

## Installation

```bash
npm install esprModules
# or clone directly
git clone https://github.com/mynewworldyyl/jmicro-devModule.git
cd jmicro-devModule
npm install
```

## Building

This project uses **Webpack** with Babel to produce a browser-compatible bundle.

### Build commands

| Command | Description |
|---------|-------------|
| `npm run build` | Production build → `dist/jmicro.h5.min.js` |
| `npm run build:dev` | Development build → `dist/jmicro.h5.js` |
| `npm run watch` | Watch mode, rebuild on changes |
| `npm run prebuild` | Copy source to `build_src/` and transform async methods |
| `npm run clean` | Clean build output |

### Build steps

1. `npm run prebuild` copies `arduino/`, `jmicro/`, and `sensor/` into `build_src/`, then transforms `@async` annotations into native `async function` methods and injects `module.exports` where needed.
2. Webpack bundles `build_src/index.js` into `dist/`.
3. Output files:
   - `dist/jmicro.h5.min.js` — minified production bundle
   - `dist/jmicro.h5.min.js.map` — source map for debugging

### Usage in browser

```html
<script src="dist/jmicro.h5.min.js"></script>
<script>
  // All modules available as global `jm` and individual exports
  console.log(jm);
  console.log(jm.sensor);
  console.log(jm.bleKeyboard);
  console.log(jm.oled);
</script>
```

Or as ES module:

```javascript
import jm from 'esprModules/dist/jmicro.h5.min.js';

// Access any module via jm
jm.sensor.init();
```

## Modules Reference

### Arduino (`arduino/`)

| Module | Description |
|--------|-------------|
| `jm_analog` | Analog pin read/write |
| `jm_bits` | Bit manipulation utilities |
| `jm_char` | Character encoding/operations |
| `jm_digital` | Digital GPIO |
| `jm_i2c` | I2C bus communication |
| `jm_interrupt` | External interrupt handling |
| `jm_pulse` | Pulse generation & measurement |
| `jm_random` | Random number generation |
| `jm_spi` | SPI bus communication |
| `jm_time` | Time & delay utilities |

### jmicro Core (`jmicro/`)

| Module | Description |
|--------|-------------|
| `jm` | Core jmicro framework |
| `jm_ctrl` | Controller logic |
| `jm_data_channel` | Data channel communication |
| `jm_dev` | Device information & management |
| `jm_eeprom` | EEPROM read/write |
| `jm_event` | Event system |
| `jm_fs` | File system |
| `jm_ir_recv` | IR receiver |
| `jm_ir_send` | IR sender |
| `jm_kv` | Key-value storage |
| `jm_light` | Light sensor |
| `jm_log` | Logging utility |
| `jm_ml` | Machine learning / device manager |
| `jm_petdog` | Watchdog timer |
| `jm_ps` | Power supply management |
| `jm_pwm` | PWM output |
| `jm_rpc` | Remote procedure call |
| `jm_switcher` | State switching/control |
| `jm_utils` | General utilities |

### Sensors (`sensor/`)

| Module | Description |
|--------|-------------|
| `jm_aht20` | AHT20 temperature & humidity sensor |
| `jm_battery` | Battery level monitoring |
| `jm_bl0937` | BL0937 power meter |
| `jm_blegamepad` | BLE gamepad/HID |
| `jm_blekeyboard` | BLE keyboard |
| `jm_blemouse` | BLE mouse |
| `jm_dht11` | DHT11 temperature & humidity |
| `jm_hcsr04` | HC-SR04 ultrasonic distance |
| `jm_irdis` | IR distance sensor |
| `jm_jm` | jmicro sensor base |
| `jm_localcmd` | Local command processing |
| `jm_mq` | MQ gas sensor |
| `jm_neopixel` | NeoPixel LED control |
| `jm_oled1306` | OLED 1306 display |
| `jm_pca9685` | PCA9685 PWM driver |
| `jm_sensor` | Sensor base/manager |
| `jm_servo` | Servo motor control |
| `jm_stepper` | Stepper motor control |
| `jm_tft_espi` | TFT display (ESP32) |
| `jm_ws2812fx` | WS2812 LED effects |

## License

ISC
