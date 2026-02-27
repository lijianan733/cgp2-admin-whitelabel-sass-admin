Ext.define("CGP.holidayinfo.store.HolidayInfoStore", {
    extend: 'Ext.data.Store',
    model: "CGP.holidayinfo.model.HolidayInfoModel",
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/holidayinfoconfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});