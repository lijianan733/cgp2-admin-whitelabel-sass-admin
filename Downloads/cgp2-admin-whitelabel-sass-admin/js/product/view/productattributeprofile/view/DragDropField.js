/**
 *
 */
Ext.define('CGP.product.view.productattributeprofile.view.DragDropField', {
    extend: 'Ext.form.field.Display',
    alias: 'widget.dragdropfield',

    require: [
        'Ext.grid.Panel'
    ],

    _panel: null,

    selType: 'rowmodel',
    valueType: null,

    _contentId: null,

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        if (!me.panelConfig) {
            throw new Error('panelConfig can not be null!');
        }
        var panelConfig = me.panelConfig;
        me._contentId = me.panelConfig.renderTo || 'dragdropfield-content-id';
        var width = (panelConfig.width || 200);
        var height = (panelConfig.height || 200) + 50;
        var value = '<div id="' + me._contentId + '" ></div>';
        me.setValue(value);
        me.on("disable", function (display) {
            display.getPanel().setDisabled(true);
        });
        me.on("enable", function (display) {
            display.getPanel().setDisabled(false);
        });
    },

    getSubmitValue: function () {
        var me = this;
        var value = [];
        me._panel.leftGrid.getStore().each(function (record) {
            if (me.valueType == "id") {
                value.push(record.get("id"));
            } else {
                value.push(record.data);
            }
        });

        return value;
    },

    //这个方法是form.form.getValues()调用的。用于表单提交（$(options.form).ajaxSubmit（））。
    getSubmitData: function () {
        var me = this, value = {};
        value[me.name] = me.getSubmitValue();
        return value;
    },
    setSubmitValue: function (value) {
        var me = this;
        if (Ext.isArray(value)) {
            me._panel.leftGrid.getStore().loadData(value);
        }
    },
    getPanel: function () {
        return this._panel;
    },
    getleftStore: function () {
        return this._panel.leftGrid.getStore();
    },
    getRightStore: function () {
        return this._panel.rightGrid.getStore();
    },
    onRender: function () {
        this.callParent(arguments);

        this.initPanel();
    },

    initPanel: function () {
        var me = this;
        me.panelConfig = Ext.merge(me.panelConfig, {
            renderTo: document.getElementById(me._contentId),
            height: 400,
            autoScroll: true

        });
        me._panel = Ext.create('CGP.product.view.productattributeprofile.view.DragDropGrid', me.panelConfig);
    },

    reset: function () {
        this._panel.leftGrid.getStore().removeAll();
    },
    isValid: function () {
        var me = this;
        var data = me._panel.leftGrid.getStore();
        return !Ext.isEmpty(data);
    }
});