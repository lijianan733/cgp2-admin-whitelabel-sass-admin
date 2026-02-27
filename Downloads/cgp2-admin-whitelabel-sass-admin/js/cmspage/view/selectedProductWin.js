/**
 * 已经选中的产品展示页面
 */
Ext.define('CGP.cmspage.view.SelectedProductWin', {
    extend: 'Ext.window.Window',


    modal: true,
    layout: 'fit',
    width: 800,
    height: 600,
    constrain: true,
    id: 'selectProductWin',
    autoShow: true,

    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'id',
                    type: 'int',
                    useNull: true
                },
                'model',
                'name',
                'sku',
                'type',
                {
                    name: 'configurableProductId',
                    type: 'int',
                    useNull: true
                },
                {
                    name: 'mainCategory',
                    type: 'object'
                },
                {
                    name: 'subCategories',
                    type: 'array'
                }
            ],
            pageSize: 25,
            autoLoad: true,
            proxy: Ext.create('Ext.ux.data.proxy.PagingMemoryProxy', { data: me.recordArr, reader: {type: 'json'}})
        });
        me.title = i18n.getKey('selectedProduct');
        me.items = [
            Ext.create('Ext.grid.Panel', {
                store: store,
                viewConfig: {
                    enableTextSelection: true
                },
                hearder: false,
                columns: [
                    {
                        text: i18n.getKey('id'),
                        dataIndex: 'id',
                        width: 60,
                        itemId: 'id'
                    },
                    {
                        text: i18n.getKey('type'),
                        dataIndex: 'type',
                        xtype: 'gridcolumn',
                        itemId: 'type'
                    },
                    {
                        text: i18n.getKey('sku'),
                        dataIndex: 'sku',
                        autoSizeColumn: false,
                        width: 120,
                        xtype: 'gridcolumn',
                        itemId: 'sku'
                    },
                    {
                        text: i18n.getKey('name'),
                        dataIndex: 'name',
                        xtype: 'gridcolumn',
                        itemId: 'name'
                    },
                    {
                        text: i18n.getKey('model'),
                        dataIndex: 'model',
                        xtype: 'gridcolumn',
                        itemId: 'model'
                    },
                    {
                        text: i18n.getKey('maincategory'),
                        dataIndex: 'mainCategory',
                        xtype: 'gridcolumn',
                        itemId: 'mainCategory',
                        renderer: function (mainCategory) {
                            return mainCategory.name;
                        }
                    },
                    {
                        text: i18n.getKey('subCategories'),
                        dataIndex: 'subCategories',
                        xtype: 'gridcolumn',
                        itemId: 'subCategories',
                        renderer: function (subCategories) {
                            var value = [];
                            Ext.Array.each(subCategories, function (subCategory) {
                                value.push(subCategory.name);
                            })
                            return value.join(",");
                        }
                    }
                    ,
                    {
                        text: i18n.getKey('configurableProductId'),
                        dataIndex: 'configurableProductId',
                        width: 120,
                        xtype: 'gridcolumn',
                        itemId: 'configurableProductId'
                    }
                ],
                bbar: [
                    {
                        xtype: 'pagingtoolbar',
                        store: store,
                        height: 30,
                        id: 'responsepagingtoolbar',
                        displayInfo: true,
                        padding: '0,0,0,0',
                        border: false
                    }
                ]


            })];

        /*me.bbar =  [
         '->',{
         xtype : 'button',
         text : i18n.getKey('confirm'),
         handler : function() {
         me.controller.confirmCreateProductPage(me.websiteId,me,me.pageId,me.productList,me.pageName,me.cmspageStore);
         }
         },{
         xtype : 'button',
         text : i18n.getKey('cancel'),
         handler : function(btn){
         me.clearProductList();
         me.close();
         }
         }
         ];*/

        me.callParent(arguments);
        //me.productList = me.getComponent('productList');
    }
})