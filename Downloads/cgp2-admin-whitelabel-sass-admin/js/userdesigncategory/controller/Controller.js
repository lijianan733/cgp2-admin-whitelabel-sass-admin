/**
 * Created by nan on 2018/5/21.
 */
Ext.define('CGP.userdesigncategory.controller.Controller', {
    showPicture: function (record) {
        var url = imageServer + record.get('name');
        var originalWidth = record.get('width');
        var originalHeight = record.get('height');
        var changeRatio = 0.2;//变化的比例
        var win = Ext.create('Ext.window.Window', {
            title: record.get('displayName') + '(宽：' + record.get('width') + '，高：' + record.get('height') + ')',
            height: 600,
            width: 800,
            modal: true,
            layout: 'fit',
            autoScroll: true,
            maximizable: true,
            items: [
                {
                    xtype: 'panel',
                    layout: 'fit',
                    autoScroll: true,
                    tbar: [
                        {
                            text: '扩大',
                            width: 80,
                            handler: function (view) {
                                var panel = view.ownerCt.ownerCt;
                                var img = panel.el.dom.getElementsByTagName('img')[0];
                                img.style.width = parseInt(img.width) * (1 + changeRatio) + 'px';
                                img.style.height = parseInt(img.height) * (1 + changeRatio) + 'px';
                                win.setTitle(record.get('displayName') + '(宽：' + img.width + '，高：' + img.height + ')');
                            }
                        },
                        {
                            text: '缩小',
                            width: 80,
                            handler: function (view) {
                                var panel = view.ownerCt.ownerCt;
                                var img = panel.el.dom.getElementsByTagName('img')[0];
                                img.style.width = parseInt(img.width) * (1 - changeRatio) + 'px';
                                img.style.height = parseInt(img.height) * (1 - changeRatio) + 'px';
                                win.setTitle(record.get('displayName') + '(宽：' + img.width + '，高：' + img.height + ')');
                            }
                        },
                        {
                            text: '原始尺寸',
                            width: 80,
                            handler: function (view) {
                                var panel = view.ownerCt.ownerCt;
                                var img = panel.el.dom.getElementsByTagName('img')[0];
                                img.style.width = originalWidth + 'px';
                                img.style.height = originalHeight + 'px';
                                win.setTitle(record.get('displayName') + '(宽：' + img.width + '，高：' + img.height + ')');
                            }
                        }
                    ],
                    html: '<img src=' + url + '>'
                }
            ]
        });
        win.show();
    },
    categoryEventMenu: function (view, record, e) {
        var me = this;
        var treePanel = view.panel;
        e.stopEvent();
        var menu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: i18n.getKey('add') + i18n.getKey('category'),
                    itemId: 'add',
                    handler: function () {
                        me.addNewCategory(treePanel);
                    }
                },
                {
                    text: i18n.getKey('delete'),
                    disabledCls: 'menu-item-display-none',
                    itemId: 'delete',
                    handler: function () {
                        var id = record.get('_id');
                        me.deleteCategory(treePanel, id)
                    }
                },
                {
                    text: i18n.getKey('modify') + i18n.getKey('category') + i18n.getKey('name'),
                    disabledCls: 'menu-item-display-none',
                    itemId: 'modifyName',
                    handler: function () {
                        var id = record.get('_id');
                        me.modifyCatagoryName(treePanel, id)
                    }
                }
            ]
        });
        menu.showAt(e.getXY());
    },
    modifyCatagoryName: function (treePanel, recordId) {
        var me = this;
        var myMask = new Ext.LoadMask(treePanel, {
            msg: "加载中..."
        });
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('update') + i18n.getKey('category'),
            height: 150,
            width: 250,
            resizable: false,
            modal: true,
            layout: 'fit',
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'form',
                border: false,
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'
                },
                items: [
                    {
                        xtype: 'textfield',
                        allowBlank: false,
                        itemId: 'newCategory'
                    }
                ],
                bbar: {
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            text: i18n.getKey('ok'),
                            iconCls: 'icon_agree',
                            handler: function (view) {
                                var form = view.ownerCt.ownerCt;
                                if (form.isValid()) {
                                    myMask.show();
                                    var newCategory = form.getComponent('newCategory').getValue();
                                    Ext.Ajax.request({
                                        url: adminPath + 'api/userDesignCategory/update',
                                        method: 'POST',
                                        headers: {
                                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                        },
                                        jsonData: {
                                            "id": recordId,
                                            "clazz": "com.qpp.cgp.domain.core.MongoDomain.UserDesignCategory",
                                            "name": newCategory
                                        },
                                        success: function (response) {
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            if (responseMessage.success) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('edit') + i18n.getKey('success'));
                                                treePanel.store.load();
                                                myMask.hide();
                                                win.close();
                                            } else {
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                                myMask.hide();
                                            }
                                        },
                                        failure: function (response) {
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                            myMask.hide();
                                        }
                                    });
                                }
                            }
                        },
                        {
                            text: i18n.getKey('cancel'),
                            iconCls: 'icon_cancel',
                            handler: function (view) {
                                win.close();
                            }
                        }
                    ]
                }
            }
        });
        win.show();
    },
    deleteCategory: function (treePanel, id) {
        var me = this;
        var myMask = new Ext.LoadMask(treePanel, {
            msg: "加载中..."
        });
        Ext.Ajax.request({
            url: adminPath + 'api/userDesignCategory/deleteById?Id=' + id,
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                    treePanel.store.load();
                    myMask.hide();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    myMask.hide();

                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                myMask.hide();

            }
        })
    },
    addNewCategory: function (treePanel) {
        var me = this;
        var myMask = new Ext.LoadMask(treePanel, {
            msg: "加载中..."
        });
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('add') + i18n.getKey('category'),
            height: 150,
            width: 250,
            resizable: false,
            modal: true,
            layout: 'fit',
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'form',
                border: false,
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'
                },
                items: [
                    {
                        xtype: 'textfield',
                        allowBlank: false,
                        itemId: 'newCategory'
                    }
                ],
                bbar: {
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            text: i18n.getKey('ok'),
                            iconCls: 'icon_agree',
                            handler: function (view) {
                                var form = view.ownerCt.ownerCt;
                                if (form.isValid()) {
                                    myMask.show();
                                    var newCategory = form.getComponent('newCategory').getValue();
                                    Ext.Ajax.request({
                                        url: adminPath + 'api/userDesignCategory/save',
                                        method: 'POST',
                                        headers: {
                                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                        },
                                        jsonData: {
                                            "name": newCategory
                                        },
                                        success: function (response) {
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            if (responseMessage.success) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('add') + i18n.getKey('success'));
                                                treePanel.store.load();
                                                myMask.hide();
                                                win.close();
                                            } else {
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                                myMask.hide();
                                            }
                                        },
                                        failure: function (response) {
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                            myMask.hide();
                                        }
                                    });
                                }
                            }
                        },
                        {
                            text: i18n.getKey('cancel'),
                            iconCls: 'icon_cancel',
                            handler: function (view) {
                                win.close();
                            }
                        }
                    ]
                }
            }
        });
        win.show();
    }
})