/**
 * @Description:
 * @author xiu
 * @date 2023/1/11
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.view.OptionalConfigContainer',
    'CGP.common.typesettingschedule.controller.Controller',
])
Ext.define('CGP.common.typesettingschedule.view.DataContainer', {
    extend: 'CGP.common.typesettingschedule.view.OptionalConfigContainer',
    alias: 'widget.data_container',
    width: '100%',
    initData: null,
    allowBlank: null,
    titleLabel: null,
    errorInfoShow: true,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.common.typesettingschedule.controller.Controller');
        var data = me.initData;
        var subTasks = data['subTasks'][0];
        var status = controller.getDataStatus(data);
        me.containerConfig = {
            defaults: {
                margin: '10 25 5 25',
                allowBlank: me.allowBlank,
            },
        };
        me.status = status;
        me.title = i18n.getKey(me.titleLabel);
        if (subTasks) {
            me.subTasksItem = subTasks;
            me.startTime = controller.getEndTime(subTasks['startTime']);
            me.endTime = controller.getEndTime(subTasks['endTime']);
            me.takeTime = ((new Date(+subTasks['endTime']) - new Date(+subTasks['startTime'])) / 1000).toFixed(0);
        }
        me.callParent(arguments);
    }
})