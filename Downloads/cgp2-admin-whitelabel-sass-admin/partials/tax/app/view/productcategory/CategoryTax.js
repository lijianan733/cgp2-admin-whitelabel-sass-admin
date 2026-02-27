/**
 * ProductCategory
 * @Author: miao
 * @Date: 2021/11/6
 */
Ext.define("CGP.tax.view.productcategory.CategoryTax", {
    extend: "Ext.panel.Panel",
    alias: 'widget.categorytax',
    layout: 'border',
    taxId: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.tax.controller.Tax');
        me.items = [
            {
                xtype: 'categorygrid',
                itemId: 'categoryGrid',
                region: 'west',
                width: 280,
                taxId: me.taxId,
                isView: true,
                areaTax: me.areaTax,
                // fromArea:me.fromArea
                // areaTaxId:me.areaTaxId
                listeners: {
                    itemcontextmenu: function (view, record, item, index, e, eOpts) {
                        controller.categoryEventMenu(view, record, e);
                    }
                }
            },
            {
                xtype: 'categorytaxrule',
                itemId: 'categoryTaxRule',
                region: 'center',
                data: null,
                categoryId: null,
                areaTax: me.areaTax,
                // fromArea:me.fromArea
                // areaTaxId:me.areaTaxId
            }
        ];
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this, data = {};
        var items = me.items.items;
        for (var item of items) {
            data[item.name] = item.getValue()
        }
        return data;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        me.data = data;
        for (var item of items) {
            item.setValue(data[item.name]);
        }
    }
});