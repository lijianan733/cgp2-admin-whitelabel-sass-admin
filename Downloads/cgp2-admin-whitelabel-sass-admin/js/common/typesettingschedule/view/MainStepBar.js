/**
 * @Description:
 * @author xiu
 * @date 2023/1/11
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.view.StepBarHbox',
    'CGP.common.typesettingschedule.controller.Controller',
])
Ext.define('CGP.common.typesettingschedule.view.MainStepBar', {
    extend: 'CGP.common.typesettingschedule.view.StepBarHbox',
    alias: 'widget.main_stepbar',
    isOn: true,
    queryData: null,
    orderItemId: null,
    stepItemConfig: null,
    initComponent: function () {
        var me = this;
        var statusArray = [];
        var scheduleArray = [0, 0, 0];
        var controller = Ext.create('CGP.common.typesettingschedule.controller.Controller');

        // 计算进度
        me.queryData.forEach((dataItem, dataIndex) => {
            statusArray.push(controller.getStageStatusInfo(dataItem['stageStatus']));
            if (dataItem['stageStatus'] === 'RUNNING') {
                var signal = (100 / dataItem['subTasks'].length).toFixed(0);
                dataItem['subTasks'].forEach(item => {
                    item['status'] === 'FINISHED' && (scheduleArray[dataIndex] += +signal)
                })
            }
        });

        me.stepItemDefault = Ext.Object.merge({
            clickColor: '#409eff',
            finishColor: 'green',
        }, me.stepItemConfig);

        me.data = [
            {
                stepName: i18n.getKey('init'), //'(' + i18n.getKey(initInfo['isSuccess']) + ')',
                status: statusArray[0]['isStatus'],
                schedule: controller.getScheduleValue(scheduleArray[0]),
            },
            {
                stepName: i18n.getKey('typesetting'), //'(' + i18n.getKey(typesettingInfo['isSuccess']) + ')',
                status: statusArray[1]['isStatus'],
                schedule: scheduleArray[1],
            },
            {
                stepName: i18n.getKey('createContent'), //'(' + i18n.getKey(createContentInfo['isSuccess']) + ')',
                status: statusArray[2]['isStatus'],
                schedule: controller.getScheduleValue(scheduleArray[2]),
            },
        ];
        me.callParent(arguments);
    }
})
//@ sourceURL=https://dev-sz-qpson-nginx.qppdev.com/product-library/js/typesettingschedule/view/TopStepBar.js