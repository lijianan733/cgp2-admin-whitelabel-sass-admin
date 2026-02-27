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
Ext.define('CGP.common.typesettingschedule.view.NewGridColumns', {
    extend: 'Ext.container.Container',
    alias: 'widget.new_grid_columns',
    layout: 'hbox',
    width: '100%',
    type: null, //区分出分发大版类型使用的模式
    subTasks: null,
    subTasksItem: null,
    subTasksIndex: null,
    getParams: function () {
        var me = this,
            {data, index, subTasksItem, type} = me,
            indexEnd = false,
            isDistribute = type === 'DISTRIBUTE', // 判断是否是分发大版
            length = me.subTasks.length,
            name = data['name'] || '',
            datas = data['datas'],
            jobConfigId = datas['jobConfigId'] || JSCreateFont('red', true, '未查询到ID'),
            pageConfigId = datas['pageConfigId'] || JSCreateFont('red', true, '未查询到ID'),
            controller = Ext.create('CGP.common.typesettingschedule.controller.Controller'),
            startTime = controller.getEndTime(data['startTime']),
            endTime = controller.getEndTime(data['endTime']),
            valueId = ((me.index === 0 && !isDistribute) ? pageConfigId : jobConfigId),
            valueType = ((me.index === 0 && !isDistribute) ? 'pageConfigId' : 'jobConfigId'),
            value = name + ' < ' + valueType + ': ' + valueId + ' > ',
            time = startTime + ` ~ ` + endTime,
            tooltipText = {
                0: i18n.getKey('pageTask执行详情'),
                1: i18n.getKey('大版详情'),
                2: i18n.getKey('分发详情'),
            },
            stageStatus = controller.getStageStatusInfo(data['status']);

        if (length === me.subTasksIndex + 1) {
            indexEnd = true
        }

        return {
            datas,
            indexEnd,
            value,
            time,
            endTime,
            tooltipText,
            stageStatus
        }
    },
    setStyle: function (indexEnd) {
        var me = this;
        if (!indexEnd) {
            me.style = {
                border: '1px solid #444444',
                borderTop: 'none',
                borderBottom: 'none',
                borderRight: 'none',
            }
        }
    },
    getImageResolutionModifyRecordItems: function (datas) {
        var {imageResolutionModifyRecord} = datas,
            imageResolutionModifyRecordItems = [];

        if (imageResolutionModifyRecord) {
            for (var item in imageResolutionModifyRecord) {
                imageResolutionModifyRecordItems.push({
                    fieldLabel: item,
                    value: JSAutoWordWrapStr(imageResolutionModifyRecord[item]),
                    maxWidth: 500,
                })
            }
        }
        return imageResolutionModifyRecordItems;
    },
    getErrorInfo: function (subTasksItem) {
        var errorInfo = null,
            errorCode = null,
            errorInfo_zh = null,
            relatedInfo = [];

        if (subTasksItem) {
            var datas = subTasksItem['datas'],
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

        return {
            errorInfo,
            errorCode,
            errorInfo_zh,
            relatedInfo
        }
    },
    initComponent: function () {
        var me = this,
            {data, index, subTasksItem, type} = me,
            {
                datas,
                indexEnd,
                value,
                time,
                endTime,
                tooltipText,
                stageStatus
            } = me.getParams(),
            imageResolutionModifyRecordItems = me.getImageResolutionModifyRecordItems(datas),
            {errorInfo, errorCode, errorInfo_zh, relatedInfo} = me.getErrorInfo(subTasksItem);

        me.setStyle(indexEnd);

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
                    type,
                    index,
                    value,
                    endTime,
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