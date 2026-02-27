/**
 *查看订单详情
 *修改订单状态status
 *order id通过url参数入
 *
 */
Ext.Loader.syncRequire([
    'CGP.orderstatus.store.OrderNextStatusStore'
])
Ext.onReady(function () {


    var id = initId();


    var form = new Ext.form.Panel({
        region: 'center',
        autoScroll: true,
        defaults: {
            labelWidth: 120,
            width: 500,
            labelAlign: 'right'
        },
        tbar: [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: saveStatus
            },
            {
                xtype: 'button',
                text: i18n.getKey('grid'),
                iconCls: 'icon_grid',
                handler: function () {
                    JSOpen({
                        id: 'page',
                        url: path + 'partials/order/order.html'
                    });
                }
            }],
        items: [
            {
                fieldLabel: i18n.getKey('orderNumber'),
                itemId: 'orderNumber',
                xtype: 'displayfield'
            },
            {
                fieldLabel: i18n.getKey('customerEmail'),
                itemId: 'customerEmail',
                xtype: 'displayfield'
            },
            {
                fieldLabel: i18n.getKey('datePurchased'),
                itemId: 'datePurchased',
                xtype: 'displayfield',
                renderer: function (value) {
                    return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
                }
            },
            {
                fieldLabel: i18n.getKey('shippingMethod'),
                itemId: 'shippingMethod',
                xtype: 'displayfield'
            },
            {
                fieldLabel: i18n.getKey('deliveryAddress'),
                itemId: 'deliveryAddress',
                xtype: 'displayfield'
            },
            {
                fieldLabel: i18n.getKey('orderHistories'),
                itemId: 'orderHistories',
                xtype: 'displayfield',
                width: 700
            },
            {
                fieldLabel: i18n.getKey('orderStatus'),
                itemId: 'currentStatus',
                xtype: 'displayfield'
            },
            {
                fieldLabel: i18n.getKey('modifyStatus'),
                itemId: 'orderStatus',
                name: 'status',
                xtype: 'combobox',
                editable: false,
                displayField: 'name',
                valueField: 'id',
                allowBlank: false,
                store: Ext.create('CGP.orderstatus.store.OrderNextStatusStore', {
                    orderId: id
                }),
                listeners: {
                    select: function (combo, records) {
                        var record = records[0];
                        var deliveryInfo = combo.ownerCt.getComponent('deliveryInformation');
                        if (record.get('id') == 107) {
                            deliveryInfo.setVisible(true);
                            Ext.getCmp('deliveryNo').allowBlank = false;
                            Ext.getCmp('deliveryDate').allowBlank = false;
                        } else {
                            deliveryInfo.setVisible(false);
                            Ext.getCmp('deliveryNo').allowBlank = true;
                            Ext.getCmp('deliveryDate').allowBlank = true;
                        }

                        if (record.get('id') == 101) {
                            form.getComponent('paidDate').setVisible(true);
                        } else {
                            form.getComponent('paidDate').setVisible(false);
                        }
                    }
                }
            },
            {
                fieldLabel: i18n.getKey('customerNotify'),
                xtype: 'checkboxfield',
                name: 'cutomerNotify',
                inputValue: true,
                itemId: 'customerNotify'
            },
            {
                fieldLabel: i18n.getKey('comment'),
                name: 'comment',
                xtype: 'textarea',
                itemId: 'comment'
            },
            {
                hideMode: 'display',
                fieldLabel: i18n.getKey('deliveryInformation'),
                xtype: 'fieldcontainer',
                itemId: 'deliveryInformation',
                items: [{
                    fieldLabel: i18n.getKey('deliveryNo'),
                    xtype: 'textfield',
                    name: 'deliveryNo',
                    id: 'deliveryNo'
                }, {
                    fieldLabel: i18n.getKey('deliveryDate'),
                    xtype: 'datefield',
                    name: 'deliveryDate',
                    id: 'deliveryDate',
                    format: system.config.dateFormat
                }],
                listeners: {
                    afterrender: function (fc) {
                        fc.setVisible(false);
                    }
                }
            },
            {
                fieldLabel: i18n.getKey('paidDate'),
                xtype: 'datefield',
                itemId: 'paidDate',
                hidden: true,
                format: system.config.dateFormat,
                value: new Date(),
                allowBlank: false
            },
            {
                fieldLabel: i18n.getKey('confirmedDate'),
                xtype: 'displayfield',
                itemId: 'confirmedDate',
                hidden: true,
                renderer: function (value) {
                    return value;
                }
            }]
    });

    var page = new Ext.container.Viewport({
        layout: 'border',
        items: [form]
    })

    loadData();

    function loadData() {


        if (!id)
            return;

        var model = Ext.define('CGP.model.OrderDetial', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'id',
                type: 'int'
            }, 'orderNumber', 'orderType'
                , 'customerEmail', 'datePurchased', 'shippingMethod', {
                    name: 'status',
                    type: 'object'
                }, {
                    name: 'deliveryAddress',
                    type: 'object'
                }, {
                    name: 'statusHistories',
                    type: 'array'
                }, {
                    name: 'deliveryNo',
                    type: 'string'
                }, {
                    name: 'deliveryDate',
                    type: 'date',
                    convert: function (value) {
                        return new Date(value)
                    },
                    serialize: function (value) {
                        var time = value.getTime();
                        return time;
                    }
                }, {
                    name: 'paidDate',
                    type: 'date',
                    convert: function (value) {
                        return new Date(value)
                    },
                    serialize: function (value) {
                        var time = value.getTime();
                        return time;
                    }
                },
                {
                    name: 'confirmedDate',
                    type: 'date',
                    convert: function (value) {
                        return new Date(value)
                    },
                    serialize: function (value) {
                        var time = value.getTime();
                        return time;
                    }
                }],
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/orders',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        });


        model.load(id, {
            success: function (record, operation) {

                if (!operation.getResultSet().success) {
                    Ext.Msg.alert('Info', operation.getResultSet().message);
                }


                setFormValue(record);
                changeStatusByOrder(record);


            },
            failure: function (record, operation) {
                Ext.Msg.alert('Info', operation.getError());
            }
        })


    }


    function setFormValue(record) {

        //order number
        form.getComponent('orderNumber').setValue('<div class="status-field">' + record.get('orderNumber') + '</div>');
        //customer email
        form.getComponent('customerEmail').setValue('<div class="status-field">' + record.get('customerEmail') + '</div>');
        //date purchased
        form.getComponent('datePurchased').setValue('<div class="status-field">' + record.get('datePurchased') + '</div>');
        //shipping method
        form.getComponent('shippingMethod').setValue('<div class="status-field">' + record.get('shippingMethod') + '</div>');

        form.getComponent('currentStatus').setValue('<div class="status-field">' + record.get('status').name + '</div>');

        //delivery address
        var address = [];
        var addr = record.get('deliveryAddress');
        address.push(addr.name);
        address.push(addr.address1);
        addr.address2 && address.push(addr.address2);
        var postcode = addr.postcode ? ('(' + addr.postcode + ') ') : ' ';
        var state = addr.state ? (addr.state + ' ') : ' '
        var zone = addr.city + postcode + state + addr.country;
        address.push(zone);
        address.push(addr.email);
        address.push(addr.telephone);
        var addStr = address.join('<br/>').replace(/underfined/g, '');
        if (record.get('orderType') == 'RM') {
            form.getComponent('deliveryAddress').setVisible(false);
            form.getComponent('shippingMethod').setVisible(false);
        } else {
            form.getComponent('deliveryAddress').setValue('<div class="status-field">' + addStr + '</div>');
        }


        //order status histories
        var histories = record.get('statusHistories');
        var wrapHis = [];
        Ext.Array.each(histories, function (history, index) {
            var his;

            his = '(' + (index + 1) + ')&nbsp;&nbsp;<font color=red>' + history.operator + '</font>' + '于' + '<font color=red>' + history.date + '</font>' + '将此订单状态修改为' + '<font color=red>' + history.status + '</font>';
            if (!Ext.isEmpty(history.comment)) {
                his += '<spand style="color:red">[' + history.comment + ']<font/>'
            }

            if (index == (histories.length - 1)) {
                his = '<p>' + his + '</p>'
            } else {
                his = '<p style="border-bottom:1px solid rgba(0,0,0,0.3)">' + his + '</p>';
            }

            wrapHis.push(his);
        })

        if (histories.length != 0) {
            form.getComponent('orderHistories').setValue('<div class="status-field">' + wrapHis.join('') + '</div>');
        }


        //deliveryDate defaults to order datePurchased
        Ext.getCmp('deliveryNo').setValue(record.get('deliveryNo'));
        Ext.getCmp('deliveryDate').setValue(Ext.Date.parseDate(record.get('datePurchased'), 'Y-m-d H:i:s'));


    }


    function initId() {
        var searcher = Ext.Object.fromQueryString(document.location.search);

        var id;

        if (Ext.isEmpty(searcher) || !searcher.id) {
            id = 0;
            return;
        }

        id = searcher.id;
        return id;
    }

    function saveStatus() {
        var form = this.ownerCt.ownerCt;

        if (Ext.isEmpty(form.getComponent('orderStatus').getValue())) {
            return;
        }

        var jsonData = {
            status: form.getComponent('orderStatus').getValue(),
            customerNotify: form.getComponent('customerNotify').getValue(),
            comment: form.getComponent('comment').getValue()
        };

        if (form.getComponent('deliveryInformation').isVisible()) {
            jsonData.deliveryNo = Ext.getCmp('deliveryNo').getValue();
            jsonData.deliveryDate = Ext.getCmp('deliveryDate').getValue().getTime();
        }

        if (form.getComponent('paidDate').isVisible()) {
            jsonData.paidDate = form.getComponent('paidDate').getValue().getTime();
        }
        var loadMask = form.setLoading(i18n.getKey('submiting'));
        Ext.Ajax.request({
            method: 'PUT',
            url: adminPath + 'api/orders/' + id + '/status/v1?access_token=' + Ext.util.Cookies.get('token'),
            jsonData: jsonData,
            success: function (response, options) {
                var r = Ext.JSON.decode(response.responseText);
                if (!r.success) {
                    Ext.Msg.alert('Info', r.data.message);
                    return;
                }
                Ext.Msg.alert('Success', "Save Success");
                loadMask.hide();
                afterSave();
            },
            failure: function (resp, options) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });

    }

    /**
     *保存成功之后调到订单列表 并且刷新订单列表
     */
    function afterSave() {

        if (parent && parent.frames['tabs_iframe_orderpage']) {
            //设置订单列表为活动tab
            window.parent.Ext.getCmp('tabs').setActiveTab('orderpage');

            //刷新列表  调用order列表页面的刷新方法
            parent.frames['tabs_iframe_orderpage'].contentWindow.refreshGrid();
        }
        //关闭当前页
        window.parent.Ext.getCmp('tabs').remove('modifyOrderStatus');
    }


    function changeStatusByOrder(order) {

        var me = form;
        var statusId = order.get('status').id;

        var displayDeliveryInfoStatuses = [107, 108, 109, 111, 112];


        if (statusId == 102) {
            me.getComponent('confirmedDate').setVisible(true);
        }

        if (statusId == 101) {
            me.getComponent('paidDate').setVisible(true);
            me.getComponent('paidDate').setDisabled(true)
        }


        if (!Ext.Array.contains(displayDeliveryInfoStatuses, statusId)) {
            me.getComponent('deliveryInformation').setVisible(false);
            return;
        }

        me.getComponent('deliveryInformation').setVisible(true);
        me.getComponent('deliveryInformation').setDisabled(true);


    }
});