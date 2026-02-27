/**
 * @author xiu
 * @date 2023/9/25
 */
Ext.define("CGP.builderpage.store.MaterialStore", {
    extend: 'Ext.data.Store',
    model: "CGP.builderpage.model.MaterialModel",
    remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productInstances/{id}/materials/materialViews',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    /*data: [
        {
            materialName: '卡牌',
            materialCode: 'card',
            materialPath: '123456,456789',
            materialViews: [
                {_id: 123},
                {_id: 124}
            ]
        },
        {
            materialName: '盒子',
            materialCode: 'box',
            materialPath: '123456,698568',
            materialViews: [
                {_id: 125},
                {_id: 126}
            ]
        }
    ],*/
    autoLoad: true,
    constructor: function (config) {
        var me = this,
            {id, type} = config;  //type: productInstances/orderItemsV2

        me.proxy.url = adminPath + 'api/' + type + '/' + id + '/materials/materialViews';
        // me.proxy.url =  'http://192.168.41.126/cgp-rest/api/orderItemsV2/' + config.orderItemId + '/materials/materialViews?page=1&start=0&limit=25';

        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});