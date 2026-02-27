Ext.Loader.syncRequire([
    'CGP.contactInformations.model.Model',
    'CGP.contactInformations.store.Store',
    'CGP.contactInformations.contorller.Contorller',
])
Ext.define('CGP.contactInformations.view.ContactInforMations', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.contactinformations',
    // readOnly: true,
    initComponent: function () {
        var me = this,
            data = {},
            status = '1',
            isDisabled = (status !== '1'),
            id = JSGetQueryString('id'),
            url = adminPath + 'api/business/contactInformations/' + id;
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            if (responseText.success) {
                data = responseText.data;
                status = data.status;
                isDisabled = (status !== '1');
            }
        });
        me.defaults = {
            xtype: 'displayfield',
            width: 350,
            margin: '5 10 0 20',
        };
        me.items = [
            {
                name: 'discuss',
                itemId: 'discuss',
                readOnly: true,
                fieldStyle: {
                    border: 0
                },
                diySetValue: function (data) {
                    var me = this;
                    data && me.setValue(JSAutoWordWrapStr(JSCreateFont('auto', true, data)))
                },
                fieldLabel: i18n.getKey('discuss') + ' / ' + i18n.getKey('suggest'),
            },
            {
                name: '_id',
                itemId: '_id',
                hidden: true,
                fieldLabel: i18n.getKey('id'),
            },
            {
                name: 'fullName',
                itemId: 'fullName',
                fieldLabel: i18n.getKey('partnername'),
            },
            {
                name: 'email',
                itemId: 'email',
                fieldLabel: i18n.getKey('email'),
            },
            {
                name: 'phoneNumber',
                itemId: 'phoneNumber',
                fieldLabel: i18n.getKey('telephone'),
            },
            {
                fieldLabel: i18n.getKey('customer') + i18n.getKey('onlineStore') + i18n.getKey('address'),
                name: 'websiteUrl',
                itemId: 'websiteUrl',
                width: 500,
                diySetValue: function (data) {
                    var me = this;
                    me.url = data;
                    me.setValue('<a href="#" style="text-decoration:none">' + data + '</a>')
                },
                listeners: {
                    render: function (display) {
                        var me = this;
                        display.getEl().on("click", function () {
                            window.open(me.url, '_blank');
                        });
                    }
                }
            },
            {
                name: 'status',
                itemId: 'status',
                readOnly: true,
                fieldStyle: {
                    border: 0
                },
                fieldLabel: i18n.getKey('status'),
                renderer: function (value) {
                    var map = {
                        0: JSCreateFont('grey', true, '已作废'),
                        1: JSCreateFont('red', true, '待处理'),
                        2: JSCreateFont('green', true, '已处理'),
                    }
                    return map[value];
                }
            },
            {
                xtype: 'textarea',
                name: 'remark',
                itemId: 'remark',
                height: 60,
                allowBlank: false,
                readOnly: isDisabled,
                fieldStyle: isDisabled ? 'background-color: silver' : 'none',
                fieldLabel: i18n.getKey('remark'),
            }
        ];
        me.bbar = [
            {
                xypte: 'button',
                iconCls: 'icon_agree',
                disabled: isDisabled,
                text: i18n.getKey('完成处理'),
                handler: function (btn) {
                    me.editContactInforMationState('2', id, btn);
                }
            },
            {
                xypte: 'button',
                iconCls: 'icon_cancel',
                disabled: isDisabled,
                text: i18n.getKey('作废'),
                handler: function (btn) {
                    me.editContactInforMationState('0', id, btn);
                }
            }
        ]
        me.callParent();
        me.setValue(data);
    },
    editContactInforMationState: function (state, id, btn) {
        var toolbar = btn.ownerCt,
            me = toolbar.ownerCt,
            url = adminPath + 'api/business/contactInformations/' + id,
            statusComp = me.getComponent('status'),
            remark = me.getComponent('remark'),
            jsonData = {"status": state, "remark": remark.getValue()};

        me.isValid() && JSAjaxRequest(url, 'PUT', false, jsonData, 'saveSuccess', function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            statusComp.setValue(state);
            toolbar.setDisabled(true);
            remark.setReadOnly(true);
            remark.setFieldStyle('background-color: silver');
            console.log(responseText)
        });
    }
})