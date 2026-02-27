Ext.define('CGP.mailsubscribe.view.MailHistory', {
    extend: 'Ext.window.Window',
    modal: true,
    bodyStyle: 'padding:true',
    width: 800,
    height: 600,

    initComponent: function () {
        var me = this;


        me.title = i18n.getKey('mailHistory');

        me.items = {
            xtype: 'grid',
            itemId: 'grid',
            store: Ext.create('CGP.mailsubscribe.store.MailHistory'),
            columns: [
                {
                    dataIndex: 'id',
                    text: i18n.getKey('operate'),
                    xtype: 'componentcolumn',
                    renderer: function (v, m, r) {
                        return {
                            xtype: 'button',
                            text: i18n.getKey('content'),
                            handler: function () {
                                Ext.Ajax.request({
                                    method: 'GET',
                                    url: adminPath + 'api/mailSubscribes/pushHistories/'+v + '/content',
                                    headers: {
                                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                    },
                                    success: function (r, o) {
                                        var resp = Ext.JSON.decode(r.responseText);
                                        if (resp.success) {
                                            var content = resp.data.content;
                                            Ext.create('Ext.window.Window', {
                                                title: i18n.getKey('mailPreview'),
                                                html: content,
                                                maximized: true,
                                                maximizable: true,
                                                width: 600,
                                                height: 400
                                            }).show();

                                        } else {
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                                        }
                                    },
                                    failure: function (resp, o) {
                                        var response = Ext.JSON.decode(resp.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                    }
                                });
                            }
                        }
                    }
                },
                {
                    dataIndex: 'subject',
                    text: i18n.getKey('subject'),
                    width: 150
                },
                {
                    dataIndex: 'pushDate',
                    xtype: 'datecolumn',
                    width: 150,
                    text: i18n.getKey('pushDate'),
                    renderer: function (value, metadata) {
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.style = 'color:gray';
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    }
                },
                {
                    dataIndex: 'website',
                    text: i18n.getKey('website'),
                    width: 150
                },
                {
                    dataIndex: 'operator',
                    text: 'operator',
                    width: 150
                }
            ]
        };

        me.callParent(arguments);

        me.grid = me.getComponent('grid');
    }
})