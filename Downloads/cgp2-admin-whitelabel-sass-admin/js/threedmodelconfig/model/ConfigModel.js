
Ext.define("CGP.threedmodelconfig.model.ConfigModel",{
	extend : 'Ext.data.Model',
    idProperty: '_id',
	fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'description',
        type: 'string'
    }, 'modelName',{
	    'name': 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.product.config.model.ThreeDModelConfig'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/threedmodelconfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
