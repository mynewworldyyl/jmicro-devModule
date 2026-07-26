/**
 * 红外发送模块
 * 提供红外遥控信号的发送能力，支持将红外编码数据通过指定 GPIO 引脚发出。
 * 一个设备可同时初始化并使用多个红外发送引脚。
 * 需设备硬件与固件均支持（ESP32 通常支持，ESP8266 低端模组一般不支持）。
 * 所有操作通过 `jm.s` 下发指令并由设备端执行。
 * 使用时方法名称前一定要带上 irs. 前缀
 *
 * @module 红外信号发送
 * @var irs
 * @category actuator
 * @keywords 红外发送,红外遥控,IR,红外编码,红外发射,NEC,多路红外
 * @capabilities sendIsSupport,sendInit,sendIsReady,sendData
 * @depends 无
 */
 
 
const sdid = 20
const sendpin = 65528

/*=======================================红外发送接口开始============================================*/

var irs = {
	/**
	 * 设备是否支持红外信号接收
	 * @returns 
	 */
	sendIsSupport : function() {
		let rst = jm.s({"_fn":sdid, "ty":sendpin, "op":2});
		return rst && rst['code']==0 || rst['code'] > 20;
	},

    /**
	 * 一个设备可以有多个红外发送头
	 * 如果pin已经初始化，则直接返回
	 * 将指定的pin初始化为红外发送引脚
	 * @param {*} pin
	 * @returns 
	 */
	sendInit : function(pin) {
		return jm.s({"_fn":sdid, "ty":sendpin, "op":1, "p": pin});
	},

	/**
	 * 设备引脚对应的红外发送引脚是否已经初始化并可用
	 * @returns 
	 */
	sendIsReady : function(pin) {
		let rst = jm.s({"_fn":sdid, "ty":sendpin, "op":2, 'p':pin});
		return rst && rst['code']==0 && rst['v'] == 1
	},

	sendData : function(pin, dataArray, len) {
		let rst = jm.s({"_fn":sdid, "ty":sendpin, "op":3, 'p':pin, 'd':dataArray, 'l':len});
		return rst && rst['code']==0
	}

}

/*=======================================红外发送接口结束============================================*/

//exports = irs

module.exports = irs;
