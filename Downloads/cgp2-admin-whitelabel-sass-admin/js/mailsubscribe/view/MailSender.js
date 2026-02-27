Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
])
Ext.define('CGP.mailsubscribe.view.MailSender', {
    extend: 'Ext.window.Window',

    bodyStyle: 'padding:10px',
    modal: true,

    initComponent: function () {
        var me = this;


        me.title = i18n.getKey('sendMail');

        me.items = {
            xtype: 'form',
            itemId: 'form',
            border: false,
            items: [
                {
                    xtype: 'websitecombo',
                    name: 'websiteId',
                    allowBlank: false,
                    msgTarget: 'side',
                    itemId: 'websiteId',
                    hidden: true,
                },
                {
                    id: 'typeSearchField',
                    name: 'category',
                    xtype: 'combo',
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['category', "value"],
                        data: [
                            {
                                category: i18n.getKey('header'), value: 'header'
                            },
                            {
                                category: i18n.getKey('footer'), value: 'footer'
                            }
                        ]
                    }),
                    fieldLabel: i18n.getKey('category'),
                    itemId: 'category',
                    displayField: 'category',
                    allowBlank: false,
                    msgTarget: 'side',
                    valueField: 'value',
                    queryMode: 'local'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('subject'),
                    allowBlank: false,
                    msgTarget: 'side',
                    name: 'subject',
                    itemId: 'subject'
                },
                {
                    xtype: 'filefield',
                    fieldLabel: i18n.getKey('content'),
                    allowBlank: false,
                    msgTarget: 'side',
                    validator: function (value) {
                        var arr = value.split('.');
                        if (arr[arr.length - 1] != 'txt') {
                            return '文件不合法！(请选择.txt文件！)';
                        } else {
                            return true;
                        }
                    },
                    name: 'files',//file改为files
                    listeners: {
                        change: function () {
                            var contentField = me.form.getComponent('content');
                            contentField.setValue();
                            var file = this.fileInputEl.dom.files[0];
                            var that = this;
                            var reader = new FileReader();
                            reader.addEventListener('load', function (evt) {
                                if (that.activeErrors == null) {
                                    contentField.setValue(evt.target.result);
                                }
                            });

                            reader.readAsText(file, 'UTF-8');
                        }
                    }
                },
                {
                    xtype: 'htmleditor',
                    name: 'content',
                    itemId: 'content'
                }
            ]
        };

        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('preview'),
            iconCls: 'icon_preview',
            handler: function () {
                if (!me.form.isValid()) {
                    return;
                }
                Ext.create('Ext.window.Window', {
                    title: i18n.getKey('mailPreview'),
                    html: '<span style="font-size:16px">' + i18n.getKey('subject') + ':' + me.form.getComponent('subject').getValue() + '</span>'
                        + '<br><br><br>'
                        + me.form.getComponent('content').getValue(),
                    autoScroll: true,
                    modal: true,
                    width: 800,
                    height: 500
                }).show();
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('ok'),
            iconCls: 'icon_agree',
            handler: function () {
                if (!me.form.isValid()) {
                    return;
                }
                var websiteId = me.form.getComponent('websiteId').getValue();
                var subject = me.form.getComponent('subject').getValue();
                var content = me.form.getComponent('content').getValue();
                var lm = me.setLoading(true);
                Ext.Ajax.request({
                    method: 'POST',
                    url: adminPath + 'api/admin/mailSubscribe/mail',
                    jsonData: {
                        websiteId: websiteId,
                        subject: subject,
                        content: content
                    },
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (r, o) {
                        lm.hide();
                        var resp = Ext.JSON.decode(r.responseText);
                        if (resp.success) {
                            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('sendMailSuccess'));
                            me.close();
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                        }
                    },
                    failure: function (resp, o) {
                        lm.hide();
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });

            }
        }, {
            xtype: 'button',
            iconCls: 'icon_cancel',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }];

        me.callParent(arguments);
        me.form = me.getComponent('form');
    }

})