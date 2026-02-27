/**
 * AreaTax
 * @Author: miao
 * @Date: 2021/11/4
 */
Ext.define("CGP.tax.view.AreaTax", {
    extend: "Ext.form.Panel",
    alias: 'widget.areatax',
    requires: [],
    autoScroll: false,
    scroll: 'vertical',
    // border: 0,
    fieldDefaults: {
        labelAlign: 'right',
        width: 370,
        labelWidth: 100,
        msgTarget: 'side'
    },

    isValidForItems: true,
    isCountryTax: false,
    // sourceCountry: null,
    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'numberfield',
                itemId: 'areaId',
                name: '_id',
                fieldLabel: i18n.getKey('id'),
                hidden: true,
            },
            {
                xtype: 'textfield',
                itemId: 'clazz',
                name: 'clazz',
                fieldLabel: i18n.getKey('clazz'),
                hidden: true,
                value: 'com.qpp.cgp.domain.tax.AreaTax'
            },
            {
                xtype: 'textfield',
                itemId: 'description',
                name: 'description',
                fieldLabel: i18n.getKey('description'),
                // allowBlank: false,
            },
            {
                xtype: 'numberfield',
                itemId: 'rate',
                name: 'rate',
                fieldLabel: i18n.getKey('taxRate'),
                decimalPrecision: 4,
                allowBlank: false,
                minValue:0,
                step:0.01
            },
            {
                xtype: 'numberfield',
                itemId: 'additionalAmount',
                name: 'additionalAmount',
                fieldLabel: i18n.getKey('additionalAmount'),
                decimalPrecision: 4,
                // allowBlank: false,
            },
            {
                xtype: 'numberfield',
                itemId: 'amountThreshold',
                name: 'amountThreshold',
                fieldLabel: i18n.getKey('amountThreshold'),
                decimalPrecision: 4,
                minValue:0,
                value:0,
                allowBlank: false,
            },
            {
                xtype: 'uxfieldset',
                name: 'area',
                title: i18n.getKey('targetArea'),
                hidden: me.isCountryTax,
                width: 368,
                style: {
                    padding: '5',
                    borderRadius: '4px'
                },
                items: [
                    {
                        xtype: 'area',
                        itemId: 'targetform',
                        width: "100%",
                        areaView: me.areaView,
                        // country: me.country,
                        isCountryTax: me.isCountryTax,
                    }
                ],
                diySetValue: function (data) {
                    var me = this;
                    if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
                        return false;
                    }
                    me.items.items[0].setValue(data);
                },
                diyGetValue: function () {
                    var me = this;
                    return me.items.items[0].getValue();
                },
                isValid: function () {
                    var me = this;
                    me.Errors = {};
                    var valid = true;
                    if (me.hidden == true) {
                        return true;//隐藏时就不作处理
                    }
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (!item.disabled) {
                            if (!item.isValid()) {
                                valid = false;
                                // me.Errors[item.name] = item.getErrors();
                            }
                        }
                    }
                    return valid;
                },
            },
            {
                xtype: 'uxfieldset',
                name: 'sourceArea',
                title: i18n.getKey('sourceArea'),
                width: 368,
                style: {
                    padding: '5',
                    borderRadius: '4px'
                },
                items: [
                    {
                        xtype: 'area',
                        // id:'sourceForm',
                        itemId: 'sourceForm',
                        width: "100%",
                        areaView: me.areaView,
                        // country: me.sourceCountry,
                        isCountryTax: me.isCountryTax,
                    }
                ],
                diySetValue: function (data) {
                    var me = this;
                    me.items.items[0].setValue(data);
                },
                diyGetValue: function () {
                    var me = this;
                    return me.items.items[0].getValue();
                },
                isValid: function () {
                    var me = this;
                    me.Errors = {};
                    var valid = true;
                    if (me.hidden == true) {
                        return true;//隐藏时就不作处理
                    }
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (!item.disabled) {
                            if (!item.isValid()) {
                                valid = false;
                                // me.Errors[item.name] = item.getErrors();
                            }
                        }
                    }
                    return valid;
                },
            },
        ];
        me.callParent(arguments);
    },
    listeners: {
        afterrender: {
            fn: function (comp) {
                if (comp.data) {
                    comp.setValue(comp.data);
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
            if (item.diyGetValue) {
                data[item.name] = item.diyGetValue();
            } else {
                data[item.name] = item.getValue();
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
                item.setValue((data[item.name] ?? data['threshold'])??0);
            } else {
                item.setValue(data[item.name]);
            }
        }
    },
    getName: function () {
        var me = this;
        return me.name;
    },
    reset: function () {
        var me = this;
        me.data = {};
        var items = me.items.items;
        for (var item of items) {
            if (item.xtype == 'uxfieldset') {
                continue;
            }
            item.reset();
        }
    },
    setReadOnly: function () {
        var me = this;
        var fields = me.getForm().getFields();
        for (var f of fields.items) {
            if (f.setReadOnly) {
                f.setReadOnly(true);
            }
        }
    }
});