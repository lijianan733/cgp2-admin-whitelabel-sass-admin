Ext.define("CGP.monthimagegroup.store.MonthImageGroupStore", {
    extend: 'Ext.data.Store',
    model: 'CGP.monthimagegroup.model.MonthImageGroupModel',
    params: null,
    autoLoad: true,
    proxy: {
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/monthimagegroups',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
