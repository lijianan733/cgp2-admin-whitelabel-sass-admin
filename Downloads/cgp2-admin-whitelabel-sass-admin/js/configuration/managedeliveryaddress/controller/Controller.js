/**
 * Created by nan on 2018/4/18.
 */
Ext.define('CGP.configuration.managedeliveryaddress.controller.Controller', {
    dealFormValue: function (form) {
        var data = form.getValues();
        var returnData = {};
        returnData.name = data.name;
        delete data.name;
        returnData.websiteId = data.websiteId;
        delete data.websiteId;
        if (data['_id']) {
            returnData._id = data._id;
            delete data._id;
        }
        returnData.clazz = 'com.qpp.cgp.domain.product.config.delivery.ReceiveAddress';
        returnData.address = data;
        return returnData;
    },
    editOrCreateAddress: function (formValue, mask, createOrEdit) {
        var method = createOrEdit == 'edit' ? 'PUT' : 'POST';
        var url = method == 'POST' ? adminPath + 'api/receiveAddresses' : adminPath + 'api/receiveAddresses/' + formValue._id
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: formValue,
            success: function (response) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                    mask.hide();
                    var editFormPanel = window.parent.Ext.getCmp('manageDeliveryAddressTab').items.items[1];
                    var managePanel = window.parent.Ext.getCmp('manageDeliveryAddressTab').items.items[0];
                    managePanel.store.load();
                    editFormPanel.close();
                });
            }
        })
    }

})