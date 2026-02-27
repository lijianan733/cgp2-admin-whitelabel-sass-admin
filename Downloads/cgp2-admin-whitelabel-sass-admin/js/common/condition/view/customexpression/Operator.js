/**
 * @Description:
 * @author nan
 * @date 2023/10/20
 */

Ext.define('CGP.common.condition.view.customexpression.Operator', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.operator',
    emptyText: '无相关数据',
    hideHeaders: true,
    inputTypeOperator: [
        {
            value: '==',
            display: '='
        },
        {
            value: '!=',
            display: '!='
        },
        {
            value: '<',
            display: '<'
        },
        {
            value: '<=',
            display: '<='
        },
        {
            value: '>',
            display: '>'
        },
        {
            value: '>=',
            display: '>='
        },
    ],
    optionTypeOperator: [
        {
            value: '==',
            display: '='
        },
        {
            value: '!=',
            display: '!='
        }
    ],
    refreshData: function (record) {
        var me = this;
        if (record) {
            var valueType = record.get('valueType');
            if (record.get('selectType') == 'NON') {
                me.store.loadData(me.inputTypeOperator);
                me.setTitle(`<font color="green">可选操作符</font><font color="red">(手输;${valueType})</font>`);

            } else if (record.get('selectType') == 'SINGLE' || record.get('selectType') == 'MULTI') {
                me.store.loadData(me.optionTypeOperator);
                me.setTitle(`<font color="green">可选操作符</font><font color="red">(选项;${valueType})</font>`);
            }
        } else {
            me.store.loadData([]);
        }
    },
    initComponent: function () {
        var me = this;
        me.header = {
            title: '<font color="green">可选操作符</font>',
            style: {
                background: '#f5f5f5'
            }
        };
        me.columns = [{
            xtype: 'actioncolumn',
            width: 50,
            items: [
                {
                    iconCls: 'icon_ux_left',
                    tooltip: '插入到表达式',
                    handler: function (view, rowIndex, colIndex, a, b, record) {
                        var grid = view.ownerCt;
                        var value = record.get('value');
                        var win = grid.up('[xtype=custom_condition_window]')
                        win.insertAtCursor(` ${value}`);
                    }
                }]
        }, {
            dataIndex: 'display',
            flex: 1,
        }];
        me.store = {
            xtype: 'store',
            fields: ['value', 'display'],
            data: []
        };
        me.callParent();
    }
})