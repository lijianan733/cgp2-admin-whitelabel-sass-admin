/**
 * @Description:根据给定的BusinessLibrary和mvtId获取出对应的PCResourceItem列表
 * @author nan
 * @date 2022/7/26
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.store.ResourceItemStore', {
    extend: 'Ext.data.Store',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            convert: function (value, record) {
                if (record.raw.resource) {
                    return record.raw.resource._id;
                } else {
                    return null;
                }

            }
        }, {
            name: 'resource',
            type: 'object'
        }, {//描述信息
            name: 'displayDescription',
            type: 'object'
        }, {
            name: 'library',
            type: 'object'
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.pcresource.PCResourceItem'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcresourceItems/businessLibrary/{businessLibraryId}/mvt/{mvtId}/level',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (!Ext.isEmpty(config) && !Ext.isEmpty(config.params)) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
});
