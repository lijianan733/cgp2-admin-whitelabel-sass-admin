/**
 * @Description:根据属性的值类型,可知道有啥操作可用，列出所有可选操作的范围
 * @author nan
 * @date 2023/10/18
 */
Ext.define('CGP.common.condition.view.customexpression.Template', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.template',
    itemId: 'helpPanel',
    layout: {
        type: 'vbox'
    },
    autoScroll: true,
    hideHeaders: true,
    attribute: null,
    insertionExpressFun: null,
    numberTemplates: [
        {
            "description": "上下文属性值 == 指定数值",
            "template": "{key} == {value}"
        },
        {
            "description": "上下文属性值 != 指定数值",
            "template": "{key} != {value}"
        },
        {
            "description": "上下文属性值 <= 指定数值",
            "template": "{key} <= {value}"
        },
        {
            "description": "上下文属性值 < 指定数值",
            "template": "{key} < {value}"
        },
        {
            "description": "上下文属性值 > 指定数值",
            "template": "{key} > {value}"
        },
        {
            "description": "上下文属性值 >= 指定数值",
            "template": "{key} >= {value}"
        },
        {
            "description": "小值 < 上下文属性值 <  大值",
            "template": "{value1} < {key} && {key} < {value2}"
        },
        {
            "description": "小值 <= 上下文属性值 <  大值",
            "template": "{value1} <= {key} && {key} < {value2}"
        },
        {
            "description": "小值 < 上下文属性值 <=  大值",
            "template": "{value1} < {key} && {key} <= {value2}"
        },
        {
            "description": "小值 <= 上下文属性值 <=  大值",
            "template": "{value1} <= {key} && {key} <= {value2}"
        }
    ],
    stringTemplates: [
        {
            "description": "上下文属性值 > 指定值",
            "template": "{key} == {value}"
        },
        {
            "description": "上下文属性值 != 指定值",
            "template": "{key} != {value}"
        }
    ],
    singleOptionTemplates: [
        {
            "description": "上下文属性值 == 指定值",
            "template": "{key} == {value}"
        },
        {
            "description": "上下文属性值 != 指定值",
            "template": "{key} != {value}"
        },
        {
            "description": "上下文属性值 在 指定数据范围内",
            "template": "isContained({values},{key})==true"
        },
        {
            "description": "上下文属性值 不在 指定数据范围内",
            "template": "isContained({values},{key}) == false"
        }
    ],
    multiOptionTemplates: [
        {
            "description": "上下文属性值 == 指定值",
            "template": "equal({key},{values}) == true"
        },
        {
            "description": "上下文属性值 != 指定值",
            "template": "equal({key},{values}) == false"
        },
        {
            "description": "上下文属性值 在 指定数据范围内",
            "template": "isContained({values},{key})==true"
        },
        {
            "description": "上下文属性值 不在 指定数据范围内",
            "template": "isContained({values},{key}) == false"
        }
    ],
    initComponent: function () {
        var me = this;
        me.store = Ext.create('Ext.data.Store', {
            fields: ['description', 'template', 'result'],
            data: []
        });
        me.columns = [{
            xtype: 'actioncolumn',
            width: 30,
            items: [
                {
                    iconCls: 'icon_ux_left',
                    tooltip: '插入到表达式',
                    handler: me.insertionExpressFun || function (view, rowIndex, colIndex, a, b, record) {
                        var grid = view.ownerCt;
                        var result = record.get('result');
                        var win = grid.up('[xtype=custom_condition_window]')
                        win.insertAtCursor(result);
                    }
                }]
        }, {
            xtype: 'auto_bread_word_column',
            dataIndex: 'result',
            flex: 1,
            renderer: function (value, metaData, record) {
                metaData.tdAttr = 'data-qtip ="' + record.get('description') + '"';
                return value;
            }
        }];
        me.callParent();
    },
    refreshData: function (record) {
        var me = this;
        if (record) {
            var valueType = (record.get('valueType'));
            var selectType = (record.get('selectType'));
            var data = []
            me.attribute = record;
            if (selectType == 'NON') {
                if (valueType == 'String') {
                    data = me.stringTemplates;
                } else if (valueType == 'Number') {
                    data = me.numberTemplates;
                }
            } else if (selectType == 'SINGLE') {
                data = me.singleOptionTemplates;
            } else if (selectType == 'MULTI') {
                data = me.multiOptionTemplates;
            }
            data = data.map(function (item) {
                var value = '';//`"字符值"` 数值 选项
                var key = `${record.get('path')}["${record.get('key')}"]`;
                if (selectType == 'SINGLE' || selectType == 'MULTI') {
                    value = "选项值";
                } else if (selectType == 'NON') {
                    if (valueType == 'String') {
                        value = `"字符值"`;
                    } else if (valueType == 'Number') {
                        value = '数值';
                    }
                }
                var str = new Ext.XTemplate(item.template).apply({
                    key: key,
                    value: value,
                    value1: '小值',
                    value2: '大值',
                    values: `[选择值,选项值]`
                });
                item.result = str;
                return item;
            });
            me.store.loadData(data);
        } else {
            me.store.loadData([]);
        }
    }
})