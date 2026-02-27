
Ext.define("CGP.threedmodelconfig.model.AssetModel",{
	extend : 'Ext.data.Model',
	fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
	    name: 'useTransparentMaterial',
        type: 'boolean'
    },{
	    name: 'index',
        type: 'int'
    },{
	    'name': 'type',
        type: 'string'
    },{
	    name: 'defaultImage',
        type: 'string'
    },{
	    name: 'clazz',
        type: 'string'
    }]
});
