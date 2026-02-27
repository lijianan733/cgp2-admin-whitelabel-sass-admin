/**
 * @Description:自定义条件的属性上下文grid
 * @author nan
 * @date 2023/10/12
 */
Ext.define('CGP.common.condition.view.customexpression.CustomConditionContentGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.custom_condition_contentGrid',
    store: null,
    layout: 'fit',
    autoScroll: false,
    header: {
        style: {
            background: '#f5f5f5'
        },
        title: '上下文(code)',
    },
    hideHeaders: true,
    columns: [],
    buildContextStr: function (record) {
        return record.get('path') + '["' + record.get('key') + '"]';
    },
    initComponent: function () {
        var me = this;
        me.columns = [{
            xtype: 'actioncolumn',
            width: 30,
            items: [
                {
                    iconCls: 'icon_ux_left',
                    tooltip: '插入到表达式',
                    handler: function (view, rowIndex, colIndex, a, b, record) {
                        var grid = view.ownerCt;
                        var attribute = me.buildContextStr(record);
                        var win = grid.up('[xtype=custom_condition_window]')
                        win.insertAtCursor(attribute);
                        grid.getSelectionModel().select(record);
                    }
                }]
        },].concat(me.columns);
        me.callParent();
    },
    listeners: {
        select: function (selectionModel, record) {
            var me = this;
            var extraFeature = me.ownerCt.ownerCt.getComponent('extraFeature');
            //操作符
            var operator = extraFeature.getComponent('operator');
            operator.refreshData(record);

            //选项
            var option = extraFeature.getComponent('option');
            option.refreshData(record);
            //详情
            var detail = extraFeature.getComponent('detail');
            detail.refreshData(record);

            //模板
            var template = extraFeature.getComponent('template');
            template.refreshData(record);
        },
        expand: function () {
            var me = this;
            //触发下select刷新数据
            var selection = me.getSelectionModel().getSelection();
            //判断选择的记录是否是被过滤掉了
            if (selection[0]) {
                if (me.store.findRecord('key', selection[0].getId())) {

                } else {
                    //找不到
                    selection = [];
                }
            }
            me.fireEvent('select', me.getSelectionModel(), selection[0]);
        },
    }
})