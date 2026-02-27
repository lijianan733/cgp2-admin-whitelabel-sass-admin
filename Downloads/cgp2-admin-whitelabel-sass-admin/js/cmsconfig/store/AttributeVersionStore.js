/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.define('CGP.cmsconfig.store.AttributeVersionStore', {
    extend: 'Ext.data.Store',
    fields: [{
        name: '_id',
        type: 'number'
    }, {
        name: 'status',//'DRAFT', 'TEST', 'RELEASE'
        type: 'string'
    }, {
        name: 'version',
        type: 'string'
    }, {
        name: 'remark',
        type: 'string'
    },
        {
            name: 'bomCompatibilityIds',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            convert: function () {
                return 'com.qpp.cgp.domain.product.attribute.VersionedProductAttribute'
            }
        }],
    pageSize: 1000,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/versionProductAttributes',
        reader: {
            idProperty: '_id',
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    sorters: [{
        property: '_id',
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