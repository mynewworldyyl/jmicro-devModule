/**
 * MQTT Proxy MQTT代理模块
 * 
 * 本模块提供了MQTT代理功能的 JS API，基于底层 C 接口实现。
 * 支持MQTT连接、断开、发布消息、订阅主题、取消订阅、查询状态等功能。
 * 
 * 所有方法返回值说明：
 * 返回值是一个对象，包含以下字段：
 * - code (number): 操作结果码，0 表示成功，非 0 表示失败。
 *   常见错误码：
 *   1: 缺少操作码(op)参数
 *   2: 连接时broker地址无效
 *   3: 未连接到MQTT代理
 *   4: topic为空或无效
 *   5: 操作执行失败
 *   6: 不支持的操作码
 * - connected (boolean): 连接状态，仅在查询状态时返回。
 * - h (string): broker地址，仅在查询状态时返回。
 * - p (number): broker端口，仅在查询状态时返回。
 * - c (string): client_id，仅在查询状态时返回。
 * - sc (number): 订阅数量，仅在查询状态时返回。
 * 
 * @module MQTT Proxy MQTT代理模块
 * @var mqttProxy
 * @category network
 * @keywords MQTT,代理,物联网,发布,订阅,消息,broker
 * @capabilities connect,disconnect,publish,subscribe,unsubscribe,getStatus
 * @depends 无
 */

let mqttProxyType = 65514;
let mqttProxyDefId = 20;

var mqttProxy = {
    /**
     * 连接到MQTT Broker。
     * 
     * @param {string} host - MQTT Broker地址，必传。例如 "broker.example.com"。
     * @param {number} port - MQTT Broker端口，必传。例如 1883。
     * @param {string|undefined} clientId - Client ID，可选，默认为自动生成 "stm32_mqtt_<timestamp>"。
     * @param {string|undefined} username - 用户名，可选。
     * @param {string|undefined} password - 密码，可选。
     * @param {number|undefined} keepalive - Keepalive间隔(秒)，可选，默认60。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数，2 broker地址无效。
     * 
     * @example
     * // 基础连接
     * let rst = mqttProxy.connect("broker.example.com", 1883);
     * if(rst.code == 0) console.log("连接成功")
     * 
     * @example
     * // 带认证的连接
     * let rst = mqttProxy.connect("broker.example.com", 1883, "client_001", "user", "pass", 60);
     */
    connect: function (host, port, clientId, username, password, keepalive) {
        var args = { '_fn': mqttProxyDefId, 'ty': mqttProxyType, 'op': 1, 'h': host, 'p': port };
        if (typeof clientId !== 'undefined') {
            args['c'] = clientId;
        }
        if (typeof username !== 'undefined') {
            args['u'] = username;
        }
        if (typeof password !== 'undefined') {
            args['w'] = password;
        }
        if (typeof keepalive !== 'undefined') {
            args['k'] = keepalive;
        }
        return jm.s(args);
    },

    /**
     * 断开MQTT连接。
     * 
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数。
     * 
     * @example
     * mqttProxy.disconnect();
     */
    disconnect: function () {
        return jm.s({ '_fn': mqttProxyDefId, 'ty': mqttProxyType, 'op': 2 });
    },

    /**
     * 发布消息到指定主题。
     * 
     * @param {string} topic - 主题名称，必传。
     * @param {string|undefined} payload - 消息内容，可选，默认为空字符串。
     * @param {number|undefined} qos - QoS等级，可选，默认0。可选值：0, 1, 2。
     * @param {number|undefined} retained - 是否保留消息，可选，默认0。0: 不保留, 1: 保留。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，3 未连接，4 topic无效，5 发布失败。
     * 
     * @example
     * // 发布消息
     * let rst = mqttProxy.publish("sensor/temp", "25.5");
     * if(rst.code == 0) console.log("发布成功")
     * 
     * @example
     * // 发布保留消息 QoS=1
     * let rst = mqttProxy.publish("device/status", "online", 1, 1);
     */
    publish: function (topic, payload, qos, retained) {
        var args = { '_fn': mqttProxyDefId, 'ty': mqttProxyType, 'op': 3, 't': topic };
        if (typeof payload !== 'undefined') {
            args['d'] = payload;
        }
        if (typeof qos !== 'undefined') {
            args['q'] = qos;
        }
        if (typeof retained !== 'undefined') {
            args['r'] = retained;
        }
        return jm.s(args);
    },

    /**
     * 订阅指定主题。
     * 
     * @param {string} topic - 主题名称，必传。支持通配符 + 和 #。
     * @param {number|undefined} qos - QoS等级，可选，默认0。可选值：0, 1。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，3 未连接，4 topic无效，5 订阅失败。
     * 
     * @example
     * // 订阅单个主题
     * let rst = mqttProxy.subscribe("sensor/temp");
     * if(rst.code == 0) console.log("订阅成功")
     * 
     * @example
     * // 订阅通配符主题 QoS=1
     * let rst = mqttProxy.subscribe("sensor/#", 1);
     */
    subscribe: function (topic, qos) {
        var args = { '_fn': mqttProxyDefId, 'ty': mqttProxyType, 'op': 4, 't': topic };
        if (typeof qos !== 'undefined') {
            args['q'] = qos;
        }
        return jm.s(args);
    },

    /**
     * 取消订阅指定主题。
     * 
     * @param {string} topic - 主题名称，必传。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，3 未连接，4 topic无效，5 取消订阅失败。
     * 
     * @example
     * mqttProxy.unsubscribe("sensor/temp");
     */
    unsubscribe: function (topic) {
        return jm.s({ '_fn': mqttProxyDefId, 'ty': mqttProxyType, 'op': 5, 't': topic });
    },

    /**
     * 查询当前MQTT连接状态和配置信息。
     * 
     * @returns {object|null} 返回状态信息对象，失败时返回 null：
     *   - connected (boolean): 是否已连接。
     *   - h (string): 当前broker地址。
     *   - p (number): 当前broker端口。
     *   - c (string): 当前client_id。
     *   - sc (number): 当前订阅数量。
     * 
     * @example
     * let status = mqttProxy.getStatus();
     * if(status && status.connected) {
     *     console.log("已连接到:", status.h + ":" + status.p);
     *     console.log("Client ID:", status.c);
     *     console.log("订阅数:", status.sc);
     * }
     * 
     * @async
     */
    getStatus: function () {
        var rst = jm.s({ '_fn': mqttProxyDefId, 'ty': mqttProxyType, 'op': 6 });
        return rst && rst.code === 0 ? {
            connected: rst.connected || false,
            h: rst.h || '',
            p: rst.p || 0,
            c: rst.c || '',
            sc: rst.sc || 0
        } : null;
    }
};

// exports = mqttProxy;
// module.exports = mqttProxy;

//module.exports = mqttProxy;
