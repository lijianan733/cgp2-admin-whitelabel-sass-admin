Ext.define('CGP.productcategory.view.productcategory.MoveTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.productcategorymovetree',
    mixins: ['Ext.ux.util.ResourceInit'],


    autoScroll: true,
    rootVisible: false,
    useArrows: true,
    isMain: true,
    website: 1,
    selModel: {
        selType: 'cellmodel'
    },




    initComponent: function () {
        var me = this;


        me.store = Ext.create('CGP.productcategory.store.ProductCategory', {
            autoSync: false,
            isMain: me.isMain,
            website: me.website
        });
        Ext.apply(me, {
            columns: [{
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                width: 400,
                sortable: true,
                dataIndex: 'name',
                locked: true,
                editor: {
                    xtype: 'textfield'
                }
            }],
            bbar: [{
                xtype: 'button',
                text: i18n.getKey('ok'),
                itemId: 'ok',
                disabled: true,
                action: 'confirmmove'
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function () {
                    me.ownerCt.close();
                }

            }]
        });

        me.callParent(arguments);
        me.expandAll();
    }

})