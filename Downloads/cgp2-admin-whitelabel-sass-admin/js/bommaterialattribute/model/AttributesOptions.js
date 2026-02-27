Ext.define("CGP.bommaterialattribute.model.AttributesOptions",{
	extend : 'Ext.data.Model',
	
	fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'sortOrder',
        type: 'int'
    }, 'name',"value"]
});