/**
 * Created by admin on 2019/9/26.
 */

Ext.define('CGP.redodetails.controller.RedoDetails', {
    extend: 'Ext.app.Controller',
    alias: 'widget.RedoDetails',
    views:['redomaterial','redopruduct'],
    refs:[
        {
            ref: 'details',
            selector: 'redoview'
        }
    ],
    models: [
        'OrderLineItems',
        'RedoLineItems'
    ],
    stories: [
        'OrderLineItems',
        'RedoLineItems'
    ],
    init: function () {

        var me = this;

        this.control({
            'details': {
                afterrender: me.initValue
            }
        });
    },

    /*
     * 初始化数据
     * */
    initValue:function(){

    },

    /*
     *添加重做订单项
     * */
    addRedoItem:function(btn,datas,mask,orderitems,deletePath){
        var redoItemStore=null,me=this;
        var redoPage=orderitems.ownerCt;
        if(redoPage){
            if(redoPage.getComponent('redoItemList')){
                redoItemStore=redoPage.getComponent('redoItemList').getStore()
            }
        }
        me.redoDataReload(datas,redoItemStore,deletePath);
        mask.hide();
        Ext.getCmp('saveRedoOrder').setDisabled(true);
        Ext.getCmp('saveRedoItem').setDisabled(false);
        btn.ownerCt.ownerCt.close();
        //redoItemWindow.cls
    },
    redoDataReload:function(datas,redoItemStore,deletePath){

        if(deletePath&&deletePath.length>0){
            Ext.Array.each(deletePath,function(item){
                var deleteIndex=redoItemStore.findBy(function(record){
                    return item.originalOrderItemId==record.get('originalOrderItemId')&&item.materialPath==record.get('materialPath')
                });
                if(deleteIndex>-1){
                    redoItemStore.removeAt(deleteIndex);
                }
            })
        }
        var errorMsg='';
        var newItems=[];
        //合并已添加项数量
        Ext.Array.each(datas,function(item){
            var addedIndex=redoItemStore.findBy(function(record){
                return item.originalOrderItemId==record.get('originalOrderItemId')&&item.materialPath==record.get('materialPath')
            });
            if(addedIndex>-1){
                var merg=redoItemStore.getAt(addedIndex);
                var qty=item.qty;
                if(qty>item.originalqty*item.orderItemQty){
                    errorMsg+=i18n.getKey('redo')+i18n.getKey('item')+(Ext.isEmpty(item.materialPath)?i18n.getKey('product')+item.productId:i18n.getKey('materialPath')+item.materialPath)+'数量超过总数:'+item.originalqty+'\n'
                }
                else{
                    merg.set('qty',qty);
                }
            }
            else{
                newItems.push(item);
            }
        });
        if(!Ext.isEmpty(errorMsg)){
            Ext.Msg.alert(i18n.getKey('info'),errorMsg);
            return false;
        }
        redoItemStore.loadData(newItems,true);
    },
    /*
    * 保存重做订单
    * */
    saveRedoOrder:function(mask,me,redoType){
        var order=me.orderRecord,status=me.status;
        var redoOrder=Ext.create('CGP.redodetails.model.RedoOrder');
        var deliveryAddress={
            "firstName" : order.get('deliveryName'),
            "lastName":'',
            "state" : order.get('deliveryState'),
            "city" : order.get('deliveryCity'),
            "suburb" : order.get('deliverySuburb'),
            "postcode" : order.get('deliveryPostcode'),
            "streetAddress1" : order.get('deliveryStreetAddress1'),
            "streetAddress2" : order.get('deliveryStreetAddress2'),
            "telephone" : order.get('deliveryTelephone'),
            "mobile" : order.get('deliveryMobile'),
            "emailAddress" : order.get('deliveryEmail'),
            "countryCode2" : order.get('deliveryCountryCode2'),
            "countryName" : order.get('deliveryCountry'),
            "sortOrder" : 1
        };
        var redoItems=this.getItems(me,redoType);

        redoOrder.set('originalOrderNumber',order.get('orderNumber'));
        redoOrder.set('deliveryAddress',deliveryAddress);
        redoOrder.set('lineItems',redoItems);
        var method = "POST", url= adminPath + 'api/orders/redo';
        Ext.Ajax.request({
            url : url,
            method : method,
            headers : {
                Authorization: 'Bearer '+ Ext.util.Cookies.get('token')
            },
            jsonData : redoOrder.data,
            success : function(response,options){
                var resp = Ext.JSON.decode(response.responseText);
                if(resp.success){
                    mask.hide();
                    Ext.Msg.confirm(i18n.getKey('confirm'),i18n.getKey('create')+i18n.getKey('redo')+i18n.getKey('order')+':'+resp.data.orderNumber+i18n.getKey('is')+i18n.getKey('jumpto')+i18n.getKey('orderDetails'),function(option){
                        if(option=='yes'){
                            var id = resp.data.id;
                            JSOpen({
                                id: 'orderDetails',
                                url: path + 'partials/orderitemsmultipleaddress/main.html?id=' + id + '&status=' + status + '&orderNumber=' + resp.data.orderNumber,
                                title: i18n.getKey('orderDetails') + '(' + i18n.getKey('orderNumber') + ':' + resp.data.orderNumber + ')',
                                refresh: true
                            });
                        }
                    });
                }else{
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure')+resp.data.message)
                }
            },
            failure : function(response,options){
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure') + object.data.message);
            },
            callback : function(){
                mask.hide();
            }
        });
    },

    /*
    *获取重做订单项
    * */
    getItems:function(me,redoType){
        var redoItems=[];
        if(redoType=='redoItem'){
            var redoItemStore=me.getComponent('redoItemList').store;
            redoItemStore.each(function(record){
                var redoItem={
                    originalOrderItemId:record.get('originalOrderItemId'),
                    productId:record.get('productId'),
                    qty:record.get('qty'),
                    materialPath:record.get('materialPath').replace(new RegExp('-','g'),','),
                    comment:'',
                    bindOrderItemId:''
                }
                redoItems.push(redoItem);
            });
        }
        else{
            var itemStore=me.getComponent('originallineitem').store;
            itemStore.each(function(record){
                var redoItem={
                    originalOrderItemId:record.get('id'),
                    productId:record.get('product').id,
                    qty:record.get('qty'),
                    materialPath:'',
                    comment:'',
                    bindOrderItemId:''
                }
                redoItems.push(redoItem);
            });
        }
        return redoItems;
    },

    /*
    * 获取可组成产品数量
    * */
    getProductCount:function(SMUtree,redoItems,max){
        var me=this;
        var productCount=max;
        var rootnode=SMUtree.getRootNode( );

        return me.nodeChecking(rootnode,redoItems,productCount);
    },
    /*
    *
    * */
    nodeChecking:function(node,redoItems,productCount){
        var me=this;
        node.eachChild(function(node){
            if(productCount>0){

                var nodeContain=Ext.Array.filter(redoItems,function(item){
                    return item.materialPath.startsWith(node.get('_id'));
                });
                if(Ext.isEmpty(nodeContain)||nodeContain.length<1){
                    productCount= 0;
                }
                else{
                    var nodeAdded=Ext.Array.filter(redoItems,function(item){
                        return item.materialPath==node.get('_id');
                    });
                    if(!Ext.isEmpty(nodeAdded)&&nodeAdded.length>0){
                        var urrCount=Math.floor(nodeAdded[0].qty/node.get('originalqty'));
                        productCount=productCount>urrCount?urrCount:productCount;
                    }
                    else{
                        productCount=me.nodeChecking(node,redoItems,productCount)
                    }
                }
            }
        });
        return productCount;
    },

    /*
    *合并重做物料项
    * */
    mergerRedoList:function(redoMaterials,materialTree,productCount,addedProductQty){
        var resultData=[];
        var msgTemplate=new Ext.XTemplate(
            '<p>'+i18n.getKey('material')+':</p>',
            '<tpl for=".">',
                '<p>{materialName}<{materialPath}>:{originalqty*'+productCount+'}</p>',
            '</tpl>'
        );
        var msg=msgTemplate.apply(redoMaterials);
        msg+='<p>'+i18n.getKey('buildUp')+i18n.getKey('product')+':</p><p>'+redoMaterials[0].productName+'<'+redoMaterials[0].productId+'>:'+productCount+'</p>';
        Ext.Msg.alert(i18n.getKey('info'),msg);

        var realDatas=Ext.Array.map(redoMaterials,function(item){
            item.qty=item.qty-productCount * item.originalqty;
            return item;
        });
        var redoProduct=Ext.clone(realDatas[0]);
        redoProduct.materialPath='';
        redoProduct.originalqty=1;
        redoProduct.qty=productCount + addedProductQty;
        redoProduct.redoType='redoProduct';
        resultData=Ext.Array.filter(realDatas,function(item){ return item.qty>0;});
        resultData.push(redoProduct);
        Ext.Array.each(realDatas,function(item){
            if(item.qty==0){
                materialTree.deletePath.push(item);
            }
        });
        return resultData;
    }
   });
