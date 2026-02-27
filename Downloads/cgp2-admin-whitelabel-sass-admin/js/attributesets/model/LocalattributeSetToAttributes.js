Ext.define("CGP.attributesets.model.LocalattributeSetToAttributes",{
	extend : 'Ext.data.Model',
	
	fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'sortOrder',
        type: 'int'
    }, {
        name: 'attributeid',
        type: 'int',
    }, "defaultValue",
    {
        name: 'attribute',
        type: 'object',
        serialize: function (value) {
            if(Ext.isEmpty(value)){
            	return {};
            }
            return value;
        }		        
    }
	
	
	
	]
});