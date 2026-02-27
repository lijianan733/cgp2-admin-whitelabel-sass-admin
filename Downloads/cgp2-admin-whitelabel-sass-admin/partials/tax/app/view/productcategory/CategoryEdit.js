/**
 * AreaTax
 * @Author: miao
 * @Date: 2021/11/4
 */
Ext.define("CGP.tax.view.productcategory.CategoryEdit", {
    extend: "Ext.form.Panel",
    alias: 'widget.categoryedit',
    requires: [],
    autoScroll: true,
    scroll: 'vertical',
    border: 0,
    fieldDefaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 120,
        msgTarget: 'side'
    },

    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'textfield',
                itemId: 'name',
                name: 'name',
                fieldLabel: i18n.getKey('name'),
                allowBlank: false,
            },
            {
                xtype: 'textfield',
                itemId: 'clazz',
                name: 'clazz',
                fieldLabel: i18n.getKey('clazz'),
                allowBlank: false,
                hidden:true,
                value:'com.qpp.cgp.domain.TaxProductCategory'
            }
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
    getValue: function () {
        var me = this, data = me.data||{};
        var items = me.items.items;
        for (var item of items) {
            if(item.diyGetValue){
                data[item.name] = item.diyGetValue();
            }
            else {
                data[item.name] = item.getValue();
            }
        }
        if(Ext.isEmpty(data.tax)){
            data.tax={};
            data.tax["_id"]=JSGetQueryString("taxId");
            data.tax["clazz"]='com.qpp.cgp.domain.Tax';
        }
        return data;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        if(Ext.isEmpty(data)||Ext.Object.isEmpty(data)){
            return false;
        }
        me.data = data;
        for (var item of items) {
            if(item.diySetValue){
                item.diySetValue(data[item.name]);
            }
            else {
                item.setValue(data[item.name]);
            }
        }
    }
});