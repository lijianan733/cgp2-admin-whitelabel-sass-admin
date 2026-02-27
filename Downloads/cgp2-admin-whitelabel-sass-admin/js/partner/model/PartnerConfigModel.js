Ext.define('CGP.partner.model.PartnerConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'title',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'key',
        type: 'string'
    }, {
        name: 'value',
        type: 'string'
    }, {
        name: 'groupId',
        type: 'int'
    }, {
        name: 'websiteId',
        type: 'int'
    }, {
        name: 'sortOrder',
        type: 'int'
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.common.Configuration'
    }



//	,{
//		name: 'ConfigurationGroup_id',
//		type: 'int'
//	}
    ]
});










