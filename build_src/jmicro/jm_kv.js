/**
 * 键值对存储模块
 * 提供轻量级、非易失性的键值对数据存储能力，适用于保存设备配置、
 * 用户偏好、运行状态等小体量数据。
 * 所有操作通过 `jm.s` 下发指令并由设备端执行。
 * 使用时方法名称前一定要带上 kv. 前缀
 *
 * @module 键值对存取
 * @var kv
 * @category storage
 * @keywords 键值存储,KV,配置存储,非易失存储,参数保存,状态记忆
 * @capabilities set,update,get,del
 * @depends 无
 */
 
 
var kv = {
	
	/**
	 * 存值
	*/
	set: function(key,val) {
	    let rst = jm.s({ op: 70, 'k':key, v:val});
		return rst && rst.v ? rst.v:0;
	},

	/**
	 * 更新值
	*/
	update: function(key,val) {
	    let rst = jm.s({ op: 71, 'k':key, v:val});
		return rst && rst.v ? rst.v:0;
	},
	
	/**
	 * 取值
	 */
	get: function(key) {
	    let rst = jm.s({ op: 73, 'k':key});
		return rst && rst.v
	},
	
	/**
	 * 删除值
	 */
	del: function(key) {
	    let rst = jm.s({ op: 72, 'k':key});
		return rst && rst.c == 0
	},
	
};

// 导出模块
// exports = kv;

module.exports = kv;
