/**
 * Created by miao on 2021/10/11.
 */
Ext.define('CGP.virtualcontainerobject.view.argumentbuilder.OutCenterPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.outcenterpanel',
    layout: 'fit',
    border: 0,
    rtAttribute: null,
    refreshData: function (data) {
        var me = this;
        // me.rtAttribute=record.getData();
        var items = me.items.items;
        for (var item of items) {
            if (!item.hidden) {
                item.refreshData(data);
            }
        }
    },
    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'conditionvaluegrid',
                itemId: 'conditionValueGrid',
                allowBlank: false,
            },
            {
                xtype: 'repeatvalueex',
                itemId: 'repeatValueEx',
                hidden: true,
                defaultResultType: 'String',
                uxTextareaContextData: {},
                defaultExpression: 'function expression(args) { return "value"; }',
                defaultClazz: 'com.qpp.cgp.expression.Expression',
                expressionConfig: {
                    emptyText: '例如：function expression(args) { return "value"; }'
                }
            }
        ];
        me.callParent(arguments);
    },

    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.rendered == true) {
            me.items.items.forEach(function (item) {
                if (!item.hidden && item.isValid() == false) {
                    isValid = false;
                }
            });
        }
        return isValid;
    },

    getValue: function () {
        var me = this, data = null;
        data = me.getComponent('conditionValueGrid').getValue();
        return data;
    }
})
