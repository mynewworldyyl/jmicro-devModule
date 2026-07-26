/**
 * 基于GPIO单个引脚控制开关，只能控制引脚的高底电平，
 * 使用时要优先考虑使用“继电器/MOS管开关控制模块”实现，非你明确知道你在干什么
 * 使用时方法名称前一定要带上 lg. 前缀
 *
 * @module 灯光控制
 * @var lg
 * @category actuator
 * @keywords 灯光控制,LED控制,远程控制,设备联动,开关,状态切换
 * @capabilities turnOn,turnOff,toggle
 * @depends ps
 */
 
 
var lg = {
	
	/**
	 * 开灯
	 * @param {String} devId 设备ID
	 * @param {Number} pin  灯光接的引脚
	 */
	turnOn : function(devId, pin) {
		ps.emap2DByDevId({"_fn":53, "op":2, "gpioNo":pin}, -128, devId)
	},

	/**
	 * 关灯
	 * @param {String} devId 设备ID
	 * @param {Number} pin  灯光接的引脚
	 */
	turnOff : function(devId, pin) {
		ps.emap2DByDevId({"_fn":53, "op":1, "gpioNo":pin}, -128, devId)
	},

	/**
	 * 切换开关，原来是开的则切换为关，反之则然
	 * @param {String} devId 设备ID
	 * @param {Number} pin  灯光接的引脚
	 */
	toggle : function(devId, pin) {
		ps.emap2DByDevId({"_fn":53, "op":3, "gpioNo":pin}, -128, devId)
	}
	
}

//exports = ctrl

module.exports = lg;
