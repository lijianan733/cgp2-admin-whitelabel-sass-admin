/**
 * pagecontentschema model
 */
Ext.define('CGP.attributesets.model.Attributesets',{
	extend : 'Ext.data.Model',
    /**
     * @cfg {Object[]} fields
     * field配置
     */
	fields : [ {
		name : 'id',
		type : 'int',
		useNull: true
	},{
		name:'name',
		type:'string'
	},{
		name:'description', 
		type:'string'
	}, {
        name: 'attributeSetToAttributes',
        type: 'array',
        serialize: function (value) {
            if(Ext.isEmpty(value)){
            	return [];
            }
            return value;
        }		        
    }],
    /**
     * @cfg {Ext.data.Proxy} proxy
     * model proxy
     */
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/bom/schema/attributeSets',
		reader:{
			type:'json',
			root:'data'
		}
	}
});

