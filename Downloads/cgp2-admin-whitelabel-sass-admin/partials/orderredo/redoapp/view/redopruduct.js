/**
 * Created by admin on 2019/9/21.
 */
Ext.define('CGP.redodetails.view.redopruduct',{
    extend: 'Ext.window.Window',
    requires:['CGP.redodetails.model.RedoItemView'],
    modal: true,
    resizable: false,
    minWidth: 500,
    height: 350,
    defaults: {
        width: 350
    },
    bodyStyle: {
        padding: '10px',
        paddingTop: '20px'
    },
    initComponent: function () {
        var me = this;
        var controller=Ext.create("CGP.redodetails.controller.RedoDetails");
        var mainRenderer= Ext.create('CGP.redodetails.view.RedoRender');
        me.title = i18n.getKey('product') + i18n.getKey('redo');

        me.items = [
            {
                xtype: 'fieldcontainer',
                fieldLabel:i18n.getKey('image'),
                items:mainRenderer.rendererImage("", null, me.record)
            },
            {
                xtype: 'displayfield',
                fieldLabel:i18n.getKey('productName'),
                name: 'productName',
                itemId: 'productName',
                value: me.record.get('productName')
            },
            {
                xtype: 'displayfield',
                fieldLabel:i18n.getKey('sku'),
                name: 'sku',
                itemId: 'sku',
                value:me.record.get('productSku')
            },
            {
                xtype: 'displayfield',
                fieldLabel:i18n.getKey('productId'),
                name: 'productId',
                itemId: 'productId',
                value:me.record.get('product').id
            },
            {
                xtype: 'numberfield',
                fieldLabel:i18n.getKey('qty')+'('+ me.record.get('qty') +')',
                name: 'redoQty',
                itemId: 'redoQty',
                value:me.getAdded(),
                maxValue:me.record.get('qty'),
                minValue:1,
                width:200,
                allowBlank:false
            }
        ];
        me.bbar = ['->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function (btn) {
                    if(me.getComponent('redoQty').getErrors().length>0)
                    {
                        Ext.Msg.alert(i18n.getKey('ErrorInfo'),me.getComponent('redoQty').getErrors());
                        return false;
                    }
                    var mask=me.setLoading();
                    var datas=[];
                    var redoItem=Ext.create('CGP.redodetails.model.RedoItemView');
                    redoItem.set('originalOrderItemId',me.record.get('id'));
                    redoItem.set('orderItemQty',me.record.get('qty'));
                    redoItem.set('productId',me.record.get('product').id);
                    redoItem.set('productName',me.record.get('productName'));
                    redoItem.set('sku',me.record.get('productSku'));
                    redoItem.set('originalqty',1);
                    redoItem.set('qty',me.getComponent('redoQty').getValue());
                    redoItem.set('redoType','redoProduct');
                    datas.push(redoItem.data);
                    controller.addRedoItem(btn,datas,mask,me.orderitems);
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function () {
                    me.close();
                }
            }];
        me.callParent(arguments);

    },

    getAdded:function(){
        var me=this,result='';
        var redoPage=me.orderitems.ownerCt,redoItemStore=null;
        if(redoPage){
            if(redoPage.getComponent('redoItemList')){
                redoItemStore=redoPage.getComponent('redoItemList').getStore();
            }
        }
        var addedIndex=redoItemStore.findBy(function(record){
            return me.record.get('id')==record.get('originalOrderItemId')&&Ext.isEmpty(record.get('materialPath'));
        });
        if(addedIndex>-1){
            var addedItem=redoItemStore.getAt(addedIndex);
            result=addedItem.get('qty');
        }
        return result;
    }

});