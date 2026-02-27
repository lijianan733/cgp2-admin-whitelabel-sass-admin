/**
 * currency model
 */
Ext.define('CGP.partnerapplys.model.partnerApplys',{
	extend : 'Ext.data.Model',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
	fields : [ {
		name : 'id',
		type : 'Long',
		useNull: true
	},{
		name:'name',
		type:'string'
	},{
		name:'email', // 邮箱
		type:'string'
	},{
		name:'password', //密码
		type:'string'
	},{
		name:'contactor', // 联系人
		type:'string'
	},{
		name:'telephone', // 联系号码
		type:'string'
	},{
		name:'websiteId', // 网站id
		type:'Long'
	},{
		name:'websiteName', //网站名称
		type:'string'
	},{
		name:'status',     //审核状态
		type:'string'
	},{
		name:'remark',      //回复理由
		type:'string'
	}
	,{
		name:'modifiedBy',      //修改人
		type:'string'
	},{
		name:'modifiedDate',      //修改日期
		type:'string'
	}
	
	
	],
    /**
     * @cfg {Ext.data.Proxy} proxy
     * model proxy
     */
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/partnerApplys',
		reader:{
			type:'json',
			root:'data'
		}
	}
});