/**
 * 显示响应信息的窗口
 */
Ext.define('CGP.product.view.producepage.ResponseDataWin',{
    extend: 'Ext.window.Window',

    layout: 'fit',
    modal : true,
    width: 800,
    maxHeight:500,
//    y: 300,
    autoShow: true,
    initComponent: function(){
        var me = this;

        var store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'pageId',
                    type: 'int'
                },
                {
                    name: 'productId',
                    type: 'int'
                },
                {
                    name: 'success',
                    type: 'boolean'
                },
                {
                    name: 'errMsg',
                    type: 'string'
                }
            ],
            autoLoad:true,
            data: me.data
           // proxy:new Ext.ux.data.proxy.PagingMemoryProxy({ data:me.data,reader:{type:'json'}})
        });
        var grid = Ext.create('Ext.grid.Panel', {
            header: false,
            //selType: 'checkboxmodel',
            store: store,
            columns: [
                {
                    xtype: 'rownumberer',
                    autoSizeColumn: false,
                    itemId: 'rownumberer',
                    width: 45,
                    resizable: true,
                    menuDisabled: true,
                    tdCls: 'vertical-middle'
                },
                {
                    text: i18n.getKey('pageName'),
                    dataIndex: 'pageId',
                    xtype: 'gridcolumn',
                    itemId: 'pageName',
                    tdCls: 'vertical-middle',
                    sortable: true,
                    renderer: function (value, metadata) {
                        metadata.style = "font-weight:bold";
                        var pageListObj = new Ext.util.MixedCollection();
                        var pn = me.pageName;
                        if(pn){
                            return pn;
                        }else if(me.pageList){
                            for(var i = 0; i<me.pageList.length; i++){
                                //pageListObj.add(pageList[i]);
                                pageListObj.add(me.pageList[i].get('id'),me.pageList[i]);
                            }
                            pn = pageListObj.get(value).get('name');
                            return pn;
                        }else{
                            return value;
                        }
                    }
                },
                {
                    text: i18n.getKey('productMsg'),
                    dataIndex: 'productId',
                    xtype: 'gridcolumn',
                    itemId: 'productId',
                    width: 300,
                    sortable: false,
                    renderer: function(value){
                        if(me.record.name != null){
                            var productName = me.record.name;
                            var productSku = me.record.sku;
                        }else{
                            var productSku = me.record.get('sku');
                            var productName = me.record.get('name');
                        }
                        return 'id: '+value+'<br>'+'产品名：'+productName+'<br>'+'sku: '+productSku;

                    }
                },
                {
                    text: i18n.getKey('isSuccess'),
                    dataIndex: 'success',
                    xtype: 'gridcolumn',
                    itemId: 'success',
                    sortable: false,
                    tdCls: 'vertical-middle',
                    renderer: function(value, metadata){
                        if(value == true){
                            metadata.style = "color: green";
                            return value = '成功';
                        }else{
                            metadata.style = 'color: red';
                            return value = '失败'
                        }
                    }
                },
                {
                    text: i18n.getKey('errMsg'),
                    dataIndex: 'errMsg',
                    xtype: 'gridcolumn',
                    tdCls: 'vertical-middle',
                    itemId: 'errMsg',
                    sortable: false
                }
            ]
        });
        me.title= i18n.getKey('productionMsg');

        me.items= [grid];
        me.callParent(arguments);
    }
})