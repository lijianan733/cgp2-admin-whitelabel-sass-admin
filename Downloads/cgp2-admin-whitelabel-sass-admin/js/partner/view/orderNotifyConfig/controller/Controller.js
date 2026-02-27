/**
 * Created by nan on 2017/12/19.
 */
Ext.define('CGP.partner.view.orderNotifyConfig.controller.Controller', {
    require: ['CGP.partner.view.orderNotifyConfig.model.RestHttpRequestConfigModel'],
    /**
     *遍历获取form中数据
     * 保存或更新
     */
    saveConfig: function (form, createOrUpdate, partnerId, recordId) {
        var submitData = {};
        var field = form.items.items;
        for (var i = 0; i < field.length; i++) {
            var name = field[i].getId();
            var value = '';
            if (name == 'restHttpRequestConfigs') {
                var restHttpRequestConfigData = [];
                var data = form.items.items[i]._grid.store;
                for (var j = 0; j < data.getCount(); j++) {
                    var record = data.getAt(j);
                    var item = {};
                    for (var k in record.data) {
                        if (k == 'headers' || k == 'queryParameters') {
                            var itemsItem = {};
                            for (var l in record.get(k)) {
                                itemsItem[l] = record.get(k)[l]
                            }
                            ;
                            item[k] = itemsItem;
                        } else {
                            item[k] = record.get(k);
                        }
                    }
                    ;
                    restHttpRequestConfigData.push(item);
                }
                ;
                value = restHttpRequestConfigData;
            } else {
                value = form.items.items[i].getValue();
            }
            submitData[name] = value;
        }
        submitData['clazz'] = 'com.qpp.cgp.domain.partner.OrderStatusChangeNotification';
        if (createOrUpdate == 'edit') {
            Ext.Ajax.request({//update
                url: adminPath + 'api/partners/' + partnerId + '/orderStatusChangeNotifications/' + recordId,
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: submitData,
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));

                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            });
        } else {
            submitData._id = null;
            Ext.Ajax.request({//add
                url: adminPath + 'api/partners/' + partnerId + '/orderStatusChangeNotifications',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: submitData,
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('add') + i18n.getKey('success'));

                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            });
        }
    },
    /**
     * 打开添加或者编辑httprequestconfig的tab
     * @param page
     * @param record
     * @param store
     * @param recordId
     * @param partnerId
     */
    editRestHttpRequestConfig: function (page, record, store, recordId, partnerId) {
        var createOrUpdate = Ext.isEmpty(record) ? 'create' : 'edit';
        var index = null;
        if (createOrUpdate == 'create') {
            record = Ext.create('CGP.partner.view.orderNotifyConfig.model.RestHttpRequestConfigModel');
        }
        index = record.index;
        JSOpen({
            id: 'editRestHttpRequestConfigTab',
            url: path + 'partials/partner/ordernotifyconfig/editresthttprequestconfigtab.html?recordId=' + recordId + '&createOrUpdate=' + createOrUpdate + '&partnerId=' + partnerId + '&index=' + index,
            title: i18n.getKey(createOrUpdate) + '_' + i18n.getKey('restHttpRequestConfigs'),
            refresh: true
        });
    },
    /**
     * 获取，整合httpRequestEditForm中的所有数据
     * @param form1
     * @param form2
     * @param form3
     * @param form4
     * @param form5
     * @returns {{}}
     */
    getAllFormValue: function (form1, form2, form3, form4, form5) {
        var allFormValue = {};
        var form1Value = form1.getValues();
        var form2Value = form2.getValues();
        var result = {};
        for (var i = 0; i < form2.items.items.length; i++) {
            result[form2Value['key' + i]] = form2Value['value' + i];
        }
        form2Value = {};
        form2Value['headers'] = result;
        result = {};
        var form3Value = form3.getValues();
        for (var i = 0; i < form3.items.items.length; i++) {
            result[form3Value['key' + i]] = form3Value['value' + i];
        }
        form3Value = {};
        form3Value['queryParameters'] = result;
        var form4Value = form4.getValues();
        var form5Value = form5.getValues();
        allFormValue = Ext.Object.merge(form1Value, form2Value, form3Value, form4Value, form5Value);
        allFormValue['clazz'] = 'com.qpp.cgp.domain.partner.RestHttpRequestConfig';
        return allFormValue;

    },
    /**
     * 保存httpRequstConfig
     * @param createOrUpdate 是否新建
     * @param record 记录
     * @param changedValue 修改或新建的数据
     */
    saveHttpRequestConfig: function (createOrUpdate, record, changedValue, editConfigStore) {
        if (createOrUpdate == 'create') {
            var newRecord = Ext.create('CGP.partner.view.orderNotifyConfig.model.RestHttpRequestConfigModel');
            for (var i in changedValue) {
                if (i == 'type') {
                    continue;
                }
                newRecord.set(i, changedValue[i]);
            }
            newRecord.internalId = editConfigStore.data.length + 1,
                editConfigStore.add(newRecord);

        } else {
            for (var i in changedValue) {
                if (i == 'type') {
                    continue;
                }
                record.set(i, changedValue[i]);
            }
        }
        var tabs = top.Ext.getCmp("tabs");
        var tab = tabs.getComponent('orderNotifyconfigedit');
        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
            tabs.setActiveTab(tab);
            //gridField在谷歌浏览器上在其他页面上修改后，切换到组件页面时错位，只能在切换页面后对store或者gridView进行刷新
            top.document.getElementById("tabs_iframe_orderNotifyconfigedit").contentWindow.Ext.getCmp('restHttpRequestConfigs')._grid.getView().refresh();
        });
    }
})
