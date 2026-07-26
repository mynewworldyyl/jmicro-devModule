 /**
  *  使用时方法名称前一定要带上ju.前缀
  * 
  * @module 通用工具模块
  * @var ju
  * @category utils
  * @keywords 工具,映射,map,数值转换,Arduino
  * @capabilities map
  * @depends 无
  */
 
var ju = {
	/**
	 * 与arduino map功能相同
	 * @param {number} value 
	 * @param {number} fromLow 
	 * @param {number} fromHigh 
	 * @param {number} toLow 
	 * @param {number} toHigh 
	 * @returns 
	 */
	map : function(value, fromLow, fromHigh, toLow, toHigh) {
	    return (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow;
	}
}
module.exports = ju;
