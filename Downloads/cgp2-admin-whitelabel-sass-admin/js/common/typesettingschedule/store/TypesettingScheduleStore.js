Ext.define('CGP.common.typesettingschedule.store.TypesettingScheduleStore', {
    extend: 'Ext.data.Store',
    require: ['CGP.common.typesettingschedule.model.TypesettingScheduleModel'],
    model: 'CGP.common.typesettingschedule.model.TypesettingScheduleModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: composingPath + 'api/composing/progresses',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    remoteSort: true,
    autoLoad: true,
    params: null,
    sorters: [{
        property: 'seqNo',
        direction: 'ASC'
    }],
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
})