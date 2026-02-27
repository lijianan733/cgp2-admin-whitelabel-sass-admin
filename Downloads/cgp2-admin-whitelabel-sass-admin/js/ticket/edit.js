Ext.onReady(function () {


    Ext.Loader.syncRequire('CGP.ticket.model.Ticket');
    var status = [
        {name: 'new', color: 'red'},
        {name: 'replied', color: 'green'},
        {name: 'closed', color: 'gray'}
    ];
    var controller = Ext.create('CGP.ticket.controller.Edit');
    window.controller = controller;
    var page = Ext.widget({
        block: 'ticket',
        xtype: 'uxeditpage',
        enablePermissionChecker:false,
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.ticket.model.Ticket',
            remoteCfg: false,
            columnCount: 1,
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('reply'),
                    itemId: 'reply',
                    action:'AUTH_TICKET_REPLY',
                    iconCls: 'icon_reply',
                    handler: function () {
                        Ext.create('CGP.ticket.view.Reply', {
                            ticketId: Number.parseInt(page.form.getComponent('id').getValue()),
                            receiver: page.form.getComponent('email').getValue()
                        }).show();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('close'),
                    itemId: 'close',
                    iconCls: 'icon_close',
                    handler: function () {
                        Ext.create('CGP.ticket.view.Close', {
                            ticketId: Number.parseInt(page.form.getComponent('id').getValue())
                        }).show();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('grid'),
                    iconCls: 'icon_grid',
                    handler: function () {
                        JSOpen({
                            id: 'ticketpage',
                            url: path + 'partials/ticket/main.html'
                        });
                    }
                }
            ],
            items: [
                {
                    name: 'id',
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('ticketId'),
                    itemId: 'id'
                },
                {
                    name: 'status',
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    renderer: function (value) {
                        if (!value) {
                            return "";
                        }
                        var color = status[Number.parseInt(value) - 1].color;
                        return '<span style="color:' + color + '">' + i18n.getKey(status[Number.parseInt(value) - 1].name) + '<span>';
                    }
                },
                {
                    name: 'createdDate',
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('date'),
                    itemId: 'createdDate',
                    setValue: function (value) {
                        var me = this;
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        me.setRawValue(me.valueToRaw(value));
                        return me.mixins.field.setValue.call(me, value);
                    }
                },
                {
                    name: 'name',
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'email',
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('email'),
                    itemId: 'email'
                },
                {
                    name: 'ip',
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('ip'),
                    itemId: 'ip'
                },
                {
                    name: 'phone',
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('phone'),
                    itemId: 'phone'
                },
                {
                    name: 'category',
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('category'),
                    itemId: 'category'
                },
                {
                    name: 'subject',
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('subject'),
                    itemId: 'subject'
                },
                {
                    name: 'message',
                    xtype: 'textarea',
                    fieldLabel: i18n.getKey('message'),
                    disabled: true,
                    cols: 30,
                    rows:10,
                    disabledCls: 'custom-disabled',
                    itemId: 'message'
                },
                {
                    name: 'histories',
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey('histories'),
                    itemId: 'histories',
                    width:800,
                    setValue: function (value) {
                        var me = this;
                        if (!Ext.isArray(value)) {
                            value = '';
                        } else {
                            var hs = [];
                            Ext.Array.each(value, function (history,index) {
                                var operator = history.operator;
                                var createdDate = Ext.Date.format(new Date(history.createdDate), 'Y/m/d H:i');
                                var comment = history.comment;
                                var str = '<li>';
                                if (history.status == 2) {
                                    var subject = history.subject;
                                    var content = history.content;
                                    str += '<span style="color:red">' + operator + '</span>于<span style="color:red">' + createdDate + '</span>回复了ticket[<a href="javascript:controller.showMailContent(\'' + subject + '\',\'' + content + '\')">查看邮件内容</a>]';
                                } else if (history.status == 3) {
                                    var comment = history.comment;
                                    str += '<span style="color:red">' + operator + '</span>于<span style="color:red">' + createdDate + '</span>关闭了ticket[<span style="color:red">' + comment + '</span>]';
                                }
                                hs.push(str + '</li>');
                            });

                            value = '<ol>' + hs.join('<br>') + '</ol>';
                        }
                        me.setRawValue(me.valueToRaw(value));
                        return me.mixins.field.setValue.call(me, value);
                    }

                }
            ],
            listeners: {
                afterload: function (model) {
                    var status = model.get('status');
                    var tbar = this.getDockedItems('toolbar[dock="top"]')[0];
                    if (status == 3) {
                        tbar.getComponent('reply').setVisible(false);
                        tbar.getComponent('close').setVisible(false);
                    }
                }
            }
        }

    });
});