/**
 * 红外接收模块
 * 提供红外遥控信号的接收与解析能力，支持红外接收头初始化、
 * 状态查询及红外按键事件的回调注册。
 * 一个设备同一时间只能使用一个红外接收头。
 * 接收到的红外信号会通过事件系统（event）进行分发。
 * 使用时方法名称前一定要带上 irr. 前缀
 *
 * @module 红外信号接收
 * @var irr
 * @category sensor
 * @keywords 红外接收,红外遥控,IR,红外解码,红外事件,遥控器,NEC
 * @capabilities recvInit,recvIsReady,recvIsSupport,recvPin,receive
 * @depends event
 */

const recvpin = 65529
const rdid = 20

var irr = {
	
/*=======================================红外接收接口开始============================================*/
	/**
	 * 一个设备只能有一个红外接收头，不能有多个
	 * 实始化红外接收
	 * 如果pin已经初始化，则直接返回
	 * @param {*} pin 
	 * @returns 
	 */
	recvInit : function(pin) {
		return jm.s({"_fn":rdid, "ty":recvpin, "op":1, "p": pin});
	},

	/**
	 * 设备红外接收头是否已经初始化并可用
	 * @returns 
	 */
	recvIsReady : function() {
		let rst = jm.s({"_fn":rdid, "ty":recvpin, "op":2});
		return rst && rst['code']==0 && rst['v'] == 1
	},

	/**
	 * 设备是否支持红外信号接收
	 * @returns 
	 */
	recvIsSupport : function() {
		let rst = jm.s({"_fn":rdid, "ty":recvpin, "op":2});
		return rst && rst['code']==0 || rst['code'] > 20;
	},

	/**
	 * 获取红外接收头连接的引脚编号,如果红外接收未初始化，则为-1
	 * @returns 
	 */
	recvPin : function() {
		let rst = jm.s({"_fn":rdid, "ty":recvpin, "op":2});
		return rst && rst['code']==0 ? rst["p"]: -1
	},

	/**
	 * 注册接收红外信号，返回的值为
	 * {
	 *  "_addr": 25932, 红外摇控器的地址码
	 *  "ec": 2, 红外设备事件码值，固定为2
	 *  "cmdId": 4 红外按键码值，表示按键4
	 * }
	 * @param {Function} func 
	 */
	receive : function(func) {
		if(func) {
			event.regEvent(event.JM_TASK_APP_IR_RECV, function(evt){
				//console.log("recv IR event: ", evt)
				if(evt) func(evt['data'])
			})
		}
	}

}
	/*=======================================红外接收接口结束============================================*/
//exports = irr

module.exports = irr;
