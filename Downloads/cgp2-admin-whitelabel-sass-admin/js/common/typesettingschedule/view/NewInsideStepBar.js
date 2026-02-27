/**
 * @Description:
 * @author xiu
 * @date 2023/1/11
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.view.StepBar',
    'CGP.common.typesettingschedule.controller.Controller',
])
Ext.define('CGP.common.typesettingschedule.view.NewInsideStepBar', {
    extend: 'CGP.common.typesettingschedule.view.StepBar',
    alias: 'widget.new_inside_stepbar',
    lineHeight: 180,
    queryData: null,
    orderItemId: null,
    stepItemConfig: null,
    initComponent: function () {
        var me = this,
            statusArray = [],
            scheduleArray = [0, 0, 0],
            controller = Ext.create('CGP.common.typesettingschedule.controller.Controller');

        // 进度计算与状态获取
        me.queryData.forEach((dataItem, dataIndex) => {
            // 状态
            statusArray.push(controller.getStageStatusInfo(dataItem['stageStatus']));
            // 进度计算
            dataItem['stageStatus'] === 'RUNNING' && (scheduleArray[dataIndex] = dataItem['progressPercentage'])
        })

        me.stepItemDefault = Ext.Object.merge({
            clickColor: '#409eff',
            finishColor: 'green',
        }, me.stepItemConfig);

        me.data = [
            {
                stepName: '1',
                heights: me.lineHeight,
                itemId: 'initLine',
                schedule: controller.getScheduleValue(scheduleArray[0]),
                status: statusArray.length ? statusArray[0]['isStatus'] : 1
            },
            {
                stepName: '1',
                heights: me.lineHeight,
                itemId: 'typesettingLine',
                schedule: controller.getScheduleValue(scheduleArray[0]),
                status: statusArray.length ? statusArray[1]['isStatus'] : 1
            },
        ];
        me.callParent();
    }
})