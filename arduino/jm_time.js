/**
 * 本模块提供了与 Arduino 时间相关 API 类似的 JavaScript 接口，用于模拟 Arduino 中处理时间的功能。
 * 这些接口允许开发者在 JavaScript 环境中实现延迟操作、获取经过的时间等功能，其功能参考了 Arduino 的时间 API 文档。
 * 
 * 相关 Arduino 时间 API 文档链接：
 * https://docs.arduino.cc/language-reference/?_gl=1*tcfhse*_up*MQ..*_ga*MTUwNjIzOTk3Mi4xNzM0NjkxNDM3*_ga_NEXN8H46L5*MTczNDY5ODkzNS4yLjAuMTczNDY5ODkzNS4wLjAuMTAzODkzOTIx
 * 
 * 模块中包含以下几个主要方法：
 * - delay: 使程序暂停指定的毫秒数。
 * - delayMicroseconds: 使程序暂停指定的微秒数。
 * - micros: 返回自程序开始运行以来经过的微秒数。
 * - millis: 返回自程序开始运行以来经过的毫秒数。
 * 使用时方法名称前一定要带上time.前缀
 * 
 * @module 时间操作模块
 * @var time
 * @category system
 * @keywords 时间,延时,毫秒,微秒,时间戳,delay,delayMicroseconds,micros,millis,timestamp,Arduino
 * @capabilities delay,delayMicroseconds,micros,millis,timestamp
 * @depends 无
 */


var time = {
    /**
     * 使程序暂停指定的毫秒数。
     * 
     * 在延时期间，程序无法执行其他任务，直到延时结束。
     * 
     * 返回值说明：该方法无返回值（void）
     * 
     * @param {number} ms - 要暂停的毫秒数，应为非负整数。
     * @returns {void} 无返回值
     * 
     * @example
     * // 延时 1 秒
     * delay(1000);
     * 
     * // 延时 500 毫秒
     * delay(500);
     */
    delay: function (ms) {
        return jm.delay(ms);
    },

    /**
     * 使程序暂停指定的微秒数。
     * 
     * 该函数用于精确控制短时间的延时。
     * 
     * 返回值说明：该方法无返回值（void）
     * 
     * @param {number} us - 要暂停的微秒数，应为非负整数。
     * @returns {void} 无返回值
     * 
     * @example
     * // 延时 10 微秒
     * delayMicroseconds(10);
     * 
     * // 产生 1kHz 方波信号
     * // 高电平 500微秒，低电平 500微秒
     * while (true) {
     *     gpio.writeDigit(13, gpio.HIGH);
     *     delayMicroseconds(500);
     *     gpio.writeDigit(13, gpio.LOW);
     *     delayMicroseconds(500);
     * }
     */
    delayMicroseconds: function (us) {
        return jm.s({ op: 19, us });
    },

    /**
     * 返回自程序开始运行以来经过的微秒数。
     * 
     * 该值在大约 70 分钟后会溢出（即重新从 0 开始计数）。
     * 
     * @returns {number} - 自程序开始运行以来经过的微秒数，为非负整数。
     */
    micros: function () {
        return jm.s({ op: 20 });
    },

    /**
     * 返回自程序开始运行以来经过的毫秒数。
     * 
     * 该值在大约 50 天后会溢出（即重新从 0 开始计数）。
     * 
     * @returns {number} - 自程序开始运行以来经过的毫秒数，为非负整数。
     */
    millis: function () {
        return jm.s({ op: 21 });
    },
	
	/**
     * 北京时间对应的时间戳，1970看1月1号0时0分0秒开始以来的秒数
	 * 以秒为单位的时间戳，要注意，单位是秒，不是通常我们用的毫秒。 
	 * @returns {number}。
	 */
	timestamp: function () {
	    return jm.s({ op: 80 });
	}
};

//exports = time
