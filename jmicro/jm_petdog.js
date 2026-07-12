
/**
 * 机器狗控制模块
 * 提供机器狗的高层行为控制与关节角度调节能力，
 * 封装底层舵机与动作序列细节，适用于快速实现机器人交互与控制。
 * 支持行走、转向、姿态切换、单腿控制及平滑角度变换等常见机器狗动作。
 * 所有动作通过 `jm.s` 下发指令并由设备端执行。
 * 使用时方法名称前一定要带上 petdog. 前缀
 *
 * @module 机器狗控制接口
 * @var petdog
 * @category actuator
 * @keywords 机器狗,四足机器人,动作控制,舵机角度,姿态切换,平滑运动,机器人行为
 * @capabilities walkFront,sleep,stand,sitdown,walkBack,turnLeft,turnRight,wave,stop,stretch,stretch2,scratching,setLeftFrontAngle,setRightFrontAngle,setLeftBackAngle,setRightBackAngle,setAngle,lineToAngle
 * @depends 无
 */
 
 const ptDefId = 58
 
var petdog = {

    /**
     * 内部方法：发送动作指令到机器狗设备
     * @private
     * @param {Object} act - 要执行的动作对象
     * @returns {Object} 返回通过jm.s方法封装的动作指令
     */
    _act: function (act) {
        return jm.s({ "_fn": ptDefId, "act": act });
    },

    /**
     * 控制机器狗向前行走
     */
    walkFront: function () {
        return petdog._act(0);
    },
    
    /**
     * 控制机器狗进入睡眠状态
     */
    sleep: function () {
        return petdog._act(1);
    },
    
    /**
     * 控制机器狗站立
     */
    stand: function () {
        return petdog._act(2);
    },
    
    /**
     * 控制机器狗坐下
     */
    sitdown: function () {
        return petdog._act(3);
    },
    
    /**
     * 控制机器狗向后行走
     */
    walkBack: function () {
        return petdog._act(4);
    },
    
    /**
     * 控制机器狗向左转
     */
    turnLeft: function () {
        return petdog._act(5);
    },
    
    /**
     * 控制机器狗向右转
     */
    turnRight: function () {
        return petdog._act(6);
    },
    
    /**
     * 控制机器狗挥手
     */
    wave: function () {
        return petdog._act(7);
    },
    
    /**
     * 停止机器狗当前动作
     */
    stop: function () {
        return petdog._act(8);
    },
    
    /**
     * 控制机器狗做伸展动作1
     */
    stretch: function () {
        return petdog._act(9);
    },
    
    /**
     * 控制机器狗做伸展动作2
     */
    stretch2: function () {
        return petdog._act(10);
    },
    
    /**
     * 控制机器狗做抓痒动作
     */
    scratching: function () {
        return petdog._act(11);
    },
	
	/**
	 * 左前脚角度
	 * @param {Object} angle 角度，在0~180之间
	 */
	setLeftFrontAngle: function (angle) {
	   return jm.s({ "_fn": ptDefId, "act": 20, "a": angle});
	},
	
	/**
	 * 右前脚角度
	 * @param {Object} angle 角度，在0~180之间
	 */
	setRightFrontAngle: function (angle) {
	   return jm.s({ "_fn": ptDefId, "act": 21, "a": angle});
	},
	
	/**
	 * 左后脚角度
	 * @param {Object} angle 角度，在0~180之间
	 */
	setLeftBackAngle: function (angle) {
	   return jm.s({ "_fn": ptDefId, "act": 22, "a": angle});
	},
	
	/**
	 * 左前脚角度
	 * @param {Object} angle 角度，在0~180之间
	 */
	setRightBackAngle: function (angle) {
	   return jm.s({ "_fn": ptDefId, "act": 23, "a": angle});
	},
	
	/**
	 * 设备机器狗一个恣状
	 * @param {Object} leftFrontAngle 左前脚角度
	 * @param {Object} rightFrontAngle 右前脚角度
	 * @param {Object} leftBackAngle 左后脚角度
	 * @param {Object} rightBackAngle 右后脚角度
	 * @param {Object} speed 速度
	 */
	setAngle:function (leftFrontAngle,
		rightFrontAngle,leftBackAngle, rightBackAngle,speed
	) {
	   return jm.s({ "_fn": ptDefId, "act": 24, 
	   "lf": leftFrontAngle, "rf": rightFrontAngle,
	   "lb": leftBackAngle, "rb": rightBackAngle, "s":speed});
	},
	
	/**
	 * 分为多个步骤变换到目标角度
	 * @param {Object} leftFrontAngle 左前脚角度
	 * @param {Object} rightFrontAngle 右前脚角度
	 * @param {Object} leftBackAngle 左后脚角度
	 * @param {Object} rightBackAngle 右后脚角度
	 * @param {Object} speed 速度
	 */
	lineToAngle:function (leftFrontAngle,
		rightFrontAngle,leftBackAngle, rightBackAngle,speed
	) {
	   return jm.s({ "_fn": ptDefId, "act": 25, 
	   "lf": leftFrontAngle, "rf": rightFrontAngle,
	   "lb": leftBackAngle, "rb": rightBackAngle, "s":speed});
	}
};                                          

// 如果需要导出该对象，可以取消下面的注释
//export default petdog;
