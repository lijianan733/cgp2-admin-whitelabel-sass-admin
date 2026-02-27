/**
 * Created by nan on 2020/11/17
 */
Ext.define("CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.model.FontModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        }, {
            name: 'fontFamily',
            type: 'string'
        }, {
            name: 'displayName',
            type: 'string'
        }, {
            name: 'wordRegExp',
            type: 'string'
        }, {
            name: 'fontStyleKeys',
            type: 'array',
            serialize: function (value) {
                if (Ext.isEmpty(value)) {
                    return [];
                }
                return value;
            }
        }, {
            name: 'languages',
            type: 'array',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    return [];
                } else {
                    return value.map(function (item) {
                        return item.name;
                    })
                }
            }
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.common.font.Font'
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/font',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
