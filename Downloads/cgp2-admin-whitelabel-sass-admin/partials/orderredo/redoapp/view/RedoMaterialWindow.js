/**
 * Created by admin on 2019/10/11.
 */
Ext.define('CGP.redodetails.view.RedoMaterialWindow',{
    extend:'Ext.window.Window',
    requires:['CGP.redodetails.model.RedoItemView'],
    itemId:'redoMaterialWindow',
    modal: true,
    resizable: false,
    minWidth: 600,
    height: 480,
    autoScroll:true,
    defaults: {
        width: 600
    },
    bodyStyle: {
        padding: '10px',
        paddingTop: '20px'
    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('material') + i18n.getKey('redo');
        var controller=Ext.create("CGP.redodetails.controller.RedoDetails");
        var redoItems=me.orderitems.ownerCt.getComponent('redoItemList');
        var redoStore=redoItems.store,addedProductQty=0;
        var addedProduct=redoStore.getAt(redoStore.findBy(function(item){
            return item.get('originalOrderItemId')==me.record.get('id')&&item.get('redoType')=='redoProduct';
        }));
        if(addedProduct){
            addedProductQty=addedProduct.get('qty');
        }
        var addedMaterial=[];
        redoStore.each(function(record){
            if(record.get('originalOrderItemId')==me.record.get('id')&&!Ext.isEmpty(record.get('materialPath'))){
                addedMaterial.push(record.data);
            }
        });

        me.items=[Ext.create('CGP.redodetails.view.redomaterial',{
            record:me.record,
            materialItems:addedMaterial,
            deletePath:[],
            orderitems:me.orderitems,
            addedProductQty:addedProductQty
        })];
        me.bbar= ['->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function (btn) {
                    var btnCt=btn.ownerCt.ownerCt;

                    var materialTree=btnCt.getComponent('redomaterial');
                    var mask=me.setLoading();
                    if(materialTree&&materialTree.materialItems.length>0){

                        var submitData=materialTree.materialItems;
                        if(Ext.isEmpty(redoItems.SMUtrees)){
                            redoItems.SMUtrees={};
                        }
                        redoItems.SMUtrees[me.record.get('id')]=materialTree;
                        var productCount=controller.getProductCount(materialTree.store,addedMaterial,me.record.get('qty'));

                        if(productCount>0){//物料可组成产品
                            submitData=controller.mergerRedoList(materialTree.materialItems,materialTree,productCount,addedProductQty);
//
                        }
                        controller.addRedoItem(btn,submitData,mask,me.orderitems,materialTree.deletePath);
                    }
                    else{
                        Ext.Msg.alert(i18n.getKey('ErrorInfo'),i18n.getKey('notAdd')+i18n.getKey('redo')+i18n.getKey('material')+i18n.getKey('item'));
                        mask.hide();
                        return false;
                    }
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
    }

})