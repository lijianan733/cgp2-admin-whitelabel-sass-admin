/**
 * 為product類型頁面選擇產品的窗口
 */
Ext.define('CGP.cmspage.view.SelectProductWin',{
    extend: 'Ext.window.Window',


    modal : true,
    layout: 'fit',
    constrain: true,
    id: 'productWin',
    autoShow: true,

    initComponent: function () {
        var me = this;

        me.title = i18n.getKey('product'),
        me.items = [Ext.create('CGP.cmspage.view.ProductList',{
            websiteId: me.websiteId,
            pageId: me.pageId,
            itemId:'productList'
        })];
        me.listeners={
            //窗口關閉時清空列表記錄數據
            'close':function(){
                this.productList.recordArr.clear();
                me.clearProductList();
            }
        };

        me.bbar =  [
            {
                xtype: 'button',
                text: i18n.getKey('selectedProduct'),
                iconCls: 'icon_preview',
                handler: function(){
                    var recordArr = me.productList.getSelectArr();
                    Ext.create('CGP.cmspage.view.SelectedProductWin',{
                        recordArr: recordArr
                    })
                }
            },'->',{
                xtype : 'button',
                text : i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler : function() {
                    me.controller.confirmCreateProductPage(me.websiteId,me,me.pageId,me.productList,me.pageName,me.cmspageStore);
                }
            },{
                xtype : 'button',
                text : i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler : function(btn){
                       me.clearProductList();
                    me.close();
                }
            }
        ];

        me.callParent(arguments);
        me.productList = me.getComponent('productList');
    },
    /**
     * 清空列表記錄數據
     */
    clearProductList: function() {
        this.productList.collection.clear();
    }
})