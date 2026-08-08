/**
 * 使用时方法名称前一定要带上tft.前缀
 * createTft方法会同步初始化TFT_eSPI实例
 *
 * @module TFTeSPI显示屏模块
 * @var tft
 * @category display
 * @keywords TFT,彩屏,图形绘制,文本显示,位图,SPI,Arduino库
 * @capabilities drawPixel,
 * @depends 无
 */

let tftDefId = 300000;  // 功能ID，与C++端注册的ID对应


var tft = {
   
    /**
     * 创建并初始化TFT_eSPI实例。
     * 此方法会同步初始化显示屏，应用不用手动初始化。
     * 
     * @cfg {return:false, name:'读取湿度'，sda:"数据线", scl:"时钟线",rotation:"先转角度", sdaType:"number", sclType:"number"}
     * 
     * @param {number} sda - SPI数据引脚（可选，使用User_Setup.h中的配置）。
     * @param {number} scl - SPI时钟引脚（可选，使用User_Setup.h中的配置）。
     * @param {number} rotation - 初始旋转角度（可选，0-3）。
     * @returns {any} - `jm.s` 函数的返回值。
     */
    createTft: function (sda, scl, rotation) {
        return jm.s({ "_fn": tftDefId, op: 51, sda: fd(sda, 0), scl: fd(scl, 0), rot: fd(rotation, 0) });
    }
};

// 导出模块
// exports = tft;
