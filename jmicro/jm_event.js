/**
 * 事件模块
 * 提供系统级与用户级事件的注册、注销与分发机制，
 * 支持 GPIO 按键、WiFi、网络、音频、红外、语音、串口等多种事件源。
 * 通过事件驱动方式解耦业务逻辑与硬件行为，适用于复杂嵌入式应用开发。
 * 所有事件通过 `jm.e` 与底层运行时交互。
 * 使用时方法名称前一定要带上 event. 前缀
 *
 * @module 事件操作接口
 * @var event
 * @category system
 * @keywords 事件系统,事件分发,事件监听,回调,系统事件,按键事件,WiFi事件,网络事件,音频事件,红外事件,语音事件
 * @capabilities post,regEvent,unregEvent
 * @depends 无
 */

var event = {
	
    /**
     * 分发事件
     * 
     * @param {number} type - 事件类型。
     * @param {Object} evt - 事件对象，一般有subType, data, ec这些字段，也可以全没有，视具体事件类型而定。
     * @returns {Object} - 返回底层方法 `jm.e` 的执行结果。
     * 
     * @example
     * event.post(event.JM_TASK_APP_KEY, { subType: 1, data: 2 });
     */
    post: function(type, evt) {
        // 如果事件对象没有 subType，则设置为默认值 0
        if (!evt.subType) {
            evt.subType = 0;
        }
        // 调用底层方法分发事件
        return jm.e(3, type, evt);
    },

    /**
     * 注册事件监听器
     * 
     * @param {number} type - 事件类型。
     * @param {Function} func - 事件触发时的回调函数，带一个参数，即post方法的evt参数的全部内容。
     * @returns {Object} - 返回一个对象，包含以下属性：
     *   - code: 状态码（100 表示回调函数为空）。
     *   - msg: 状态信息。
     * 
     * @example
     * event.regEvent(event.JM_TASK_APP_KEY, function(evt) {
     *     console.log('按键事件触发:', evt);
     * });
     */
    regEvent: function(type, func) {
        // 检查回调函数是否为空
        if (!func) {
            return { code: 100, msg: 'callback null' };
        }
        // 调用底层方法注册事件监听器
        return jm.e(1, type, func);
    },

    /**
     * 取消注册事件监听器
     * 
     * @param {number} type - 事件类型。
     * @param {Function} func - 要取消注册的回调函数。
     * @returns {Object} - 返回一个对象，包含以下属性：
     *   - code: 状态码（101 表示回调函数为空）。
     *   - msg: 状态信息。
     * 
     * @example
     * event.unregEvent(event.JM_TASK_APP_KEY, callbackFunc);
     */
    unregEvent: function(type, func) {
        // 检查回调函数是否为空
        if (!func) {
            return { code: 101, msg: 'callback null' };
        }
        // 调用底层方法取消注册事件监听器
        return jm.e(2, type, func);
    },

    // 与设备GPIO一起编码的虚拟按键 S380开发板上的5键键盘码值
    BUTTON_UP: 251,    // 上键
    BUTTON_DOWN: 252,  // 下键
    BUTTON_OK: 253,    // 确认键
    BUTTON_RIGHT: 254, // 右键
    BUTTON_LEFT: 255,  // 左键

    // 系统任务事件类型码,post,regEvent,unregEvent的第一个参数
    JM_TASK_APP_MAINLOOP: 1,          // 主循环任务
    JM_TASK_APP_RX_DATA: 2,           // 接收数据任务
    JM_TASK_APP_CHECKER: 3,           // 检查任务
    JM_TASK_APP_IR_DATA: 4,           // 红外数据任务
    JM_TASK_APP_MAIN_CHECK: 5,        // 主检查任务
    JM_TASK_APP_OLED_DATA: 6,         // 更新屏幕温湿度信息
    JM_TASK_APP_WIFI_GOT_IP: 7,       // WiFi获取IP事件
    JM_TASK_APP_WIFI_DISCONN: 8,      // WiFi断开事件
    JM_TASK_APP_DNS_GO_IP: 9,         // DNS获取IP事件
    JM_TASK_APP_RESTART_SYSTEM: 10,   // 系统重启事件
    JM_TASK_APP_SAVE_CFG: 11,         // 保存配置事件
    JM_TASK_APP_GPTCHAT_RECORD_START: 12, // GPT聊天录音开始
    JM_TASK_APP_GPTCHAT_RECORD_END: 13,   // GPT聊天录音结束
    JM_TASK_APP_AUDIO_PLAY: 14,           // 音频播放事件
    JM_TASK_APP_SCREEN_ONOFF: 15,         // 屏幕开关事件
    JM_TASK_APP_IR_SEND: 16,              // 发送红外命令
    JM_TASK_APP_IR_RECV: 17,              // 接收红外命令
    JM_TASK_APP_SPEECH_CMD: 18,           // 语音命令事件
    JM_TASK_APP_DEV_CHANGE: 19,           // 设备信息更新事件
    JM_TASK_APP_ESP_NOW_REQ: 20,          // ESP-NOW请求事件
    JM_TASK_APP_PS_MSG_REQ: 21,           // 异步消息请求事件
    JM_TASK_APP_PS_MSG_RESP: 22,          // 异步消息响应事件
    JM_TASK_APP_LOGIN_RESULT: 23,         // 账号登录结果事件
    JM_TASK_APP_TCP: 24,                  // TCP事件（连接和断开）
    JM_TASK_APP_UDP: 25,                  // UDP事件（UDP创建成功）
    JM_TASK_APP_WIFI: 26,                 // WiFi相关命令事件
    JM_TASK_APP_ML: 27,                   // ML事件处理
    JM_TASK_APP_KEY: 28,                  // 按键事件（subType为GPIO编号，data为按击次数）
    JM_TASK_APP_NETPROXY: 29,             // 网络代理事件
    JM_TASK_APP_SERIAL: 30,               // 串口命令事件
    JM_TASK_APP_PROXY_TCP: 31,            // 代理TCP事件
    JM_TASK_APP_PROXY_WRITE_UART: 32,     // 代理写串口事件
    JM_TASK_APP_CFG_BTN: 33,              // 配置信息事件
    JM_TASK_APP_BTN: 34,                  // 模拟按键事件
    JM_TASK_APP_MUSIC: 35,                // 音乐播放器事件
    JM_TASK_APP_SPEECH: 36,               // 语音系统事件
    JM_TASK_APP_AUDIO_VOLUME: 37,         // 麦克风音量更新事件
    JM_TASK_APP_FINISH_LOAD_CMD: 38,      // 完成从服务器加载语音命令事件
    JM_TASK_APP_CTRL_EVENT: 39,           // 应用控制事件
    JM_TASK_APP_ON_MSG: 40,               // 应用控制事件

    // 事件标志，
    JM_APP_EVENT_SUC: 0,                  // 成功事件（具体由事件实现者定义）
	
	//如下标题位evt中的flag字段位值，指定参数中data字段的类型，用于低层解析数据，在JS层面无需处理，也不用管，可以直接传０或不传即可
    JM_EVENT_FLAG_DEFAULT: 0,             // 默认事件标志
    JM_EVENT_FLAG_FREE_DATA: 0x01,        // 释放data占用内存
    JM_EVENT_FLAG_FREE_EMAP: 0x02,        // 释放jm_emap_t占用内存
    JM_EVENT_FLAG_FREE_ELIST: 0x04,       // 释放jm_elist_t占用内存
    JM_EVENT_FLAG_FREE_STR: 0x08,         // 释放char占用内存
    JM_EVENT_FLAG_FREE_MSG: 0x10          ,// 释放jm_msg_t占用内存
	
	//以下值为特定事件常量，存在在在post方法参数evt对象内，名称为ec
	JM_EVENT_CODE_ASR: 1,  //语音
	JM_EVENT_CODE_IR: 2,  //红外遥控
	JM_EVENT_CODE_KEY: 3,  //物理按键
	JM_EVENT_CODE_OTHER: 4,  //其它
	JM_EVENT_CODE_MQ: 5,  //MQ传感器
	JM_EVENT_CODE_RAIN: 6,  //雨量传感器
	JM_EVENT_CODE_FIRE: 7,  //火焰传感器
	JM_EVENT_CODE_INT: 8,  //雨量传感器
	JM_EVENT_CODE_Ultrasound: 9,  //超声波
};

// 导出模块
// exports = event;
