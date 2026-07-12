/**
 * 精简数据发送接口
 * 只发送，不接收回复，不保证送达，基于 UDP 及 JMicro 消息协议实现。
 * 设计目标是高吞吐、低延迟，非常适合传感器数据上报、实时遥测、日志推送等单向通信场景。
 * 所有方法通过 `jm.s` 下发指令，由设备端直接发送数据包。
 * 使用时方法名称前一定要带上 datac. 前缀
 *
 * @module 数据发送和监听接口
 * @var datac
 * @category network
 * @keywords UDP,JMicro,数据上报,传感器上传,实时监控,单向通信,轻量协议
 * @capabilities isEnable,setMonnitor,send
 * @depends 无
 */


var datac = {
    /**
     * 检查当前精简数据发送功能是否启用。
     * 
     * 该方法会向指定的主机和端口发送一个操作码为 42 的 JMicro 消息，以查询当前精简数据发送功能的启用状态。
     * 
     * @returns {any} - jm.s 函数的返回值，具体返回内容取决于 jm.s 函数的实现，通常可能返回一个布尔值表示是否启用，或者返回一个包含状态信息的对象。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    isEnable: function() {
        return jm.s({ op: 42, h: host, p: port });
    },

    /**
     * 设置数据监控的主机和端口。
     * 
     * 该方法会向指定的主机和端口发送一个操作码为 43 的 JMicro 消息，用于配置数据监控的目标地址。
     * 
     * @param {string} host - 数据监控的目标主机地址，通常为 IP 地址。
     * @param {number} port - 数据监控的目标端口号，应为有效的端口号（0 - 65535）。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    setMonnitor: function(host, port) {
        jm.s({ op: 43, h: host, p: port });
    },

    /**
     * 发送数据消息。
     * 
     * 该方法会将传入的消息对象进行处理，添加消息类型和操作码后，通过 jm.s 函数发送出去。
     * 如果传入的消息对象为空，则会创建一个空对象。
     * 
     * @param {Object} msg - 要发送的数据消息对象，可以包含各种自定义的数据字段。
     * @param {string|number} msgType - 消息的类型，用于标识消息的用途，会被添加到消息对象中。
     * @returns {any} - jm.s 函数的返回值，具体返回内容取决于 jm.s 函数的实现，可能表示发送是否成功等信息。
     * @throws {Error} - 如果 jm.s 函数调用过程中出现错误，可能会抛出异常。
     */
    send: function(msg, msgType) {
        if (!msg) msg = {};
        msg['t'] = msgType;
        msg['op'] = 44;
        return jm.s(msg);
    }
};

// 导出模块
// exports = datac;
