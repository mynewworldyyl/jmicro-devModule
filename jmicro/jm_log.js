/**
 * 远程日志模块
 * 提供将设备日志信息通过 UDP 发送至远程日志服务器的能力，
 * 适用于分布式设备调试、运行状态监控与故障排查。
 * 支持动态设置日志服务器、停止日志输出及查询日志模块状态。
 * 所有网络日志操作基于 JMicro 协议实现，效率高、资源占用低。
 * 除AI日志外，其他通用日志建议使用 `jm.i()` 作为统一日志入口。
 * 使用时方法名称前一定要带上 rlog. 前缀
 *
 * @module 日志记录
 * @var rlog
 * @category system
 * @keywords 远程日志,UDP日志,日志服务器,设备调试,运行状态监控,分布式日志
 * @capabilities aiLog,i,setLogHost,stopLog,qryInfo
 * @depends 无
 */

// 日志模块标识
let logDefId = 4;

var rlog = {
   
	/**
     * 专为AI设计的日志记录，生成的日志将传发给AI,用于AI日志分析
     * 记录日志信息
     * 
     * @param {任何数据} info - 支持可变参数日志信息对象。
     * @returns {void}
     * 
     * @example
     * rlog.i( '这是一条日志信息');
     */
    i: function(info) {
        // 调用底层方法记录日志
        jm.i("[Ai]: ",info);
    },

    /**
     * 设置远程日志服务器
     * 
     * @param {string} host - 远程日志服务器的IP地址。
     * @param {number} port - 远程日志服务器的端口号。
     * @returns {Object} - 返回底层方法 `jm.s` 的执行结果。
     * 
     * @example
     * rlog.setLogHost('192.168.1.100', 514);
     */
    setLogHost: function(host, port) {
        return jm.s({ "_fn": logDefId, op: 1, h: host, p: port });
    },

    /**
     * 停止日志输出
     * 停止将日志发送到远程服务器。
     * 
     * @returns {Object} - 返回底层方法 `jm.s` 的执行结果。
     * 
     * @example
     * rlog.stopLog();
     */
    stopLog: function() {
       return jm.s({ "_fn": logDefId, op: 2 });
    },

    /**
     * 查询日志信息
     * 查询当前日志模块的状态或配置信息。
     * 
     * @returns {Object} - 返回底层方法 `jm.s` 的执行结果。
     * 
     * @example
     * const logInfo = rlog.qryInfo();
     * console.log('日志信息:', logInfo);
     */
    qryInfo: function() {
        return jm.s({ "_fn": logDefId, op: 4 });
    }
};

// 导出模块
// exports = rlog;
