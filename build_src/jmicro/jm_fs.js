/**
 * Flash 文件系统模块
 * 提供基于设备 Flash 的文件操作能力，支持文件的创建、读取、写入、删除及随机访问。
 * 适用于保存配置文件、日志数据、动作脚本、缓存数据等需要掉电保留的信息。
 * 所有操作通过 `jm.s` 下发指令并由设备端执行。
 * 使用时方法名称前一定要带上 fs. 前缀
 *
 * @module Flash文件操作接口
 * @var fs
 * @category storage
 * @keywords Flash,文件系统,文件读写,文件大小,文件是否存在,文件删除,随机读写,配置存储,日志存储
 * @capabilities fileSize,writeFile,readFile,existsFile,delFile,writeFileFromPos,readFileFromPos
 * @depends 无
 */


var fs = {

	/**
	 * 文件大小
	 */
	fileSize: function(fileName) {
	    let rst = jm.s({ op: 60, f:fileName});
		return rst && rst.v ? rst.v:0;
	},
	
	/**
	 * 写字符串内容到文件
	 */
	writeFile: function(fileName, strData) {
	    let rst = jm.s({ op: 61, f:fileName, d:strData});
		return rst && rst.c == 0
	},
	
	/**
	 * 写字符串内容到文件
	 */
	readFile: function(fileName) {
	    let rst = jm.s({ op: 62, f:fileName});
		return rst && rst.c == 0 ? rst.d : null
	},
	
	/**
	 * 写字符串内容到文件
	 */
	existsFile: function(fileName) {
	    let rst = jm.s({ op: 63, f:fileName});
		return rst && rst.c == 0
	},
	
	/**
	 * 删除文件
	 */
	delFile: function(fileName) {
	    let rst = jm.s({ op: 64, f:fileName});
		return rst && rst.c == 0
	},
	
	/**
	 * 从指定的位置pos写字符串内容到文件
	 */
	writeFileFromPos: function(fileName, strData, pos) {
	    let rst = jm.s({ op: 65, f:fileName,
		   d:strData, p:pos, s:strData.length});
		return rst && rst.c == 0
	},
	
	/**
	 * 从文件pos位置读size个字符
	*/
	readFileFromPos: function(fileName, pos, size) {
	    let rst = jm.s({ op: 66, f:fileName, p:pos, s:size});
		return rst && rst.c == 0 ? rst.d : null
	},

};

// 导出模块
// exports = rlog;

module.exports = fs;
