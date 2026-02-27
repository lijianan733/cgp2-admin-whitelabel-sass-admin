/**
 * CategoryTaxRule
 * @Author: miao
 * @Date: 2021/11/9
 */
Ext.define("CGP.tax.view.productcategory.CategoryTaxRule", {
    extend: "Ext.panel.Panel",
    alias: 'widget.categorytaxrule',

    data: null,
    categoryId: null,
    areaTaxId: null,
    sourceArea: null,
    area: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.tax.controller.Tax');
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                itemId: 'saveBtn',
                iconCls: 'icon_save',
                hidden: true,
                handler: function () {
                    controller.saveCatetoryTax(me);
                }
            }
        ]
        if (Ext.isEmpty(me.data)) {
            me.data = {sourceArea: me.areaTax?.sourceArea, area: me.areaTax?.area};
        }
        me.items = [
            {
                xtype: 'areatax',
                itemId: 'taxForm',
                hidden: true,
                padding: "5",
                width: "100%",
                border: 0,
                data: me.data,
                areaView: true
            }
        ];
        me.callParent(arguments);
    },
    listeners: {
        afterrender: function (comp) {
            if (comp.data) {
                comp.setValue(comp.data);
            }
        }
    },
    isValid: function () {
        var me = this, isValid = true;
        if (!me.items.items[0].isValid()) {
            isValid = false;
        }
        return isValid;
    },
    getValue: function () {
        var me = this;
        var data = me.data || {};
        var items = me.items.items;
        var formData = items[0].getValue();
        if (formData.sourceArea) {
            delete formData.sourceArea;
        }
        if (formData.area) {
            delete formData.area;
        }
        data = Ext.merge(data, formData);
        data.clazz = '';///todo: real clazz
        return data;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        me.data = Ext.merge(me.data, data);
        for (var item of items) {
            item.setValue(me.data);
        }
    }
});