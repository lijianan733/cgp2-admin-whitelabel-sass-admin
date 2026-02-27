/**
 * @author xiu
 * @date 2025/7/31
 */
Ext.define('CGP.websiteproductlist.store.ProductVersionStore', {
    extend: 'Ext.data.Store',
    fields: [{
        name: '_id',
        type: 'number'
    }, {
        name: 'status',//'DRAFT', 'TEST', 'RELEASE'
        type: 'string'
    }, {
        name: 'version',
        type: 'number'
    }, {
        name: 'remark',
        type: 'string'
    },
        {
            name: 'bomCompatibilityIds',
            type: 'string'
        },
        {
            name: 'product',
            type: 'object'
        },
        {
            name: 'clazz',
            type: 'string',
            convert: function () {
                return 'com.qpp.cgp.domain.product.attribute.VersionedProductAttribute'
            }
        },
        {
            name: 'productDefaultSettingForStore',
            type: 'object'
        },
        {
            name: 'settingId',
            type: 'boolean',
            convert: function (value, record) {
                var productDefaultSettingForStore = record.get('productDefaultSettingForStore');

                return productDefaultSettingForStore ? productDefaultSettingForStore['_id'] : '';
            }
        },
        {
            name: 'isActived',
            type: 'boolean',
            convert: function (value, record) {
                var productDefaultSettingForStore = record.get('productDefaultSettingForStore');

                return productDefaultSettingForStore ? productDefaultSettingForStore['isActived'] : false;
            }
        },
        {
            name: 'isRelease',
            type: 'boolean',
            convert: function (value, record) {
                var productDefaultSettingForStore = record.get('productDefaultSettingForStore');

                return productDefaultSettingForStore ? productDefaultSettingForStore['isRelease'] : false;
            }
        },
        {
            name: 'configVersion',
            type: 'number',
            convert: function (value, record) {
                var productDefaultSettingForStore = record.get('productDefaultSettingForStore');

                return productDefaultSettingForStore ? productDefaultSettingForStore['version'] : 0;
            }
        },
    ],
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/store-settings/versionAttribute-view',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    sorters: [{
        property: 'version',
        direction: 'DESC'
    }],
    constructor: function (config) {
        var me = this;
        if (config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})