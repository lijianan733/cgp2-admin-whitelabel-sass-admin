/**
 * @Description:
 * @author xiu
 * @date 2023/1/11
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.view.OptionalConfigContainer',
    'CGP.common.typesettingschedule.controller.Controller',
    'CGP.common.typesettingschedule.view.GridColumns'
])
Ext.define('CGP.common.typesettingschedule.view.PageCreate', {
    extend: 'CGP.common.typesettingschedule.view.OptionalConfigContainer',
    alias: 'widget.page_create',
    width: '100%',
    index: null,
    initData: null,
    allowBlank: null,
    titleLabel: null,
    initComponent: function () {
        var me = this,
            result = [],
            controller = Ext.create('CGP.common.typesettingschedule.controller.Controller'),
            data = me.initData,
            subTasks = data['subTasks'];

        me.status = controller.getDataStatus(data);
        me.initExpand = false;
        me.isTimeShow = false;
        me.title = i18n.getKey(me.titleLabel);
        me.containerConfig = {
            defaults: {
                margin: '0 25 0 37',
                allowBlank: me.allowBlank,
            },
        };

        subTasks.forEach((item, subTasksIndex) => {
            result.push(
                {
                    xtype: 'grid_columns',
                    width: '100%',
                    data: item,
                    index: me.index,
                    subTasks: subTasks,
                    subTasksItem: item,
                    subTasksIndex: subTasksIndex
                }
            )
        })
        me.containerItems = result
        me.callParent(arguments);
    }
})