Ext.define('CGP.orderlineitem.view.status.view.Status', {
    extend: 'Ext.form.Panel',
    alias: 'widget.orderstatus',
    requires: [
        'CGP.orderlineitem.view.status.model.OrderDetail',
        'CGP.orderlineitem.view.status.view.shipment.ShipmentInfo',
        'CGP.orderlineitem.view.status.view.shipment.ShipmentBox',
        'CGP.orderlineitem.view.status.view.shipment.ShipmentBoxView'
    ],


    region: 'center',
    autoScroll: true,
    defaults: {
        labelWidth: 120,
        width: 500,
        msgTarget: 'under',
        labelAlign: 'right'
    },

    initComponent: function () {
        var me = this,
            id = me.ordeId;
        var isRedo = JSGetQueryString('isRedo');
        var statusId = parseInt(JSGetQueryString('statusId'));
        var orderLineItemId = parseInt(JSGetQueryString('orderLineItemId'));
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function () {
                    //已审核待排版状态，用户参数必须不为空
                    if (me.getComponent('orderStatus').getValue() == 102 && (!Ext.isEmpty(me.nullUserParams) && me.nullUserParams.length > 0)) {
                        Ext.Msg.alert(i18n.getKey('infor'), i18n.getKey('null') + i18n.getKey('userParams') + JSON.stringify(me.nullUserParams));
                    } else {
                        controller.saveStatus();
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('grid'),
                iconCls: 'icon_grid',
                handler: function () {
                    JSOpen({
                        id: 'orderlineitempage',
                        url: path + 'partials/orderlineitem/orderlineitem.html'
                    });
                }
            }
        ];

        me.items = [
            {
                fieldLabel: i18n.getKey('orderNumber'),
                name: 'orderNumber',
                xtype: 'displayfield',
                renderer: function (value) {
                    return '<div class="status-field">' + value + '</div>';
                }
            },
            {
                fieldLabel: i18n.getKey('productMsg'),
                name: 'productMsg',
                xtype: 'displayfield',
                itemId: 'productMsg'
            },
            {
                fieldLabel: i18n.getKey('materialInfo'),
                name: 'materialInfo',
                xtype: 'displayfield',
                itemId: 'materialInfo'
            }, {
                fieldLabel: i18n.getKey('qty'),
                name: 'qty',
                xtype: 'displayfield',
                renderer: function (value) {
                    return '<div class="status-field">' + value + '</div>';
                }
            },
            {
                fieldLabel: i18n.getKey('orderItemStatus'),
                name: 'status',
                xtype: 'displayfield',
                itemId: 'currentStatus'
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
                store: new Ext.data.Store({
                    fields: [
                        {
                            name: 'id',
                            type: 'int'
                        },
                        {
                            name: 'name', type: 'string',
                            convert: function (value, record) {
                                var resultName = i18n.getKey(value);
                                var statusId = record.get('id');
                                if (Ext.Array.contains([103, 104, 105, 106, 107], statusId)) {
                                    if (isRedo == 'true') {
                                        if (statusId == 103) {
                                            resultName = i18n.getKey('redo-confirmed(waitting print)');
                                        } else {
                                            resultName = i18n.getKey('redo') + '-' + i18n.getKey(value);
                                        }
                                    }
                                }
                                return resultName;
                            }
                        }
                    ],
                    proxy: {
                        type: 'uxrest',
                        url: adminPath + 'api/orderItemStatuses/all',
                        reader: {
                            type: 'json',
                            root: 'data'
                        }/*,
                        //订单项可改状态，只可选已交收（待发货）
                        /*extraParams: {
                            filter: '[{"name":"id","value":' + 106 + ',"type":"number"}]'
                        }*/
                    },
                    autoLoad: true
                }),
                listeners: {
                    select: function (combo, records) {
                        var record = records[0];
                        me.addContentBySelectedStatus(record.get('id'));
                        var currentStatus = me.record.get('status').id;
                        var nextStatus = record.get('id');
                        if (currentStatus == 106 && nextStatus == 107) {
                            me.getComponent('customerNotify').setValue(true);
                        } else {
                            me.getComponent('customerNotify').setValue(false);
                        }
                    },
                    change: function (comp, newValue, oldValue) {
                        var userParams = me.getComponent('userParams')
                        //已确认订单|已付款（待审核）| 已审核（待排版）
                        if (newValue == 102 || newValue == 301 || newValue == 101) {
                            if (userParams) {
                                var itemUserParams = Ext.data.StoreManager.lookup('itemUserParams'), show = false;
                                itemUserParams.each(function (recd) {
                                    if (recd.get('userParams') && JSON.stringify(recd.get('userParams')) != '{}') {
                                        show = true;
                                    }
                                })
                                if (show) {
                                    userParams.enable();
                                    userParams.show();
                                }
                            }
                        } else {
                            userParams.disable();
                            userParams.hide();
                        }
                    }
                }
            },
            {
                fieldLabel: i18n.getKey('userParams'),
                // name: 'userParamsValue',
                xtype: 'displayfield',
                itemId: 'userParams',
                allowBlank: false,
                hidden: true,
                value: '<a href="#" id="click-userParams" style="color: blue">' + i18n.getKey('setValue') + '</a>',
                listeners: {
                    render: function (display) {
                        var clickElement = document.getElementById('click-userParams');
                        clickElement.addEventListener('click', function () {
                            Ext.create('CGP.orderlineitem.view.status.view.UserImpositionParams', {
                                title: i18n.getKey('userParams'),
                                orderItemId: orderLineItemId
                            }).show();
                        });
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
                fieldLabel: i18n.getKey('paidDate'),
                xtype: 'datefield',
                name: 'paidDate',
                itemId: 'paidDate',
                hidden: true,
                format: system.config.dateFormat,
                value: new Date(),
                allowBlank: false
            },
            {
                xtype: "fieldcontainer",
                border: false,
                height: 230,
                fieldLabel: i18n.getKey('orderLineItemHistories'),
                itemId: 'orderHistoriesContainer',
                autoScroll: true,
                width: 700,
                items: [
                    {
                        fieldLabel: false,
                        name: 'statusHistories',
                        xtype: 'displayfield',
                        width: '100%',
                        itemId: 'orderHistories'
                    }
                ]

            }
        ];

        me.callParent(arguments);
        me.orderHistoriesField = me.getComponent('orderHistoriesContainer').getComponent("orderHistories");
        me.materialInfo = me.getComponent('materialInfo');
        me.productMsg = me.getComponent('productMsg');
        me.currentStatusField = me.getComponent('currentStatus');
        var itemUserParams = Ext.create('CGP.orderlineitem.view.status.store.UserParams', {
            storeId: 'itemUserParams',
            orderItemId: orderLineItemId,
            listeners: {
                load: function (records, operation, success) {
                    if (success) {
                        me.nullUserParams = [];
                        records.each(function (item) {
                            var userImpositionParams = item.get('userImpositionParams')
                            var userParamDefaultValues = item.get('userParamDefaultValues');
                            if (!Ext.isEmpty(userImpositionParams) && JSON.stringify(userImpositionParams) != '{}' && (userParamDefaultValues && userParamDefaultValues.objectJSON)) {
                                for (var i in userImpositionParams) {
                                    if (Ext.isEmpty(userImpositionParams[i]) && Ext.isEmpty(userParamDefaultValues.objectJSON[i]))
                                        me.nullUserParams.push(i);
                                }
                            } else if (userParamDefaultValues && userParamDefaultValues.objectJSON) {
                                for (var i in userParamDefaultValues.objectJSON) {
                                    if (Ext.isEmpty(userParamDefaultValues.objectJSON[i]))
                                        me.nullUserParams.push(i);
                                }
                            }
                        });
                    }
                }
            }
        });
        itemUserParams.load();
    },
    getData: function () {
        var me = this;
        var data = {};
        var status = me.getComponent('orderStatus').getValue();
        var customerNotify = me.getComponent('customerNotify').getValue();
        var comment = me.getComponent('comment').getValue();

        //paid date
        var paidDateField = me.getComponent('paidDate');
        var paidDate = null;
        if (paidDateField.isVisible()) {
            var paidDate = paidDateField.getValue().getTime();
        }

        //shipment info
        var shipmentInfoField = me.getComponent('shipmentInfo');
        var shipmentInfo = null;
        if (shipmentInfoField && shipmentInfoField.isVisible()) {
            if (!shipmentInfoField.isValid()) {
                throw new Error('not valid');
            }
            ;
            shipmentInfo = shipmentInfoField.getValue();
        }


        //shipment box var
        var shipmentBoxField = me.getComponent('shipmentBox');
        var shipmentBox = null;
        if (shipmentBoxField && shipmentBoxField.isVisible()) {
            if (!shipmentBoxField.isValid()) {
                throw new Error('not valid');
            }
            ;
            shipmentBox = shipmentBoxField.getValue();
        }

        data = {
            statusId: status,
            customerNotify: customerNotify,
            comment: comment,
            paidDate: paidDate,
            shipmentInfo: shipmentInfo,
            shipmentBoxes: shipmentBox
        };

        return data;
    },

    setData: function (record, order) {
        var me = this;
        me.record = record;
        me.order = order;
        me.loadRecord(record);
        var productId = record.get('productInstance').productId;
        me.setProductMsg(productId);
        var materialId = record.get('productInstance').material._id;
        me.setMaterialInfo(materialId);
        me.setOrderHistories(record.get('statusHistories'));
        me.setOrderStatus(record.get('status'));

        var statusId = record.get('status').id;
        me.setContentByStatusId(statusId);

        //检查是是否处于已交收状态 显示运费信息和装箱信息
    },

    setContentByStatusId: function (statusId) {
        var me = this,
            order = this.order,
            shipmentInfo;

        // 2025.12.5 关闭该功能 接口有问题且订单项不需要展示发货信息
        /*if ([106, 107].includes(statusId)) {
            var isNeed = controller.checkNeedShipmentInfo(statusId, this.record.getId());
            if (isNeed) {
                shipmentInfo = me.initShipmentInfo();
                shipmentInfo.setVisible(true);
                
            }
        }*/

        if ([106].includes(statusId)) {
            me.initShipmentBoxView();
        }
    },
    /**
     * 订单项展示产品信息
     * @param {Number} productId
     */
    setProductMsg: function (productId) {
        var me = this;
        Ext.Ajax.request({
            url: adminPath + 'api/products/' + productId,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    var dataInfo = response.data;
                    var name = dataInfo.name;
                    var id = dataInfo.id;
                    var sku = dataInfo.sku;
                    var data = [];
                    data.push(i18n.getKey('id') + '：' + id);
                    data.push(i18n.getKey('name') + '：' + name);
                    data.push(i18n.getKey('sku') + '：' + sku);
                    var productMsg = data.join('<br/>').replace(/undefined/g, '');
                    var productMsg = productMsg.replace(/null/g, '');
                    me.productMsg.setValue('<div class="status-field">' + productMsg + '</div>');
                } else {
                    me.productMsg.setValue('<div class="status-field">' + '加载产品信息失败！' + '</div>');
                }
            },
            failure: function () {
                me.productMsg.setValue('<div class="status-field">' + '加载产品信息失败！' + '</div>');
            }
        })
    },
    /**
     * 订单项展示物料信息
     * @param materialId
     */
    setMaterialInfo: function (materialId) {
        var me = this;
        Ext.Ajax.request({
            url: adminPath + 'api/materials/' + materialId,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    var dataInfo = response.data;
                    var name = dataInfo.name;
                    var id = dataInfo._id;
                    var type = dataInfo.clazz;
                    if (type == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                        type = 'MaterialSpu'
                    } else {
                        type = 'MaterialType'
                    }
                    var data = [];
                    data.push(i18n.getKey('id') + '：' + id);
                    data.push(i18n.getKey('name') + '：' + name);
                    data.push(i18n.getKey('type') + '：' + type);
                    var materialInfo = data.join('<br/>').replace(/undefined/g, '');
                    var materialInfo = materialInfo.replace(/null/g, '');
                    me.materialInfo.setValue('<div class="status-field">' + materialInfo + '</div>');
                } else {
                    me.materialInfo.setValue('<div class="status-field">' + '加载物料信息失败！' + '</div>');
                }
            },
            failure: function () {
                me.materialInfo.setValue('<div class="status-field">' + '加载物料信息失败！' + '</div>');
            }
        })
    },
    setDeliveryAddress: function (record) {
        var me = this;
        var address = [];
        address.push(record.get('deliveryName'));
        address.push(record.get('deliveryStreetAddress1'));
        record.get('deliveryStreetAddress2') && address.push(record.get('deliveryStreetAddress2'));
        var postcode = record.get('deliveryPostcode') ? ('(' + record.get('deliveryPostcode') + ') ') : ' ';
        var state = record.get('deliveryState') ? (record.get('deliveryState') + ' ') : ' ';
        var zone = record.get('deliveryCity') + postcode + state + record.get('deliveryCountry');
        address.push(zone);
        address.push(record.get('deliveryEmail'));
        address.push(record.get('deliveryTelephone'));
        var addStr = address.join('<br/>').replace(/undefined/g, '');
        var addStr = addStr.replace(/null/g, '');
        //me.deliveryAddressField.setValue('<div class="status-field">' + addStr + '</div>');
    },

    setOrderHistories: function (histories) {
        var me = this;
        var wrapHis = [];
        var needRedoNo = 0;
        var isRedo = JSGetQueryString('isRedo');
        Ext.Array.each(histories, function (history, index) {
            var his;
            var modifiedUser = history.modifiedUser;
            if (Ext.isEmpty(modifiedUser)) {
                modifiedUser = {};
                modifiedUser.emailAddress = 'system';
            }
            var statusName = history.status.name;
            var statusId = history.status.id;
            if (statusId == 240710) {
                needRedoNo = index;
            }
            if (isRedo == 'true') {
                if (index > needRedoNo && needRedoNo > 0) {
                    if (Ext.Array.contains([103, 104, 105, 106, 107], statusId)) {
                        statusName = i18n.getKey('redo') + '-' + i18n.getKey(statusName);
                        if (statusId == 103) {
                            statusName = i18n.getKey('redo-confirmed(waitting print)');
                        }
                    } else {
                        statusName = i18n.getKey(statusName);
                    }
                } else {
                    statusName = i18n.getKey(statusName);
                }

            } else {
                statusName = i18n.getKey(statusName);
            }
            his = '(' + (index + 1) + ')&nbsp;&nbsp;<font color=red>' + modifiedUser.emailAddress + '</font>' + '于' + '<font color=red>' + Ext.Date.format(new Date(history.createdDate), 'Y/m/d H:i') + '</font>' + '将此订单项状态修改为' + '<font color=red>' + statusName + '</font>';
            if (!Ext.isEmpty(history.comment)) {
                his += '<spand style="color:red">[' + history.comment + ']<font/>'
            }

            if (index == (histories.length - 1)) {
                his = '<p>' + his + '</p>'
            } else {
                his = '<p style="border-bottom:1px solid rgba(0,0,0,0.3)">' + his + '</p>';
            }

            wrapHis.push(his);
        });
        if (histories.length != 0) {
            me.orderHistoriesField.setValue('<div class="status-field">' + wrapHis.join('') + '</div>');
        } else {
            me.getComponent('orderHistoriesContainer').setVisible(false);
        }
    },
    setOrderStatus: function (status) {
        var me = this;
        var isRedo = me.record.get('isRedo');
        var statusId = status.id;
        var statusName = i18n.getKey(status.name);
        if (Ext.Array.contains([103, 104, 105, 106, 107], statusId)) {
            if (isRedo == true) {
                if (statusId == 103) {
                    statusName = i18n.getKey('redo-confirmed(waitting print)');
                } else {
                    statusName = i18n.getKey('redo') + '-' + i18n.getKey(status.name);
                }
            }
        }
        me.currentStatusField.setValue('<div class="status-field">' + statusName + '</div>');
    },

    //根据用户选择到不同的状态来进行不同内容的展示
    addContentBySelectedStatus: function (statusId) {
        var me = this,
            record = this.record;
        var shipmentInfo = me.getComponent('shipmentInfo');
        var shipmentBox = me.getComponent('shipmentBox');
        var shipmentBoxView = me.getComponent('shipmentBoxView');
        if (Ext.Array.contains([106], statusId)) {
            if (shipmentInfo == null) {
                shipmentInfo = me.initShipmentInfo();
            }

            if (shipmentBox == null) {
                shipmentBox = me.initShipmentBox();
            }
            // 2025.12.5 关闭该功能 接口有问题且订单项不需要展示发货信息
            /*var isNeed = controller.checkNeedShipmentInfo(statusId, this.record.getId());
            if (isNeed) {
                shipmentInfo.setVisible(true);
                shipmentBox.setVisible(true);
            }*/

        } else {
            if (shipmentInfo && shipmentInfo.isVisible())
                shipmentInfo.setVisible(false);
            if (shipmentBox && shipmentBox.isVisible())
                shipmentBox.setVisible(false);
            shipmentBoxView && shipmentBoxView.setVisible(false);
        }

        if (Ext.Array.contains([106, 107], statusId)) {
            if (statusId == 107) {
                var shipmentBoxView = me.getComponent('shipmentBoxView');
                shipmentBoxView && shipmentBoxView.setVisible(false);
            }
            if (shipmentInfo == null) {
                shipmentInfo = me.initShipmentInfo();
            }
            
            // 2025.12.5 关闭该功能 接口有问题且订单项不需要展示发货信息
           /* var isNeed = controller.checkNeedShipmentInfo(statusId, this.record.getId());
            if (isNeed) {
                shipmentInfo.setVisible(true);
            }*/
        } else {
            if (shipmentInfo && shipmentInfo.isVisible())
                shipmentInfo.setVisible(false);
        }

        if (statusId == 101) {
            me.getComponent('paidDate').setVisible(true);
            me.getComponent('paidDate').setValue(new Date());
        } else {
            me.getComponent('paidDate').setVisible(false);
        }
    },


    initShipmentInfo: function () {
        var me = this,
            record = this.order;
        var shipmentInfo = Ext.widget({
            xtype: 'shipmentinfo',
            itemId: 'shipmentInfo',
            record: record,
            hidden: true,
            fieldLabel: i18n.getKey('shipmentInfo'),
            labelWidth: 120,
            width: 700,
            labelAlign: 'right'
        });
        me.insert(me.items.getCount() + 1, shipmentInfo);
        return shipmentInfo;
    },

    initShipmentBox: function () {
        var me = this,
            record = this.order;
        var shipmentBox = Ext.widget({
            xtype: 'shipmentbox',
            itemId: 'shipmentBox',
            width: 860,
            hidden: true,
            record: me.order,
            labelAlign: 'right'
        });
        me.insert(me.items.getCount() + 1, shipmentBox);
        return shipmentBox;
    },
    initShipmentBoxView: function () {
        var me = this,
            record = this.order;
        var shipmentBox = Ext.widget({
            labelAlign: 'right',
            xtype: 'fieldcontainer',
            itemId: 'shipmentBoxView',
            fieldLabel: i18n.getKey('packageInfo'),
            items: [
                {
                    xtype: 'shipmentboxview',
                    itemId: 'shipmentBoxView',
                    width: 630,
                    record: me.order
                }
            ]
        });
        me.insert(me.items.getCount() + 1, shipmentBox);
        return shipmentBox;
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
});
