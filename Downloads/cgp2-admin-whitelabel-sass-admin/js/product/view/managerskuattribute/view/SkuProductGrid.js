Ext.syncRequire('CGP.product.model.Product');
Ext.define('CGP.product.view.managerskuattribute.view.SkuProductGrid',{
    extend:'Ext.grid.Panel',
    id:'SkuProductGrid',
    title: i18n.getKey('currentskuprod'),
    itemId: 'skuProductGrid',
    columns: {
        items: [],
        defaults: {
            autoSizeColumn: true
        }
    },
    layout:'fit',
    viewConfig: {
        enableTextSelection: true,
        forceFit: true, // 注意不要用autoFill:true,那样设置的话当GridPanel的大小变化（比如你resize了它）时不会自动调整column的宽度
        scrollOffset: 0, //不加这个的话，会在grid的最右边有个空白，留作滚动条的位置
        listeners: {
            viewready: function (dataview) {
                Ext.each(dataview.panel.headerCt.gridDataColumns, function (column) {
                    if (column.autoSizeColumn === true)
                        column.autoSize();
                })
            }
        }
    },
    constructor:function(config){
        var me = this;
        var skuAttributeGrid = config.skuAttributeGrid;
        var skuAttributeStore=skuAttributeGrid.getStore();
        var productId=config.productId;
        var tab=config.tab;
        var productColumns=config.productColumns;
        me.id=config.gridId;
        me.store=Ext.create('CGP.product.view.managerskuattribute.store.SkuProductGridStore',{
                productId:productId
            }
        );
        me.columns.items = productColumns;
        me.callParent([config]);
    },
    initComponent:function(){
        var me =this;
        me.callParent(arguments)
    }

})