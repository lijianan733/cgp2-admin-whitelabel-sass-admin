/**
 * Created by admin on 2019/9/30.
 */
Ext.Loader.setPath({
    enabled: true,
    'CGP.orderdetails': path + 'partials/order/details/app/'
});
Ext.define("CGP.redodetails.view.RedoRender",{
    order: null,//用于保存加载的order数据
    commonController: Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
    redoController:Ext.create('CGP.redodetails.controller.RedoDetails'),
    constructor: function () {
        this.callParent(arguments);
    },
    //item info
    renderItemInfo: function (value, metadata, record) {
        var me = this;
        var qty = record.get('qty');

        var items = [
            {
                title: i18n.getKey('orderedQty'),
                value: '<font color=red>' + qty + '</font>'
            }
        ];
        return JSCreateHTMLTable(items);
    },

    rendererImage: function (value, metadata, record) {
        var image;
        var urlPrefix;
        var thumbnail = record.get('productInstance').thumbnail;
        if (!Ext.isEmpty(thumbnail)) {
            urlPrefix = projectThumbServer;
            image = thumbnail;
        } else {
            var product = record.get('product');
            if (product.defaultImage) {
                image = product.defaultImage.name;
            } else {
                if (Ext.isEmpty(product.medias)) {
                    image = '';
                } else {
                    image = product.medias[0].name;
                }
            }
            urlPrefix = imageServer;
        }
        if (Ext.isEmpty(value) && Ext.isEmpty(image)) {
            return '';
        }
        var imgSize = '/100/100/png?' + Math.random();
        return {
            xtype: 'imagecolumn',
            width: 100,
            height: 100,
            buildUrl: function () {
                return image ? (urlPrefix + image) : (value);
            },
            buildPreUrl: function () {
                return image ? (urlPrefix + image) : (value);
            },
            buildTitle: function () {
                return `${i18n.getKey('check')} < ${value} > 预览图`;
            }
        }
    },

    //product info
    renderProductInfo: function (value, metadata, record) {
        var me = this;
        var productInstance = record.get('productInstance');
        var isShowCustomsCategory = Ext.Array.contains(['300', '100', '101', '118'], Ext.Object.fromQueryString(location.search).status);//获取订单状态
        var customsCategoryId = record.get('customsCategoryId');
        var isConfirmCustomsCategory = !Ext.isEmpty(record.get('customsCategoryId'));//报关分类是否已经确定
        var model = record.get('productModel');
        var sku = record.get("productSku");
        var uploadFiles = record.get('uploadFiles');
        var items = [
            {
                title: i18n.getKey('name'),
                value: value
            },
            {
                title: i18n.getKey('model'),
                value: model
            },
            {
                title: 'Sku',
                value: sku
            }
        ];
        if (uploadFiles.length > 0) {
            var links = [];
            for (var i = 0; i < uploadFiles.length; i++) {
                var uploadFile = uploadFiles[i];
                links.push('<li><a target="_blank" href="' + imageServer + uploadFile.name + '">' + uploadFile.originalFileName + '</a></ol>');
            }
            items.push({
                title: i18n.getKey('userCustomFile'),
                value: '<ol>' + links.join('<br/>' + '</ol>')
            });
        }
        var builderEditUrl = '';
        var locale = Ext.util.Cookies.get('lang');
        if (/*!(Ext.isEmpty(builderEditUrl) || !isShowCustomsCategory)*/isShowCustomsCategory) {//处于300，101,100状态才进行处理,现在有无builder预览地址都会有报关相关处理
            var isNeedCustoms = false;//是否需要报关
            var productId = record.get('product').id;
            Ext.Ajax.request({
                url: encodeURI(adminPath + 'api/customsElement?filter=' + Ext.JSON.encode([
                    {
                        name: 'productId',
                        type: 'number',
                        value: productId
                    }
                ]) + '&page=1&start=0&limit=25'),
                method: 'GET',
                async: false,//同步执行
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.data.content.length > 0) {
                        isNeedCustoms = responseMessage.data.content[0].outCustoms;
                    } else {
                        isNeedCustoms = false//没有报关要素是，默认不报关
                    }
                }
            })
            if (isNeedCustoms) {
                if (isConfirmCustomsCategory) {
                    Ext.Ajax.request({
                            url: adminPath + 'api/customsCategory/' + customsCategoryId,
                            method: 'GET',
                            async: false,//同步执行
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (response) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                if (responseMessage.success) {
                                    items.push({
                                        title: '<font color="red">' + i18n.getKey('customsCategory') + '</font>',
                                        value: '<font color="red">' + i18n.getKey(responseMessage.data.outName) + '</font>'
                                    });

                                }
                            }
                        }
                    )
                } else {
                    items.push({
                        title: '<font color="red">' + i18n.getKey('customsCategory') + '</font>',
                        value: '<font color="red">' + i18n.getKey('classifyIsNotConfirm') + '</font>'
                    });
                }
            }
        }
        return JSCreateHTMLTable(items);
    },

    //Redo Operation
    renderRedoOperation: function(value, metadata, record,orderitems){
        var me=this;
        var result = {
            xtype: 'fieldcontainer',
            layout: 'vbox',
            fieldDefaults: {
                margin: '0 0 0 10'
            },
            items: []
        };
        result.items=[
            {
                xtype: 'displayfield',
                value: '<a href="#" style="color: blue" )>' + i18n.getKey('product')+ i18n.getKey('redo') + '</a>  ',
                listeners: {
                    render: function (display) {
                        var a = display.el.dom.getElementsByTagName('a')[0];
                        var ela = Ext.fly(a);
                        ela.on("click", function (btn,event) {
                            //var btnContainer=btn.ownerCt.ownerCt;
                            Ext.create('CGP.redodetails.view.redopruduct',{
                                record:record,
                                orderitems:orderitems
                            }).show();
                        });
                    }
                }
            },
            {
                xtype: 'displayfield',
                value: '<a href="#" style="color: blue" >' + i18n.getKey('material')+ i18n.getKey('redo') + '</a>  ',
                listeners: {
                    render: function (display) {
                        var a = display.el.dom.getElementsByTagName('a')[0];
                        var ela = Ext.fly(a);
                        ela.on("click", function (btn,event) {
                            Ext.create('CGP.redodetails.view.RedoMaterialWindow',{
                                record:record,
                                orderitems:orderitems
                            }).show();
                        });
                    }
                }
            }];
        return result;
    },

    //original item info
    renderOriginalInfo:function(value, record, metadata){
        var items = [
            {
                title: i18n.getKey('id'),
                value: record.get('originalOrderItemId')
            },
            {
                title: i18n.getKey('product')+'sku',
                value: record.get('sku')
            },
            {
                title: i18n.getKey('productName'),
                value: record.get('productName')
            }
        ];
        return JSCreateHTMLTable(items);
    },

    //redo type
    renderRedoType:function(value, metadata, record, detailsComp){
        return i18n.getKey(value);
    },
    //redo item information
    renderRedoItemInfo:function(value, metadata, record){
        var items =[];
        if(record.get('redoType')=='redoProduct'){
            items=[
                {
                    title: i18n.getKey('productName'),
                    value: record.get('productName')
                },
                {
                    title: i18n.getKey('product')+'sku',
                    value: record.get('sku')
                },
                {
                    title: i18n.getKey('product')+i18n.getKey('id'),
                    value: record.get('originalOrderItemId')
                }];
        }
        else{
            items=[
                {
                    title: i18n.getKey('materialName'),
                    value: record.get('materialName')
                },
                {
                    title: i18n.getKey('material')+i18n.getKey('id'),
                    value: record.get('materialId')
                },
                {
                    title: i18n.getKey('material')+i18n.getKey('path'),
                    value: record.get('materialPath')
                }];
        }
        return JSCreateHTMLTable(items);
    },
    //redo item qty
    renderQty:function(value, metadata, record,redoItems){
        var me=this;
        var result = {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            fieldDefaults: {
                margin: '0 0 0 10'
            },
            items: []
        };
        result.items=[
            {
                xtype: 'numberfield',
                value: record.get('qty'),
                maxValue:record.get('originalqty')*record.get('orderItemQty'),
                minValue:1,
                allowBlank:false,
                width:100,
                height:30,
                listeners: {
                    change: Ext.Function.createBuffered(function (field,newValue,oldValue,eOpts ) {
                        if(!field.isValid()){
                            return false;
                        }
                        record.data.qty=newValue;
                        if(record.get('redoType')=='redoMaterial'){
                            var materialTree=redoItems.SMUtrees[record.get('originalOrderItemId')];
                            var addedMaterial=[], addedProduct=null;
                            redoItems.store.each(function(redoRecord){
                                if(redoRecord.get('originalOrderItemId')==record.get('originalOrderItemId')&&redoRecord.get('redoType')=='redoMaterial'){
                                    addedMaterial.push(redoRecord.data);
                                }
                                if(redoRecord.get('originalOrderItemId')==record.get('originalOrderItemId')&&redoRecord.get('redoType')=='redoProduct'){
                                    addedProduct=redoRecord.data;
                                }
                            });
                            if(materialTree){
                                materialTree.materialItems=[];
                                materialTree.deletePath=[];
                                materialTree.materialItems.push(record.data);
                                var productCount=me.redoController.getProductCount(materialTree.store,addedMaterial,record.get('orderItemQty'));
                                if(productCount>0) {//物料可组成产品
                                    var submitData = me.redoController.mergerRedoList(addedMaterial, materialTree,productCount,addedProduct.qty);
                                    me.redoController.redoDataReload(submitData,redoItems.getStore(),materialTree.deletePath);
                                }
                            }
                        }
                    },600),
                    blur:function (field) {
                        if(!field.validate()){
                            field.focus();
                            field.selectText();
                            Ext.Msg.alert(i18n.getKey('ErrorInfo'),field.getErrors());
                            return false;
                        }
                    }
                }
            },
            {
                xtype: 'displayfield',
                value: record.get('originalqty')*record.get('orderItemQty')
            }];
        return result;
    }
});