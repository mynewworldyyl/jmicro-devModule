/**
 * RPC远程调用模块
 * 该模块提供了一个基于 RPC（远程过程调用）的接口，借助 UDP 及 JMicro 消息协议来实现远程调用功能。
 * 此接口允许在本地调用远程的方法，将请求消息发送出去并可以获取响应结果。
 * reqData方法请求第三方数据，如天气预报，交通路况，台风路径等
 * 使用时方法名称前一定要带上rpc.前缀
 *
 * 
 * @module 远程RPC调用
 * @var rpc
 * @category communication
 * @keywords rpc,远程调用,通信,消息,请求三方数据
 * @capabilities call,async_call,ai_chat,aiConfig,reqData
 * @depends 
 */

let aiCfg ={
	"aiTag" : 5,
	"timeout" : 5,
}

var rpc = {
	
    /**
     * 执行远程过程调用。
     * 
     * 该方法通过构造一个符合 JMicro 消息协议的消息对象，并调用 jm.s 函数将其发送出去，以实现远程过程调用。
     * 消息对象包含操作码、方法代码、安全标识和参数等信息。
     * 
     * @param {string|number} mcode - 要调用的远程方法的代码，用于标识具体的远程方法。
     * @param {Object|Array} args - 调用远程方法时传递的参数，可以是一个对象或数组，具体格式取决于远程方法的定义。
     * @param {boolean} secure - 安全标识，用于指示该调用是否需要进行安全处理，例如加密传输等。
    *  @param {number} timeout 以秒为单位
	 * @returns {any} - jm.s 函数的返回值，具体返回内容取决于 jm.s 函数的实现，可能是远程方法的执行结果、状态信息等。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    call: function (mcode, args, secure, timeout) {
        return jm.s({ op: 1, m: mcode, s: secure, a: args, to:timeout });
    },
	
	/**
	 * 异步RPC
	 * @param {Object} mcode
	 * @param {Object} args
	 * @param {Object} callback
	 * @param {Object} secure
	 */
	callAsync: function (mcode, args, callback, secure, timeout) {
	    return jm.s({ op: 1, m: mcode, s: secure, a: args, c:callback,to:timeout });
	},
	
	/**
	 * 调用大模形实现聊天
	 * 账号需要开通大模型聊天权限
	 * @param {Object} chatMsg
	 * @param {Object} callback
	 */
	aiChat: function (chatMsg, callback, secure) {
		let req = {}
		
		let k="aiTag";
		if(!aiCfg[k] || aiCfg[k]  !== 5) {
			k="token";
			if(!aiCfg[k] || aiCfg[k].length == 0) {
				return {code:200,msg:"token Invalid"}
			}
			req[k] = aiCfg[k]
			
			k="model";
			if(!aiCfg[k] || aiCfg[k].length == 0) {
				return {code:201,msg:"model Invalid"}
			}
			req[k] = aiCfg[k]
		}
		
		req["aiTag"] = aiCfg["aiTag"]
		req["msg"] = chatMsg

		req["senceCode"] = aiCfg["senceCode"]
		if(aiCfg["sence"]) req["sence"] = aiCfg["sence"]
		
		return jm.s({ op: 1, m: 1270993887, s: secure, a: req, c:callback, to:aiCfg["timeout"] });
	},
	
	/**
	 	AI_PLATFORM_TEST= 0 //用于测试档板
	 	AI_PLATFORM_GPT = 1  //OpenAi
	 	AI_PLATFORM_BAIDU = 2  //百度文心一言
	 	AI_PLATFORM_DEEPSEEK = 3 //DeepSeek
	 	AI_DOUBAO = 4  //豆包
		
		jm平台默认供应商标识，需要在jm平台充值才能使用
		因为jm平台要支持各种各样的厂商模型，各种各样的收费模式，所以为了降低复杂度，通通按1分钱一个请求进行计费
		对于这个计费模式，后期可能会优化，当前就这样了，如果你介意这个模式，可以自己去供应商平台申请token使用，
		jm平台当前不收取使用个人申请的token的费用。
		AI_JM = 5
		
	 * @param {Number} aiTag 大模型供应商标识，
	 * @param {String} token 大模型的token
	 * @param {String} model 大模型标识
	 * @param {Number} timeout 请求超时时间，单位秒，建议不少于30秒
	 */
	aiConfig: function (aiTag, token, model, timeout, senceCode, senceStr) {
		aiCfg["aiTag"] = aiTag
		aiCfg["token"] = token
		aiCfg["model"] = model
		aiCfg["timeout"] = timeout
		
		aiCfg["senceCode"] = senceCode
		aiCfg["sence"] = senceStr
	},

	/**
	 * 第三方数据请求的封装
	 * 
	 * @param {String} apiId 要访问的接口唯一标识
	 * @param {Object} reqParms 一定是Key-Value格式的对像，接口请求的参数
	 * @param {String} reqUrl 请求数据的HTTP URL地址
	 * @param {String} key 请求APP所用到的KEY或Token，并不是必须的，表示第三方接所验证权限用到的KEY
	   @returns {Object} - 第三方返回的数据内容由三方接口请求确定，使用者需要参考对应的三方接口文档的返回数据说明。
	   				如果请求出错，返回类似{code:1}这种格式，code是一个非0值，表示错误码，正常不一定有这个字值，但错误时一定有
	* @example
	*	//请求https://dashboard.juhe.cn/data/index/my接口的天气数据
	*   //注意参数的顺序是 appId, obj, key
	*	let data = rpc.reqData("juhe_simpleWeather", {'city':'深圳'}, 'https://apis.juhe.cn/simpleWeather/query', '8c8fcbcf2d53b457c2a6388e86991200');
	*	if(data['code']) {
	*	 jm.i("error juhe_simpleWeather", data);
	*	 return;
	*	}
	*
	 */
	reqData: function (apiId, reqParms, reqUrl, key) {
		if(!reqParms) reqParms = {};
		if(key) {
			reqParms['key'] = key
		}

		if(reqUrl) {
			reqParms['_rurl_'] = reqUrl
		}
		
		let rr = rpc.call(-1124277097, [{'apiId':apiId, 'jsonParam':JSON.stringify(reqParms), 'validDays':10}]);
		//jm.i("reqData rst", apiId, rr);
		if(rr['code']==0) {
			let data = JSON.parse(rr['data']);
			// 解码整个对象
			//let decodedData = decodeObject(rr['data']);
			return data;
		}else {
			jm.i("reqData error", apiId, JSON.stringify(reqParms), rr);
			return rr;//返回错误对像，code
		}

	},

};

module.exports = rpc;
