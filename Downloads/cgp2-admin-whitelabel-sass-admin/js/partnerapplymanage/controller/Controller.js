/**
 * Created by nan on 2018/1/30.
 */
Ext.define('CGP.partnerapplymanage.controller.Controller', {
    confirmpartnerApplys: function (id, verifyResult, remark, gridStore, auditWindow) {
        var modifiedBy = Ext.JSON.decode(Ext.util.Cookies.get("user")).email;
        Ext.Ajax.request({
            url: adminPath + 'api/partners/application/' + id + '/verify',
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: {
                remark: remark,
                verifyResult: verifyResult
            },
            success: function (response, opts) {
                var res = Ext.decode(response.responseText);
                if (res.success) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.MessageBox.alert(i18n.getKey('prompt'), '审核结束');
                    gridStore.reload();
                    auditWindow.close();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response, opts) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }

        });
    },
    showApplicantInfo: function (value, webStore) {
        var webName = (webStore.findRecord('id', value.websiteId)).get('name');
        var items = [
            {
                xtype: 'displayfield',
                value: value.id ? value.id : '未成为合作伙伴',
                margin: '10 0 0 0',
                fieldLabel: i18n.getKey('id')
            },
            {
                xtype: 'displayfield',
                value: value.name,
                fieldLabel: i18n.getKey('name')
            },
            {
                xtype: 'displayfield',
                value: value.gender,
                fieldLabel: i18n.getKey('gender')
            },
            {
                xtype: 'displayfield',
                value: value.telephone,
                fieldLabel: i18n.getKey('telephone')
            },
            {
                xtype: 'displayfield',
                value: webName,
                fieldLabel: i18n.getKey('belongWebsite')
            },
            {
                xtype: 'displayfield',
                value: value.contactor,
                fieldLabel: i18n.getKey('contactor')
            },
            {
                xtype: 'displayfield',
                value: value.cooperationType,
                fieldLabel: i18n.getKey('cooperationType')
            },
            {
                xtype: 'displayfield',
                value: '<img style="vertical-align: middle;width:50px; height:50px" src="' + imageServer + 'de9f0cc174e64499bee148d9fb0ea974.jpg' + '" />',
                fieldLabel: i18n.getKey('logo')
            }
        ];
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('check') + i18n.getKey('applicant') + i18n.getKey('info'),
            height: 400,
            width: 400,
            layout: 'fit',
            items: {
                xtype: 'form',
                border: false,
                items: items,
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                defaults: {
                    width: 250
                }
            }
        }).show();
    }
})