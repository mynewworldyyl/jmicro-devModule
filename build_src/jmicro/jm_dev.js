/**
 * 设备操作模块
 * 提供与设备运行环境、系统状态、生命周期及基础能力相关的操作接口。
 * 可用于设备管理、环境切换、状态查询、音频播报、系统重启与运行控制等场景。
 * 所有方法通过 `jm.s` 下发指令并由设备端执行。
 * 使用时方法名称前一定要带上 dev. 前缀
 *
 * @module 设备操作相关接口
 * @var dev
 * @category system
 * @keywords 设备管理,系统控制,环境切换,设备ID,设备名称,WiFi状态,登录状态,音频播放,内存信息,运行控制,系统重启
 * @capabilities refleshDeviceCmdCache,updateAppCtrlOpList,changeEnvTo,isLogin,isWifiEnable,deviceId,deviceName,isMaster,playTextAudio,printMemInfo,restart,disableRun,enableRun,runStatus
 * @depends 无
 */

var dev = {
    /**
     * 刷新设备命令缓存
     * 
     * @param {string} cmdId - 需要刷新的命令ID。
     * @returns {Object} - 返回底层方法 `jm.s` 的执行结果。
     * 
     * @example
     * dev.refleshDeviceCmdCache('cmd123');
     */
    refleshDeviceCmdCache: function(cmdId) {
        return jm.s({ "_fn": 12, op: 0, cmdId: cmdId });
    },

    /**
     * 更新应用控制操作列表
     * 
     * @example
     * dev.updateAppCtrlOpList('pin1', 'value1');
     */
    updateAppCtrlOpList: function() {
        return jm.s({ "_fn": 22, op: 1 });
    },

    /**
     * 切换环境
     * 
     * @param {string} envTag - 目标环境的标签。
     * @returns {Object} - 返回底层方法 `jm.s` 的执行结果。
     * 
     * @example
     * dev.changeEnvTo('production');
     */
    changeEnvTo: function(envTag) {
        return jm.s({ "_fn": 51, op: 4, to: envTag });
    },

    /**
     * 检查是否已经登录
     * 
     * @returns {Object} - 返回底层方法 `jm.s` 的执行结果。
     * 
     * @example
     * const loginStatus = dev.isLogin();
     * if (loginStatus) {
     *     console.log('已登录');
     * } else {
     *     console.log('未登录');
     * }
     */
    isLogin: function() {
        return jm.s({ op: 2 });
    },

    /**
     * 检查WiFi是否可用
     * 
     * @returns {Object} - 返回底层方法 `jm.s` 的执行结果。
     * 
     * @example
     * const wifiStatus = dev.isWifiEnable();
     * if (wifiStatus) {
     *     console.log('WiFi可用');
     * } else {
     *     console.log('WiFi不可用');
     * }
     */
    isWifiEnable: function() {
        return jm.s({ op: 3 });
    },

    /**
     * 获取设备ID
     * 
     * @returns {Object} - 返回底层方法 `jm.s` 的执行结果。
     * 
     * @example
     * const deviceId = dev.deviceId();
     * console.log('设备ID:', deviceId);
     */
    deviceId: function() {
        return jm.s({ op: 4 });
    },

    /**
     * 获取设备名称
     * 
     * @returns {Object} - 返回底层方法 `jm.s` 的执行结果。
     * 
     * @example
     * const deviceName = dev.deviceName();
     * console.log('设备名称:', deviceName);
     */
    deviceName: function() {
        return jm.s({ op: 5 });
    },

    /**
     * 检查是否为主设备
     * 
     * @returns {Object} - 返回底层方法 `jm.s` 的执行结果。
     * 
     * @example
     * const isMaster = dev.isMaster();
     * if (isMaster) {
     *     console.log('是主设备');
     * } else {
     *     console.log('不是主设备');
     * }
     */
    isMaster: function() {
        return jm.s({ op: 6 });
    },

    /**
     * 播放文本音频
     * 
     * @param {string} text - 需要播放的文本内容。
     * @returns {Object} - 返回底层方法 `jm.s` 的执行结果。
     * 
     * @example
     * dev.playTextAudio('你好，世界！');
     */
    playTextAudio: function(text) {
        return jm.s({ op: 7, t: text });
    },

    /**
     * 打印内存使用情况信息到终端
     * 
     * @returns {Object} - 返回底层方法 `jm.s` 的执行结果。
     * 
     * @example
     * dev.printMemInfo();
     */
    printMemInfo: function() {
        return jm.s({ op: 10 });
    },

    /**
     * 将当前的JS执行环境保存到Flash，下次启动时直接执行
     * 
     * @returns {Object} - 返回 `save` 方法的执行结果。
     * 
     * @example
     * dev.saveJsEmage();
     */
    /* saveJsEmage: function() {
        return save();
    }, */
	
	restart: function() {
	   event.post(event.JM_TASK_APP_RESTART_SYSTEM, {subType:1})
	},
	
	/**
	 * 禁用run的启动
	 * 
	 * @example
	 * dev.disableRun();
	 */
	disableRun: function() {
	    return jm.s({ op: 81 });
	},
	
	
	/**
	 * 启用run动行
	 * 
	 * @example
	 * dev.enableRun();
	 */
	enableRun: function() {
	    return jm.s({ op: 82 });
	},
	
	/**
	 * 返回当前run循坏是否启用
	 * 
	 * @returns {Object} - true 启用， 否则禁用
	 * 
	 * @example
	 * dev.runStatus();
	 */
	runStatus: function() {
	    return jm.s({ op: 83 });
	},
	
};

// 导出模块
// exports = dev;

module.exports = dev;
