/**
 * Customer
 * @Author: miao
 * @Date: 2022/3/15
 */
Ext.define("CGP.customer.controller.Customer", {
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    },

    addProductWindow: function (email, store) {
        var me=this;
        var wind = Ext.create('Ext.ux.window.SuperWindow', {
            width: '80%',
            height: '80%',
            title: i18n.getKey('select')+i18n.getKey('product'),
            layout: 'fit',
            bodyPadding: 0,
            confirmHandler: function (btn) {
                var productList = wind.getComponent('productList');
                if (productList.selectedRecord.getCount() > 0) {
                    var productIds=[];
                    productList.selectedRecord.each(function (item){
                        productIds.push(item['id']);
                    })
                    me.saveUserProduct(email,productIds,store,wind);
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), '请先选择要添加的产品');
                }
            },
            items: [
                Ext.create('CGP.customer.view.ProductList', {
                    itemId: 'productList',
                    email: email
                })
            ]
        }).show();
    },
    saveUserProduct:function (email,productIds,store,wind){
        var succfn=function (response, options) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('add') + i18n.getKey('success'));
                store.reload();
                wind.close();
            }
            else{
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message);
            }
        };
        var url=adminPath + 'api/productAdministratorConfigs/users/products?email='+email,method='POST';
        Ext.Ajax.request({
            url: url ,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            async: true,
            jsonData: productIds,
            success: succfn,
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {

            }
        });
    },
    deleteUserProduct:function (email,productIds,store){
        var succfn=function (response, options) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('delete') + i18n.getKey('success'));
                store.reload();
                wind.close();
            }
            else{
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('deleteFailure') + resp.data.message);
            }
        };
        var url=adminPath + 'api/productAdministratorConfigs/users/products?email='+email,method='DELETE';
        Ext.Ajax.request({
            url: url ,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            async: true,
            jsonData: productIds,
            success: succfn,
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {

            }
        });
    }
})