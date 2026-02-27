/**
 * Created by nan on 2021/3/5
 */
Ext.define('CGP.background.store.ImageSizeStore', {
    extend: 'Ext.data.Store',
    autoLoad:true,
    requires: ["CGP.background.model.ImageSizeModel"],
    model: "CGP.background.model.ImageSizeModel",
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/backgroundSeries/id/sizes',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    params: null,
    seriesId: null,//分类id
    constructor: function (config) {
        var me = this;
        if (config && config.seriesId) {
            me.proxy.url = adminPath + 'api/backgroundSeries/' + config.seriesId + '/sizes';
        }
        me.callParent(arguments);
    }
})