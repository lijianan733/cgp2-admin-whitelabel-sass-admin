Ext.define('CGP.product.view.productattributeprofile.view.SkuAttributeList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.skuattributelist',
    autoScroll: true,
    width: 1200,

    initComponent: function () {
        var me = this;

        me.viewConfig= {
            enableTextSelection: true
        };
        me.store = Ext.create('CGP.product.view.productattributeprofile.store.SkuAttribute', {
            data: []
        });
        var items = [
            {
                dataIndex: 'name',
                autoSizeColumn: true,
                text: i18n.getKey('name')
            },{
                dataIndex: 'id',
                autoSizeColumn: true,
                text: i18n.getKey('id')
            },{
                dataIndex: 'attributeName',
                autoSizeColumn: true,
                text: i18n.getKey('attributeName')
            }
        ];

        me.columns = {
            items: items,
            defaults: {
                tdCls: 'vertical-middle',
                sortable: false,
                menuDisabled: true,
                resizable: true
            }
        };


        me.callParent(arguments);
    }



});