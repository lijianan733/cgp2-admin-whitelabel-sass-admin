/**
 * Main
 * @Author: miao
 * @Date: 2022/3/4
 */
Ext.Loader.syncRequire(["CGP.product.view.procductManage.view.ProductManager",
    "CGP.product.view.procductManage.view.ModifyProductMode"
]);
Ext.define("CGP.product.view.procductManage.view.Main", {
    extend: "Ext.tab.Panel",
    alias: 'widget.productmmain',
    productId:null,
    record:null,
    isProductManager:true,
    productManagerData:null,
    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype:'productmanager',
                title: i18n.getKey('managerConfig'),
                productId:me.productId,
                padding:'5',
                data:me.productManagerData
            },
            {
                xtype:'mproductmode',
                configurableId:me.productId,
                record:me.record
            },
        ];
        me.callParent(arguments);
    },

});