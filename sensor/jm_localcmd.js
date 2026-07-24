/**
 * 本地语音命令管理模块
 * 
 * 本模块提供了查询和注册本地语音命令的 JS API，基于 LocalCommandManager 底层 C 接口实现。
 * 支持查看所有已注册命令、带 ID 注册命令、不带 ID 自动生成命令 ID 等功能。
 * 
 * 命令 ID 分配规则：
 * - 设备端固定保留 0-199 给系统命令使用
 * - 动态命令从 200 开始递减分配（199, 198, ...）
 * - 通过 op=2 注册时可指定 cmdId
 * - 通过 op=3 注册时自动生成可用 cmdId
 * 
 * 所有方法返回值说明（统一字段）：
 * 返回值是一个对象，包含以下字段：
 * - code (number): 操作结果码，0 表示成功，非 0 表示失败。
 *   常见错误码：
 *   1: 缺少操作码(op)参数
 *   2: 内存不足
 *   3: 命令文本参数(c)缺失
 *   4: 命令文本为空
 *   5: op=2 时缺少 cmdId 参数
 *   6: cmdId 已被占用
 *   7: 没有可用的 cmdId
 *   8: 未知操作码
 * - data (Array): 查询类操作返回的命令列表，每条包含 id 和 text
 * - count (number): 命令总数
 * - cmdId (number): 注册成功时返回的命令 ID
 * - text (string): 注册成功时返回的命令文本
 * 
 * @module LocalCmd 本地语音命令管理模块
 * @var localCmd
 * @category speech
 * @keywords 语音命令,本地命令,ASR,语音识别,命令管理
 * @capabilities list,add
 * @depends 无
 */

let localCmdType = 65515;
let localCmdDefId = 20;

var localCmd = {
    // ================================================================
    //  API 方法
    // ================================================================

    /**
     * 查询所有已注册的语音命令。
     * 
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，1 缺少op参数。
     *                   - data: 命令列表，每条包含 id 和 text
     *                   - count: 命令总数
     * 
     * @example
     * let rst = localCmd.list();
     * if (rst.code === 0) {
     *     console.log("总命令数:", rst.count);
     *     rst.data.forEach(function(cmd) {
     *         console.log(cmd.id + ": " + cmd.text);
     *     });
     * }
     */
    list: function () {
        return jm.s({ '_fn': localCmdDefId, 'ty': localCmdType, 'op': 1 });
    },

    /**
     * 注册语音命令（带指定 cmdId）。
     * 如果 cmdId 已被占用，返回错误 code=6。
     * 
     * @param {string} text - 语音命令文本，必传。例如："打开卧室灯"
     * @param {number} cmdId - 命令 ID，必传。范围建议 200-65535，确保不与系统命令冲突。
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，3 缺少命令文本，4 文本无效，5 缺少cmdId，6 cmdId已存在。
     *                   - cmdId: 注册成功的命令 ID
     *                   - text: 注册成功的命令文本
     * 
     * @example
     * let rst = localCmd.add("打开客厅灯", 205);
     * if (rst.code === 0) {
     *     console.log("注册成功:", rst.cmdId, rst.text);
     * }
     */
    add: function (text, cmdId) {
        var args = { '_fn': localCmdDefId, 'ty': localCmdType, 'op': 2, 'c': text };
        if (typeof cmdId !== 'undefined') args['cmdId'] = cmdId;
        return jm.s(args);
    },

    /**
     * 注册语音命令（不带 cmdId，自动生成）。
     * 系统会自动从 200 开始递减分配一个未使用的 ID。
     * 
     * @param {string} text - 语音命令文本，必传。例如："关闭卧室灯"
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，3 缺少命令文本，4 文本无效，7 无可用ID。
     *                   - cmdId: 自动生成的命令 ID
     *                   - text: 注册成功的命令文本
     * 
     * @example
     * let rst = localCmd.add("关闭卧室灯");
     * if (rst.code === 0) {
     *     console.log("自动分配 ID:", rst.cmdId, "文本:", rst.text);
     * }
     */
    addAuto: function (text) {
        return jm.s({ '_fn': localCmdDefId, 'ty': localCmdType, 'op': 3, 'c': text });
    },

    /**
     * 批量注册语音命令（不带 cmdId，自动生成）。
     * 可一次性注册多条命令，系统会自动为每条命令分配独立 ID。
     * 
     * @param {string[]} texts - 语音命令文本数组，必传。例如：["打开客厅灯", "关闭卧室灯"]
     * @returns {object} 返回操作结果对象：
     *                   - code: 0 成功，3 缺少命令文本，4 文本无效，7 无可用ID。
     *                   - data: 注册结果数组，每条包含 cmdId 和 text
     *                   - count: 成功注册的数量
     * 
     * @example
     * let rst = localCmd.addBatch(["打开客厅灯", "关闭卧室灯", "打开空调"]);
     * if (rst.code === 0) {
     *     console.log("成功注册", rst.count, "条命令");
     *     rst.data.forEach(function(item) {
     *         console.log(item.cmdId + ": " + item.text);
     *     });
     * }
     */
    addBatch: function (texts) {
        if (!Array.isArray(texts) || texts.length === 0) {
            return { code: 3, msg: "texts array required" };
        }

        var results = [];
        var successCount = 0;
        
        for (var i = 0; i < texts.length; i++) {
            var text = texts[i];
            if (!text || typeof text !== 'string' || text.trim().length === 0) {
                continue;
            }
            
            var rst = jm.s({ '_fn': localCmdDefId, 'ty': localCmdType, 'op': 3, 'c': text.trim() });
            if (rst && rst.code === 0) {
                results.push({ cmdId: rst.cmdId, text: rst.text });
                successCount++;
            }
        }
        
        return { 
            code: successCount > 0 ? 0 : 7, 
            data: results, 
            count: successCount,
            msg: successCount > 0 ? "ok" : "no available cmdId"
        };
    }
};

// exports = localCmd;
// module.exports = localCmd;
