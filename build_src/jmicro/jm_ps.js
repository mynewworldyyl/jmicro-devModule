/**
 * 异步消息模块
 * 提供基于主题与设备 ID 的异步消息通信能力，
 * 支持设备间、设备与服务端之间的异步 RPC 与事件通知。
 * 可用于主控与从设备协同、分布式任务调度、状态同步等场景。
 * 所有消息通过 `jm.ps` 下发并由底层消息系统处理。
 * 使用时方法名称前一定要带上 ps. 前缀
 *
 * @module 异步消息接口
 * @var ps
 * @category network
 * @keywords 异步消息,RPC,设备通信,主题消息,设备间通信,分布式控制,消息总线
 * @capabilities emap,emap2D,emap2DByDevId
 * @depends 无
 */
 
 
var ps = {
	
	/**
	 * 向特定主题发送指定类型的消息
	 * @param {Object} data 数据，KEY Value格式，KEY为字符串
	 * @param {Object} topic 向那个主题发送消息,默认为空时，消息发往： /__act/msg/+{你账号的ID}
	 * @param {Object} type 消息类型，看jm.TY_*相关参数
	 * @param {Object} callback 如果目标响应消息，则能过此回调接收，相当于异步RPC
	 */
	emap : function(data, topic, type, callback) {
		let opts = {t:type}
		if(topic) opts.p = topic
		return jm.ps(1, data, opts, callback);
	},

	/**
	 * 给同一个Wifi内的设备发送消息，实现设备间消息通信
	 * @param {Object} data 数据，KEY Value格式，KEY为字符串 
	 * @param {Number} type 消息类型，看jm.TY_*相关参数
	 * @param {String} host 目标设备 必须为同一个Wifi下的内网IP
	 * @param {Number} port 目标设备端口
	 * @param {Function=} callback 目标设备响应消息
	 */
	emap2D : function(data, type, host, port, callback) {
		return jm.ps(2, data, {p:port, h:host, t:type}, callback);
	},
	
	/**
	 * 给同一个Wifi内的设备发送消息，实现设备间消息通信
	 * 可以是主设备给从设备发送消息，或从设备给主设备发送消息， 不能实现从设备与从设备间消息发送
	 * @param {Object} data 数据，KEY Value格式，KEY为字符串 
	 * @param {number} type 消息类型，看jm.TY_*相关参数
	 * @param {String} devId 目标设备 必须为同一个Wifi下的内网IP
	 * @param {Function=} callback 目标设备响应消息
	 */
	emap2DByDevId : function(data, type, devId, callback) {
		return jm.ps(3, data, {d:devId, t:type}, callback);
	}
	
}

//exports = ps

module.exports = ps;
