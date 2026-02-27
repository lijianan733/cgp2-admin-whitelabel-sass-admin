
Ext.define("CGP.bommaterialattribute.model.Attribute",{
	extend : 'Ext.data.Model',
	
	fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    },  'code', 'name', {
        name: 'required',
        type: 'boolean'
    }, 'validationExp', 'valueType', {
        name: 'valueDefault',
        type: 'string'
    }, {
        name: 'selectType',
        type: 'string'
    }, {
        name: 'options',
        type: 'array',
        serialize: function (value) {
            if(Ext.isEmpty(value)){
            	return [];
            }
            return value;
        }
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/bom/schema/attributes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
