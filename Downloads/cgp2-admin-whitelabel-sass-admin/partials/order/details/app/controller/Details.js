Ext.define('CGP.orderdetails.controller.Details', {
    extend: 'Ext.app.Controller',

    views: [
        'Details',
        'Window',
        'details.Delivery',
        'details.Contact',
        'details.Shipping',
        'details.Payment',
        'details.Invoice',
        'details.LineItems',
        'details.EditLineItems',
        'details.OrderLineItem',
        'details.OrderTotal',
        'details.Order',
        'details.Status',

        'edit.Contact',
        'edit.Shipping',
        'edit.Delivery',
        'edit.Payment',
        'edit.Invoice',
        'interface.Valuable',
        'interface.Syncable',

        'lineitem.Photo'

    ],

    refs: [
        {
            ref: 'details',
            selector: 'details'
        },
        {
            ref: 'contact',
            selector: 'detailscontact'
        },
        {
            ref: 'shipping',
            selector: 'detailsshipping'
        },
        {
            ref: 'orderLineItem',
            selector: 'detailsorderlineitem'
        },
        {
            ref: 'payment',
            selector: 'detailspayment'
        },
        {
            ref: 'delivery',
            selector: 'detailsdelivery'
        },
        {
            ref: 'invoice',
            selector: 'detailsinvoice'
        },
        {
            ref: 'orderTotalView',
            selector: 'ordertotal'
        },
        {
            ref: 'editLineItems',
            selector: 'detailseditlineitems'
        },
        {
            ref: 'status',
            selector: 'detailsstatus'
        },
        {
            ref: 'contactEditor',
            selector: 'contacteditor'
        },
        {
            ref: 'shippingEditor',
            selector: 'shippingeditor'
        },
        {
            ref: 'paymentEditor',
            selector: 'paymenteditor'
        },
        {
            ref: 'deliveryEditor',
            selector: 'deliveryeditor'
        },
        {
            ref: 'invoiceEditor',
            selector: 'invocieeditor'
        },
        {
            ref: 'window',
            selector: 'editorwindow'
        },
        {
            ref: 'photos',
            selector: 'photos'
        }
    ],

    models: [
        'Order',
        'LineItems',
        'OrderTotal',
        'ShippingMethod',
        'PaymentMethod',
        'DeliveryInfoModel'
    ],
    stories: [
        'LineItems',
        'OrderTotal',
        'Country',
        'ShippingMethod',
        'PaymentMethod',
        'WorkOrderLineItemStorage',
        'CustomsCategroyStore'
    ],

    init: function () {

        var me = this;

        this.control({
            'details': {
                afterrender: me.initValue
            },
            'detailscontact button[action=edit]': {
                click: me.editContact
            },
            'contacteditor button[action=save]': {
                click: me.saveContact
            },
            'detailsshipping button[action=edit]': {
                click: me.editShipping
            },
            'detailspayment button[action=edit]': {
                click: me.editPayment
            },
            'detailsdelivery button[action=edit]': {
                click: me.editDelivery
            },
            'detailsinvoice button[action=edit]': {
                click: me.editInvoice
            },
            'detailsstatus button[action=submitqty]': {
                click: me.toNextStatus
            },
            'detailseditlineitems button[action=undocompleted]': {
                click: me.undoCompleted
            },
            'detailslineitems button[action=viewdesignimage]': {
                click: me.viewPhotos
            },
            'photos button[action=download]': {
                click: me.downloadImage
            }
        });
    },


    /**
     *初始化数据
     **/
    initValue: function (details) {

        var me = this;
        var details = me.getDetails();
        var searcher = Ext.Object.fromQueryString(location.search);
        var hasProducer = false;
        var producePartner = {};
        if (searcher.id) {
            var id = searcher.id;
            var loadMask = details.setLoading(i18n.getKey('loading'));
            Ext.Ajax.request({
                method: 'GET',
                url: adminPath + 'api/orders/' + id + '/v2',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (resp, operation) {
                    var response = Ext.JSON.decode(resp.responseText);
                    if (response.success) {
                        var order = Ext.create('CGP.orderdetails.model.Order', response.data);
                        me.order = order;
                        var name = order.get('deliveryName');
                        if (!Ext.isEmpty(name)) {
                            var names = name.split(' ');
                            var firstName = names[0];
                            var lastname;
                            if (names.length > 1) {

                                lastname = names[1];
                            }
                            order.set('deliveryFirstName', firstName);
                            order.set('deliveryLastName', lastname);
                        }
                        order.set('deliveryLastName', lastname);
                        order.set('hasProducer', !Ext.isEmpty(order.get('producePartner')));
                        me.getOrderLineItem().mainRenderer.order = order;//把order作为mainRender中的一个属性
                        details.setValue(order);
                        var editLineItems = me.getEditLineItems();
                        if (!Ext.Array.contains([103, 104, 105, 200, 202, 203, 400, 401, 402], order.get('status').id)) {
                            me.replaceEditLineItem(order);
                        }
                        loadMask.hide();
                    } else {
                        loadMask.hide();
                        console.log(i18n.getKey('prompt'), response.data.message);
                    }
                },
                failure: function (resp, operation) {
                    loadMask.hide();
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
        }

    },

    editContact: function () {

        var me = this;
        var order = me.getDetails().order;
        var editor = Ext.widget({
            xtype: 'contacteditor'
        });
        editor.setValue(order);
        editor.show();
    },

    editShipping: function () {

        var me = this;
        var order = me.getDetails().order;
        var shipping = me.getShipping();
        var editor = Ext.widget({
            xtype: 'shippingeditor'
        });
        editor.orderTotal = me.getOrderTotalView();
        editor.ownerPanel = shipping;
        editor.setValue(order);
        editor.show();

    },

    editPayment: function () {

        var me = this;
        var order = me.getDetails().order;
        var payment = me.getPayment();
        var editor = Ext.widget({
            xtype: 'paymenteditor'
        });
        editor.ownerPanel = payment;
        editor.setValue(order);
        editor.show();

    },

    editDelivery: function () {
        var me = this;
        var order = me.getDetails().order;
        var delivery = me.getDelivery();
        var editor = Ext.widget({
            xtype: 'deliveryeditor'
        });
        editor.ownerPanel = delivery;
        editor.setValue(order);
        editor.show();
    },

    editInvoice: function () {
        var me = this;
        var order = me.getDetails().order;
        var invoice = me.getInvoice();
        var editor = Ext.widget({
            xtype: 'invoiceeditor'
        });
        editor.ownerPanel = invoice;
        editor.setValue(order);
        editor.show();
    },


    saveContact: function () {
        var me = this;

        var details = me.getDetails();
        var order = details.order;
        var contactEditor = me.getContactEditor();

        var value = contactEditor.getValue();
        Ext.Object.each(value, function (k, v) {
            order.set(k, v);
        })
        me.getContact().setValue(details.order);
        contactEditor.close();
    },


    toNextStatus: function () {
        var me = this;
        var order = me.order;
        var producerStatuses = [103, 104, 105, 200, 202, 203, 400, 401, 402];
        var shippingStatues = [106, 107, 108, 109, 114, 115];
        if (Ext.Array.contains(producerStatuses, order.get('status').id)) {
            me.submitQty();
        }
        if (Ext.Array.contains(shippingStatues, order.get('status').id)) {
            me.shippingToNextStatus();
        }
    },

    submitQty: function () {

        var data = {};
        var me = this,
            i = 0;

        var editLineItems = me.getEditLineItems();
        var store = editLineItems.getStore();
        var status = me.getStatus();
        var commentField = status.getComponent('comment');
        var order = me.order;


        var lineItems = [];

        var errMessage = '';
        var allSelected = true;
        var records = editLineItems.getSelectionModel().getSelection();
        //当选中数量小于总数量时
        if (records.length < store.getCount()) {
            var otherRecords = [];
            store.each(function (r) {
                if (!Ext.Array.contains(records, r)) {
                    otherRecords.push(r);
                }
            });
            for (; i < otherRecords.length; i++) {
                if (otherRecords[i].get('statusId') !== 10) {
                    allSelected = false;
                }
            }
        }
        if (records.length == 0) {
            errMessage = "必须选中提交的产品";
        }


        var completed = 0;

        Ext.Array.each(records, function (record) {
            var item = {};
            item.id = record.get('id');
            if (record.get('statusId') == 10) {
                completed++;
            } else {
                var presentQtyField = editLineItems.down('numberfield[submitId=' + item.id + ']');
                var presentQty = presentQtyField.getValue();
                if (Ext.isEmpty(presentQty) || presentQty == 0) {
                    errMessage = "输入数量不能为0";
                    return false;
                }
                item.submitQty = presentQtyField.getValue();
                if (item.submitQty + controller.getTotalCompletedQty(record) == record.get('qty')) {
                    completed++;
                }
                if (record.get('completedQty') != record.get('qty'))
                    lineItems.push(item);
            }

        });

        editLineItems.getStore().each(function (record) {
            if (record.get('completedQty') == record.get('qty')) {
                completed++;
            }
        });

        if (completed == records.length && allSelected === true) {
            completed = true;
        }

        if (errMessage) {
            Ext.Msg.alert(i18n.getKey('prompt'), errMessage);
            return;
        }


        data = {
            completed: completed,
            id: order.get('id'),
            comment: commentField.getValue(),
            lineItems: lineItems
        };
        if (!status.isValid()) {
            return;
        }
        var shipmentBox = status.getComponent('shipmentBox');
        if (shipmentBox) {
            data['shipmentBox'] = shipmentBox.getValue();
        }
        var shipmentInfo = status.getComponent('shipmentInfo');
        if (shipmentInfo) {
            data['shipmentInfo'] = shipmentInfo.getValue();
        }
        Ext.Ajax.request({
            method: 'PUT',
            url: adminPath + 'api/orders/' + data.id + '/completedQty',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success) {
                    if (completed === true) {
                        me.afterSave();
                    } else {
                        location.reload();
                    }

                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), response.data.message);
                }
            },
            failure: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })


    },

    shippingToNextStatus: function () {
        console.log('shipping status');

        var data = {};
        var me = this;

        var editLineItems = me.getEditLineItems();
        var status = me.getStatus();
        var commentField = status.getComponent('comment');
        var order = me.order;

        if (!status.isValid()) {
            return;
        }
        //检查是否需要输入发货信息  只有全部订单项都生产完成后才需要输入
        if (order.get('status').id == 106) {

            var shipmentInfo = status.getComponent('shipmentInfo');
            data.shipmentInfo = shipmentInfo.getValue();
        }

        if (order.get('status').id == 115) {

            var shipmentInfo = status.getComponent('shipmentInfo');
            var shipmentBox = status.getComponent('shipmentBox');
            data.shipmentBox = shipmentBox.getValue();
            data.shipmentInfo = shipmentInfo.getValue();
        }

        data.comment = commentField.getValue();
        data.statusId = order.get('status').id;
        Ext.Ajax.request({
            method: 'PUT',
            url: adminPath + 'api/orders/' + order.get('id') + '/completeCurrentStatus',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success) {
                    me.afterSave();
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), response.data.message);
                }
            },
            failure: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },

    /**
     *保存成功之后调到订单列表 并且刷新订单列表
     */
    afterSave: function () {

        if (parent && parent.frames['tabs_iframe_orderpage']) {
            //设置订单列表为活动tab
            window.parent.Ext.getCmp('tabs').setActiveTab('orderpage');

            //刷新列表  调用order列表页面的刷新方法
            parent.frames['tabs_iframe_orderpage'].contentWindow.refreshGrid();
        }

        if (parent && parent.frames['tabs_iframe_workpage']) {
            JSOpen({
                id: 'workpage',
                refresh: true
            });
        }

        //关闭当前页
        window.parent.Ext.getCmp('tabs').remove('orderDetails');
    },


    replaceEditLineItem: function (order) {

        var me = this;

        var details = me.getDetails();
        var items = details.items;
        var editLineItems = me.getEditLineItems();
        var lineItems = me.getOrderLineItem();
        if (editLineItems && !lineItems) {

            lineItems = Ext.widget({
                xtype: 'detailsorderlineitem'
            });
            if (lineItems.setValue)
                lineItems.setValue(order);
            var index = getCmpIndex(items, editLineItems);
            details.remove(editLineItems);
            details.insert(index, lineItems);
        }

        function getCmpIndex(items, cmp) {

            var i;

            items.each(function (item, index) {
                if (item == cmp) {
                    i = index;
                    return false;
                }
            })

            return i;
        }

    },

    undoCompleted: function (button) {
        var me = this;
        var seqNo = button.seqNo;
        var orderId = me.order.get('id');


        var editLineItems = me.getEditLineItems();

        var data = {
            id: orderId,
            lineItems: [
                {
                    seqNo: seqNo
                }
            ]
        };

        Ext.Ajax.request({
            method: 'DELETE',
            url: adminPath + 'api/orders/' + data.id + '/completedQty',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success) {
                    var order = Ext.create('CGP.orderdetails.model.Order', response.data);

                    editLineItems.setValue(order);

                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('undoSuccess'));
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), response.data.message);
                }
            },
            failure: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },

    viewPhotos: function (button) {
        var me = this;
        var projectId = button.projectId;
        var photos = new CGP.orderdetails.view.lineitem.Photo({
            projectId: projectId
        });
    },

    downloadImage: function (button) {
        //        window.location.href = adminPath + 'file/download?url=' + button.fileUrl + '&fileName=' + button.fileName;
        var url = adminPath + 'file/download?url=' + button.fileUrl + '&fileName=' + button.fileName;
        var window = new Ext.window.Window({
            html: '<iframe src="' + url + '"></iframe>',
            width: 0,
            height: 0
        });
        window.show();
        window.close();
    }


})