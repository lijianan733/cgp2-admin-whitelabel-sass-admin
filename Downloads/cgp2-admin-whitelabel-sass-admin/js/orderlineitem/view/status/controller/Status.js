Ext.define('CGP.orderlineitem.view.status.controller.Status', {
    extend: 'Ext.app.Controller',



    refs: [{
        ref: 'form',
        selector: 'orderstatus'
    }, {
        ref: 'shipmentInfo',
        selector: 'shipmentinfo'
    }],

    requires: ['CGP.orderlineitem.model.OrderLineItem'],

    constructor: function () {

        var me = this;

        var searcher = Ext.Object.fromQueryString(document.location.search);
        var id;
        if (!Ext.isEmpty(searcher) && searcher.id) {
            me.id = searcher.id;
        }
        me.orderLineItemId = searcher.orderLineItemId;


        me.callParent(arguments);
    },

    loadOrderDetail: function () {

        var me = this,
            id = me.id;
        var form = me.getForm();
        var model = Ext.ModelManager.getModel('CGP.orderlineitem.model.OrderLineItem');
        var orderModel = Ext.ModelManager.getModel('CGP.orderlineitem.view.status.model.OrderDetail');
        var lm = form.setLoading(i18n.getKey('loading'));
        Ext.Ajax.request({
            method: 'GET',
            url: adminPath + 'api/orders/' + id +'/v2',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            timeout: 3000000,
            success: function (response) {
                var r = Ext.JSON.decode(response.responseText);
                if (!r.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), r.message);
                    lm.hide();
                    return ;
                }else{
                    var order = Ext.create('CGP.orderlineitem.view.status.model.OrderDetail',r.data);
                    model.load(me.orderLineItemId, {
                        success: function (record, operation) {

                            if (!operation.getResultSet().success) {
                                Ext.Msg.alert(i18n.getKey('prompt'), operation.getResultSet().message);
                            }
                            form.setData(record,order);
                            me.record = record;
                            me.order = order;
                            lm.hide();
                        },
                        failure: function (record, operation) {
                            lm.hide();
                            Ext.Msg.alert(i18n.getKey('prompt'), operation.getError());
                        }
                    })
                }

            },
            failure: function (response) {
                var r = Ext.JSON.decode(response.responseText);
                lm.hide();
                Ext.Msg.alert(i18n.getKey('prompt'), r.message);
            }
        });
        /*orderModel.load(me.id,{
            success: function (order, operation) {

                if (!operation.getResultSet().success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), operation.getResultSet().message);
                }
                model.load(me.orderLineItemId, {
                    success: function (record, operation) {

                        if (!operation.getResultSet().success) {
                            Ext.Msg.alert(i18n.getKey('prompt'), operation.getResultSet().message);
                        }
                        form.setData(record,order);
                        me.record = record;
                        me.order = order;
                        lm.hide();
                    },
                    failure: function (record, operation) {
                        lm.hide();
                        Ext.Msg.alert(i18n.getKey('prompt'), operation.getError());
                    }
                })

            },
            failure: function (record, operation) {
                Ext.Msg.alert(i18n.getKey('prompt'), operation.getError());
            }
        });*/
    },

    saveStatus: function () {
        var me = this,
            id = me.id;
        var form = me.getForm();
            if(!form.getComponent('orderStatus').getSubmitValue()) {
                Ext.Msg.alert(i18n.getKey('prompt'),"选择需要修改的订单状态！");
                return;
            }

        var data = form.getData();

        var loadMask = form.setLoading(i18n.getKey('submiting'));
        Ext.Ajax.request({
            method: 'PUT',
            url: adminPath + 'api/orderItems/'+me.orderLineItemId+'/status/v2',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response, options) {
                var r = Ext.JSON.decode(response.responseText);
                if (!r.success) {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), r.data.message);
                    return;
                }
                loadMask.hide();
                me.afterSave();
            },
            failure: function (response, options) {
                loadMask.hide();
                var resp = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
            }
        });

    },
    /**
     *保存成功之后调到订单列表 并且刷新订单列表
     */
    afterSave: function () {

        if (parent && parent.frames['tabs_iframe_orderlineitempage']) {
            //设置订单列表为活动tab
            window.parent.Ext.getCmp('tabs').setActiveTab('orderlineitempage');

            //刷新列表  调用orderLineItem列表页面的刷新方法
            parent.frames['tabs_iframe_orderlineitempage'].contentWindow.refreshGrid();
        }

        //关闭当前页
        window.parent.Ext.getCmp('tabs').remove('modifyOrderLineItemStatus');
    },
    // 2025.12.5 关闭该功能 接口有问题且订单项不需要展示发货信息
    checkNeedShipmentBox: function(statusId,orderItemId){
        var isNeed ;
        Ext.Ajax.request({
            url: adminPath + 'api/orderItemStatuses/'+statusId+'/orderItems/'+orderItemId+'/needShipmentBox',
            method: 'GET',
            async: false,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function(rep){
                var response = Ext.JSON.decode(rep.responseText);
                if(response.success){
                    isNeed = response.data.need;

                }else{
                    Ext.Msg.alert('提示','上传失败！'+response.data.message);
                    return;
                }
            },
            failure: function(resp){
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                return;
            }
        });
        return isNeed;
    },
    
    // 2025.12.5 关闭该功能 接口有问题且订单项不需要展示发货信息
    checkNeedShipmentInfo: function(statusId,orderItemId){
        var isNeed ;
        Ext.Ajax.request({
            url: adminPath + 'api/orderItemStatuses/'+statusId+'/orderItems/'+orderItemId+'/needShipmentInfo',
            method: 'GET',
            async: false,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function(rep){
                var response = Ext.JSON.decode(rep.responseText);
                if(response.success){
                    isNeed = response.data.need;

                }else{
                    Ext.Msg.alert('提示','上传失败！'+response.data.message);
                    return;
                }
            },
            failure: function(resp){
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                return;
            }
        });
        return isNeed;
    },

    saveUserParams:function (btn){
        var win = btn.ownerCt.ownerCt;
        if (!win.isValid()) {
            return false;
        }
        var data = win.getValue();
        var mask=win.setLoading(i18n.getKey('loading'));
        var method = 'PUT',url=adminPath + 'api/orderItems/'+win.orderItemId+'/userImpositionParams';
        var request = {
            url: url,
            method: method,
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var resp = Ext.JSON.decode(res.responseText);
                if (resp.success) {
                    var itemUserParams=Ext.data.StoreManager.lookup('itemUserParams');
                    itemUserParams.load();
                    Ext.Msg.alert('提示', '保存成功！');
                    mask.hide();
                    win.close();
                } else {
                    Ext.Msg.alert('提示', '请求错误：' + resp.data.message)
                    mask.hide();
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                mask.hide();
            }
        };
        Ext.Ajax.request(request);
    },

    setUserParams:function (wind){
        Ext.Ajax.request({
            method: 'GET',
            url: adminPath + 'api/orderItems/'+wind.orderItemId+'/userImpositionParams',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                var r = Ext.JSON.decode(response.responseText);
                if (r.success) {
                    wind.setValue(r.data)
                }else{
                    Ext.Msg.alert(i18n.getKey('prompt'), r.message);
                    return ;
                }
            },
            failure: function (response) {
                var r = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('prompt'), r.message);
            }
        });
    }
});
