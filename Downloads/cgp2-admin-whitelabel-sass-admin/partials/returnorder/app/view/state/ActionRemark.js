/**
 * Action
 * @Author: miao
 * @Date: 2021/12/29
 */
Ext.define("CGP.returnorder.view.state.ActionRemark", {
    extend: "Ext.form.Panel",
    alias: 'widget.actionremark',
    requires: [],
    autoScroll: false,
    scroll: 'vertical',
    // border: 0,
    fieldDefaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 100,
        msgTarget: 'side'
    },

    initComponent: function () {
        var me = this;

        me.items = [
            {
                name: 'remark',
                xtype: 'textarea',
                fieldLabel: i18n.getKey('remark'),
                itemId: 'remark'
            }
        ];
        me.callParent(arguments);
    },
    listeners: {
        afterrender: {
            fn: function (comp) {
                if (comp.stateAction?.entityClazz) {
                    var controller = Ext.create('CGP.returnorder.controller.ReturnRequestOrder');
                    comp.insert(0,controller.getEntityForm(comp.stateAction.entityClazz))
                }
            }, single: true
        }
    },
    isValid: function () {
        if (this.isValidForItems == true) {//以form.items.items为遍历
            var isValid = true,
                errors = {};
            this.items.items.forEach(function (f) {
                if (!f.hidden && !f.isValid()) {
                    var errorInfo = f.getErrors();
                    if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                        errors = Ext.Object.merge(errors, errorInfo);
                    } else {
                        errors[f.getFieldLabel()] = errorInfo;
                    }
                    isValid = false;

                }
            });
            return isValid;
        } else {//以form.getFields为遍历
            var isValid = this.callParent(arguments),
                errors = {};
            if (!isValid) {
                this.form.getFields().each(function (f) {
                    if (!f.isValid()) {
                        errors[f.getFieldLabel()] = f.getErrors();
                    }
                });
            }
            return isValid;
        }
    },
    getValue: function () {
        var me = this, data = me.data || {};
        var items = me.items.items;
        for (var item of items) {
            if (item.name=='remark') {
                data[item.name] = item.getValue();
            } else {
                data['data']=item.getValue();
            }
        }
        return data;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            return false;
        }
        me.data = data;
        for (var item of items) {
            if (item.diySetValue) {
                item.diySetValue(data[item.name]);
            } else if (item.name == 'amountThreshold') {
                item.setValue(data[item.name] || data['threshold']);
            } else {
                item.setValue(data[item.name]);
            }
        }
    },
    getName: function () {
        var me = this;
        return me.name;
    },

});