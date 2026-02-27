/**
 * 角色model
 * {
 *     "_id": 252320599,
 *     "clazz": "com.qpp.cgp.domain.common.taxswitch.AreaTaxSwitch",
 *     "createdDate": 1741831063241,
 *     "createdBy": "420092",
 *     "modifiedDate": 1741831063245,
 *     "countryCode": "XI",
 *     "applicationMode": "Stage",
 *     "close": true
 * }
 */
Ext.define('CGP.qpmn_tax_switch.model.TaxSwitchConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'int',
        useNull: true
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.common.taxswitch.AreaTaxSwitch'
    }, {
        name: 'countryCode',
        type: 'string'
    }, {//环境
        name: 'applicationMode',
        type: 'string',
    }, {//是否关闭计税
        name: 'close',
        type: 'boolean'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/areaTaxSwitchs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});