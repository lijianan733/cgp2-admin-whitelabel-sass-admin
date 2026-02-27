/**
 * @Description:
 * @author xiu
 * @date 2023/1/11
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.view.StepBar',
    'CGP.common.typesettingschedule.controller.Controller',
])
Ext.define('CGP.common.typesettingschedule.view.InsideStepBar', {
    extend: 'CGP.common.typesettingschedule.view.StepBar',
    alias: 'widget.inside_stepbar',
    lineHeight: 180,
    queryData: null,
    orderItemId: null,
    stepItemConfig: null,
    initComponent: function () {
        var me = this;
        var statusArray = [];
        var scheduleArray = [0, 0, 0];
        var controller = Ext.create('CGP.common.typesettingschedule.controller.Controller');
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
                status: statusArray[0]['isStatus']
            },
            {
                stepName: '1',
                heights: me.lineHeight,
                itemId: 'typesettingLine',
                schedule: controller.getScheduleValue(scheduleArray[1]),
                status: statusArray[1]['isStatus']
            },
            {
                stepName: '1',
                heights: me.lineHeight,
                schedule: controller.getScheduleValue(scheduleArray[2]),
                status: statusArray[2]['isStatus']
            },
        ];
        me.callParent();
    }
})