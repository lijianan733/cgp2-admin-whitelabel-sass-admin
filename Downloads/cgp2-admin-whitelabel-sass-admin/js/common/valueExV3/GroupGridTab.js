/**
 * Created by nan on 2018/3/21.
 */
Ext.Loader.syncRequire([
    'CGP.common.valueExV3.view.CommonPartField'
]);
Ext.define('CGP.common.valueExV3.GroupGridTab', {
    extend: 'Ext.tab.Panel',
    commonPartFieldConfig: {},//CGP.common.valueExV3.view.CommonPartField中的配置
    listeners: {},
    readOnly: false,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        //callParent后完成实例化
        var groupGridPanel = Ext.create('CGP.common.valueExV3.GroupGridPanel', {
            parentTab: me,
            readOnly:me.readOnly,
            title: i18n.getKey('constraint'),
            itemId: 'groupGridPanel',
            id: JSGetUUID()
        });
        groupGridPanel.setValue({});
        var formPanel = Ext.create('Ext.form.Panel', {
            id: JSGetUUID(),
            itemId: 'formPanel',
            title: i18n.getKey('baseInfo'),
            layout: 'fit',
            setValue: function (value) {
                var me = this;
                var commonPartField = me.getComponent('commonPartField');
                commonPartField.setValue(value);
            },
            getValue: function () {
                var me = this;
                var commonPartField = me.getComponent('commonPartField');
                return commonPartField.getValue();
            }
        });
        var container = Ext.create('CGP.common.valueExV3.view.CommonPartField', Ext.Object.merge({
            itemId: 'commonPartField',
            readOnly:me.readOnly,
            name: 'value'//定义获取值时的键名必须传入,

        }, me.commonPartFieldConfig));
        formPanel.add(container);
        me.add([formPanel, groupGridPanel]);
        me.setActiveTab(formPanel);
    },
    setGridPanelValue: function (value) {
        var me = this;
        var groupGridPanel = this.getComponent('groupGridPanel');
        groupGridPanel.setValue(value);
    },
    getGridPanelValue: function () {
        var me = this;
        var groupGridPanel = this.getComponent('groupGridPanel');
        return groupGridPanel.getValue();
    },
    setFormPanelValue: function (value) {
        var me = this;
        var formPanel = this.getComponent('formPanel');
        formPanel.setValue(value);
    },
    getFormPanelValue: function () {
        var me = this;
        var formPanel = this.getComponent('formPanel');
        return formPanel.getValue();
    },
    getGridPanel: function () {
        var me = this;
        return this.getComponent('groupGridPanel')
    },
    getFormPanel: function () {
        var me = this;
        return this.getComponent('formPanel')
    },
    getValue: function () {
        var me = this;
        var data = {};
        var formValue = me.getFormPanelValue();
        data.constraints = me.getGridPanelValue();
        data = Ext.Object.merge(data, formValue);
        return data;
    },
    setValue: function (data) {
        var me = this;
        if (!Ext.isEmpty(data)) {
            me.setFormPanelValue(data);
            me.setGridPanelValue(data.constraints);
        }
    }
});
