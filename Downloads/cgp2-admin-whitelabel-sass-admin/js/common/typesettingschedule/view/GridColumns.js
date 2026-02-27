/**
 * @Description:
 * @author xiu
 * @date 2023/1/11
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.view.StepItemsBtn',
    'CGP.common.typesettingschedule.controller.Controller',
    'CGP.common.typesettingschedule.view.LineContainer',
    'CGP.common.typesettingschedule.view.NewFieldsetContainer'
])
Ext.define('CGP.common.typesettingschedule.view.GridColumns', {
    extend: 'Ext.container.Container',
    alias: 'widget.grid_columns',
    layout: 'hbox',
    width: '100%',
    data: null,
    subTasks: null,
    subTasksItem: null,
    subTasksIndex: null,
    initComponent: function () {
        var me = this,
            {data, index, subTasksItem} = me,
            indexEnd = false,
            errorInfo = null,
            errorCode = null,
            errorInfo_zh = null,
            relatedInfo = [],
            imageResolutionModifyRecordItems = [],
            length = me.subTasks.length,
            name = me.data['name'],
            datas = me.data['datas'],
            {endTime, startTime} = me.data,
            takeTime = ((new Date(+endTime) - new Date(+startTime)) / 1000).toFixed(0),
            imageResolutionModifyRecord = datas['imageResolutionModifyRecord'],
            jobConfigId = datas['jobConfigId'] || '未查询到ID',
            pageConfigId = datas['pageConfigId'] || '未查询到ID',
            controller = Ext.create('CGP.common.typesettingschedule.controller.Controller'),
            endTimeText = controller.getEndTime(endTime),
            startTimeText = controller.getEndTime(startTime),
            valueId = (me.index === 0 ? pageConfigId : jobConfigId),
            valueType = (me.index === 0 ? 'pageConfigId' : 'jobConfigId'),
            value = name + ' < ' + valueType + ': ' + valueId + ' > ',
            time = startTimeText + ` ~ ` + endTimeText,
            tooltipText = {
                0: i18n.getKey('pageTask执行详情'),
                1: i18n.getKey('大版详情'),
                2: i18n.getKey('分发详情'),
            },
            stageStatus = controller.getStageStatusInfo(me.data['status']);
        (length === me.subTasksIndex + 1) && (indexEnd = true);

        !indexEnd && (
            me.style = {
                border: '1px solid #444444',
                borderTop: 'none',
                borderBottom: 'none',
                borderRight: 'none',
            }
        );

        if (me.subTasksItem) {
            var datas = me.subTasksItem['datas'],
                exception = datas['exception'] ? datas['exception'] : null;
            if (exception) {
                var {code, message, message_zh_CN} = exception;
                errorInfo = message;
                errorCode = code;
                errorInfo_zh = message_zh_CN;
            }
            for (var item in datas) {
                (item !== 'exception') && relatedInfo.push(
                    {
                        fieldLabel: item,
                        value: datas[item],
                        maxWidth: 500
                    }
                );
            }
        }

        if (imageResolutionModifyRecord) {
            for (var item in imageResolutionModifyRecord) {
                imageResolutionModifyRecordItems.push({
                    fieldLabel: item,
                    value: JSAutoWordWrapStr(imageResolutionModifyRecord[item]),
                    maxWidth: 500,

                })
            }
        }

        me.items = [
            {
                xtype: 'line_container',
                itemId: 'lineContainer',
                indexEnd: indexEnd,
            },
            {
                xtype: 'stepitems_btn',
                isShowLine: true,
                status: stageStatus['isStatus'],
                schedule: 0,
                margin: '0 10 0 0',
                finishColor: 'green',
            },
            {
                xtype: 'new_fieldset_container',
                params: {
                    data,
                    time,
                    index,
                    value,
                    endTime,
                    takeTime,
                    startTime,
                    endTimeText,
                    startTimeText,
                    errorCode,
                    errorInfo,
                    relatedInfo,
                    stageStatus,
                    tooltipText,
                    subTasksItem,
                    errorInfo_zh,
                    imageResolutionModifyRecordItems
                }
            },

        ];
        me.callParent();
    }
})