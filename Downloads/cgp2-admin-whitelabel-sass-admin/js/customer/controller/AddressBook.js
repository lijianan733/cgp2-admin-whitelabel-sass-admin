Ext.define("CGP.customer.controller.AddressBook", {
    mixins: ["Ext.ux.util.ResourceInit"],
    requires: ['CGP.customer.model.Customer'],

    addressBooks: null, //存放整个地址薄window对象
    editWindow: null, //编辑window


    constructor: function () {
        var me = this;

        this.callParent(arguments);
    },

    //创建一个addressBookWindow窗体
    //传入的是 用户记录
    createAddressBooks: function (record) {
        var me = this;
        var userId = record.get("id");
        var email = record.get('email');
        var defaultAddressBookId = record.get("defaultAddressBookId");
        JSOpen({
            id: 'AddressBook',
            url: path + 'partials/customer/AddressBooks.html?recordId=' + userId + '&defaultAddressBookId=' + defaultAddressBookId,
            title: i18n.getKey('AddressBook'),
            refresh: true
        })
    },

    //地址薄编辑
    openEditWindow: function (currentMode, record, userrecord, store) {
        var me = this;
        me.editWindow = Ext.create('CGP.customer.view.addressbook.Edit', {
            currentMode: currentMode,
            controller: me,
            record: record,
            store: store,
            userrecord: userrecord
        });
        me.editWindow.refresh(currentMode, record);
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

    //编辑地址window的save方法
    saveModel: function (currentModel, userrecord, store, record) {
        var me = this;
        var form = me.editWindow.form;
        var addressBookId = record?.getId() || null;
        if (form.isValid()) {
            var data = form.getValue();
            data.userId = userrecord.getId();
            data.id = addressBookId;
            var url = adminPath + 'api/addressBooks';
            var method = 'POST';
            if (currentModel == 'editing') {
                url = adminPath + 'api/addressBooks/' + data.id;
                method = 'PUT';
            } else if (currentModel == 'creating') {

            }
            JSAjaxRequest(url, method, true, data, null, function (require, success, response) {
                if (success) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.success) {
                        var addressBookId = responseText.data.id;
                        if (store.getCount() == 0) {
                            Ext.getCmp('AddressBooksGrid').defaultAddress = addressBookId;
                            me.setDefaultAddress(addressBookId, userrecord);
                            me.editWindow.close();
                            store.load();
                        } else {
                            me.editWindow.close();
                            store.load();
                        }
                    }
                }
            }, true);
        }
    }
    //排序方法
//	sortOrderForm : function (respData,listWindow){
//		var index = respData.index;
//		var showForm = listWindow.getComponent(respData.get('id'));
//		listWindow.insert(index,showForm);
//	}

});