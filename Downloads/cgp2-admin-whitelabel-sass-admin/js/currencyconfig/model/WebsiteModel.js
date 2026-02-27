/**
 * @author xiu
 * @date 2024/12/31
 */
Ext.define('CGP.currencyconfig.model.WebsiteModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'string',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.common.platform.Platform'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'defaultCurrency',
            type: 'string',
        },
        {
            name: 'mode',
            type: 'string',
        },
        {
            name: 'displayField',
            type: 'string',
            convert: function (value, record) {
                var name = record.get('name'),
                    mode = record.get('mode'),
                    modeGather = {
                        Stage: 'Stage',
                        Production: 'Release'
                    }
                    
                return `${name} (${modeGather[mode]})`
            }
        },
        {
            name: 'description',
            type: 'string',
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/platform',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})