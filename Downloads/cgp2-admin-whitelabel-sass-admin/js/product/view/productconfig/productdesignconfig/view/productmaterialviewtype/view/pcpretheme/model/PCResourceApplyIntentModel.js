/**
 * Created by nan on 2021/10/15
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.model.PCResourceApplyIntentModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'code',
        type: 'string'
    }, {
        name: 'targetType',
        type: 'string'
    }, {
        name: 'availablePcResources',
        type: 'array'
    }, {
        name: 'diyDisplay',
        type: 'string',
        convert: function (value, record) {
            return record.get('name') + '(' + record.get('_id') + ')';
        }
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.theme.PcResourceApplyIntent'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcResourceApplyIntents',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})