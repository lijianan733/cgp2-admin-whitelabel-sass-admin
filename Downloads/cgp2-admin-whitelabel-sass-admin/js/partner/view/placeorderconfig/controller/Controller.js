/**
 * Created by nan on 2018/6/13.
 */
Ext.define('CGP.partner.view.placeorderconfig.controller.Controller', {
    saveFormValue: function (form) {
        var myMask = new Ext.LoadMask(form, {
            msg: "加载中..."
        });
        var formValue = form.getValues();
        for (var i in formValue) {
            form.record.set(i, formValue[i]);
        }
        var salerDeliveryAddress = form.record.get('salerDeliveryAddress');
        salerDeliveryAddress['clazz'] = 'com.qpp.cgp.domain.partner.config.SalerDeliveryAddress';
        form.record.set('salerDeliveryAddress', salerDeliveryAddress);
        if (form.record.dirty == true) {
            myMask.show();
            form.record.save({
                success: function (batch, options) {
                    myMask.hide();
                },
                failure: function (batch, options) {
                    myMask.hide();

                    Ext.Msg.alert(i18n.getKey('prompt'), options.error.statusText);
                },
                callback: function (records, opt, success) {
                    if (success) {
                        myMask.hide();
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'));
                    }
                }
            })
        } else {
            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'));
        }
    },
    loadRecord: function (form) {
        var myMask = new Ext.LoadMask(form, {
            msg: "加载中..."
        });
        myMask.show();
        CGP.partner.model.SalerConfigModel.getProxy();
        CGP.partner.model.SalerConfigModel.proxy.url = adminPath + 'api/partners/' + form.partnerId + '/salerConfig';
        CGP.partner.model.SalerConfigModel.load('', {
            scope: this,
            failure: function (record, operation) {
                myMask.hide();
            },
            success: function (record, operation) {
                form.record = record;
                myMask.hide();
                for (var i = 0; i < form.items.items.length; i++) {
                    var value = record.get(form.items.items[i].getName());
                    form.items.items[i].setValue(value);
                }
            },
            callback: function (record, operation) {
                myMask.hide();
            }
        });
    },
    saveDeliveryAddressFormValue: function (form) {
        var myMask = new Ext.LoadMask(form, {
            msg: "加载中..."
        });
        var formValue = form.getValues();
        var salerDeliveryAddress = form.record.get('salerDeliveryAddress');
        for (var i in formValue) {
            salerDeliveryAddress[i] = formValue[i];
        }
        salerDeliveryAddress['clazz'] = 'com.qpp.cgp.domain.partner.config.SalerDeliveryAddress';
        form.record.set('salerDeliveryAddress', salerDeliveryAddress);
        myMask.show();
        form.record.save({
            callback: function (records, opt, success) {
                if (success) {
                    myMask.hide();
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'));
                }
            }
        })
    },
    loadDeliveryAddress: function (form) {
        var myMask = new Ext.LoadMask(form, {
            msg: "加载中..."
        });
        myMask.show();
        CGP.partner.model.SalerConfigModel.getProxy();
        CGP.partner.model.SalerConfigModel.proxy.url = adminPath + 'api/partners/' + form.partnerId + '/salerConfig';
        CGP.partner.model.SalerConfigModel.load('', {
            scope: this,
            failure: function (record, operation) {
                myMask.hide();

            },
            success: function (record, operation) {
                form.record = record;
                myMask.hide();
                var salerDeliveryAddress = form.record.get('salerDeliveryAddress');
                for (var i = 0; i < form.items.items.length; i++) {
                    var value = salerDeliveryAddress[form.items.items[i].getName()];
                    form.items.items[i].setValue(value);
                }
            },
            callback: function (record, operation) {
                myMask.hide();

            }
        });
    }

})