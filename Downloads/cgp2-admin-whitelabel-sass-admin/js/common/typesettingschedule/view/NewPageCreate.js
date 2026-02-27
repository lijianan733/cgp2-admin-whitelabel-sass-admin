/**
 * @Description:
 * @author xiu
 * @date 2024/6/4
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.view.OptionalConfigContainer',
    'CGP.common.typesettingschedule.controller.Controller',
    'CGP.common.typesettingschedule.view.NewGridColumns'
])
Ext.define('CGP.common.typesettingschedule.view.NewPageCreate', {
    extend: 'CGP.common.typesettingschedule.view.OptionalConfigContainer',
    alias: 'widget.new_page_create',
    width: '100%',
    index: null,
    initData: null,
    allowBlank: null,
    titleLabel: null,
    initExpand: false,
    isTimeShow: false,
    containerConfig: {
        defaults: {
            margin: '0 25 0 37',
            allowBlank: this.allowBlank,
        },
    },
    initComponent: function () {
        var me = this,
            result = [],
            controller = Ext.create('CGP.common.typesettingschedule.controller.Controller');

        if (me.initData){
            var data = me.initData,
                subTasks = data['subTasks'];

            me.status = controller.getDataStatus(data);
            me.title = i18n.getKey(me.titleLabel);

            subTasks.forEach((item, subTasksIndex) => {
                result.push(
                    // 任务
                    {
                        xtype: 'new_grid_columns',
                        width: '100%',
                        data: item,
                        type: 'DISTRIBUTE',
                        index: me.index,
                        subTasks: subTasks,
                        subTasksItem: item,
                        subTasksIndex: subTasksIndex
                    }
                )
            })
            me.containerItems = result
        }

        me.callParent(arguments);
    }
})