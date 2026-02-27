Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.view.PackageQty", {
    extend: "Ext.panel.Panel",
    itemId: 'packageQty',
    autoScroll: true,
    padding:10,
    border:0,
    viewConfig: {
        enableTextSelection: true
    },
    packageQty:null,
    constructor: function (config) {
        var me = this;

        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('packageQty');
        me.items=[
            {
                xtype:'textfield',
                itemId:'packageQty',
                name:'packageQty',
                readOnly:true,
                width:380,
                labelWidth:120,
                fieldLabel:i18n.getKey('packageQty')
            }
        ];
        me.callParent(arguments);
    },
    refreshData: function (data) {
        var me = this;
        me.items.items[0].setValue(data['packageQty']);
    }

});
