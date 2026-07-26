/**
 * 本模块提供了与JM（JMicro）框架交互的核心接口。
 *
 * 该模块负责处理与后端设备、RPC服务以及本地存储的通信，
 * 是整个H5应用与后端交互的基础设施。
 * 
 * 核心功能说明：
 * - RPC远程调用：通过 rpcByCode 方法调用后端服务，但操作设备不通过此方法
 * - 设备控制：具体调用方法请参考相关功能模块API
 * - 事件系统：支持消息监听和事件发送
 * - 本地存储：账号隔离的键值对存储
 * - 应用信息：获取当前H5应用的基本信息
 * - 登录账号名称和ID，
 * - 获取设备列表getDeviceList，用户选择一个设备后，要调用遇jm.setDev(deviceId)
 * 
 * 设备调用说明：
 * - 调用前需通过 setDev(deviceId) 设置目标设备
 * - 调用具体的下面给出的业务API实现具体功能；
 * - 所有直接控制设备的API都不在此模块下实现，要使用具体的业务功能模块
 * 
 * @example
 * // 获取应用信息
 * const appInfo = await jm.getAppInfo();
 * console.log('应用ID:', appInfo.actId);
 * 
 * // 设置目标设备并调用
 * jm.setDev('device_123');
 * 
 * @module JM核心通信模块
 * @var jm
 * @category core
 * @keywords JM,RPC,设备控制,消息,通信,本地存储
 * @capabilities init,getAppInfo,setDev,s,callDevice,rpcByCode,on,off,get,set,del,getActId,getActName,isMy,postEvent,postOpEvent,getEventOpList,executeOp,getEventCfgList
 * @depends UniAppJSBridge
 */

let jmId = 0;

var jmModule = {
    _pendingRequests: new Map(),     // 存储未完成的RPC请求 { msgId: { resolve, reject, timeoutId } }
    _messageListeners: new Map(),    // 存储消息监听器 { messageType: Set[listeners] }
    _nextMsgId: 0,                   // 自增消息ID
	appInfo:null,
	deviceId:null,
	timeout:5000,

	/**
	*初始化JM环境，一般以如下方式调用，确保环境正确实始化
	*document.addEventListener('UniAppJSBridgeReady',
	*  async () => {
	*	jm.init(window);
	*});
	*/
    init: async function(win) {
        this._instanceId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        win.__jmInstanceId = this._instanceId;

        win.addEventListener('beforeunload', () => {
            console.log('beforeunload页面即将卸载，清理定时器');
        });
		
		// 监听消息
		win.addEventListener('message', (event) => {
			this._handleRecvMessage(event)
		});
		
		win.addEventListener('popstate', () => {
			console.log('popstate用户点击了回退按钮，清理定时器');
		});
		
		let interval = setInterval(async ()=>{
			this.appInfo = await this.getAppInfo();
			if(this.appInfo) {
				console.log('Got APP suc', this.appInfo);
				clearTimeout(interval);
			}
		},1000)
		
		console.log("jm init")
    },
	
	/**
	 * 获取当前登录账号ID。
	 * 
	 * @returns {number} 账号ID，未登录时返回0
	 * 
	 * @example
	 * const actId = jm.getActId();
	 * console.log('当前账号:', actId);
	 */
	getActId: function() {
		return this.appInfo ? this.appInfo.actId : 0
	},
	
	/**
	 * 获取当前登录账号名称。
	 * 
	 * @returns {string} 账号名称，未登录时返回"未登录"
	 * 
	 * @example
	 * const name = jm.getActName();
	 * console.log('用户:', name);
	 */
	getActName: function() {
		return this.appInfo ? this.appInfo.actName : "未登录"
	},
	
	/**
	 * 判断指定账号ID是否为当前登录账号。
	 * 
	 * @param {number} actid - 要判断的账号ID
	 * @returns {boolean} true表示是当前账号
	 * 
	 * @example
	 * if (jm.isMy(12345)) {
	 *     console.log('这是当前账号');
	 * }
	 */
	isMy: function(actid) {
		return this.appInfo ? this.appInfo.actId && this.appInfo.actId==actid  : false
	},
	
	//非公开方法
	_handleRecvMessage: function(event) { 
		try {
			//console.log("h5 got event", JSON.stringify(event))
			
			let data = event.data;
			if (!data || typeof data != 'object') return;
			
			console.log("h5 got data", data)
			if(typeof data.jmt == 'undefined') {
				if(data.data && data.data.arg) {
					//uni app webview环境
					data = data.data.arg
				} else {
					 console.warn('无效JM消息:', JSON.stringify(data));
					 return
				}
			}
			
			if(data.fromH5) {
				console.log("h5 msg", JSON.stringify(data))
				return;
			}
			
			delete data.fromNative
			
			//console.log("jmdata", JSON.stringify(data))
			// 1. 优先处理注册的监听器
			if(data.jmt == 3) {
				const lis = this._messageListeners.get(data.mid);
				if(lis) {
					lis.listener(data, lis.cbArgs)
				} else {
					console.log("Invalid async msg",JSON.stringify(data))
				}
				return
			}
			
			// 2. 处理RPC响应
			if (data.msgId !== undefined) {
				console.log("got rpc response ", data);
				this._handleRpcResponse(data);
				return;
			}
	
			console.warn('未处理的消息:', JSON.stringify(data));
		} catch (error) {
			console.error('消息处理错误:', error);
		}
	},
	
	//非公开方法
	_sentMsg: function(message) {
		//console.log('_sentMsg uni发送消息',JSON.stringify({data:message}));
		//console.log('uni',JSON.stringify(uni));
		//message.reqId = ++reqId
		uni.postMessage({data:message}); // 发送消息
	},

    /**
     * 注册消息监听器。
     * 
     * 监听指定类型的消息，当消息到达时执行回调函数。
     * 返回的mid可用于后续注销监听。
     * 
     * @param {*} msgType - 消息类型（会被作为mid发送）
     * @param {Function} listener - 监听回调函数 function(data, cbArgs)
     * @param {*} [cbArgs] - 回调函数的附加参数
     * @returns {number} 监听器ID，用于注销
     * 
     * @example
     * const mid = jm.on('device_event', (data, args) => {
     *     console.log('收到设备事件:', data, args);
     * }, { custom: 'param' });
     */
    on: function(msgType, listener, cbArgs) {
        if (typeof listener !== 'function') {
            console.log('监听器必须是函数');
			//resolve({msgId, code:21,msg:`API不可用`})
			return
        }
		
		const mid = this._generateMsgId();

		let message = {mid, msgType, jmt:3}
	
		this._sentMsg(message)
		
		this._messageListeners.set(mid, {msgType, listener, cbArgs, mid});
		
        // 返回取消监听功能
        return mid;
    },

    /**
     * 注销消息监听器。
     * 
     * @param {number} mid - 由 on 方法返回的监听器ID
     * 
     * @example
     * jm.off(mid);
     */
    off: function(mid) {
        this._messageListeners.delete(mid)
    },

    // 非公开方法 处理RPC响应
    _handleRpcResponse: function(data) {
		console.log("_handleRpcResponse ", data);
        const request = this._pendingRequests.get(data.msgId);
        if (!request) {
            return;
        }
        if (data._instanceId && data._instanceId !== this._instanceId) {
            return;
        }

        clearTimeout(request.timeoutId);
        this._pendingRequests.delete(data.msgId);

        if (data.error) {
            request.resolve({code:25,msg: JSON.stringify(data.error)});
        } else {
            request.resolve(data);
        }
    },

    // 非公开方法 发送RPC请求
    _sendRpcRequest: function(message, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const msgId = this._generateMsgId();
            const instanceId = this._instanceId;
            message.msgId = msgId;
            message._instanceId = instanceId;
            //message.jmt = 1;
            message.fromH5 = true

            const timeoutId = setTimeout(() => {
                if (this._instanceId !== instanceId) return;
                //reject(new Error(`RPC请求超时 (${timeout}ms)`));
                resolve({msgId, code:20,msg:`RPC请求超时 (${timeout}ms)`})
                this._pendingRequests.delete(msgId);
            }, timeout);

            this._pendingRequests.set(msgId, { resolve, reject, timeoutId, instanceId });

            if (typeof uni !== 'undefined') {
				console.log("_sendRpcRequest ", this.deviceId,message);
                this._sentMsg(message)
            } else {
                //reject(new Error('uni API不可用'));
                resolve({msgId, code:21,msg:`API不可用`})
            }
        });
    },

	 //非公开方法
    _abortAllPendingRequests: function() {
        this._pendingRequests.forEach((req, msgId) => {
            clearTimeout(req.timeoutId);
            req.resolve({msgId, code: 25, msg: 'instance recreated'});
        });
        this._pendingRequests.clear();
        console.log('已清理所有 pending requests, instanceId=' + this._instanceId);
    },

	 //非公开方法
    _generateMsgId: function() {
        return ++this._nextMsgId;
    },

    /**
     * 通过RPC方式调用后端服务方法。
     * 
     * @param {string} mcode - 方法代码，用于标识后端服务
     * @param {*} args - 方法参数
     * @param {boolean} [secure] - 是否使用安全通道
     * @param {number} [timeout] - 超时时间(ms)，默认5000
     * @returns {Promise<JMResult>} 返回RPC调用结果
     * 
     * @example
     * const result = await jm.rpcByCode('getUserInfo', { userId: 123 });
     * if (result.code === 0) {
     *     console.log('用户信息:', result.data);
     * }
     */
    rpcByCode: function(mcode, args, secure, timeout) {
		console.log("rpc mcode=" + mcode + JSON.stringify(args))
        return this._sendRpcRequest({ jmt: 1, mcode, args, secure}, timeout);
    },

	/**
	 * 调用指定设备的方法。
	 * 
	 * @param {string} deviceId - 目标设备ID
	 * @param {Object} argsMap - 参数映射对象
	 * @param {number} [timeout] - 超时时间(ms)，默认5000
	 * @returns {Promise<JMResult>} 返回设备调用结果
	 * 
	 * @example
	 * const result = await jm.callDevice('device_123', { op: 1, pin: 5 });
	 */
    callDevice: async function(deviceId, argsMap, timeout) {
		//console.log("callDevice ", deviceId, argsMap, timeout);
		if(!timeout) timeout = 5000;
		//console.log("callDevice deviceId="+deviceId + JSON.stringify(argsMap))
        let rst = await this._sendRpcRequest({jmt: 2, deviceId, ...argsMap, timeout}, timeout);
		if(rst) {
			if(rst.data) return rst.data
			else return rst;
		} else {
			console.log("callDevice 未收到结果 ", deviceId, argsMap, timeout);
			return {code:444, msg:"not rst"}
		}
    },

	/**
	 * 设置当前目标设备ID。
	 * 
	 * 设置后，后续通过 s() 方法调用将默认发送到该设备。
	 * 一般在用户选择设备后，要及时调用这个方法切换到最新的设备
	 * 
	 * @param {string} deviceId - 目标设备ID
	 * 
	 * @example
	 * jm.setDev('device_123');
	 */
	setDev: function(deviceId) {
		this.deviceId = deviceId;
	},

	/**
	 * 设置RPC调用的默认超时时间。
	 * 
	 * @param {number} timeout - 超时时间(ms)
	 * 
	 * @example
	 * jm.setTimeout(10000); // 设置为10秒
	 */
	setTimeout: function(timeout) {
		this.timeout = timeout;
	},
	
	/**
	 * 设备调用全局入口方法。
	 * 
	 * 该方法是通过 setDev() 设置的设备调用统一入口。
	 * 所有设备操作API（如开关模块）均通过此方法实现。
	 * 
	 * @param {Object} argsMap - 参数映射对象，包含操作码和参数，不同功能接口参数不一样，下面是其中一个样例参数
	 *   - op: 操作码
	 *   - p: GPIO引脚
	 *   - ty: 设备类型
	 *   - p1: 额外引脚（磁保持继电器用）
	 *   - _d: 目标设备ID（可选，覆盖setDev设置）
	 *   - _s: 是否同步请求（可选，默认false）
	 * @returns {Promise<JMResult>} 返回设备调用结果
	 * 
	 * @example
	 * // 设置设备并调用
	 * jm.setDev('device_123');
	 * const result = await jm.s({ 
	 *     op: 2,      // 打开操作
	 *     p: 5,       // GPIO 5
	 *     ty: 1       // 普通继电器
	 * });
	 * 
	 * // 也可直接指定设备ID
	 * const result2 = await jm.s({
	 *     op: 0,
	 *     p: 5,
	 *     ty: 1,
	 *     _d: 'device_456'
	 * });
	 */
	s: function(argsMap) {
		 console.log("jm s call B");
		return this.callDevice(this.deviceId, argsMap, this.timeout)
	},
	
	/**
	 * 直接向设备发送事件。
	 * 
	 * 该方法用于主动发送事件给指定设备，不等待响应。
	 * 
	 * @param {string} deviceId - 目标设备ID
	 * @param {*} type - 事件类型
	 * @param {Object} ps - 事件参数
	 * 
	 * @example
	 * jm.postEvent('device_123', 'status_change', { status: 1 });
	 */
	postEvent: function(deviceId, type, ps) {
		console.log("postEvent deviceId=" + deviceId + ' ps=' + JSON.stringify(ps))
		if (typeof uni !== 'undefined') {
			let message = {fromH5: true, jmt: 4, deviceId, type, ps, msgId:this._generateMsgId()}
		    this._sentMsg(message)
		} else {
		    console.error('uni API不可用')
		}
	},
	
	/**
	 * 发送OP事件以触发设备的特定操作。
	 * 
	 * @param {string} eventId - 事件ID
	 * @param {Object} ps - 事件参数
	 * 
	 * @example
	 * jm.postOpEvent('open_door', { doorId: 1 });
	 */
	postOpEvent: function(eventId, ps) {
		console.log("postOpEvent eventId=" + eventId + ' ps=' + JSON.stringify(ps))
		if (typeof uni !== 'undefined') {
			let message = {fromH5: true, jmt: 5, eventId, ps, msgId:this._generateMsgId()}
		    this._sentMsg(message)
		} else {
		    console.error('uni API不可用')
		}
	},
	
	//非公开方法
	_nativeCall: function(jmtVal, args){
		return this._sendRpcRequest({
		    jmt: jmtVal,
			args,
		}, 5000);
	},
	
	/**
	 * 获取当前H5应用的信息。
	 * 
	 * @returns {Object} APP信息
	 * APP信息如下
	*		"clientId": 1,
	*		"createdBy": 809,
	*		"createdTime": 1756347640130,
	*		"description": "蛛蛛机器人控制",
	*		"devAppId": 54,
	*		"devAppName": "蛛蛛机器人",
	*		"id": 25,
	*		"name": "蛛蛛机器人控制",
	*		"openType": 3,
	*		"remark": "",
	*		"status": 1,
	*		"updatedBy": 809,
	*		"updatedTime": 1782305953075,
	*		"verCode": 30,
	*		"version": "1.0.0",
	*		"chartApp": false,
	*		"devApp": "",
	*		"actId": 809,
	*		"actName": "shop01",
	*		"native": false
	 * 
	 * @example
	 * const appInfo = await jm.getAppInfo();
	 * console.log('应用ID:', appInfo.actId);
	 * console.log('账号:', appInfo.actName);
	 */
	getAppInfo: async function(){
		let rst = await this._nativeCall(1000)
		console.log("getAppInfo rst" + rst)
		if(rst.app) return rst.app
		else return null
	},
	
	/**
	 * 获取账号关联的本地存储数据。
	 * 
	 * 数据与账号绑定隔离，最终存储于 localStorage。
	 * 
	 * @param {string} key - 存储键名
	 * @returns {Promise<*>} 存储的值，不存在或错误时返回null
	 * 
	 * @example
	 * const data = await jm.get('user_preferences');
	 * if (data !== null) {
	 *     console.log('用户偏好:', data);
	 * }
	 */
	get: async function(key){
		let rst = await this._sendRpcRequest({
		    jmt: 1004,
			key,
		}, 5000);
		console.log("get rst: " + JSON.stringify(rst))
		if(rst.code == 0) return rst.val
		else return null
	},
	
	/**
	 * 设置账号关联的本地存储数据。
	 * 
	 * @param {string} key - 存储键名
	 * @param {*} val - 要存储的值
	 * @returns {Promise<boolean>} true表示存储成功
	 * 
	 * @example
	 * await jm.set('theme', 'dark');
	 */
	set: async function(key, val){
		let rst = await this._sendRpcRequest({
		    jmt: 1005,
			key,
			val
		}, 5000);
		console.log("set rst"  + JSON.stringify(rst))
		return rst.code == 0
	},
	
	/**
	 * 删除账号关联的本地存储数据。
	 * 
	 * @param {string} key - 要删除的键名
	 * @returns {Promise<boolean>} true表示删除成功
	 * 
	 * @example
	 * await jm.del('temp_data');
	 */
	del: async function(key){
		let rst = await this._sendRpcRequest({
		    jmt: 1006,
			key,
		}, 5000);
		console.log("del rst"  + JSON.stringify(rst))
		return rst.code == 0
	},
	
	/**
	 * 获取后端配置的事件操作列表。
	 * 
	 * 该方法在特定场景中使用，一般不需要手动调用。
	 * 
	 * @returns {Promise<Object>} 事件操作列表
	 * 
	 * @ignore
	 */
	getEventOpList: async function(){
		let rst = await this._nativeCall(1001)
		console.log("getEventOpList rst" + JSON.stringify(rst))
		return rst
	},
	
	/**
	 * 向设备执行指定操作。
	 * 
	 * @param {string} deviceId - 目标设备ID
	 * @param {*} opId - 操作ID
	 * @returns {Promise<Object>} 操作结果数据
	 * 
	 * @example
	 * const result = await jm.executeOp('device_123', 'reboot');
	 */
	executeOp: async function(deviceId, opId) {
		let rst = await this._sendRpcRequest({
		    jmt: 1002,
			deviceId,
			opId,
		}, 5000);
		console.log("executeOp rst" + JSON.stringify(rst))
		return rst.data
	},
	
	/**
	 * 获取后端配置的事件列表。
	 * 
	 * 该方法在特定场景中使用，一般不需要手动调用。
	 * 
	 * @param {string} eventCode - 事件代码
	 * @returns {Promise<Object>} 事件配置列表
	 * 
	 * @ignore
	 */
	getEventCfgList: async function(eventCode){
		let rst = await this._sendRpcRequest({ jmt: 1003,eventCode,}, 5000);
		return rst
	},

	/**
	 * 获取账号下当前在线的设备列表,设备信息如下
	 *  deviceId  设备ID,字符串
	 *  name      设备名称,字符串
   	 *	type      设备类型,整数
	 *	status    设备状态,整数
	 *	chipType  设备的芯片类型 ,整数
	 *	flashSize 设备的Flash大小,单位是KB
	 * @returns {Promise<Object>} 设备列表
	 * 
	 * @example
	 *	let rst = await jm.getDeviceList();
	 *	if(rst.code == 0 && rst.data) {
	 *	//使用设备列表数据
	 *	let deviceList = rst.data;
	 *	}else {
	 *	//出错
	 *	console.log("code"+rst.code + ", msg" + rst.msg)
	 *	}
	 */
	getDeviceList: async function(){
		console.warn('getDeviceList开始');
		let rst = await this.rpcByCode(-1993191474, [], false, 5000);
		return rst
	}

};


// 初始化
//jmModule.init();

// 挂载到全局
//window.jm = jmModule;

//module.exports = jmModule;

module.exports = jmModule;
