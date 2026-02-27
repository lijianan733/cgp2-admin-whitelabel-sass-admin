/**
 * ProductCategory
 * @Author: miao
 * @Date: 2021/11/6
 */
Ext.define("CGP.tax.view.productcategory.ProductCategory", {
    extend: "Ext.panel.Panel",
    alias: 'widget.productcategory',
    layout: 'border',
    taxId: null,
    initComponent: function () {
        var me = this;
        me.taxId=JSGetQueryString("taxId");
        var controller = Ext.create('CGP.tax.controller.Tax');
        me.items = [
            {
                xtype: 'leftcategoryquery',
                itemId: 'leftCategory',
                region:'west',
                width:300,
                taxId: me.taxId
            },
            {
                xtype: 'centerproduct',
                itemId: 'centerProduct',
                region:'center',
                controller: controller,
                categoryId:null
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