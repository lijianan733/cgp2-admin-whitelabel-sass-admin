
Ext.define("CGP.buildermanage.model.ConfigModel",{
	extend : 'Ext.data.Model',
    idProperty: '_id',
	fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'description',
        type: 'string'
    }, {name: 'builderVersion',type: 'string'},'builderName',{
	    'name': 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.product.config.v2.builder.SystemBuilderConfigV2'
    }, {//说明使用哪些版本的导航和builder配置
        name: 'schemaVersion',
        type: 'object'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/systemBuilderConfigsV2',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
