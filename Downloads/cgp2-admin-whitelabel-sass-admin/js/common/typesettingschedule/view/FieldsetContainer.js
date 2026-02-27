/**
 * @Description:
 * @author xiu
 * @date 2023/1/11
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.view.InteriorContainer',
    'CGP.common.typesettingschedule.view.StepItemsBtn',
    'CGP.common.typesettingschedule.view.LineContainer'
])
Ext.define('CGP.common.typesettingschedule.view.FieldsetContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.fieldset_container',
    layout: 'hbox',
    width: '100%',
    data: null,
    index: null,
    status: null,
    subTasks: null,
    subTasksItem: null,
    initComponent: function () {
        var me = this,
            schedule = 0,
            indexEnd = false,
            statusIndex = {
                WAITING: -1,
                RUNNING: -2,
                FAILURE: 0,
                FINISHED: 1,
            },
            length = me.subTasks.length,
            // 进度获取
            subTasksItem = me.subTasks[me.index];

        (me.status === 'RUNNING') && (schedule = subTasksItem['progressPercentage']);
        (schedule === 100) && (me.status = 'FINISHED');
        (length === me.index + 1) && (indexEnd = true);
        (!indexEnd) && (me.style = {
            border: '1px solid #444444',
            borderTop: 'none',
            borderBottom: 'none',
            borderRight: 'none',
        })

        me.items = [
            {
                xtype: 'line_container',
                itemId: 'lineContainer',
                indexEnd: indexEnd,
            },
            {
                xtype: 'stepitems_btn',
                isShowLine: true,
                status: statusIndex[me.status],
                schedule: schedule,
                finishColor: 'green',
            },
            {
                xtype: 'interior_container',
                itemId: 'interiorContainer',
                allowBlank: true,
                index: me.index,
                initData: me.data,
                status: me.status,
                subTasks: me.subTasks,
                subTasksItem: me.subTasksItem,
                titleLabel: i18n.getKey(me.subTasks[me.index]['name']),
            },
        ]
        me.callParent();
    }

})