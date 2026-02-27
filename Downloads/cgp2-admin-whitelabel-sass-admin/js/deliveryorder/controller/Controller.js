Ext.define("CGP.deliveryorder.controller.Controller", {
    requires: ['CGP.deliveryorder.model.DeliveryOrderModel'],
    saveRecord: function (record, statusId, info, mask) {
        var me = this;
        switch (statusId) {
            case 101: {
                mask.hide();
                Ext.Msg.alert(i18n.getKey('prompt'), '保存成功！');
                break;
            }
            case 102: {
                me.saveBoxInfo(record.getId(), info, mask);
                break;
            }
            case 103: {
                me.saveSettleInfo(record.getId(), info, mask);
                break;
            }
            case 104: {
                me.saveDeliveryInfo(record.getId(), info, mask);
                break;
            }
            case 105: {
                me.saveReceivedInfo(record.getId(), info, mask);
                break;
            }
        }

    },
    loadOrderDetail: function (page) {

        var me = this;
        me.id = parseInt(JSGetQueryString('id'));
        var id = me.id;
        var form = page.down('form');
        var model = Ext.ModelManager.getModel('CGP.deliveryorder.model.DeliveryOrderModel');
        var lm = form.setLoading(i18n.getKey('loading'));
        model.load(id, {
            success: function (record, operation) {
                var url = adminPath + 'api/shipmentOrders/' + id + '/histories';
                JSAjaxRequest(url, "GET", true, null, null, function (require, success, response) {
                    if (success) {
                        var responseMessage = Ext.JSON.decode(response.responseText);
                        if (responseMessage.success) {
                            record.set('statusHistories', responseMessage.data);
                            form.setData(record);
                            me.record = record;
                        }
                        lm.hide();
                    }
                }, true)
            },
            failure: function (record, operation) {
                lm.hide();
                Ext.Msg.alert(i18n.getKey('prompt'), operation.getError());
            }
        });
    },
    saveBoxInfo: function (recordId, info, mask) {
        var me = this;
        var data = {
            //shipmentOrderId: recordId,
            boxes: info.shipmentBoxes
        };
        /*var data = {

        }*/
        Ext.Ajax.request({
            url: adminPath + 'api/shipmentOrders/' + recordId + '/boxingInfo',
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '保存成功！');
                    location.reload();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
                mask.hide();
            },
            failure: function (resp) {
                mask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    printLabel: function (orderNumber) {
        var webiste = 'CGP';
        var email = Ext.JSON.decode(Ext.util.Cookies.get('user')).email;
        var token = Ext.util.Cookies.get('token');
        var labelUrlTemplate = 'qpmrp://|{#url{module<w_web_print>,tag<search>,source<search_srv>,companyid<QP>,part<{orderNumber}>,site<{website}>,userid<{email}>,token<{token}>,login{type<auto>,uid<DZLABEL>,pwd<az159874>}}}>}}'
        var labelUrl = new Ext.Template(labelUrlTemplate).apply({
            website: webiste,
            email: email,
            token: token,
            orderNumber: orderNumber
        });
        window.open(labelUrl);
    },
    saveSettleInfo: function (recordId, info, mask) {
        var me = this;
        var data = info.shipmentInfo;
        /*var data = {

        }*/
        Ext.Ajax.request({
            url: adminPath + 'api/shipmentOrders/' + recordId + '/settleInfo',
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    //me.printLabel(recordId);
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('modifySuccess'), function () {
                        window.location.reload();
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
                mask.hide();
            },
            failure: function (resp) {
                mask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    saveDeliveryInfo: function (recordId, info, mask) {
        var data = info.shipmentInfo;
        if (!data.deliveredDate) {
            data.deliveredDate = new Date().getTime();
        }
        Ext.Ajax.request({
            url: adminPath + 'api/shipmentOrders/' + recordId + '/deliverInfo',
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '保存成功！');
                    location.reload();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
                mask.hide();
            },
            failure: function (resp) {
                mask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    saveReceivedInfo: function (recordId, info, mask) {
        var data = {
            receivedDate: new Date().getTime()
        };
        Ext.Ajax.request({
            url: adminPath + 'api/shipmentOrders/' + recordId + '/receiveInfo',
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '保存成功！');
                    location.reload();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
                mask.hide();
            },
            failure: function (resp) {
                mask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    saveInfo: function (recordId, info, mask) {
        var data = {
            shipmentOrderId: recordId,
            shipmentCost: info['shipmentCost'],
            shipmentMethod: info['shipmentMethod'],
            trackingNo: info['trackingNo'],
            deliveredDate: info['deliveredDate']
        };
        Ext.Ajax.request({
            url: adminPath + 'api/shipmentOrders/' + recordId + 'settleInfo',
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '保存成功！');
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
                mask.hide();
            },
            failure: function (resp) {
                mask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    //地址薄编辑
    openEditWindow: function (currentMode, record, userrecord, store) {
        var me = this;
        if (me.editWindow == null) {
            me.editWindow = Ext.create('CGP.customer.view.addressbook.Edit', {
                currentMode: currentMode,
                controller: me,
                record: record,
                store: store,
                userrecord: userrecord
            });
        } else {
            me.editWindow.refresh(currentMode, record);
        }
        me.editWindow.show();
    },

    // 设置默认地址
    setDefaultAddress: function (addressBookId, userRecord) {
        var me = this;
        var addressStore = Ext.getCmp('AddressBooksGrid').store;

        userRecord.set("defaultAddressBookId", addressBookId);
        userRecord.save({
            success: function (batch, options) {
                var responseText = options.response.responseText,
                    responseObj = JSON.parse(responseText);
                if (responseObj.success == false) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('savefailure') + "!");
                } else if (responseObj.success == true) {
                    addressStore.load();
                }
            },
            failure: function (batch, options) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteFailure') + "!");
            }
        });

    },

    // 删除地址
    deleteAddress: function (addressRecord, store, userrecord) {
        var me = this;
        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (e) {
            if (e == "yes") {
                var adressStroe = Ext.getCmp('AddressBooksGrid').store;
                adressStroe.remove(adressStroe.getById(addressRecord.get('id')));
                addressRecord.destroy({
                    success: function (batch, options) {
                        var responseText = options.response.responseText,
                            responseObj = JSON.parse(responseText);
                        if (responseObj.success == false) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('savefailure') + "!");
                        } else if (responseObj.success == true) {
                            var count = Ext.getCmp('AddressBooksGrid').store.getCount();
                            if (count == 1) {
                                addressBookId = Ext.getCmp('AddressBooksGrid').store.getAt(0).getId();
                                Ext.getCmp('AddressBooksGrid').defaultAddress = addressBookId;
                                me.setDefaultAddress(addressBookId, userrecord);
                                store.load();
                            }

                        }
                    },
                    failure: function (batch, options) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteFailure') + "!");
                    },
                    callback: function () {
                        adressStroe.reload();
                    }
                });
            }
        });
    },
    //排序方法
//	sortOrderForm : function (respData,listWindow){
//		var index = respData.index;
//		var showForm = listWindow.getComponent(respData.get('id'));
//		listWindow.insert(index,showForm);
//	}

    //查询
    getQuery: function (url) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
                }
            }
        })
        return data;
    },
});
