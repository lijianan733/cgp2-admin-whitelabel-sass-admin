/**
 * @Description:
 * @author nan
 * @date 2022/6/27
 */
Ext.Loader.syncRequire([
    'CGP.common.backgroundtask.model.BackgroundTaskModel'
])
Ext.define('CGP.common.backgroundtask.store.BackgroundTaskStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.common.backgroundtask.model.BackgroundTaskModel',
    proxy: {
        type: 'memory'
    },
    constructor: function (config) {
        var me = this;
        if (config) {
            me.data = config.data;
        }
        me.data = me.data || [];
        me.callParent(arguments);
    }
});