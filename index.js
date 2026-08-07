import jm from "./sensor/jm_jm.js"

import analog from "./arduino/jm_analog.js"
import bits from "./arduino/jm_bits.js"
import char from "./arduino/jm_char.js"
import gpio from "./arduino/jm_digital.js"
import i2c from "./arduino/jm_i2c.js"
import interrupt from "./arduino/jm_interrupt.js"
import pulse from "./arduino/jm_pulse.js"
import ran from "./arduino/jm_random.js"
import spi from "./arduino/jm_spi.js"
import time from "./arduino/jm_time.js"

import rpc from "./jmicro/jm_rpc.js"
//import ctrl from "./jmicro/jm_ctrl.js"
import ps from "./jmicro/jm_ps.js"
import deviceMgr from "./jmicro/jm_ml.js"
import kv from "./jmicro/jm_kv.js"
import fs from "./jmicro/jm_fs.js"
import datac from "./jmicro/jm_data_channel.js"
import log from "./jmicro/jm_log.js"
//import irr from "./jmicro/jm_ir_recv.js"
import eeprom from "./jmicro/jm_eeprom.js"
import swt from "./jmicro/jm_switcher.js"
import lg from "./jmicro/jm_light.js"
import pwm from "./jmicro/jm_pwm.js"
import petdog from "./jmicro/jm_petdog.js"
import irs from "./jmicro/jm_ir_send.js"
import event from "./jmicro/jm_event.js"
import dev from "./jmicro/jm_dev.js"
import utils from "./jmicro/jm_utils.js"

import oled from "./sensor/jm_oled1306.js"
import pca9685 from "./sensor/jm_pca9685.js"
import bleMouse from "./sensor/jm_blemouse.js"
import bleKeyboard from "./sensor/jm_blekeyboard.js"
import bleGamepad from "./sensor/jm_blegamepad.js"
import tft from "./sensor/jm_tft_espi.js"
import ws2812fx from "./sensor/jm_ws2812fx.js"
import servo from "./sensor/jm_servo.js"
import Stepper from "./sensor/jm_stepper.js"
import irdis from "./sensor/jm_irdis.js"
import sr04 from "./sensor/jm_hcsr04.js"
import dht11 from "./sensor/jm_dht11.js"
import ah20 from "./sensor/jm_aht20.js"
import neo from "./sensor/jm_neopixel.js"
import sensor from "./sensor/jm_sensor.js"
import mq from "./sensor/jm_mq.js"
import mqttProxy from "./sensor/jm_mqtt_proxy.js"
import bl0937 from "./sensor/jm_bl0937.js"
import battery from "./sensor/jm_battery.js"

const jmModule = {
    mq,
    event,
    sr04,
    dev,
    eeprom,
    //irr,
    irs,
    lg,
    log,
    pwm,
    swt,
    utils,
    ah20,
    dht11,
    irdis,
    oled,
    sensor,
    servo,
    Stepper,
    analog,
    gpio,
    petdog,
    pca9685,
    ran,
    time,
    pulse,
    interrupt,
    i2c,
    char,
    bits,
    spi,
    rpc,
    //ctrl,
    ps,
    deviceMgr,
    kv,
    fs,
    datac,
    tft,
    ws2812fx,
    neo,
    bl0937,
    battery,
    bleMouse,
    bleKeyboard,
    bleGamepad,
    mqttProxy
}

Object.assign(jm, jmModule);
window.jm = jm;
Object.assign(window, jmModule);

if (window.jm && window.jm.init) {
    window.jm.init(window).catch(err => {
        console.error('JM 初始化失败:', err);
    });
}else {
     console.error('window.jm不存在:', err);
}

export default jmModule;
