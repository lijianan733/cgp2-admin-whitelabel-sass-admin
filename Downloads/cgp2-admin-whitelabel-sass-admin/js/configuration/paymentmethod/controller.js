Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
]);
function createWindow(isEdit, paymentStore) {
    var websiteStore = Ext.data.StoreManager.lookup("websiteStore");
    var configPaymentStore = Ext.data.StoreManager.lookup("configurableStore");
    configPaymentStore.load({
        params: {websiteId: '' + getQueryString("websiteId") + ''},
        callback: function (records, options, success) {
            if ((records == null || records[0] == null) && isEdit == false) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('noconfigPayment') + '!', function (btn) {
                    // newWindow.close();
                });
            } else {
                if (isEdit == false) {
                    createNewWindow();
                    if (records.length == 1) {
                        var field = newWindow.child("form").getComponent("code");
                        field.setValue(records[0].get("code"));
                    }
                }
            }

        }
    });

    // JS的去url的参数的方法，用来页面间传参
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var newWindow = null; // 定义newWindow变量

    function createNewWindow() { //将创建window封在一个方法内，调用方法来创建
        newWindow = Ext.create("Ext.window.Window", {
            id: "paymentWindow",
            title: i18n.getKey('paymentMethodInformation'),
            modal: true,
//		renderTo : Ext.getCmp("viewport").el.dom,
            width: 600,
            items: [{
                xtype: 'uxform',
                model: 'CGP.model.PaymentModule',

                height: 350,
                buttonAlign: 'left',
                fieldDefaults: {
                    width: 250,
                    labelAlign: 'right',
                    style: {
                        marginRight: '10px',
                        marginLeft: '10px',
                        marginTop: '5px'
                    }
                },
                items: [{
                    xtype: 'numberfield',
                    name: 'id',
                    hidden: true,
                    fieldLabel: 'id',
                    itemId: 'id',
                    listeners: {
                        render: function (field) {
                            field.hide();
                        }
                    }
                }, {
                    xtype: 'combo',
                    name: 'code',
                    itemId: 'code',
                    fieldLabel: i18n.getKey('paymentMethod'),
                    store: configPaymentStore,
                    editable: false,
                    queryMode: 'local',
                    displayField: 'code',
                    valueField: 'code',
                    listeners: {
                        change: function (combo, newValue, oldValue) {
                            if (combo.ownerCt.getCurrentMode() == "creating") {
                                var configInfo = newWindow.child("uxform").getComponent("custom");
                                var record = combo.getStore().findRecord("code", newValue, 0, false, false, true);
                                configInfo.setValue(record.get("configInfo"));
                            }
                        }
                    }
                }, {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('title'),
                    name: 'title',
                    itemId: 'title'
                }, {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    name: 'description',
                    itemId: 'description'
                }, {

                    xtype: 'radiogroup',
                    fieldLabel: i18n.getKey('available'),
                    hideLabels: false,
                    width: 250,
                    layout: 'hbox',
                    name: 'available',
                    defaultType: 'radio',
                    columns: 2,
                    items: [
                        {boxLabel: i18n.getKey('yes'), name: 'available', inputValue: true, checked: true, width: 50},
                        {boxLabel: i18n.getKey('no'), name: 'available', inputValue: false, width: 50}
                    ]
                }, {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('orderStatus'),
                    name: 'orderStatusId',
                    itemId: 'orderStatusId',
                    editable: false,
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    labelAlign: 'right',
                    store: Ext.data.StoreManager.lookup('orderStatusStore'),
                    queryMode: 'remote',
                    matchFieldWidth: true
                }, {
                    xtype: 'numberfield',
                    name: 'sortOrder',
                    fieldLabel: i18n.getKey('sortOrder'),
                    itemId: 'sortOrder',
                    allowDecimals: false,
                    value: 0,
                    minValue: 0
                }, {
                    xtype: 'websitecombo',
                    itemId: 'websiteCombo',
                    allowBlank: false,
                    name: 'website',
                    hidden: true,
                    value: getQueryString("websiteId") || 11,
                }, {
                    xtype: 'textarea',
                    //width : 500,
                    //height : 100,
                    colspan: 2,
                    width: 500,
                    height: 150,
                    fieldLabel: i18n.getKey('configInfo'),
                    name: 'custom',
                    itemId: 'custom'
                }],
                buttons: [{
                    text: i18n.getKey('multilingual') + i18n.getKey('config'),
                    hidden: !isEdit,
                    handler: function (button) {
                        var id = newWindow.paymentmethodId;
                        var title = 'paymentMethod';
                        var multilingualKey = 'com.qpp.cgp.domain.common.module.PaymentModuleConfig';
                        JSOpen({
                            id: 'edit' + '_multilingual',
                            url: path + "partials/common/editmultilingual.html?id=" + id + '&title=' + title + '&multilingualKey=' + multilingualKey,
                            title: i18n.getKey(title) + i18n.getKey('multilingual') + i18n.getKey('config') + '(' + i18n.getKey('id') + ':' + id + ')',
                            refresh: true
                        });
                    }
                }, '->', {
                    text: i18n.getKey('save'),
                    handler: function (button) {
                        paymethodSubmit(button);
                    }
                }, {
                    text: i18n.getKey('cancel'),
                    handler: function (button) {
                        cancel(button);
                    }
                }]
            }]
        });
        newWindow.show();
    }

    if (isEdit) {
        createNewWindow();
    }

    var paymethodSubmit = function (button) {
        var form = newWindow.child("form");
        var currentMode = form.getCurrentMode();
        var store = Ext.data.StoreManager.lookup("paymentMethod");
        if (currentMode == 'creating') {
            var modelObj = form.form.getValuesByModel(form.model);
            store.add(modelObj);
            form.form.currentMode = 'editing';

        } else if (currentMode == 'editing') {
            var modelObj = form.form.getValuesByModel(form.model);
            var model = store.getById(modelObj["id"]);
            var isChange = false;
            for (var key in modelObj) {
                if (model.get(key) != modelObj[key]) {
                    model.set(key, modelObj[key]);
                    isChange = true;
                }
            }
            if (!isChange) {
                newWindow.close();
            }
        }
        store.sync({
            callback: function (data, mata) {
                newWindow.close();
            },
            success: function (data, mata, succ) {
                var alertWindow = Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                Ext.Function.defer(function () {
                    alertWindow.close();
                }, 1000);
                newWindow.close();
            },
            failure: function (data, mata, succ) {
                var str = data.operations[0].error;
                Ext.Msg.alert(i18n.getKey('prompt'), str.statusText + '!');
                paymentStore.load({
                    params: {websiteId: '' + getQueryString("websiteId") + ''}
                });
                newWindow.close();
            }
        });
    }

    var cancel = function (button) {
        newWindow.child("form").form.resetForm();
        newWindow.close();
    }

}