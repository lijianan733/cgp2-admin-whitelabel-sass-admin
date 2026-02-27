/**
 * @author xiu
 * @date 2025/7/30
 */
Ext.define('CGP.websiteproductlist.store.StoreConfigStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.websiteproductlist.model.StoreConfigMode',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/store-settings/{settingId}/platform-store-settings',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
   /* proxy: {
        type: 'pagingmemory',
    },
    data: [
        {
            id: '1',
            defaultDetailSetting: {},
            platform: 'popup',
            value: {
                shortDesc: 'string',
                productDesc: 'string'
            },
        }
    ],*/
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        if (config?.settingId){
            me.proxy.url = adminPath + `api/store-settings/${config.settingId}/platform-store-settings`;
        }
        me.callParent(arguments);
    }
})