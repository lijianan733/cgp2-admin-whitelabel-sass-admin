/**
 * 网站管理的model
 */
Ext.define('CGP.partner.model.CurrencyModel',{
	extend : 'Ext.data.Model',
	idProperty : 'id',
	fields : [{
		name : 'id',
		type : 'int',
		useNull: true
	},{
		name:'title',
		type:'string'
	},{
		name:'code', // 货币代码
		type:'string'
	},{
		name:'symbolLeft', //用户密码
		type:'string'
	},{
		name:'symbolRight', // 昵称
		type:'string'
	},{
		name:'decimalPoint', // 小数点
		type:'string'
	},{
		name:'decimalPlaces', // 小数点
		type:'string'
	},{
		name:'thousandsPoint', //千分数
		type:'string'
	},{
		name:'value',   //与默认货币的兑换比率
		type:'float'
	},{
		name: 'website', //网站id
		type: 'object'
	}]
});
