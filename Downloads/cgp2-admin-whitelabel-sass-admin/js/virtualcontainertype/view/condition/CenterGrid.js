/**
 * Created by nan on 2020/3/26.
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.view.ConditionValueGrid'
])
Ext.define("CGP.virtualcontainertype.view.condition.CenterGrid", {
    extend: 'CGP.common.condition.view.ConditionValueGrid',
    resourceName: i18n.getKey('condition'),
    alias: 'widget.centergrid',
    initComponent: function () {
        var me = this;
        me.outputValueColumn = {
            text: i18n.getKey('outputValue'),
            dataIndex: 'outputValue',
            tdCls: 'vertical-middle',
            itemId: 'outputValue',
            flex: 1,
            renderer: function (value, mateData, record) {
                //自动换行的div
                return JSAutoWordWrapStr(value.value || value.calculationExpression)
            }
        };
        me.callParent();
    },

    refreshData: function (data, record) {
        var me = this;
        var conditionController = Ext.create('CGP.common.condition.controller.Controller');
        var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        //这里只能手动改winCfg
        if (record) {
            if (record.isLeaf() == true) {
                toolbar.setDisabled(false);
            } else {
                toolbar.setDisabled(true);
            }
            var attributeData = record.raw;
            me.outputValueComponent = conditionController.createFieldByRtAttribute(attributeData, null, null, 'com.qpp.cgp.domain.executecondition.operation.value.FixValue', []);
            me.winConfig.formConfig.items[3] = me.outputValueComponent;
            me.winConfig.formConfig.items[1] = {
                name: 'outputValueType',
                itemId: 'outputValueType',
                xtype: 'hiddenfield',
                value: record.get('valueType')
            };
        } else {
            toolbar.setDisabled(true);
        }
        if (data) {
            me.setReadOnly(false);
            me.store.proxy.data = (data);
            me.store.load();
        } else {
            me.setReadOnly(true);
            me.store.proxy.data = [];
            me.store.load();
        }
    },
})
